import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { closeSync, mkdirSync, mkdtempSync, openSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
if (args.length === 1 && args[0] === "--help") {
  console.log("Usage: npm run verify:local\nVerifies the staged Git tree using an isolated loopback production build. Reports: artifacts/local-preflight/.");
  process.exit(0);
}
if (args.length) throw new Error("Local preflight does not accept a target URL or other arguments.");
if (process.platform === "win32") throw new Error("Local preflight requires macOS or Linux for child process cleanup.");

const names = ["snapshot", "lint", "build", "typecheck", "offline", "preview", "smoke", "buyer-session", "rfq-payload", "responsive", "accessibility", "index"];
const report = {
  schemaVersion: 1,
  startedAt: new Date().toISOString(),
  status: "running",
  tree: null,
  checks: Object.fromEntries(names.map((name) => [name, { status: "not-run" }]))
};
const artifacts = join(root, "artifacts", "local-preflight");
mkdirSync(artifacts, { recursive: true });
const runDir = mkdtempSync(join(artifacts, "run-"));
const candidate = join(runDir, "candidate");
const archive = join(runDir, "candidate.tar");
const reportFile = join(runDir, "report.json");
const controller = new AbortController();
const { signal } = controller;
const handlers = Object.fromEntries(["SIGINT", "SIGTERM"].map((name) => [name, () => {
  process.exitCode = name === "SIGINT" ? 130 : 143;
  controller.abort(new Error(`Interrupted by ${name}.`));
}]));
for (const [name, handler] of Object.entries(handlers)) process.on(name, handler);

// Start from an allowlist so real service credentials and QA target overrides cannot be inherited.
const env = Object.fromEntries([
  "HOME", "LANG", "LC_ALL", "XDG_CACHE_HOME", "PLAYWRIGHT_BROWSERS_PATH", "PLAYWRIGHT_CHROMIUM_EXECUTABLE"
].filter((key) => process.env[key] !== undefined).map((key) => [key, process.env[key]]));
if (env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) env.PLAYWRIGHT_CHROMIUM_EXECUTABLE = resolve(env.PLAYWRIGHT_CHROMIUM_EXECUTABLE);
Object.assign(env, {
  PATH: [dirname(process.execPath), process.env.PATH].filter(Boolean).join(delimiter),
  NEXT_TELEMETRY_DISABLED: "1",
  GIT_CEILING_DIRECTORIES: runDir,
  NO_COLOR: "1",
  FORCE_COLOR: "0",
  SMOKE_DURABLE_WRITE: "0"
});

function saveReport() {
  writeFileSync(`${reportFile}.tmp`, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  renameSync(`${reportFile}.tmp`, reportFile);
}

function git(...arguments_) {
  return execFileSync("git", arguments_, { cwd: root, encoding: "utf8", timeout: 30_000 }).trimEnd();
}

async function check(name, run) {
  signal.throwIfAborted();
  const started = Date.now();
  const result = report.checks[name];
  result.status = "running";
  saveReport();
  console.log(`Running ${name}`);
  try {
    await run();
    signal.throwIfAborted();
    result.status = "passed";
  } catch (error) {
    result.status = signal.aborted ? "interrupted" : "failed";
    result.error = error.message;
    throw error;
  } finally {
    result.durationMs = Date.now() - started;
    saveReport();
    console.log(`${name}: ${result.status}`);
  }
}

function launch(name, command, arguments_, extraEnv = {}) {
  const log = join(runDir, `${name}.log`);
  const fd = openSync(log, "wx", 0o600);
  try {
    const child = spawn(command, arguments_, { cwd: candidate, env: { ...env, ...extraEnv }, detached: true, stdio: ["ignore", fd, fd] });
    const done = new Promise((complete) => {
      child.once("error", (error) => complete({ error }));
      child.once("close", (code, stoppedBy) => complete({ code, stoppedBy }));
    });
    return { child, done, log };
  } finally {
    closeSync(fd);
  }
}

function signalGroup(child, name) {
  if (!child.pid) return;
  try {
    process.kill(-child.pid, name);
  } catch (error) {
    if (error.code !== "ESRCH") throw error;
  }
}

async function stop(worker) {
  signalGroup(worker.child, "SIGTERM");
  const finished = await Promise.race([worker.done.then(() => true), delay(4000, false, { ref: false })]);
  if (!finished) {
    signalGroup(worker.child, "SIGKILL");
    await worker.done;
  }
}

async function waitForExit(done, timeoutMs) {
  const limit = AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]);
  limit.throwIfAborted();
  let onAbort;
  const interrupted = new Promise((_, reject) => {
    onAbort = () => reject(limit.reason);
    limit.addEventListener("abort", onAbort, { once: true });
  });
  try {
    return await Promise.race([done, interrupted]);
  } finally {
    limit.removeEventListener("abort", onAbort);
  }
}

