export type Workflow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  typicalProducts: string[];
  commonQuestions: string[];
  relatedSegments: string[];
  ctaCopy: string;
};

export const workflows: Workflow[] = [
  {
    id: "cell-culture",
    slug: "cell-culture",
    title: "Cell Culture",
    description: "Media, supplements, flasks, plates, dissociation reagents, freezing media, and coatings.",
    typicalProducts: ["media", "sera", "supplements", "antibiotics", "flasks", "dishes", "plates", "coatings", "cryopreservation media"],
    commonQuestions: ["Which formulation should I choose?", "What flask surface is best?", "How do I switch suppliers?"],
    relatedSegments: ["Cell Culture", "Storage & Cryopreservation", "Lab Plasticware"],
    ctaCopy: "Explore cell culture workflow"
  },
  {
    id: "molecular-biology-pcr",
    slug: "molecular-biology-pcr",
    title: "Molecular Biology & PCR",
    description: "PCR and qPCR consumables, nucleic acid extraction kits, electrophoresis products, and cloning tools.",
    typicalProducts: ["PCR tubes", "PCR plates", "qPCR plates", "optical seals", "master mixes", "extraction kits", "cleanup kits"],
    commonQuestions: ["Which plate format fits my instrument?", "Do I need optical or low-profile formats?", "What nuclease-free information should I request?"],
    relatedSegments: ["Molecular Biology & PCR", "Assays & Detection", "Buffers, Chemicals & Reagents"],
    ctaCopy: "Explore PCR workflow"
  },
  {
    id: "protein-immunology",
    slug: "protein-immunology",
    title: "Protein & Immunology",
    description: "ELISA kits, multiplex assays, antibodies, recombinant proteins, and flow cytometry reagents.",
    typicalProducts: ["ELISA kits", "antibody pairs", "multiplex panels", "cytokine panels", "recombinant proteins", "flow reagents"],
    commonQuestions: ["Which detection method fits the sample type?", "What species reactivity is needed?", "Should equivalent reagents be sampled first?"],
    relatedSegments: ["Assays & Detection", "Proteins, Antibodies & Immunology"],
    ctaCopy: "Explore protein & immunology workflow"
  },
  {
    id: "sample-prep-filtration",
    slug: "sample-prep-filtration",
    title: "Sample Prep & Filtration",
    description: "Syringe filters, centrifugal filters, membranes, desalting columns, and homogenization products.",
    typicalProducts: ["syringe filters", "bottle-top filters", "vacuum filtration units", "centrifugal filters", "ultrafiltration devices"],
    commonQuestions: ["Which membrane material fits the sample?", "What pore size is required?", "Is sterile or analytical sample prep the priority?"],
    relatedSegments: ["Sample Prep & Filtration", "Buffers, Chemicals & Reagents"],
    ctaCopy: "Explore sample prep workflow"
  },
  {
    id: "automation-hts",
    slug: "automation-hts",
    title: "Automation & HTS",
    description: "Robot-compatible tips, reservoirs, plates, seals, and barcoded formats for automated workflows.",
    typicalProducts: ["robotic tips", "conductive tips", "automation reservoirs", "automation plates", "seals", "cap mats"],
    commonQuestions: ["Which robot platform must be supported?", "Is conductive or filtered format required?", "Should samples be tested before switching?"],
    relatedSegments: ["Automation Consumables", "Liquid Handling", "Lab Plasticware"],
    ctaCopy: "Explore automation workflow"
  },
  {
    id: "storage-cryopreservation",
    slug: "storage-cryopreservation",
    title: "Storage & Cryopreservation",
    description: "Cryogenic tubes, barcoded storage formats, freezer boxes, sealing films, and cold-chain supplies.",
    typicalProducts: ["cryovials", "barcoded tubes", "freezer boxes", "storage plates", "cryopreservation media"],
    commonQuestions: ["Is barcode support required?", "Which thread type should I use?", "What storage format works with automation?"],
    relatedSegments: ["Storage & Cryopreservation", "Lab Plasticware", "Cell Culture"],
    ctaCopy: "Explore storage workflow"
  },
  {
    id: "early-bioprocess-single-use",
    slug: "early-bioprocess-single-use",
    title: "Early Bioprocess & Single-Use",
    description: "Single-use bags, tubing, connectors, sampling products, and QC consumables for early process development.",
    typicalProducts: ["media bags", "buffer bags", "sampling bags", "tubing sets", "sterile connectors", "filters"],
    commonQuestions: ["Which connector or tubing format is required?", "What material information should be reviewed?", "Can pilot quantities support evaluation?"],
    relatedSegments: ["Early Bioprocess & Single-Use", "Sample Prep & Filtration", "Cell Culture"],
    ctaCopy: "Explore bioprocess workflow"
  }
];

