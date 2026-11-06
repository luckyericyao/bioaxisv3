import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const sha = "a1".repeat(20);
const otherSha = "b2".repeat(20);
const sha256 = "c3".repeat(32);
const privateValue = "qa-only-private-value-never-publish";

function compile(filename) {
  return ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true
    }
  }).outputText;
}

const configSource = compile("next.config.ts");
const routeSource = compile("src/app/api/rfq/route.ts");
const readinessSource = readFileSync("scripts/deployment-readiness.mjs", "utf8");

function evaluateConfig(environment, gitResult = otherSha) {
  const localModule = { exports: {} };
  const gitCalls = [];
  const execFileSync = (...args) => {
    gitCalls.push(args);
    if (gitResult instanceof Error) throw gitResult;
    return gitResult;
  };
  vm.runInNewContext(configSource, {
    module: localModule,
    exports: localModule.exports,
    process: { env: { SECRET_TOKEN: privateValue, ...environment } },
    require: (name) => {
      assert.equal(name, "node:child_process", "Config must only execute the mocked Git lookup");
      return { execFileSync };
    }
  }, { filename: "next.config.ts" });
  const config = localModule.exports.default;
  assert.deepEqual(Object.keys(config.env), ["BIOAXIS_RELEASE_SHA"], "Only the public release identifier may be injected");
  assert.doesNotMatch(JSON.stringify(config), new RegExp(privateValue));
  for (const [command, args, options] of gitCalls) {
    assert.equal(command, "git");
    assert.deepEqual(Array.from(args), ["rev-parse", "--verify", "HEAD"]);
    assert.equal(options.encoding, "utf8");
    assert.deepEqual(Array.from(options.stdio), ["ignore", "pipe", "ignore"]);
  }
  return { release: config.env.BIOAXIS_RELEASE_SHA, gitCalls };
}

for (const value of [sha, sha.toUpperCase(), sha256]) {
  const { release, gitCalls } = evaluateConfig({ VERCEL_GIT_COMMIT_SHA: value });
  assert.equal(release, value.toLowerCase());
  assert.equal(gitCalls.length, 0, "A valid platform SHA takes priority over local Git");
}
for (const value of [undefined, "", "abc1234", privateValue, "a".repeat(41), "a".repeat(63)]) {
  const environment = value === undefined ? {} : { VERCEL_GIT_COMMIT_SHA: value };
  const { release, gitCalls } = evaluateConfig(environment, `${otherSha.toUpperCase()}\n`);
  assert.equal(release, otherSha);
  assert.equal(gitCalls.length, 1, "Missing or invalid platform SHA must fall back to Git");
}
assert.equal(evaluateConfig({}, `${sha256}\n`).release, sha256);
for (const gitResult of ["", privateValue, "a".repeat(41), new Error(privateValue)]) {
  assert.equal(evaluateConfig({}, gitResult).release, "unknown", "Unavailable or invalid Git SHA must fail closed");
}

async function evaluateGet({ release = sha, includeRelease = true, queueConfigured = true, queueReachable = true, antiSpam = true, internalLookup = true } = {}) {
  const localModule = { exports: {} };
  let queueChecks = 0;
  const environment = {
    SECRET_TOKEN: privateValue,
    ...(includeRelease ? { BIOAXIS_RELEASE_SHA: release } : {}),
    ...(antiSpam ? { TURNSTILE_SECRET_KEY: privateValue, TURNSTILE_SITE_KEY: privateValue } : {}),
    ...(internalLookup ? { BIOAXIS_INTERNAL_API_KEY: privateValue } : {})
  };
  vm.runInNewContext(routeSource, {
    module: localModule,
    exports: localModule.exports,
    process: { env: environment },
    require: (name) => {
      if (name === "@/lib/sourcingNeed") return { hasSourcingNeed: () => false, sourcingNeedError: "Missing need" };
      if (name === "next/server") return { NextResponse: { json: (body, init) => Response.json(body, init) } };
      if (name === "node:crypto") return { randomUUID: () => assert.fail("GET must not generate an RFQ") };
      if (name === "@/lib/server/rfqQueue") {
        return {
          rfqQueueConfigured: () => queueConfigured,
          checkRfqQueueConnection: async () => { queueChecks += 1; return queueReachable; },
          enqueueRfq: () => assert.fail("Readiness must not write RFQs"),
          RfqIdempotencyConflictError: class extends Error {}
        };
      }
      if (name === "@/lib/server/alertBioAxisFailure") return { alertBioAxisFailure: () => assert.fail("GET must not send alerts") };
      if (name === "@/lib/server/recordBioAxisEvent") return { recordBioAxisEvent: () => assert.fail("GET must not write events") };
      if (name === "@/lib/server/readLimitedJsonBody") return {};
      assert.fail(`Unexpected GET dependency: ${name}`);
    }
  }, { filename: "src/app/api/rfq/route.ts" });
  const response = await localModule.exports.GET();
  const body = await response.json();
  assert.equal(queueChecks, queueConfigured ? 1 : 0);
  assert.match(response.headers.get("Cache-Control"), /no-store/);
  assert.deepEqual(Object.keys(body).sort(), ["ok", "ready", "release", "services"]);
  assert.equal(body.release, includeRelease ? release || "unknown" : "unknown");
  assert.doesNotMatch(JSON.stringify(body), new RegExp(privateValue));
  return { response, body };
}

