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
    label: "Quote request",
    description:
      "Let us know the products you need and the specifications required. BioAxis will help organize supplier quote options.",
    requiredFields: ["productCategory", "productName", "quantity", "targetTimeline"],
    optionalFields: ["productList", "currentSupplier", "catalogNumber", "sterility", "requiredSpecification", "needDocumentation", "notes"]
  },
  {
    id: "equivalent",
    label: "Equivalent request",
    description:
      "Tell us your current supplier or catalog number along with critical specifications. BioAxis will help identify compatible alternatives and support sample or quote requests.",
    requiredFields: ["productName", "currentSupplier", "catalogNumber", "requiredSpecification"],
    optionalFields: ["productCategory", "quantity", "sterility", "needSample", "needDocumentation", "notes"]
  },
  {
    id: "sample",
    label: "Sample request",
    description:
      "Provide details on the consumables you want to test before switching suppliers or scaling volume.",
    requiredFields: ["productCategory", "productName", "requiredSpecification", "targetTimeline"],
    optionalFields: ["currentSupplier", "catalogNumber", "quantity", "sterility", "monthlyUsage", "notes"]
  },
  {
    id: "documentation",
    label: "Documentation request",
    description:
      "Select the documentation you need, such as CoA, SDS, sterility information, material information, or lot-level documents where available.",
    requiredFields: ["productName", "needDocumentation", "requiredSpecification"],
    optionalFields: ["currentSupplier", "catalogNumber", "productCategory", "sterility", "notes"]
  },
  {
    id: "recurring-supply",
    label: "Recurring supply request",
    description:
      "Share expected usage, timing, and shipping region so BioAxis can help plan recurring sourcing support.",
    requiredFields: ["productCategory", "productName", "monthlyUsage", "targetTimeline"],
    optionalFields: ["quantity", "sterility", "currentSupplier", "requiredSpecification", "notes"]
  },
  {
    id: "product-list-review",
    label: "Product list review",
    description:
      "Paste a product list so BioAxis can organize products by segment, family, quote path, equivalent review, sample need, and documentation requirement.",
    requiredFields: ["productList"],
    optionalFields: ["productCategory", "currentSupplier", "needDocumentation", "targetTimeline", "notes"]
  },
  {
    id: "contact",
    label: "Contact request",
    description:
      "Send a general sourcing question, documentation note, equivalent matching request, or procurement-support message to BioAxis.",
    requiredFields: ["notes"],
    optionalFields: ["productCategory", "productName", "currentSupplier", "catalogNumber", "quantity", "sterility", "needSample", "needDocumentation", "targetTimeline"]
  }
];

const requestTypeAliases: Record<string, string> = {
  recurring: "recurring-supply",
  "product-list": "product-list-review",
  support: "contact"
};

export function normalizeRequestType(id: string) {
  return requestTypeAliases[id] ?? id;
}

export function getRequestTypeById(id: string) {
  const normalizedId = normalizeRequestType(id);
  return requestTypes.find((requestType) => requestType.id === normalizedId) ?? requestTypes[0];
}
