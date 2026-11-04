import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const originalLoad = Module._load;
const originalFetch = globalThis.fetch;
const blobs = new Map();
const immutableBytes = new Map();
const writes = [];
const listCalls = [];
const hiddenReads = new Set();
const omittedListings = new Set();
const qaKey = "qa-only-local-queue-test";
let writeGate;
let failAfterWrite;
let failReadAfterWrite;
let failNextRead;
let failStorage = false;

function storeBlob(pathname, body) {
  assert.equal(blobs.has(pathname), false, "fixture and workflow records must stay immutable");
  const bytes = String(body);
  blobs.set(pathname, bytes);
  immutableBytes.set(pathname, bytes);
}

function synchronizeWrites(prefix) {
  let release;
  let reject;
  const ready = new Promise((resolve, fail) => { release = resolve; reject = fail; });
  const timer = setTimeout(() => reject(new Error("Concurrent writers did not reach the same revision slot.")), 5000);
  writeGate = { prefix, ready, release, timer, arrivals: 0 };
}

globalThis.fetch = async () => { throw new Error("Network access is forbidden in the RFQ queue regression."); };
Module._load = function load(request, parent, isMain) {
  if (request.startsWith("@/")) {
    return originalLoad.call(this, path.resolve("src", `${request.slice(2)}.ts`), parent, isMain);
  }
  if (request === "@vercel/blob") {
    return {
      get: async (pathname, options) => {
        assert.equal(options.access, "private");
        if (pathname.startsWith("rfq/workflow/")) assert.equal(options.useCache, false);
        if (failStorage) throw new Error("private-storage-error-secret");
        if (pathname === failNextRead) {
          failNextRead = undefined;
          throw new Error("private-readback-error-secret");
        }
        const stored = hiddenReads.has(pathname) ? undefined : blobs.get(pathname);
        return stored === undefined ? null : { statusCode: 200, stream: new Blob([stored]).stream() };
      },
      list: async ({ prefix = "", limit = 1000, cursor } = {}) => {
        if (failStorage) throw new Error("private-storage-error-secret");
        listCalls.push({ prefix, cursor });
        // Reverse pathname order so state derivation cannot depend on listing order.
        const all = [...blobs.keys()]
          .filter((pathname) => pathname.startsWith(prefix) && !omittedListings.has(pathname)).sort().reverse();
        const start = cursor ? Number(cursor) : 0;
        const end = start + limit;
        const hasMore = end < all.length;
        return {
          blobs: all.slice(start, end).map((pathname) => ({ pathname })),
          cursor: hasMore ? String(end) : undefined,
          hasMore
        };
      },
      put: async (pathname, body, options) => {
        assert.equal(options.access, "private");
        assert.equal(options.allowOverwrite, false);
        assert.equal(options.addRandomSuffix, false);
        assert.equal(options.contentType, "application/json");
        writes.push({ pathname, body: String(body) });
        if (pathname.startsWith("rfq/workflow/")) {
          const event = JSON.parse(String(body));
          assert.equal(event.schemaVersion, 2);
          assert.ok(["reviewing", "needs-info", "responded", "closed"].includes(event.status), "stored status must be safe for a7eb824");
          for (const field of ["requestId", "operationId", "assignedOwner", "needsInfo", "responseSummary", "recordedAt", "canonicalStatus", "supplierConfirmation"]) {
            assert.equal(typeof event[field], "string", `stored event requires ${field}`);
          }
        }
        if (failStorage) throw new Error("private-storage-error-secret");
        const gate = writeGate;
        if (gate && pathname.startsWith(gate.prefix)) {
          gate.arrivals += 1;
          if (gate.arrivals === 2) {
            clearTimeout(gate.timer);
            writeGate = undefined;
            gate.release();
          }
          await gate.ready;
        }
        if (blobs.has(pathname)) throw new Error("Blob already exists");
        storeBlob(pathname, body);
        if (failReadAfterWrite && pathname.startsWith(failReadAfterWrite)) {
          failReadAfterWrite = undefined;
          failNextRead = pathname;
        }
        if (failAfterWrite && pathname.startsWith(failAfterWrite)) {
          failAfterWrite = undefined;
          throw new Error("Write succeeded but its response was lost.");
        }
        return { pathname, etag: "test-etag" };
      }
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};

require.extensions[".ts"] = (module, filename) => {
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    },
    fileName: filename
  }).outputText;
  module._compile(compiled, filename);
};

