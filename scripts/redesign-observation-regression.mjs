import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { buildObservationReport, parseEvent, readEvents } from "./redesign-observation-report.mjs";

const when = "2026-11-06T06:00:00.000Z";
const raw = (name, properties, timestamp = when) => ({ name, properties, timestamp });
const event = (name, properties, timestamp) => parseEvent(JSON.stringify(raw(name, properties, timestamp)));
const browser = { eventOrigin: "browser" };
const server = { eventOrigin: "server" };
const home = event("homepage_view", { ...browser, device: "mobile", requestId: "private-reference", email: "private@example.test" });
assert.deepEqual(parseEvent(`2026-11-06 info [BioAxis event] ${JSON.stringify(raw(home.name, home.properties))}`), home);
assert.deepEqual(parseEvent(JSON.stringify({ message: `[BioAxis event] ${JSON.stringify(raw(home.name, home.properties))}` })), home);
for (const invalid of ["not json", "[BioAxis event] persistence failed 500", "null", JSON.stringify(raw("unknown", {})), JSON.stringify(raw("homepage_view", [])), JSON.stringify(raw("homepage_view", {}, "bad date"))]) assert.equal(parseEvent(invalid), null);

const events = [
  home,
  event("homepage_view", { ...browser, requestId: "private-reference" }),
  event("homepage_view", { ...browser, requestId: "other-reference" }),
  event("cta_click", { ...browser, requestId: "private-reference", cta: "homepage_navigation", destination: "/products/cell-culture", firstAction: true, msSinceHomeInteractive: 850 }),
  event("cta_click", { ...browser, requestId: "other-reference", cta: "homepage_navigation", destination: 123 }),
  event("rfq_start", { ...browser, device: "mobile", requestId: "private-reference" }),
  event("rfq_start", { ...browser, requestId: "second-request" }),
  event("rfq_success", { ...browser, requestId: "second-request" }),
  event("rfq_queue_write_succeeded", { ...server, requestId: "private-reference" }),
  event("rfq_queue_write_succeeded", { ...server, requestId: "private-reference", replayed: true }),
  event("rfq_queue_write_succeeded", { ...server, requestId: "unlinked-request" }),
  event("rfq_queue_write_succeeded", { ...browser, requestId: "second-request" }),
  event("rfq_validation_failed", { ...browser, requestId: "second-request" }),
  event("web_vital", { ...browser, metric: "LCP", metricId: "measurement-a", device: "mobile", value: 1000 }),
  event("web_vital", { ...browser, metric: "LCP", metricId: "measurement-a", device: "mobile", value: 2000 }, "2026-11-06T06:00:01.000Z"),
  ...[3000, 4000, 5000].map((value) => event("web_vital", { ...browser, metric: "LCP", metricId: `measurement-${value}`, device: "mobile", value })),
  event("web_vital", { ...browser, metric: "LCP", device: "mobile", value: 6000 }),
  event("web_vital", { ...browser, metric: "INP", metricId: "invalid", device: "desktop", value: -1 }),
  event("homepage_view", { ...browser, requestId: "qa-request", qa: true }),
  event("homepage_view", { ...browser, requestId: "bot-request", bot: true }),
  event("homepage_view", { requestId: "legacy-unknown-origin" })
];
const report = buildObservationReport(events);
assert.equal(report.homepage.observedRequestSessions, 2);
assert.equal(report.homepage.productEntryRate, 0.5);
assert.equal(report.homepage.firstActionMedianMs, 850);
assert.equal(report.rfq.startedReferences, 2);
assert.equal(report.rfq.serverStoredReferences, 2);
assert.equal(report.rfq.matchedStoredReferences, 1);
assert.equal(report.rfq.completionRate, 0.5);
assert.equal(report.rfq.storedWithoutObservedStart, 1);
assert.equal(report.rfq.referenceErrorRate, 0.5);
assert.equal(report.byDevice.find((row) => row.device === "mobile").completionRate, 1);
assert.equal(report.byDevice.find((row) => row.device === "unknown").completionRate, 0);
assert.equal(report.counts.vitalsWithoutMeasurementId, 1);
assert.equal(report.counts.excludedEvents, 3);
assert.deepEqual(report.webVitals.find((row) => row.device === "mobile" && row.metric === "LCP"), { device: "mobile", metric: "LCP", samples: 4, p75: 4000, unit: "ms", target: 2500, observedWithinTarget: false });
assert.equal(report.webVitals.find((row) => row.metric === "CLS").p75, null);
assert.equal(buildObservationReport([]).rfq.completionRate, null);
assert.equal(buildObservationReport(events, { to: Date.parse(when) }).window, null);
assert.doesNotMatch(JSON.stringify(report), /private-reference|private@example|second-request|measurement-a/);

