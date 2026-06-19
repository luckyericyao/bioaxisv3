export type ResourceGuide = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  relatedSegments: string[];
  relatedWorkflows: string[];
  status: "available";
  ctaCopy: string;
};

export const resourceGuides: ResourceGuide[] = [
  {
    id: "choose-pipette-tips",
    slug: "how-to-choose-pipette-tips",
    title: "How to choose pipette tips",
    summary: "Volume range, filter barrier, sterile status, low-retention surfaces, DNase/RNase-free claims, packaging, and automation fit.",
    relatedSegments: ["Liquid Handling", "Automation Consumables"],
    relatedWorkflows: ["Molecular Biology & PCR", "Cell Culture"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "evaluate-equivalent-consumables",
    slug: "how-to-evaluate-equivalent-consumables",
    title: "How to evaluate equivalent consumables",
    summary: "Compare dimensions, material, sterility, fit, documentation, sample testing, packaging, and lot consistency before switching.",
    relatedSegments: ["Liquid Handling", "Lab Plasticware", "Sample Prep & Filtration"],
    relatedWorkflows: ["Automation-compatible sourcing", "Quality Review"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "prepare-consumables-rfq",
    slug: "how-to-prepare-a-consumables-rfq",
    title: "How to prepare a consumables RFQ",
    summary: "Include catalog number, supplier, product description, volume, documents, packaging preference, timeline, and sample needs.",
    relatedSegments: ["All Product Segments"],
    relatedWorkflows: ["Procurement", "Equivalent Sourcing"],
    status: "available",
    ctaCopy: "Read guide"
  }
];
