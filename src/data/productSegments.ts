export type ProductSegment = {
  title: string;
  shortDescription: string;
  productFamilies: string[];
  applicationTags: string[];
  specificationTags: string[];
  representativeFormats: string[];
};

export const productSegments: ProductSegment[] = [
  {
    title: "Liquid Handling",
    shortDescription:
      "Pipette tips, pipettes, reservoirs, dispensers, and accessories for manual and automated liquid transfer.",
    productFamilies: [
      "pipette tips",
      "filter pipette tips",
      "low-retention tips",
      "robotic pipette tips",
      "serological pipettes",
      "transfer pipettes",
      "pipettes",
      "pipette controllers",
      "reagent reservoirs",
      "bottle-top dispensers",
      "repeating dispensers",
      "accessories"
    ],
    applicationTags: [
      "routine liquid transfer",
      "PCR/qPCR setup",
      "cell culture handling",
      "automation & HTS",
      "contamination-sensitive workflows"
    ],
    specificationTags: [
      "sterility",
      "filter barrier",
      "low-retention surface",
      "robotic compatibility",
      "racked or bulk supply"
    ],
    representativeFormats: [
      "sterile",
      "non-sterile",
      "filtered",
      "low-retention",
      "robotic",
      "racked",
      "bulk",
      "individually wrapped"
    ]
  },
  {
    title: "Lab Plasticware",
    shortDescription:
      "Core tubes, plates, bottles, containers, racks, and sealing products for everyday lab workflows.",
    productFamilies: [
      "microcentrifuge tubes",
      "centrifuge tubes",
      "conical tubes",
      "screw-cap tubes",
      "low-bind tubes",
      "multiwell plates",
      "deep-well plates",
      "assay plates",
      "storage plates",
      "sealing films",
      "bottles",
      "containers",
      "tube racks",
      "general lab supplies"
    ],
    applicationTags: [
      "sample handling",
      "aliquoting",
      "centrifugation",
      "assay setup",
      "storage",
      "general lab use"
    ],
    specificationTags: [
      "material",
      "volume range",
      "binding profile",
      "barcode support",
      "sample visibility"
    ],
    representativeFormats: [
      "sterile",
      "non-sterile",
      "DNase/RNase-free",
      "low-bind",
      "barcoded",
      "clear",
      "amber"
    ]
  },
  {
    title: "Cell Culture",
    shortDescription:
      "Media, supplements, cultureware, dissociation reagents, freezing reagents, coatings, and cell analysis supplies.",
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
      "ECM & coatings",
      "hydrogels",
      "3D culture reagents",
      "counting supplies",
      "viability assays"
    ],
    applicationTags: [
      "mammalian cell culture",
      "primary cell culture",
      "stem cell culture",
      "immune cell culture",
      "organoid culture",
      "3D culture",
      "cell freezing and recovery"
    ],
    specificationTags: [
      "animal-origin profile",
      "serum status",
      "culture treatment",
      "attachment profile",
      "coating compatibility"
    ],
    representativeFormats: [
      "sterile",
      "animal-origin-free",
      "serum-free",
      "xeno-free",
      "tissue-culture-treated",
      "low-attachment",
      "coated"
    ]
  },
  {
    title: "Molecular Biology & PCR",
    shortDescription:
      "PCR plastics, qPCR formats, extraction and cleanup kits, electrophoresis products, cloning tools, and oligos.",
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
      "primers",
      "probes",
      "oligos",
      "gene editing reagents"
    ],
    applicationTags: [
      "PCR",
      "qPCR",
      "RT-qPCR",
      "DNA/RNA extraction",
      "cloning",
      "electrophoresis",
      "genotyping",
      "functional genomics"
    ],
    specificationTags: [
      "well count",
      "optical clarity",
      "plate skirt",
      "nuclease control",
      "instrument fit"
    ],
    representativeFormats: [
      "96-well",
      "384-well",
      "optical",
      "skirted",
      "semi-skirted",
      "low-profile",
      "nuclease-free"
    ]
  },
  {
    title: "Sample Prep & Filtration",
    shortDescription:
      "Filtration, concentration, buffer exchange, desalting, and homogenization products for analytical and biological samples.",
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
      "homogenization tubes",
      "bead beating tubes"
    ],
    applicationTags: [
      "HPLC sample preparation",
      "LC-MS sample preparation",
      "sterile filtration",
      "protein concentration",
      "buffer exchange",
      "solvent filtration",
      "particulate removal"
    ],
    specificationTags: [
      "membrane material",
      "pore size",
      "sterility",
      "sample compatibility",
      "centrifugal format"
    ],
    representativeFormats: [
      "PES",
      "PVDF",
      "PTFE",
      "nylon",
      "cellulose acetate",
      "0.22 µm",
      "0.45 µm",
      "centrifugal",
      "sterile"
    ]
  },
  {
    title: "Storage & Cryopreservation",
    shortDescription:
      "Cryogenic tubes, freezer systems, barcoded storage formats, plate sealing, freezing media, labels, and cold handling supplies.",
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
      "cold blocks",
      "cryogenic labels"
    ],
    applicationTags: [
      "cell banking",
      "sample archiving",
      "biobank storage",
      "compound storage",
      "cold-chain handling",
      "plate-based sample management"
    ],
    specificationTags: [
      "thread type",
      "barcode type",
      "temperature range",
      "SBS compatibility",
      "automation fit"
    ],
    representativeFormats: [
      "internal thread",
      "external thread",
      "2D barcoded",
      "SBS-format",
      "cryogenic",
      "sterile",
      "low-temperature",
      "automation-compatible"
    ]
  },
  {
    title: "Automation Consumables",
    shortDescription:
      "Robotic tips, reservoirs, automation plates, barcoded formats, seals, cap mats, racks, waste accessories, and magnetic stands.",
    productFamilies: [
      "robotic pipette tips",
      "conductive tips",
      "filter robotic tips",
      "automation reservoirs",
      "automation plates",
      "deep-well plates",
      "assay plates",
      "source plates",
      "destination plates",
      "compound storage plates",
      "PCR automation plates",
      "plate seals",
      "silicone cap mats",
      "barcoded plates",
      "tube racks",
      "tip waste accessories",
      "magnetic stands"
    ],
    applicationTags: [
      "liquid handling automation",
      "HTS",
      "genomics automation",
      "PCR/qPCR setup",
      "ELISA automation",
      "sample aliquoting",
      "plate sealing"
    ],
    specificationTags: [
      "robotic platform fit",
      "conductivity",
      "barcode support",
      "dead volume",
      "plate standard"
    ],
    representativeFormats: [
      "SBS-format",
      "robotic-compatible",
      "conductive",
      "filtered",
      "barcoded",
      "sterile",
      "low-dead-volume",
      "automation-ready"
    ]
  },
  {
    title: "Assays & Detection",
    shortDescription:
      "ELISA, multiplex, antibody arrays, protein arrays, cell assays, western blot reagents, flow reagents, dyes, imaging, and IHC/IF products.",
    productFamilies: [
      "ELISA kits",
      "ELISA antibody pairs",
      "multiplex assays",
      "cytokine panels",
      "antibody arrays",
      "protein arrays",
      "cell viability assays",
      "apoptosis assays",
      "cytotoxicity assays",
      "metabolism assays",
      "western blot reagents",
      "ECL substrates",
      "flow cytometry reagents",
      "fluorescent dyes",
      "imaging reagents",
      "IHC/IF reagents"
    ],
    applicationTags: [
      "ELISA",
      "multiplex cytokine profiling",
      "cell viability",
      "apoptosis detection",
      "western blot",
      "flow cytometry",
      "imaging",
      "HTS"
    ],
    specificationTags: [
      "detection chemistry",
      "assay format",
      "multiplex capacity",
      "readout type",
      "kit configuration"
    ],
    representativeFormats: [
      "colorimetric",
      "chemiluminescent",
      "fluorescent",
      "plate-based",
      "multiplex",
      "kit",
      "antibody pair",
      "ready-to-use"
    ]
  },
  {
    title: "Proteins, Antibodies & Immunology",
    shortDescription:
      "Recombinant proteins, cytokines, enzymes, immune proteins, antibodies, controls, peptides, small molecules, lysates, and cell lines.",
    productFamilies: [
      "recombinant proteins",
      "cytokines",
      "growth factors",
      "chemokines",
      "enzymes",
      "receptors",
      "ligands",
      "immune checkpoint proteins",
      "viral proteins",
      "Fc fusion proteins",
      "primary antibodies",
      "secondary antibodies",
      "monoclonal antibodies",
      "polyclonal antibodies",
      "conjugated antibodies",
      "flow antibodies",
      "IHC antibodies",
      "IF antibodies",
      "WB antibodies",
      "controls",
      "antibody pairs",
      "peptides",
      "small molecules",
      "lysates",
      "cell lines"
    ],
    applicationTags: [
      "immunology research",
      "cytokine biology",
      "ELISA development",
      "western blot",
      "flow cytometry",
      "IHC/IF",
      "pathway studies"
    ],
    specificationTags: [
      "expression system",
      "tag format",
      "conjugation",
      "clone type",
      "application validation"
    ],
    representativeFormats: [
      "recombinant",
      "carrier-free",
      "tag-free",
      "His-tagged",
      "Fc-tagged",
      "unconjugated",
      "conjugated",
      "monoclonal",
      "polyclonal"
    ]
  },
  {
    title: "Buffers, Chemicals & Reagents",
    shortDescription:
      "Buffers, salts, detergents, reducing agents, antibiotics, stains, dyes, water, solvents, and cleaning reagents for lab workflows.",
    productFamilies: [
      "PBS",
      "DPBS",
      "TBS",
      "TBST",
      "Tris",
      "HEPES",
      "molecular biology buffers",
      "lysis buffers",
      "wash buffers",
      "elution buffers",
      "blocking buffers",
      "transfer buffers",
      "salts",
      "detergents",
      "reducing agents",
      "chelators",
      "antibiotics",
      "amino acids",
      "vitamins",
      "metabolites",
      "agarose",
      "stains",
      "dyes",
      "water",
      "solvents",
      "cleaning reagents"
    ],
    applicationTags: [
      "cell culture",
      "molecular biology",
      "protein biology",
      "western blot",
      "ELISA",
      "electrophoresis",
      "buffer preparation",
      "general lab use"
    ],
    specificationTags: [
      "grade",
      "concentration",
      "sterility",
      "format",
      "workflow compatibility"
    ],
    representativeFormats: [
      "ready-to-use",
      "concentrate",
      "powder",
      "sterile",
      "molecular biology grade",
      "cell culture grade",
      "analytical grade"
    ]
  },
  {
    title: "Small Lab Equipment",
    shortDescription:
      "Benchtop equipment and accessories for centrifugation, mixing, temperature control, electrophoresis, measurement, and general lab operations.",
    productFamilies: [
      "mini centrifuges",
      "microcentrifuges",
      "plate centrifuges",
      "vortex mixers",
      "tube rotators",
      "rockers",
      "orbital shakers",
      "plate shakers",
      "magnetic stirrers",
      "dry baths",
      "heat blocks",
      "water baths",
      "mini incubators",
      "cell counters",
      "pipette controllers",
      "vacuum pumps",
      "gel tanks",
      "power supplies",
      "blue light transilluminators",
      "pH meters",
      "balances",
      "thermometers",
      "equipment accessories"
    ],
    applicationTags: [
      "centrifugation",
      "sample mixing",
      "PCR setup",
      "electrophoresis",
      "cell culture handling",
      "temperature control",
      "general lab operations"
    ],
    specificationTags: [
      "footprint",
      "control type",
      "speed range",
      "temperature range",
      "accessory support"
    ],
    representativeFormats: [
      "benchtop",
      "compact",
      "digital",
      "analog",
      "multi-speed",
      "temperature-controlled",
      "accessory-compatible"
    ]
  },
  {
    title: "Early Bioprocess & Single-Use",
    shortDescription:
      "Single-use bags, tubing, connectors, containers, filters, flasks, sampling products, and QC consumables for early process development.",
    productFamilies: [
      "single-use bags",
      "media bags",
      "buffer bags",
      "storage bags",
      "sampling bags",
      "transfer bags",
      "tubing assemblies",
      "silicone tubing",
      "TPE tubing",
      "sterile connectors",
      "aseptic connectors",
      "clamps",
      "carboys",
      "PETG bottles",
      "HDPE containers",
      "capsule filters",
      "sterile filtration units",
      "vent filters",
      "depth filters",
      "shake flasks",
      "spinner flasks",
      "sampling containers",
      "QC consumables"
    ],
    applicationTags: [
      "media preparation",
      "buffer preparation",
      "seed train",
      "scale-up culture",
      "sterile transfer",
      "sampling",
      "clarification",
      "sterile filtration",
      "early process development"
    ],
    specificationTags: [
      "sterility assurance",
      "irradiation status",
      "closed-system fit",
      "assembly type",
      "process scale"
    ],
    representativeFormats: [
      "single-use",
      "sterile",
      "gamma-irradiated",
      "closed-system",
      "aseptic",
      "tubing assembly",
      "process-development scale"
    ]
  }
];

