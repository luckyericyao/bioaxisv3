import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const ts = require("typescript");
const originalLoad = Module._load;
const blobs = new Map();
let writeOptions;

Module._load = function load(request, parent, isMain) {
  if (request === "@vercel/blob") {
    return {
      get: async (pathname) => {
        const stored = blobs.get(pathname);
        return stored === undefined
          ? null
          : { statusCode: 200, stream: new Blob([stored]).stream() };
      },
      list: async ({ prefix = "", limit = 1000, cursor } = {}) => {
        const all = [...blobs.keys()]
          .filter((pathname) => pathname.startsWith(prefix))
          .map((pathname) => ({ pathname }));
        const start = cursor ? Number(cursor) : 0;
        const end = start + limit;
        const hasMore = end < all.length;
        return {
          blobs: all.slice(start, end),
          cursor: hasMore ? String(end) : undefined,
          hasMore
        };
      },
      put: async (pathname, body, options) => {
        writeOptions = options;
        if (blobs.has(pathname)) throw new Error("Blob already exists");
        blobs.set(pathname, String(body));
        return { pathname, etag: "test-etag" };
      }
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

require.extensions[".ts"] = (module, filename) => {
  const source = require("node:fs").readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
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
const { enqueueRfq, listQueuedRfqs, readQueuedRfq, RfqIdempotencyConflictError } = require(path.resolve("src/lib/server/rfqQueue.ts"));
const { appendRfqWorkflowEvent, canTransitionRfqWorkflow, getRfqWorkflow } = require(path.resolve("src/lib/server/rfqWorkflow.ts"));
const referenceId = "BIOAXIS-QA-IDEMPOTENCY";
const originalRequest = { email: "first@example.test", productList: "First immutable request" };
const replacementRequest = { email: "second@example.test", productList: "Must not overwrite" };

const firstWrite = await enqueueRfq(referenceId, originalRequest);
const replay = await enqueueRfq(referenceId, originalRequest);
await assert.rejects(() => enqueueRfq(referenceId, replacementRequest), RfqIdempotencyConflictError);
const stored = await readQueuedRfq(referenceId);

assert.equal(firstWrite.replayed, false);
assert.equal(replay.replayed, true);
assert.equal(replay.record.request.email, originalRequest.email);
assert.equal(replay.record.request.productList, originalRequest.productList);
assert.deepEqual(stored?.request, originalRequest);
assert.equal(writeOptions?.access, "private");
assert.equal(writeOptions?.allowOverwrite, false);
assert.equal(writeOptions?.addRandomSuffix, false);

await enqueueRfq("BIOAXIS-QUEUE-PAGE-002", { email: "second@example.test" });
await enqueueRfq("BIOAXIS-QUEUE-PAGE-003", { email: "third@example.test" });
const firstQueuePage = await listQueuedRfqs({ limit: 2 });
const secondQueuePage = await listQueuedRfqs({ limit: 2, cursor: firstQueuePage.cursor });
const listedRequestIds = [...firstQueuePage.records, ...secondQueuePage.records].map((record) => record.referenceId);
assert.equal(firstQueuePage.records.length, 2);
assert.equal(firstQueuePage.hasMore, true);
assert.equal(Boolean(firstQueuePage.cursor), true);
assert.equal(secondQueuePage.hasMore, false);
assert.equal(new Set(listedRequestIds).size, 3);
assert.ok(listedRequestIds.includes(referenceId));
assert.ok(listedRequestIds.includes("BIOAXIS-QUEUE-PAGE-002"));
assert.ok(listedRequestIds.includes("BIOAXIS-QUEUE-PAGE-003"));

const startingWorkflow = await getRfqWorkflow(referenceId);
assert.equal(startingWorkflow.status, "queued");
assert.equal(startingWorkflow.assignedOwner, "");
assert.equal(canTransitionRfqWorkflow("queued", "reviewing"), true);
assert.equal(canTransitionRfqWorkflow("closed", "reviewing"), false);

const reviewAction = {
  requestId: referenceId,
  operationId: "review-step-0001",
  status: "reviewing",
  assignedOwner: "QA operator",
  needsInfo: "",
  responseSummary: ""
};
const firstReview = await appendRfqWorkflowEvent(reviewAction);
const replayReview = await appendRfqWorkflowEvent(reviewAction);
assert.equal(firstReview.replayed, false);
assert.equal(replayReview.replayed, true);

await appendRfqWorkflowEvent({
  requestId: referenceId,
  operationId: "needs-info-000001",
  status: "needs-info",
  assignedOwner: "QA operator",
  needsInfo: "Confirm the required plate format.",
  responseSummary: ""
});
const needsInfoWorkflow = await getRfqWorkflow(referenceId);
assert.equal(needsInfoWorkflow.status, "needs-info");
assert.equal(needsInfoWorkflow.assignedOwner, "QA operator");
assert.equal(needsInfoWorkflow.needsInfo, "Confirm the required plate format.");

await appendRfqWorkflowEvent({
  requestId: referenceId,
  operationId: "responded-0000001",
  status: "responded",
  assignedOwner: "QA operator",
  needsInfo: "",
  responseSummary: "QA reply recorded; no customer communication was sent."
});
const completedWorkflow = await getRfqWorkflow(referenceId);
assert.equal(completedWorkflow.status, "responded");
assert.equal(completedWorkflow.events.length, 3);
assert.equal(completedWorkflow.responseSummary, "QA reply recorded; no customer communication was sent.");

console.log("RFQ queue/workflow regression passed: immutable intake, owner assignment, needs-info/responded statuses, idempotent operations.");
