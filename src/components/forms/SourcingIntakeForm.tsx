"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getRequestTypeById, normalizeRequestType, requestTypes } from "@/data/requestTypes";
import {
  type BioAxisProductContext,
  requestErrorMessage,
  submitBioAxisRequest
} from "@/lib/submitBioAxisRequest";
import { trackBioAxisEvent } from "@/lib/trackBioAxisEvent";
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
  handoffNotice?: string;
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
const sourcingListSubmittedEvent = "bioaxis:sourcing-list-submitted";
const emailErrorMessage = "Please enter an email so BioAxis can follow up.";
const verificationErrorMessage = "Please complete the verification and try again.";
const primaryHelperText = "Only your email is required to start. Add details only if useful.";
const contextualHelperText = "BioAxis will include this page context automatically.";
const optionalHelperText = "Missing optional procurement details will not block submission.";

const defaultEquivalentChips = [
  "Format match",
  "Sterility",
  "Material",
  "Low retention or binding",
  "Automation compatibility",
  "Packaging",
  "Documentation",
  "Price or availability",
  "Sample before switching"
];

const timelineOptions = ["Urgent", "This week", "This month", "Planning ahead", "Not sure"];

const requestStarterTemplates = [
  {
    label: "Availability check",
    value: "Need availability check for:\nCurrent SKU or catalog reference:\nQuantity and timing:"
  },
  {
    label: "Equivalent review",
    value: "Current product or supplier line:\nEquivalent needs to match:\nFormat, material, sterility, packaging:"
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
    value: "Recurring demand for:\nEstimated monthly or annual usage:\nPackaging, lead time, or backup-source requirements:"
  }
];

function createInitialIntakeState(requestType: string, productInput = ""): IntakeState {
  return {
    requestType,
    email: "",
    productInput,
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
  };
}

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

function clearStoredSourcingSubmission() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(sourcingListSubmissionStorageKey);
  window.sessionStorage.removeItem(sourcingListItemsStorageKey);
  window.dispatchEvent(new Event(sourcingListSubmittedEvent));
}

