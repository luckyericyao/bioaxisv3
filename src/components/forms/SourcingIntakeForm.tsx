"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getRequestTypeById, normalizeRequestType, requestTypes } from "@/data/requestTypes";
import {
  type BioAxisProductContext,
  requestErrorMessage,
  submitBioAxisRequest
} from "@/lib/submitBioAxisRequest";
import { RequestTypeSelector } from "./RequestTypeSelector";
import { TurnstileWidget } from "./TurnstileWidget";

export type SourcingIntakeRequestType =
  | "quote"
  | "equivalent"
  | "sample"
  | "documentation"
  | "recurring"
  | "recurring-supply"
  | "private-label"
  | "contact"
  | "product-list"
  | "product-list-review";

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

export type SourcingIntakeFormProps = {
  requestType?: SourcingIntakeRequestType | string;
  sourcePage?: string;
  segment?: string;
  category?: string;
  family?: string;
  product?: string;
  title?: string;
  defaultMessage?: string;
  compact?: boolean;
  contextLocked?: boolean;
  productContext?: BioAxisProductContext;
  productFieldLabel?: string;
  submitLabel?: string;
  successTitle?: string;
  optionalChips?: string[];
};

type IntakeState = {
  requestType: string;
  email: string;
  productInput: string;
  name: string;
  company: string;
  currentSupplier: string;
  catalogNumber: string;
  quantity: string;
  timeline: string;
  shippingRegion: string;
  requiredDocuments: string;
  notes: string;
  phone: string;
  roleTitle: string;
  website: string;
  detailChips: string[];
};

type SubmitState = {
  message: string;
  referenceId?: string;
};

const sourcingListStorageKey = "bioaxis:sourcing-list";
const sourcingListSubmissionStorageKey = "bioaxis:sourcing-list-submission";
const sourcingListItemsStorageKey = "bioaxis:sourcing-list-items";
const emailErrorMessage = "Please enter an email so BioAxis can follow up.";
const missingProductErrorMessage = "Please paste a SKU, product list, or short sourcing need.";
const verificationErrorMessage = "Please complete the verification and try again.";
const primaryHelperText = "Only your email is required to start. Add details only if useful.";
const contextualHelperText = "BioAxis will include this page context automatically.";
const optionalHelperText = "Missing optional procurement details will not block submission.";

const defaultEquivalentChips = [
  "Format match",
  "Sterility",
  "Material",
  "Low retention / binding",
  "Automation compatibility",
  "Packaging",
  "Documentation",
  "Price / availability",
  "Sample before switching"
];

const timelineOptions = ["Urgent", "This week", "This month", "Planning ahead", "Not sure"];

const requestStarterTemplates = [
  {
    label: "Availability check",
    value: "Need availability check for:\nCurrent SKU / catalog reference:\nQuantity and timing:"
  },
  {
    label: "Equivalent review",
    value: "Current product or supplier line:\nEquivalent needs to match:\nFormat / material / sterility / packaging:"
  },
  {
    label: "Sample before switching",
    value: "Need sample review for:\nCurrent use case:\nKey specs to compare:"
  },
  {
    label: "Documents before purchase",
    value: "Need documents for:\nRequired documents: CoA, SDS, sterility, material statement, or lot-level documentation\nPurchase timing:"
  },
  {
    label: "Recurring supply review",
    value: "Recurring demand for:\nEstimated monthly / annual usage:\nPackaging, lead time, or backup-source requirements:"
  }
];

function apiRequestType(requestType: string) {
  if (requestType === "product-list") return "product-list-review";
  if (requestType === "recurring") return "recurring-supply";
  return normalizeRequestType(requestType);
}

function requestTypeLabel(requestType: string) {
  return getRequestTypeById(apiRequestType(requestType)).label;
}

function hasValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function sourcingItemPath(item: SourcingListSummaryItem) {
  return [item.segmentTitle, item.categoryTitle, item.familyTitle, item.productTitle].filter(Boolean).join(" / ");
}

function readStoredSourcingItems(raw: string | null) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SourcingListSummaryItem[]) : [];
  } catch {
    return [];
  }
}

function labelForProductField(requestType: string, hasContext: boolean, override?: string) {
  if (override) return override;
  if (requestType === "equivalent") return "Current product / catalog number / supplier line";
  if (requestType === "sample") return "Product / SKU / sample need";
  if (requestType === "contact") return "Message / sourcing question";
  return hasContext ? "Product / SKU / product list / sourcing need optional" : "Product / SKU / product list / sourcing need";
}

