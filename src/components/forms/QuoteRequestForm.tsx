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
  productCategory: string;
  requiredDocuments: string;
  timeline: string;
  productList: string;
  needs: string[];
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
  requestedAction?: string;
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
  productCategory: "",
  requiredDocuments: "",
  timeline: "",
  productList: "",
  needs: [],
  notes: "",
  website: ""
};

const sourcingListStorageKey = "bioaxis:sourcing-list";
const sourcingListItemsStorageKey = "bioaxis:sourcing-list-items";
const emailErrorMessage = "Please enter an email so BioAxis can follow up.";

const productCategoryOptions = [
  "Liquid handling",
  "Lab plasticware",
  "Cell culture",
  "Filtration",
  "PCR / qPCR",
  "Sample storage",
  "Automation consumables",
  "Assay consumables",
  "Antibodies / reagents",
  "Single-use bioprocess",
  "Other / not sure"
];

const needOptions = [
  "Quote",
  "Equivalent option",
  "Sample",
  "CoA",
  "SDS",
  "Sterility documentation",
  "Material / resin information",
  "Lot-level documentation",
  "Lead time discussion",
  "Recurring supply support"
];

const timelineOptions = ["Urgent", "This week", "This month", "Planning ahead", "Not sure"];

const reviewBullets = [
  "Product name or catalog number",
  "Supplier / brand currently used",
  "Compatible equivalent options",
  "Sterility, material, packaging, and format fit",
  "CoA, SDS, and lot-level documentation needs",
  "Sample request path",
  "Quote and recurring supply next steps"
];

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
  const shouldOpenOptionalDetails = formState.requestType === "product-list-review";
  const selectedNeedsText = formState.needs.join(", ");
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

  function toggleNeed(value: string) {
    setFormState((current) => ({
      ...current,
      needs: current.needs.includes(value) ? current.needs.filter((need) => need !== value) : [...current.needs, value]
    }));
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
        productCategory: formState.productCategory || resolvedProductContext.productCategory,
        productFamily: resolvedProductContext.productFamily,
        productName: resolvedProductContext.productName,
        productList: formState.productList,
        catalogNumber: formState.catalogNumber,
        currentSupplier: formState.supplier,
        supplier: formState.supplier,
        quantity: formState.quantity,
        timeline: formState.timeline,
        shippingRegion: formState.shippingRegion,
        documentationNeeds: [formState.requiredDocuments, selectedNeedsText ? `Selected needs: ${selectedNeedsText}` : ""].filter(Boolean).join("\n"),
        equivalentNeeded: formState.needs.includes("Equivalent option"),
        sampleNeeded: formState.needs.includes("Sample"),
        recurringSupplyNeeded: formState.needs.includes("Recurring supply support"),
        sourcingListItems,
        sourcePageUrl: resolvedProductContext.sourcePageUrl ?? resolvedProductContext.productUrl,
        productContext: resolvedProductContext,
        website: formState.website,
        message: [formState.notes, selectedNeedsText ? `What buyer needs: ${selectedNeedsText}` : ""].filter(Boolean).join("\n")
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
        <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Paste what you have. BioAxis will structure the sourcing request.</h2>
        <div className="mt-3 grid gap-2 text-sm leading-6 text-bioaxis-muted">
          <p>Only your email is required. Paste a SKU, product name, supplier line, or product list when available.</p>
          <p>BioAxis can follow up by email to clarify specs, equivalents, samples, documentation, quantities, or timeline.</p>
        </div>
      </section>

      {hasProductContext ? <RequestContextCard productContext={resolvedProductContext} /> : null}

      {sourcingListItems.length > 0 ? <SourcingListSummary items={sourcingListItems} /> : null}

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Request type</h2>
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
        <p className="mt-4 border border-bioaxis-line bg-bioaxis-black p-4 text-sm leading-6 text-bioaxis-muted">
          {selectedRequestType.description}
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
        <div className="grid gap-5">
          <section className="border border-bioaxis-accent/70 bg-bioaxis-panel p-5 shadow-[0_0_0_1px_rgba(40,255,191,0.06)] sm:p-8">
            <p className="text-sm font-semibold uppercase text-bioaxis-accent">Level 1 / always visible</p>
            <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Email plus product context.</h2>
            <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
              Use the product field for a single SKU, supplier line, pasted product list, or rough sourcing need. Existing product page context is included automatically.
            </p>
            <div className="mt-6 grid gap-5">
              <Field
                id="email"
                label="Email"
                type="email"
                value={formState.email}
                error={errors.email}
                required
                placeholder="you@organization.com"
                onChange={(value) => updateField("email", value)}
              />
              <TextArea
                id="productList"
                label="Product / SKU / product list"
                value={formState.productList}
                rows={10}
                prominent
                placeholder="Paste catalog number, supplier SKU, product name, pack size, current brand, target equivalent, required documents, sample need, recurring usage, or a spreadsheet-style product list."
                onChange={(value) => updateField("productList", value)}
              />
            </div>
          </section>

          <details className="group border border-bioaxis-line bg-bioaxis-panel" open={shouldOpenOptionalDetails ? true : undefined}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left sm:p-8">
              <span>
                <span className="block text-2xl font-bold uppercase text-bioaxis-text">Add supplier, quantity, documents, timeline, shipping region</span>
                <span className="mt-2 block text-sm leading-6 text-bioaxis-muted">
                  Optional fields for a more quote-ready sourcing request.
                </span>
              </span>
              <span className="text-sm font-bold uppercase text-bioaxis-accent transition group-open:rotate-45">+</span>
            </summary>
            <div className="grid gap-5 border-t border-bioaxis-line p-5 md:grid-cols-2 sm:p-8">
              <Field id="name" label="Name optional" value={formState.name} onChange={(value) => updateField("name", value)} />
              <Field id="organization" label="Company optional" value={formState.organization} onChange={(value) => updateField("organization", value)} />
              <Field
                id="supplier"
                label="Current supplier optional"
                value={formState.supplier}
                placeholder="Current supplier or brand, if known"
                onChange={(value) => updateField("supplier", value)}
              />
              <Field
                id="catalogNumber"
                label="Current SKU / catalog number optional"
                value={formState.catalogNumber}
                placeholder="Paste one or multiple catalog numbers"
                onChange={(value) => updateField("catalogNumber", value)}
              />
              <Field id="quantity" label="Quantity / usage optional" value={formState.quantity} onChange={(value) => updateField("quantity", value)} />
              <SelectField
                id="timeline"
                label="Timeline optional"
                value={formState.timeline}
                options={timelineOptions}
                placeholder="Not sure"
                onChange={(value) => updateField("timeline", value)}
              />
              <Field id="shippingRegion" label="Shipping region optional" value={formState.shippingRegion} onChange={(value) => updateField("shippingRegion", value)} />
              <SelectField
                id="productCategory"
                label="Product category optional"
                value={formState.productCategory}
                options={productCategoryOptions}
                placeholder="Other / not sure"
                onChange={(value) => updateField("productCategory", value)}
              />
              <TextArea
                id="requiredDocuments"
                label="Required documents optional"
                value={formState.requiredDocuments}
                rows={4}
                placeholder="CoA, SDS, sterility, material, lot-level documentation, or other supplier documents."
                onChange={(value) => updateField("requiredDocuments", value)}
              />
              <TextArea
                id="notes"
                label="Notes optional"
                value={formState.notes}
                rows={4}
                placeholder={`Add anything useful for this ${selectedRequestType.label.toLowerCase()}.`}
                onChange={(value) => updateField("notes", value)}
              />
              <CheckboxGroup label="What do you need? optional" values={needOptions} selected={formState.needs} onToggle={toggleNeed} />
            </div>
          </details>
        </div>

        <aside className="grid gap-5">
          <section className="border border-bioaxis-line bg-bioaxis-panel p-5">
            <h2 className="text-xl font-bold uppercase text-bioaxis-text">What BioAxis can review</h2>
            <ul className="mt-5 grid gap-2 text-sm leading-6 text-bioaxis-muted">
              {reviewBullets.map((item) => (
                <li key={item} className="border border-white/[0.1] bg-bioaxis-black px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="border border-bioaxis-line bg-bioaxis-black p-5">
            <h2 className="text-xl font-bold uppercase text-bioaxis-text">What BioAxis does not claim</h2>
            <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
              BioAxis does not display unsupported real-time inventory, guaranteed equivalence, regulatory approval, or validated compatibility unless confirmed through supplier documentation, sample testing, or customer review.
            </p>
          </section>
        </aside>
      </section>

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-bioaxis-muted">
            Submit with only an email. BioAxis can ask follow-up questions if specs, equivalents, samples, documentation, or quantities need clarification.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            {submitting ? "Submitting..." : "Send sourcing request"}
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
  placeholder,
  onChange
}: {
  id: keyof QuoteFormState;
  label: string;
  value: string;
  type?: "email" | "text";
  error?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text placeholder:text-bioaxis-dim"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-bioaxis-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  placeholder,
  onChange
}: {
  id: "productCategory" | "timeline";
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroup({
  label,
  values,
  selected,
  onToggle
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="md:col-span-2">
      <legend className="mb-3 block text-sm font-semibold uppercase text-bioaxis-steel">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {values.map((value) => {
          const checked = selected.includes(value);

          return (
            <label
              key={value}
              className={[
                "flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 text-sm font-semibold uppercase transition",
                checked
                  ? "border-bioaxis-accent bg-bioaxis-accent/10 text-bioaxis-accent"
                  : "border-bioaxis-line bg-bioaxis-black text-bioaxis-steel hover:border-bioaxis-accent/70"
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(value)}
                className="h-4 w-4 accent-bioaxis-accent"
              />
              <span>{value}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function TextArea({
  id,
  label,
  value,
  rows = 5,
  placeholder,
  prominent = false,
  onChange
}: {
  id: keyof QuoteFormState;
  label: string;
  value: string;
  rows?: number;
  placeholder?: string;
  prominent?: boolean;
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
        className={[
          "field-focus w-full resize-y border bg-bioaxis-black px-4 py-3 text-base text-bioaxis-text placeholder:text-bioaxis-dim",
          prominent ? "min-h-64 border-bioaxis-accent/55 text-lg leading-7" : "border-bioaxis-line"
        ].join(" ")}
      />
    </div>
  );
}
