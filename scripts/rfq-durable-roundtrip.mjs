const submissionBaseUrl = process.argv[2] ?? process.env.RFQ_ROUNDTRIP_SUBMIT_BASE_URL ?? "http://localhost:3000";
const lookupBaseUrl = process.argv[3] ?? process.env.RFQ_ROUNDTRIP_LOOKUP_BASE_URL ?? "https://bioaxisv3.vercel.app";
const internalApiKey = process.env.BIOAXIS_INTERNAL_API_KEY ?? "";
const turnstileToken = process.env.RFQ_ROUNDTRIP_TURNSTILE_TOKEN ?? "";
const requestId = `BIOAXIS-QA-${Date.now().toString(36).toUpperCase()}`;
const qaEmail = "rfq-roundtrip@example.com";

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

const submissionResponse = await fetch(new URL("/api/rfq", submissionBaseUrl), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    requestId,
    email: qaEmail,
    company: "BioAxis QA",
    requestType: "quote",
    productList: "Automated durable-queue round-trip verification; no commercial follow-up required.",
    sourcePageUrl: "/qa/rfq-durable-roundtrip",
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
  record?.trace?.source === "/api/rfq";

if (!recordMatches) {
  fail(`internal lookup returned HTTP ${lookupResponse?.status ?? 0} without the immutable queued record`);
}

console.log(`RFQ durable round-trip passed for ${requestId}`);
console.log(`- submission: HTTP ${submissionResponse.status}, durable queue accepted`);
console.log(`- internal lookup: HTTP ${lookupResponse.status}, same request ID retrieved`);
console.log("- stored record: queued, email present, trace source /api/rfq");
console.log("- secrets and customer-entered values: not printed");
