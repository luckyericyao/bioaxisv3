"use client";

import { useEffect, useRef } from "react";
import { useSourcingList } from "@/components/sourcing/SourcingListProvider";
import { TurnstileWidget } from "./TurnstileWidget";
import { RequestContextCard, SourcingListSummary } from "./sourcing-intake/contextCards";
import { defaultEquivalentChips, optionalHelperText, requestStarterTemplates } from "./sourcing-intake/constants";
import { Field, TextArea } from "./sourcing-intake/fields";
import { SourcingDetailFields } from "./sourcing-intake/SourcingDetailFields";
import type { SourcingIntakeFormProps } from "./sourcing-intake/types";
import { useSourcingIntake } from "./sourcing-intake/useSourcingIntake";

export type { SourcingIntakeFormProps, SourcingIntakeRequestType } from "./sourcing-intake/types";

function submitLabelFor(requestType: string, override?: string) {
  if (override) return override;
  if (requestType === "equivalent") return "Send equivalent request";
  if (requestType === "sample") return "Request sample";
  if (requestType === "documentation") return "Request documents";
  if (requestType === "contact") return "Send sourcing question";
  return "Send sourcing request";
}

export function SourcingIntakeForm(props: SourcingIntakeFormProps) {
  const { title = "What do you need?", compact = false, handoffNotice, productFieldLabel, submitLabel,
    successTitle = "Request received", optionalChips } = props;
  const intake = useSourcingIntake(props);
  const { state, sourcingListItems, error, emailInvalid, needInvalid, hasSelectedNeed, submitted, submitting,
    requestReferenceConflict, retryReferenceReady, turnstileToken, turnstileResetKey, turnstileAvailable,
    setTurnstileAvailable, setTurnstileToken, resolvedProductContext, hasPageContext, trackIntakeStart,
    handleTurnstileFailure, updateField, toggleChip, applyStarterTemplate, startAnotherRequest,
    handleSubmit, rotateRequestReference } = intake;
  const { openDrawer } = useSourcingList();
  const chips = optionalChips ?? (state.requestType === "equivalent" ? defaultEquivalentChips : []);
  const waitingForVerification = turnstileAvailable && !turnstileToken;
  const formRef = useRef<HTMLFormElement>(null);
  const nextRequestRef = useRef<HTMLButtonElement>(null);
  const hadSubmittedRef = useRef(false);

  useEffect(() => {
    if (submitted) nextRequestRef.current?.focus();
    else if (hadSubmittedRef.current) formRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
    hadSubmittedRef.current = Boolean(submitted);
  }, [submitted]);

  if (submitted) return (
    <section className="max-w-3xl rounded border border-bioaxis-line bg-bioaxis-panelSoft p-6 sm:p-8">
      <div role="status" aria-live="polite" aria-atomic="true">
        <h2>{successTitle}</h2>
        <p className="mt-4 text-bioaxis-muted">{submitted.message}</p>
        <p className="mt-6 font-medium">BioAxis will review</p>
        <ul className="mt-3 grid gap-2 text-base text-bioaxis-muted sm:grid-cols-2">
          {["Product context", "Equivalent path", "Documentation needs", "Sample or quote next step"].map((item) => <li key={item}>{item}</li>)}
        </ul>
        {submitted.referenceId ? <p className="helper-text mt-4 text-bioaxis-muted">Reference: {submitted.referenceId}</p> : null}
      </div>
      <button ref={nextRequestRef} type="button" onClick={startAnotherRequest} className="action-secondary mt-6">Start another request</button>
    </section>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} onFocusCapture={trackIntakeStart} noValidate
      aria-labelledby="sourcing-intake-title" data-api-endpoint="/api/rfq" data-rfq-mode="durable-queue-plus-context"
      className="mx-auto grid w-full max-w-3xl gap-6">
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {submitting ? "Submitting request." : waitingForVerification ? "Verification is required before submission." : "Request form ready."}
      </p>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="sourcing-intake-website">Website</label>
        <input id="sourcing-intake-website" name="website" tabIndex={-1} autoComplete="off"
          value={state.website} onChange={(event) => updateField("website", event.target.value)} />
      </div>
      <section className="grid gap-5">
        <h2 id="sourcing-intake-title" className="sr-only">{title}</h2>
        {handoffNotice ? <p role="status" className="text-bioaxis-muted">{handoffNotice}</p> : null}
        <TextArea id="sourcing-product-input" label={productFieldLabel ?? "What do you need?"}
          value={state.productInput} rows={compact ? 3 : 4} required={!hasSelectedNeed} invalid={needInvalid}
          describedBy={needInvalid ? "sourcing-intake-error" : undefined}
          helperText={hasSelectedNeed ? "Your selected product or list is included. Add details only if useful." : "A product name, catalog reference or rough purchasing list is enough."}
          placeholder="Product, catalog reference, list or sourcing need"
          onChange={(value) => updateField("productInput", value)} />
        {hasPageContext ? <RequestContextCard productContext={resolvedProductContext} draftReady={Boolean(state.productInput.trim())} compact /> : null}
        {sourcingListItems.length ? <SourcingListSummary items={sourcingListItems}
          onEdit={(target) => openDrawer(target)} /> : null}
        <Field id="sourcing-email" name="email" label="Email" type="email" value={state.email} required
          invalid={emailInvalid} describedBy={emailInvalid ? "sourcing-intake-error" : undefined}
          autoComplete="email" inputMode="email" placeholder="you@organization.com"
          onChange={(value) => updateField("email", value)} />
      </section>

      <SourcingDetailFields state={state} chips={chips} updateField={updateField} toggleChip={toggleChip}>
        <details data-request-starters="true" className="border-t border-bioaxis-line pt-4 md:col-span-2">
          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium">Use a request starter</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {requestStarterTemplates.map((starter) => <button key={starter.label} type="button"
              onClick={() => applyStarterTemplate(starter.value)} className="action-secondary"
              aria-label={`Use ${starter.label} request starter`}>{starter.label}</button>)}
          </div>
        </details>
      </SourcingDetailFields>

      <TurnstileWidget resetKey={turnstileResetKey} compact={compact}
        onAvailabilityChange={setTurnstileAvailable} onFailure={handleTurnstileFailure} onTokenChange={setTurnstileToken} />
      {error ? <div><p id="sourcing-intake-error" role="alert" className="text-red-800">{error}</p>
        {requestReferenceConflict ? <button type="button" onClick={rotateRequestReference}
          className="action-secondary mt-3">Use a new request reference</button> : null}</div> : null}
      <div data-submit-actions="true" className="grid justify-items-start gap-3 border-t border-bioaxis-line pt-5">
        <button type="submit" disabled={submitting || waitingForVerification} className="action-primary w-full sm:w-auto">
          {submitting ? "Sending..." : waitingForVerification ? "Complete verification to send" : submitLabelFor(state.requestType, submitLabel)}
        </button>
        <p className="helper-text text-bioaxis-muted">{optionalHelperText}</p>
      </div>
      {retryReferenceReady ? <p role="status" className="helper-text text-bioaxis-muted">A new reference is ready. Your current form and sourcing-list details are unchanged; submit again to save them.</p> : null}
    </form>
  );
}
