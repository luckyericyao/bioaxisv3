import assert from "node:assert/strict";
import { fork } from "node:child_process";

const records = new Map();
const workflows = new Map();
const requests = [];
const qaKey = "qa-only-local-phase-test";

function mockFetch(input, options = {}) {
  const url = new URL(input);
  const method = options.method ?? "GET";
  requests.push({ method, path: url.pathname });
  const body = options.body ? JSON.parse(options.body) : {};

  if (url.pathname === "/api/rfq" && method === "POST") {
    const record = {
      referenceId: body.requestId,
      status: "queued",
      request: {
        ...body,
        sourcingListItems: body.sourcingListItems.map((item) => ({
          ...item,
          path: [item.segmentTitle, item.categoryTitle, item.familyTitle, item.productTitle].join(" / ")
        }))
      },
      trace: { source: "/api/rfq" }
    };
    records.set(body.requestId, record);
    workflows.set(body.requestId, { status: "stored", assignedOwner: "", events: [] });
    return { status: 200, body: { ok: true, requestId: body.requestId } };
  }

  if (url.pathname !== "/api/rfq/internal" || options.headers?.Authorization !== `Bearer ${qaKey}`) {
    return { status: 401, body: { ok: false } };
  }
  const requestId = url.searchParams.get("requestId");
  const record = records.get(requestId);
  const workflow = workflows.get(requestId);
  if (!record || !workflow) {
    return { status: 404, body: { ok: false } };
  }
  if (method === "PATCH") {
    workflow.status = body.status;
    workflow.assignedOwner = body.assignedOwner;
    workflow.events.push({ requestId, operationId: body.operationId, status: body.status });
  }
  return { status: 200, body: { ok: true, record, workflow } };
}

const baseUrl = "http://rfq-phase.example.test";
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(RFQ_|BIOAXIS_)/.test(key)));
// Run the actual script in an isolated process, replacing fetch before its imports
// execute. IPC keeps the regression offline and avoids binding a local socket.
const fetchBootstrap = `data:text/javascript,${encodeURIComponent(`
  let nextId = 0;
  const pending = new Map();
  process.on("message", ({ id, status, body }) => {
    pending.get(id)(new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" }
    }));
    pending.delete(id);
    if (pending.size === 0) process.channel.unref();
  });
  process.channel.unref();
  globalThis.fetch = (input, options = {}) => new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    process.channel.ref();
    process.send({ id, input: String(input), options });
  });
`)}`;

