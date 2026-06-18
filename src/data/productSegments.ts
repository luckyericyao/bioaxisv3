export type ProductSegment = {
  id: string;
  slug: string;
  title: string;
  index: number;
  description: string;
  hero: string;
  productFamilies: string[];
  applications: string[];
  specifications: string[];
  formats: string[];
  relatedWorkflows: string[];
  sourcingQuestions: string[];
  documentationNeeds: string[];
  ctaCopy: string;
};

export const productSegments: ProductSegment[] = [
  {
    id: "liquid-handling",
    slug: "liquid-handling",
    title: "Liquid Handling",
    index: 1,
    description:
      "Pipette tips, pipettes, reservoirs, dispensers, and accessories for manual and automated liquid transfer.",
    hero:
      "BioAxis helps labs organize liquid handling consumables by format, sterility, volume range, packaging, and automation compatibility.",
    productFamilies: [
      "pipette tips",
      "filter pipette tips",
      "low-retention tips",
      "robotic pipette tips",
      "conductive tips",
      "serological pipettes",
      "transfer pipettes",
      "pipettes",
      "pipette controllers",
      "reagent reservoirs",
      "bottle-top dispensers",
      "repeating dispensers",
      "accessories"
    ],
    applications: [
      "routine liquid transfer",
      "PCR/qPCR setup",
      "cell culture handling",
      "serial dilutions",
      "contamination-sensitive workflows",
      "automation and high-throughput screening"
    ],
    specifications: [
      "sterility",
      "filter barrier",
      "low-retention surface",
      "conductive vs non-conductive",
      "volume range",
      "racked vs bulk packaging",
      "robot compatibility"
    ],
    formats: [
      "sterile",
      "non-sterile",
      "filtered",
      "non-filtered",
      "low-retention",
      "conductive",
      "robotic",
      "racked",
      "bulk",
      "individually wrapped"
    ],
    relatedWorkflows: ["Cell Culture", "Molecular Biology & PCR", "Automation & HTS"],
    sourcingQuestions: [
      "Which tip format matches the pipette or robotic platform?",
      "Is filtered or low-retention performance required for this workflow?",
      "Can an equivalent tip be evaluated before recurring supply?"
    ],
    documentationNeeds: ["sterility information", "DNase/RNase-free information", "material information"],
    ctaCopy: "Request quote, equivalent, or sample support for liquid handling consumables."
  },
  {
    id: "lab-plasticware",
    slug: "lab-plasticware",
    title: "Lab Plasticware",
    index: 2,
    description:
      "Core tubes, plates, bottles, containers, racks, and sealing products for everyday lab workflows.",
    hero:
      "BioAxis helps organize tubes, plates, storage formats, sealing products, and general labware by material, volume, sterility, and workflow fit.",
    productFamilies: [
      "microcentrifuge tubes",
      "centrifuge tubes",
      "conical tubes",
      "screw-cap tubes",
      "low-bind tubes",
      "microplates",
      "deep-well plates",
      "assay plates",
      "storage plates",
      "sealing films",
      "bottles",
      "containers",
      "tube racks",
      "general lab supplies"
    ],
    applications: ["sample handling", "aliquoting", "centrifugation", "assay setup", "storage", "general lab use"],
    specifications: [
      "material",
      "volume range",
      "binding profile",
      "sterility",
      "DNase/RNase-free status",
      "barcode support",
      "optical clarity"
    ],
    formats: ["sterile", "non-sterile", "DNase/RNase-free", "low-bind", "barcoded", "clear", "amber"],
    relatedWorkflows: ["Cell Culture", "Automation & HTS", "Storage & Cryopreservation"],
    sourcingQuestions: [
      "What material and volume range are required?",
      "Is a low-bind, barcoded, or optical format needed?",
      "Should equivalent formats be compared before purchasing?"
    ],
    documentationNeeds: ["material information", "sterility information", "DNase/RNase-free information"],
    ctaCopy: "Compare lab plasticware options by format, material, and use case."
  },
  {
    id: "cell-culture",
    slug: "cell-culture",
    title: "Cell Culture",
    index: 3,
    description:
      "Media, supplements, cultureware, dissociation reagents, freezing reagents, coatings, and cell analysis supplies.",
    hero:
      "BioAxis supports cell culture sourcing decisions across media, cultureware, surface treatments, supplements, freezing formats, and supplier documentation where available.",
    productFamilies: [
      "cell culture media",
      "sera",
      "supplements",
      "growth factors",
      "antibiotics",
      "flasks",
      "plates",
      "dishes",
      "dissociation reagents",
      "freezing reagents",
      "cryopreservation media",
      "strainers",
      "scrapers",
      "ECM and coatings"
    ],
    applications: [
      "mammalian cell culture",
      "primary cell culture",
      "stem cell culture",
      "immune cell culture",
      "organoid culture",
      "3D culture",
      "cell freezing and recovery"
    ],
    specifications: [
      "animal-origin profile",
      "serum status",
      "culture treatment",
      "attachment profile",
      "coating compatibility",
      "sterility"
    ],
    formats: [
      "sterile",
      "animal-origin-free",
      "serum-free",
      "xeno-free",
      "tissue-culture-treated",
      "low-attachment",
      "coated"
    ],
    relatedWorkflows: ["Cell Culture", "Storage & Cryopreservation", "Early Bioprocess & Single-Use"],
    sourcingQuestions: [
      "Which formulation or surface treatment fits the cell type?",
      "Is a sample-first evaluation needed before switching supplier?",
      "What documentation should be requested before purchase?"
    ],
    documentationNeeds: ["COA", "SDS", "sterility information", "material information"],
    ctaCopy: "Review cell culture consumables, equivalents, samples, and documentation support."
  },
  {
    id: "molecular-biology-pcr",
    slug: "molecular-biology-pcr",
    title: "Molecular Biology & PCR",
    index: 4,
    description:
      "PCR plastics, qPCR formats, extraction and cleanup kits, electrophoresis products, cloning tools, and primers.",
    hero:
      "BioAxis helps organize molecular biology and PCR consumables by instrument fit, optical format, nuclease control, and workflow requirements.",
    productFamilies: [
      "PCR tubes",
      "PCR plates",
      "qPCR plates",
      "optical seals",
      "PCR master mixes",
      "qPCR master mixes",
      "RT-qPCR reagents",
      "DNA/RNA extraction kits",
      "plasmid prep kits",
      "cleanup kits",
      "agarose",
      "ladders",
      "cloning reagents",
      "primers"
    ],
    applications: [
      "PCR",
      "qPCR",
      "RT-qPCR",
      "DNA/RNA extraction",
      "cloning",
      "electrophoresis",
      "genotyping",
      "functional genomics"
    ],
    specifications: ["well count", "optical clarity", "plate skirt", "nuclease control", "instrument fit"],
    formats: ["96-well", "384-well", "optical", "skirted", "semi-skirted", "low-profile", "nuclease-free"],
    relatedWorkflows: ["Molecular Biology & PCR", "Automation & HTS", "Protein & Immunology"],
    sourcingQuestions: [
      "Does the plate or tube format match the instrument?",
      "Are optical seals or nuclease-free formats required?",
      "Can equivalent plastics or reagents support the same workflow?"
    ],
    documentationNeeds: ["DNase/RNase-free information", "COA", "lot-level documentation where available"],
    ctaCopy: "Find PCR and molecular biology consumables by format, instrument, and specification."
  },
  {
    id: "sample-prep-filtration",
    slug: "sample-prep-filtration",
    title: "Sample Prep & Filtration",
    index: 5,
    description:
      "Filtration, concentration, buffer exchange, desalting, and homogenization products for analytical and biological samples.",
    hero:
      "BioAxis supports sample preparation sourcing by helping compare membrane material, pore size, sample compatibility, and filtration format.",
    productFamilies: [
      "syringe filters",
      "bottle-top filters",
      "vacuum filtration units",
      "sterile filtration devices",
      "filter membranes",
      "centrifugal filters",
      "protein concentrators",
      "ultrafiltration devices",
      "dialysis products",
      "buffer exchange devices",
      "desalting columns",
      "filter holders",
      "filtration accessories",
      "homogenization tubes"
    ],
    applications: [
      "HPLC sample preparation",
      "LC-MS sample preparation",
      "sterile filtration",
      "protein concentration",
      "buffer exchange",
      "solvent filtration",
      "particulate removal"
    ],
    specifications: ["membrane material", "pore size", "sterility", "sample compatibility", "centrifugal format"],
    formats: ["PES", "PVDF", "PTFE", "nylon", "cellulose acetate", "0.22 µm", "0.45 µm", "centrifugal", "sterile"],
    relatedWorkflows: ["Sample Prep & Filtration", "Protein & Immunology", "Early Bioprocess & Single-Use"],
    sourcingQuestions: [
      "Which membrane material fits the sample and solvent?",
      "Is sterile filtration or protein recovery the priority?",
      "Should alternate membranes be sampled before switching?"
    ],
    documentationNeeds: ["material information", "sterility information", "compatibility notes where available"],
    ctaCopy: "Compare filtration and sample prep options by pore size, membrane, and workflow."
  },
  {
    id: "storage-cryopreservation",
    slug: "storage-cryopreservation",
    title: "Storage & Cryopreservation",
    index: 6,
    description:
      "Cryogenic tubes, freezer systems, barcoded storage formats, plate sealing, freezing media, labels, and cold handling supplies.",
    hero:
      "BioAxis helps organize storage and cryopreservation consumables by thread type, barcode support, SBS compatibility, cold-chain use, and sample management workflow.",
    productFamilies: [
      "cryovials",
      "cryogenic tubes",
      "freezer boxes",
      "freezer racks",
      "sample storage tubes",
      "2D barcoded tubes",
      "storage plates",
      "deep-well plates",
      "plate seals",
      "cap mats",
      "cryopreservation media",
      "DMSO",
      "controlled-rate freezing containers",
      "cold blocks"
    ],
    applications: [
      "cell banking",
      "sample archiving",
      "biobank storage",
      "compound storage",
      "cold-chain handling",
      "plate-based sample management"
    ],
    specifications: ["thread type", "barcode type", "temperature range", "SBS compatibility", "automation fit"],
    formats: [
      "internal thread",
      "external thread",
      "2D barcoded",
      "SBS-format",
      "cryogenic",
      "sterile",
      "low-temperature",
      "automation-compatible"
    ],
    relatedWorkflows: ["Storage & Cryopreservation", "Cell Culture", "Automation & HTS"],
    sourcingQuestions: [
      "Is internal or external thread required?",
      "Does the format need barcode or automation compatibility?",
      "Which storage equivalent can be evaluated without disrupting sample handling?"
    ],
    documentationNeeds: ["sterility information", "material information", "lot-level documentation where available"],
    ctaCopy: "Plan storage, cryogenic, and barcoded sample management sourcing."
  },
  {
    id: "automation-consumables",
    slug: "automation-consumables",
    title: "Automation Consumables",
    index: 7,
    description:
      "Robotic tips, reservoirs, automation plates, barcoded formats, seals, cap mats, racks, waste accessories, and magnetic stands.",
    hero:
      "BioAxis supports automation consumables review across robot compatibility, SBS format, conductivity, sterility, barcoding, and packaging.",
    productFamilies: [
      "robotic pipette tips",
      "conductive tips",
      "filter robotic tips",
      "automation reservoirs",
      "automation plates",
      "deep-well plates",
      "SBS-format plates",
      "seals",
      "cap mats",
      "racks",
      "waste accessories",
      "magnetic stands"
    ],
    applications: [
      "liquid handling automation",
      "HTS",
      "genomics automation",
      "PCR/qPCR setup",
      "cell culture automation",
      "compound handling"
    ],
    specifications: ["robot compatibility", "conductivity", "filter type", "sterility", "SBS compliance", "barcoding"],
    formats: ["SBS-format", "robotic-compatible", "conductive", "filtered", "sterile", "barcoded"],
    relatedWorkflows: ["Automation & HTS", "Molecular Biology & PCR", "Sample Prep & Filtration"],
    sourcingQuestions: [
      "Which robotic platform and deck workflow must be supported?",
      "Is conductive, filtered, sterile, or barcoded format required?",
      "Can samples be tested before switching an automated workflow?"
    ],
    documentationNeeds: ["compatibility notes where available", "sterility information", "material information"],
    ctaCopy: "Review automation-compatible consumables for platform and workflow fit."
  },
  {
    id: "assays-detection",
    slug: "assays-detection",
    title: "Assays & Detection",
    index: 8,
    description:
      "ELISA, multiplex, antibody arrays, cell assays, western blot reagents, flow cytometry reagents, dyes, stains, imaging, and IHC/IF products.",
    hero:
      "BioAxis helps organize assay and detection products by method, sample type, species reactivity, readout, and documentation needs.",
    productFamilies: [
      "ELISA kits",
      "ELISA antibody pairs",
      "multiplex assays",
      "cytokine panels",
      "antibody arrays",
      "protein arrays",
      "cell viability kits",
      "apoptosis kits",
      "proliferation assays",
      "western blot reagents",
      "flow cytometry reagents",
      "dyes",
      "stains",
      "imaging reagents",
      "IHC/IF products"
    ],
    applications: [
      "ELISA",
      "multiplex cytokine profiling",
      "cell viability",
      "apoptosis detection",
      "proliferation assays",
      "western blotting",
      "flow cytometry",
      "imaging"
    ],
    specifications: ["detection method", "assay format", "species reactivity", "sample type", "sensitivity", "dynamic range"],
    formats: ["colorimetric", "chemiluminescent", "fluorescent", "plate-based", "bead-based", "strip-well"],
    relatedWorkflows: ["Protein & Immunology", "Cell Culture", "Automation & HTS"],
    sourcingQuestions: [
      "Which assay method and readout fit the sample type?",
      "Are species reactivity or sensitivity constraints critical?",
      "What documentation should be reviewed before selection?"
    ],
    documentationNeeds: ["COA", "SDS", "lot-level documentation where available", "compatibility notes where available"],
    ctaCopy: "Organize assay and detection sourcing by method, format, and workflow."
  },
  {
    id: "proteins-antibodies-immunology",
    slug: "proteins-antibodies-immunology",
    title: "Proteins, Antibodies & Immunology",
    index: 9,
    description:
      "Recombinant proteins, cytokines, enzymes, antibodies, controls, peptides, small molecules, lysates, and cell lines.",
    hero:
      "BioAxis helps organize protein, antibody, and immunology sourcing by purity, activity, species reactivity, tag, carrier status, and documentation needs.",
    productFamilies: [
      "recombinant proteins",
      "cytokines",
      "growth factors",
      "chemokines",
      "enzymes",
      "receptors",
      "antibodies",
      "isotype controls",
      "peptides",
      "small molecules",
      "lysates",
      "cell lines"
    ],
    applications: [
      "immunology research",
      "cytokine biology",
      "ELISA development",
      "western blotting",
      "flow cytometry",
      "cell signaling studies"
    ],
    specifications: [
      "purity",
      "endotoxin level",
      "tag",
      "carrier status",
      "activity",
      "species reactivity",
      "buffer formulation"
    ],
    formats: ["recombinant", "carrier-free", "tag-free", "His-tagged", "Fc-tagged", "lyophilized", "liquid"],
    relatedWorkflows: ["Protein & Immunology", "Cell Culture", "Molecular Biology & PCR"],
    sourcingQuestions: [
      "Which species reactivity, tag, or carrier status is required?",
      "Is activity or endotoxin level a key specification?",
      "Can equivalent proteins or antibodies be reviewed before switching?"
    ],
    documentationNeeds: ["COA", "SDS", "lot-level documentation where available", "compatibility notes where available"],
    ctaCopy: "Review proteins, antibodies, and immunology reagents by specification and application."
  },
  {
    id: "buffers-chemicals-reagents",
    slug: "buffers-chemicals-reagents",
    title: "Buffers, Chemicals & Reagents",
    index: 10,
    description:
      "Buffers, salts, detergents, reducing agents, antibiotics, stains, dyes, water, solvents, and cleaning reagents for lab workflows.",
    hero:
      "BioAxis helps organize buffers, chemicals, and reagents by formulation, concentration, grade, sterility, package size, and workflow fit.",
    productFamilies: [
      "PBS",
      "DPBS",
      "TBS",
      "TBST",
      "Tris",
      "HEPES",
      "MOPS",
      "detergents",
      "reducing agents",
      "antibiotics",
      "stains",
      "dyes",
      "water",
      "solvents",
      "cleaning reagents"
    ],
    applications: [
      "cell culture",
      "molecular biology",
      "protein biology",
      "western blotting",
      "microscopy",
      "buffer preparation",
      "cleaning"
    ],
    specifications: ["formulation", "concentration", "pH", "sterility", "grade", "package size", "purity"],
    formats: ["ready-to-use", "concentrate", "powder", "sterile", "non-sterile", "multiple pH levels and volumes"],
    relatedWorkflows: ["Molecular Biology & PCR", "Protein & Immunology", "Sample Prep & Filtration"],
    sourcingQuestions: [
      "Which grade, concentration, or package size is required?",
      "Does the workflow require sterile or ready-to-use format?",
      "What documentation should be requested before ordering?"
    ],
    documentationNeeds: ["COA", "SDS", "material information", "lot-level documentation where available"],
    ctaCopy: "Organize buffer, chemical, and reagent sourcing by grade, package, and workflow."
  },
  {
    id: "small-lab-equipment",
    slug: "small-lab-equipment",
    title: "Small Lab Equipment",
    index: 11,
    description:
      "Benchtop equipment and accessories for centrifugation, mixing, temperature control, electrophoresis, measurement, and general lab operations.",
    hero:
      "BioAxis helps labs organize small equipment sourcing questions around capacity, footprint, control type, speed range, temperature range, and accessory fit.",
    productFamilies: [
      "mini centrifuges",
      "microcentrifuges",
      "plate centrifuges",
      "vortex mixers",
      "tube rotators",
      "rockers",
      "shakers",
      "heat blocks",
      "thermal mixers",
      "magnetic stirrers",
      "hot plates",
      "electrophoresis units",
      "spectrophotometers"
    ],
    applications: [
      "centrifugation",
      "sample mixing",
      "PCR setup",
      "electrophoresis",
      "measurement",
      "temperature control",
      "general lab operations"
    ],
    specifications: [
      "capacity",
      "speed range",
      "temperature range",
      "footprint",
      "digital vs analog control",
      "power requirements"
    ],
    formats: ["benchtop", "compact", "digital", "analog", "variable speed", "programmable"],
    relatedWorkflows: ["Molecular Biology & PCR", "Cell Culture", "Sample Prep & Filtration"],
    sourcingQuestions: [
      "Which capacity, speed, or temperature range is needed?",
      "Does the equipment need a compact footprint or specific accessory support?",
      "Should comparable options be reviewed before purchase?"
    ],
    documentationNeeds: ["specification sheet", "compatibility notes where available", "material information"],
    ctaCopy: "Prepare small lab equipment sourcing needs by specification and workflow."
  },
  {
    id: "early-bioprocess-single-use",
    slug: "early-bioprocess-single-use",
    title: "Early Bioprocess & Single-Use",
    index: 12,
    description:
      "Single-use bags, tubing, connectors, sampling products, filters, bottles, flasks, sensors, and QC consumables for early process development.",
    hero:
      "BioAxis supports early bioprocess and single-use sourcing review by format, sterility, material, bag volume, tubing, connector type, and process-development workflow.",
    productFamilies: [
      "single-use bags",
      "media bags",
      "buffer bags",
      "storage bags",
      "sampling bags",
      "transfer bags",
      "tubing sets",
      "aseptic connectors",
      "filters",
      "bottles",
      "sampling kits",
      "flasks",
      "caps",
      "sensors",
      "QC consumables"
    ],
    applications: [
      "media preparation",
      "buffer preparation",
      "seed train scale-up",
      "cell culture scale-up",
      "closed-system processing",
      "sterile transfer",
      "sampling and QC"
    ],
    specifications: [
      "sterilization method",
      "material",
      "bag volume",
      "tubing diameter",
      "connector type",
      "filter porosity",
      "closure type"
    ],
    formats: [
      "single-use",
      "sterile",
      "gamma-irradiated",
      "closed-system",
      "2D and 3D bags",
      "quick-connect fittings"
    ],
    relatedWorkflows: ["Early Bioprocess & Single-Use", "Cell Culture", "Sample Prep & Filtration"],
    sourcingQuestions: [
      "Which bag, tubing, connector, or filter format is required?",
      "What sterility or material information should be requested?",
      "Can a sample or pilot quantity support early evaluation?"
    ],
    documentationNeeds: ["COA", "SDS", "sterility information", "material information", "lot-level documentation where available"],
    ctaCopy: "Plan early bioprocess and single-use sourcing support by format and workflow."
  }
];

export function getProductSegmentBySlug(slug: string) {
  return productSegments.find((segment) => segment.slug === slug);
}
