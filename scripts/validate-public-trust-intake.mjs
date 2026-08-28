import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";

const consumerEmailDomains = new Set([
  "126.com",
  "163.com",
  "gmail.com",
  "hotmail.com",
  "icloud.com",
  "outlook.com",
  "qq.com",
  "yahoo.com"
]);

function isEvidenceDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf())
    && parsed.toISOString().slice(0, 10) === value
    && value <= new Date().toISOString().slice(0, 10);
}

function cleanPublicText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasMeasurableTimeWindow(value) {
  return /\b(?:\d+|one|two|three|four|five|six|seven)\s+(?:business\s+)?(?:hour|hours|day|days)\b/i.test(value);
}

export function validateTrustIntake(intake) {
  const errors = [];
  const fields = [
    ["legalName", "legal operating entity"],
    ["operatingRegion", "operating region and business address"],
    ["businessEmail", "enterprise-domain contact email"],
    ["responseTarget", "response-time target"]
  ];

  if (!intake || typeof intake !== "object" || Array.isArray(intake)) {
    return ["intake must be a JSON object"];
  }

  for (const [key, label] of fields) {
    const record = intake[key];
    const value = cleanPublicText(record?.value);
    const evidence = cleanPublicText(record?.evidence);
    if (!value) errors.push(`${label}: public value is required`);
    if (!evidence) errors.push(`${label}: public evidence source is required`);
    if (value.length > 500 || evidence.length > 1_000) errors.push(`${label}: public text is unexpectedly long`);
  }

  const email = cleanPublicText(intake.businessEmail?.value);
  const emailMatch = email.match(/^[^@\s]+@([^@\s]+\.[^@\s]+)$/);
  if (email && !emailMatch) {
    errors.push("enterprise-domain contact email: invalid email format");
  } else if (emailMatch && consumerEmailDomains.has(emailMatch[1].toLowerCase())) {
    errors.push("enterprise-domain contact email: consumer email domains are not publishable as enterprise contact evidence");
  }

  const responseTarget = cleanPublicText(intake.responseTarget?.value);
  if (responseTarget && !hasMeasurableTimeWindow(responseTarget)) {
    errors.push("response-time target: include a measurable number of business hours or days");
  }

  if (!isEvidenceDate(cleanPublicText(intake.evidenceAsOf))) {
    errors.push("evidenceAsOf: use a real, non-future YYYY-MM-DD review date");
  }

  if (intake.publicationApproved !== true) {
    errors.push("publicationApproved: owner must explicitly approve public website publication");
  }

  return errors;
}

export function publicEnvironmentMapping(intake) {
  return {
    NEXT_PUBLIC_BIOAXIS_LEGAL_NAME: cleanPublicText(intake.legalName.value),
    NEXT_PUBLIC_BIOAXIS_LEGAL_EVIDENCE: cleanPublicText(intake.legalName.evidence),
    NEXT_PUBLIC_BIOAXIS_OPERATING_REGION: cleanPublicText(intake.operatingRegion.value),
    NEXT_PUBLIC_BIOAXIS_OPERATING_EVIDENCE: cleanPublicText(intake.operatingRegion.evidence),
    NEXT_PUBLIC_BIOAXIS_BUSINESS_EMAIL: cleanPublicText(intake.businessEmail.value),
    NEXT_PUBLIC_BIOAXIS_CONTACT_EVIDENCE: cleanPublicText(intake.businessEmail.evidence),
    NEXT_PUBLIC_BIOAXIS_RESPONSE_TARGET: cleanPublicText(intake.responseTarget.value),
    NEXT_PUBLIC_BIOAXIS_RESPONSE_EVIDENCE: cleanPublicText(intake.responseTarget.evidence),
    NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF: cleanPublicText(intake.evidenceAsOf)
  };
}

async function main() {
  const args = process.argv.slice(2);
  const intakePath = args.find((arg) => !arg.startsWith("--"));
  const emitEnvJson = args.includes("--emit-env-json");

  if (!intakePath) {
    console.error("Usage: npm run validate:trust-intake -- /absolute/path/to/intake.json [--emit-env-json]");
    process.exit(2);
  }

  let intake;
  try {
    intake = JSON.parse(await fs.readFile(intakePath, "utf8"));
  } catch (error) {
    console.error(`Unable to read valid JSON: ${error instanceof Error ? error.message : "unknown error"}`);
    process.exit(2);
  }

  const errors = validateTrustIntake(intake);
  if (errors.length > 0) {
    console.error("Public trust intake is not ready:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Public trust intake structure passed.");
  console.log("Manual source authenticity and entity-attribution review is still required before publication.");
  if (emitEnvJson) console.log(JSON.stringify(publicEnvironmentMapping(intake), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
