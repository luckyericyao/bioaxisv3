"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getRequestTypeById, normalizeRequestType, requestTypes } from "@/data/requestTypes";
import {
  type BioAxisProductContext,
  requestErrorMessage,
  requestSuccessMessage,
  submitBioAxisRequest
} from "@/lib/submitBioAxisRequest";
import { RequestTypeSelector } from "./RequestTypeSelector";

type QuoteFormState = {
  requestType: string;
  email: string;
  name: string;
  organization: string;
  phone: string;
  roleTitle: string;
  shippingRegion: string;
  supplier: string;
  catalogNumber: string;
  quantity: string;
  requiredDocuments: string;
  timeline: string;
  productList: string;
  notes: string;
  website: string;
};

type SourcingListSummaryItem = {
  id?: string;
  title?: string;
  href?: string;
  segmentTitle?: string;
  categoryTitle?: string;
  familyTitle?: string;
  productTitle?: string;
  quantity?: string;
  currentSupplier?: string;
  catalogNumber?: string;
  equivalentNeeded?: boolean;
  sampleNeeded?: boolean;
  documentationNeeded?: boolean;
  notes?: string;
  sourcePageUrl?: string;
  addedAt?: string;
};

const initialState: QuoteFormState = {
  requestType: requestTypes[0].id,
  email: "",
  name: "",
  organization: "",
  phone: "",
  roleTitle: "",
  shippingRegion: "",
  supplier: "",
  catalogNumber: "",
  quantity: "",
  requiredDocuments: "",
  timeline: "",
  productList: "",
  notes: "",
  website: ""
};

const sourcingListStorageKey = "bioaxis:sourcing-list";
const sourcingListItemsStorageKey = "bioaxis:sourcing-list-items";
const emailErrorMessage = "Please enter an email so BioAxis can follow up.";

type FieldErrors = Partial<Record<keyof QuoteFormState, string>>;

type SubmitState = {
  mode?: string;
  message: string;
  referenceId?: string;
};

type QuoteRequestFormProps = {
  initialValues?: Partial<QuoteFormState>;
  productContext?: BioAxisProductContext;
};

