export const primaryHelperText = "Share a product, reference or sourcing need, then your email.";
export const contextualHelperText = "BioAxis will include this page context automatically.";
export const optionalHelperText = "BioAxis will review your request and follow up by email.";
export const savedListCheckboxName = "includeSavedSourcingList";
export const missingSourcingListMessage = "The attached items are no longer in your saved list. Clear the checkbox to continue without them.";

export const defaultEquivalentChips = [
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

export const timelineOptions = ["Urgent", "This week", "This month", "Planning ahead", "Not sure"];

export const requestStarterTemplates = [
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
export const requestInputNames = {
  productList: "sourcing-product-input",
  email: "email",
  name: "sourcing-name",
  organization: "sourcing-company",
  phone: "sourcing-phone",
  roleTitle: "sourcing-role",
  currentSupplier: "sourcing-supplier",
  catalogNumber: "sourcing-catalog",
  quantity: "sourcing-quantity",
  timeline: "sourcing-timeline",
  shippingRegion: "sourcing-region",
  documentationNeeds: "sourcing-docs",
  message: "sourcing-notes"
} as const;
