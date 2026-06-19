export type WorkflowCta = {
  label: string;
  href: string;
};

export type Workflow = {
  id: string;
  slug: string;
  stage: string;
  title: string;
  description: string;
  shortDescription: string;
  productFamilies: string[];
  whatYouAreDoing: string[];
  consumablesNeeded: string[];
  commonQuestions: string[];
  bioAxisHelp: string[];
  cta: WorkflowCta;
};

export type WorkflowProductMapItem = {
  workflow: string;
  families: string[];
};

export const workflows: Workflow[] = [
  {
    id: "target-discovery-biology-validation",
    slug: "target-discovery-biology-validation",
    stage: "Stage 01",
    title: "Target Discovery & Biology Validation",
    description:
      "Teams are validating disease biology, target relevance, pathway modulation, and biomarker readouts.",
    shortDescription: "Validate disease biology and biomarker readouts before assay scale-up.",
    productFamilies: ["Cell Culture", "PCR/qPCR", "ELISA", "Antibodies"],
    whatYouAreDoing: [
      "Build disease-relevant cell models",
      "Run gene knockdown or overexpression experiments",
      "Validate pathway and biomarker response",
      "Prepare samples for qPCR, western blot, ELISA, or imaging",
      "Store validated samples for follow-up studies"
    ],
    consumablesNeeded: [
      "Cell culture plates, flasks, and dishes",
      "Media, serum, supplements",
      "Transfection-ready plates",
      "PCR/qPCR plates and optical seals",
      "ELISA plates",
      "Antibody and immunoassay reagents",
      "Centrifuge tubes",
      "Cryovials",
      "Cell scrapers",
      "Low-bind tubes"
    ],
    commonQuestions: [
      "Which plate or surface format is best for this cell model?",
      "Can we find equivalents for current PCR, ELISA, or culture consumables?",
      "Can samples be provided before switching formats?"
    ],
    bioAxisHelp: [
      "Equivalent options",
      "Sample requests",
      "Product number matching",
      "Documentation collection",
      "Quote-ready sourcing lists"
    ],
    cta: {
      label: "Map this workflow",
      href: "/request-quote?requestType=product-list-review&workflow=target-discovery-biology-validation"
    }
  },
  {
    id: "cell-model-assay-development",
    slug: "cell-model-assay-development",
    stage: "Stage 02",
    title: "Cell Model & Assay Development",
    description:
      "Teams are building reproducible cell-based, biochemical, reporter, binding, or phenotypic assays.",
    shortDescription: "Build reproducible assay formats and lock critical consumable choices.",
    productFamilies: ["Assay Plates", "Plate Seals", "Filtered Tips", "Detection Reagents"],
    whatYouAreDoing: [
      "Select plate format and surface treatment",
      "Optimize cell seeding and reagent compatibility",
      "Compare detection formats",
      "Standardize repeatable assay consumables",
      "Prepare for scale-up into screening"
    ],
    consumablesNeeded: [
      "96-well assay plates",
      "384-well assay plates",
      "Clear, white, and black plates",
      "Low-binding plates",
      "Plate seals",
      "Reagent reservoirs",
      "Filtered tips",
      "Detection reagents",
      "Cell culture inserts",
      "Imaging-compatible plates"
    ],
    commonQuestions: [
      "Which plate color and surface treatment fits the readout?",
      "Can the assay be moved from 96-well to 384-well format?",
      "Can BioAxis source lower-cost equivalents without disrupting validation?"
    ],
    bioAxisHelp: [
      "Plate format recommendations",
      "Equivalent plate options",
      "Sample comparisons",
      "Assay consumables list building",
      "Quote support"
    ],
    cta: {
      label: "Build assay consumables list",
      href: "/request-quote?requestType=product-list-review&workflow=cell-model-assay-development"
    }
  },
  {
    id: "screening-hit-identification",
    slug: "screening-hit-identification",
    stage: "Stage 03",
    title: "Screening & Hit Identification",
    description:
      "Teams are running medium-throughput or high-throughput screens across compounds, peptides, siRNA, biologics, or functional assays.",
    shortDescription: "Support screening runs with automation-ready plates, tips, seals, and storage.",
    productFamilies: ["Automation Consumables", "Robotic Tips", "384/1536 Plates", "Storage"],
    whatYouAreDoing: [
      "Prepare assay-ready plates",
      "Support automated liquid handling",
      "Run cell-based or biochemical screens",
      "Seal, store, and track screening plates",
      "Standardize consumables across screening runs"
    ],
    consumablesNeeded: [
      "384-well assay plates",
      "1536-well assay plates",
      "Robotic tips",
      "Conductive tips",
      "Automation reservoirs",
      "Deep-well plates",
      "Plate seals",
      "Cap mats",
      "Barcoded plates and tubes",
      "Compound storage plates"
    ],
    commonQuestions: [
      "Which consumables fit our automation platform?",
      "Can tips or plates be replaced without disrupting performance?",
      "Can BioAxis support bulk screening quantities?"
    ],
    bioAxisHelp: [
      "Automation-compatible equivalents",
      "Bulk quote support",
      "Samples before switching",
      "Format standardization",
      "Product-number cross-reference"
    ],
    cta: {
      label: "Source screening formats",
      href: "/request-quote?requestType=quote&workflow=screening-hit-identification"
    }
  },
  {
    id: "lead-optimization-in-vitro-profiling",
    slug: "lead-optimization-in-vitro-profiling",
    stage: "Stage 04",
    title: "Lead Optimization & In Vitro Profiling",
    description:
      "Teams are testing potency, selectivity, stability, cellular activity, developability, and repeat assay performance.",
    shortDescription: "Map recurring profiling assays to repeat-use consumables and equivalent options.",
    productFamilies: ["Assays", "Filtration", "Low-bind Tubes", "Analytical Vials"],
    whatYouAreDoing: [
      "Run dose-response studies",
      "Compare potency and selectivity",
      "Prepare analytical and biological samples",
      "Run stability and formulation screening",
      "Repeat assays across optimization cycles"
    ],
    consumablesNeeded: [
      "Assay plates",
      "Low-retention tips",
      "Low-bind tubes",
      "Filtration plates",
      "Centrifugal filters",
      "Compound storage plates",
      "Sealing films",
      "Analytical vials",
      "Sample prep plates",
      "Cell viability assay consumables"
    ],
    commonQuestions: [
      "Which consumables are repeat-use bottlenecks?",
      "Can BioAxis lower cost for recurring optimization assays?",
      "Can equivalent formats be validated before larger orders?"
    ],
    bioAxisHelp: [
      "Repeat-use consumables mapping",
      "Equivalent sourcing",
      "Sample requests",
      "Analytical consumables matching",
      "Quote-ready recurring supply lists"
    ],
    cta: {
      label: "Map optimization consumables",
      href: "/request-quote?requestType=product-list-review&workflow=lead-optimization-in-vitro-profiling"
    }
  },
  {
    id: "adme-dmpk-bioanalysis",
    slug: "adme-dmpk-bioanalysis",
    stage: "Stage 05",
    title: "ADME / DMPK / Bioanalysis",
    description:
      "Teams are preparing and analyzing plasma, serum, tissue, microsomal, stability, binding, and PK samples.",
    shortDescription: "Coordinate sample prep, vials, filters, tubes, and storage for bioanalysis.",
    productFamilies: ["SPE Plates", "LC-MS Vials", "Filters", "Sample Tubes"],
    whatYouAreDoing: [
      "Prepare biological samples",
      "Run plasma or microsomal stability studies",
      "Support protein binding and cleanup workflows",
      "Prepare LC-MS or bioanalytical samples",
      "Store PK and bioanalysis samples"
    ],
    consumablesNeeded: [
      "SPE plates",
      "96-well filtration plates",
      "Centrifugal filters",
      "LC-MS vials",
      "Autosampler vials",
      "Low-bind tubes",
      "Sample collection tubes",
      "Storage plates",
      "Syringe filters",
      "Pipette tips"
    ],
    commonQuestions: [
      "Which vial or plate format fits the analytical instrument?",
      "Can BioAxis source analytical-grade alternatives?",
      "Can sample prep consumables be standardized across studies?"
    ],
    bioAxisHelp: [
      "Analytical-grade consumables sourcing",
      "Instrument-compatible format matching",
      "Sample prep alternatives",
      "Documentation support",
      "Quote support for recurring bioanalysis use"
    ],
    cta: {
      label: "Source ADME/DMPK consumables",
      href: "/request-quote?requestType=quote&workflow=adme-dmpk-bioanalysis"
    }
  },
  {
    id: "preclinical-sample-collection-storage",
    slug: "preclinical-sample-collection-storage",
    stage: "Stage 06",
    title: "Preclinical Sample Collection & Storage",
    description:
      "Teams are collecting, aliquoting, transporting, freezing, and tracking samples from animal studies and preclinical experiments.",
    shortDescription: "Plan collection, aliquoting, cold-chain handling, storage, and traceability.",
    productFamilies: ["Cryovials", "Barcoded Tubes", "Freezer Boxes", "Cold Chain"],
    whatYouAreDoing: [
      "Collect blood, serum, plasma, tissue, or cell samples",
      "Aliquot and label samples",
      "Transfer samples under cold-chain conditions",
      "Store samples short-term or long-term",
      "Maintain sample traceability"
    ],
    consumablesNeeded: [
      "Cryovials",
      "Barcoded tubes",
      "Freezer boxes",
      "Tissue homogenization consumables",
      "Serum and plasma tubes",
      "Transport tubes",
      "Cold-chain packaging",
      "Storage plates",
      "Tube racks",
      "Labels and sealing accessories"
    ],
    commonQuestions: [
      "Which storage format fits freezer and sample tracking requirements?",
      "Can BioAxis source barcoded tubes and freezer boxes?",
      "Can equivalent cryogenic products be validated first?"
    ],
    bioAxisHelp: [
      "Sample storage format selection",
      "Barcoded tube sourcing",
      "Cryogenic product equivalents",
      "Sample requests",
      "Preclinical storage consumables lists"
    ],
    cta: {
      label: "Plan sample storage",
      href: "/request-quote?requestType=product-list-review&workflow=preclinical-sample-collection-storage"
    }
  },
  {
    id: "process-development-early-cmc",
    slug: "process-development-early-cmc",
    stage: "Stage 07",
    title: "Process Development & Early CMC",
    description:
      "Teams are moving from research-scale work toward process development, sterile handling, media and buffer preparation, and early CMC support.",
    shortDescription: "Source sterile handling, filtration, transfer, and single-use formats for early process work.",
    productFamilies: ["Single-use Bags", "Tubing", "Sterile Connectors", "Filters"],
    whatYouAreDoing: [
      "Prepare media and buffers",
      "Run sterile filtration",
      "Set up small-scale bioprocess workflows",
      "Handle sampling and transfer",
      "Evaluate single-use consumables",
      "Support early QC needs"
    ],
    consumablesNeeded: [
      "Bottle-top filters",
      "Vacuum filtration units",
      "Sterile connectors",
      "Tubing sets",
      "Single-use bags",
      "Sampling bags",
      "Media bottles",
      "Buffer prep consumables",
      "Sterile transfer accessories",
      "Filtration membranes"
    ],
    commonQuestions: [
      "Which sterile filtration format fits the process scale?",
      "Can BioAxis source single-use alternatives?",
      "Can documentation be organized for process development use?"
    ],
    bioAxisHelp: [
      "Pilot-scale consumables sourcing",
      "Sterile format comparison",
      "Single-use alternatives",
      "Documentation collection",
      "Quote support"
    ],
    cta: {
      label: "Source early CMC consumables",
      href: "/request-quote?requestType=quote&workflow=process-development-early-cmc"
    }
  },
  {
    id: "qc-analytical-testing-release-support",
    slug: "qc-analytical-testing-release-support",
    stage: "Stage 08",
    title: "QC, Analytical Testing & Release Support",
    description:
      "Teams are supporting quality testing, contamination control, analytical sample handling, microbiology workflows, and release-adjacent testing.",
    shortDescription: "Organize quality-adjacent testing consumables and documentation requests.",
    productFamilies: ["Membranes", "HPLC Vials", "Sterility Testing", "Endotoxin"],
    whatYouAreDoing: [
      "Run sterility or contamination testing",
      "Prepare analytical samples",
      "Perform HPLC/UPLC sample handling",
      "Support endotoxin or microbiology testing",
      "Maintain documentation for quality workflows"
    ],
    consumablesNeeded: [
      "Membrane filters",
      "Sterility testing consumables",
      "Endotoxin testing kits",
      "HPLC/UPLC vials",
      "Microbiology plates",
      "Syringe filters",
      "pH and conductivity consumables",
      "Sample prep filters",
      "Sterile tubes",
      "Analytical sample containers"
    ],
    commonQuestions: [
      "Which consumables require quality documentation?",
      "Can BioAxis find QC-compatible equivalents?",
      "Can recurring QC supply lists be organized?"
    ],
    bioAxisHelp: [
      "QC-compatible consumables sourcing",
      "Quality document collection",
      "Equivalent option comparison",
      "Recurring quote lists",
      "Analytical testing support"
    ],
    cta: {
      label: "Build QC supply list",
      href: "/request-quote?requestType=documentation&workflow=qc-analytical-testing-release-support"
    }
  }
];

