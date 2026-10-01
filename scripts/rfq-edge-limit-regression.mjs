const baseUrl = process.argv[2] ?? "https://bioaxisv3.vercel.app";
const requestLimit = 20;
const windowMs = 60_000;

if (process.env.RFQ_EDGE_LIMIT_CONFIRM !== "1") {
  throw new Error("Set RFQ_EDGE_LIMIT_CONFIRM=1 to run at most 21 honeypot requests. No RFQ record is stored.");
}

// Start early in a fixed window so a short probe does not span its reset.
const elapsedInMinute = Date.now() % windowMs;
if (elapsedInMinute > 35_000) {
  console.log("Waiting for the next fixed window before the bounded rate-limit check.");
  await new Promise((resolve) => setTimeout(resolve, windowMs - elapsedInMinute + 1_000));
}

const start = Date.now();
const regions = new Set();
let blocked = false;

for (let attempt = 1; attempt <= requestLimit + 1; attempt += 1) {
  const response = await fetch(new URL("/api/rfq", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "BioAxis-RFQ-Rate-Limit-QA" },
    body: JSON.stringify({ website: "bounded-rate-limit-QA" }),
    signal: AbortSignal.timeout(15_000)
  });
  const vercelId = response.headers.get("x-vercel-id") ?? "";
  const region = vercelId.split("::")[0];
  if (region) regions.add(region);
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = null; }

  if (response.status === 429) {
    if (body?.error === "Too many requests. Please wait a moment and try again.") {
      throw new Error("HTTP 429 came from the per-instance application fallback; WAF enforcement is not proven.");
    }
    if (!vercelId || (body && !response.headers.get("x-vercel-mitigated"))) {
      throw new Error("HTTP 429 returned without enough Vercel edge evidence to distinguish the WAF from an application response.");
    }
    if (regions.size !== 1 || Date.now() - start >= windowMs) {
      throw new Error("Probe crossed regions or exceeded 60 seconds; exact rate-limit threshold is inconclusive.");
    }

    console.log(`RFQ WAF rate-limit check passed: Vercel edge HTTP 429 on attempt ${attempt}, region ${region}.`);
    console.log("- allowed probes: honeypot responses only; no durable RFQ records");
    console.log("- scope: one regional WAF counter; this does not prove a global shared counter");
    blocked = true;
    break;
  }

  if (!response.ok || body?.mode !== "honeypot") {
    throw new Error(`Attempt ${attempt} returned HTTP ${response.status} instead of the non-writing honeypot response.`);
  }
}

if (!blocked) {
  throw new Error("No Vercel edge HTTP 429 was observed within 21 requests. Check the published WAF rule and fixed-window timing.");
}
