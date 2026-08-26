export type SupportType = {
  id: string;
  title: string;
  description: string;
  whatToSend: string[];
  ctaLabel: string;
  requestHref: string;
};

export const supportTypes: SupportType[] = [
  {
    id: "product-matching",
    title: "Product matching",
    description: "Send a rough product note or list. BioAxis helps map it to the right family, format, and sourcing path.",
    whatToSend: ["current product details", "required specifications", "workflow or application"],
    ctaLabel: "Send product context",
    requestHref: "/request-quote?requestType=product-list-review&sourcePage=support&supportPath=product-matching"
  },
  {
    id: "equivalent-search",
    title: "Equivalent review",
    description: "Compare a current product against candidate alternatives using fit criteria, documents, and sample needs.",
    whatToSend: ["current supplier or brand", "catalog reference if known", "critical fit requirements"],
    ctaLabel: "Review equivalent",
    requestHref: "/equivalent-finder?sourcePage=support&supportPath=equivalent-review"
  },
  {
    id: "sample-request-support",
    title: "Sample path",
    description: "Prepare a low-friction sample request before switching, validating a format, or scaling repeat use.",
    whatToSend: ["product category", "evaluation use case", "shipping region if useful"],
    ctaLabel: "Request sample",
    requestHref: "/request-quote?requestType=sample&sourcePage=support&supportPath=sample-path"
  },
  {
    id: "documentation-support",
    title: "Documentation review",
    description: "Organize CoA, SDS, sterility, material, lot-level, and supplier specification requirements before purchase.",
    whatToSend: ["product name", "document types needed", "supplier or catalog reference if known"],
    ctaLabel: "Request documents",
    requestHref: "/request-quote?requestType=documentation&sourcePage=support&supportPath=documentation-review"
  },
  {
    id: "quote-preparation",
    title: "RFQ preparation",
    description: "Turn a product list, quantity, timeline, and document needs into a cleaner quote-ready sourcing brief.",
    whatToSend: ["product list", "quantity", "timeline or urgency", "shipping region if useful"],
    ctaLabel: "Prepare RFQ",
    requestHref: "/request-quote?requestType=quote&sourcePage=support&supportPath=rfq-preparation"
  },
  {
    id: "recurring-supply-planning",
    title: "Recurring supply planning",
    description: "Review repeat usage, replenishment timing, backup options, and private-label or OEM-style paths where relevant.",
    whatToSend: ["monthly or annual usage", "target replenishment timing", "critical specifications"],
    ctaLabel: "Review recurring demand",
    requestHref: "/request-quote?requestType=recurring-supply&sourcePage=support&supportPath=recurring-supply"
  },
  {
    id: "automation-compatibility-review",
    title: "Automation compatibility review",
    description: "Review consumable fit for robotic tips, reservoirs, plates, seals, tubes, SBS formats, and deck requirements.",
    whatToSend: ["robot platform", "consumable format", "compatibility requirements"],
    ctaLabel: "Review automation fit",
    requestHref: "/request-quote?requestType=equivalent&sourcePage=support&supportPath=automation-fit"
  }
];