function submitLabelFor(requestType: string, override?: string) {
  if (override) return override;
  if (requestType === "equivalent") return "Send equivalent request";
  if (requestType === "sample") return "Request sample";
  if (requestType === "documentation") return "Request documents";
  if (requestType === "recurring-supply" || requestType === "recurring") return "Send product list";
  if (requestType === "contact") return "Send sourcing question";
  return "Send sourcing request";
}

function initialProductContext(props: SourcingIntakeFormProps, requestType: string): BioAxisProductContext {
  return {
    ...props.productContext,
    requestType: apiRequestType(requestType),
    productName: props.product ?? props.productContext?.productName ?? "",
    productFamily: props.family ?? props.productContext?.productFamily ?? "",
    productCategory: props.category ?? props.productContext?.productCategory ?? "",
    productSegment: props.segment ?? props.productContext?.productSegment ?? "",
    productUrl: props.sourcePage ?? props.productContext?.productUrl ?? "",
    sourcePageUrl: props.sourcePage ?? props.productContext?.sourcePageUrl ?? "",
    relevantSpecs: props.productContext?.relevantSpecs ?? [],
    documentationNotes: props.productContext?.documentationNotes ?? [],
    timestamp: props.productContext?.timestamp ?? new Date().toISOString()
  };
}

function contextRows(productContext: BioAxisProductContext) {
  return [
    ["Request type", requestTypeLabel(productContext.requestType ?? "quote")],
    ["Product area", [productContext.productSegment, productContext.productCategory, productContext.productFamily, productContext.productName].filter(Boolean).join(" / ")],
    ["Source page", productContext.productUrl || productContext.sourcePageUrl ? "Source page captured" : ""]
  ].filter((row): row is [string, string] => Boolean(row[1]));
}

