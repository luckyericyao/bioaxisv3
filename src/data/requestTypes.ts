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
    optionalFields: ["currentSupplier", "catalogNumber", "requiredSpecification", "needDocumentation", "notes"]
  },
  {
    id: "equivalent",
    label: "Equivalent request",
    description:
      "Tell us your current supplier or catalog number along with critical specifications. BioAxis will help identify compatible alternatives and support sample or quote requests.",
    requiredFields: ["productName", "currentSupplier", "catalogNumber", "requiredSpecification"],
    optionalFields: ["productCategory", "quantity", "needSample", "needDocumentation", "notes"]
  },
  {
    id: "sample",
    label: "Sample request",
    description:
      "Provide details on the consumables you want to test before switching suppliers or scaling volume.",
    requiredFields: ["productCategory", "productName", "requiredSpecification", "targetTimeline"],
    optionalFields: ["currentSupplier", "catalogNumber", "monthlyUsage", "notes"]
  },
  {
    id: "documentation",
    label: "Documentation request",
    description:
      "Select the documentation you need, such as COA, SDS, sterility information, material information, or lot-level documents where available.",
    requiredFields: ["productName", "needDocumentation", "requiredSpecification"],
    optionalFields: ["currentSupplier", "catalogNumber", "notes"]
  },
  {
    id: "recurring",
    label: "Recurring supply request",
    description:
      "Share expected usage, timing, and shipping region so BioAxis can help plan recurring sourcing support.",
    requiredFields: ["productCategory", "productName", "monthlyUsage", "targetTimeline"],
    optionalFields: ["quantity", "currentSupplier", "requiredSpecification", "notes"]
  },
  {
    id: "product-list",
    label: "Product list review",
    description:
      "Upload support can be added in a future version. For now, paste your product list in the Notes field so BioAxis can help organize review.",
    requiredFields: ["notes"],
    optionalFields: ["productCategory", "currentSupplier", "needDocumentation", "targetTimeline"]
  }
];

export function getRequestTypeById(id: string) {
  return requestTypes.find((requestType) => requestType.id === id) ?? requestTypes[0];
}

