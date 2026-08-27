import { NextResponse } from "next/server";
import { alertBioAxisFailure } from "@/lib/server/alertBioAxisFailure";
import { recordBioAxisEvent } from "@/lib/server/recordBioAxisEvent";
import { checkRfqQueueConnection, enqueueRfq, rfqQueueConfigured } from "@/lib/server/rfqQueue";

export const dynamic = "force-dynamic";

type RfqPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  organization?: unknown;
  phone?: unknown;
  roleTitle?: unknown;
  requestType?: unknown;
  productCategory?: unknown;
  productSegment?: unknown;
  productFamily?: unknown;
  productName?: unknown;
  catalogNumber?: unknown;
  currentSupplier?: unknown;
  supplier?: unknown;
  quantity?: unknown;
  timeline?: unknown;
  shippingRegion?: unknown;
  documentationNeeds?: unknown;
  sterileStatus?: unknown;
  equivalentNeeded?: unknown;
  sampleNeeded?: unknown;
  recurringSupplyNeeded?: unknown;
  productList?: unknown;
  sourcingListItems?: unknown;
  message?: unknown;
  sourcePageUrl?: unknown;
  referrer?: unknown;
  utm?: unknown;
  productContext?: unknown;
  requestId?: unknown;
  website?: unknown;
  startedAt?: unknown;
  turnstileToken?: unknown;
};

type TurnstileVerificationResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

type NormalizedRfq = {
  requestId: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
  roleTitle: string;
  requestType: string;
  productCategory: string;
  productSegment: string;
  productFamily: string;
  productName: string;
  catalogNumber: string;
  currentSupplier: string;
  quantity: string;
  timeline: string;
  shippingRegion: string;
  documentationNeeds: string;
  sterileStatus: string;
  equivalentNeeded: string;
  sampleNeeded: string;
  recurringSupplyNeeded: string;
  productList: string;
  sourcingListItems: SourcingListEmailItem[];
  message: string;
  sourcePageUrl: string;
  referrer: string;
  utm: Record<string, string>;
  productContext: ProductContextEmail;
};

type SourcingListEmailItem = {
  title: string;
  path: string;
  quantity: string;
  currentSupplier: string;
  catalogNumber: string;
  equivalentNeeded: string;
  sampleNeeded: string;
  documentationNeeded: string;
  notes: string;
  sourcePageUrl: string;
  addedAt: string;
};

type ProductContextEmail = {
  requestType: string;
  productName: string;
  productFamily: string;
  productCategory: string;
  productSegment: string;
  productUrl: string;
  sourcePageUrl: string;
  relevantSpecs: string[];
  documentationNotes: string[];
  timestamp: string;
};

const maxPayloadBytes = 160_000;
const maxProductListLength = 12_000;
const maxMessageLength = 8_000;
const maxFieldLength = 800;
const maxSourcingListItems = 30;
const minimumSubmitDelayMs = 700;
const rfqRateWindowMs = 60_000;
const rfqRateLimit = 20;
const rfqRateLimitStore = new Map<string, { count: number; resetAt: number }>();

const verificationErrorMessage = "Please complete the verification and try again.";
const requestTypeAliases: Record<string, string> = {
  rfq: "quote",
  "quote-request": "quote",
  "quote request": "quote",
  "equivalent request": "equivalent",
  "equivalent finding": "equivalent",
  "equivalent-finding": "equivalent",
  "equivalent-review": "equivalent",
  "sample request": "sample",
  sample: "sample",
  "documentation request": "documentation",
  documentation: "documentation",
  docs: "documentation",
  documents: "documentation",
  "recurring supply request": "recurring-supply",
  "contact request": "contact",
  contact: "contact",
  "product list review": "product-list-review",
  "private-label": "private-label",
  "private-label-oem": "private-label",
  "oem": "private-label",
  "oem-style": "private-label",
  recurring: "recurring-supply",
  "product-list": "product-list-review",
  "product list": "product-list-review",
  support: "contact",
  general: "contact"
};

const requestTypeLabels: Record<string, string> = {
  quote: "Quote Request",
  equivalent: "Equivalent Request",
  sample: "Sample Request",
  documentation: "Documentation Request",
  "recurring-supply": "Recurring Supply Request",
  "private-label": "Private Label / OEM Request",
  contact: "Contact Request",
  "product-list-review": "Product List Review"
};

const supportedRequestTypes = new Set(Object.keys(requestTypeLabels));

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value: unknown, limit = maxFieldLength) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function cleanBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }

  return clean(value, 20);
}

function normalizeRequestType(value: unknown) {
  const raw = clean(value, 80).toLowerCase();
  return requestTypeAliases[raw] ?? raw;
}

function normalizeRequestId(value: unknown) {
  return clean(value, 100).replace(/[^a-zA-Z0-9_-]/g, "");
}

