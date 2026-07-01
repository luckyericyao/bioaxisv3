import { NextResponse } from "next/server";

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
  website?: unknown;
  startedAt?: unknown;
};

type NormalizedRfq = {
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

const fallbackToEmail = "crazyowenyao@gmail.com";
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeRequestType(value: unknown) {
  const raw = clean(value, 80).toLowerCase();
  return requestTypeAliases[raw] ?? raw;
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

function fieldLine(label: string, value: string) {
  return `${label}: ${value || "Not provided"}`;
}

function htmlRow(label: string, value: string) {
  return `<tr><th style="width:210px;text-align:left;padding:8px 10px;border-bottom:1px solid #dbe3ea;color:#0f172a;background:#f8fafc;">${escapeHtml(label)}</th><td style="padding:8px 10px;border-bottom:1px solid #dbe3ea;color:#1f2937;">${escapeHtml(value || "Not provided")}</td></tr>`;
}

function htmlSection(title: string, rows: Array<[string, string]>) {
  return `
    <section style="margin-top:22px;">
      <h2 style="margin:0 0 10px;font-size:16px;line-height:1.4;color:#0f172a;">${escapeHtml(title)}</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #dbe3ea;">
        ${rows.map(([label, value]) => htmlRow(label, value)).join("")}
      </table>
    </section>
  `;
}

function plainSection(title: string, lines: string[]) {
  return [title, "-".repeat(title.length), ...lines, ""].join("\n");
}

function formatSourcingListText(items: SourcingListEmailItem[]) {
  if (items.length === 0) {
    return "Not provided";
  }

  return items
    .map((item, index) =>
      [
        `Item ${index + 1}: ${item.title || "Not provided"}`,
        fieldLine("Path", item.path),
        fieldLine("Quantity", item.quantity),
        fieldLine("Current supplier", item.currentSupplier),
        fieldLine("Catalog number", item.catalogNumber),
        fieldLine("Equivalent needed", item.equivalentNeeded),
        fieldLine("Sample needed", item.sampleNeeded),
        fieldLine("Documentation needed", item.documentationNeeded),
        fieldLine("Notes", item.notes),
        fieldLine("Source page", item.sourcePageUrl),
        fieldLine("Added", item.addedAt)
      ].join("\n")
    )
    .join("\n\n");
}

function formatSourcingListHtml(items: SourcingListEmailItem[]) {
  if (items.length === 0) {
    return "<p style=\"margin:0;color:#475569;\">Not provided</p>";
  }

  return items
    .map(
      (item, index) => `
        <div style="margin:0 0 14px;border:1px solid #dbe3ea;padding:12px;background:#ffffff;">
          <p style="margin:0 0 8px;font-weight:700;color:#0f172a;">Item ${index + 1}: ${escapeHtml(item.title || "Not provided")}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
            ${[
              ["Path", item.path],
              ["Quantity", item.quantity],
              ["Current supplier", item.currentSupplier],
              ["Catalog number", item.catalogNumber],
              ["Equivalent needed", item.equivalentNeeded],
              ["Sample needed", item.sampleNeeded],
              ["Documentation needed", item.documentationNeeded],
              ["Notes", item.notes],
              ["Source page", item.sourcePageUrl],
              ["Added", item.addedAt]
            ]
              .map(([label, value]) => htmlRow(label, value))
              .join("")}
          </table>
        </div>
      `
    )
    .join("");
}

function buildEmail(referenceId: string, request: NormalizedRfq) {
  const requestLabel = requestTypeLabels[request.requestType] ?? request.requestType;
  const summaryRows: Array<[string, string]> = [
    ["Reference", referenceId],
    ["Request type", requestLabel],
    ["Submitted", new Date().toISOString()]
  ];
  const contactRows: Array<[string, string]> = [
    ["Name", request.name],
    ["Email", request.email],
    ["Organization / company", request.organization],
    ["Phone", request.phone],
    ["Role / title", request.roleTitle],
    ["Shipping region", request.shippingRegion]
  ];
  const detailRows: Array<[string, string]> = [
    ["Product segment / category", request.productCategory],
    ["Product family", request.productFamily],
    ["Product name", request.productName],
    ["Current supplier", request.currentSupplier],
    ["Catalog number", request.catalogNumber],
    ["Quantity", request.quantity],
    ["Timeline", request.timeline],
    ["Required documents", request.documentationNeeds],
    ["Sterile / non-sterile preference", request.sterileStatus],
    ["Equivalent needed", request.equivalentNeeded],
    ["Sample needed", request.sampleNeeded],
    ["Recurring supply needed", request.recurringSupplyNeeded]
  ];
  const productContextRows: Array<[string, string]> = [
    ["Request type", requestTypeLabels[request.productContext.requestType] ?? request.productContext.requestType],
    ["Product", request.productContext.productName],
    ["Family", request.productContext.productFamily],
    ["Category", request.productContext.productCategory],
    ["Segment", request.productContext.productSegment],
    ["Product URL", request.productContext.productUrl],
    ["Source page", request.productContext.sourcePageUrl],
    ["Auto-captured specs", request.productContext.relevantSpecs.join("; ")],
    ["Documentation notes", request.productContext.documentationNotes.join("; ")],
    ["Captured at", request.productContext.timestamp]
  ];
  const sourceRows: Array<[string, string]> = [
    ["Source page URL", request.sourcePageUrl],
    ["Referrer", request.referrer],
    ["UTM params", Object.entries(request.utm).map(([key, value]) => `${key}=${value}`).join(", ")]
  ];

  const text = [
    `New BioAxis request`,
    "",
    plainSection("Request summary", summaryRows.map(([label, value]) => fieldLine(label, value))),
    plainSection("Contact information", contactRows.map(([label, value]) => fieldLine(label, value))),
    plainSection("Auto-captured product context", productContextRows.map(([label, value]) => fieldLine(label, value))),
    plainSection("Optional customer notes", [request.message || "Not provided"]),
    plainSection("Optional supplier/catalog/quantity/docs/timeline fields", detailRows.map(([label, value]) => fieldLine(label, value))),
    plainSection("Pasted product list", [request.productList || "Not provided"]),
    plainSection("Sourcing list items", [formatSourcingListText(request.sourcingListItems)]),
    plainSection("Source page / timestamp", sourceRows.map(([label, value]) => fieldLine(label, value))),
    "Reply instruction: Reply directly to the submitter if reply-to is valid."
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #dbe3ea;padding:24px;">
        <p style="margin:0 0 6px;color:#0f766e;font-size:12px;font-weight:700;text-transform:uppercase;">BioAxis RFQ</p>
        <h1 style="margin:0;font-size:24px;line-height:1.25;color:#0f172a;">New BioAxis request</h1>
        ${htmlSection("Request summary", summaryRows)}
        ${htmlSection("Contact information", contactRows)}
        ${htmlSection("Auto-captured product context", productContextRows)}
        ${htmlSection("Optional supplier/catalog/quantity/docs/timeline fields", detailRows)}
        <section style="margin-top:22px;">
          <h2 style="margin:0 0 10px;font-size:16px;line-height:1.4;color:#0f172a;">Pasted product list</h2>
          <pre style="white-space:pre-wrap;margin:0;border:1px solid #dbe3ea;background:#f8fafc;padding:12px;color:#1f2937;font-family:Menlo,Consolas,monospace;font-size:13px;">${escapeHtml(request.productList || "Not provided")}</pre>
        </section>
        <section style="margin-top:22px;">
          <h2 style="margin:0 0 10px;font-size:16px;line-height:1.4;color:#0f172a;">Optional customer notes</h2>
          <pre style="white-space:pre-wrap;margin:0;border:1px solid #dbe3ea;background:#f8fafc;padding:12px;color:#1f2937;font-family:Menlo,Consolas,monospace;font-size:13px;">${escapeHtml(request.message || "Not provided")}</pre>
        </section>
        <section style="margin-top:22px;">
          <h2 style="margin:0 0 10px;font-size:16px;line-height:1.4;color:#0f172a;">Sourcing list items</h2>
          ${formatSourcingListHtml(request.sourcingListItems)}
        </section>
        ${htmlSection("Source page / timestamp", sourceRows)}
        <p style="margin:22px 0 0;color:#475569;font-size:13px;">Reply instruction: Reply directly to the submitter if reply-to is valid.</p>
      </div>
    </div>
  `;

  return { text, html };
}

async function sendResendEmail(referenceId: string, request: NormalizedRfq) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BIOAXIS_RFQ_TO_EMAIL;
  const fromEmail = process.env.BIOAXIS_RFQ_FROM_EMAIL || "onboarding@resend.dev";
  const fallbackReplyTo = process.env.BIOAXIS_RFQ_REPLY_TO_EMAIL || toEmail || fallbackToEmail;

  if (!apiKey || !toEmail) {
    // TODO: Configure Resend env vars in production so captured requests are delivered by email.
    return { mode: "captured" as const };
  }

  const requestLabel = requestTypeLabels[request.requestType] ?? request.requestType;
  const senderName = request.productName || request.organization || request.name || request.email;
  const subject = `[BioAxis RFQ] ${requestLabel} — ${senderName}`;
  const { text, html } = buildEmail(referenceId, request);
  const replyTo = isValidEmail(request.email) ? request.email : fallbackReplyTo;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: `BioAxis RFQ <${fromEmail}>`,
      to: [toEmail],
      reply_to: replyTo,
      subject,
      text,
      html
    })
  });

  if (!response.ok) {
    return { mode: "error" as const };
  }

  return { mode: "email" as const };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (contentLength > maxPayloadBytes) {
    return NextResponse.json({ error: "Request payload is too large." }, { status: 413 });
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

  const normalized = normalizePayload(payload, request);
  const validationError = validateRequest(normalized);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const referenceId = `BIOAXIS-${Date.now().toString(36).toUpperCase()}`;

  try {
    const delivery = await sendResendEmail(referenceId, normalized);

    if (delivery.mode === "error") {
      return NextResponse.json(
        {
          error: "Something went wrong while submitting your request. Please email crazyowenyao@gmail.com directly.",
          referenceId
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      mode: delivery.mode,
      referenceId,
      message: "Request received. BioAxis will follow up by email if specs, documents, samples, or quantity need clarification."
    });
  } catch {
    return NextResponse.json(
      {
        error: "Something went wrong while submitting your request. Please email crazyowenyao@gmail.com directly.",
        referenceId
      },
      { status: 502 }
    );
  }
}