export function QuoteRequestForm({ initialValues = {}, productContext }: QuoteRequestFormProps) {
  const startingState = useMemo(
    () => ({
      ...initialState,
      ...initialValues,
      requestType: normalizeRequestType(initialValues.requestType ?? productContext?.requestType ?? initialState.requestType)
    }),
    [initialValues, productContext?.requestType]
  );
  const [formState, setFormState] = useState<QuoteFormState>(startingState);
  const [sourcingListItems, setSourcingListItems] = useState<SourcingListSummaryItem[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<SubmitState | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedRequestType = getRequestTypeById(formState.requestType);
  const resolvedProductContext = useMemo(
    () => ({
      ...productContext,
      requestType: formState.requestType,
      productName: productContext?.productName ?? "",
      productFamily: productContext?.productFamily ?? "",
      productCategory: productContext?.productCategory ?? "",
      productSegment: productContext?.productSegment ?? ""
    }),
    [formState.requestType, productContext]
  );
  const hasProductContext = Boolean(
    resolvedProductContext.productName ||
      resolvedProductContext.productFamily ||
      resolvedProductContext.productCategory ||
      resolvedProductContext.productSegment ||
      resolvedProductContext.productUrl
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sessionItems = readStoredSourcingItems(window.sessionStorage.getItem(sourcingListItemsStorageKey));
    const localItems = readStoredSourcingItems(window.localStorage.getItem(sourcingListStorageKey));
    setSourcingListItems(sessionItems.length > 0 ? sessionItems : localItems);
  }, []);

  function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate() {
    if (!formState.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      return { email: emailErrorMessage };
    }

    return {};
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(null);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = await submitBioAxisRequest({
        email: formState.email,
        name: formState.name,
        company: formState.organization,
        organization: formState.organization,
        phone: formState.phone,
        roleTitle: formState.roleTitle,
        requestType: formState.requestType,
        productSegment: resolvedProductContext.productSegment,
        productCategory: resolvedProductContext.productCategory,
        productFamily: resolvedProductContext.productFamily,
        productName: resolvedProductContext.productName,
        productList: formState.productList,
        catalogNumber: formState.catalogNumber,
        currentSupplier: formState.supplier,
        supplier: formState.supplier,
        quantity: formState.quantity,
        timeline: formState.timeline,
        shippingRegion: formState.shippingRegion,
        documentationNeeds: formState.requiredDocuments,
        sourcingListItems,
        sourcePageUrl: resolvedProductContext.sourcePageUrl ?? resolvedProductContext.productUrl,
        productContext: resolvedProductContext,
        website: formState.website,
        message: formState.notes
      });

      if (!payload.ok) {
        setSubmitError(requestErrorMessage);
        setSubmitted(null);
        return;
      }

      setSubmitted({
        mode: payload.mode ?? "captured",
        message: payload.message ?? requestSuccessMessage,
        referenceId: payload.referenceId
      });
    } catch {
      setSubmitError(requestErrorMessage);
      setSubmitted(null);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-bioaxis-accent/70 bg-bioaxis-panel p-8">
        <p className="text-sm font-semibold uppercase text-bioaxis-accent">Request received</p>
        <h2 className="mt-4 text-3xl font-bold uppercase text-bioaxis-text">BioAxis has the product context.</h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">{submitted.message}</p>
        {submitted.referenceId ? <p className="mt-4 text-sm text-bioaxis-dim">Reference: {submitted.referenceId}</p> : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setFormState(startingState);
              setSubmitted(null);
            }}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
          >
            Start another request
          </button>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Go to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate data-api-endpoint="/api/rfq" data-rfq-mode="email-only" className="grid gap-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="quote-website">Website</label>
        <input
          id="quote-website"
          tabIndex={-1}
          autoComplete="off"
          value={formState.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <p className="text-sm font-semibold uppercase text-bioaxis-accent">One-click intake</p>
        <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Send the product context with one click.</h2>
        <div className="mt-3 grid gap-2 text-sm leading-6 text-bioaxis-muted">
          <p>Only your email is required. BioAxis will include product context automatically when available. Add details only if useful.</p>
          <p>Submit now, and BioAxis can follow up by email to clarify specs, equivalents, samples, documentation, or quantities.</p>
        </div>
      </section>

      {hasProductContext ? <RequestContextCard productContext={resolvedProductContext} /> : null}

      {sourcingListItems.length > 0 ? <SourcingListSummary items={sourcingListItems} /> : null}

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Request type</h2>
        <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
          The request type can be preselected from a product page. You can change it, but you do not need to re-enter product details.
        </p>
        <div className="mt-6">
          <RequestTypeSelector
            requestTypes={requestTypes}
            selectedId={formState.requestType}
            onSelect={(id) => {
              updateField("requestType", id);
              setSubmitted(null);
            }}
          />
        </div>
      </section>

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Contact</h2>
        <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
          Email is the only required field. BioAxis will use it to follow up about the product context and any notes below.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field id="email" label="Email" type="email" value={formState.email} error={errors.email} required onChange={(value) => updateField("email", value)} />
          <Field id="name" label="Name optional" value={formState.name} onChange={(value) => updateField("name", value)} />
          <Field id="organization" label="Company / organization optional" value={formState.organization} onChange={(value) => updateField("organization", value)} />
          <Field id="phone" label="Phone optional" value={formState.phone} onChange={(value) => updateField("phone", value)} />
          <Field id="roleTitle" label="Role / title optional" value={formState.roleTitle} onChange={(value) => updateField("roleTitle", value)} />
          <Field id="shippingRegion" label="Shipping region optional" value={formState.shippingRegion} onChange={(value) => updateField("shippingRegion", value)} />
        </div>
      </section>

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Optional details</h2>
        <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
          Add supplier, catalog number, quantity, documents, timeline, or a pasted list if you already have them.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field id="supplier" label="Supplier optional" value={formState.supplier} onChange={(value) => updateField("supplier", value)} />
          <Field id="catalogNumber" label="Catalog number optional" value={formState.catalogNumber} onChange={(value) => updateField("catalogNumber", value)} />
          <Field id="quantity" label="Desired quantity optional" value={formState.quantity} onChange={(value) => updateField("quantity", value)} />
          <Field id="timeline" label="Target delivery date optional" value={formState.timeline} onChange={(value) => updateField("timeline", value)} />
          <Field id="requiredDocuments" label="Documentation optional" value={formState.requiredDocuments} onChange={(value) => updateField("requiredDocuments", value)} />
          <div className="hidden md:block" aria-hidden="true" />
          <TextArea
            id="productList"
            label="Pasted product list optional"
            value={formState.productList}
            rows={7}
            placeholder={[
              "Supplier | Catalog No. | Product | Qty | Required docs | Timeline",
              "Corning | 352097 | 96-well plate | 20 cases | CoA/Sterility | July",
              "Axygen | T-200-C | 200 µL filtered tips | 50 racks | DNase/RNase-free | ASAP"
            ].join("\n")}
            onChange={(value) => updateField("productList", value)}
          />
          <TextArea
            id="notes"
            label="Message / notes optional"
            value={formState.notes}
            rows={5}
            placeholder={`Add anything useful for this ${selectedRequestType.label.toLowerCase()}.`}
            onChange={(value) => updateField("notes", value)}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-bioaxis-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-bioaxis-muted">
            Submit with only an email. BioAxis can ask follow-up questions if specs, equivalents, samples, or documentation need clarification.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            {submitting ? "Submitting..." : "Send request"}
          </button>
        </div>
        {submitError ? <p className="mt-4 text-sm text-bioaxis-accent">{submitError}</p> : null}
      </section>
    </form>
  );
}

