import { publicEnvironmentMapping, validateTrustIntake } from "./validate-public-trust-intake.mjs";

const valid = {
  legalName: { value: "QA BioAxis Entity", evidence: "Official registry record QA-123" },
  operatingRegion: { value: "QA region and registered address", evidence: "Official address record QA-123" },
  businessEmail: { value: "sourcing@qa-enterprise.example", evidence: "Public DNS ownership record" },
  responseTarget: { value: "Within two business days", evidence: "Published response policy" },
  evidenceAsOf: "2020-01-02",
  publicationApproved: true
};

const cases = [
  ["complete approved intake", valid, 0],
  ["consumer email", { ...valid, businessEmail: { ...valid.businessEmail, value: "qa@gmail.com" } }, 1],
  ["missing evidence", { ...valid, legalName: { ...valid.legalName, evidence: "" } }, 1],
  ["non-measurable response", { ...valid, responseTarget: { ...valid.responseTarget, value: "We reply promptly" } }, 1],
  ["invalid date", { ...valid, evidenceAsOf: "2020-02-31" }, 1],
  ["future date", { ...valid, evidenceAsOf: "2999-01-01" }, 1],
  ["publication not approved", { ...valid, publicationApproved: false }, 1]
];

const failures = [];
for (const [name, intake, minimumErrors] of cases) {
  const errors = validateTrustIntake(intake);
  if (minimumErrors === 0 ? errors.length !== 0 : errors.length < minimumErrors) {
    failures.push(`${name}: expected ${minimumErrors === 0 ? "no" : "at least one"} error, got ${errors.join("; ") || "none"}`);
  }
  console.log(`${name}: ${errors.length === 0 ? "ready" : "rejected"}`);
}

const mapping = publicEnvironmentMapping(valid);
if (Object.keys(mapping).length !== 9 || mapping.NEXT_PUBLIC_BIOAXIS_BUSINESS_EMAIL !== valid.businessEmail.value) {
  failures.push("public environment mapping is incomplete");
}

if (failures.length > 0) {
  console.error("Public trust intake regression failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Public trust intake regression passed.");