async function command(name, bin, arguments_, extraEnv, timeoutMs = 240_000) {
  const worker = launch(name, bin, arguments_, extraEnv);
  try {
    const { code, stoppedBy, error } = await waitForExit(worker.done, timeoutMs);
    if (error) throw error;
    if (code !== 0) throw new Error(`${name} exited with ${stoppedBy ?? code}; see ${name}.log.`);
  } finally {
    await stop(worker);
  }
}

function npm(name, script, arguments_ = [], extraEnv, timeoutMs) {
  const cli = process.env.npm_execpath;
  const invocation = ["run", script, ...(arguments_.length ? ["--", ...arguments_] : [])];
  return command(name, cli ? process.execPath : "npm", cli ? [cli, ...invocation] : invocation, extraEnv, timeoutMs);
}

async function previewUrl(worker) {
  const deadline = AbortSignal.any([signal, AbortSignal.timeout(45_000)]);
  // Next chooses the loopback port atomically; use only the URL printed by this child.
  for (;;) {
    deadline.throwIfAborted();
    const log = readFileSync(worker.log, "utf8");
    const url = log.match(/Local:\s+(http:\/\/127\.0\.0\.1:\d+)/)?.[1];
    if (url && /Ready in /.test(log)) return url;
    const exited = await Promise.race([worker.done.then(() => true), delay(200, false, { signal: deadline })]);
    if (exited) throw new Error("The preview exited before startup; see preview.log.");
  }
}

let preview;
console.log(`Local preflight report: ${reportFile}`);
try {
  await check("snapshot", () => {
    git("diff", "--cached", "--check");
    const tree = git("write-tree");
    const paths = git("ls-tree", "-rz", "--name-only", tree).split("\0").filter(Boolean);
    assert.ok(!paths.some((path) => path.split("/").some((part) =>
      part === ".vercel" || (part !== ".env.example" && /^\.env(?:\.|$)/.test(part))
    )), "Staged tree contains environment or deployment configuration. Nothing was built.");
    report.tree = tree;
    mkdirSync(candidate);
    git("archive", "--format=tar", `--output=${archive}`, tree);
    execFileSync("tar", ["-xf", archive, "-C", candidate], { timeout: 30_000 });
    rmSync(archive);
    symlinkSync(join(root, "node_modules"), join(candidate, "node_modules"), "dir");
  });
  await check("lint", () => npm("lint", "lint"));
  await check("build", () => npm("build", "build", [], {}, 480_000));
  await check("typecheck", () => command("typecheck", process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit", "--incremental", "false"]));
  await check("offline", () => npm("offline", "test"));
  await check("preview", async () => {
    preview = launch("preview", process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "0"]);
    report.previewUrl = await previewUrl(preview);
    const get = (path) => fetch(new URL(path, report.previewUrl), { redirect: "error", signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]) });
    const health = await get("/api/rfq");
    assert.equal(health.status, 503, "The local preview must not have a connected RFQ service.");
    assert.deepEqual((await health.json()).services, { durableQueue: "missing", antiSpam: "missing", internalLookup: "missing" });
    const verification = await get("/api/turnstile/config");
    assert.equal(verification.status, 200);
    assert.equal((await verification.json()).enabled, false, "The local preview must not contact Turnstile.");
  });
  const url = report.previewUrl;
  await check("smoke", () => npm("smoke", "smoke", [], { SMOKE_BASE_URL: url }));
  await check("buyer-session", () => npm("buyer-session", "test:buyer-session", [url], { BUYER_SESSION_QA_DIR: join(runDir, "buyer-session") }));
  await check("rfq-payload", () => npm("rfq-payload", "test:rfq-payload", [url]));
  await check("responsive", () => npm("responsive", "test:redesign", [url], { REDESIGN_QA_DIR: join(runDir, "responsive") }));
  await check("accessibility", () => npm("accessibility", "test:a11y-checklist", [url], { RFQ_VERIFICATION_SCREENSHOT_DIR: join(runDir, "accessibility") }));
  await check("index", () => assert.equal(git("write-tree"), report.tree, "The index changed during preflight. Stage the intended changes and rerun."));
  report.status = "passed";
} catch (error) {
  report.status = signal.aborted ? "interrupted" : "failed";
  console.error(error.message);
  process.exitCode ||= 1;
} finally {
  try {
    if (preview) await stop(preview);
    rmSync(candidate, { recursive: true, force: true });
    rmSync(archive, { force: true });
    report.cleanup = "passed";
  } catch (error) {
    report.status = "failed";
    report.cleanup = "failed";
    console.error(`Preflight cleanup failed: ${error.message}`);
    process.exitCode ||= 1;
  } finally {
    if (signal.aborted && report.status === "passed") report.status = "interrupted";
    report.finishedAt = new Date().toISOString();
    saveReport();
    for (const [name, handler] of Object.entries(handlers)) process.off(name, handler);
  }
}
console.log(`Preflight ${report.status}${report.tree ? ` for ${report.tree}` : ""}. Reports and logs: ${runDir}`);
