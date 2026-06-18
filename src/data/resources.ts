export type ResourceGuide = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  relatedSegments: string[];
  relatedWorkflows: string[];
  status: "coming-soon" | "available";
  ctaCopy: string;
};

export const resourceGuides: ResourceGuide[] = [
  {
    id: "pipette-tips-workflows",
    slug: "choose-pipette-tips-manual-automated-workflows",
    title: "How to choose pipette tips for manual and automated workflows",
    summary: "Understand universal, filtered, low-retention, and robotic tips, and how to match formats to your workflow.",
    relatedSegments: ["Liquid Handling", "Automation Consumables"],
    relatedWorkflows: ["Automation & HTS", "Molecular Biology & PCR"],
    status: "coming-soon",
    ctaCopy: "Read guide"
  },
  {
    id: "equivalent-consumables",
    slug: "evaluate-equivalent-lab-consumables",
    title: "How to evaluate equivalent lab consumables before switching suppliers",
    summary: "Compare specifications, request documentation, run pilot tests, and reduce switching risk.",
    relatedSegments: ["Liquid Handling", "Lab Plasticware", "Sample Prep & Filtration"],
    relatedWorkflows: ["Automation & HTS", "Cell Culture"],
    status: "coming-soon",
    ctaCopy: "Request sourcing support"
  },
  {
    id: "sterile-vs-non-sterile",
    slug: "sterile-vs-non-sterile-consumables",
    title: "Sterile vs non-sterile consumables: what matters by workflow",
    summary: "Learn when sterility matters and what information to request before purchasing.",
    relatedSegments: ["Cell Culture", "Liquid Handling", "Lab Plasticware"],
    relatedWorkflows: ["Cell Culture", "Sample Prep & Filtration"],
    status: "coming-soon",
    ctaCopy: "Read guide"
  },
  {
    id: "retention-bind-filtered",
    slug: "low-retention-low-bind-filtered-formats",
    title: "Low-retention, low-bind, and filtered formats explained",
    summary: "Understand how these formats reduce sample loss, contamination, or adsorption in sensitive workflows.",
    relatedSegments: ["Liquid Handling", "Lab Plasticware"],
    relatedWorkflows: ["Molecular Biology & PCR", "Cell Culture"],
    status: "coming-soon",
    ctaCopy: "Read guide"
  },
  {
    id: "prepare-rfq",
    slug: "prepare-consumables-rfq",
    title: "How to prepare a consumables RFQ for faster supplier response",
    summary: "Include product names, catalog numbers, specifications, volumes, timelines, and documentation needs.",
    relatedSegments: ["Liquid Handling", "Cell Culture", "Automation Consumables"],
    relatedWorkflows: ["Automation & HTS", "Early Bioprocess & Single-Use"],
    status: "coming-soon",
    ctaCopy: "Request sourcing support"
  },
  {
    id: "cell-culture-setup",
    slug: "cell-culture-workflow-consumables",
    title: "Key consumables for cell culture workflow setup",
    summary: "Media, sera, supplements, cultureware, dissociation reagents, coatings, and cryopreservation supplies.",
    relatedSegments: ["Cell Culture", "Storage & Cryopreservation"],
    relatedWorkflows: ["Cell Culture"],
    status: "coming-soon",
    ctaCopy: "Read guide"
  },
  {
    id: "pcr-qpcr-consumables",
    slug: "pcr-qpcr-workflow-consumables",
    title: "Key consumables for PCR and qPCR workflows",
    summary: "PCR plastics, optical seals, master mixes, extraction kits, and nuclease-free formats.",
    relatedSegments: ["Molecular Biology & PCR"],
    relatedWorkflows: ["Molecular Biology & PCR"],
    status: "coming-soon",
    ctaCopy: "Read guide"
  },
  {
    id: "automation-consumables",
    slug: "qualifying-automation-consumables",
    title: "What to check before qualifying automation consumables",
    summary: "Review robot compatibility, SBS format, conductivity, sterility, barcoding, and packaging.",
    relatedSegments: ["Automation Consumables", "Liquid Handling"],
    relatedWorkflows: ["Automation & HTS"],
    status: "coming-soon",
    ctaCopy: "Request sourcing support"
  }
];

