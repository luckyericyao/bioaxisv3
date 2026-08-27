export type PublicTrustFact = {
  question: "Who" | "Where" | "How" | "When" | "Evidence";
  label: string;
  value: string;
  status: "verified" | "not-published";
  source: string;
};

const configuredTrustEvidenceAsOf = process.env.NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF?.trim() || "";
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

function isPublishableEvidenceDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf())
    && parsed.toISOString().slice(0, 10) === value
    && value <= new Date().toISOString().slice(0, 10);
}

function isEnterpriseDomainEmail(value: string) {
  const match = value.match(/^[^@\s]+@([^@\s]+\.[^@\s]+)$/);
  return Boolean(match && !consumerEmailDomains.has(match[1].toLowerCase()));
}

function configuredFact(
  question: PublicTrustFact["question"],
  label: string,
  value: string | undefined,
  evidence: string | undefined,
  missingValue: string,
  sourceLabel: string,
  validateValue: (value: string) => boolean = () => true
): PublicTrustFact {
  const cleanValue = value?.trim();
  const cleanEvidence = evidence?.trim();
  const evidenceDateReady = isPublishableEvidenceDate(configuredTrustEvidenceAsOf);
  const valueReady = Boolean(cleanValue && validateValue(cleanValue));
  const verified = Boolean(valueReady && cleanEvidence && evidenceDateReady);
  const missingEvidence = [
    !valueReady ? "valid publishable fact" : "",
    !cleanEvidence ? "evidence source" : "",
    !evidenceDateReady ? "valid evidence date" : ""
  ].filter(Boolean);

  return {
    question,
    label,
    value: verified ? cleanValue! : missingValue,
    status: verified ? "verified" : "not-published",
    source: verified
      ? `${sourceLabel}: ${cleanEvidence}. Reviewed ${configuredTrustEvidenceAsOf}.`
      : `Incomplete verification record: missing ${missingEvidence.join(", ")}.`
  };
}

export const trustEvidenceAsOf = isPublishableEvidenceDate(configuredTrustEvidenceAsOf)
  ? configuredTrustEvidenceAsOf
  : "2026-08-26";

export const publicTrustFacts: PublicTrustFact[] = [
  configuredFact(
    "Who",
    "Operating identity",
    process.env.NEXT_PUBLIC_BIOAXIS_LEGAL_NAME,
    process.env.NEXT_PUBLIC_BIOAXIS_LEGAL_EVIDENCE,
    "Legal operating identity has not been publicly verified.",
    "Organization record"
  ),
  configuredFact(
    "Where",
    "Operating region",
    process.env.NEXT_PUBLIC_BIOAXIS_OPERATING_REGION,
    process.env.NEXT_PUBLIC_BIOAXIS_OPERATING_EVIDENCE,
    "Operating region and business address have not been publicly verified.",
    "Address or registration record"
  ),
  configuredFact(
    "How",
    "Enterprise contact",
    process.env.NEXT_PUBLIC_BIOAXIS_BUSINESS_EMAIL,
    process.env.NEXT_PUBLIC_BIOAXIS_CONTACT_EVIDENCE,
    "No enterprise-domain contact has been publicly verified.",
    "Enterprise-domain ownership record",
    isEnterpriseDomainEmail
  ),
  configuredFact(
    "When",
    "Response target",
    process.env.NEXT_PUBLIC_BIOAXIS_RESPONSE_TARGET,
    process.env.NEXT_PUBLIC_BIOAXIS_RESPONSE_EVIDENCE,
    "No public response-time commitment has been verified.",
    "Operating response policy"
  ),
  {
    question: "How",
    label: "Request handling",
    value: "Validated requests receive a reference ID and are stored in a private durable queue for internal lookup before success is shown.",
    status: "verified",
    source: `Production intake implementation and storage configuration reviewed ${trustEvidenceAsOf}.`
  },
  {
    question: "Evidence",
    label: "Data use",
    value: "Submitted contact and product context is used for sourcing review, follow-up, operational traceability, and request security. It is not published as a customer catalog.",
    status: "verified",
    source: `Privacy notice and intake payload reviewed ${trustEvidenceAsOf}.`
  }
];

export const verifiedPublicTrustFacts = publicTrustFacts.filter((fact) => fact.status === "verified");

const requiredPublicTrustLabels = new Set([
  "Operating identity",
  "Operating region",
  "Enterprise contact",
  "Response target"
]);
const requiredPublicTrustFacts = publicTrustFacts.filter((fact) => requiredPublicTrustLabels.has(fact.label));

export const publicTrustEvidenceSummary = {
  verified: requiredPublicTrustFacts.filter((fact) => fact.status === "verified").length,
  required: requiredPublicTrustFacts.length,
  complete: requiredPublicTrustFacts.every((fact) => fact.status === "verified")
};
