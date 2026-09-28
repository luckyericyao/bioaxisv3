import { randomUUID } from "node:crypto";

const submissionBaseUrl = process.argv[2] ?? process.env.RFQ_ROUNDTRIP_SUBMIT_BASE_URL ?? "http://localhost:3000";
const lookupBaseUrl = process.argv[3] ?? process.env.RFQ_ROUNDTRIP_LOOKUP_BASE_URL ?? "https://bioaxisv3.vercel.app";
const internalApiKey = process.env.BIOAXIS_INTERNAL_API_KEY ?? "";
const turnstileToken = process.env.RFQ_ROUNDTRIP_TURNSTILE_TOKEN ?? "";
const assignedOwner = process.env.RFQ_ROUNDTRIP_OWNER?.trim() ?? "";
const requestId = `BIOAXIS-QA-${Date.now().toString(36).toUpperCase()}`;
const qaEmail = "rfq-roundtrip@example.com";
const productPath = "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips";

function fail(message) {
  console.error(`RFQ durable round-trip failed: ${message}`);
  process.exit(1);
}

if (process.env.RFQ_ROUNDTRIP_CONFIRM !== "1") {
  fail("set RFQ_ROUNDTRIP_CONFIRM=1 to authorize one clearly labelled QA queue record");
}

if (!internalApiKey) {
  fail("BIOAXIS_INTERNAL_API_KEY is not configured");
}

if (!assignedOwner) {
  fail("RFQ_ROUNDTRIP_OWNER must identify the operator confirming this QA request");
}

const submissionResponse = await fetch(new URL("/api/rfq", submissionBaseUrl), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    requestId,
    email: qaEmail,
    company: "BioAxis QA",
    requestType: "product-list-review",
    productList: "QA-only context preservation check; no commercial follow-up required.",
    sourcePageUrl: "/products?q=filtered%20200%20%C2%B5L%20tips",
    productContext: {
      requestType: "product-list-review",
      productName: "Filtered 200 µL Pipette Tips",
      productFamily: "Filtered Pipette Tips",
      productCategory: "Pipette Tips",
      productSegment: "Liquid Handling",
      productUrl: productPath,
      sourcePageUrl: "/products?q=filtered%20200%20%C2%B5L%20tips",
      relevantSpecs: ["200 µL", "filtered"],
      documentationNotes: ["QA-only context test; no certificate claim"]
    },
    sourcingListItems: [{
      title: "Filtered 200 µL Pipette Tips",
      href: productPath,
      segmentTitle: "Liquid Handling",
      categoryTitle: "Pipette Tips",
      familyTitle: "Filtered Pipette Tips",
      productTitle: "Filtered 200 µL Pipette Tips",
      quantity: "QA context only",
      equivalentNeeded: true,
      sampleNeeded: false,
      documentationNeeded: true,
      sourcePageUrl: productPath,
      addedAt: new Date().toISOString()
    }],
    startedAt: Date.now() - 2_000,
    turnstileToken
  }),
  signal: AbortSignal.timeout(30_000)
}).catch((error) => fail(`submission request could not connect (${error instanceof Error ? error.name : "unknown error"})`));

const submissionPayload = await submissionResponse.json().catch(() => ({}));

if (!submissionResponse.ok || submissionPayload?.ok !== true || submissionPayload?.requestId !== requestId) {
  fail(`submission returned HTTP ${submissionResponse.status} without the expected request ID`);
}

let lookupResponse;
let lookupPayload;

for (let attempt = 1; attempt <= 5; attempt += 1) {
  lookupResponse = await fetch(new URL(`/api/rfq/internal?requestId=${encodeURIComponent(requestId)}`, lookupBaseUrl), {
    headers: { Authorization: `Bearer ${internalApiKey}` },
    signal: AbortSignal.timeout(30_000)
  }).catch(() => null);
  lookupPayload = lookupResponse ? await lookupResponse.json().catch(() => ({})) : {};

  if (lookupResponse?.ok && lookupPayload?.record) {
    break;
  }

  if (attempt < 5) {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
}

const record = lookupPayload?.record;
const recordMatches =
  lookupResponse?.ok &&
  lookupPayload?.ok === true &&
  record?.referenceId === requestId &&
  record?.status === "queued" &&
  record?.request?.requestId === requestId &&
  record?.request?.email === qaEmail &&
  record?.request?.requestType === "product-list-review" &&
  record?.request?.productContext?.productName === "Filtered 200 µL Pipette Tips" &&
  record?.request?.productContext?.productSegment === "Liquid Handling" &&
  record?.request?.productContext?.sourcePageUrl === "/products?q=filtered%20200%20%C2%B5L%20tips" &&
  record?.request?.sourcingListItems?.length === 1 &&
  record?.request?.sourcingListItems?.[0]?.path === "Liquid Handling / Pipette Tips / Filtered Pipette Tips / Filtered 200 µL Pipette Tips" &&
  record?.trace?.source === "/api/rfq";

if (!recordMatches) {
  fail(`internal lookup returned HTTP ${lookupResponse?.status ?? 0} without the immutable queued record`);
}

const operationId = randomUUID();
const workflowResponse = await fetch(new URL(`/api/rfq/internal?requestId=${encodeURIComponent(requestId)}`, lookupBaseUrl), {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${internalApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ status: "reviewing", assignedOwner, operationId }),
  signal: AbortSignal.timeout(30_000)
}).catch((error) => fail(`workflow confirmation could not connect (${error instanceof Error ? error.name : "unknown error"})`));
const workflowPayload = await workflowResponse.json().catch(() => ({}));

if (
  !workflowResponse.ok ||
  workflowPayload?.ok !== true ||
  workflowPayload?.workflow?.status !== "reviewing" ||
  workflowPayload?.workflow?.assignedOwner !== assignedOwner
) {
  fail(`workflow confirmation returned HTTP ${workflowResponse.status} without the expected owner/status`);
}

const confirmedRecord = workflowPayload?.workflow?.events?.[0]?.requestId === requestId;
if (!confirmedRecord) {
  fail("workflow confirmation did not include the event linked to the same request ID");
}

console.log(`RFQ durable round-trip passed for ${requestId}`);
console.log(`- submission: HTTP ${submissionResponse.status}, durable queue accepted`);
console.log(`- internal lookup: HTTP ${lookupResponse.status}, same request ID retrieved`);
console.log(`- context: product, search source, and one sourcing-list item preserved`);
console.log(`- owner confirmation: HTTP ${workflowResponse.status}, status reviewing`);
console.log("- secrets and customer-entered values: not printed");
