import type { BioAxisProductContext } from "@/lib/submitBioAxisRequest";

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

export type SourcingHandoffMode = "text" | "list" | "legacy";
export type SourcingIntakeActivity = "idle" | "sending" | "received" | "attention";

export type SourcingIntakeFormProps = {
  onActivityChange?: (activity: SourcingIntakeActivity) => void;
  requestType?: SourcingIntakeRequestType | string;
  sourcePage?: string;
  segment?: string;
  category?: string;
  family?: string;
  product?: string;
  title?: string;
  defaultMessage?: string;
  initialDetails?: Partial<Pick<IntakeState, "currentSupplier" | "catalogNumber" | "quantity" | "timeline" | "requiredDocuments">>;
  compact?: boolean;
  contextLocked?: boolean;
  productContext?: BioAxisProductContext;
  handoffNotice?: string;
  handoffMode?: SourcingHandoffMode;
  listHandoffId?: string;
  productFieldLabel?: string;
  submitLabel?: string;
  successTitle?: string;
  optionalChips?: string[];
};

export type IntakeState = {
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

export type SubmitState = {
  message: string;
  referenceId?: string;
};

export type UpdateIntakeField = <K extends keyof IntakeState>(field: K, value: IntakeState[K]) => void;
