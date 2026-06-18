import { NextResponse } from "next/server";

type RequestQuotePayload = {
  name?: string;
  email?: string;
  company?: string;
  roleTitle?: string;
  requestType?: string;
  productCategory?: string;
  productName?: string;
  catalogNumber?: string;
  currentSupplier?: string;
  quantity?: string;
  timeline?: string;
  documentationNeeds?: string;
  sterileStatus?: string;
  message?: string;
};

const requiredFields: Array<keyof RequestQuotePayload> = [
  "name",
  "email",
  "company",
  "requestType",
  "productCategory",
  "productName"
];

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatField(label: string, value: string | undefined) {
  return `${label}: ${value && value.trim() ? value.trim() : "-"}`;
}

export async function POST(request: Request) {
  let payload: RequestQuotePayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const normalized: RequestQuotePayload = {
    name: clean(payload.name),
    email: clean(payload.email),
    company: clean(payload.company),
    roleTitle: clean(payload.roleTitle),
    requestType: clean(payload.requestType),
    productCategory: clean(payload.productCategory),
    productName: clean(payload.productName || payload.catalogNumber),
    catalogNumber: clean(payload.catalogNumber),
    currentSupplier: clean(payload.currentSupplier),
    quantity: clean(payload.quantity),
    timeline: clean(payload.timeline),
    documentationNeeds: clean(payload.documentationNeeds),
    sterileStatus: clean(payload.sterileStatus),
    message: clean(payload.message)
  };

  const missingFields = requiredFields.filter((field) => !normalized[field]);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(", ")}.` },
      { status: 400 }
    );
  }

  if (!isValidEmail(normalized.email ?? "")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const referenceId = `BIOAXIS-${Date.now().toString(36).toUpperCase()}`;
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BIOAXIS_RFQ_TO_EMAIL;
  const bodyLines = [
    `BioAxis RFQ reference: ${referenceId}`,
    "",
    formatField("Request type", normalized.requestType),
    formatField("Product category", normalized.productCategory),
    formatField("Product name or equivalent", normalized.productName),
    formatField("Catalog number", normalized.catalogNumber),
    formatField("Current supplier", normalized.currentSupplier),
    formatField("Quantity", normalized.quantity),
    formatField("Timeline", normalized.timeline),
    formatField("Sterile status", normalized.sterileStatus),
    formatField("Documentation needs", normalized.documentationNeeds),
    "",
    formatField("Name", normalized.name),
    formatField("Email", normalized.email),
    formatField("Company", normalized.company),
    formatField("Role / title", normalized.roleTitle),
    "",
    "Message:",
    normalized.message || "-"
  ];

  if (!apiKey || !toEmail) {
    return NextResponse.json({
      ok: true,
      mode: "captured",
      referenceId,
      message:
        "Your request details were validated and captured for BioAxis sourcing review. Email delivery can be enabled with RESEND_API_KEY and BIOAXIS_RFQ_TO_EMAIL."
    });
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "BioAxis RFQ <onboarding@resend.dev>",
      to: [toEmail],
      reply_to: normalized.email,
      subject: `BioAxis RFQ: ${normalized.productName} (${referenceId})`,
      text: bodyLines.join("\n")
    })
  });

  if (!resendResponse.ok) {
    return NextResponse.json(
      {
        error: "The request was validated, but email delivery failed. Please retry or contact BioAxis support.",
        referenceId
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "email",
    referenceId,
    message: "Your request was submitted to BioAxis sourcing support for review."
  });
}