const directory = mkdtempSync(path.join(tmpdir(), "bioaxis-observation-"));
try {
  const filename = path.join(directory, "events.jsonl");
  writeFileSync(filename, `${JSON.stringify(raw(home.name, home.properties))}\nnot an event\n`);
  const loaded = await readEvents(filename);
  assert.equal(loaded.events.length, 1);
  assert.equal(loaded.skippedLines, 1);
  const cli = spawnSync(process.execPath, ["scripts/redesign-observation-report.mjs", filename], { encoding: "utf8" });
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(JSON.parse(cli.stdout).skippedLines, 1);
  assert.doesNotMatch(cli.stdout, /private-reference|private@example/);
  const invalid = spawnSync(process.execPath, ["scripts/redesign-observation-report.mjs", filename, "--from", "invalid"], { encoding: "utf8" });
  assert.equal(invalid.status, 1);
} finally { rmSync(directory, { recursive: true, force: true }); }

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const originalLoad = Module._load;
const savedExtensions = [".ts", ".tsx"].map((key) => [key, require.extensions[key]]);
const originalInfo = console.info;
const savedKey = process.env.POSTHOG_API_KEY;
const savedBrowserGlobals = ["window", "navigator", "location", "innerWidth"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
const logs = [];
const tracked = [];
let reporter;
const compile = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, "utf8"), { fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename);
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
Module._load = function load(name, parent, isMain) {
  if (name === "next/web-vitals") return { useReportWebVitals: (callback) => { reporter = callback; } };
  if (name === "@/lib/trackBioAxisEvent") return { trackBioAxisEvent: (name, properties) => tracked.push({ name, properties }) };
  if (name === "./alertBioAxisFailure") return { alertBioAxisFailure: async () => {} };
  if (name.startsWith("@/")) name = path.resolve("src", `${name.slice(2)}.ts`);
  return originalLoad.call(this, name, parent, isMain);
};
console.info = (...args) => logs.push(JSON.parse(args[1]));
delete process.env.POSTHOG_API_KEY;
Object.defineProperties(globalThis, {
  window: { configurable: true, value: { innerWidth: 390, location: { pathname: "/request-quote" }, sessionStorage: { getItem: () => "test-reference" } } },
  navigator: { configurable: true, value: { webdriver: false, doNotTrack: "0" } },
  location: { configurable: true, value: { pathname: "/" } },
  innerWidth: { configurable: true, value: 390 }
});
try {
  const { recordBioAxisEvent } = require("../src/lib/server/recordBioAxisEvent.ts");
  await recordBioAxisEvent("rfq_queue_write_succeeded", { requestId: "server-test", eventOrigin: "browser" }, "/api/rfq");
  assert.equal(logs.pop().properties.eventOrigin, "server");
  const { POST } = require("../src/app/api/analytics/route.ts");
  for (const name of ["rfq_delivery", "rfq_queue_write_succeeded", "rfq_queue_write_failed"]) {
    const response = await POST(new Request("https://bioaxis.local/api/analytics", { method: "POST", body: JSON.stringify({ name, properties: { eventOrigin: "server" } }) }));
    assert.equal(response.status, 400);
  }
  assert.equal(logs.length, 0);
  const response = await POST(new Request("https://bioaxis.local/api/analytics", { method: "POST", body: JSON.stringify({ name: "web_vital", path: "/", properties: { eventOrigin: "server", metric: "LCP", metricId: "real-measurement", value: 1000 } }) }));
  assert.equal(response.status, 200);
  const emitted = logs.pop();
  assert.equal(emitted.properties.eventOrigin, "browser");
  assert.equal(emitted.properties.metricId, "real-measurement");
  const { PerformanceMetrics } = require("../src/components/layout/PerformanceMetrics.tsx");
  PerformanceMetrics();
  reporter({ name: "LCP", id: "measurement-id", value: 1250, rating: "good" });
  assert.equal(tracked[0].properties.metricId, "measurement-id");
  navigator.doNotTrack = "1";
  reporter({ name: "LCP", id: "excluded-id", value: 1250 });
  assert.equal(tracked.length, 1);
  navigator.doNotTrack = "0";
  navigator.webdriver = true;
  reporter({ name: "LCP", id: "automated-id", value: 1250 });
  assert.equal(tracked.length, 1);
  navigator.webdriver = false;
  let beacon;
  navigator.sendBeacon = (url, body) => { beacon = { url, body }; return true; };
  const { trackBioAxisEvent } = require("../src/lib/trackBioAxisEvent.ts");
  trackBioAxisEvent("rfq_start");
  assert.equal(beacon.url, "/api/analytics");
  const posted = JSON.parse(await beacon.body.text());
  assert.equal(posted.properties.device, "mobile");
  assert.equal(posted.properties.requestId, "test-reference");
  assert.equal(posted.path, "/request-quote");
} finally {
  Module._load = originalLoad;
  for (const [key, value] of savedExtensions) { if (value) require.extensions[key] = value; else delete require.extensions[key]; }
  console.info = originalInfo;
  for (const [key, descriptor] of savedBrowserGlobals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  if (savedKey === undefined) delete process.env.POSTHOG_API_KEY; else process.env.POSTHOG_API_KEY = savedKey;
}
console.log("Redesign observation regression passed: privacy-safe aggregates, measurement dedupe/p75, cohort intersections, QA/legacy exclusions, CLI exports, server-event isolation and real Web Vitals reporter IDs; offline fixtures only.");
