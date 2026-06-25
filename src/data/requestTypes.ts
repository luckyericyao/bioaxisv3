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
    label: "Quote / RFQ",
    description:
      "Send product context, a pasted list, or a short note. BioAxis can follow up for any missing specs before organizing quote options.",
    requiredFields: [],
    optionalFields: ["productList", "currentSupplier", "catalogNumber", "sterility", "requiredSpecification", "needDocumentation", "notes"]
  },
  {
    id: "product-list-review",
    label: "Product list review",
    description:
      "Paste a product list if you have one. BioAxis can organize products by segment, family, quote path, equivalent review, sample need, and documentation.",
    requiredFields: [],
    optionalFields: ["productCategory", "currentSupplier", "needDocumentation", "targetTimeline", "notes"]
  },
  {
    id: "equivalent",
    label: "Equivalent finding",
    description:
      "Send the current product context if you have it. BioAxis can help compare compatible options and ask for specs only when needed.",
    requiredFields: [],
    optionalFields: ["productCategory", "quantity", "sterility", "needSample", "needDocumentation", "notes"]
  },
  {
    id: "sample",
    label: "Sample request",
    description:
      "Send the product or family you want to evaluate. BioAxis can follow up for sample criteria before switching or scale-up.",
    requiredFields: [],
    optionalFields: ["currentSupplier", "catalogNumber", "quantity", "sterility", "monthlyUsage", "notes"]
  },
  {
    id: "documentation",
    label: "Documentation request",
    description:
      "Ask for CoA, SDS, sterility, material, or lot-level documents when available. Add details only if you already know them.",
    requiredFields: [],
    optionalFields: ["currentSupplier", "catalogNumber", "productCategory", "sterility", "notes"]
  },
  {
    id: "recurring-supply",
    label: "Recurring supply",
    description:
      "Start recurring supply support with an email and any usage rhythm you already know. BioAxis can clarify timing and region later.",
    requiredFields: [],
    optionalFields: ["quantity", "sterility", "currentSupplier", "requiredSpecification", "notes"]
  },
  {
    id: "contact",
    label: "General sourcing question",
    description:
      "Send a general sourcing question, documentation note, equivalent matching request, or product-support message to BioAxis.",
    requiredFields: [],
    optionalFields: ["productCategory", "productName", "currentSupplier", "catalogNumber", "quantity", "sterility", "needSample", "needDocumentation", "targetTimeline"]
  }
];

const requestTypeAliases: Record<string, string> = {
  rfq: "quote",
  "quote-request": "quote",
  recurring: "recurring-supply",
  "product-list": "product-list-review",
  "product-list-review": "product-list-review",
  "product list": "product-list-review",
  "equivalent-finding": "equivalent",
  "equivalent-review": "equivalent",
  docs: "documentation",
  documents: "documentation",
  sample: "sample",
  documentation: "documentation",
  general: "contact",
  contact: "contact",
  support: "contact"
};

export function normalizeRequestType(id: string) {
  const normalizedId = requestTypeAliases[id] ?? id;
  return requestTypes.some((requestType) => requestType.id === normalizedId) ? normalizedId : "quote";
}

export function getRequestTypeById(id: string) {
  const normalizedId = normalizeRequestType(id);
  return requestTypes.find((requestType) => requestType.id === normalizedId) ?? requestTypes[0];
}
