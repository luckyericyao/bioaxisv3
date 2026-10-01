import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const records = new Map();
const workflows = new Map();
const requests = [];
const qaKey = "qa-only-local-phase-test";

function respond(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  requests.push({ method: request.method, path: url.pathname });
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};

  if (url.pathname === "/api/rfq" && request.method === "POST") {
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
    workflows.set(body.requestId, { status: "queued", assignedOwner: "", events: [] });
    respond(response, 200, { ok: true, requestId: body.requestId });
    return;
  }

  if (url.pathname !== "/api/rfq/internal" || request.headers.authorization !== `Bearer ${qaKey}`) {
    respond(response, 401, { ok: false });
    return;
  }
  const requestId = url.searchParams.get("requestId");
  const record = records.get(requestId);
  const workflow = workflows.get(requestId);
  if (!record || !workflow) {
    respond(response, 404, { ok: false });
    return;
  }
  if (request.method === "PATCH") {
    workflow.status = body.status;
    workflow.assignedOwner = body.assignedOwner;
    workflow.events.push({ requestId, operationId: body.operationId, status: body.status });
  }
  respond(response, 200, { ok: true, record, workflow });
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(RFQ_|BIOAXIS_)/.test(key)));

async function run(env = {}) {
  try {
    const result = await execFileAsync(process.execPath, ["scripts/rfq-durable-roundtrip.mjs", baseUrl, baseUrl], {
      env: { ...cleanEnv, BIOAXIS_INTERNAL_API_KEY: qaKey, ...env },
      timeout: 15_000
    });
    return { code: 0, ...result };
  } catch (error) {
    return { code: error.code, stdout: error.stdout ?? "", stderr: error.stderr ?? "" };
  }
}

try {
  const unapproved = await run();
  assert.equal(unapproved.code, 1);
  assert.match(unapproved.stderr, /authorize one clearly labelled QA queue record/);
  assert.equal(requests.length, 0, "unapproved submission must fail before network access");

  const submitted = await run({ RFQ_ROUNDTRIP_CONFIRM: "1" });
  assert.equal(submitted.code, 0, submitted.stderr);
  assert.equal(records.size, 1);
  const requestId = [...records.keys()][0];
  const originalRecord = JSON.stringify(records.get(requestId));
  assert.equal(workflows.get(requestId).status, "queued");
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
  assert.equal(workflows.get(requestId).status, "reviewing");
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
  const customerId = await run({ RFQ_ROUNDTRIP_PHASE: "verify", RFQ_ROUNDTRIP_REQUEST_ID: "BIOAXIS-CUSTOMER-001" });
  assert.equal(customerId.code, 1);
  assert.match(customerId.stderr, /customer requests are not accepted/);
  assert.equal(requests.length, 0);

  workflows.get(requestId).status = "responded";
  const advanced = await run({
    RFQ_ROUNDTRIP_PHASE: "confirm-owner", RFQ_ROUNDTRIP_REQUEST_ID: requestId,
    RFQ_ROUNDTRIP_OWNER: "QA reviewer", RFQ_OWNER_REVIEW_CONFIRMED: "1"
  });
  assert.equal(advanced.code, 1);
  assert.match(advanced.stderr, /will not overwrite an existing workflow/);
  assert.deepEqual(requests.map((item) => item.method), ["GET"]);
  assert.equal(workflows.get(requestId).status, "responded");

  console.log("RFQ phase regression passed: explicit QA submission, read-only verification, acknowledged owner gate, immutable context, idempotent confirmation, and customer/workflow safeguards.");
  console.log("Scope: local mock only; does not prove a human reviewed a production request.");
} finally {
  await new Promise((resolve) => server.close(resolve));
}