process.env.BLOB_READ_WRITE_TOKEN = "test-only";
process.env.BIOAXIS_INTERNAL_API_KEY = qaKey;
const { NextRequest } = require("next/server");
const { enqueueRfq, listQueuedRfqs, readQueuedRfq, RfqIdempotencyConflictError } = require(path.resolve("src/lib/server/rfqQueue.ts"));
const { appendRfqWorkflowEvent, canTransitionRfqWorkflow, getRfqWorkflow, RfqWorkflowUpdateError } = require(path.resolve("src/lib/server/rfqWorkflow.ts"));
const { GET, PATCH } = require(path.resolve("src/app/api/rfq/internal/route.ts"));

async function internal(method, query = "", payload, key = qaKey) {
  const request = new NextRequest(`http://rfq-regression.invalid/api/rfq/internal?${query}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) })
  });
  const response = await (method === "PATCH" ? PATCH(request) : GET(request));
  const body = await response.json();
  return { response, body };
}

function action(requestId, operationId, status, details = {}) {
  return { requestId, operationId, status, assignedOwner: "QA operator", needsInfo: "", responseSummary: "", supplierConfirmation: "", ...details };
}

async function patch(input, expectedStatus = 200) {
  const { requestId, ...payload } = input;
  const before = writes.length;
  const result = await internal("PATCH", `requestId=${requestId}`, payload);
  assert.equal(result.response.status, expectedStatus, JSON.stringify(result.body));
  if (expectedStatus >= 400) assert.equal(writes.length, before, "rejected requests must not write workflow events");
  return result.body;
}

function seedEvent(requestId, operationId, status, details = {}) {
  const event = {
    schemaVersion: 1, requestId, operationId, status, assignedOwner: "QA legacy operator",
    needsInfo: "", responseSummary: "", recordedAt: "2026-01-01T00:00:00.000Z", ...details
  };
  const pathname = event.schemaVersion === 2
    ? `rfq/workflow/by-id/${requestId}/revisions/${String(event.revision).padStart(12, "0")}.json`
    : `rfq/workflow/by-id/${requestId}/${operationId}.json`;
  storeBlob(pathname, JSON.stringify(event));
  return { event, pathname };
}

// Freeze a7eb824's raw status reader and transition lookup independently of the
// current decoder. The baseline ignores schemaVersion and sorts only by time.
const legacyTransitions = {
  queued: ["reviewing", "needs-info"],
  reviewing: ["needs-info", "responded", "closed"],
  "needs-info": ["reviewing", "responded", "closed"],
  responded: ["reviewing", "closed"],
  closed: []
};

function readLegacyWorkflow(requestId) {
  const events = [...blobs.keys()].filter((pathname) => pathname.startsWith(`rfq/workflow/by-id/${requestId}/`))
    .sort().reverse().map((pathname) => JSON.parse(blobs.get(pathname)))
    .sort((left, right) => left.recordedAt.localeCompare(right.recordedAt));
  return { status: events.at(-1)?.status ?? "queued", events };
}

function assertLegacyStatus(requestId, expectedStatus, nextStatus, allowed = true) {
  const workflow = readLegacyWorkflow(requestId);
  assert.equal(workflow.status, expectedStatus);
  // Keep the original unguarded includes call so unknown new states reproduce P1.
  assert.equal(legacyTransitions[workflow.status].includes(nextStatus), allowed);
}

const referenceId = "BIOAXIS-QA-IDEMPOTENCY";
const originalRequest = {
  email: "first@example.test", organization: "QA fixture", productList: "Immutable synthetic request",
  productContext: { productName: "QA plate", productSegment: "QA segment", searchQuery: "96 well", sourceUrl: "/products?query=96" },
  sourcingListItems: [{ productTitle: "QA plate", quantity: "1 QA sample" }]
};
const firstWrite = await enqueueRfq(referenceId, originalRequest);
const replay = await enqueueRfq(referenceId, originalRequest);
await assert.rejects(() => enqueueRfq(referenceId, { ...originalRequest, email: "replacement@example.test" }), RfqIdempotencyConflictError);
assert.equal(firstWrite.replayed, false);
assert.equal(replay.replayed, true);
assert.deepEqual(replay.record, firstWrite.record);
assert.deepEqual((await readQueuedRfq(referenceId))?.request, originalRequest);

await enqueueRfq("BIOAXIS-QUEUE-PAGE-002", { email: "second@example.test" });
await enqueueRfq("BIOAXIS-QUEUE-PAGE-003", { email: "third@example.test" });
const firstQueuePage = await listQueuedRfqs({ limit: 2 });
const secondQueuePage = await listQueuedRfqs({ limit: 2, cursor: firstQueuePage.cursor });
assert.equal(firstQueuePage.records.length, 2);
assert.equal(firstQueuePage.hasMore, true);
assert.equal(secondQueuePage.hasMore, false);
assert.equal(new Set([...firstQueuePage.records, ...secondQueuePage.records].map((record) => record.referenceId)).size, 3);

const firstApiPage = await internal("GET", "limit=2");
assert.equal(firstApiPage.response.status, 200);
assert.match(firstApiPage.response.headers.get("cache-control"), /private.*no-store/);
const secondApiPage = await internal("GET", `limit=2&cursor=${firstApiPage.body.nextCursor}`);
assert.equal(firstApiPage.body.hasMore, true);
assert.equal(secondApiPage.body.hasMore, false);
assert.equal([...firstApiPage.body.requests, ...secondApiPage.body.requests].length, 3);
assert.ok(firstApiPage.body.requests.every((item) => item.status === "stored" && item.revision === 0));
assert.equal(Object.hasOwn(firstApiPage.body.requests[0], "request"), false);

const initial = await internal("GET", `requestId=${referenceId}`);
assert.equal(initial.response.status, 200);
assert.equal(initial.body.record.status, "queued", "the immutable intake keeps its original schema");
assert.equal(initial.body.workflow.status, "stored");
assert.equal(initial.body.workflow.assignedOwner, "");
assert.equal(initial.body.workflow.revision, 0);
assert.deepEqual(initial.body.workflow.events, []);

const transitions = {
  stored: ["in-review", "needs-info"],
  "in-review": ["needs-info", "supplier-confirmed", "responded", "closed"],
  "needs-info": ["in-review", "responded", "closed"],
  "supplier-confirmed": ["in-review", "needs-info", "responded", "closed"],
  responded: ["in-review", "closed"],
  closed: []
};
for (const [from, allowed] of Object.entries(transitions)) {
  for (const to of Object.keys(transitions)) assert.equal(canTransitionRfqWorkflow(from, to), allowed.includes(to), `${from} -> ${to}`);
}

for (const invalid of [
  { status: "unknown" }, { status: "stored" }, { status: "queued" },
  { assignedOwner: " " }, { operationId: "short" }, { status: "needs-info", needsInfo: " " },
  { status: "supplier-confirmed", supplierConfirmation: " " },
  { status: "responded", responseSummary: " " }, { status: "closed", responseSummary: " " }
]) {
  await patch(action(referenceId, "invalid-action-001", "in-review", invalid), 400);
}
await patch(action(referenceId, "invalid-transition-001", "supplier-confirmed", { supplierConfirmation: "QA fixture only" }), 409);
await assert.rejects(
  () => appendRfqWorkflowEvent(action(referenceId, "direct-invalid-001", "supplier-confirmed")),
  (error) => error instanceof RfqWorkflowUpdateError && error.statusCode === 400
);
await assert.rejects(
  () => appendRfqWorkflowEvent(action(referenceId, "direct-transition-001", "responded", { responseSummary: "Synthetic blocked response." })),
  (error) => error instanceof RfqWorkflowUpdateError && error.statusCode === 409
);

const reviewAction = action(referenceId, "review-step-0001", "in-review");
const reviewed = await patch({ ...reviewAction, status: "reviewing" });
assert.equal(reviewed.workflow.status, "in-review");
assert.equal(reviewed.workflow.events[0].status, "in-review");
assert.equal(reviewed.workflow.events[0].schemaVersion, 2);
assert.equal(reviewed.replayed, false);
assertLegacyStatus(referenceId, "reviewing", "needs-info");
const repeatedReview = await patch(reviewAction);
assert.equal(repeatedReview.replayed, true);
assert.equal(repeatedReview.workflow.events.length, 1);

const needsInfo = await patch(action(referenceId, "needs-info-000001", "needs-info", { needsInfo: "Confirm the requested plate format." }));
assert.equal(needsInfo.workflow.status, "needs-info");
assert.equal(needsInfo.workflow.needsInfo, "Confirm the requested plate format.");
assertLegacyStatus(referenceId, "needs-info", "reviewing");
await patch(action(referenceId, "resume-review-001", "in-review"));
const supplierAction = action(referenceId, "supplier-step-001", "supplier-confirmed", { supplierConfirmation: "Synthetic QA confirmation reference QA-001." });
const supplierConfirmed = await patch(supplierAction);
assert.equal(supplierConfirmed.workflow.status, "supplier-confirmed");
assert.equal(supplierConfirmed.workflow.supplierConfirmation, supplierAction.supplierConfirmation);
assert.equal(supplierConfirmed.workflow.responseSummary, "");
assertLegacyStatus(referenceId, "reviewing", "responded");
const storedConfirmation = readLegacyWorkflow(referenceId).events.at(-1);
assert.equal(storedConfirmation.canonicalStatus, "supplier-confirmed");
assert.equal(storedConfirmation.supplierConfirmation, supplierAction.supplierConfirmation);
const listing = await internal("GET", "limit=50");
const supplierSummary = listing.body.requests.find((item) => item.requestId === referenceId);
assert.equal(supplierSummary.status, "supplier-confirmed");
assert.equal(supplierSummary.supplierConfirmation, supplierAction.supplierConfirmation);
assert.equal(supplierSummary.revision, 4);

const responseAction = action(referenceId, "responded-step-001", "responded", { responseSummary: "Synthetic QA response record." });
const responded = await patch(responseAction);
assert.equal(responded.workflow.status, "responded");
assert.equal(responded.workflow.responseSummary, responseAction.responseSummary);
assertLegacyStatus(referenceId, "responded", "closed");
const replayAfterAdvance = await patch(reviewAction);
assert.equal(replayAfterAdvance.replayed, true);
assert.equal(replayAfterAdvance.workflow.status, "responded");
assert.equal(replayAfterAdvance.workflow.events.length, 5);

for (const conflict of [
  { assignedOwner: "Different QA operator" }, { needsInfo: "Changed QA question" },
  { responseSummary: "Changed QA summary" }, { supplierConfirmation: "Changed QA evidence" },
  { status: "needs-info", needsInfo: "Changed status requires this question" }
]) {
  await patch({ ...reviewAction, ...conflict }, 409);
}
await patch({ ...supplierAction, supplierConfirmation: "Different synthetic supplier evidence" }, 409);
await patch({ ...responseAction, responseSummary: "Different synthetic response" }, 409);
const closed = await patch(action(referenceId, "closed-step-0001", "closed", { responseSummary: "Synthetic QA follow-up completed." }));
assert.equal(closed.workflow.status, "closed");
assert.equal(closed.workflow.revision, 6);
assertLegacyStatus(referenceId, "closed", "reviewing", false);
await patch(action(referenceId, "reopen-closed-001", "in-review"), 409);
assert.deepEqual((await readQueuedRfq(referenceId)), firstWrite.record);

// Legacy records remain raw in history while current states and retries use canonical names.
const legacyId = "BIOAXIS-QA-LEGACY";
await enqueueRfq(legacyId, { email: "legacy@example.test" });
seedEvent(legacyId, "legacy-queued-001", "queued", { assignedOwner: "" });
assert.equal((await getRfqWorkflow(legacyId)).status, "stored");
const legacyReview = seedEvent(legacyId, "legacy-review-001", "reviewing");
assert.equal((await getRfqWorkflow(legacyId)).status, "in-review");
const legacyReplay = await patch(action(legacyId, legacyReview.event.operationId, "in-review", { assignedOwner: legacyReview.event.assignedOwner }));
assert.equal(legacyReplay.replayed, true);
assert.equal(legacyReplay.workflow.events.at(-1).status, "reviewing");
const advancedLegacy = await patch(action(legacyId, "legacy-supplier-001", "supplier-confirmed", { supplierConfirmation: "Synthetic legacy upgrade fixture." }));
assert.equal(advancedLegacy.workflow.revision, 1, "v2 revisions start independently of legacy event count");
assert.equal(advancedLegacy.workflow.events.length, 3);

// Upgrade, roll back to a timestamp-only v1 writer, then upgrade again. A future
// legacy timestamp also verifies the new writer's clock-regression protection.
const rollbackId = "BIOAXIS-QA-ROLLBACK";
await enqueueRfq(rollbackId, { email: "rollback@example.test" });
const rollbackReviewAction = action(rollbackId, "rollback-review-001", "in-review");
await patch(rollbackReviewAction);
const rollbackSupplierAction = action(rollbackId, "rollback-supplier-001", "supplier-confirmed", { supplierConfirmation: "Synthetic rollback evidence." });
await patch(rollbackSupplierAction);
assertLegacyStatus(rollbackId, "reviewing", "responded");
const legacyResponseAction = action(rollbackId, "rollback-response-001", "responded", { responseSummary: "Synthetic reply recorded by the old writer." });
const legacyResponse = seedEvent(rollbackId, legacyResponseAction.operationId, legacyResponseAction.status, {
  assignedOwner: legacyResponseAction.assignedOwner,
  responseSummary: legacyResponseAction.responseSummary,
  recordedAt: new Date(Date.now() + 60_000).toISOString()
});
const afterRollback = await internal("GET", `requestId=${rollbackId}`);
assert.equal(afterRollback.response.status, 200);
assert.equal(afterRollback.body.workflow.status, "responded");
assert.equal(afterRollback.body.workflow.responseSummary, legacyResponseAction.responseSummary);
assert.equal(afterRollback.body.workflow.supplierConfirmation, "");
assert.equal(afterRollback.body.workflow.revision, 2);
assert.deepEqual(afterRollback.body.workflow.events.map((event) => event.operationId), [
  rollbackReviewAction.operationId, rollbackSupplierAction.operationId, legacyResponseAction.operationId
]);
assert.equal(afterRollback.body.workflow.events[1].supplierConfirmation, rollbackSupplierAction.supplierConfirmation);
assertLegacyStatus(rollbackId, "responded", "reviewing");

const rollbackSupplierPath = `rfq/workflow/by-id/${rollbackId}/revisions/000000000002.json`;
omittedListings.add(rollbackSupplierPath);
const recoveredRollback = await getRfqWorkflow(rollbackId);
assert.equal(recoveredRollback.status, "responded", "an origin-recovered v2 tail must precede a later v1 event");
assert.equal(recoveredRollback.revision, 2);
assert.deepEqual(recoveredRollback.events, afterRollback.body.workflow.events);
omittedListings.delete(rollbackSupplierPath);

const rollbackRetryWrites = writes.length;
assert.equal((await patch(rollbackSupplierAction)).replayed, true);
assert.equal((await patch(legacyResponseAction)).replayed, true);
assert.equal(writes.length, rollbackRetryWrites, "v1 and v2 retries after rollback must add no writes");
await patch({ ...legacyResponseAction, responseSummary: "Changed legacy response." }, 409);

const upgradeAction = action(rollbackId, "rollback-upgrade-001", "in-review");
failAfterWrite = `rfq/workflow/by-id/${rollbackId}/revisions/`;
const upgraded = await patch(upgradeAction);
assert.equal(upgraded.replayed, true, "a lost response during re-upgrade recovers the same revision");
assert.equal(upgraded.workflow.status, "in-review");
assert.equal(upgraded.workflow.revision, 3);
assert.deepEqual(upgraded.workflow.events.map((event) => event.operationId), [
  rollbackReviewAction.operationId, rollbackSupplierAction.operationId, legacyResponseAction.operationId, upgradeAction.operationId
]);
assert.equal(upgraded.workflow.updatedAt, new Date(Date.parse(legacyResponse.event.recordedAt) + 1).toISOString());
assertLegacyStatus(rollbackId, "reviewing", "needs-info");
const upgradedRetryWrites = writes.length;
for (const input of [rollbackReviewAction, rollbackSupplierAction, legacyResponseAction, upgradeAction]) {
  const retried = await patch(input);
  assert.equal(retried.replayed, true);
  assert.equal(retried.workflow.status, "in-review");
  assert.equal(retried.workflow.events.length, 4);
}
assert.equal(writes.length, upgradedRetryWrites);

// Both requests reach the same immutable revision slot before either can commit.
const concurrentId = "BIOAXIS-QA-CONCURRENT";
await enqueueRfq(concurrentId, { email: "concurrent@example.test" });
synchronizeWrites(`rfq/workflow/by-id/${concurrentId}/revisions/`);
const concurrent = await Promise.all([
  internal("PATCH", `requestId=${concurrentId}`, action(concurrentId, "concurrent-review-001", "in-review")),
  internal("PATCH", `requestId=${concurrentId}`, action(concurrentId, "concurrent-info-001", "needs-info", { needsInfo: "Synthetic QA missing detail." }))
]);
assert.deepEqual(concurrent.map((result) => result.response.status).sort(), [200, 409]);
assert.equal((await getRfqWorkflow(concurrentId)).events.length, 1);

const identicalId = "BIOAXIS-QA-CONCURRENT-REPLAY";
await enqueueRfq(identicalId, { email: "identical@example.test" });
const identicalAction = action(identicalId, "identical-review-001", "in-review");
synchronizeWrites(`rfq/workflow/by-id/${identicalId}/revisions/`);
const identical = await Promise.all([
  internal("PATCH", `requestId=${identicalId}`, identicalAction),
  internal("PATCH", `requestId=${identicalId}`, identicalAction)
]);
assert.ok(identical.every((result) => result.response.status === 200));
assert.deepEqual(identical.map((result) => result.body.replayed).sort(), [false, true]);
assert.equal((await getRfqWorkflow(identicalId)).events.length, 1);

const recoveryId = "BIOAXIS-QA-WRITE-RECOVERY";
await enqueueRfq(recoveryId, { email: "recovery@example.test" });
failAfterWrite = `rfq/workflow/by-id/${recoveryId}/revisions/`;
const recovered = await patch(action(recoveryId, "recovered-review-001", "in-review"));
assert.equal(recovered.replayed, true);
assert.equal(recovered.workflow.events.length, 1);

const readbackId = "BIOAXIS-QA-READBACK-RECOVERY";
await enqueueRfq(readbackId, { email: "readback@example.test" });
const readbackAction = action(readbackId, "readback-review-001", "in-review");
failReadAfterWrite = `rfq/workflow/by-id/${readbackId}/revisions/`;
const readbackConsoleError = console.error;
console.error = () => {};
try {
  const failedReadback = await internal("PATCH", `requestId=${readbackId}`, readbackAction);
  assert.equal(failedReadback.response.status, 503);
  assert.equal(JSON.stringify(failedReadback.body).includes("private-readback-error-secret"), false);
} finally {
  console.error = readbackConsoleError;
}
await patch(action(readbackId, "readback-info-001", "needs-info", { needsInfo: "Synthetic QA follow-up question." }));
const readbackReplay = await patch(readbackAction);
assert.equal(readbackReplay.replayed, true);
assert.equal(readbackReplay.workflow.status, "needs-info");
assert.equal(readbackReplay.workflow.events.length, 2);

// History order follows revisions even when timestamps are equal or move backwards.
const orderingId = "BIOAXIS-QA-ORDERING";
seedEvent(orderingId, "ordering-step-001", "in-review", { schemaVersion: 2, revision: 1, supplierConfirmation: "", recordedAt: "2026-02-01T00:00:00.000Z" });
seedEvent(orderingId, "ordering-step-002", "needs-info", { schemaVersion: 2, revision: 2, supplierConfirmation: "", recordedAt: "2026-02-01T00:00:00.000Z" });
const tail = seedEvent(orderingId, "ordering-step-003", "responded", { schemaVersion: 2, revision: 3, supplierConfirmation: "", recordedAt: "2025-01-01T00:00:00.000Z", responseSummary: "Synthetic ordering fixture." });
const ordered = await getRfqWorkflow(orderingId);
assert.equal(ordered.status, "responded");
assert.deepEqual(ordered.events.map((event) => event.revision), [1, 2, 3]);
omittedListings.add(tail.pathname);
assert.equal((await getRfqWorkflow(orderingId)).status, "responded", "origin reads recover an unlisted revision tail");
omittedListings.delete(tail.pathname);

// Mixed histories retain revision order across backwards clocks. Legacy ties
// use operationId, and a legacy event at a revision's timestamp precedes it.
const mixedOrderingId = "BIOAXIS-QA-MIXED-ORDERING";
seedEvent(mixedOrderingId, "mixed-v2-first-001", "in-review", { schemaVersion: 2, revision: 1, supplierConfirmation: "", recordedAt: "2026-02-03T00:00:00.000Z" });
seedEvent(mixedOrderingId, "mixed-v2-backward-002", "needs-info", { schemaVersion: 2, revision: 2, supplierConfirmation: "", recordedAt: "2026-02-01T00:00:00.000Z" });
seedEvent(mixedOrderingId, "mixed-v1-before-001", "reviewing", { recordedAt: "2026-02-02T00:00:00.000Z" });
seedEvent(mixedOrderingId, "mixed-v1-after-002", "responded", { recordedAt: "2026-02-04T00:00:00.000Z", responseSummary: "Synthetic mixed ordering reply." });
seedEvent(mixedOrderingId, "mixed-v1-after-001", "reviewing", { recordedAt: "2026-02-04T00:00:00.000Z" });
const mixedTail = seedEvent(mixedOrderingId, "mixed-v2-last-003", "in-review", { schemaVersion: 2, revision: 3, supplierConfirmation: "", recordedAt: "2026-02-04T00:00:00.000Z" });
const mixedOrdering = await getRfqWorkflow(mixedOrderingId);
assert.equal(mixedOrdering.status, "in-review");
assert.deepEqual(mixedOrdering.events.map((event) => event.operationId), [
  "mixed-v1-before-001", "mixed-v2-first-001", "mixed-v2-backward-002",
  "mixed-v1-after-001", "mixed-v1-after-002", "mixed-v2-last-003"
]);
omittedListings.add(mixedTail.pathname);
assert.deepEqual((await getRfqWorkflow(mixedOrderingId)).events, mixedOrdering.events);
omittedListings.delete(mixedTail.pathname);

const paginatedId = "BIOAXIS-QA-HISTORY-PAGES";
for (let index = 0; index < 105; index += 1) {
  seedEvent(paginatedId, `legacy-page-${String(index).padStart(4, "0")}`, "reviewing");
}
for (let revision = 1; revision <= 105; revision += 1) {
  seedEvent(paginatedId, `revision-page-${revision}`, revision % 2 ? "needs-info" : "in-review", { schemaVersion: 2, revision, supplierConfirmation: "" });
}
const pageCallsBefore = listCalls.length;
const paginated = await getRfqWorkflow(paginatedId);
assert.equal(paginated.events.length, 210);
assert.equal(paginated.revision, 105);
assert.equal(paginated.status, "needs-info");
assert.equal(listCalls.length - pageCallsBefore, 3);
assert.equal(listCalls.at(-1).cursor, "200");
const missing = seedEvent("BIOAXIS-QA-MISSING-EVENT", "missing-event-001", "reviewing");
hiddenReads.add(missing.pathname);
await assert.rejects(() => getRfqWorkflow("BIOAXIS-QA-MISSING-EVENT"), /incomplete/);
hiddenReads.delete(missing.pathname);
seedEvent("BIOAXIS-QA-REVISION-GAP", "gap-step-0002", "in-review", { schemaVersion: 2, revision: 2, supplierConfirmation: "" });
await assert.rejects(() => getRfqWorkflow("BIOAXIS-QA-REVISION-GAP"), /revision gap/);

const beforeUnauthorized = { writes: writes.length, lists: listCalls.length };
assert.equal((await internal("GET", "limit=20", undefined, "wrong-key")).response.status, 404);
assert.equal((await internal("PATCH", `requestId=${referenceId}`, reviewAction, "wrong-key")).response.status, 404);
assert.deepEqual({ writes: writes.length, lists: listCalls.length }, beforeUnauthorized);
assert.equal((await internal("GET", "limit=51")).response.status, 400);
assert.equal((await internal("GET", "requestId=UNKNOWN-QA-ID")).response.status, 404);
await patch(action("UNKNOWN-QA-ID", "missing-request-001", "in-review"), 404);
const malformed = await PATCH(new NextRequest(`http://rfq-regression.invalid/api/rfq/internal?requestId=${referenceId}`, {
  method: "PATCH", headers: { Authorization: `Bearer ${qaKey}` }, body: "{"
}));
assert.equal(malformed.status, 400);
const oversized = await PATCH(new NextRequest(`http://rfq-regression.invalid/api/rfq/internal?requestId=${referenceId}`, {
  method: "PATCH", headers: { Authorization: `Bearer ${qaKey}` }, body: JSON.stringify({ padding: "x".repeat(12001) })
}));
assert.equal(oversized.status, 413);

// Provider details remain in the trusted log, outside the returned JSON error.
const originalConsoleError = console.error;
console.error = () => {};
try {
  failStorage = true;
  for (const [method, query, payload] of [
    ["GET", "limit=20"], ["GET", `requestId=${referenceId}`], ["PATCH", `requestId=${referenceId}`, reviewAction]
  ]) {
    const result = await internal(method, query, payload);
    assert.equal(result.response.status, 503);
    assert.equal(JSON.stringify(result.body).includes("private-storage-error-secret"), false);
  }
} finally {
  failStorage = false;
  console.error = originalConsoleError;
}

for (const [pathname, bytes] of immutableBytes) assert.equal(blobs.get(pathname), bytes, `record was mutated: ${pathname}`);
assert.ok(writes.some(({ pathname }) => pathname.endsWith("/revisions/000000000001.json")));
Module._load = originalLoad;
globalThis.fetch = originalFetch;
console.log("RFQ queue regression passed: canonical lifecycle and internal API, a7eb824-compatible writes, rollback/re-upgrade, mixed-schema ordering, immutable intake/events, validation, idempotency, revision contention/recovery, pagination, and private errors. All Blob operations used the local mock.");
