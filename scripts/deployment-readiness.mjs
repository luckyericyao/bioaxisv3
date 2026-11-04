const baseUrl = process.argv[2] ?? process.env.READINESS_BASE_URL ?? "https://bioaxisv3.vercel.app";
const targetUrl = new URL(baseUrl);
const failures = [];
const shaPattern = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;
const expectedReleaseValue = process.env.EXPECTED_RELEASE_SHA;
const expectedReleaseSha = expectedReleaseValue?.trim().toLowerCase();

if (expectedReleaseValue !== undefined && !shaPattern.test(expectedReleaseSha ?? "")) {
  console.error("Deployment readiness failed:");
  console.error("- EXPECTED_RELEASE_SHA must be a full 40- or 64-character hexadecimal Git SHA.");
  console.error("- release: unknown");
  process.exit(1);
}

async function get(pathname) {
  return fetch(new URL(pathname, baseUrl), {
    headers: { "Cache-Control": "no-cache" }
  });
}

for (const pathname of ["/", "/products", "/request-quote", "/equivalent-finder", "/ready-supply", "/trust-center"]) {
  const response = await get(pathname);

  if (!response.ok) {
    failures.push(`${pathname}: HTTP ${response.status}`);
  }
}

const trustCenterResponse = await get("/trust-center");
let trustEvidenceStatus = "unknown";

if (trustCenterResponse.ok) {
  const trustCenterHtml = await trustCenterResponse.text();
  const trustEvidenceMatch = trustCenterHtml.match(/data-business-facts-status="(complete|incomplete)"/i);

  if (!trustEvidenceMatch) {
    failures.push("/trust-center: missing business-information publication status");
  } else {
    trustEvidenceStatus = trustEvidenceMatch[1].toLowerCase();

    if (process.env.REQUIRE_TRUST_EVIDENCE === "1" && trustEvidenceStatus !== "complete") {
      failures.push("/trust-center: owner-approved public business information is incomplete");
    }
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

// Only print a validated public SHA, never arbitrary remote response content.
const reportedRelease = typeof rfqHealth?.release === "string" ? rfqHealth.release.trim().toLowerCase() : "";
const release = shaPattern.test(reportedRelease) ? reportedRelease : "unknown";

if (expectedReleaseSha && release !== expectedReleaseSha) {
  failures.push(`/api/rfq: release mismatch (expected ${expectedReleaseSha}; received ${release})`);
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
  console.error(`- release: ${release}`);
  process.exit(1);
}

console.log(`Deployment readiness passed for ${baseUrl}`);
console.log(`- release: ${release}`);
console.log("- core routes: ready");
console.log("- security headers: ready");
console.log("- RFQ durable queue: reachable");
console.log("- RFQ anti-spam: configured");
console.log("- RFQ internal lookup: configured");
console.log(`- public business information: ${trustEvidenceStatus}`);