export const workflowProductFamilyMap: WorkflowProductMapItem[] = [
  {
    workflow: "Target Discovery",
    families: ["Cell Culture", "PCR/qPCR", "Assays", "Antibodies", "Sample Prep"]
  },
  {
    workflow: "Assay Development",
    families: ["Assay Plates", "Detection Reagents", "Tips", "Reservoirs", "Plate Seals"]
  },
  {
    workflow: "Screening",
    families: ["Automation Consumables", "Robotic Tips", "Plates", "Seals", "Storage"]
  },
  {
    workflow: "Lead Optimization",
    families: ["Assays", "Filtration", "Low-bind Tubes", "Analytical Vials", "Sample Prep"]
  },
  {
    workflow: "ADME / DMPK",
    families: ["SPE Plates", "Filters", "LC-MS Vials", "Sample Tubes", "Storage Plates"]
  },
  {
    workflow: "Preclinical",
    families: ["Cryovials", "Barcoded Tubes", "Freezer Boxes", "Collection Tubes", "Cold Chain"]
  },
  {
    workflow: "Early CMC",
    families: ["Single-use Bags", "Tubing", "Sterile Connectors", "Filters", "Media Bottles"]
  },
  {
    workflow: "QC / Analytical",
    families: ["Membranes", "HPLC Vials", "Sterility Testing", "Endotoxin", "Microbiology"]
  }
];

export const workflowUseCases = [
  "Build a new assay consumables list",
  "Replace current supplier products with equivalents",
  "Source automation-compatible formats",
  "Prepare preclinical sample storage setup",
  "Support early CMC consumables sourcing",
  "Organize recurring QC consumables",
  "Convert protocols or product-number lists into quote-ready sourcing lists"
];
