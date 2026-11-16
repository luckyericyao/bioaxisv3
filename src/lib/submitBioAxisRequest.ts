import { isBioAxisRequestId } from "./clientRequestId";

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
  requestId?: string;
  website?: string;
  startedAt?: number;
  turnstileToken?: string;
};

export type BioAxisRequestResponse =
  | { ok: true; mode: "durable-queue"; message: string; referenceId: string }
  | { ok: false; httpStatus: number; error: string };

export const requestSuccessMessage = "Request received and stored for BioAxis review.";
export const requestErrorMessage = "We couldn't confirm that your request was saved. Your entries are still here. Retry using this reference.";
const confirmationTimeoutMs = 30_000;

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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), confirmationTimeoutMs);
  try {
    const response = await fetch("/api/rfq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(enrichedPayload),
      signal: controller.signal
    });
    const parsed: unknown = await response.json().catch((error) => {
      if (controller.signal.aborted) throw error;
      return null;
    });
    const body = parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : null;

    if (response.ok && body?.ok === true && body.mode === "durable-queue" && isBioAxisRequestId(body.referenceId)) {
      return {
        ok: true,
        mode: "durable-queue",
        referenceId: body.referenceId,
        message: typeof body.message === "string" && body.message.trim() ? body.message : requestSuccessMessage
      };
    }

    return {
      ok: false,
      httpStatus: response.status,
      error: !response.ok && typeof body?.error === "string" && body.error.trim()
        ? body.error
        : response.status === 429
          ? "Too many requests. Please wait a moment and try again; your entries are still here."
          : requestErrorMessage
    };
  } finally {
    clearTimeout(timeout);
  }
}