function labelForProductField(requestType: string, hasContext: boolean, override?: string) {
  if (override) return override;
  if (requestType === "equivalent") return "Current product, catalog number, or supplier line";
  if (requestType === "sample") return "Product, SKU, or sample need";
  if (requestType === "contact") return "Message or sourcing question";
  return hasContext ? "Product, SKU, product list, or sourcing need optional" : "Product, SKU, product list, or sourcing need";
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

function displaySourcePage(value: string) {
  try {
    const parsed = new URL(value, "https://bioaxis.local");
    return `${parsed.pathname}${parsed.search}`
      .replace(/(\d+(?:\.\d+)?)\s*u[lL]\b/g, "$1 µL")
      .replace(/\bu[lL]\b/g, "µL");
  } catch {
    return value;
  }
}

function contextRows(productContext: BioAxisProductContext) {
  const sourcePage = productContext.productUrl || productContext.sourcePageUrl || "";

  return [
    ["Request type", requestTypeLabel(productContext.requestType ?? "quote")],
    ["Product", productContext.productName],
    ["Family", productContext.productFamily],
    ["Category", productContext.productCategory],
    ["Segment", productContext.productSegment],
    ["Source page", sourcePage ? displaySourcePage(sourcePage) : ""]
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
  handoffNotice,
  productFieldLabel,
  submitLabel,
  successTitle = "Request received",
  optionalChips
}: SourcingIntakeFormProps) {
  const normalizedRequestType = apiRequestType(requestType);
  const startedAtRef = useRef(Date.now());
  const [state, setState] = useState<IntakeState>(() => createInitialIntakeState(normalizedRequestType, defaultMessage));
  const [sourcingListItems, setSourcingListItems] = useState<SourcingListSummaryItem[]>([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<SubmitState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [restoredSessionInput, setRestoredSessionInput] = useState(false);
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
  const productFieldHelper = hasPageContext
    ? "Optional. This page context is already included; add specs, supplier, quantity, or documents only if useful."
    : "Optional. Submit with email only, or paste any SKU, supplier line, product list, or rough sourcing need.";
  const compactProductFieldHelper = hasPageContext ? "Context included. Add details if useful." : "Optional. Add details if useful.";
  const currentSubmitLabel = submitLabelFor(state.requestType, submitLabel);
  const waitingForVerification = turnstileAvailable && !turnstileToken;
  const submitButtonLabel = submitting ? "Sending..." : waitingForVerification ? "Complete verification to send" : currentSubmitLabel;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionItems = readStoredSourcingItems(window.sessionStorage.getItem(sourcingListItemsStorageKey));
    const localItems = readStoredSourcingItems(window.localStorage.getItem(sourcingListStorageKey));
    const sessionProductList = window.sessionStorage.getItem(sourcingListSubmissionStorageKey)?.trim() ?? "";

    setSourcingListItems(sessionItems.length > 0 ? sessionItems : localItems);
    if (sessionProductList) {
      setRestoredSessionInput(true);
      setState((current) => (current.productInput.trim() ? current : { ...current, productInput: sessionProductList }));
    }
  }, []);

  useEffect(() => {
    trackBioAxisEvent("rfq_start", { requestType: normalizedRequestType, hasContext: hasPageContext });
  }, [hasPageContext, normalizedRequestType]);

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
    if (turnstileAvailable && !turnstileToken) return verificationErrorMessage;
    return "";
  }

  function startAnotherRequest() {
    setSubmitted(null);
    setError("");
    setTurnstileToken("");
    setRestoredSessionInput(false);
    setSourcingListItems([]);
    startedAtRef.current = Date.now();
    setState((current) => ({
      ...createInitialIntakeState(current.requestType),
      email: current.email
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      trackBioAxisEvent("rfq_error", { reason: "validation", requestType: state.requestType });
      if (turnstileAvailable && !turnstileToken) {
        trackBioAxisEvent("turnstile_failure", { reason: "missing_token" });
      }
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
        trackBioAxisEvent("rfq_error", { reason: "api", requestType: state.requestType });
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
      trackBioAxisEvent("rfq_success", { requestType: state.requestType, requestId: payload.referenceId });
      clearStoredSourcingSubmission();
      setRestoredSessionInput(false);
      setSourcingListItems([]);
    } catch {
      trackBioAxisEvent("rfq_error", { reason: "network", requestType: state.requestType });
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
            {["Product context", "Equivalent path", "Documentation needs", "Sample or quote next step"].map((item) => (
              <li key={item} className="border border-white/[0.12] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        {submitted.referenceId ? <p className="mt-4 text-sm text-bioaxis-dim">Reference: {submitted.referenceId}</p> : null}
        <button
          type="button"
          onClick={startAnotherRequest}
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
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={state.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <section className={compact ? "border border-bioaxis-accent/70 bg-bioaxis-panel p-4 shadow-[0_0_0_1px_rgba(40,255,191,0.06)] sm:p-5" : "border border-bioaxis-accent/70 bg-bioaxis-panel p-5 shadow-[0_0_0_1px_rgba(40,255,191,0.06)] sm:p-7"}>
        <div className={compact ? "mb-2" : "mb-4"}>
          <p className={compact ? "sr-only" : "text-sm font-semibold uppercase text-bioaxis-accent"}>Sourcing intake</p>
          <h2 className={compact ? "text-lg font-bold text-bioaxis-text sm:text-2xl" : "mt-2 text-xl font-bold text-bioaxis-text sm:text-2xl"}>{title}</h2>
          <div className={compact ? "mt-1 grid gap-1 text-xs leading-5 text-bioaxis-muted" : "mt-2 grid gap-1 text-sm leading-5 text-bioaxis-muted"}>
            <p>{compact ? "Only your email is required." : primaryHelperText}</p>
            {compact ? <span className="sr-only">{primaryHelperText}</span> : null}
            {hasPageContext ? <p className="hidden sm:block">{contextualHelperText}</p> : null}
            {handoffNotice ? <p className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-bioaxis-steel">{handoffNotice}</p> : null}
          </div>
        </div>
        {hasPageContext ? <RequestContextCard productContext={resolvedProductContext} draftReady={capturedInput} compact={compact} /> : null}
        {!hasPageContext && sourcingListItems.length > 0 ? <SourcingListNotice count={sourcingListItems.length} /> : null}
        <div className={compact ? "grid gap-3" : "grid gap-5"}>
          <Field
            id="sourcing-email"
            name="email"
            label="Email"
            type="email"
            value={state.email}
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@organization.com"
            onChange={(value) => updateField("email", value)}
          />
          <TextArea
            id="sourcing-product-input"
            label={productLabel}
            value={state.productInput}
            rows={compact ? 2 : 6}
            helperText={compact ? compactProductFieldHelper : productFieldHelper}
            placeholder={
              hasPageContext
                ? "Product context from this page will be included automatically. Add details only if useful."
                : "Paste a SKU, product list, current supplier line, or short sourcing need."
            }
            onChange={(value) => updateField("productInput", value)}
          />
          {compact ? <span className="sr-only">{productFieldHelper}</span> : null}
        </div>
        <div className="mt-4 grid gap-3">
          <div className="order-2 sm:order-1">
          <TurnstileWidget compact={compact} onAvailabilityChange={setTurnstileAvailable} onTokenChange={setTurnstileToken} />
          </div>
          {error ? (
            <p role="alert" className="order-3 text-sm font-semibold text-bioaxis-accent sm:order-2">
              {error}
            </p>
          ) : null}
          {waitingForVerification ? (
            <p className={compact ? "order-3 sr-only sm:order-2" : "order-3 text-sm font-semibold leading-6 text-bioaxis-muted sm:order-2"}>
              {compact ? "Complete verification above to send." : "Complete the verification above to send the request. If verification will not load, email crazyowenyao@gmail.com directly."}
            </p>
          ) : null}
          <div
            data-submit-actions="true"
            className="order-1 flex flex-col gap-3 border-t border-bioaxis-line pt-4 sm:order-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <button
              type="submit"
              disabled={submitting}
              className="order-1 inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent disabled:cursor-wait disabled:opacity-70 sm:order-2"
            >
              {submitButtonLabel}
            </button>
            <p className="order-2 max-w-xl text-sm leading-6 text-bioaxis-muted sm:order-1">{optionalHelperText}</p>
          </div>
        </div>
        <details data-request-starters="true" className="group mt-4 border border-bioaxis-line bg-bioaxis-black/70">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-3 py-3 text-xs font-bold uppercase text-bioaxis-steel [&::-webkit-details-marker]:hidden">
            <span>Use a request starter</span>
            <span className="text-bioaxis-accent transition group-open:rotate-45">+</span>
          </summary>
          <div className="border-t border-bioaxis-line p-3">
            <p className="text-xs leading-5 text-bioaxis-muted">Use a starter, then edit any line. BioAxis can follow up for missing details.</p>
            <div className="mt-3 flex flex-wrap gap-2">
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
        </details>
      </section>

      {!hasPageContext && (capturedInput || restoredSessionInput) ? (
        <CapturedInputCard restored={restoredSessionInput && !capturedInput} captured={capturedInput} />
      ) : null}
      {sourcingListItems.length > 0 ? <SourcingListSummary items={sourcingListItems} /> : null}

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
          <Field id="sourcing-company" label="Company or organization optional" value={state.company} onChange={(value) => updateField("company", value)} />
          <Field id="sourcing-phone" label="Phone optional" value={state.phone} onChange={(value) => updateField("phone", value)} />
          <Field id="sourcing-role" label="Role or title optional" value={state.roleTitle} onChange={(value) => updateField("roleTitle", value)} />
          <Field id="sourcing-supplier" label="Current supplier or brand optional" value={state.currentSupplier} onChange={(value) => updateField("currentSupplier", value)} />
          <Field id="sourcing-catalog" label="Catalog number or SKU optional" value={state.catalogNumber} onChange={(value) => updateField("catalogNumber", value)} />
          <Field id="sourcing-quantity" label="Quantity or usage optional" value={state.quantity} onChange={(value) => updateField("quantity", value)} />
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

function CapturedInputCard({ restored = false, captured = false }: { restored?: boolean; captured?: boolean }) {
  const title = restored ? "Pasted input captured" : "Request draft ready";
  const body = restored
    ? "BioAxis restored the input you sent from the previous page. Review or edit it below before submitting."
    : captured
      ? "BioAxis prepared this request context from the link you used. Review or edit it below before submitting."
      : "BioAxis will carry this input into the request form so you do not need to paste it again.";

  return (
    <section
      data-pasted-input-captured="true"
      className="flex flex-col gap-2 border border-bioaxis-accent/60 bg-bioaxis-panel p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
    >
      <p className="shrink-0 text-sm font-semibold uppercase text-bioaxis-accent">{title}</p>
      <p className="text-sm leading-5 text-bioaxis-muted sm:text-right">{body}</p>
    </section>
  );
}

function SourcingListNotice({ count }: { count: number }) {
  return (
    <div data-sourcing-list-context="true" className="mb-4 border border-bioaxis-accent/60 bg-bioaxis-black px-3 py-2.5">
      <p className="text-xs font-semibold uppercase text-bioaxis-accent">Sourcing list context</p>
      <p className="mt-1 text-xs leading-5 text-bioaxis-muted">
        BioAxis will include {count} sourcing list {count === 1 ? "item" : "items"} with this request. Only your email is required.
      </p>
    </div>
  );
}

function RequestContextCard({
  productContext,
  draftReady,
  compact = false
}: {
  productContext: BioAxisProductContext;
  draftReady: boolean;
  compact?: boolean;
}) {
  const rows = contextRows(productContext);
  const compactPairs = [rows.slice(0, 2), rows.slice(2, 4), rows.slice(4, 6)].filter((pair) => pair.length > 0);

  return (
    <section data-product-context-summary="true" className={compact ? "mb-3 border border-bioaxis-accent/60 bg-bioaxis-panel p-2 sm:p-4" : "border border-bioaxis-accent/60 bg-bioaxis-panel p-4 sm:p-5"}>
      <div className="flex items-center justify-between gap-3">
        <p className={compact ? "text-[10px] font-semibold uppercase text-bioaxis-accent sm:text-sm" : "text-xs font-semibold uppercase text-bioaxis-accent sm:text-sm"}>Request context</p>
        <p className={compact ? "sr-only" : "text-[10px] font-semibold uppercase text-bioaxis-dim sm:text-xs"}>
          <span className="sm:hidden">{draftReady ? "Draft ready" : "Captured"}</span>
          <span className="hidden sm:inline">{draftReady ? "Request draft ready" : "Captured automatically"}</span>
        </p>
      </div>
      <p className={compact ? "sr-only" : "mt-2 max-w-4xl text-xs leading-5 text-bioaxis-muted sm:text-sm"}>
        {compact ? (
          <>
            Context included automatically.
            <span className="sr-only"> BioAxis will include this product context with your request. You can add more details below, but it is not required.</span>
          </>
        ) : (
          <>
            <span className="sm:hidden">Product context is included automatically.</span>
            <span className="hidden sm:inline">BioAxis will include this product context with your request. You can add more details below, but it is not required.</span>
          </>
        )}
      </p>
      {compact ? (
        <dl className="mt-1 grid gap-0 border-t border-bioaxis-line pt-1">
          {compactPairs.map((pair, index) => (
            <div key={`${pair[0]?.[0] ?? "context"}-${index}`} className="grid min-w-0 grid-cols-2 gap-3">
              {pair.map(([label, value]) => (
                <div key={label} className="flex min-w-0 items-baseline gap-1">
                  <dt className="shrink-0 truncate text-[9px] font-bold uppercase text-bioaxis-dim">{label}:</dt>
                  <dd className="min-w-0 truncate text-[10px] font-semibold leading-4 text-bioaxis-text" title={value}>{value}</dd>
                </div>
              ))}
            </div>
          ))}
        </dl>
      ) : (
        <dl className="mt-3 grid border-t border-bioaxis-line md:grid-cols-[0.55fr_1.5fr_0.7fr] md:gap-2 md:border-0">
          {rows.map(([label, value]) => (
            <div key={label} className="border-b border-bioaxis-line py-2.5 last:border-b-0 md:border md:bg-bioaxis-black md:px-3">
              <dt className="text-xs font-bold uppercase text-bioaxis-dim">{label}</dt>
              <dd className="mt-1 break-words text-sm font-semibold leading-5 text-bioaxis-text">{value}</dd>
            </div>
          ))}
        </dl>
      )}
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
  name,
  label,
  value,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  placeholder,
  onChange
}: {
  id: string;
  name?: string;
  label: string;
  value: string;
  type?: "email" | "text";
  required?: boolean;
  autoComplete?: string;
  inputMode?: "email" | "text";
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
        name={name ?? id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
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
        name={id}
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
  helperText,
  placeholder,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  rows?: number;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase text-bioaxis-steel">
        {label}
        {required ? <span className="text-bioaxis-accent"> *</span> : null}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        required={required}
        aria-describedby={helperId}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus w-full resize-y border border-bioaxis-line bg-bioaxis-black px-4 py-3 text-base leading-7 text-bioaxis-text placeholder:text-bioaxis-dim"
      />
      {helperText ? (
        <p id={helperId} className="mt-2 text-sm leading-6 text-bioaxis-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
