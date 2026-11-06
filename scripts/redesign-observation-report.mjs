import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

const observedNames = new Set(["homepage_view", "cta_click", "web_vital", "rfq_start", "rfq_success", "rfq_error", "rfq_validation_failed", "turnstile_failure", "rfq_queue_write_succeeded", "rfq_queue_write_failed"]);
const targets = { LCP: { value: 2500, unit: "ms" }, INP: { value: 200, unit: "ms" }, CLS: { value: 0.1, unit: "score" } };

export function parseEvent(line) {
  try {
    const marker = "[BioAxis event] ";
    function decode(value) {
      try { return JSON.parse(value); } catch {
        const start = value.indexOf(marker);
        return start >= 0 ? JSON.parse(value.slice(start + marker.length)) : null;
      }
    }
    let event = decode(line);
    if (typeof event?.message === "string") {
      event = decode(event.message);
    }
    if (!observedNames.has(event?.name) || !event.properties || Array.isArray(event.properties) || typeof event.properties !== "object") return null;
    const timestamp = Date.parse(event.timestamp);
    return Number.isFinite(timestamp) ? { ...event, timestamp } : null;
  } catch { return null; }
}

function percentile(values, fraction) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * fraction) - 1];
}

function ratio(numerator, denominator) {
  return denominator ? Math.round(numerator / denominator * 10000) / 10000 : null;
}

