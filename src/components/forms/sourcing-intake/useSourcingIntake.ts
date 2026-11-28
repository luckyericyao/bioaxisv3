import { useCallback, useMemo, useRef, useState, type FormEvent } from "react";
import { useSourcingList } from "@/components/sourcing/SourcingListProvider";
import { getBioAxisRequestId, retireBioAxisRequestId, rotateBioAxisRequestId } from "@/lib/clientRequestId";
import { requestErrorMessage, submitBioAxisRequest, type BioAxisRequestPayload } from "@/lib/submitBioAxisRequest";
import { trackBioAxisEvent } from "@/lib/trackBioAxisEvent";
import { hasSourcingNeed, maxSourcingListItems, sourcingListLimitError, sourcingNeedError } from "@/lib/sourcingNeed";
import { rfqInputLimitIssue } from "@/lib/rfqInputLimits";
import { retainUnsubmittedSourcingItems, type SourcingListItem } from "@/lib/sourcingListStorage";
import { missingSourcingListMessage, requestInputNames, savedListCheckboxName } from "./constants";
import { apiRequestType, createInitialIntakeState, hasValidEmail, initialProductContext } from "./intakeState";
import type { IntakeState, SourcingIntakeFormProps, SubmitState } from "./types";
import { clearStoredSourcingSubmission, useSourcingListSession } from "./useSourcingListSession";