async function run(env = {}) {
  return new Promise((resolve) => {
    const child = fork("scripts/rfq-durable-roundtrip.mjs", [baseUrl, baseUrl], {
      execPath: process.execPath,
      execArgv: ["--import", fetchBootstrap],
      env: { ...cleanEnv, BIOAXIS_INTERNAL_API_KEY: qaKey, ...env },
      silent: true,
      timeout: 15_000
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
    child.on("message", ({ id, input, options }) => {
      child.send({ id, ...mockFetch(input, options) });
    });
    child.on("error", (error) => resolve({ code: error.code, stdout, stderr: `${stderr}${error.message}` }));
    child.on("close", (code, signal) => resolve({ code: code ?? signal, stdout, stderr }));
  });
}

const unapproved = await run();
assert.equal(unapproved.code, 1);
assert.match(unapproved.stderr, /authorize one clearly labelled QA queue record/);
assert.equal(requests.length, 0, "unapproved submission must fail before network access");

const submitted = await run({ RFQ_ROUNDTRIP_CONFIRM: "1" });
assert.equal(submitted.code, 0, submitted.stderr);
assert.equal(records.size, 1);
const requestId = [...records.keys()][0];
const originalRecord = JSON.stringify(records.get(requestId));
assert.equal(workflows.get(requestId).status, "stored");
assert.equal(workflows.get(requestId).assignedOwner, "");
assert.deepEqual(requests.map((item) => item.method), ["POST", "GET"]);
assert.match(submitted.stdout, /separate confirmation step/);

requests.length = 0;
const verified = await run({ RFQ_ROUNDTRIP_PHASE: "verify", RFQ_ROUNDTRIP_REQUEST_ID: requestId });
assert.equal(verified.code, 0, verified.stderr);
assert.deepEqual(requests.map((item) => item.method), ["GET"], "verify phase must remain read-only");

requests.length = 0;
const notReviewed = await run({
  RFQ_ROUNDTRIP_PHASE: "confirm-owner", RFQ_ROUNDTRIP_REQUEST_ID: requestId, RFQ_ROUNDTRIP_OWNER: "QA reviewer"
});
assert.equal(notReviewed.code, 1);
assert.match(notReviewed.stderr, /after that owner actually reviews/);
assert.equal(requests.length, 0, "no owner event may be written without explicit review acknowledgment");

const confirmed = await run({
  RFQ_ROUNDTRIP_PHASE: "confirm-owner", RFQ_ROUNDTRIP_REQUEST_ID: requestId,
  RFQ_ROUNDTRIP_OWNER: "QA reviewer", RFQ_OWNER_REVIEW_CONFIRMED: "1"
});
assert.equal(confirmed.code, 0, confirmed.stderr);
assert.deepEqual(requests.map((item) => item.method), ["GET", "PATCH", "GET"]);
assert.equal(workflows.get(requestId).status, "in-review");
assert.equal(workflows.get(requestId).events.length, 1);
assert.equal(JSON.stringify(records.get(requestId)), originalRecord);
assert.match(confirmed.stdout, /does not send or prove a customer reply/);

requests.length = 0;
const repeated = await run({
  RFQ_ROUNDTRIP_PHASE: "confirm-owner", RFQ_ROUNDTRIP_REQUEST_ID: requestId,
  RFQ_ROUNDTRIP_OWNER: "QA reviewer", RFQ_OWNER_REVIEW_CONFIRMED: "1"
});
assert.equal(repeated.code, 0, repeated.stderr);
assert.deepEqual(requests.map((item) => item.method), ["GET"]);
assert.equal(workflows.get(requestId).events.length, 1, "repeated confirmation must not add an event");

requests.length = 0;
workflows.get(requestId).status = "reviewing";
const legacyReview = await run({
  RFQ_ROUNDTRIP_PHASE: "confirm-owner", RFQ_ROUNDTRIP_REQUEST_ID: requestId,
  RFQ_ROUNDTRIP_OWNER: "QA reviewer", RFQ_OWNER_REVIEW_CONFIRMED: "1"
});
assert.equal(legacyReview.code, 0, legacyReview.stderr);
assert.deepEqual(requests.map((item) => item.method), ["GET"]);
assert.equal(workflows.get(requestId).events.length, 1, "legacy review acknowledgment must remain idempotent");

requests.length = 0;
workflows.get(requestId).status = "queued";
workflows.get(requestId).assignedOwner = "";
workflows.get(requestId).events = [];
const legacyStored = await run({
  RFQ_ROUNDTRIP_PHASE: "confirm-owner", RFQ_ROUNDTRIP_REQUEST_ID: requestId,
  RFQ_ROUNDTRIP_OWNER: "QA reviewer", RFQ_OWNER_REVIEW_CONFIRMED: "1"
});
assert.equal(legacyStored.code, 0, legacyStored.stderr);
assert.deepEqual(requests.map((item) => item.method), ["GET", "PATCH", "GET"]);
assert.equal(workflows.get(requestId).status, "in-review");
assert.equal(JSON.stringify(records.get(requestId)), originalRecord);

requests.length = 0;
const customerId = await run({ RFQ_ROUNDTRIP_PHASE: "verify", RFQ_ROUNDTRIP_REQUEST_ID: "BIOAXIS-CUSTOMER-001" });
assert.equal(customerId.code, 1);
assert.match(customerId.stderr, /customer requests are not accepted/);
assert.equal(requests.length, 0);

for (const status of ["needs-info", "supplier-confirmed", "responded", "closed"]) {
  requests.length = 0;
  workflows.get(requestId).status = status;
  const advanced = await run({
    RFQ_ROUNDTRIP_PHASE: "confirm-owner", RFQ_ROUNDTRIP_REQUEST_ID: requestId,
    RFQ_ROUNDTRIP_OWNER: "QA reviewer", RFQ_OWNER_REVIEW_CONFIRMED: "1"
  });
  assert.equal(advanced.code, 1);
  assert.match(advanced.stderr, /will not overwrite an existing workflow/);
  assert.deepEqual(requests.map((item) => item.method), ["GET"]);
  assert.equal(workflows.get(requestId).status, status);
}

console.log("RFQ phase regression passed: explicit QA submission, read-only verification, acknowledged owner gate, immutable context, idempotent confirmation, and customer/workflow safeguards.");
console.log("Scope: local mock only; does not prove a human reviewed a production request.");
