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
    id: "filtered-vs-non-filtered-pipette-tips",
    slug: "filtered-vs-non-filtered-pipette-tips",
    title: "Filtered vs non-filtered pipette tips",
    summary: "When aerosol barriers matter, how to request PCR-clean documentation, and what to include in a tip equivalent review.",
    relatedSegments: ["Liquid Handling", "Automation Consumables"],
    relatedWorkflows: ["PCR/qPCR", "Cell Culture", "Assay Setup"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "low-retention-pipette-tips",
    slug: "low-retention-pipette-tips-when-to-use",
    title: "Low-retention pipette tips: when to use",
    summary: "How low-retention tips support viscous, protein, nucleic acid, enzyme, detergent, and low-volume workflows.",
    relatedSegments: ["Liquid Handling"],
    relatedWorkflows: ["Molecular Biology & PCR", "Protein Assays"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "choose-96-well-pcr-plates",
    slug: "how-to-choose-96-well-pcr-plates",
    title: "How to choose 96-well PCR plates",
    summary: "Skirt style, plate profile, instrument compatibility, seal fit, PCR-clean documentation, and sample volume considerations.",
    relatedSegments: ["Molecular Biology & PCR", "Automation Consumables"],
    relatedWorkflows: ["PCR/qPCR", "Screening"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "choose-qpcr-optical-seals",
    slug: "how-to-choose-qpcr-optical-seals",
    title: "How to choose qPCR optical seals",
    summary: "Optical clarity, adhesive strength, evaporation control, instrument compatibility, and documentation needs for qPCR sealing.",
    relatedSegments: ["Molecular Biology & PCR"],
    relatedWorkflows: ["qPCR", "Gene Expression"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "pes-pvdf-ptfe-syringe-filters",
    slug: "pes-vs-pvdf-vs-ptfe-syringe-filters",
    title: "PES vs PVDF vs PTFE syringe filters",
    summary: "Compare membrane chemistry, binding profile, aqueous or solvent compatibility, pore size, sterility, and documentation needs.",
    relatedSegments: ["Sample Prep & Filtration"],
    relatedWorkflows: ["Sample Prep", "Sterile Filtration", "Bioanalysis"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "evaluate-sterile-syringe-filters",
    slug: "how-to-evaluate-sterile-syringe-filters",
    title: "How to evaluate sterile syringe filters",
    summary: "Review membrane, pore size, diameter, sterility statement, hold-up volume, sample matrix, and sample-first testing criteria.",
    relatedSegments: ["Sample Prep & Filtration", "Cell Culture"],
    relatedWorkflows: ["Sterile Filtration", "Media Prep"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "prepare-product-list-rfq",
    slug: "how-to-prepare-a-product-list-rfq",
    title: "How to prepare a product list RFQ",
    summary: "Turn supplier names, catalog numbers, product descriptions, quantities, documents, and timing into a quote-ready list.",
    relatedSegments: ["All Product Segments"],
    relatedWorkflows: ["Procurement", "Recurring Supply"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "compare-equivalent-cryovials",
    slug: "how-to-compare-equivalent-cryovials",
    title: "How to compare equivalent cryovials",
    summary: "Compare thread style, volume, sterility, temperature range, leak resistance, barcode support, and sample testing needs.",
    relatedSegments: ["Storage & Cryopreservation", "Cell Culture"],
    relatedWorkflows: ["Sample Banking", "Preclinical Storage"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "source-automation-compatible-tips",
    slug: "how-to-source-automation-compatible-tips",
    title: "How to source automation-compatible tips",
    summary: "Capture platform, rack geometry, conductivity, filter status, sterile status, barcode needs, samples, and validation constraints.",
    relatedSegments: ["Automation Consumables", "Liquid Handling"],
    relatedWorkflows: ["Screening", "Automated Extraction"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "hamilton-vs-tecan-compatibility",
    slug: "hamilton-vs-tecan-tip-compatibility-questions",
    title: "Hamilton vs Tecan tip compatibility questions",
    summary: "Questions to ask before switching robotic tips across liquid handlers, including rack fit, conductivity, deck height, and method impact.",
    relatedSegments: ["Automation Consumables"],
    relatedWorkflows: ["Liquid Handler Automation", "HTS"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "documents-for-sterile-consumables",
    slug: "what-documents-to-request-for-sterile-consumables",
    title: "What documents to request for sterile consumables",
    summary: "Common documentation requests include CoA, SDS, sterility statements, material information, lot traceability, and storage conditions.",
    relatedSegments: ["Cell Culture", "Sample Prep & Filtration", "Early Bioprocess & Single-Use"],
    relatedWorkflows: ["Quality Review", "Sterile Handling"],
    status: "available",
    ctaCopy: "Read guide"
  },
  {
    id: "qualify-equivalent-lab-consumables",
    slug: "how-to-qualify-equivalent-lab-consumables-before-switching",
    title: "How to qualify equivalent lab consumables before switching",
    summary: "Define must-match specs, request documents, compare format and material, test samples, and plan recurring supply review.",
    relatedSegments: ["Liquid Handling", "Lab Plasticware", "Sample Prep & Filtration"],
    relatedWorkflows: ["Equivalent Sourcing", "Sample-First Switching"],
    status: "available",
    ctaCopy: "Read guide"
  }
];