function readStoredSourcingItems(raw: string | null) {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SourcingListSummaryItem[]) : [];
  } catch {
    return [];
  }
}

function RequestContextCard({ productContext }: { productContext: BioAxisProductContext }) {
  const contextRows = [
    ["Request type", getRequestTypeById(productContext.requestType ?? "quote").label],
    ["Product", productContext.productName],
    ["Family", productContext.productFamily],
    ["Category", productContext.productCategory],
    ["Segment", productContext.productSegment],
    ["Source page", productContext.productUrl || productContext.sourcePageUrl ? "Product page URL captured" : ""]
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <section data-product-context-summary="true" className="border border-bioaxis-accent/60 bg-bioaxis-panel p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Request context</p>
      <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Send the product context with one click.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-bioaxis-muted">
        BioAxis will include this product context with your request. You can add more details below, but it is not required.
      </p>
      <dl className="mt-6 grid gap-3 md:grid-cols-2">
        {contextRows.map(([label, value]) => (
          <div key={label} className="border border-bioaxis-line bg-bioaxis-black p-4">
            <dt className="text-xs font-bold uppercase text-bioaxis-dim">{label}</dt>
            <dd className="mt-2 text-sm font-semibold text-bioaxis-text">{value}</dd>
          </div>
        ))}
      </dl>
      {productContext.relevantSpecs?.length ? (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase text-bioaxis-dim">Auto-captured specs</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {productContext.relevantSpecs.slice(0, 6).map((spec) => (
              <span key={spec} className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs text-bioaxis-steel">
                {spec}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SourcingListSummary({ items }: { items: SourcingListSummaryItem[] }) {
  return (
    <section data-sourcing-list-summary="true" className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Sourcing list detected</p>
      <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">BioAxis will include these items.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-bioaxis-muted">
        You can submit with only an email. The sourcing list items are included in the email payload automatically.
      </p>
      <div className="mt-6 grid gap-3">
        {items.slice(0, 6).map((item, index) => (
          <article key={item.id ?? `${item.title}-${index}`} className="border border-bioaxis-line bg-bioaxis-black p-4">
            <h3 className="text-sm font-bold uppercase text-bioaxis-text">{item.title ?? item.productTitle ?? `Sourcing item ${index + 1}`}</h3>
            <p className="mt-2 text-xs leading-5 text-bioaxis-muted">{sourcingItemPath(item) || item.href || "Product context captured"}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase text-bioaxis-steel">
              {item.quantity ? <span className="border border-bioaxis-line px-2 py-1">Qty: {item.quantity}</span> : null}
              {item.currentSupplier ? <span className="border border-bioaxis-line px-2 py-1">Supplier: {item.currentSupplier}</span> : null}
              {item.catalogNumber ? <span className="border border-bioaxis-line px-2 py-1">Catalog: {item.catalogNumber}</span> : null}
            </div>
          </article>
        ))}
      </div>
      {items.length > 6 ? <p className="mt-4 text-sm text-bioaxis-muted">Plus {items.length - 6} more sourcing list items.</p> : null}
    </section>
  );
}

function sourcingItemPath(item: SourcingListSummaryItem) {
  return [item.segmentTitle, item.categoryTitle, item.familyTitle, item.productTitle].filter(Boolean).join(" / ");
}

function Field({
  id,
  label,
  value,
  type = "text",
  error,
  required = false,
  onChange
}: {
  id: keyof QuoteFormState;
  label: string;
  value: string;
  type?: "email" | "text";
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
        {required ? <span className="text-bioaxis-accent"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-bioaxis-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  rows = 5,
  placeholder,
  onChange
}: {
  id: keyof QuoteFormState;
  label: string;
  value: string;
  rows?: number;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus w-full resize-y border border-bioaxis-line bg-bioaxis-black px-4 py-3 text-base text-bioaxis-text placeholder:text-bioaxis-dim"
      />
    </div>
  );
}
