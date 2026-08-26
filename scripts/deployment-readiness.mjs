const baseUrl = process.argv[2] ?? process.env.READINESS_BASE_URL ?? "https://bioaxisv3.vercel.app";
const targetUrl = new URL(baseUrl);
const failures = [];

async function get(pathname) {
  return fetch(new URL(pathname, baseUrl), {
    headers: { "Cache-Control": "no-cache" }
  });
}

for (const pathname of ["/", "/products", "/request-quote", "/equivalent-finder", "/ready-supply"]) {
  const response = await get(pathname);

  if (!response.ok) {
    failures.push(`${pathname}: HTTP ${response.status}`);
  }
}

const homepageResponse = await get("/");
const requiredSecurityHeaders = [
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy"
];

if (targetUrl.protocol === "https:") {
  requiredSecurityHeaders.push("strict-transport-security");
}

for (const header of requiredSecurityHeaders) {
  if (!homepageResponse.headers.get(header)) {
    failures.push(`/: missing security header ${header}`);
  }
}

const rfqHealthResponse = await get("/api/rfq");
let rfqHealth;

try {
  rfqHealth = await rfqHealthResponse.json();
} catch {
  failures.push(`/api/rfq: invalid readiness response (HTTP ${rfqHealthResponse.status})`);
}

if (!rfqHealth?.ready) {
  const durableQueue = rfqHealth?.services?.durableQueue ?? "unknown";
  const antiSpam = rfqHealth?.services?.antiSpam ?? "unknown";
  const internalLookup = rfqHealth?.services?.internalLookup ?? "unknown";
  failures.push(`/api/rfq: not ready (durable queue: ${durableQueue}; anti-spam: ${antiSpam}; internal lookup: ${internalLookup})`);
}

if (failures.length > 0) {
  console.error("Deployment readiness failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Deployment readiness passed for ${baseUrl}`);
console.log("- core routes: ready");
console.log("- security headers: ready");
console.log("- RFQ durable queue: reachable");
console.log("- RFQ anti-spam: configured");
console.log("- RFQ internal lookup: configured");
