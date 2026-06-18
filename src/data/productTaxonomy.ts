export type ProductSpecification = string;
export type DocumentationRequirement = string;
export type ApplicationArea = string;

export type RelatedCategory = {
  label: string;
  href: string;
  segmentSlug: string;
  categorySlug: string;
};

export type ProductFamily = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  typicalProducts: string[];
  commonUseCases: string[];
  commonFormats: string[];
  selectionCriteria: string[];
  keySpecifications: ProductSpecification[];
  equivalentSwitchingConsiderations: string[];
  documentationChecklist: DocumentationRequirement[];
  recommendedRFQFields: string[];
  relatedFamilies: string[];
  applications: ApplicationArea[];
  representativeFormats: string[];
  documentationNeeds: DocumentationRequirement[];
  requestCta: string;
  seoTitle: string;
  metaDescription: string;
};

export type ProductCategory = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  productFamilies: ProductFamily[];
  featuredFamilies: ProductFamily[];
  typicalProducts: string[];
  selectionCriteria: string[];
  commonFormats: string[];
  formats: string[];
  commonApplications: ApplicationArea[];
  applications: ApplicationArea[];
  specifications: ProductSpecification[];
  documentation: DocumentationRequirement[];
  documentationNeeds: DocumentationRequirement[];
  relatedCategories: RelatedCategory[];
  relatedSubcategories: string[];
  relatedSegments: string[];
  requestTypes: string[];
  seoTitle: string;
  metaDescription: string;
};

export type ProductSegment = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  index: number;
  shortDescription: string;
  longDescription: string;
  heroStatement: string;
  description: string;
  heroDescription: string;
  primaryApplications: ApplicationArea[];
  buyerTypes: string[];
  categories: ProductCategory[];
  subcategories: ProductCategory[];
  featuredCategories: ProductCategory[];
  relatedSegments: string[];
  rfqPrompts: string[];
  equivalentPrompts: string[];
  samplePrompts: string[];
  productFamilies: string[];
  applications: ApplicationArea[];
  specifications: ProductSpecification[];
  formats: string[];
  imageKey: string;
  visualTheme: string;
  ctaCopy: string;
  seoTitle: string;
  metaDescription: string;
};

export type ProductTaxonomySegment = ProductSegment;
export type ProductSubcategory = ProductCategory;
export type FeaturedFamily = ProductFamily;

type CategoryInput = {
  title: string;
  families: string[];
  applications?: string[];
  formats?: string[];
  specifications?: string[];
  documentation?: string[];
};

type SegmentInput = {
  title: string;
  shortTitle?: string;
  slug?: string;
  shortDescription: string;
  longDescription: string;
  heroStatement: string;
  primaryApplications: string[];
  buyerTypes?: string[];
  relatedSegments: string[];
  categories: CategoryInput[];
  visualTheme?: string;
};

type SearchResultType = "segment" | "category" | "family";

export type ProductSearchResult = {
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  segmentTitle: string;
  categoryTitle?: string;
  familyTitle?: string;
};

const defaultBuyerTypes = [
  "biotech procurement",
  "pharma R&D",
  "academic labs",
  "core facilities",
  "quality and operations teams"
];

const defaultRequestTypes = ["quote", "equivalent", "sample", "documentation"];

const defaultSelectionCriteria = [
  "critical dimensions or format",
  "material and surface requirements",
  "sterile or non-sterile need",
  "workflow and instrument compatibility",
  "documentation requirements"
];

const defaultSpecifications = [
  "format",
  "material",
  "sterility where required",
  "workflow fit",
  "supplier documentation"
];

const defaultDocumentation = [
  "CoA where available",
  "SDS where applicable",
  "sterility information where applicable",
  "material or resin information",
  "lot traceability where available"
];

