export type RequestType = {
  id: string;
  label: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
};

export const requestTypes: RequestType[] = [
  {
    id: "quote",
    label: "Quote",
    description: "Send product context, a SKU, or a short note. BioAxis can follow up for missing specs.",
    requiredFields: [],
    optionalFields: ["productList", "currentSupplier", "catalogNumber", "sterility", "requiredSpecification", "needDocumentation", "notes"]
  },
  {
    id: "product-list-review",
    label: "Product list",
    description: "Paste multiple products and BioAxis can organize RFQ, equivalent, sample, and documentation paths.",
    requiredFields: [],
    optionalFields: ["productCategory", "currentSupplier", "needDocumentation", "targetTimeline", "notes"]
  },
  {
    id: "equivalent",
    label: "Equivalent",
    description: "Send the current product context so BioAxis can structure compatible alternative review.",
    requiredFields: [],
    optionalFields: ["productCategory", "quantity", "sterility", "needSample", "needDocumentation", "notes"]
  },
  {
    id: "sample",
    label: "Sample",
    description: "Send the product or family you want to evaluate before switching or scale-up.",
    requiredFields: [],
    optionalFields: ["currentSupplier", "catalogNumber", "quantity", "sterility", "monthlyUsage", "notes"]
  },
  {
    id: "documentation",
    label: "Documentation",
    description: "Ask for CoA, SDS, sterility, material, or lot-level documents when available.",
    requiredFields: [],
    optionalFields: ["currentSupplier", "catalogNumber", "productCategory", "sterility", "notes"]
  },
  {
    id: "recurring-supply",
    label: "Recurring supply",
    description: "Start recurring supply review with any usage rhythm you already know.",
    requiredFields: [],
    optionalFields: ["quantity", "sterility", "currentSupplier", "requiredSpecification", "notes"]
  },
  {
    id: "private-label",
    label: "Private label / OEM",
    description: "Start a neutral-label, private-label, or OEM-style sourcing discussion with product family and recurring usage context.",
    requiredFields: [],
    optionalFields: ["productCategory", "currentSupplier", "quantity", "requiredSpecification", "notes"]
  },
  {
    id: "contact",
    label: "General sourcing question",
    description: "Ask a general sourcing, documentation, sample, or product-support question.",
    requiredFields: [],
    optionalFields: ["productCategory", "productName", "currentSupplier", "catalogNumber", "quantity", "sterility", "needSample", "needDocumentation", "targetTimeline"]
  }
];

const requestTypeAliases: Record<string, string> = {
  rfq: "quote",
  quote: "quote",
  "quote-request": "quote",
  "request-quote": "quote",
  recurring: "recurring-supply",
  "recurring supply": "recurring-supply",
  "recurring-supply": "recurring-supply",
  repeat: "recurring-supply",
  monthly: "recurring-supply",
  "product-list": "product-list-review",
  "product-list-review": "product-list-review",
  "product list": "product-list-review",
  "product list review": "product-list-review",
  "product-list-request": "product-list-review",
  list: "product-list-review",
  "private-label": "private-label",
  "private-label-oem": "private-label",
  "oem": "private-label",
  "oem-style": "private-label",
  equivalent: "equivalent",
  "equivalent-finding": "equivalent",
  "equivalent-review": "equivalent",
  alternative: "equivalent",
  docs: "documentation",
  document: "documentation",
  documents: "documentation",
  "documentation-request": "documentation",
  sample: "sample",
  "sample-request": "sample",
  documentation: "documentation",
  general: "contact",
  "general-question": "contact",
  "general-sourcing-question": "contact",
  contact: "contact",
  support: "contact"
};

export function normalizeRequestType(id: string | undefined) {
  const normalizedInput = (id ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
  const spacedInput = normalizedInput.replace(/-/g, " ");
  const normalizedId = requestTypeAliases[normalizedInput] ?? requestTypeAliases[spacedInput] ?? normalizedInput;
  return requestTypes.some((requestType) => requestType.id === normalizedId) ? normalizedId : "quote";
}

export function getRequestTypeById(id: string) {
  const normalizedId = normalizeRequestType(id);
  return requestTypes.find((requestType) => requestType.id === normalizedId) ?? requestTypes[0];
}