function normalizeSupportedRequestType(value: unknown) {
  const normalized = normalizeRequestType(value);
  return supportedRequestTypes.has(normalized) ? normalized : "quote";
}

function normalizeUtm(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key.startsWith("utm_"))
      .map(([key, item]) => [clean(key, 80), clean(item, 240)])
      .filter(([key, item]) => key && item)
  );
}

function normalizeSourcingListItems(value: unknown): SourcingListEmailItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, maxSourcingListItems).map((item) => {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const path = [
      clean(record.segmentTitle, 140),
      clean(record.categoryTitle, 140),
      clean(record.familyTitle, 140),
      clean(record.productTitle, 140)
    ]
      .filter(Boolean)
      .join(" / ");

    return {
      title: clean(record.title, 240),
      path: path || clean(record.href, 500),
      quantity: clean(record.quantity, 120),
      currentSupplier: clean(record.currentSupplier, 180),
      catalogNumber: clean(record.catalogNumber, 180),
      equivalentNeeded: cleanBoolean(record.equivalentNeeded),
      sampleNeeded: cleanBoolean(record.sampleNeeded),
      documentationNeeded: cleanBoolean(record.documentationNeeded),
      notes: clean(record.notes, 1200),
      sourcePageUrl: clean(record.sourcePageUrl || record.href, 1000),
      addedAt: clean(record.addedAt, 80)
    };
  });
}

function normalizeStringArray(value: unknown, limit = 8) {
  return Array.isArray(value)
    ? value
        .map((item) => clean(item, 500))
        .filter(Boolean)
        .slice(0, limit)
    : [];
}

function normalizeProductContext(value: unknown, requestType: string): ProductContextEmail {
  const record = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

  return {
    requestType: normalizeSupportedRequestType(record.requestType || requestType),
    productName: clean(record.productName, 260),
    productFamily: clean(record.productFamily, 220),
    productCategory: clean(record.productCategory, 220),
    productSegment: clean(record.productSegment, 220),
    productUrl: clean(record.productUrl, 1000),
    sourcePageUrl: clean(record.sourcePageUrl, 1000),
    relevantSpecs: normalizeStringArray(record.relevantSpecs),
    documentationNotes: normalizeStringArray(record.documentationNotes),
    timestamp: clean(record.timestamp, 80)
  };
}

function normalizePayload(payload: RfqPayload, request: Request): NormalizedRfq {
  const requestType = normalizeSupportedRequestType(payload.requestType);
  const organization = clean(payload.organization || payload.company, 240);
  const sourcePageUrl = clean(payload.sourcePageUrl, 1000);
  const referrer = clean(payload.referrer, 1000) || clean(request.headers.get("referer"), 1000);
  const productContext = normalizeProductContext(payload.productContext, requestType);
  const resolvedSourcePageUrl = sourcePageUrl || productContext.sourcePageUrl || productContext.productUrl;

  return {
    requestId: normalizeRequestId(payload.requestId),
    name: clean(payload.name, 180),
    email: clean(payload.email, 240),
    organization,
    phone: clean(payload.phone, 80),
    roleTitle: clean(payload.roleTitle, 160),
    requestType,
    productCategory: clean(payload.productCategory || payload.productSegment || productContext.productCategory, 240),
    productSegment: clean(payload.productSegment || productContext.productSegment, 180),
    productFamily: clean(payload.productFamily || productContext.productFamily, 220),
    productName: clean(payload.productName || productContext.productName, 260),
    catalogNumber: clean(payload.catalogNumber, 180),
    currentSupplier: clean(payload.currentSupplier || payload.supplier, 220),
    quantity: clean(payload.quantity, 120),
    timeline: clean(payload.timeline, 160),
    shippingRegion: clean(payload.shippingRegion, 180),
    documentationNeeds: clean(payload.documentationNeeds, 1200),
    sterileStatus: clean(payload.sterileStatus, 120),
    equivalentNeeded: cleanBoolean(payload.equivalentNeeded),
    sampleNeeded: cleanBoolean(payload.sampleNeeded),
    recurringSupplyNeeded: cleanBoolean(payload.recurringSupplyNeeded),
    productList: clean(payload.productList, maxProductListLength),
    sourcingListItems: normalizeSourcingListItems(payload.sourcingListItems),
    message: clean(payload.message, maxMessageLength),
    sourcePageUrl: resolvedSourcePageUrl,
    referrer,
    utm: normalizeUtm(payload.utm),
    productContext
  };
}

function validateRequest(request: NormalizedRfq) {
  if (!request.email || !isValidEmail(request.email)) {
    return "Please enter an email so BioAxis can follow up.";
  }

  return "";
}

function turnstileSiteKey() {
  return (
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    process.env.TURNSTILE_SITE_KEY ||
    process.env.CLOUDFLARE_TURNSTILE_SITE_KEY ||
    ""
  );
}