const defaultFormats = [
  "standard lab pack",
  "sterile where required",
  "non-sterile where applicable",
  "workflow-compatible format"
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildFamily(title: string, segment: SegmentInput, category: CategoryInput): ProductFamily {
  const slug = slugify(title);
  const applications = category.applications ?? segment.primaryApplications;
  const commonFormats = category.formats ?? defaultFormats;
  const keySpecifications = category.specifications ?? defaultSpecifications;
  const documentationChecklist = category.documentation ?? defaultDocumentation;

  return {
    id: slug,
    slug,
    title,
    shortDescription: `${title} for ${category.title.toLowerCase()} sourcing, equivalent review, sample coordination, and quote preparation.`,
    longDescription: `BioAxis organizes ${title.toLowerCase()} requests within ${segment.title.toLowerCase()} by application, format, specification, supplier equivalent, documentation need, quantity, and sample path. The page is a sourcing framework rather than a live inventory or pricing catalog.`,
    description: `${title} for ${category.title.toLowerCase()} sourcing, equivalent review, sample coordination, and quote preparation.`,
    typicalProducts: [title, category.title, segment.title],
    commonUseCases: applications.slice(0, 4),
    commonFormats,
    selectionCriteria: [
      ...defaultSelectionCriteria.slice(0, 3),
      `${category.title.toLowerCase()} workflow fit`,
      `${title.toLowerCase()} equivalent constraints`
    ],
    keySpecifications,
    equivalentSwitchingConsiderations: [
      "Confirm dimensions, chemistry, or format against the current product.",
      "Review sterility, packaging, and material requirements before switching.",
      "Request documentation early when quality or procurement review is required.",
      "Evaluate a sample when the product touches assays, cells, automation, or regulated workflows."
    ],
    documentationChecklist,
    recommendedRFQFields: [
      "product or equivalent product",
      "current brand / catalog number",
      "desired quantity",
      "sterile / non-sterile",
      "documentation required",
      "target delivery date",
      "institution / company",
      "email",
      "notes"
    ],
    relatedFamilies: [],
    applications,
    representativeFormats: commonFormats,
    documentationNeeds: documentationChecklist,
    requestCta: `Request sourcing support for ${title.toLowerCase()}`,
    seoTitle: `${title} | ${category.title} | BioAxis`,
    metaDescription: `Explore ${title.toLowerCase()} within ${category.title.toLowerCase()} for BioAxis quote, equivalent, sample, and documentation support.`,
  };
}

function buildCategory(segment: SegmentInput, category: CategoryInput): ProductCategory {
  const slug = slugify(category.title);
  const productFamilies = category.families.map((familyTitle) => buildFamily(familyTitle, segment, category));
  const familySlugs = productFamilies.map((family) => family.slug);
  const commonApplications = category.applications ?? segment.primaryApplications;
  const commonFormats = category.formats ?? defaultFormats;
  const specifications = category.specifications ?? defaultSpecifications;
  const documentation = category.documentation ?? defaultDocumentation;

  return {
    id: slug,
    slug,
    title: category.title,
    shortDescription: `${category.title} organized by family, format, specification, application, equivalent path, sample request, and documentation need.`,
    longDescription: `BioAxis supports ${category.title.toLowerCase()} sourcing inside ${segment.title.toLowerCase()} by mapping family names, common formats, buyer criteria, documentation needs, and equivalent-switching considerations. Submit a product, supplier, catalog number, or target specification to start a quote, sample, or equivalent review.`,
    description: `${category.title} organized by family, format, specification, application, equivalent path, sample request, and documentation need.`,
    productFamilies: productFamilies.map((family) => ({
      ...family,
      relatedFamilies: familySlugs.filter((relatedSlug) => relatedSlug !== family.slug).slice(0, 4)
    })),
    featuredFamilies: productFamilies.map((family) => ({
      ...family,
      relatedFamilies: familySlugs.filter((relatedSlug) => relatedSlug !== family.slug).slice(0, 4)
    })),
    typicalProducts: category.families,
    selectionCriteria: [
      ...defaultSelectionCriteria,
      `${category.title.toLowerCase()} application`,
      "current supplier or catalog number for equivalent matching"
    ],
    commonFormats,
    formats: commonFormats,
    commonApplications,
    applications: commonApplications,
    specifications,
    documentation,
    documentationNeeds: documentation,
    relatedCategories: [],
    relatedSubcategories: [],
    relatedSegments: segment.relatedSegments,
    requestTypes: defaultRequestTypes,
    seoTitle: `${category.title} | ${segment.title} | BioAxis`,
    metaDescription: `Browse ${category.title.toLowerCase()} under ${segment.title.toLowerCase()} for quote preparation, equivalents, samples, specifications, and documentation support.`
  };
}

function buildSegment(index: number, input: SegmentInput): ProductSegment {
  const slug = input.slug ?? slugify(input.title);
  const categories = input.categories.map((category) => buildCategory(input, category));
  const categoriesWithRelations = categories.map((category) => {
    const relatedCategories = categories
      .filter((item) => item.slug !== category.slug)
      .slice(0, 4)
      .map((item) => ({
        label: item.title,
        href: `/products/${slug}/${item.slug}`,
        segmentSlug: slug,
        categorySlug: item.slug
      }));

    return {
      ...category,
      relatedCategories,
      relatedSubcategories: relatedCategories.map((item) => item.categorySlug)
    };
  });

  const flattenedFamilies = categoriesWithRelations.flatMap((category) => category.productFamilies.map((family) => family.title));
  const applications = unique(categoriesWithRelations.flatMap((category) => category.commonApplications));
  const specifications = unique(categoriesWithRelations.flatMap((category) => category.specifications));
  const formats = unique(categoriesWithRelations.flatMap((category) => category.commonFormats));

  return {
    id: slug,
    slug,
    title: input.title,
    shortTitle: input.shortTitle ?? input.title,
    index,
    shortDescription: input.shortDescription,
    longDescription: input.longDescription,
    heroStatement: input.heroStatement,
    description: input.shortDescription,
    heroDescription: input.heroStatement,
    primaryApplications: input.primaryApplications,
    buyerTypes: input.buyerTypes ?? defaultBuyerTypes,
    categories: categoriesWithRelations,
    subcategories: categoriesWithRelations,
    featuredCategories: categoriesWithRelations.slice(0, 4),
    relatedSegments: input.relatedSegments,
    rfqPrompts: [
      `Quote ${input.shortTitle ?? input.title} by family, format, quantity, and documentation need.`,
      "Attach current supplier or catalog number when a direct equivalent is needed.",
      "Share target date and shipping region so sourcing support can be prioritized."
    ],
    equivalentPrompts: [
      "Current brand, catalog number, and critical specifications.",
      "Allowed substitutions, sterile status, packaging, and material constraints.",
      "Validation sensitivity and whether a sample is required before switching."
    ],
    samplePrompts: [
      "Family or category to evaluate.",
      "Format, sterility, and documentation requirements.",
      "Expected workflow, usage volume, and evaluation timeline."
    ],
    productFamilies: flattenedFamilies.slice(0, 12),
    applications,
    specifications,
    formats,
    imageKey: slug,
    visualTheme: input.visualTheme ?? input.shortTitle ?? input.title,
    ctaCopy: `BioAxis helps organize ${input.title.toLowerCase()} sourcing by product family, specification, equivalent path, sample request, and documentation support.`,
    seoTitle: `${input.title} | BioAxis Products`,
    metaDescription: input.shortDescription
  };
}

export const productTaxonomy: ProductSegment[] = [
  buildSegment(1, {
    title: "Labware & General Consumables",
    shortTitle: "Labware",
    shortDescription: "Plates, tubes, bottles, containers, glassware, seals, reservoirs, racks, and everyday lab essentials.",
    longDescription: "BioAxis organizes general labware and consumables for research, QC, and operations teams that need format clarity, supplier equivalents, sample paths, and documentation support without fake inventory or pricing claims.",
    heroStatement: "Source routine labware by format, material, sterility, workflow fit, packaging, and documentation need.",
    primaryApplications: ["sample handling", "assay setup", "routine lab operations", "storage", "general research workflows"],
    relatedSegments: ["liquid-handling", "storage-cryopreservation", "analytical-qc-consumables", "automation-consumables"],
    categories: [
      { title: "Plates", families: ["96-Well Plates", "384-Well Plates", "Deep-Well Plates", "Assay Plates"], formats: ["96-well", "384-well", "deep-well", "clear, white, or black plate"], specifications: ["well count", "well volume", "surface treatment", "SBS footprint", "reader compatibility"] },
      { title: "Tubes", families: ["Microcentrifuge Tubes", "Conical Centrifuge Tubes", "PCR Tubes", "Screw-Cap Tubes"], formats: ["microcentrifuge tube", "15 mL and 50 mL conical", "PCR tube", "screw-cap tube"], specifications: ["volume", "cap style", "centrifuge rating", "temperature range", "sterility"] },
      { title: "Bottles & Containers", families: ["Reagent Bottles", "Media Bottles", "Sample Bottles", "Storage Containers"], formats: ["PETG bottle", "HDPE bottle", "glass bottle", "container"], specifications: ["material", "volume", "closure type", "sterility", "chemical compatibility"] },
      { title: "Glassware", families: ["Beakers", "Flasks", "Cylinders", "Glass Bottles"], formats: ["beaker", "flask", "graduated cylinder", "glass bottle"], specifications: ["capacity", "glass type", "graduation", "closure", "temperature tolerance"] },
      { title: "Sealing Films, Foils & Mats", families: ["PCR Plate Seals", "Adhesive Films", "Aluminum Foils", "Silicone Sealing Mats"], formats: ["adhesive seal", "optical film", "foil", "silicone mat"], specifications: ["temperature range", "pierceability", "optical clarity", "seal strength", "plate compatibility"] },
      { title: "Reservoirs & Reagent Troughs", families: ["Single-Well Reservoirs", "Multi-Channel Reservoirs", "Sterile Reservoirs", "Automation Reservoirs"], formats: ["single-well reservoir", "multi-channel reservoir", "sterile trough", "automation-ready reservoir"], specifications: ["dead volume", "channel layout", "capacity", "sterility", "automation deck fit"] },
      { title: "Lab Essentials", families: ["Racks", "Scoops & Spatulas", "Weigh Boats", "Labels & Lab Markers"], formats: ["rack", "scoop", "weigh boat", "label"], specifications: ["material", "temperature range", "chemical compatibility", "format", "packaging"] }
    ]
  }),
  buildSegment(2, {
    title: "Liquid Handling",
    shortDescription: "Manual and automated liquid handling consumables for pipetting, transferring, dispensing, reservoirs, and calibration-adjacent workflows.",
    longDescription: "BioAxis structures liquid handling requests around tip fit, barrier need, retention profile, robotic compatibility, sterile packaging, and equivalent review.",
    heroStatement: "Match liquid handling products by volume range, tip geometry, filter barrier, low-retention surface, sterility, and platform compatibility.",
    primaryApplications: ["manual pipetting", "high-throughput dispensing", "automation deck setup", "sample transfer", "assay preparation"],
    relatedSegments: ["labware-general-consumables", "automation-consumables", "molecular-biology-pcr", "cell-culture-analysis"],
    categories: [
      { title: "Pipette Tips", families: ["Universal Pipette Tips", "Filter Pipette Tips", "Low-Retention Tips", "Extended-Length Tips"], formats: ["racked tips", "bulk tips", "filtered tips", "low-retention tips"], specifications: ["volume range", "tip fit", "filter barrier", "low-retention surface", "sterility"] },
      { title: "Robotic Pipette Tips", families: ["Conductive Robotic Tips", "Non-Conductive Robotic Tips", "Automation Filter Tips", "Platform-Compatible Tips"], formats: ["conductive tips", "non-conductive tips", "automation rack", "filtered robotic tip"], specifications: ["robot platform", "conductivity", "rack geometry", "filter barrier", "sterility"] },
      { title: "Serological Pipettes", families: ["1 mL Serological Pipettes", "5 mL Serological Pipettes", "10 mL Serological Pipettes", "25 / 50 mL Serological Pipettes"], formats: ["1 mL", "5 mL", "10 mL", "25 mL and 50 mL"], specifications: ["volume", "graduation", "packaging", "sterility", "material"] },
      { title: "Pasteur & Transfer Pipettes", families: ["Plastic Transfer Pipettes", "Glass Pasteur Pipettes", "Graduated Transfer Pipettes", "Sterile Transfer Pipettes"], formats: ["plastic transfer pipette", "glass Pasteur pipette", "graduated transfer pipette", "sterile transfer pipette"], specifications: ["material", "volume", "graduation", "sterility", "packaging"] },
      { title: "Dispensers & Repeating Pipette Consumables", families: ["Repeater Syringe Tips", "Bottle-Top Dispenser Accessories", "Combitip-Style Tips", "Bulk Dispensing Consumables"], formats: ["repeater tip", "bottle-top accessory", "syringe tip", "bulk dispensing format"], specifications: ["volume", "chemical compatibility", "instrument fit", "sterility", "packaging"] },
      { title: "Liquid Handling Accessories", families: ["Tip Racks", "Pipette Stands", "Reagent Reservoirs", "Calibration Consumables"], formats: ["tip rack", "pipette stand", "reservoir", "calibration consumable"], specifications: ["instrument fit", "capacity", "material", "sterility", "workflow compatibility"] }
    ]
  }),
  buildSegment(3, {
    title: "Cell Culture & Analysis",
    shortTitle: "Cell Culture",
    shortDescription: "Media, supplements, cultureware, 3D culture materials, cell analysis consumables, cryopreservation products, and sterile filtration.",
    longDescription: "BioAxis supports cell culture sourcing by organizing formulation, surface treatment, sterility, format, sample evaluation, and documentation needs across research and development workflows.",
    heroStatement: "Browse cell culture products by formulation, culture format, surface treatment, cell analysis need, sterile filtration route, and sample support.",
    primaryApplications: ["2D cell culture", "3D cell culture", "cell analysis", "media preparation", "cryopreservation"],
    relatedSegments: ["storage-cryopreservation", "sample-prep-filtration", "protein-biology-immunoassays", "bioprocessing-consumables"],
    categories: [
      { title: "Cell Culture Media & Buffers", families: ["Classical Media", "Serum-Free Media", "Specialty Media", "Balanced Salt Solutions"], formats: ["liquid media", "powder media", "serum-free media", "balanced salt solution"], specifications: ["formulation", "buffer system", "serum status", "sterility", "storage condition"] },
      { title: "Cell Culture Supplements & Reagents", families: ["FBS & Sera", "Growth Factors & Cytokines", "Antibiotics & Antimycotics", "Cell Dissociation Reagents"], formats: ["serum bottle", "lyophilized factor", "antibiotic solution", "dissociation reagent"], specifications: ["origin profile", "activity", "concentration", "sterility", "documentation"] },
      { title: "Cultureware", families: ["Cell Culture Plates", "Cell Culture Flasks", "Cell Culture Dishes", "Cell Culture Inserts"], formats: ["treated plate", "culture flask", "dish", "insert"], specifications: ["surface treatment", "growth area", "well count", "cap style", "sterility"] },
      { title: "3D Cell Culture", families: ["Spheroid Plates", "Organoid Cultureware", "Hydrogels & Matrices", "Scaffold Materials"], formats: ["spheroid plate", "organoid cultureware", "hydrogel", "matrix"], specifications: ["attachment profile", "matrix type", "culture format", "sterility", "cell type"] },
      { title: "Cell Analysis Consumables", families: ["Cell Viability Assay Consumables", "Cell Counting Slides", "Flow Cytometry Tubes", "Imaging Plates"], formats: ["assay consumable", "counting slide", "flow tube", "imaging plate"], specifications: ["readout method", "cell type", "plate color", "instrument compatibility", "sterility"] },
      { title: "Cryopreservation", families: ["Cryovials", "Freezing Media", "Cryoboxes", "Controlled-Rate Freezing Containers"], formats: ["cryovial", "freezing medium", "cryobox", "freezing container"], specifications: ["temperature range", "volume", "DMSO status", "sterility", "sample identification"] },
      { title: "Sterile Filtration for Cell Culture", families: ["Bottle-Top Filters", "Vacuum Filter Units", "Sterile Syringe Filters", "Media Filtration Devices"], formats: ["bottle-top filter", "vacuum unit", "sterile syringe filter", "media filtration device"], specifications: ["membrane", "pore size", "volume", "sterility", "media compatibility"] }
    ]
  }),
  buildSegment(4, {
    title: "Molecular Biology & PCR",
    shortTitle: "Molecular Biology",
    slug: "molecular-biology-pcr",
    shortDescription: "PCR and qPCR plastics, reagents, nucleic acid purification, electrophoresis, NGS consumables, cloning, and gene editing support.",
    longDescription: "BioAxis maps molecular biology and PCR products by instrument fit, nuclease control, optical performance, reaction chemistry, extraction workflow, and documentation requirements.",
    heroStatement: "Source molecular biology and PCR products by reaction format, nuclease-free requirement, optical seal need, cleanup chemistry, and instrument compatibility.",
    primaryApplications: ["PCR", "qPCR", "nucleic acid purification", "NGS library prep", "cloning and gene editing"],
    relatedSegments: ["liquid-handling", "buffers-reagents-biochemicals", "automation-consumables", "analytical-qc-consumables"],
    categories: [
      { title: "PCR Consumables", families: ["PCR Tubes", "PCR Strips", "PCR Plates", "Optical Sealing Films"], formats: ["PCR tube", "strip tube", "96-well PCR plate", "optical film"], specifications: ["tube profile", "plate skirt", "cap fit", "nuclease-free status", "thermal cycler fit"] },
      { title: "qPCR Consumables", families: ["qPCR Plates", "qPCR Tubes", "Optical Caps", "Optical Adhesive Films"], formats: ["white qPCR plate", "optical qPCR tube", "optical cap", "adhesive optical film"], specifications: ["optical clarity", "plate color", "well count", "instrument fit", "seal compatibility"] },
      { title: "PCR Reagents & Kits", families: ["PCR Master Mixes", "High-Fidelity Polymerases", "RT-PCR Reagents", "qPCR Master Mixes"], formats: ["master mix", "enzyme", "kit", "ready-to-use reagent"], specifications: ["polymerase type", "fidelity", "hot-start chemistry", "detection chemistry", "template type"] },
      { title: "Nucleic Acid Purification", families: ["Plasmid DNA Purification", "Genomic DNA Purification", "RNA Purification", "PCR Cleanup Kits"], formats: ["spin column kit", "magnetic bead kit", "cleanup kit", "plate format"], specifications: ["sample type", "yield range", "throughput", "cleanup chemistry", "elution volume"] },
      { title: "Electrophoresis & Detection", families: ["Agarose", "DNA Ladders", "Loading Dyes", "Gel Stains"], formats: ["powder", "ladder", "loading dye", "stain"], specifications: ["gel strength", "size range", "detection method", "sample type", "storage condition"] },
      { title: "NGS Library Prep Consumables", families: ["Magnetic Beads", "Library Prep Tubes & Plates", "Adapter & Indexing Consumables", "Cleanup Consumables"], formats: ["bead reagent", "tube and plate set", "adapter consumable", "cleanup format"], specifications: ["library workflow", "sample input", "plate format", "bead chemistry", "automation compatibility"] },
      { title: "Gene Editing & Cloning", families: ["Cloning Reagents", "Competent Cell Consumables", "CRISPR Workflow Consumables", "Transformation Plates"], formats: ["reagent", "competent cell support", "CRISPR consumable", "plate"], specifications: ["workflow", "enzyme or reagent type", "cell type", "selection marker", "storage condition"] }
    ]
  }),
  buildSegment(5, {
    title: "Sample Prep & Filtration",
    shortDescription: "Syringe filters, membranes, vacuum filtration, centrifugal filters, filter plates, sample collection, clarification, and pre-filtration.",
    longDescription: "BioAxis organizes filtration and sample preparation needs by membrane, pore size, MWCO, volume, sample compatibility, sterility, and downstream workflow.",
    heroStatement: "Browse sample prep and filtration products by membrane chemistry, pore size, device format, sample type, and documentation need.",
    primaryApplications: ["sample clarification", "sterile filtration", "protein concentration", "analytical sample prep", "cell culture media filtration"],
    relatedSegments: ["cell-culture-analysis", "bioprocessing-consumables", "analytical-qc-consumables", "protein-biology-immunoassays"],
    categories: [
      { title: "Syringe Filters", families: ["Sterile Syringe Filters", "Non-Sterile Syringe Filters", "Low-Protein-Binding Filters", "HPLC / UHPLC Syringe Filters"], formats: ["sterile syringe filter", "non-sterile syringe filter", "low-binding filter", "HPLC syringe filter"], specifications: ["membrane", "pore size", "diameter", "hold-up volume", "chemical compatibility"] },
      { title: "Filter Membranes", families: ["PES Membranes", "PVDF Membranes", "PTFE Membranes", "Nylon Membranes"], formats: ["disc membrane", "sheet membrane", "sterile membrane", "non-sterile membrane"], specifications: ["membrane material", "pore size", "diameter", "surface chemistry", "application fit"] },
      { title: "Vacuum Filtration", families: ["Bottle-Top Filters", "Vacuum Filter Units", "Filtration Funnels", "Receiver Bottles"], formats: ["bottle-top filter", "vacuum unit", "funnel", "receiver bottle"], specifications: ["volume", "membrane", "pore size", "receiver fit", "sterility"] },
      { title: "Centrifugal Filters", families: ["Protein Concentrators", "DNA / RNA Concentrators", "Desalting Devices", "Spin Filters"], formats: ["centrifugal concentrator", "spin filter", "desalting device", "MWCO format"], specifications: ["MWCO", "sample volume", "recovery", "centrifuge compatibility", "membrane"] },
      { title: "Filter Plates", families: ["96-Well Filter Plates", "Deep-Well Filter Plates", "Cell-Based Assay Filter Plates", "Sample Cleanup Filter Plates"], formats: ["96-well filter plate", "deep-well filter plate", "assay filter plate", "cleanup filter plate"], specifications: ["well count", "membrane", "pore size", "SBS footprint", "vacuum compatibility"] },
      { title: "Sample Collection & Prep", families: ["Collection Tubes", "Swabs", "Homogenization Consumables", "Lysis Tubes"], formats: ["collection tube", "swab", "homogenization tube", "lysis tube"], specifications: ["sample type", "tube material", "collection format", "sterility", "storage condition"] },
      { title: "Clarification & Pre-Filtration", families: ["Depth Filters", "Glass Fiber Filters", "Pre-Filters", "High-Particulate Sample Filters"], formats: ["depth filter", "glass fiber filter", "pre-filter", "high-particulate filter"], specifications: ["particle load", "filter media", "pore size", "flow rate", "sample compatibility"] }
    ]
  }),
  buildSegment(6, {
    title: "Storage & Cryopreservation",
    shortDescription: "Cryogenic vials, boxes, racks, freezer storage, reagent storage, controlled-rate freezing, labels, and sample identification.",
    longDescription: "BioAxis helps teams structure storage and cryopreservation sourcing around temperature range, tube format, barcode support, freezer footprint, plate compatibility, and sample traceability.",
    heroStatement: "Organize sample storage by cryogenic format, barcode need, box and rack fit, controlled-rate freezing, and identification workflow.",
    primaryApplications: ["cryogenic storage", "sample archiving", "cell freezing", "reagent storage", "sample identification"],
    relatedSegments: ["cell-culture-analysis", "labware-general-consumables", "automation-consumables", "bioprocessing-consumables"],
    categories: [
      { title: "Cryogenic Vials", families: ["Internal Thread Cryovials", "External Thread Cryovials", "Barcoded Cryovials", "Sterile Cryovials"], formats: ["internal thread vial", "external thread vial", "barcoded vial", "sterile cryovial"], specifications: ["thread type", "volume", "temperature range", "sterility", "barcode support"] },
      { title: "Cryogenic Boxes & Racks", families: ["Cardboard Cryoboxes", "Plastic Cryoboxes", "Freezer Racks", "Liquid Nitrogen Storage Racks"], formats: ["cardboard box", "plastic box", "freezer rack", "LN2 rack"], specifications: ["box layout", "tube fit", "temperature range", "rack footprint", "material"] },
      { title: "Freezer Storage", families: ["2D Barcoded Tubes", "Sample Storage Tubes", "Freezer Boxes", "Tube Rack Systems"], formats: ["2D tube", "sample storage tube", "freezer box", "tube rack"], specifications: ["barcode type", "volume", "rack geometry", "freezer compatibility", "automation fit"] },
      { title: "Reagent Storage", families: ["Amber Bottles", "HDPE Bottles", "Media Bottles", "Small-Volume Storage Vials"], formats: ["amber bottle", "HDPE bottle", "media bottle", "small-volume vial"], specifications: ["material", "volume", "light protection", "closure", "sterility"] },
      { title: "Controlled-Rate Freezing", families: ["Isopropanol Freezing Containers", "Cryopreservation Containers", "Cell Freezing Accessories", "Temperature Monitoring Consumables"], formats: ["freezing container", "cryopreservation container", "freezing accessory", "temperature monitor"], specifications: ["cooling profile", "vial capacity", "temperature range", "sample type", "monitoring need"] },
      { title: "Labels & Identification", families: ["Cryogenic Labels", "Barcode Labels", "Tube Cap Inserts", "Plate ID Labels"], formats: ["cryogenic label", "barcode label", "cap insert", "plate label"], specifications: ["temperature range", "adhesive", "barcode support", "label format", "chemical resistance"] }
    ]
  }),
  buildSegment(7, {
    title: "Protein Biology & Immunoassays",
    shortTitle: "Protein Biology",
    shortDescription: "Antibodies, Western blotting, protein electrophoresis, ELISA, immunoassays, protein purification, sample prep, proteins, and enzymes.",
    longDescription: "BioAxis maps protein biology and immunoassay sourcing by target, host, species reactivity, assay readout, membrane or gel format, purification method, and documentation needs.",
    heroStatement: "Source protein biology products by target, assay method, sample type, species reactivity, format, and documentation requirement.",
    primaryApplications: ["Western blotting", "ELISA", "immunoassays", "protein purification", "protein sample preparation"],
    relatedSegments: ["buffers-reagents-biochemicals", "sample-prep-filtration", "cell-culture-analysis", "analytical-qc-consumables"],
    categories: [
      { title: "Antibodies", families: ["Primary Antibodies", "Secondary Antibodies", "Recombinant Antibodies", "Flow Cytometry Antibodies"], formats: ["primary antibody", "secondary antibody", "recombinant antibody", "flow antibody"], specifications: ["target", "host", "species reactivity", "application", "conjugate"] },
      { title: "Western Blotting", families: ["Transfer Membranes", "Blocking Buffers", "Protein Ladders", "Detection Reagents"], formats: ["membrane", "blocking buffer", "ladder", "detection reagent"], specifications: ["membrane material", "protein size range", "detection chemistry", "buffer compatibility", "sensitivity"] },
      { title: "Protein Electrophoresis", families: ["Precast Gels", "Gel Buffers", "Protein Stains", "Electrophoresis Consumables"], formats: ["precast gel", "running buffer", "stain", "electrophoresis accessory"], specifications: ["gel percentage", "buffer system", "sample type", "ladder range", "instrument fit"] },
      { title: "ELISA & Immunoassays", families: ["ELISA Plates", "Coating Buffers", "Detection Substrates", "Multiplex Assay Consumables"], formats: ["ELISA plate", "coating buffer", "substrate", "multiplex consumable"], specifications: ["assay format", "plate binding", "readout", "sample type", "target panel"] },
      { title: "Protein Purification", families: ["Affinity Resins", "Spin Columns", "Magnetic Beads", "Protein A / G Consumables"], formats: ["resin", "spin column", "magnetic bead", "Protein A / G format"], specifications: ["binding chemistry", "sample volume", "target tag", "resin format", "buffer compatibility"] },
      { title: "Protein Sample Prep", families: ["Lysis Buffers", "Protease Inhibitors", "Desalting Columns", "Concentrators"], formats: ["lysis buffer", "inhibitor", "desalting column", "concentrator"], specifications: ["sample type", "buffer chemistry", "protease control", "MWCO", "volume"] },
      { title: "Proteins & Enzymes", families: ["Recombinant Proteins", "Enzymes", "Cytokines", "Assay Standards"], formats: ["recombinant protein", "enzyme", "cytokine", "standard"], specifications: ["species", "purity", "activity", "tag", "carrier status"] }
    ]
  }),
  buildSegment(8, {
    title: "Buffers, Reagents & Biochemicals",
    shortTitle: "Buffers & Reagents",
    shortDescription: "Biological buffers, cell culture reagents, molecular biology reagents, protein reagents, lab chemicals, biochemicals, and custom or bulk reagents.",
    longDescription: "BioAxis organizes reagent sourcing around formulation, grade, concentration, pH, sterility, purity, package size, documentation, and recurring supply needs.",
    heroStatement: "Browse buffers, reagents, chemicals, and biochemicals by formulation, grade, concentration, application, package size, and documentation need.",
    primaryApplications: ["buffer preparation", "cell culture", "molecular biology", "protein biology", "analytical workflows"],
    relatedSegments: ["molecular-biology-pcr", "protein-biology-immunoassays", "cell-culture-analysis", "analytical-qc-consumables"],
    categories: [
      { title: "Biological Buffers", families: ["PBS", "Tris Buffers", "HEPES Buffers", "MES / MOPS Buffers"], formats: ["ready-to-use buffer", "concentrate", "powder", "sterile solution"], specifications: ["buffer system", "pH", "concentration", "grade", "sterility"] },
      { title: "Cell Culture Reagents", families: ["Trypsin & Dissociation Reagents", "Antibiotics", "Attachment Factors", "Cell Freezing Reagents"], formats: ["solution", "reagent", "factor", "freezing reagent"], specifications: ["concentration", "cell type", "sterility", "storage condition", "documentation"] },
      { title: "Molecular Biology Reagents", families: ["Nucleases", "Polymerases", "Restriction Enzymes", "Nucleic Acid Stains"], formats: ["enzyme", "master mix", "stain", "kit"], specifications: ["activity", "reaction buffer", "storage condition", "nuclease-free status", "workflow fit"] },
      { title: "Protein Biology Reagents", families: ["Blocking Reagents", "Wash Buffers", "Substrates", "Protein Stabilizers"], formats: ["buffer", "substrate", "stabilizer", "ready-to-use reagent"], specifications: ["assay method", "concentration", "detection chemistry", "protein compatibility", "storage condition"] },
      { title: "General Lab Chemicals", families: ["Salts", "Acids & Bases", "Solvents", "Detergents"], formats: ["powder", "solution", "solvent bottle", "detergent"], specifications: ["purity", "grade", "package size", "chemical compatibility", "SDS requirement"] },
      { title: "Biochemicals", families: ["Amino Acids", "Carbohydrates", "Cofactors", "Reducing Agents"], formats: ["powder", "solution", "aliquot", "research reagent"], specifications: ["purity", "activity", "grade", "storage condition", "application"] },
      { title: "Custom / Bulk Reagents", families: ["Custom Buffer Preparation", "Bulk Reagent Packaging", "Lot-Reserved Supply", "Documentation-Ready Reagents"], formats: ["custom buffer", "bulk pack", "reserved lot", "documentation-ready supply"], specifications: ["formulation", "lot requirement", "package size", "documentation", "delivery schedule"] }
    ]
  }),
  buildSegment(9, {
    title: "Analytical & QC Consumables",
    shortTitle: "Analytical & QC",
    shortDescription: "Chromatography vials and caps, analytical sample prep, reference standards, chromatography consumables, rapid testing, and QC documentation support.",
    longDescription: "BioAxis organizes analytical and QC consumables by method compatibility, vial and cap fit, reference standard need, documentation requirements, and method-equivalent alternatives.",
    heroStatement: "Source analytical and QC consumables by method, format, specification, documentation requirement, and equivalent fit.",
    primaryApplications: ["HPLC and GC workflows", "analytical sample prep", "QC testing", "reference standards", "rapid chemical testing"],
    relatedSegments: ["sample-prep-filtration", "buffers-reagents-biochemicals", "microbiology-sterility-testing", "labware-general-consumables"],
    categories: [
      { title: "Chromatography Vials & Caps", families: ["HPLC Vials", "GC Vials", "Screw Caps", "Septa"], formats: ["HPLC vial", "GC vial", "screw cap", "septum"], specifications: ["vial volume", "thread type", "septa material", "instrument fit", "cleanliness"] },
      { title: "Sample Prep for Analytical Testing", families: ["Syringe Filters", "SPE Plates", "Centrifuge Tubes", "Sample Vials"], formats: ["syringe filter", "SPE plate", "centrifuge tube", "sample vial"], specifications: ["sample type", "membrane", "plate format", "tube volume", "method compatibility"] },
      { title: "Reference Standards & Controls", families: ["Analytical Standards", "QC Controls", "Calibration Standards", "System Suitability Standards"], formats: ["standard", "control", "calibrator", "system suitability material"], specifications: ["analyte", "concentration", "matrix", "documentation", "storage condition"] },
      { title: "Chromatography Consumables", families: ["HPLC Columns", "Guard Columns", "Tubing & Fittings", "Solvent Filters"], formats: ["column", "guard column", "fitting", "solvent filter"], specifications: ["chemistry", "dimension", "particle size", "pressure rating", "instrument fit"] },
      { title: "Rapid Testing Consumables", families: ["Test Strips", "Colorimetric Test Kits", "Photometry Consumables", "Water Testing Consumables"], formats: ["test strip", "colorimetric kit", "photometry consumable", "water test format"], specifications: ["analyte", "range", "readout", "sample type", "method fit"] },
      { title: "QC Documentation Support", families: ["CoA-Ready Products", "Lot Traceability", "Sterility Documentation", "Method-Compatible Alternatives"], formats: ["documentation-ready item", "lot-traceable product", "sterility-documented product", "method-compatible equivalent"], specifications: ["documentation type", "lot need", "method requirement", "quality review", "supplier equivalent"] }
    ]
  }),
  buildSegment(10, {
    title: "Microbiology & Sterility Testing",
    shortTitle: "Microbiology",
    shortDescription: "Microbial culture media, sterility testing, microbial filtration, environmental monitoring, pathogen and indicator testing, pyrogen testing, and standards.",
    longDescription: "BioAxis supports microbiology and sterility testing requests by mapping sample type, sterility need, media format, filtration path, environmental monitoring format, and documentation requirements.",
    heroStatement: "Browse microbiology and sterility testing products by media type, monitoring format, filtration method, sample workflow, and documentation need.",
    primaryApplications: ["microbial culture", "sterility testing", "environmental monitoring", "pathogen screening", "endotoxin and pyrogen testing"],
    relatedSegments: ["analytical-qc-consumables", "sample-prep-filtration", "buffers-reagents-biochemicals", "bioprocessing-consumables"],
    categories: [
      { title: "Microbial Culture Media", families: ["Agar Plates", "Broths", "Dehydrated Media", "Selective Media"], formats: ["agar plate", "broth", "dehydrated medium", "selective medium"], specifications: ["media type", "organism group", "sterility", "format", "storage condition"] },
      { title: "Sterility Testing Consumables", families: ["Sterility Test Canisters", "Sampling Bags", "Sterile Filtration Devices", "Closed-System Consumables"], formats: ["test canister", "sampling bag", "sterile filtration device", "closed-system format"], specifications: ["sample type", "closed-system need", "sterility", "filter format", "documentation"] },
      { title: "Microbial Filtration", families: ["Membrane Filters", "Filter Funnels", "Microbiology Monitors", "Vacuum Filtration Devices"], formats: ["membrane filter", "funnel", "monitor", "vacuum device"], specifications: ["membrane", "pore size", "sample volume", "sterility", "microbiology method fit"] },
      { title: "Environmental Monitoring", families: ["Contact Plates", "Settle Plates", "Swabs", "Air Sampling Consumables"], formats: ["contact plate", "settle plate", "swab", "air sampling consumable"], specifications: ["monitoring type", "media", "sterility", "collection method", "incubation workflow"] },
      { title: "Pathogen & Indicator Testing", families: ["Rapid Test Kits", "Indicator Organism Tests", "Sample Prep Consumables", "Detection Plates"], formats: ["rapid test kit", "indicator test", "sample prep consumable", "detection plate"], specifications: ["target organism", "sample type", "readout", "workflow", "documentation"] },
      { title: "Endotoxin & Pyrogen Testing", families: ["LAL Consumables", "Endotoxin-Free Tubes", "Reagent Reservoirs", "Testing Plates"], formats: ["LAL consumable", "endotoxin-free tube", "reservoir", "testing plate"], specifications: ["endotoxin control", "sample format", "plate compatibility", "reagent fit", "documentation"] },
      { title: "Microbiology Standards", families: ["QC Strains", "Microbial Controls", "Growth Promotion Test Materials", "Verification Consumables"], formats: ["QC strain", "microbial control", "growth promotion material", "verification consumable"], specifications: ["organism", "control type", "storage", "documentation", "method fit"] }
    ]
  }),
  buildSegment(11, {
    title: "Bioprocessing Consumables",
    shortTitle: "Bioprocessing",
    shortDescription: "Upstream, single-use fluid management, sterile filtration, clarification, buffer and media preparation, TFF/UF-DF, process sampling, and QC consumables.",
    longDescription: "BioAxis supports early bioprocess and process development sourcing by organizing single-use formats, tubing and connectors, sterile filtration, sampling, process bottles, bags, and documentation-ready alternatives.",
    heroStatement: "Source bioprocessing consumables by process step, tubing and connector format, sterility, material, scale, sampling path, and documentation need.",
    primaryApplications: ["upstream process development", "single-use fluid management", "sterile filtration", "clarification and harvest", "process sampling and QC"],
    relatedSegments: ["sample-prep-filtration", "cell-culture-analysis", "buffers-reagents-biochemicals", "microbiology-sterility-testing"],
    categories: [
      { title: "Upstream Cell Culture Consumables", families: ["Media Bags", "Feed Bottles", "Single-Use Sampling Bags", "Cell Culture Process Containers"], formats: ["media bag", "feed bottle", "sampling bag", "process container"], specifications: ["volume", "film or bottle material", "sterility", "connection", "documentation"] },
      { title: "Single-Use Fluid Management", families: ["Tubing Assemblies", "Connectors", "Clamps", "Transfer Bags"], formats: ["tubing assembly", "connector", "clamp", "transfer bag"], specifications: ["tubing material", "connector type", "inner diameter", "sterility", "closed-system fit"] },
      { title: "Sterile Filtration & Bioburden Control", families: ["Sterile Process Filters", "Vent Filters", "Depth Filters", "Final Fill Filters"], formats: ["process filter", "vent filter", "depth filter", "final fill filter"], specifications: ["pore size", "filter format", "connection", "process scale", "sterility"] },
      { title: "Clarification & Harvest", families: ["Depth Filter Sheets", "Clarification Capsules", "Pre-Filters", "Harvest Bags"], formats: ["depth filter sheet", "capsule", "pre-filter", "harvest bag"], specifications: ["particle load", "filter media", "scale", "connection", "sample compatibility"] },
      { title: "Buffer & Media Preparation", families: ["Mixing Bags", "Powder Transfer Bags", "Bulk Bottles", "Sterile Containers"], formats: ["mixing bag", "powder transfer bag", "bulk bottle", "sterile container"], specifications: ["volume", "material", "port type", "sterility", "documentation"] },
      { title: "TFF / UF-DF Consumables", families: ["TFF Cassettes", "Hollow Fiber Filters", "Diafiltration Tubing", "Sample Concentrators"], formats: ["TFF cassette", "hollow fiber", "diafiltration tubing", "concentrator"], specifications: ["MWCO", "membrane", "surface area", "connection", "process scale"] },
      { title: "Process Sampling & QC", families: ["Aseptic Sampling Devices", "Process Sample Tubes", "Bioburden Testing Consumables", "Lot-Traceable QC Consumables"], formats: ["aseptic sampler", "sample tube", "bioburden consumable", "QC consumable"], specifications: ["sample format", "sterility", "documentation", "connection", "QC method fit"] }
    ]
  }),
  buildSegment(12, {
    title: "Lab Water, Small Equipment & Accessories",
    shortTitle: "Lab Water & Equipment",
    shortDescription: "Lab water systems, water system consumables, benchtop equipment, cold storage accessories, measurement accessories, and equipment-compatible consumables.",
    longDescription: "BioAxis organizes lab water and small equipment requests by water grade, consumable replacement need, benchtop equipment format, calibration accessory, footprint, and instrument-compatible consumables.",
    heroStatement: "Browse lab water, compact equipment, and accessories by water grade, replacement consumable, footprint, capacity, calibration need, and equipment compatibility.",
    primaryApplications: ["lab water preparation", "benchtop sample handling", "cold storage organization", "measurement and calibration", "equipment-compatible workflows"],
    relatedSegments: ["labware-general-consumables", "molecular-biology-pcr", "storage-cryopreservation", "analytical-qc-consumables"],
    categories: [
      { title: "Lab Water Systems", families: ["Type I Ultrapure Water Systems", "Type II Pure Water Systems", "RO Water Systems", "Clinical Lab Water Systems"], formats: ["Type I system", "Type II system", "RO system", "clinical water system"], specifications: ["water grade", "daily volume", "feed water", "space requirement", "documentation"] },
      { title: "Water System Consumables", families: ["Purification Cartridges", "Final Filters", "UV Lamps", "Sanitization Consumables"], formats: ["cartridge", "final filter", "UV lamp", "sanitization consumable"], specifications: ["system fit", "replacement schedule", "water quality need", "connection", "documentation"] },
      { title: "Benchtop Equipment", families: ["Mini Centrifuges", "Vortex Mixers", "Dry Baths", "Hotplate Stirrers"], formats: ["mini centrifuge", "vortex mixer", "dry bath", "hotplate stirrer"], specifications: ["capacity", "speed range", "temperature range", "footprint", "accessory fit"] },
      { title: "Cold Storage Accessories", families: ["Freezer Boxes", "Cryo Racks", "Temperature Labels", "Sample Inventory Accessories"], formats: ["freezer box", "cryo rack", "temperature label", "inventory accessory"], specifications: ["temperature range", "sample format", "rack fit", "label compatibility", "storage workflow"] },
      { title: "Measurement Accessories", families: ["pH Consumables", "Conductivity Standards", "Balance Accessories", "Calibration Consumables"], formats: ["pH consumable", "standard", "balance accessory", "calibration item"], specifications: ["instrument fit", "range", "accuracy", "calibration interval", "documentation"] },
      { title: "Equipment-Compatible Consumables", families: ["Rotor-Compatible Tubes", "Plate Reader Plates", "Thermocycler Plates", "Automation-Compatible Consumables"], formats: ["rotor-compatible tube", "reader plate", "thermocycler plate", "automation consumable"], specifications: ["instrument fit", "format", "material", "temperature range", "documentation"] }
    ]
  })
];

export function getTaxonomySegmentBySlug(slug: string) {
  return productTaxonomy.find((segment) => segment.slug === slug);
}

export function getTaxonomyCategory(segmentSlug: string, categorySlug: string) {
  const segment = getTaxonomySegmentBySlug(segmentSlug);
  const category = segment?.categories.find((item) => item.slug === categorySlug);

  if (!segment || !category) {
    return null;
  }

  return { segment, category };
}

export function getTaxonomySubcategory(segmentSlug: string, categorySlug: string) {
  const match = getTaxonomyCategory(segmentSlug, categorySlug);

  if (!match) {
    return null;
  }

  return { segment: match.segment, subcategory: match.category, category: match.category };
}

export function getTaxonomyFamily(segmentSlug: string, categorySlug: string, familySlug: string) {
  const match = getTaxonomyCategory(segmentSlug, categorySlug);
  const family = match?.category.productFamilies.find((item) => item.slug === familySlug);

  if (!match || !family) {
    return null;
  }

  return { segment: match.segment, category: match.category, family };
}

export function getAllCategoryPaths() {
  return productTaxonomy.flatMap((segment) =>
    segment.categories.map((category) => ({
      segment: segment.slug,
      category: category.slug
    }))
  );
}

export function getAllSubcategoryPaths() {
  return getAllCategoryPaths().map((path) => ({
    segment: path.segment,
    subcategory: path.category,
    category: path.category
  }));
}

export function getAllFamilyPaths() {
  return productTaxonomy.flatMap((segment) =>
    segment.categories.flatMap((category) =>
      category.productFamilies.map((family) => ({
        segment: segment.slug,
        category: category.slug,
        family: family.slug
      }))
    )
  );
}

export function buildRequestHref({
  segment,
  category,
  family,
  inquiryType = "quote"
}: {
  segment?: string;
  category?: string;
  family?: string;
  inquiryType?: string;
}) {
  const params = new URLSearchParams();

  if (segment) {
    params.set("segment", segment);
  }

  if (category) {
    params.set("category", category);
  }

  if (family) {
    params.set("family", family);
  }

  params.set("inquiryType", inquiryType);

  return `/request-quote?${params.toString()}`;
}

export function getProductSearchResults(query: string): ProductSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const results: ProductSearchResult[] = [];

  productTaxonomy.forEach((segment) => {
    const segmentSearch = [
      segment.title,
      segment.shortDescription,
      segment.longDescription,
      segment.heroStatement,
      ...segment.primaryApplications,
      ...segment.productFamilies,
      ...segment.applications,
      ...segment.formats,
      ...segment.specifications
    ]
      .join(" ")
      .toLowerCase();

    if (segmentSearch.includes(normalizedQuery)) {
      results.push({
        type: "segment",
        title: segment.title,
        description: segment.shortDescription,
        href: `/products/${segment.slug}`,
        segmentTitle: segment.title
      });
    }

    segment.categories.forEach((category) => {
      const categorySearch = [
        category.title,
        category.shortDescription,
        category.longDescription,
        ...category.commonApplications,
        ...category.commonFormats,
        ...category.specifications,
        ...category.documentation,
        ...category.productFamilies.map((family) => family.title)
      ]
        .join(" ")
        .toLowerCase();

      if (categorySearch.includes(normalizedQuery)) {
        results.push({
          type: "category",
          title: category.title,
          description: category.shortDescription,
          href: `/products/${segment.slug}/${category.slug}`,
          segmentTitle: segment.title,
          categoryTitle: category.title
        });
      }

      category.productFamilies.forEach((family) => {
        const familySearch = [
          family.title,
          family.shortDescription,
          family.longDescription,
          ...family.commonUseCases,
          ...family.commonFormats,
          ...family.selectionCriteria,
          ...family.keySpecifications,
          ...family.documentationChecklist,
          ...family.recommendedRFQFields
        ]
          .join(" ")
          .toLowerCase();

        if (familySearch.includes(normalizedQuery)) {
          results.push({
            type: "family",
            title: family.title,
            description: family.shortDescription,
            href: `/products/${segment.slug}/${category.slug}/${family.slug}`,
            segmentTitle: segment.title,
            categoryTitle: category.title,
            familyTitle: family.title
          });
        }
      });
    });
  });

  return results.slice(0, 36);
}

export function getAllProductHrefs() {
  return [
    "/products",
    ...productTaxonomy.flatMap((segment) => [
      `/products/${segment.slug}`,
      ...segment.categories.flatMap((category) => [
        `/products/${segment.slug}/${category.slug}`,
        ...category.productFamilies.map((family) => `/products/${segment.slug}/${category.slug}/${family.slug}`)
      ])
    ])
  ];
}