const emailErrorMessage = "Please enter an email so BioAxis can follow up.";
const verificationErrorMessage = "Please complete the verification and try again.";
type RequestInputName = typeof requestInputNames[keyof typeof requestInputNames];
type ValidationFailure = { message: string; field?: RequestInputName; listItem?: SourcingListItem; missingAttachment?: boolean };

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
  productContext,
  handoffMode,
  listHandoffId
}: SourcingIntakeFormProps) {
  const { editInvalidItem, items: liveSavedList } = useSourcingList();
  const normalizedRequestType = apiRequestType(requestType);
  const startedAtRef = useRef(Date.now());
  const requestIdRef = useRef<string | null>(null);
  const intakeStartedRef = useRef(false);
  const submittingRef = useRef(false);
  const [state, setState] = useState<IntakeState>(() => createInitialIntakeState(normalizedRequestType, defaultMessage, initialDetails));
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState<RequestInputName>();
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
  const { sourcingListItems: availableSourcingItems, setSourcingListItems, restoredSessionInput, setRestoredSessionInput, listHandoffStatus, handoffSnapshot, resetListHandoff } = useSourcingListSession(setState, handoffMode, listHandoffId);
  const [includeListChoice, setIncludeListChoice] = useState<boolean | null>(null);
  const [attachment, setAttachment] = useState<{ rows: ReadonlyMap<string, string>; batched: boolean } | null>(null);
  const includeSavedList = includeListChoice ?? (listHandoffStatus === "restored");
  const sourcingListItems = !includeSavedList ? [] : attachment
    ? availableSourcingItems.filter((item) => attachment.rows.get(item.id) === item.addedAt)
    : availableSourcingItems;
  const missingAttachment = includeSavedList && sourcingListItems.length === 0;
  const hasSelectedNeed = hasSourcingNeed({ productContext: resolvedProductContext, sourcingListItems });
  const canSelectBatch = sourcingListItems.length > maxSourcingListItems && sourcingListItems.every(
    (item) => liveSavedList.some((saved) => saved.id === item.id && saved.addedAt === item.addedAt)
  );

  function setIncludeSavedList(included: boolean) {
    setIncludeListChoice(included);
    setAttachment(included ? {
      rows: new Map(availableSourcingItems.map((item) => [item.id, item.addedAt])),
      batched: false
    } : null);
    if (!included) {
      setError((current) => current === sourcingListLimitError ? "" : current);
    }
  }

  function selectSourcingBatch() {
    if (submittingRef.current || !canSelectBatch) return;
    // Pin the reviewed rows so later edits cannot silently replace them with new rows.
    setAttachment({
      rows: new Map(sourcingListItems.slice(0, maxSourcingListItems).map((item) => [item.id, item.addedAt])),
      batched: true
    });
    setError((current) => current === sourcingListLimitError ? "" : current);
  }

  const trackIntakeStart = useCallback(() => {
    if (intakeStartedRef.current) {
      return;
    }

    intakeStartedRef.current = true;
    trackBioAxisEvent("rfq_start", {
      requestId: requestIdRef.current ?? getBioAxisRequestId(),
      requestType: normalizedRequestType,
      hasContext: hasPageContext
    });
  }, [hasPageContext, normalizedRequestType]);

  const handleTurnstileFailure = useCallback((reason: string) => {
    trackBioAxisEvent("turnstile_failure", { requestId: requestIdRef.current ?? getBioAxisRequestId(), reason });
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

  function validate(request: BioAxisRequestPayload): ValidationFailure | null {
    if (missingAttachment) return { message: missingSourcingListMessage, missingAttachment: true };
    const inputLimit = rfqInputLimitIssue(request);
    if (inputLimit) return {
      message: inputLimit.message,
      field: inputLimit.field && Object.hasOwn(requestInputNames, inputLimit.field)
        ? requestInputNames[inputLimit.field as keyof typeof requestInputNames] : undefined,
      listItem: inputLimit.listItemIndex === undefined ? undefined : sourcingListItems[inputLimit.listItemIndex]
    };
    if (!hasSourcingNeed({ productList: state.productInput, catalogNumber: state.catalogNumber, message: state.notes, productContext: resolvedProductContext, sourcingListItems })) return { message: sourcingNeedError, field: "sourcing-product-input" };
    if (!hasValidEmail(state.email)) return { message: emailErrorMessage, field: "email" };
    if (turnstileAvailable && !turnstileToken) return { message: verificationErrorMessage };
    return null;
  }

  function startAnotherRequest() {
    setSubmitted(null);
    setIncludeSavedList(false);
    setError("");
    setRequestReferenceConflict(false);
    setRetryReferenceReady(false);
    setTurnstileToken("");
    setTurnstileResetKey(0);
    resetListHandoff();
    startedAtRef.current = Date.now();
    requestIdRef.current = null;
    intakeStartedRef.current = false;
    setState((current) => ({
      ...createInitialIntakeState(current.requestType),
      email: current.email
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    const requestId = requestIdRef.current ?? getBioAxisRequestId();
    const detailChipText = state.detailChips.length ? `Selected review details: ${state.detailChips.join(", ")}` : "";
    const privateLabelNote = requestType === "private-label" ? "Original request mode: private-label / OEM sourcing discussion." : "";
    const request: BioAxisRequestPayload = {
      requestId,
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
      productName: resolvedProductContext.productName || product || "",
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
    };
    const validationError = validate(request);

    if (validationError) {
      trackBioAxisEvent("rfq_validation_failed", { requestId, reason: "validation", requestType: state.requestType });
      if (turnstileAvailable && !turnstileToken) {
        trackBioAxisEvent("turnstile_failure", { requestId, reason: "missing_token" });
      }
      setInvalidField(validationError.field);
      const submitButton = event.currentTarget.querySelector<HTMLButtonElement>('button[type="submit"]');
      const openedListEditor = validationError.listItem && submitButton && editInvalidItem(validationError.listItem, submitButton);
      setError(openedListEditor || validationError.missingAttachment ? "" : validationError.message);
      setSubmitted(null);
      const field = validationError.missingAttachment ? savedListCheckboxName : validationError.field;
      if (field) {
        const input = event.currentTarget.elements.namedItem(field);
        if (input instanceof HTMLElement) {
          const details = input.closest("details");
          if (details) details.open = true;
          input.focus();
        }
      }
      return;
    }

    setInvalidField(undefined);
    setError("");
    setRetryReferenceReady(false);
    const storedSubmission = handoffMode === "list" && availableSourcingItems.length && !includeSavedList
      ? { productList: null, items: null }
      : handoffSnapshot.current;
    requestIdRef.current = requestId;
    submittingRef.current = true;
    setSubmitting(true);
    trackBioAxisEvent("rfq_submit", { requestId, requestType: state.requestType, stage: "client_submit" });

    try {
      const payload = await submitBioAxisRequest(request);

      if (!payload.ok) {
        refreshVerification();
        trackBioAxisEvent("rfq_error", { requestId, reason: "api", requestType: state.requestType });
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
        message: payload.message,
        referenceId: payload.referenceId
      });
      trackBioAxisEvent("rfq_success", { requestId: payload.referenceId, requestType: state.requestType });
      retireBioAxisRequestId(requestId);
      clearStoredSourcingSubmission(storedSubmission, sourcingListItems);
      setRestoredSessionInput(false);
      setSourcingListItems((current) => retainUnsubmittedSourcingItems(current, sourcingListItems));
    } catch {
      refreshVerification();
      setRequestReferenceConflict(false);
      trackBioAxisEvent("rfq_error", { requestId, reason: "network", requestType: state.requestType });
      setError(requestErrorMessage);
      setSubmitted(null);
    } finally {
      submittingRef.current = false;
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
    availableSourcingItems,
    sourcingListItems,
    hasSelectedBatch: attachment?.batched ?? false,
    canSelectBatch,
    selectSourcingBatch,
    includeSavedList,
    missingAttachment,
    unavailableListHandoff: listHandoffStatus === "unavailable" && !includeSavedList,
    setIncludeSavedList,
    restoredSessionInput,
    error,
    fieldError: (name: RequestInputName) => invalidField === name ? error || undefined : undefined,
    hasFieldError: Boolean(error && invalidField),
    hasSelectedNeed,
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