export function SourcingIntakeForm({
  requestType = "quote",
  sourcePage,
  segment,
  category,
  family,
  product,
  title = "Paste what you have. BioAxis will structure the sourcing request.",
  defaultMessage = "",
  compact = false,
  contextLocked = false,
  productContext,
  productFieldLabel,
  submitLabel,
  successTitle = "Request received",
  optionalChips
}: SourcingIntakeFormProps) {
  const normalizedRequestType = apiRequestType(requestType);
  const startedAtRef = useRef(Date.now());
  const [state, setState] = useState<IntakeState>({
    requestType: normalizedRequestType,
    email: "",
    productInput: defaultMessage,
    name: "",
    company: "",
    currentSupplier: "",
    catalogNumber: "",
    quantity: "",
    timeline: "",
    shippingRegion: "",
    requiredDocuments: "",
    notes: "",
    phone: "",
    roleTitle: "",
    website: "",
    detailChips: []
  });
  const [sourcingListItems, setSourcingListItems] = useState<SourcingListSummaryItem[]>([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<SubmitState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileAvailable, setTurnstileAvailable] = useState(Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY));

  const resolvedProductContext = useMemo(
    () =>
      initialProductContext(
        { requestType: state.requestType, sourcePage, segment, category, family, product, productContext },
        state.requestType
      ),
    [category, family, product, productContext, segment, sourcePage, state.requestType]
  );
  const hasPageContext = Boolean(
    contextLocked ||
      sourcePage ||
      segment ||
      category ||
      family ||
      product ||
      resolvedProductContext.productName ||
      resolvedProductContext.productFamily ||
      resolvedProductContext.productCategory ||
      resolvedProductContext.productSegment ||
      resolvedProductContext.productUrl ||
      resolvedProductContext.sourcePageUrl
  );
  const capturedInput = Boolean(defaultMessage.trim());
  const chips = optionalChips ?? (state.requestType === "equivalent" ? defaultEquivalentChips : []);
  const selectedRequestType = getRequestTypeById(state.requestType);
  const productLabel = labelForProductField(state.requestType, hasPageContext, productFieldLabel);
  const currentSubmitLabel = submitLabelFor(state.requestType, submitLabel);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionItems = readStoredSourcingItems(window.sessionStorage.getItem(sourcingListItemsStorageKey));
    const localItems = readStoredSourcingItems(window.localStorage.getItem(sourcingListStorageKey));
    const sessionProductList = window.sessionStorage.getItem(sourcingListSubmissionStorageKey)?.trim() ?? "";

    setSourcingListItems(sessionItems.length > 0 ? sessionItems : localItems);
    if (sessionProductList) {
      setState((current) => (current.productInput.trim() ? current : { ...current, productInput: sessionProductList }));
    }
  }, []);

  function updateField<K extends keyof IntakeState>(field: K, value: IntakeState[K]) {
    setState((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function toggleChip(chip: string) {
    setState((current) => ({
      ...current,
      detailChips: current.detailChips.includes(chip)
        ? current.detailChips.filter((item) => item !== chip)
        : [...current.detailChips, chip]
    }));
    setError("");
  }

  function applyStarterTemplate(value: string) {
    setState((current) => {
      const currentInput = current.productInput.trim();

      return {
        ...current,
        productInput: currentInput ? `${currentInput}\n\n${value}` : value
      };
    });
    setError("");
  }

  function validate() {
    if (!hasValidEmail(state.email)) return emailErrorMessage;
    if (!hasPageContext && !state.productInput.trim()) return missingProductErrorMessage;
    if (turnstileAvailable && !turnstileToken) return verificationErrorMessage;
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setSubmitted(null);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const detailChipText = state.detailChips.length ? `Selected review details: ${state.detailChips.join(", ")}` : "";
      const privateLabelNote = requestType === "private-label" ? "Original request mode: private-label / OEM sourcing discussion." : "";
      const payload = await submitBioAxisRequest({
        email: state.email,
        name: state.name,
        company: state.company,
        organization: state.company,
        phone: state.phone,
        roleTitle: state.roleTitle,
        requestType: state.requestType,
        productSegment: resolvedProductContext.productSegment,
        productCategory: resolvedProductContext.productCategory,
        productFamily: resolvedProductContext.productFamily,
        productName: resolvedProductContext.productName || product || (state.requestType === "contact" ? "Contact request" : ""),
        productList: state.productInput,
        catalogNumber: state.catalogNumber,
        currentSupplier: state.currentSupplier,
        supplier: state.currentSupplier,
        quantity: state.quantity,
        timeline: state.timeline,
        shippingRegion: state.shippingRegion,
        documentationNeeds: [state.requiredDocuments, detailChipText].filter(Boolean).join("\n"),
        equivalentNeeded: state.requestType === "equivalent" || state.detailChips.includes("Equivalent review"),
        sampleNeeded: state.requestType === "sample" || state.detailChips.includes("Sample before switching"),
        recurringSupplyNeeded: state.requestType === "recurring-supply" || state.requestType === "recurring",
        sourcingListItems,
        sourcePageUrl: resolvedProductContext.sourcePageUrl || resolvedProductContext.productUrl || sourcePage,
        productContext: resolvedProductContext,
        website: state.website,
        startedAt: startedAtRef.current,
        turnstileToken,
        message: [state.notes, privateLabelNote, detailChipText].filter(Boolean).join("\n\n")
      });

      if (!payload.ok) {
        setError(payload.error || requestErrorMessage);
        setSubmitted(null);
        return;
      }

      setSubmitted({
        message:
          payload.message ??
          "Request received. BioAxis will follow up by email if specs, documents, samples, or quantity need clarification.",
        referenceId: payload.referenceId
      });
    } catch {
      setError(requestErrorMessage);
      setSubmitted(null);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-bioaxis-accent/70 bg-bioaxis-panel p-5 sm:p-8">
        <p className="text-sm font-semibold uppercase text-bioaxis-accent">{successTitle}</p>
        <h2 className="mt-4 text-2xl font-bold uppercase text-bioaxis-text sm:text-3xl">BioAxis has the sourcing context.</h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
          Request received. BioAxis will follow up by email if specs, documents, samples, or quantity need clarification.
        </p>
        <div className="mt-6 border border-bioaxis-line bg-bioaxis-black p-5">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">BioAxis will review</p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-bioaxis-muted sm:grid-cols-2">
            {["Product context", "Equivalent path", "Documentation needs", "Sample / quote next step"].map((item) => (
              <li key={item} className="border border-white/[0.12] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        {submitted.referenceId ? <p className="mt-4 text-sm text-bioaxis-dim">Reference: {submitted.referenceId}</p> : null}
        <button
          type="button"
          onClick={() => {
            setSubmitted(null);
            setTurnstileToken("");
            startedAtRef.current = Date.now();
          }}
          className="mt-8 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          Start another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-api-endpoint="/api/rfq"
      data-rfq-mode="email-plus-context"
      className={["grid gap-5", compact ? "text-sm" : ""].filter(Boolean).join(" ")}
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor="sourcing-intake-website">Website</label>
        <input
          id="sourcing-intake-website"
          tabIndex={-1}
          autoComplete="off"
          value={state.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
        <p className="text-sm font-semibold uppercase text-bioaxis-accent">One-click intake</p>
        <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">{title}</h2>
        <div className="mt-3 grid gap-2 text-sm leading-6 text-bioaxis-muted">
          <p>{primaryHelperText}</p>
          {hasPageContext ? <p>{contextualHelperText}</p> : null}
        </div>
      </section>

      {hasPageContext ? <RequestContextCard productContext={resolvedProductContext} /> : null}
      {capturedInput ? <CapturedInputCard /> : null}
      {sourcingListItems.length > 0 ? <SourcingListSummary items={sourcingListItems} /> : null}

      <section className="border border-bioaxis-accent/70 bg-bioaxis-panel p-5 shadow-[0_0_0_1px_rgba(40,255,191,0.06)] sm:p-8">
        <div className="grid gap-5">
          <Field
            id="sourcing-email"
            label="Email"
            type="email"
            value={state.email}
            required
            placeholder="you@organization.com"
            onChange={(value) => updateField("email", value)}
          />
          <TextArea
            id="sourcing-product-input"
            label={productLabel}
            value={state.productInput}
            required={!hasPageContext}
            rows={compact ? 4 : 6}
            placeholder={
              hasPageContext
                ? "Product context from this page will be included automatically. Add details only if useful."
                : "Paste a SKU, product list, current supplier line, or short sourcing need."
            }
            onChange={(value) => updateField("productInput", value)}
          />
          <div data-request-starters="true" className="md:col-span-2 border border-bioaxis-line bg-bioaxis-black/70 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-bioaxis-accent">Not sure what to write?</p>
                <p className="mt-1 text-sm leading-6 text-bioaxis-muted">
                  Use a starter, then edit any line. BioAxis can follow up for missing details.
                </p>
              </div>
              <p className="text-xs font-semibold uppercase text-bioaxis-dim">Optional shortcuts</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {requestStarterTemplates.map((starter) => (
                <button
                  key={starter.label}
                  type="button"
                  onClick={() => applyStarterTemplate(starter.value)}
                  className="min-h-10 border border-bioaxis-line bg-bioaxis-panel px-3 py-2 text-left text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bioaxis-accent"
                  aria-label={`Use ${starter.label} request starter`}
                >
                  {starter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <TurnstileWidget onAvailabilityChange={setTurnstileAvailable} onTokenChange={setTurnstileToken} />
        </div>
        {error ? (
          <p role="alert" className="mt-4 text-sm font-semibold text-bioaxis-accent">
            {error}
          </p>
        ) : null}
        <div className="sticky bottom-0 z-10 mt-6 flex flex-col gap-4 border-t border-bioaxis-line bg-bioaxis-panel/95 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-bioaxis-muted">{optionalHelperText}</p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Sending..." : currentSubmitLabel}
          </button>
        </div>
      </section>

      <details className="group border border-bioaxis-line bg-bioaxis-panel">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left sm:p-8">
          <span>
            <span className="block text-2xl font-bold uppercase text-bioaxis-text">Add details — optional</span>
            <span className="mt-2 block text-sm leading-6 text-bioaxis-muted">
              Request type, supplier, quantity, timeline, documents, region, contact details, or notes.
            </span>
          </span>
          <span className="text-sm font-bold uppercase text-bioaxis-accent transition group-open:rotate-45">+</span>
        </summary>
        <div className="grid gap-5 border-t border-bioaxis-line p-5 md:grid-cols-2 sm:p-8">
          <div className="md:col-span-2">
            <p className="text-sm font-semibold uppercase text-bioaxis-accent">Request type optional</p>
            <div className="mt-4">
              <RequestTypeSelector
                requestTypes={requestTypes}
                selectedId={state.requestType}
                onSelect={(id) => updateField("requestType", id)}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{selectedRequestType.description}</p>
          </div>
          {chips.length > 0 ? (
            <fieldset className="md:col-span-2">
              <legend className="mb-3 block text-sm font-semibold uppercase text-bioaxis-steel">Review details optional</legend>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {chips.map((chip) => {
                  const checked = state.detailChips.includes(chip);
                  return (
                    <label
                      key={chip}
                      className={[
                        "flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 text-xs font-semibold uppercase transition",
                        checked
                          ? "border-bioaxis-accent bg-bioaxis-accent/10 text-bioaxis-accent"
                          : "border-bioaxis-line bg-bioaxis-black text-bioaxis-steel hover:border-bioaxis-accent/70"
                      ].join(" ")}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleChip(chip)} className="h-4 w-4 accent-bioaxis-accent" />
                      <span>{chip}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}
          <Field id="sourcing-name" label="Name optional" value={state.name} onChange={(value) => updateField("name", value)} />
          <Field id="sourcing-company" label="Company / organization optional" value={state.company} onChange={(value) => updateField("company", value)} />
          <Field id="sourcing-phone" label="Phone optional" value={state.phone} onChange={(value) => updateField("phone", value)} />
          <Field id="sourcing-role" label="Role / title optional" value={state.roleTitle} onChange={(value) => updateField("roleTitle", value)} />
          <Field id="sourcing-supplier" label="Current supplier / brand optional" value={state.currentSupplier} onChange={(value) => updateField("currentSupplier", value)} />
          <Field id="sourcing-catalog" label="Catalog number / SKU optional" value={state.catalogNumber} onChange={(value) => updateField("catalogNumber", value)} />
          <Field id="sourcing-quantity" label="Quantity / usage optional" value={state.quantity} onChange={(value) => updateField("quantity", value)} />
          <SelectField id="sourcing-timeline" label="Timeline optional" value={state.timeline} options={timelineOptions} onChange={(value) => updateField("timeline", value)} />
          <Field id="sourcing-region" label="Shipping region optional" value={state.shippingRegion} onChange={(value) => updateField("shippingRegion", value)} />
          <TextArea
            id="sourcing-docs"
            label="Required documents optional"
            value={state.requiredDocuments}
            rows={4}
            placeholder="CoA, SDS, sterility, material statement, lot-level documentation, or supplier specification sheet."
            onChange={(value) => updateField("requiredDocuments", value)}
          />
          <TextArea
            id="sourcing-notes"
            label="Notes optional"
            value={state.notes}
            rows={4}
            placeholder="Add anything useful for BioAxis to review."
            onChange={(value) => updateField("notes", value)}
          />
          <p className="md:col-span-2 text-sm leading-6 text-bioaxis-muted">{optionalHelperText}</p>
        </div>
      </details>
    </form>
  );
}

function CapturedInputCard() {
  return (
    <section data-pasted-input-captured="true" className="border border-bioaxis-accent/60 bg-bioaxis-panel p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Pasted input captured</p>
      <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
        BioAxis will carry this input into the request form so you do not need to paste it again.
      </p>
    </section>
  );
}

function RequestContextCard({ productContext }: { productContext: BioAxisProductContext }) {
  const rows = contextRows(productContext);

  return (
    <section data-product-context-summary="true" className="border border-bioaxis-accent/60 bg-bioaxis-panel p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Request context</p>
      <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">BioAxis will include this page context automatically.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-bioaxis-muted">
        BioAxis will include this product context with your request. You can add more details below, but it is not required.
      </p>
      <dl className="mt-6 grid gap-3 md:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label} className="border border-bioaxis-line bg-bioaxis-black p-4">
            <dt className="text-xs font-bold uppercase text-bioaxis-dim">{label}</dt>
            <dd className="mt-2 text-sm font-semibold text-bioaxis-text">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SourcingListSummary({ items }: { items: SourcingListSummaryItem[] }) {
  return (
    <section data-sourcing-list-summary="true" className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Sourcing list detected</p>
      <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">BioAxis will include these items.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-bioaxis-muted">
        Submit with only an email. Sourcing list drawer items are included automatically.
      </p>
      <div className="mt-6 grid gap-3">
        {items.slice(0, 6).map((item, index) => (
          <article key={item.id ?? `${item.title}-${index}`} className="border border-bioaxis-line bg-bioaxis-black p-4">
            <h3 className="text-sm font-bold uppercase text-bioaxis-text">{item.title ?? item.productTitle ?? `Sourcing item ${index + 1}`}</h3>
            <p className="mt-2 text-xs leading-5 text-bioaxis-muted">{sourcingItemPath(item) || item.href || "Product context captured"}</p>
          </article>
        ))}
      </div>
      {items.length > 6 ? <p className="mt-4 text-sm text-bioaxis-muted">Plus {items.length - 6} more sourcing list items.</p> : null}
    </section>
  );
}

function Field({
  id,
  label,
  value,
  type = "text",
  required = false,
  placeholder,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  type?: "email" | "text";
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
        className="field-focus min-h-12 w-full border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text placeholder:text-bioaxis-dim"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
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
        <option value="">Not sure</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  rows = 5,
  required = false,
  placeholder,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
        {required ? <span className="text-bioaxis-accent"> *</span> : null}
      </label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus w-full resize-y border border-bioaxis-line bg-bioaxis-black px-4 py-3 text-base leading-7 text-bioaxis-text placeholder:text-bioaxis-dim"
      />
    </div>
  );
}
