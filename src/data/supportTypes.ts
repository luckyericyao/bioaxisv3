export type SupportType = {
  id: string;
  title: string;
  description: string;
  whatToSend: string[];
  relatedRequestType: string;
};

export const supportTypes: SupportType[] = [
  {
    id: "product-matching",
    title: "Product matching",
    description: "Tell us about your application and required specifications. We help match product families and formats.",
    whatToSend: ["application", "required specifications", "current product details"],
    relatedRequestType: "Product list review"
  },
  {
    id: "equivalent-search",
    title: "Equivalent search",
    description: "Provide your current supplier or catalog number to find compatible alternatives.",
    whatToSend: ["current supplier", "catalog number", "critical specifications"],
    relatedRequestType: "Equivalent request"
  },
  {
    id: "sample-request-support",
    title: "Sample request support",
    description: "Need a trial before switching? BioAxis can help coordinate sample requests where available.",
    whatToSend: ["product category", "evaluation use case", "shipping region"],
    relatedRequestType: "Sample request"
  },
  {
    id: "documentation-support",
    title: "Documentation support",
    description: "Request COA, SDS, sterility, material, or lot-level documentation where available.",
    whatToSend: ["product name", "documentation type", "supplier or catalog number if known"],
    relatedRequestType: "Documentation request"
  },
  {
    id: "quote-preparation",
    title: "Quote preparation",
    description: "Ready to purchase? Submit your requirements and BioAxis will organize supplier quote options.",
    whatToSend: ["product list", "quantity", "timeline", "shipping region"],
    relatedRequestType: "Quote request"
  },
  {
    id: "recurring-supply-planning",
    title: "Recurring supply planning",
    description: "Share expected usage and timeline so BioAxis can help plan longer-term sourcing support.",
    whatToSend: ["monthly or annual usage", "target timeline", "critical specifications"],
    relatedRequestType: "Recurring supply request"
  },
  {
    id: "automation-compatibility-review",
    title: "Automation compatibility review",
    description: "Review consumable fit for robotic tips, reservoirs, plates, seals, tubes, and SBS-format workflows.",
    whatToSend: ["robot platform", "consumable format", "compatibility requirements"],
    relatedRequestType: "Product list review"
  }
];

