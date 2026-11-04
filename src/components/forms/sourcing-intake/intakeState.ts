import { normalizeRequestType } from "@/data/requestTypes";
import type { BioAxisProductContext } from "@/lib/submitBioAxisRequest";
import type { IntakeState, SourcingIntakeFormProps } from "./types";

export function createInitialIntakeState(requestType: string, productInput = "", initialDetails: SourcingIntakeFormProps["initialDetails"] = {}): IntakeState {
  return {
    requestType,
    email: "",
    productInput,
    name: "",
    company: "",
    currentSupplier: initialDetails.currentSupplier ?? "",
    catalogNumber: initialDetails.catalogNumber ?? "",
    quantity: initialDetails.quantity ?? "",
    timeline: initialDetails.timeline ?? "",
    shippingRegion: "",
    requiredDocuments: initialDetails.requiredDocuments ?? "",
    notes: "",
    phone: "",
    roleTitle: "",
    website: "",
    detailChips: []
  };
}

export function apiRequestType(requestType: string) {
  if (requestType === "product-list") return "product-list-review";
  if (requestType === "recurring") return "recurring-supply";
  return normalizeRequestType(requestType);
}

export function hasValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function initialProductContext(props: SourcingIntakeFormProps, requestType: string): BioAxisProductContext {
  return {
    ...props.productContext,
    requestType: apiRequestType(requestType),
    productName: props.product ?? props.productContext?.productName ?? "",
    productFamily: props.family ?? props.productContext?.productFamily ?? "",
    productCategory: props.category ?? props.productContext?.productCategory ?? "",
    productSegment: props.segment ?? props.productContext?.productSegment ?? "",
    productUrl: props.productContext?.productUrl ?? props.sourcePage ?? "",
    sourcePageUrl: props.sourcePage ?? props.productContext?.sourcePageUrl ?? "",
    relevantSpecs: props.productContext?.relevantSpecs ?? [],
    documentationNotes: props.productContext?.documentationNotes ?? [],
    timestamp: props.productContext?.timestamp ?? new Date().toISOString()
  };
}