for (const scenario of [
  { expectedStatus: 200 },
  { queueReachable: false, expectedStatus: 503 },
  { queueConfigured: false, expectedStatus: 503 },
  { antiSpam: false, expectedStatus: 503 },
  { internalLookup: false, expectedStatus: 503 },
  { release: "", expectedStatus: 200 },
  { includeRelease: false, expectedStatus: 200 }
]) {
  const { response, body } = await evaluateGet(scenario);
  assert.equal(response.status, scenario.expectedStatus);
  assert.equal(body.ready, scenario.expectedStatus === 200);
  assert.equal(body.ok, body.ready);
}

async function evaluateReadiness({ expected, release = sha, includeRelease = true, ready = true } = {}) {
  const stdout = [];
  const stderr = [];
  const requests = [];
  let exitCode = 0;
  const exited = new Error("mock-process-exit");
  const context = {
    URL,
    process: {
      argv: ["node", "scripts/deployment-readiness.mjs", "https://release-regression.example.test"],
      env: expected === undefined ? {} : { EXPECTED_RELEASE_SHA: expected },
      exit: (code) => { exitCode = code; throw exited; }
    },
    console: {
      log: (...args) => stdout.push(args.join(" ")),
      error: (...args) => stderr.push(args.join(" "))
    },
    fetch: async (input) => {
      const url = new URL(input);
      assert.equal(url.origin, "https://release-regression.example.test", "Readiness must use the requested target");
      requests.push(url.pathname);
      if (url.pathname === "/api/rfq") {
        return Response.json({
          ok: ready,
          ready,
          ...(includeRelease ? { release } : {}),
          services: { durableQueue: "reachable", antiSpam: "configured", internalLookup: "configured" }
        }, { status: ready ? 200 : 503 });
      }
      assert.ok(["/", "/products", "/request-quote", "/equivalent-finder", "/ready-supply", "/trust-center"].includes(url.pathname));
      return new Response('<main data-business-facts-status="incomplete"></main>', {
        headers: Object.fromEntries([
          "content-security-policy", "x-content-type-options", "x-frame-options", "referrer-policy", "strict-transport-security"
        ].map((name) => [name, "configured"]))
      });
    }
  };
  try {
    await vm.runInNewContext(`(async () => {\n${readinessSource}\n})()`, context, { filename: "scripts/deployment-readiness.mjs" });
  } catch (error) {
    if (error !== exited) throw error;
  }
  const output = [...stdout, ...stderr].join("\n");
  assert.doesNotMatch(output, new RegExp(privateValue), "Readiness must not print arbitrary input values");
  assert.match(output, /- release: (?:[0-9a-f]{40}|[0-9a-f]{64}|unknown)(?:\n|$)/);
  return { code: exitCode, output, requests };
}

for (const scenario of [
  { name: "matching SHA", expected: sha },
  { name: "case-insensitive expected SHA", expected: sha.toUpperCase() },
  { name: "case-insensitive remote SHA", expected: sha, release: sha.toUpperCase() },
  { name: "SHA-256", expected: sha256, release: sha256 },
  { name: "optional SHA check" },
  { name: "legacy endpoint", includeRelease: false },
  { name: "unknown optional release", release: "unknown" },
  { name: "invalid optional release", release: privateValue }
]) {
  const result = await evaluateReadiness(scenario);
  assert.equal(result.code, 0, `${scenario.name}: ${result.output}`);
  assert.ok(result.requests.includes("/api/rfq"));
  const normalized = scenario.includeRelease === false || ["unknown", privateValue].includes(scenario.release)
    ? "unknown" : (scenario.release ?? sha).toLowerCase();
  assert.ok(result.output.includes(`- release: ${normalized}`), scenario.name);
}

for (const scenario of [
  { name: "mismatched release", expected: otherSha },
  { name: "missing required release", expected: sha, includeRelease: false },
  { name: "unknown required release", expected: sha, release: "unknown" },
  { name: "invalid required release", expected: sha, release: privateValue },
  { name: "non-string required release", expected: sha, release: { secret: privateValue } },
  { name: "unready RFQ", expected: sha, ready: false }
]) {
  const result = await evaluateReadiness(scenario);
  assert.equal(result.code, 1, `${scenario.name}: ${result.output}`);
  assert.ok(result.requests.includes("/api/rfq"));
}

for (const expected of ["", "abc1234", privateValue, "a".repeat(41), "a".repeat(63)]) {
  const result = await evaluateReadiness({ expected });
  assert.equal(result.code, 1, "Invalid expected SHA must fail");
  assert.equal(result.requests.length, 0, "Invalid expected SHA must fail before fetching");
}

console.log("Release/readiness regression passed: build SHA selection, RFQ health, optional exact SHA gate, and safe output (offline).");
