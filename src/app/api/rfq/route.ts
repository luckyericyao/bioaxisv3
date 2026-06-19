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
  website?: unknown;
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
};

const maxPayloadBytes = 160_000;
const maxProductListLength = 12_000;
const maxMessageLength = 8_000;
const maxFieldLength = 800;
const maxSourcingListItems = 30;

const fallbackToEmail = "crazyowenyao@gmail.com";
const requestTypeAliases: Record<string, string> = {
  "quote request": "quote",
  "equivalent request": "equivalent",
  "sample request": "sample",
  "documentation request": "documentation",
  "recurring supply request": "recurring-supply",
  "contact request": "contact",
  "product list review": "product-list-review",
  recurring: "recurring-supply",
  "product-list": "product-list-review",
  support: "contact",
  general: "contact"
};

const requestTypeLabels: Record<string, string> = {
  quote: "Quote Request",
  equivalent: "Equivalent Request",
  sample: "Sample Request",
  documentation: "Documentation Request",
  "recurring-supply": "Recurring Supply Request",
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
      notes: clean(record.notes, 1200)
    };
  });
}

function normalizePayload(payload: RfqPayload, request: Request): NormalizedRfq {
  const requestType = normalizeRequestType(payload.requestType);
  const organization = clean(payload.organization || payload.company, 240);
  const sourcePageUrl = clean(payload.sourcePageUrl, 1000);
  const referrer = clean(payload.referrer, 1000) || clean(request.headers.get("referer"), 1000);

  return {
    name: clean(payload.name, 180),
    email: clean(payload.email, 240),
    organization,
    phone: clean(payload.phone, 80),
    roleTitle: clean(payload.roleTitle, 160),
    requestType,
    productCategory: clean(payload.productCategory || payload.productSegment, 240),
    productSegment: clean(payload.productSegment, 180),
    productFamily: clean(payload.productFamily, 220),
    productName: clean(payload.productName, 260),
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
    sourcePageUrl,
    referrer,
    utm: normalizeUtm(payload.utm)
  };
}

function hasRequestDetail(request: NormalizedRfq) {
  return Boolean(
    request.message ||
      request.productList ||
      request.productName ||
      request.productCategory ||
      request.productFamily ||
      request.catalogNumber ||
      request.currentSupplier ||
      request.quantity ||
      request.documentationNeeds ||
      request.sourcingListItems.length > 0
  );
}

function validateRequest(request: NormalizedRfq) {
  if (!request.name) {
    return "Name is required.";
  }

  if (!request.email || !isValidEmail(request.email)) {
    return "A valid email is required.";
  }

  if (!request.requestType || !supportedRequestTypes.has(request.requestType)) {
    return "Supported request type is required.";
  }

  if (!hasRequestDetail(request)) {
    return "Provide a message, product detail, catalog number, supplier, quantity, product list, or documentation need.";
  }

  return "";
}

function fieldLine(label: string, value: string) {
  return `${label}: ${value || "-"}`;
}

function htmlRow(label: string, value: string) {
  return `<tr><th style="width:210px;text-align:left;padding:8px 10px;border-bottom:1px solid #dbe3ea;color:#0f172a;background:#f8fafc;">${escapeHtml(label)}</th><td style="padding:8px 10px;border-bottom:1px solid #dbe3ea;color:#1f2937;">${escapeHtml(value || "-")}</td></tr>`;
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
    return "-";
  }

  return items
    .map((item, index) =>
      [
        `Item ${index + 1}: ${item.title || "-"}`,
        fieldLine("Path", item.path),
        fieldLine("Quantity", item.quantity),
        fieldLine("Current supplier", item.currentSupplier),
        fieldLine("Catalog number", item.catalogNumber),
        fieldLine("Equivalent needed", item.equivalentNeeded),
        fieldLine("Sample needed", item.sampleNeeded),
        fieldLine("Documentation needed", item.documentationNeeded),
        fieldLine("Notes", item.notes)
      ].join("\n")
    )
    .join("\n\n");
}

function formatSourcingListHtml(items: SourcingListEmailItem[]) {
  if (items.length === 0) {
    return "<p style=\"margin:0;color:#475569;\">-</p>";
  }

  return items
    .map(
      (item, index) => `
        <div style="margin:0 0 14px;border:1px solid #dbe3ea;padding:12px;background:#ffffff;">
          <p style="margin:0 0 8px;font-weight:700;color:#0f172a;">Item ${index + 1}: ${escapeHtml(item.title || "-")}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
            ${[
              ["Path", item.path],
              ["Quantity", item.quantity],
              ["Current supplier", item.currentSupplier],
              ["Catalog number", item.catalogNumber],
              ["Equivalent needed", item.equivalentNeeded],
              ["Sample needed", item.sampleNeeded],
              ["Documentation needed", item.documentationNeeded],
              ["Notes", item.notes]
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
    ["Recurring supply needed", request.recurringSupplyNeeded],
    ["Message", request.message]
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
    plainSection("Product / sourcing details", detailRows.map(([label, value]) => fieldLine(label, value))),
    plainSection("Pasted product list", [request.productList || "-"]),
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
        ${htmlSection("Product / sourcing details", detailRows)}
        <section style="margin-top:22px;">
          <h2 style="margin:0 0 10px;font-size:16px;line-height:1.4;color:#0f172a;">Pasted product list</h2>
          <pre style="white-space:pre-wrap;margin:0;border:1px solid #dbe3ea;background:#f8fafc;padding:12px;color:#1f2937;font-family:Menlo,Consolas,monospace;font-size:13px;">${escapeHtml(request.productList || "-")}</pre>
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
    return { mode: "captured" as const };
  }

  const requestLabel = requestTypeLabels[request.requestType] ?? request.requestType;
  const senderName = request.organization || request.name;
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
      message: "Request received. BioAxis will review the details and follow up by email."
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
      message: "Request received. BioAxis will review the details and follow up by email."
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
