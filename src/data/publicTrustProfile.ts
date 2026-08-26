export type PublicTrustFact = {
  question: "Who" | "Where" | "How" | "When" | "Evidence";
  label: string;
  value: string;
  status: "verified" | "not-published";
  source: string;
};

function configuredFact(
  question: PublicTrustFact["question"],
  label: string,
  value: string | undefined,
  missingValue: string,
  source: string
): PublicTrustFact {
  const cleanValue = value?.trim();

  return {
    question,
    label,
    value: cleanValue || missingValue,
    status: cleanValue ? "verified" : "not-published",
    source: cleanValue ? source : "No publishable verification record is configured."
  };
}

export const trustEvidenceAsOf = process.env.NEXT_PUBLIC_BIOAXIS_EVIDENCE_AS_OF?.trim() || "2026-08-26";

export const publicTrustFacts: PublicTrustFact[] = [
  configuredFact(
    "Who",
    "Operating identity",
    process.env.NEXT_PUBLIC_BIOAXIS_LEGAL_NAME,
    "Legal operating identity has not been publicly verified.",
    `Organization record reviewed ${trustEvidenceAsOf}.`
  ),
  configuredFact(
    "Where",
    "Operating region",
    process.env.NEXT_PUBLIC_BIOAXIS_OPERATING_REGION,
    "Operating region and business address have not been publicly verified.",
    `Address or registration record reviewed ${trustEvidenceAsOf}.`
  ),
  configuredFact(
    "How",
    "Enterprise contact",
    process.env.NEXT_PUBLIC_BIOAXIS_BUSINESS_EMAIL,
    "No enterprise-domain contact has been publicly verified.",
    `Enterprise contact ownership reviewed ${trustEvidenceAsOf}.`
  ),
  configuredFact(
    "When",
    "Response target",
    process.env.NEXT_PUBLIC_BIOAXIS_RESPONSE_TARGET,
    "No public response-time commitment has been verified.",
    `Operating response policy reviewed ${trustEvidenceAsOf}.`
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
