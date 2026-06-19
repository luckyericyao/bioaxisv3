export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  productHref: string;
  equivalentHref: string;
  sampleHref: string;
  rfqHref: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
};

type GuideConfig = {
  slug: string;
  title: string;
  description: string;
  productHref: string;
  equivalentHref?: string;
  sampleHref?: string;
  rfqHref?: string;
  selectionFocus: string[];
  documentationFocus: string[];
  sampleFocus: string[];
};

const guideConfigs: GuideConfig[] = [
  {
    slug: "filtered-vs-non-filtered-pipette-tips",
    title: "Filtered vs non-filtered pipette tips",
    description: "A practical guide to choosing filtered or non-filtered pipette tips for contamination-sensitive workflows.",
    productHref: "/products/liquid-handling/pipette-tips",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=filtered%20pipette%20tips",
    sampleHref: "/request-quote?requestType=sample&productName=filtered%20pipette%20tips",
    rfqHref: "/request-quote?requestType=quote&productName=filtered%20pipette%20tips",
    selectionFocus: ["volume range", "filter barrier", "sterile status", "low-retention option", "rack or reload packaging"],
    documentationFocus: ["sterility statement", "DNase/RNase-free statement", "PCR-clean information", "material declaration", "lot traceability"],
    sampleFocus: ["pipette fit", "seal on manual or multichannel pipettes", "liquid retention", "PCR or qPCR contamination control"]
  },
  {
    slug: "low-retention-pipette-tips-when-to-use",
    title: "Low-retention pipette tips: when to use",
    description: "How to decide when low-retention surfaces are useful for recovery-sensitive liquid handling.",
    productHref: "/products/liquid-handling/pipette-tips/low-retention-pipette-tips",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=low%20retention%20tips",
    sampleHref: "/request-quote?requestType=sample&productName=low%20retention%20pipette%20tips",
    rfqHref: "/request-quote?requestType=quote&productName=low%20retention%20pipette%20tips",
    selectionFocus: ["sample viscosity", "protein or nucleic acid recovery", "low-volume transfer", "filtered option", "racked or reload format"],
    documentationFocus: ["DNase/RNase-free statement", "low-retention surface description", "sterility statement where needed", "material declaration"],
    sampleFocus: ["recovery comparison", "repeat pipetting performance", "fit on current pipettes", "assay impact before switching"]
  },
  {
    slug: "how-to-choose-96-well-pcr-plates",
    title: "How to choose 96-well PCR plates",
    description: "A buyer guide for matching PCR plates by geometry, instrument fit, sealing, and documentation needs.",
    productHref: "/products/molecular-biology-pcr/pcr-plastics/96-well-pcr-plates",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=96-well%20PCR%20plates",
    sampleHref: "/request-quote?requestType=sample&productName=96-well%20PCR%20plates",
    rfqHref: "/request-quote?requestType=quote&productName=96-well%20PCR%20plates",
    selectionFocus: ["skirt style", "plate profile", "thermal cycler compatibility", "seal compatibility", "well volume"],
    documentationFocus: ["DNase/RNase-free statement", "PCR-clean information", "material declaration", "lot traceability"],
    sampleFocus: ["instrument fit", "seal adhesion", "evaporation control", "workflow comparison against current plate"]
  },
  {
    slug: "how-to-choose-qpcr-optical-seals",
    title: "How to choose qPCR optical seals",
    description: "How qPCR sealing choices affect optical readout, evaporation control, and instrument compatibility.",
    productHref: "/products/molecular-biology-pcr/qpcr-consumables/optical-sealing-films",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=qPCR%20optical%20seals",
    sampleHref: "/request-quote?requestType=sample&productName=qPCR%20optical%20seals",
    rfqHref: "/request-quote?requestType=quote&productName=qPCR%20optical%20seals",
    selectionFocus: ["optical clarity", "adhesive strength", "plate compatibility", "instrument cover fit", "low evaporation"],
    documentationFocus: ["PCR-clean information", "DNase/RNase-free statement", "material declaration", "storage condition"],
    sampleFocus: ["seal integrity", "readout consistency", "evaporation check", "plate and instrument fit"]
  },
  {
    slug: "pes-vs-pvdf-vs-ptfe-syringe-filters",
    title: "PES vs PVDF vs PTFE syringe filters",
    description: "A membrane-focused comparison for aqueous, protein-containing, solvent, and analytical sample filtration.",
    productHref: "/products/sample-prep-filtration/syringe-filters",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=PES%200.22%20syringe%20filter",
    sampleHref: "/request-quote?requestType=sample&productName=syringe%20filters",
    rfqHref: "/request-quote?requestType=quote&productName=syringe%20filters",
    selectionFocus: ["membrane chemistry", "pore size", "filter diameter", "protein binding", "chemical compatibility"],
    documentationFocus: ["membrane material information", "sterility statement", "CoA where available", "chemical compatibility guidance"],
    sampleFocus: ["flow rate", "sample recovery", "binding profile", "extractables/leachables relevance"]
  },
  {
    slug: "how-to-evaluate-sterile-syringe-filters",
    title: "How to evaluate sterile syringe filters",
    description: "A switching checklist for sterile syringe filters used in media prep, sample cleanup, and sterile handling.",
    productHref: "/products/sample-prep-filtration/syringe-filters/sterile-syringe-filters",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=sterile%20syringe%20filter",
    sampleHref: "/request-quote?requestType=sample&productName=sterile%20syringe%20filters",
    rfqHref: "/request-quote?requestType=quote&productName=sterile%20syringe%20filters",
    selectionFocus: ["sterile status", "membrane material", "pore size", "diameter", "hold-up volume"],
    documentationFocus: ["sterility statement", "CoA where available", "material declaration", "lot traceability"],
    sampleFocus: ["sterile workflow fit", "flow behavior", "sample matrix compatibility", "packaging review"]
  },
  {
    slug: "how-to-prepare-a-consumables-rfq",
    title: "How to prepare a consumables RFQ",
    description: "How to turn a spreadsheet or product-number list into a BioAxis sourcing request.",
    productHref: "/products",
    equivalentHref: "/equivalent-finder?requestType=equivalent",
    sampleHref: "/request-quote?requestType=sample",
    rfqHref: "/request-quote?requestType=product-list-review",
    selectionFocus: ["supplier", "catalog number", "product description", "quantity", "timeline"],
    documentationFocus: ["CoA", "SDS", "sterility information", "DNase/RNase-free information", "lot traceability"],
    sampleFocus: ["switching-sensitive items", "critical workflow items", "automation or cell-contact consumables", "sample quantity needed"]
  },
  {
    slug: "how-to-compare-equivalent-cryovials",
    title: "How to compare equivalent cryovials",
    description: "Compare cryovials by thread style, storage conditions, sterility, sample traceability, and sample-first evaluation.",
    productHref: "/products/storage-cryopreservation/cryogenic-vials",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=cryogenic%20vials",
    sampleHref: "/request-quote?requestType=sample&productName=cryogenic%20vials",
    rfqHref: "/request-quote?requestType=quote&productName=cryogenic%20vials",
    selectionFocus: ["volume", "internal or external thread", "sterile status", "temperature range", "barcode support"],
    documentationFocus: ["sterility statement", "material declaration", "temperature range information", "lot traceability"],
    sampleFocus: ["cap fit", "leak resistance", "freezer box compatibility", "sample traceability workflow"]
  },
  {
    slug: "how-to-source-automation-compatible-tips",
    title: "How to source automation-compatible tips",
    description: "A liquid-handler-focused checklist for robotic tip matching and sourcing conversations.",
    productHref: "/products/automation-consumables/robotic-pipette-tips",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=automation-compatible%20tips",
    sampleHref: "/request-quote?requestType=sample&productName=automation-compatible%20tips",
    rfqHref: "/request-quote?requestType=quote&productName=automation-compatible%20tips",
    selectionFocus: ["liquid handler platform", "rack geometry", "conductive requirement", "filtered status", "nested packaging"],
    documentationFocus: ["platform fit information", "sterility statement", "barcode specification", "lot traceability"],
    sampleFocus: ["deck fit", "liquid-level sensing", "tip pickup and eject", "method comparison before switching"]
  },
  {
    slug: "hamilton-vs-tecan-tip-compatibility-questions",
    title: "Hamilton vs Tecan tip compatibility questions",
    description: "Questions procurement and automation teams should ask before changing robotic tip sources.",
    productHref: "/products/automation-consumables/robotic-pipette-tips",
    equivalentHref: "/equivalent-finder?requestType=equivalent&q=Hamilton%20Tecan%20tips",
    sampleHref: "/request-quote?requestType=sample&productName=robotic%20pipette%20tips",
    rfqHref: "/request-quote?requestType=quote&productName=robotic%20pipette%20tips",
    selectionFocus: ["platform model", "tip volume", "conductivity", "rack height", "deck method constraints"],
    documentationFocus: ["platform fit information", "sterility statement where needed", "lot traceability", "barcode specification"],
    sampleFocus: ["pickup performance", "liquid-level sensing", "gripper or deck clearance", "validated method impact"]
  },
  {
    slug: "what-documents-to-request-for-sterile-consumables",
    title: "What documents to request for sterile consumables",
    description: "A documentation checklist for sterile lab consumables and switching-sensitive sourcing requests.",
    productHref: "/quality",
    equivalentHref: "/equivalent-finder?requestType=equivalent",
    sampleHref: "/request-quote?requestType=sample",
    rfqHref: "/request-quote?requestType=documentation",
    selectionFocus: ["product family", "sterile status", "application", "supplier or catalog number", "lot needs"],
    documentationFocus: ["CoA", "SDS", "sterility statement", "material declaration", "lot traceability"],
    sampleFocus: ["cell-contact products", "sterile filtration", "critical assay consumables", "workflow-specific acceptance criteria"]
  },
  {
    slug: "how-to-qualify-equivalent-lab-consumables-before-switching",
    title: "How to qualify equivalent lab consumables before switching",
    description: "A sample-first and documentation-aware path for reviewing equivalent lab consumables.",
    productHref: "/products",
    equivalentHref: "/equivalent-finder?requestType=equivalent",
    sampleHref: "/request-quote?requestType=sample",
    rfqHref: "/request-quote?requestType=product-list-review",
    selectionFocus: ["must-match specifications", "current supplier", "catalog number", "material", "format"],
    documentationFocus: ["CoA", "SDS", "sterility statement", "material declaration", "lot traceability"],
    sampleFocus: ["fit", "workflow compatibility", "assay impact", "automation or instrument compatibility"]
  }
];

