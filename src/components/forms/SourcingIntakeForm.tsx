"use client";

import { useEffect, useRef } from "react";
import { TurnstileWidget } from "./TurnstileWidget";
import { CapturedInputCard, RequestContextCard, SourcingListNotice, SourcingListSummary } from "./sourcing-intake/contextCards";
import { contextualHelperText, defaultEquivalentChips, optionalHelperText, primaryHelperText, requestStarterTemplates } from "./sourcing-intake/constants";
import { Field, TextArea } from "./sourcing-intake/fields";
import { SourcingDetailFields } from "./sourcing-intake/SourcingDetailFields";
import type { SourcingIntakeFormProps } from "./sourcing-intake/types";
import { useSourcingIntake } from "./sourcing-intake/useSourcingIntake";

export type { SourcingIntakeFormProps, SourcingIntakeRequestType } from "./sourcing-intake/types";

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

export function SourcingIntakeForm(props: SourcingIntakeFormProps) {
  const {
    title = "Paste what you have. BioAxis will structure the sourcing request.",
    defaultMessage = "",
    compact = false,
    handoffNotice,
    productFieldLabel,
    submitLabel,
    successTitle = "Request received",
    optionalChips
  } = props;
  const {
    state,
    sourcingListItems,
    restoredSessionInput,
    error,
    emailInvalid,
    submitted,
    submitting,
    requestReferenceConflict,
    retryReferenceReady,
    turnstileToken,
    turnstileResetKey,
    turnstileAvailable,
    setTurnstileAvailable,
    setTurnstileToken,
    resolvedProductContext,
    hasPageContext,
    trackIntakeStart,
    handleTurnstileFailure,
    updateField,
    toggleChip,
    applyStarterTemplate,
    startAnotherRequest,
    handleSubmit,
    rotateRequestReference
  } = useSourcingIntake(props);
  const capturedInput = Boolean(defaultMessage.trim());
  const chips = optionalChips ?? (state.requestType === "equivalent" ? defaultEquivalentChips : []);
  const productLabel = labelForProductField(state.requestType, hasPageContext, productFieldLabel);
  const productFieldHelper = hasPageContext
    ? "Optional. This page context is already included; add specs, supplier, quantity, or documents only if useful."
    : "Optional. Submit with email only, or paste any SKU, supplier line, product list, or rough sourcing need.";
  const compactProductFieldHelper = hasPageContext ? "Context included. Add details if useful." : "Optional. Add details if useful.";
  const currentSubmitLabel = submitLabelFor(state.requestType, submitLabel);
  const waitingForVerification = turnstileAvailable && !turnstileToken;
  const submitButtonLabel = submitting ? "Sending..." : waitingForVerification ? "Complete verification to send" : currentSubmitLabel;
  const formRef = useRef<HTMLFormElement>(null);
  const nextRequestRef = useRef<HTMLButtonElement>(null);
  const hadSubmittedRef = useRef(false);

  useEffect(() => {
    if (submitted) {
      nextRequestRef.current?.focus();
    } else if (hadSubmittedRef.current) {
      formRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
    }
    hadSubmittedRef.current = Boolean(submitted);
  }, [submitted]);

  useEffect(() => {
    if (emailInvalid) {
      formRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
    }
  }, [emailInvalid]);

  if (submitted) {
    return (
      <div className="border border-bioaxis-accent/70 bg-bioaxis-panel p-5 sm:p-8">
        <div role="status" aria-live="polite" aria-atomic="true">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">{successTitle}</p>
          <h2 className="mt-4 text-2xl font-bold uppercase text-bioaxis-text sm:text-3xl">BioAxis has the sourcing context.</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
            {submitted.message}
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
        </div>
        <button
          ref={nextRequestRef}
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
      ref={formRef}
      onSubmit={handleSubmit}
      onFocusCapture={trackIntakeStart}
      noValidate
      aria-labelledby="sourcing-intake-title"
      data-api-endpoint="/api/rfq"
      data-rfq-mode="durable-queue-plus-context"
      className={["grid gap-5", compact ? "text-sm" : ""].filter(Boolean).join(" ")}
    >
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {submitting ? "Submitting request." : waitingForVerification ? "Verification is required before submission." : "Request form ready."}
      </p>
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
          <h2 id="sourcing-intake-title" className={compact ? "text-lg font-bold text-bioaxis-text sm:text-2xl" : "mt-2 text-xl font-bold text-bioaxis-text sm:text-2xl"}>{title}</h2>
          <div className={compact ? "mt-1 grid gap-1 text-xs leading-5 text-bioaxis-muted" : "mt-2 grid gap-1 text-sm leading-5 text-bioaxis-muted"}>
            <p>{compact ? "Email is the only required field." : primaryHelperText}</p>
            {compact ? <span className="sr-only">{primaryHelperText}</span> : null}
            {hasPageContext ? <p className="hidden sm:block">{contextualHelperText}</p> : null}
            {handoffNotice ? <p className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-bioaxis-steel">{handoffNotice}</p> : null}
          </div>
        </div>
        <div className={compact ? "grid gap-3" : "grid gap-5"}>
          <Field
            id="sourcing-email"
            name="email"
            label="Email"
            type="email"
            value={state.email}
            required
            invalid={emailInvalid}
            describedBy={emailInvalid ? "sourcing-intake-error" : undefined}
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
        {hasPageContext ? <RequestContextCard productContext={resolvedProductContext} draftReady={capturedInput} compact={compact} /> : null}
        {!hasPageContext && sourcingListItems.length > 0 ? <SourcingListNotice count={sourcingListItems.length} /> : null}
        <div className="mt-4 grid gap-3">
          <div className="order-1">
            <TurnstileWidget
              resetKey={turnstileResetKey}
              compact={compact}
              onAvailabilityChange={setTurnstileAvailable}
              onFailure={handleTurnstileFailure}
              onTokenChange={setTurnstileToken}
            />
          </div>
          {error && requestReferenceConflict ? (
            <div className="order-2 border border-bioaxis-accent/50 bg-bioaxis-black p-3">
              <p id="sourcing-intake-error" role="alert" className="text-sm font-semibold text-bioaxis-accent">{error}</p>
              <button
                type="button"
                onClick={rotateRequestReference}
                className="mt-3 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-4 text-xs font-bold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bioaxis-accent"
              >
                Use a new request reference
              </button>
            </div>
          ) : error ? (
            <p id="sourcing-intake-error" role="alert" className="order-2 text-sm font-semibold text-bioaxis-accent">
              {error}
            </p>
          ) : null}
          {waitingForVerification ? (
            <p aria-live="polite" className={compact ? "order-2 sr-only" : "order-2 text-sm font-semibold leading-6 text-bioaxis-muted"}>
              {compact ? "Complete verification above to send." : "Complete the verification above to send the request. If it will not load, keep this page open so your entries remain available, then retry."}
            </p>
          ) : null}
          <div
            data-submit-actions="true"
            className="order-3 flex flex-col gap-3 border-t border-bioaxis-line pt-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <button
              type="submit"
              disabled={submitting || waitingForVerification}
              className="order-1 inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent disabled:cursor-wait disabled:opacity-70 sm:order-2"
            >
              {submitButtonLabel}
            </button>
            {compact ? null : <p className="order-2 max-w-xl text-sm leading-6 text-bioaxis-muted sm:order-1">{optionalHelperText}</p>}
          </div>
          {retryReferenceReady ? (
            <p role="status" aria-live="polite" className="order-4 text-sm leading-5 text-bioaxis-muted">
              A new reference is ready. Your current form and sourcing-list details are unchanged; submit again to save them.
            </p>
          ) : null}
        </div>
        <details data-request-starters="true" className="group mt-4 border border-bioaxis-line bg-bioaxis-black/70">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-3 py-3 text-xs font-bold uppercase text-bioaxis-steel [&::-webkit-details-marker]:hidden">
            <span>Use a request starter</span>
            <span aria-hidden="true" className="text-bioaxis-accent transition group-open:rotate-45">+</span>
          </summary>
          <div className="border-t border-bioaxis-line p-3">
            <p className="text-xs leading-5 text-bioaxis-muted">Use a starter, then edit any line. BioAxis can follow up for missing details.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {requestStarterTemplates.map((starter) => (
                <button
                  key={starter.label}
                  type="button"
                  onClick={() => applyStarterTemplate(starter.value)}
                  className="min-h-11 border border-bioaxis-line bg-bioaxis-panel px-3 py-2 text-left text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bioaxis-accent"
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

      <SourcingDetailFields state={state} chips={chips} updateField={updateField} toggleChip={toggleChip} />
    </form>
  );
}
