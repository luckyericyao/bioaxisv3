"use client";

import { useCallback, useMemo, useRef, useState, type FormEvent } from "react";
import { getBioAxisRequestId, rotateBioAxisRequestId } from "@/lib/clientRequestId";
import { requestErrorMessage, submitBioAxisRequest } from "@/lib/submitBioAxisRequest";
import { trackBioAxisEvent } from "@/lib/trackBioAxisEvent";
import { apiRequestType, createInitialIntakeState, hasValidEmail, initialProductContext } from "./intakeState";
import type { IntakeState, SourcingIntakeFormProps, SubmitState } from "./types";
import { clearStoredSourcingSubmission, useSourcingListSession } from "./useSourcingListSession";

const emailErrorMessage = "Please enter an email so BioAxis can follow up.";
const verificationErrorMessage = "Please complete the verification and try again.";

export function useSourcingIntake({
  requestType = "quote",
  sourcePage,
  segment,
  category,
  family,
  product,
  defaultMessage = "",
  initialDetails,
  contextLocked = false,
  productContext
}: SourcingIntakeFormProps) {
  const normalizedRequestType = apiRequestType(requestType);
  const startedAtRef = useRef(Date.now());
  const requestIdRef = useRef(getBioAxisRequestId());
  const intakeStartedRef = useRef(false);
  const [state, setState] = useState<IntakeState>(() => createInitialIntakeState(normalizedRequestType, defaultMessage, initialDetails));
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<SubmitState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [requestReferenceConflict, setRequestReferenceConflict] = useState(false);
  const [retryReferenceReady, setRetryReferenceReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  // Fail closed during SSR and hydration. Runtime Turnstile configuration is
  // fetched after hydration, so treating the initial state as unavailable
  // briefly exposes an enabled native form that can navigate before React has
  // attached handleSubmit and discard the in-memory request.
  const [turnstileAvailable, setTurnstileAvailable] = useState(true);

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
      segment ||
      category ||
      family ||
      product ||
      resolvedProductContext.productName ||
      resolvedProductContext.productFamily ||
      resolvedProductContext.productCategory ||
      resolvedProductContext.productSegment
  );
  const { sourcingListItems, setSourcingListItems, restoredSessionInput, setRestoredSessionInput } = useSourcingListSession(setState);

  const trackIntakeStart = useCallback(() => {
    if (intakeStartedRef.current) {
      return;
    }

    intakeStartedRef.current = true;
    trackBioAxisEvent("rfq_start", {
      requestId: requestIdRef.current,
      requestType: normalizedRequestType,
      hasContext: hasPageContext
    });
  }, [hasPageContext, normalizedRequestType]);

  const handleTurnstileFailure = useCallback((reason: string) => {
    trackBioAxisEvent("turnstile_failure", { requestId: requestIdRef.current, reason });
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
    if (turnstileAvailable && !turnstileToken) return verificationErrorMessage;
    return "";
  }

  function startAnotherRequest() {
    setSubmitted(null);
    setError("");
    setRequestReferenceConflict(false);
    setRetryReferenceReady(false);
    setTurnstileToken("");
    setTurnstileResetKey(0);
    setRestoredSessionInput(false);
    setSourcingListItems([]);
    startedAtRef.current = Date.now();
    requestIdRef.current = rotateBioAxisRequestId();
    setState((current) => ({
      ...createInitialIntakeState(current.requestType),
      email: current.email
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      trackBioAxisEvent("rfq_validation_failed", { requestId: requestIdRef.current, reason: "validation", requestType: state.requestType });
      if (turnstileAvailable && !turnstileToken) {
        trackBioAxisEvent("turnstile_failure", { requestId: requestIdRef.current, reason: "missing_token" });
      }
      setError(validationError);
      setSubmitted(null);
      if (validationError === emailErrorMessage) {
        const emailInput = event.currentTarget.elements.namedItem("email");
        if (emailInput instanceof HTMLElement) emailInput.focus();
      }
      return;
    }

    setError("");
    setRetryReferenceReady(false);
    setSubmitting(true);
    trackBioAxisEvent("rfq_submit", { requestId: requestIdRef.current, requestType: state.requestType, stage: "client_submit" });

    try {
      const detailChipText = state.detailChips.length ? `Selected review details: ${state.detailChips.join(", ")}` : "";
      const privateLabelNote = requestType === "private-label" ? "Original request mode: private-label / OEM sourcing discussion." : "";
      const payload = await submitBioAxisRequest({
        requestId: requestIdRef.current,
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
        refreshVerification();
        trackBioAxisEvent("rfq_error", { requestId: requestIdRef.current, reason: "api", requestType: state.requestType });
        const hasConflict = payload.httpStatus === 409;
        setRequestReferenceConflict(hasConflict);
        setError(hasConflict
          ? "This reference is already linked to different saved details. Your current form is intact; choose a new reference to submit these details separately."
          : payload.error || requestErrorMessage);
        setSubmitted(null);
        return;
      }

      setRequestReferenceConflict(false);
      setRetryReferenceReady(false);
      setSubmitted({
        message:
          payload.message ??
          "Request received. BioAxis will follow up by email if specs, documents, samples, or quantity need clarification.",
        referenceId: payload.referenceId
      });
      trackBioAxisEvent("rfq_success", { requestId: payload.requestId ?? payload.referenceId ?? requestIdRef.current, requestType: state.requestType });
      clearStoredSourcingSubmission();
      setRestoredSessionInput(false);
      setSourcingListItems([]);
    } catch {
      refreshVerification();
      setRequestReferenceConflict(false);
      trackBioAxisEvent("rfq_error", { requestId: requestIdRef.current, reason: "network", requestType: state.requestType });
      setError(requestErrorMessage);
      setSubmitted(null);
    } finally {
      setSubmitting(false);
    }
  }

  function refreshVerification() {
    if (!turnstileAvailable) return;
    // Siteverify consumes a token even when the subsequent queue write fails.
    setTurnstileToken("");
    setTurnstileResetKey((current) => current + 1);
  }

  function rotateRequestReference() {
    requestIdRef.current = rotateBioAxisRequestId();
    setRequestReferenceConflict(false);
    setRetryReferenceReady(true);
    setError("");
  }

  return {
    state,
    sourcingListItems,
    restoredSessionInput,
    error,
    emailInvalid: error === emailErrorMessage,
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
  };
}