export function buildObservationReport(events, { from = -Infinity, to = Infinity } = {}) {
  const home = new Set();
  const productEntries = new Set();
  const starts = new Set();
  const homeDevices = new Map();
  const startDevices = new Map();
  const serverSuccess = new Set();
  const failures = new Set();
  const firstActions = new Map();
  const vitals = new Map();
  const timestamps = [];
  let excluded = 0;
  let unidentifiedVitals = 0;
  for (const event of events) {
    const p = event?.properties;
    if (!p || !Number.isFinite(event.timestamp) || event.timestamp < from || event.timestamp >= to || p.qa === true || p.synthetic === true || p.bot === true || !["browser", "server"].includes(p.eventOrigin)) {
      excluded += 1;
      continue;
    }
    timestamps.push(event.timestamp);
    const id = typeof p.requestId === "string" && p.requestId.trim() ? p.requestId : null;
    if (p.eventOrigin === "browser") {
      const device = ["mobile", "desktop"].includes(p.device) ? p.device : "unknown";
      if (id && event.name === "homepage_view") { home.add(id); if (!homeDevices.has(id)) homeDevices.set(id, device); }
      if (id && event.name === "cta_click" && p.cta === "homepage_navigation") {
        if (typeof p.destination === "string" && (p.destination === "/products" || p.destination.startsWith("/products/"))) productEntries.add(id);
        if (p.firstAction === true && Number.isFinite(p.msSinceHomeInteractive) && p.msSinceHomeInteractive >= 0) {
          const previous = firstActions.get(id);
          if (!previous || event.timestamp < previous.timestamp) firstActions.set(id, { value: p.msSinceHomeInteractive, timestamp: event.timestamp });
        }
      }
      if (id && event.name === "rfq_start") { starts.add(id); if (!startDevices.has(id)) startDevices.set(id, device); }
      if (event.name === "web_vital" && Object.hasOwn(targets, p.metric) && Number.isFinite(p.value) && p.value >= 0 && ["desktop", "mobile"].includes(p.device)) {
        if (typeof p.metricId !== "string" || !p.metricId.trim()) { unidentifiedVitals += 1; continue; }
        // INP and CLS may be reported repeatedly; retain the latest measurement, not each update as a new visitor.
        const key = JSON.stringify([p.metricId, p.metric]);
        const previous = vitals.get(key);
        if (!previous || previous.timestamp <= event.timestamp) vitals.set(key, { metric: p.metric, value: p.value, device: p.device, timestamp: event.timestamp });
      }
    }
    if (id && p.eventOrigin === "server" && event.name === "rfq_queue_write_succeeded") serverSuccess.add(id);
    if (id && ["rfq_error", "rfq_validation_failed", "turnstile_failure", "rfq_queue_write_failed"].includes(event.name)) failures.add(id);
  }
  const linkedSuccess = [...starts].filter((id) => serverSuccess.has(id)).length;
  const linkedErrors = [...starts].filter((id) => failures.has(id)).length;
  const homeToProducts = [...home].filter((id) => productEntries.has(id)).length;
  const actionTimes = [...firstActions].filter(([id]) => home.has(id)).map(([, action]) => action.value);
  const byDevice = ["desktop", "mobile", "unknown"].map((device) => {
    const homeIds = [...home].filter((id) => homeDevices.get(id) === device);
    const startIds = [...starts].filter((id) => startDevices.get(id) === device);
    const stored = startIds.filter((id) => serverSuccess.has(id)).length;
    const entries = homeIds.filter((id) => productEntries.has(id)).length;
    return { device, homepageSessions: homeIds.length, sessionsEnteringProducts: entries, productEntryRate: ratio(entries, homeIds.length), startedReferences: startIds.length, matchedStoredReferences: stored, completionRate: ratio(stored, startIds.length) };
  });
  const webVitals = ["desktop", "mobile"].flatMap((device) => Object.entries(targets).map(([metric, target]) => {
    const values = [...vitals.values()].filter((value) => value.device === device && value.metric === metric).map((value) => value.value);
    const p75 = percentile(values, 0.75);
    return { device, metric, samples: values.length, p75, unit: target.unit, target: target.value, observedWithinTarget: p75 === null ? null : p75 <= target.value };
  }));
  return {
    scope: "Aggregate exported events only; not proof of complete collection, human traffic, conversion lift or acceptance-gate attainment.",
    window: timestamps.length ? { first: new Date(timestamps.reduce((min, time) => Math.min(min, time), Infinity)).toISOString(), last: new Date(timestamps.reduce((max, time) => Math.max(max, time), -Infinity)).toISOString() } : null,
    counts: { includedEvents: timestamps.length, excludedEvents: excluded, vitalsWithoutMeasurementId: unidentifiedVitals },
    homepage: { observedRequestSessions: home.size, sessionsEnteringProducts: homeToProducts, productEntryRate: ratio(homeToProducts, home.size), firstActionSamples: actionTimes.length, firstActionMedianMs: percentile(actionTimes, 0.5), firstActionP75Ms: percentile(actionTimes, 0.75) },
    rfq: { startedReferences: starts.size, serverStoredReferences: serverSuccess.size, matchedStoredReferences: linkedSuccess, completionRate: ratio(linkedSuccess, starts.size), storedWithoutObservedStart: serverSuccess.size - linkedSuccess, startedReferencesWithErrors: linkedErrors, referenceErrorRate: ratio(linkedErrors, starts.size) },
    byDevice,
    webVitals,
    limitations: [
      "No request IDs, emails, product inputs, raw URLs or log messages are included in this output.",
      "Client rfq_success events never count as stored requests; only server-tagged queue-write confirmations do.",
      "Request references are proxies for sessions, not people; reference rotation and missing exports can split cohorts.",
      "Device cohorts use the first observed home/start event for a reference. Historical missing device values remain unknown. Acquisition-source cohorts are not available in this export schema.",
      "First action is measured from interactive homepage mount, not network navigation start.",
      "Event timestamps do not prove continuous collection. Check export completeness and comparable device/source cohorts independently.",
      "Web Vital p75 uses nearest rank and the latest update per measurement ID. Review sample size and the real traffic window before judging G10.",
      "Automated or QA traffic without an explicit qa/synthetic/bot flag cannot be identified by this report. Legacy events without origin or metric ID are excluded where needed."
    ]
  };
}

export async function readEvents(filename) {
  const events = [];
  let skippedLines = 0;
  const lines = createInterface({ input: createReadStream(filename, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of lines) {
    if (!line.trim()) continue;
    const event = parseEvent(line);
    if (event) events.push(event); else skippedLines += 1;
  }
  return { events, skippedLines };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { values, positionals } = parseArgs({ options: { from: { type: "string" }, to: { type: "string" } }, allowPositionals: true });
    if (positionals.length !== 1) throw new Error("usage");
    const from = values.from ? Date.parse(values.from) : -Infinity;
    const to = values.to ? Date.parse(values.to) : Infinity;
    if (Number.isNaN(from) || Number.isNaN(to) || from >= to) throw new Error("window");
    const { events, skippedLines } = await readEvents(positionals[0]);
    console.log(JSON.stringify({ ...buildObservationReport(events, { from, to }), skippedLines }, null, 2));
  } catch {
    console.error("Could not read observation export. Use: npm run report:redesign -- /private/path/events.jsonl [--from ISO-date --to ISO-date]. Keep exports outside Git.");
    process.exitCode = 1;
  }
}