function buildArticle(config: GuideConfig): ResourceArticle {
  const equivalentHref = config.equivalentHref ?? "/equivalent-finder?requestType=equivalent";
  const sampleHref = config.sampleHref ?? "/request-quote?requestType=sample";
  const rfqHref = config.rfqHref ?? "/request-quote?requestType=quote";

  return {
    slug: config.slug,
    title: config.title,
    description: config.description,
    productHref: config.productHref,
    equivalentHref,
    sampleHref,
    rfqHref,
    sections: [
      {
        heading: "Start with the intended workflow",
        body: [
          `Before comparing options, write down where the product will be used and which specifications cannot change. For ${config.title.toLowerCase()}, the request should include ${config.selectionFocus.join(", ")}.`,
          "This keeps the search focused on fit, documentation, sample review, and quote-ready sourcing details instead of matching only a product name."
        ]
      },
      {
        heading: "Document the must-match specifications",
        body: [
          `Common selection inputs include ${config.selectionFocus.join(", ")}. If the request involves an equivalent, include the current supplier and catalog number so BioAxis can help organize a comparison path.`,
          "Separate hard requirements from preferences. Hard requirements might include sterility, instrument compatibility, material, volume, or cleanliness statements. Preferences might include pack size, case quantity, or packaging format."
        ]
      },
      {
        heading: "Request supplier-provided documentation early",
        body: [
          `Useful documentation may include ${config.documentationFocus.join(", ")}. Availability depends on the supplier and product record, so documentation requests should be included before the quote path is finalized.`,
          "Certification, sterility, and quality claims remain tied to supplier-provided product documentation. BioAxis can help request and organize the evidence for customer review."
        ]
      },
      {
        heading: "Use samples for switching-sensitive items",
        body: [
          `Sample-first review is useful when teams need to check ${config.sampleFocus.join(", ")}. The sample request should describe the current product, proposed use, quantity needed, and acceptance criteria.`,
          "A candidate equivalent should be reviewed in the actual workflow before larger-volume purchasing when performance, fit, documentation, or downstream results could be affected."
        ]
      },
      {
        heading: "Turn the request into a sourcing list",
        body: [
          "A quote-ready request includes supplier, catalog number, product description, quantity, required documents, sample needs, shipping region, and target timeline.",
          "BioAxis can help map that request to product families, equivalent review, documentation support, sample path, and recurring supply planning where appropriate."
        ]
      }
    ]
  };
}

export const resourceArticles: ResourceArticle[] = guideConfigs.map(buildArticle);

export function getResourceArticleBySlug(slug: string) {
  return resourceArticles.find((article) => article.slug === slug);
}