async function rfqDeliveryReadiness() {
  const queueConfigured = rfqQueueConfigured();
  const queueReachable = queueConfigured ? await checkRfqQueueConnection() : false;
  const antiSpam = Boolean(process.env.TURNSTILE_SECRET_KEY && turnstileSiteKey());
  const internalLookup = Boolean(process.env.BIOAXIS_INTERNAL_API_KEY);

  return {
    ready: queueReachable && antiSpam && internalLookup,
    services: {
      durableQueue: queueReachable ? "reachable" : queueConfigured ? "unreachable" : "missing",
      antiSpam: antiSpam ? "configured" : "missing",
      internalLookup: internalLookup ? "configured" : "missing"
    }
  };
}

function remoteIpFromRequest(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers
      .get("x-forwarded-for")
      ?.split(",")
      .map((item) => item.trim())
      .find(Boolean) ||
    ""
  );
}

async function validateTurnstileToken(token: string, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret || !turnstileSiteKey()) {
    return "";
  }

  if (!token) {
    return verificationErrorMessage;
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  const remoteIp = remoteIpFromRequest(request);
  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData
    });
    const result = (await response.json()) as TurnstileVerificationResponse;

    return result.success ? "" : verificationErrorMessage;
  } catch {
    return verificationErrorMessage;
  }
}

function isRfqRateLimited(request: Request) {
  const key = remoteIpFromRequest(request) || "anonymous";
  const now = Date.now();
  const current = rfqRateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rfqRateLimitStore.set(key, { count: 1, resetAt: now + rfqRateWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > rfqRateLimit;
}

export async function GET() {
  const readiness = await rfqDeliveryReadiness();

  return NextResponse.json(
    {
      ok: readiness.ready,
      ready: readiness.ready,
      services: readiness.services
    },
    {
      status: readiness.ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    }
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (contentLength > maxPayloadBytes) {
    return NextResponse.json({ error: "Request payload is too large." }, { status: 413 });
  }

  if (isRfqRateLimited(request)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  let payload: RfqPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (clean(payload.website, 120)) {
    return NextResponse.json({
      ok: true,
      mode: "honeypot",
      message: "Request received. BioAxis will follow up by email if specs, documents, samples, or quantity need clarification."
    });
  }

  const startedAt = typeof payload.startedAt === "number" ? payload.startedAt : Number(payload.startedAt ?? 0);
  if (startedAt && Date.now() - startedAt < minimumSubmitDelayMs) {
    return NextResponse.json({
      ok: true,
      mode: "honeypot",
      message: "Request received. BioAxis will follow up by email if specs, documents, samples, or quantity need clarification."
    });
  }

  const verificationError = await validateTurnstileToken(clean(payload.turnstileToken, 4096), request);

  if (verificationError) {
    const requestId = normalizeRequestId(payload.requestId);
    void recordBioAxisEvent("turnstile_failure", { requestId, reason: "server_validation" }, "/api/rfq");
    void alertBioAxisFailure({ requestId, stage: "turnstile", detail: "Server-side verification rejected the request." });
    return NextResponse.json({ error: verificationError }, { status: 400 });
  }

  const normalized = normalizePayload(payload, request);
  const validationError = validateRequest(normalized);

  if (validationError) {
    void recordBioAxisEvent("rfq_error", { requestId: normalized.requestId, reason: "validation", requestType: normalized.requestType }, "/api/rfq");
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const referenceId = normalized.requestId || `BIOAXIS-${Date.now().toString(36).toUpperCase()}`;

  try {
    void recordBioAxisEvent("rfq_delivery", { requestId: referenceId, deliveryMode: "durable-queue", stage: "queue_write_start" }, "/api/rfq");
    const delivery = await enqueueRfq(referenceId, normalized);
    void recordBioAxisEvent(
      "rfq_queue_write_succeeded",
      {
        requestId: referenceId,
        deliveryMode: "durable-queue",
        queuePath: delivery.pathname,
        queueEtag: delivery.etag,
        replayed: delivery.replayed
      },
      "/api/rfq"
    );

    return NextResponse.json({
      ok: true,
      mode: "durable-queue",
      replayed: delivery.replayed,
      referenceId,
      requestId: referenceId,
      message: "Request received and stored for BioAxis review. We will follow up by email if specs, documents, samples, or quantity need clarification."
    });
  } catch (error) {
    console.error("[BioAxis RFQ queue] submission failed", { requestId: referenceId, error });
    void recordBioAxisEvent("rfq_queue_write_failed", { requestId: referenceId, deliveryMode: "durable-queue", stage: "queue_write", outcome: "error" }, "/api/rfq");
    void alertBioAxisFailure({ requestId: referenceId, stage: "queue_write", detail: "The durable RFQ queue rejected or failed to store the request." });
    return NextResponse.json(
      {
        error: "Your request was not stored. Your form is still intact—keep this page open and retry using this reference.",
        referenceId,
        requestId: referenceId
      },
      { status: 503 }
    );
  }
}
