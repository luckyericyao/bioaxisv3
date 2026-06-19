export type BioAxisProductContext = {
  requestType?: string;
  productName?: string;
  productFamily?: string;
  productCategory?: string;
  productSegment?: string;
  productUrl?: string;
  sourcePageUrl?: string;
  relevantSpecs?: string[];
  documentationNotes?: string[];
  timestamp?: string;
};

export type BioAxisRequestPayload = {
  name?: string;
  email?: string;
  company?: string;
  organization?: string;
  phone?: string;
  roleTitle?: string;
  requestType?: string;
  productCategory?: string;
  productSegment?: string;
  productFamily?: string;
  productName?: string;
  catalogNumber?: string;
  currentSupplier?: string;
  supplier?: string;
  quantity?: string;
  timeline?: string;
  shippingRegion?: string;
  documentationNeeds?: string;
  sterileStatus?: string;
  equivalentNeeded?: string | boolean;
  sampleNeeded?: string | boolean;
  recurringSupplyNeeded?: string | boolean;
  productList?: string;
  sourcingListItems?: unknown;
  message?: string;
  sourcePageUrl?: string;
  referrer?: string;
  utm?: Record<string, string>;
  productContext?: BioAxisProductContext;
  website?: string;
};

export type BioAxisRequestResponse = {
  ok: boolean;
  mode?: "email" | "captured" | "honeypot";
  message?: string;
  referenceId?: string;
  error?: string;
};

export const requestSuccessMessage = "Request received. BioAxis will review the product context and follow up by email.";
export const requestErrorMessage = "Something went wrong while submitting your request. Please email crazyowenyao@gmail.com directly.";

function utmFromLocation() {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  params.forEach((value, key) => {
    if (key.startsWith("utm_")) {
      utm[key] = value;
    }
  });

  return utm;
}

export async function submitBioAxisRequest(payload: BioAxisRequestPayload): Promise<BioAxisRequestResponse> {
  const enrichedPayload: BioAxisRequestPayload = {
    ...payload,
    sourcePageUrl: payload.sourcePageUrl ?? (typeof window !== "undefined" ? window.location.href : ""),
    referrer: payload.referrer ?? (typeof document !== "undefined" ? document.referrer : ""),
    utm: payload.utm ?? utmFromLocation()
  };

  const response = await fetch("/api/rfq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(enrichedPayload)
  });
  const body = (await response.json()) as BioAxisRequestResponse;

  if (!response.ok) {
    return {
      ok: false,
      error: body?.error ?? requestErrorMessage,
      referenceId: body?.referenceId
    };
  }

  return body;
}
