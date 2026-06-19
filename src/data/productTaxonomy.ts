export type ProductSpecification = string;
export type DocumentationRequirement = string;
export type ApplicationArea = string;
export type ProductRequestType = "quote" | "equivalent" | "sample" | "documentation";

export type ProductItem = {
  slug: string;
  name: string;
  shortDescription: string;
  introduction: string;
  details: string[];
  commonSpecifications: string[];
  applications: string[];
  compatibilityConsiderations: string[];
  documentationNeeds: string[];
  equivalentMatchingInputs: string[];
  sampleEvaluationNotes: string[];
  relatedRequestTypes: ProductRequestType[];
};

export type RelatedCategory = {
  label: string;
  href: string;
  segmentSlug: string;
  subcategorySlug: string;
  categorySlug: string;
};

export type ProductFamily = {
  slug: string;
  id: string;
  name: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  buyerSpecs: string[];
  commonFormats: string[];
  applications: string[];
  documentationNeeds: DocumentationRequirement[];
  equivalentMatchingInputs: string[];
  equivalentSwitchingConsiderations: string[];
  typicalProducts: string[];
  commonUseCases: string[];
  selectionCriteria: string[];
  keySpecifications: ProductSpecification[];
  representativeFormats: string[];
  documentationChecklist: DocumentationRequirement[];
  recommendedRFQFields: string[];
  relatedFamilies: string[];
  productItems?: ProductItem[];
  requestCta: string;
  seoTitle: string;
  metaDescription: string;
};

export type ProductSubcategory = {
  slug: string;
  id: string;
  name: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  buyerSpecs: string[];
  selectionCriteria: string[];
  families: ProductFamily[];
  productFamilies: ProductFamily[];
  featuredFamilies: ProductFamily[];
  typicalProducts: string[];
  commonFormats: string[];
  formats: string[];
  applications: ApplicationArea[];
  commonApplications: ApplicationArea[];
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
  slug: string;
  id: string;
  name: string;
  title: string;
  shortTitle: string;
  index: number;
  headline: string;
  heroStatement: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  heroDescription: string;
  buyerUseCases: string[];
  primaryApplications: ApplicationArea[];
  buyerTypes: string[];
  buyerSpecs: string[];
  subcategories: ProductSubcategory[];
  categories: ProductSubcategory[];
  featuredCategories: ProductSubcategory[];
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
export type ProductCategory = ProductSubcategory;
export type FeaturedFamily = ProductFamily;

type RawSubcategory = {
  name: string;
  slug: string;
  families: string[];
};

type RawSegment = {
  name: string;
  slug: string;
  headline: string;
  shortDescription: string;
  buyerUseCases: string[];
  buyerSpecs: string[];
  commonFormats: string[];
  applications: string[];
  documentationNeeds: string[];
  subcategories: RawSubcategory[];
  relatedSegments: string[];
};

type SearchResultType = "segment" | "subcategory" | "family" | "product" | "workflow" | "resource";

export type ProductSearchResult = {
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  segmentTitle?: string;
  segmentSlug?: string;
  categoryTitle?: string;
  categorySlug?: string;
  subcategoryTitle?: string;
  familyTitle?: string;
  familySlug?: string;
  productTitle?: string;
  productSlug?: string;
  matchedFields?: string[];
};

const buyerTypes = [
  "biotech procurement teams",
  "pharma research labs",
  "academic labs",
  "lab managers",
  "scientists evaluating equivalent consumables",
  "startup biotech teams"
];

const defaultRequestTypes = ["quote", "equivalent", "sample", "documentation"];

const familyNameOverrides: Record<string, string> = {
  "universal-pipette-tips": "Universal Pipette Tips",
  "filtered-pipette-tips": "Filtered Pipette Tips",
  "low-retention-pipette-tips": "Low Retention Pipette Tips",
  "extended-length-pipette-tips": "Extended Length Pipette Tips",
  "sterile-pipette-tips": "Sterile Pipette Tips",
  "reload-and-bulk-pipette-tips": "Reload and Bulk Pipette Tips",
  "1ml-serological-pipettes": "1 mL Serological Pipettes",
  "5ml-serological-pipettes": "5 mL Serological Pipettes",
  "10ml-serological-pipettes": "10 mL Serological Pipettes",
  "25ml-serological-pipettes": "25 mL Serological Pipettes",
  "50ml-serological-pipettes": "50 mL Serological Pipettes",
  "40um-cell-strainers": "40 µm Cell Strainers",
  "70um-cell-strainers": "70 µm Cell Strainers",
  "100um-cell-strainers": "100 µm Cell Strainers",
  "96-well-plates": "96-Well Plates",
  "384-well-plates": "384-Well Plates",
  "96-well-pcr-plates": "96-Well PCR Plates",
  "384-well-pcr-plates": "384-Well PCR Plates",
  "96-well-automation-plates": "96-Well Automation Plates",
  "384-well-automation-plates": "384-Well Automation Plates",
  "2d-barcoded-tubes": "2D Barcoded Tubes",
  "2d-coded-storage-tubes": "2D Coded Storage Tubes",
  "dna-rna-concentrators": "DNA/RNA Concentrators",
  "dnase-rnase-free": "DNase/RNase-Free",
  "tpe-tubing": "TPE Tubing"
};

function titleize(slug: string) {
  if (familyNameOverrides[slug]) {
    return familyNameOverrides[slug];
  }

  return slug
    .split("-")
    .map((word) => {
      const upper = word.toUpperCase();
      if (["pcr", "qpcr", "dna", "rna", "fbs", "edta", "pbs", "tbs", "dmso", "spe", "usp", "pvdf", "pes", "ptfe", "sds", "chaps", "facs", "coa", "tpe"].includes(word)) {
        return upper === "QPCR" ? "qPCR" : upper;
      }
      if (word === "and") {
        return "and";
      }
      if (word === "ph") {
        return "pH";
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function buildFamily(segment: RawSegment, subcategory: RawSubcategory, familySlug: string, siblings: string[]): ProductFamily {
  const name = titleize(familySlug);
  const relatedFamilies = siblings.filter((slug) => slug !== familySlug).slice(0, 4);

  return {
    slug: familySlug,
    id: familySlug,
    name,
    title: name,
    shortDescription: `BioAxis helps source ${name.toLowerCase()} for ${subcategory.name.toLowerCase()} workflows with specification matching, documentation support, equivalent review, and sample evaluation.`,
    longDescription: `Source ${name.toLowerCase()} for ${segment.name.toLowerCase()} workflows with BioAxis support for product specification, supplier equivalent review, sample-first evaluation, and documentation coordination.`,
    description: `BioAxis helps source ${name.toLowerCase()} for ${subcategory.name.toLowerCase()} workflows with specification matching, documentation support, equivalent review, and sample evaluation.`,
    buyerSpecs: segment.buyerSpecs,
    commonFormats: segment.commonFormats,
    applications: segment.applications,
    documentationNeeds: segment.documentationNeeds,
    equivalentMatchingInputs: [
      "current supplier",
      "catalog number",
      "critical dimensions or format",
      "material and sterility requirements",
      "documentation requirements",
      "sample testing criteria"
    ],
    equivalentSwitchingConsiderations: [
      "Compare the current catalog number against format, dimensions, material, and workflow fit.",
      "Confirm sterility, packaging, documentation, and lot requirements before switching.",
      "Request samples when performance could affect cells, assays, automation, or QC review.",
      "Treat equivalent options as candidates for customer validation, not guaranteed replacements."
    ],
    typicalProducts: [name, subcategory.name, segment.name],
    commonUseCases: segment.applications,
    selectionCriteria: [
      ...segment.buyerSpecs.slice(0, 5),
      "current product or catalog number",
      "allowed substitution constraints"
    ],
    keySpecifications: segment.buyerSpecs,
    representativeFormats: segment.commonFormats,
    documentationChecklist: segment.documentationNeeds,
    recommendedRFQFields: [
      "product description or equivalent product",
      "current brand / catalog number",
      "desired quantity",
      "sterile / non-sterile requirement",
      "documentation required",
      "target delivery date",
      "institution / company",
      "email",
      "notes"
    ],
    relatedFamilies,
    requestCta: `Request quote for ${name.toLowerCase()}`,
    seoTitle: `${name} | ${subcategory.name} | BioAxis`,
    metaDescription: `Source ${name.toLowerCase()} with BioAxis equivalent matching, sample coordination, documentation support, and RFQ assistance.`
  };
}

function buildSubcategory(segment: RawSegment, subcategory: RawSubcategory): ProductSubcategory {
  const families = subcategory.families.map((familySlug) => buildFamily(segment, subcategory, familySlug, subcategory.families));

  return {
    slug: subcategory.slug,
    id: subcategory.slug,
    name: subcategory.name,
    title: subcategory.name,
    shortDescription: `Source ${families.slice(0, 4).map((family) => family.name.toLowerCase()).join(", ")} and related ${subcategory.name.toLowerCase()} formats.`,
    longDescription: `${subcategory.name} requests often depend on ${segment.buyerSpecs.slice(0, 5).join(", ")} and documentation fit. BioAxis helps labs prepare quote-ready specifications, compare equivalents, request samples, and coordinate documentation for ${segment.name.toLowerCase()} workflows.`,
    description: `Source ${families.slice(0, 4).map((family) => family.name.toLowerCase()).join(", ")} and related ${subcategory.name.toLowerCase()} formats.`,
    buyerSpecs: segment.buyerSpecs,
    selectionCriteria: segment.buyerSpecs,
    families,
    productFamilies: families,
    featuredFamilies: families,
    typicalProducts: families.map((family) => family.name),
    commonFormats: segment.commonFormats,
    formats: segment.commonFormats,
    applications: segment.applications,
    commonApplications: segment.applications,
    specifications: segment.buyerSpecs,
    documentation: segment.documentationNeeds,
    documentationNeeds: segment.documentationNeeds,
    relatedCategories: [],
    relatedSubcategories: [],
    relatedSegments: segment.relatedSegments,
    requestTypes: defaultRequestTypes,
    seoTitle: `${subcategory.name} | ${segment.name} | BioAxis`,
    metaDescription: `Browse ${subcategory.name.toLowerCase()} for ${segment.name.toLowerCase()} sourcing, equivalent review, samples, documentation, and RFQ support.`
  };
}

function buildSegment(index: number, segment: RawSegment): ProductSegment {
  const builtSubcategories = segment.subcategories.map((subcategory) => buildSubcategory(segment, subcategory));
  const subcategories = builtSubcategories.map((subcategory) => {
    const relatedCategories = builtSubcategories
      .filter((item) => item.slug !== subcategory.slug)
      .slice(0, 4)
      .map((item) => ({
        label: item.name,
        href: `/products/${segment.slug}/${item.slug}`,
        segmentSlug: segment.slug,
        subcategorySlug: item.slug,
        categorySlug: item.slug
      }));

    return {
      ...subcategory,
      relatedCategories,
      relatedSubcategories: relatedCategories.map((item) => item.subcategorySlug)
    };
  });

  const productFamilies = subcategories.flatMap((subcategory) => subcategory.families.map((family) => family.name));

  return {
    slug: segment.slug,
    id: segment.slug,
    name: segment.name,
    title: segment.name,
    shortTitle: segment.name,
    index,
    headline: segment.headline,
    heroStatement: segment.headline,
    shortDescription: segment.shortDescription,
    longDescription: `${segment.shortDescription} BioAxis supports quote preparation, equivalent matching, sample-first evaluation, supplier documentation review, and recurring supply conversations for this category.`,
    description: segment.shortDescription,
    heroDescription: segment.headline,
    buyerUseCases: segment.buyerUseCases,
    primaryApplications: segment.applications,
    buyerTypes,
    buyerSpecs: segment.buyerSpecs,
    subcategories,
    categories: subcategories,
    featuredCategories: subcategories.slice(0, 4),
    relatedSegments: segment.relatedSegments,
    rfqPrompts: [
      `Share product family, format, quantity, and timeline for ${segment.name.toLowerCase()} sourcing.`,
      "Include current supplier and catalog number when an equivalent is needed.",
      "List sterile status, packaging preference, and documents required for procurement review."
    ],
    equivalentPrompts: [
      "Current supplier and catalog number",
      "Critical dimensions, material, or instrument fit",
      "Sterility, packaging, and documentation constraints",
      "Sample testing requirements before switching"
    ],
    samplePrompts: [
      "Product family and required format",
      "Application and compatibility test plan",
      "Quantity needed for evaluation",
      "Target decision timeline"
    ],
    productFamilies: productFamilies.slice(0, 12),
    applications: segment.applications,
    specifications: segment.buyerSpecs,
    formats: segment.commonFormats,
    imageKey: segment.slug,
    visualTheme: segment.name,
    ctaCopy: `Prepare a quote-ready ${segment.name.toLowerCase()} request with product family, specifications, equivalent inputs, sample needs, and documentation requirements.`,
    seoTitle: `${segment.name} Consumables | BioAxis`,
    metaDescription: segment.shortDescription
  };
}

const rawSegments: RawSegment[] = [
  {
    name: "Liquid Handling",
    slug: "liquid-handling",
    headline: "Source pipette tips, serological pipettes, reservoirs, robotic tips, and liquid handling accessories with quote-ready specifications.",
    shortDescription: "Manual and automated liquid handling consumables organized by volume range, sterility, filter barrier, packaging, and platform compatibility.",
    buyerUseCases: ["manual pipetting", "assay setup", "cell culture transfer", "automation deck setup", "high-throughput screening"],
    buyerSpecs: ["volume range", "sterile/non-sterile", "filtered/non-filtered", "low retention", "DNase/RNase-free", "racked/reload/bulk", "conductive tips", "robotic platform compatibility", "lot consistency"],
    commonFormats: ["racked", "reload", "bulk", "sterile", "filtered", "conductive", "automation compatible"],
    applications: ["molecular biology", "cell culture", "assay setup", "sample prep", "automation decks"],
    documentationNeeds: ["CoA where available", "sterility statement", "DNase/RNase-free statement", "material declaration", "lot traceability"],
    relatedSegments: ["automation-consumables", "molecular-biology-pcr", "cell-culture", "lab-plasticware"],
    subcategories: [
      { name: "Pipette Tips", slug: "pipette-tips", families: ["universal-pipette-tips", "filtered-pipette-tips", "low-retention-pipette-tips", "extended-length-pipette-tips", "sterile-pipette-tips", "reload-and-bulk-pipette-tips"] },
      { name: "Serological Pipettes", slug: "serological-pipettes", families: ["1ml-serological-pipettes", "5ml-serological-pipettes", "10ml-serological-pipettes", "25ml-serological-pipettes", "50ml-serological-pipettes"] },
      { name: "Pipettes and Controllers", slug: "pipettes-and-controllers", families: ["single-channel-pipettes", "multichannel-pipettes", "electronic-pipettes", "pipette-controllers"] },
      { name: "Reagent Reservoirs", slug: "reagent-reservoirs", families: ["single-channel-reservoirs", "multi-channel-reservoirs", "sterile-reagent-reservoirs", "low-dead-volume-reservoirs"] },
      { name: "Bottle-Top and Dispensers", slug: "bottle-top-dispensers", families: ["bottle-top-dispensers", "repeat-dispensers", "positive-displacement-tips"] },
      { name: "Automation Liquid Handling Tips", slug: "automation-liquid-handling-tips", families: ["hamilton-compatible-tips", "tecan-compatible-tips", "beckman-compatible-tips", "conductive-robotic-tips", "filtered-robotic-tips"] }
    ]
  },
  {
    name: "Lab Plasticware",
    slug: "lab-plasticware",
    headline: "Source tubes, plates, bottles, sealing films, racks, and general labware by material, footprint, sterility, and packaging format.",
    shortDescription: "Core plasticware and general consumables for daily lab operations, sample handling, assay setup, and storage workflows.",
    buyerUseCases: ["sample handling", "plate-based assays", "freezer organization", "reagent storage", "routine bench workflows"],
    buyerSpecs: ["polypropylene/polystyrene/polycarbonate", "sterile/non-sterile", "autoclavable", "low-bind", "graduations", "centrifuge rating", "SBS footprint", "packaging format"],
    commonFormats: ["tube", "plate", "bottle", "rack", "seal", "holder", "bulk pack"],
    applications: ["general research", "sample storage", "assay preparation", "cell culture support", "molecular biology"],
    documentationNeeds: ["material declaration", "sterility statement where applicable", "lot traceability", "CoA where available", "SDS where applicable"],
    relatedSegments: ["liquid-handling", "storage-cryopreservation", "automation-consumables", "cell-culture"],
    subcategories: [
      { name: "Tubes", slug: "tubes", families: ["microcentrifuge-tubes", "conical-centrifuge-tubes", "snap-cap-tubes", "screw-cap-tubes", "round-bottom-tubes"] },
      { name: "Plates", slug: "plates", families: ["96-well-plates", "384-well-plates", "deep-well-plates", "v-bottom-plates", "u-bottom-plates"] },
      { name: "Bottles and Containers", slug: "bottles-and-containers", families: ["media-bottles", "reagent-bottles", "storage-bottles", "carboys"] },
      { name: "General Labware", slug: "general-labware", families: ["petri-dishes", "weighing-boats", "spatulas-and-scoops", "transfer-pipettes"] },
      { name: "Sealing Films and Mats", slug: "sealing-films-and-mats", families: ["adhesive-plate-seals", "breathable-films", "aluminum-seals", "silicone-sealing-mats"] },
      { name: "Racks and Holders", slug: "racks-and-holders", families: ["tube-racks", "freezer-boxes", "plate-stands", "reservoir-holders"] }
    ]
  },
  {
    name: "Cell Culture",
    slug: "cell-culture",
    headline: "Source culture vessels, media, sera, dissociation products, freezing supplies, coatings, and stem cell culture reagents.",
    shortDescription: "Cell culture products organized by sterility, cell-type compatibility, formulation, surface treatment, and documentation needs.",
    buyerUseCases: ["2D cell culture", "stem cell culture", "primary cell workflows", "passaging", "cell freezing and recovery"],
    buyerSpecs: ["sterility", "cell-type compatibility", "serum-free/xeno-free/animal-origin-free", "endotoxin", "mycoplasma testing", "lot-to-lot consistency", "enhanced documentation where applicable"],
    commonFormats: ["sterile bottle", "treated vessel", "culture plate", "cryovial", "coating reagent", "ready-to-use solution"],
    applications: ["cell expansion", "media preparation", "passaging", "cryopreservation", "cell attachment"],
    documentationNeeds: ["CoA where available", "sterility statement", "mycoplasma information where available", "endotoxin information", "origin and treatment documentation"],
    relatedSegments: ["storage-cryopreservation", "sample-prep-filtration", "proteins-antibodies-immunology", "early-bioprocess-single-use"],
    subcategories: [
      { name: "Cell Culture Vessels", slug: "cell-culture-vessels", families: ["tissue-culture-flasks", "cell-culture-dishes", "multiwell-cell-culture-plates", "roller-bottles", "cell-factory-style-vessels"] },
      { name: "Media and Supplements", slug: "media-and-supplements", families: ["basal-media", "serum-free-media", "classical-media", "cell-culture-supplements", "antibiotics-and-antimycotics"] },
      { name: "Sera and Replacements", slug: "sera-and-replacements", families: ["fetal-bovine-serum", "qualified-fbs", "dialyzed-fbs", "serum-replacement-products"] },
      { name: "Cell Dissociation and Passaging", slug: "dissociation-and-passaging", families: ["trypsin-edta", "non-enzymatic-dissociation", "cell-scrapers", "passaging-reagents"] },
      { name: "Cell Freezing and Recovery", slug: "freezing-and-recovery", families: ["cell-freezing-media", "cryogenic-vials", "controlled-rate-freezing-containers", "thawing-media"] },
      { name: "Coatings and Matrices", slug: "coatings-and-matrices", families: ["collagen-coatings", "fibronectin-coatings", "laminin-coatings", "extracellular-matrix-products"] },
      { name: "Stem Cell and Primary Cell Culture", slug: "stem-cell-primary-cell-culture", families: ["stem-cell-media", "primary-cell-media", "xeno-free-reagents", "attachment-factors"] }
    ]
  },
  {
    name: "Molecular Biology & PCR",
    slug: "molecular-biology-pcr",
    headline: "Source PCR plastics, qPCR consumables, extraction kits, electrophoresis reagents, and nuclease-free water and buffers.",
    shortDescription: "Molecular biology consumables organized by PCR cleanliness, optical clarity, instrument compatibility, and sealing requirements.",
    buyerUseCases: ["PCR", "qPCR", "nucleic acid extraction", "gel analysis", "molecular biology sample prep"],
    buyerSpecs: ["DNase/RNase-free", "PCR-clean", "optical clarity", "skirted/semi-skirted/non-skirted", "ABI/Bio-Rad/Roche compatibility", "low evaporation", "sealing compatibility"],
    commonFormats: ["tube", "strip", "96-well plate", "384-well plate", "optical film", "kit", "buffer"],
    applications: ["PCR", "qPCR", "RT-PCR", "DNA/RNA extraction", "electrophoresis"],
    documentationNeeds: ["DNase/RNase-free statement", "CoA where available", "lot traceability", "storage condition", "instrument compatibility notes"],
    relatedSegments: ["liquid-handling", "buffers-chemicals-reagents", "automation-consumables", "sample-prep-filtration"],
    subcategories: [
      { name: "PCR Plastics", slug: "pcr-plastics", families: ["pcr-tubes", "pcr-strips", "96-well-pcr-plates", "384-well-pcr-plates", "optical-pcr-seals"] },
      { name: "qPCR Consumables", slug: "qpcr-consumables", families: ["qpcr-plates", "qpcr-tubes", "optical-sealing-films", "low-profile-qpcr-plastics"] },
      { name: "PCR and qPCR Reagents", slug: "pcr-qpcr-reagents", families: ["pcr-master-mixes", "qpcr-master-mixes", "reverse-transcription-reagents", "hot-start-polymerases"] },
      { name: "Nucleic Acid Extraction", slug: "nucleic-acid-extraction", families: ["dna-extraction-kits", "rna-extraction-kits", "plasmid-prep-kits", "magnetic-bead-extraction-kits"] },
      { name: "Electrophoresis and Gel Analysis", slug: "electrophoresis-gel-analysis", families: ["agarose", "dna-ladders", "gel-stains", "loading-dyes"] },
      { name: "Molecular Biology Water and Buffers", slug: "molecular-biology-water-buffers", families: ["nuclease-free-water", "te-buffer", "pbs", "tris-buffers"] }
    ]
  },
  {
    name: "Sample Prep & Filtration",
    slug: "sample-prep-filtration",
    headline: "Source syringe filters, centrifugal filters, vacuum filtration, membranes, sample cleanup products, and cell strainers.",
    shortDescription: "Sample prep and filtration products organized by membrane material, pore size, chemical compatibility, sterility, and binding profile.",
    buyerUseCases: ["sample clarification", "sterile filtration", "protein concentration", "analytical sample prep", "cell straining"],
    buyerSpecs: ["membrane material", "pore size", "diameter", "sterile/non-sterile", "protein binding", "chemical compatibility", "flow rate", "extractables/leachables where relevant"],
    commonFormats: ["syringe filter", "centrifugal device", "vacuum unit", "membrane disc", "spin column", "cell strainer"],
    applications: ["sample cleanup", "cell culture filtration", "analytical prep", "protein concentration", "cell suspension prep"],
    documentationNeeds: ["membrane material information", "sterility statement", "CoA where available", "chemical compatibility guidance", "extractables/leachables information where relevant"],
    relatedSegments: ["cell-culture", "assays-detection", "proteins-antibodies-immunology", "early-bioprocess-single-use"],
    subcategories: [
      { name: "Syringe Filters", slug: "syringe-filters", families: ["pes-syringe-filters", "pvdf-syringe-filters", "ptfe-syringe-filters", "nylon-syringe-filters", "sterile-syringe-filters"] },
      { name: "Centrifugal Filters", slug: "centrifugal-filters", families: ["protein-concentrators", "dna-rna-concentrators", "centrifugal-ultrafiltration-devices", "spin-columns"] },
      { name: "Bottle-Top and Vacuum Filtration", slug: "bottle-top-vacuum-filtration", families: ["bottle-top-filters", "vacuum-filter-units", "sterile-filtration-units", "receiver-bottles"] },
      { name: "Membranes and Filter Papers", slug: "membranes-filter-papers", families: ["nitrocellulose-membranes", "pvdf-membranes", "glass-fiber-filters", "qualitative-filter-paper"] },
      { name: "Sample Cleanup", slug: "sample-cleanup", families: ["desalting-columns", "cleanup-spin-columns", "protein-precipitation-plates", "spe-plates"] },
      { name: "Cell Strainers", slug: "cell-strainers", families: ["40um-cell-strainers", "70um-cell-strainers", "100um-cell-strainers", "sterile-cell-strainers"] }
    ]
  },
  {
    name: "Storage & Cryopreservation",
    slug: "storage-cryopreservation",
    headline: "Source cryovials, freezer boxes, storage tubes, seals, freezing media, and cold chain supplies for traceable sample storage.",
    shortDescription: "Storage and cryopreservation products organized by temperature range, thread style, barcode support, leak resistance, and sample traceability.",
    buyerUseCases: ["cryogenic storage", "freezer organization", "sample archiving", "cell freezing", "cold chain transfer"],
    buyerSpecs: ["temperature range", "vapor-phase liquid nitrogen compatibility", "sterile", "barcoded", "automation-compatible", "external/internal thread", "leak resistance", "sample traceability"],
    commonFormats: ["cryovial", "freezer box", "storage tube", "cap mat", "freezing media", "cold chain accessory"],
    applications: ["sample storage", "cell banking", "freezer inventory", "cryopreservation", "cold shipment"],
    documentationNeeds: ["sterility statement", "material declaration", "temperature range information", "barcode specification", "lot traceability"],
    relatedSegments: ["cell-culture", "lab-plasticware", "automation-consumables", "early-bioprocess-single-use"],
    subcategories: [
      { name: "Cryogenic Vials", slug: "cryogenic-vials", families: ["internal-thread-cryovials", "external-thread-cryovials", "sterile-cryovials", "barcoded-cryovials"] },
      { name: "Freezer Boxes and Racks", slug: "freezer-boxes-racks", families: ["cardboard-freezer-boxes", "polycarbonate-freezer-boxes", "stainless-steel-racks", "cryoboxes"] },
      { name: "Sample Storage Tubes", slug: "sample-storage-tubes", families: ["screw-cap-storage-tubes", "2d-barcoded-tubes", "matrix-style-storage-tubes", "cluster-tubes"] },
      { name: "Seals and Caps", slug: "seals-and-caps", families: ["screw-caps", "septum-caps", "cap-mats", "pierceable-seals"] },
      { name: "Cryopreservation Media", slug: "cryopreservation-media", families: ["dmso-freezing-media", "serum-free-freezing-media", "cell-recovery-media", "controlled-rate-freezing-containers"] },
      { name: "Cold Chain Supplies", slug: "cold-chain-supplies", families: ["insulated-shippers", "gel-packs", "temperature-indicators", "dry-ice-compatible-storage"] }
    ]
  },
  {
    name: "Automation Consumables",
    slug: "automation-consumables",
    headline: "Source robotic tips, automation plates, reservoirs, seals, barcoded consumables, and liquid-handler-ready reagent kits.",
    shortDescription: "Automation consumables organized by platform compatibility, SBS footprint, conductivity, barcode format, deck layout, and lot consistency.",
    buyerUseCases: ["liquid handler setup", "high-throughput screening", "automated extraction", "automated PCR", "sample tracking"],
    buyerSpecs: ["platform compatibility", "SBS footprint", "conductive/non-conductive", "sterile", "filtered", "automation deck format", "barcode format", "nested tip packaging", "lot consistency"],
    commonFormats: ["robotic tip", "automation plate", "automation reservoir", "pierceable seal", "barcoded tube", "automation-ready kit"],
    applications: ["automated liquid handling", "HTS", "automated extraction", "automation sample prep", "barcoded storage"],
    documentationNeeds: ["platform fit information", "sterility statement", "barcode specification", "CoA where available", "lot traceability"],
    relatedSegments: ["liquid-handling", "lab-plasticware", "molecular-biology-pcr", "storage-cryopreservation"],
    subcategories: [
      { name: "Robotic Pipette Tips", slug: "robotic-pipette-tips", families: ["hamilton-robotic-tips", "tecan-robotic-tips", "beckman-robotic-tips", "opentrons-compatible-tips", "conductive-filtered-tips"] },
      { name: "Automation Plates", slug: "automation-plates", families: ["96-well-automation-plates", "384-well-automation-plates", "deep-well-automation-plates", "pcr-automation-plates"] },
      { name: "Reservoirs for Automation", slug: "automation-reservoirs", families: ["single-well-reservoirs", "divided-reservoirs", "low-dead-volume-reservoirs", "sterile-automation-reservoirs"] },
      { name: "Seals for Automation", slug: "automation-seals", families: ["adhesive-automation-seals", "heat-sealable-films", "pierceable-seals", "optical-automation-seals"] },
      { name: "Barcoded Consumables", slug: "barcoded-consumables", families: ["barcoded-tubes", "barcoded-plates", "2d-coded-storage-tubes", "traceability-labels"] },
      { name: "Automation-Compatible Reagent Kits", slug: "automation-compatible-reagent-kits", families: ["magnetic-bead-extraction-kits", "high-throughput-pcr-kits", "automated-sample-cleanup-kits", "liquid-handler-ready-reagents"] }
    ]
  },
  {
    name: "Assays & Detection",
    slug: "assays-detection",
    headline: "Source ELISA, cell-based assay, fluorescence, luminescence, plate reader, stain, dye, and Western blot detection products.",
    shortDescription: "Assay and detection consumables organized by signal type, plate color, readout, sensitivity, surface treatment, and sample type.",
    buyerUseCases: ["ELISA", "cell-based assays", "plate reader workflows", "Western blot detection", "staining and labeling"],
    buyerSpecs: ["assay format", "plate color", "surface treatment", "reader compatibility", "signal type", "sensitivity", "sample type", "storage condition"],
    commonFormats: ["assay plate", "kit", "buffer", "substrate", "dye", "membrane"],
    applications: ["immunoassays", "viability testing", "cytotoxicity testing", "fluorescence detection", "chemiluminescent detection"],
    documentationNeeds: ["assay format information", "storage condition", "CoA where available", "sample type guidance", "lot traceability"],
    relatedSegments: ["proteins-antibodies-immunology", "cell-culture", "buffers-chemicals-reagents", "automation-consumables"],
    subcategories: [
      { name: "ELISA and Immunoassays", slug: "elisa-immunoassays", families: ["elisa-plates", "elisa-kits", "blocking-buffers", "wash-buffers"] },
      { name: "Cell-Based Assays", slug: "cell-based-assays", families: ["viability-assays", "cytotoxicity-assays", "apoptosis-assays", "proliferation-assays"] },
      { name: "Fluorescence and Luminescence", slug: "fluorescence-luminescence", families: ["fluorescence-assay-plates", "luminescence-assay-plates", "detection-reagents", "substrate-reagents"] },
      { name: "Plate Reader Consumables", slug: "plate-reader-consumables", families: ["black-assay-plates", "white-assay-plates", "clear-bottom-plates", "low-volume-assay-plates"] },
      { name: "Stains and Dyes", slug: "stains-and-dyes", families: ["dna-stains", "protein-stains", "cell-viability-dyes", "fluorescent-labeling-reagents"] },
      { name: "Western Blot Detection", slug: "western-blot-detection", families: ["western-blot-membranes", "chemiluminescent-substrates", "blocking-reagents", "transfer-buffers"] }
    ]
  },
  {
    name: "Proteins, Antibodies & Immunology",
    slug: "proteins-antibodies-immunology",
    headline: "Source antibodies, recombinant proteins, immunology reagents, protein analysis products, magnetic beads, and flow cytometry consumables.",
    shortDescription: "Protein and immunology products organized by target, host species, clonality, conjugation, activity, purity, and validation application.",
    buyerUseCases: ["antibody sourcing", "immunology workflows", "protein analysis", "pull-down assays", "flow cytometry"],
    buyerSpecs: ["host species", "clonality", "conjugation", "validation application", "endotoxin", "carrier-free", "tag", "expression system", "activity", "purity"],
    commonFormats: ["antibody", "protein", "bead", "reagent", "tube", "buffer"],
    applications: ["Western blot", "flow cytometry", "immunofluorescence", "pull-down", "immune cell assays"],
    documentationNeeds: ["target information", "species reactivity", "application information", "CoA where available", "activity or purity information"],
    relatedSegments: ["assays-detection", "buffers-chemicals-reagents", "cell-culture", "sample-prep-filtration"],
    subcategories: [
      { name: "Antibodies", slug: "antibodies", families: ["primary-antibodies", "secondary-antibodies", "flow-cytometry-antibodies", "immunofluorescence-antibodies"] },
      { name: "Recombinant Proteins", slug: "recombinant-proteins", families: ["cytokines", "growth-factors", "enzymes", "tagged-recombinant-proteins"] },
      { name: "Immunology Reagents", slug: "immunology-reagents", families: ["cytokine-reagents", "blocking-sera", "immune-cell-stimulation-reagents", "isotype-controls"] },
      { name: "Protein Analysis", slug: "protein-analysis", families: ["protein-standards", "protein-assay-reagents", "gel-electrophoresis-reagents", "transfer-reagents"] },
      { name: "Magnetic Beads and Pull-Down", slug: "magnetic-beads-pull-down", families: ["protein-a-g-beads", "streptavidin-beads", "nickel-nta-beads", "immunoprecipitation-kits"] },
      { name: "Flow Cytometry Consumables", slug: "flow-cytometry-consumables", families: ["facs-tubes", "cell-strainers", "staining-buffers", "compensation-beads"] }
    ]
  },
  {
    name: "Buffers, Chemicals & Reagents",
    slug: "buffers-chemicals-reagents",
    headline: "Source common buffers, salts, solvents, detergents, biochemical reagents, and ready-to-use workflow reagents.",
    shortDescription: "Buffers, chemicals, and reagents organized by grade, purity, concentration, sterility, storage condition, and documentation availability.",
    buyerUseCases: ["buffer preparation", "protein workflows", "cell culture support", "molecular biology", "analytical workflows"],
    buyerSpecs: ["grade", "purity", "concentration", "sterility", "endotoxin", "molecular biology grade", "cell culture grade", "packaging size", "storage condition", "CoA/SDS availability"],
    commonFormats: ["powder", "solution", "ready-to-use buffer", "solvent bottle", "bulk pack", "custom pack"],
    applications: ["buffer prep", "cell culture", "molecular biology", "protein analysis", "analytical chemistry"],
    documentationNeeds: ["CoA where available", "SDS", "grade and purity information", "storage condition", "lot traceability"],
    relatedSegments: ["molecular-biology-pcr", "proteins-antibodies-immunology", "cell-culture", "sample-prep-filtration"],
    subcategories: [
      { name: "Common Buffers", slug: "common-buffers", families: ["pbs", "tris-buffer", "hepes-buffer", "tbs", "citrate-buffer"] },
      { name: "Salts and Chemicals", slug: "salts-and-chemicals", families: ["sodium-chloride", "potassium-chloride", "magnesium-chloride", "edta"] },
      { name: "Solvents", slug: "solvents", families: ["ethanol", "methanol", "dmso", "acetonitrile", "water-for-lab-use"] },
      { name: "Detergents and Surfactants", slug: "detergents-surfactants", families: ["tween-20", "triton-x-100-alternatives", "sds", "chaps"] },
      { name: "Biochemical Reagents", slug: "biochemical-reagents", families: ["amino-acids", "nucleotides", "enzyme-substrates", "inhibitors"] },
      { name: "Ready-to-Use Reagents", slug: "ready-to-use-reagents", families: ["blocking-buffers", "wash-buffers", "lysis-buffers", "loading-buffers"] }
    ]
  },
  {
    name: "Small Lab Equipment",
    slug: "small-lab-equipment",
    headline: "Source benchtop instruments, temperature control tools, mixing equipment, liquid handling equipment, measurement tools, and accessories.",
    shortDescription: "Small lab equipment organized by capacity, footprint, voltage, compatible consumables, warranty, calibration, and maintenance needs.",
    buyerUseCases: ["bench setup", "sample mixing", "temperature control", "liquid handling", "routine measurement"],
    buyerSpecs: ["capacity", "footprint", "voltage", "certification", "compatible consumables", "warranty", "calibration", "maintenance"],
    commonFormats: ["benchtop unit", "block", "adapter", "rack", "replacement part", "measurement tool"],
    applications: ["sample preparation", "incubation", "mixing", "temperature control", "basic measurement"],
    documentationNeeds: ["specification sheet", "warranty information", "calibration information where applicable", "compatible consumables", "operating requirements"],
    relatedSegments: ["liquid-handling", "molecular-biology-pcr", "sample-prep-filtration", "lab-plasticware"],
    subcategories: [
      { name: "Benchtop Instruments", slug: "benchtop-instruments", families: ["mini-centrifuges", "vortex-mixers", "dry-bath-incubators", "heat-blocks"] },
      { name: "Temperature Control", slug: "temperature-control", families: ["water-baths", "dry-baths", "cooling-blocks", "tube-chillers"] },
      { name: "Mixing and Shaking", slug: "mixing-shaking", families: ["orbital-shakers", "plate-shakers", "rotators", "magnetic-stirrers"] },
      { name: "Liquid Handling Equipment", slug: "liquid-handling-equipment", families: ["manual-pipettes", "electronic-pipettes", "bottle-top-dispensers", "pipette-controllers"] },
      { name: "Measurement Tools", slug: "measurement-tools", families: ["ph-meters", "balances", "conductivity-meters", "timers"] },
      { name: "Equipment Accessories", slug: "equipment-accessories", families: ["tube-blocks", "adapters", "racks", "replacement-parts"] }
    ]
  },
  {
    name: "Early Bioprocess & Single-Use",
    slug: "early-bioprocess-single-use",
    headline: "Source single-use bags, tubing, connectors, filtration assemblies, sampling sets, and process development consumables.",
    shortDescription: "Early bioprocess consumables organized by sterility, tubing material, connector type, closed-system compatibility, and development scale.",
    buyerUseCases: ["process development", "single-use fluid transfer", "sterile sampling", "small-scale filtration", "scale-down models"],
    buyerSpecs: ["sterile", "gamma irradiated", "USP Class VI", "extractables/leachables", "tubing material", "connector type", "closed-system compatibility", "process development scale"],
    commonFormats: ["single-use bag", "tubing", "connector", "filter assembly", "sampling set", "process plate"],
    applications: ["early process development", "buffer and media handling", "sampling", "clarification", "small-scale bioprocess"],
    documentationNeeds: ["sterility statement", "material declaration", "USP Class VI information where available", "extractables/leachables information where relevant", "lot traceability"],
    relatedSegments: ["cell-culture", "sample-prep-filtration", "buffers-chemicals-reagents", "storage-cryopreservation"],
    subcategories: [
      { name: "Single-Use Bags", slug: "single-use-bags", families: ["media-bags", "buffer-bags", "storage-bags", "sampling-bags"] },
      { name: "Tubing and Connectors", slug: "tubing-connectors", families: ["silicone-tubing", "tpe-tubing", "aseptic-connectors", "luer-connectors"] },
      { name: "Filtration Assemblies", slug: "filtration-assemblies", families: ["sterile-filter-assemblies", "capsule-filters", "vent-filters", "depth-filter-units"] },
      { name: "Small-Scale Bioreactor Consumables", slug: "small-scale-bioreactor-consumables", families: ["shake-flask-consumables", "single-use-bioreactor-bags", "sampling-accessories", "feed-bottles"] },
      { name: "Sampling and Transfer", slug: "sampling-transfer", families: ["sterile-sampling-bags", "transfer-sets", "syringe-assemblies", "closed-system-sampling-kits"] },
      { name: "Process Development Consumables", slug: "process-development-consumables", families: ["high-throughput-process-plates", "clarification-consumables", "buffer-prep-consumables", "scale-down-model-consumables"] }
    ]
  }
];

export const productTaxonomy: ProductSegment[] = rawSegments.map((segment, index) => buildSegment(index + 1, segment));

export function getSegmentBySlug(slug: string) {
  return productTaxonomy.find((segment) => segment.slug === slug);
}

export function getTaxonomySegmentBySlug(slug: string) {
  return getSegmentBySlug(slug);
}

export function getSubcategoryBySlug(segmentSlug: string, subcategorySlug: string) {
  const segment = getSegmentBySlug(segmentSlug);
  const subcategory = segment?.subcategories.find((item) => item.slug === subcategorySlug);

  if (!segment || !subcategory) {
    return null;
  }

  return { segment, subcategory, category: subcategory };
}

export function getTaxonomyCategory(segmentSlug: string, subcategorySlug: string) {
  return getSubcategoryBySlug(segmentSlug, subcategorySlug);
}

export function getTaxonomySubcategory(segmentSlug: string, subcategorySlug: string) {
  return getSubcategoryBySlug(segmentSlug, subcategorySlug);
}

export function getFamilyBySlug(segmentSlug: string, subcategorySlug: string, familySlug: string) {
  const match = getSubcategoryBySlug(segmentSlug, subcategorySlug);
  const family = match?.subcategory.families.find((item) => item.slug === familySlug);

  if (!match || !family) {
    return null;
  }

  return { segment: match.segment, subcategory: match.subcategory, category: match.subcategory, family };
}

export function getTaxonomyFamily(segmentSlug: string, subcategorySlug: string, familySlug: string) {
  return getFamilyBySlug(segmentSlug, subcategorySlug, familySlug);
}

export function getAllSubcategoryPaths() {
  return productTaxonomy.flatMap((segment) =>
    segment.subcategories.map((subcategory) => ({
      segment: segment.slug,
      subcategory: subcategory.slug,
      category: subcategory.slug
    }))
  );
}

export function getAllCategoryPaths() {
  return getAllSubcategoryPaths();
}

export function getAllFamilyPaths() {
  return productTaxonomy.flatMap((segment) =>
    segment.subcategories.flatMap((subcategory) =>
      subcategory.families.map((family) => ({
        segment: segment.slug,
        subcategory: subcategory.slug,
        category: subcategory.slug,
        family: family.slug
      }))
    )
  );
}

export function getAllProductPaths() {
  return {
    segments: productTaxonomy.map((segment) => ({ segment: segment.slug })),
    subcategories: getAllSubcategoryPaths(),
    families: getAllFamilyPaths()
  };
}

export function buildRequestHref({
  segment,
  category,
  subcategory,
  family,
  product,
  inquiryType,
  requestType = inquiryType ?? "quote"
}: {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  product?: string;
  inquiryType?: string;
  requestType?: string;
}) {
  const params = new URLSearchParams();
  const resolvedSubcategory = subcategory ?? category;
  const hasProductContext = Boolean(segment || resolvedSubcategory || family || product);

  params.set("requestType", requestType);
  if (hasProductContext) {
    params.set("source", "product-page");
  }

  if (segment) {
    params.set("segment", segment);
  }

  if (resolvedSubcategory) {
    params.set("subcategory", resolvedSubcategory);
  }

  if (family) {
    params.set("family", family);
  }

  if (product) {
    params.set("product", product);
  }

  return `/request-quote?${params.toString()}`;
}

export function buildEquivalentFinderHref({
  segment,
  category,
  subcategory,
  family,
  product
}: {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  product?: string;
}) {
  const params = new URLSearchParams();
  const resolvedSubcategory = subcategory ?? category;
  const hasProductContext = Boolean(segment || resolvedSubcategory || family || product);

  params.set("requestType", "equivalent");
  if (hasProductContext) {
    params.set("source", "product-page");
  }

  if (segment) {
    params.set("segment", segment);
  }

  if (resolvedSubcategory) {
    params.set("subcategory", resolvedSubcategory);
  }

  if (family) {
    params.set("family", family);
  }

  if (product) {
    params.set("product", product);
  }

  return `/equivalent-finder?${params.toString()}`;
}

type ScoredProductSearchResult = ProductSearchResult & {
  score: number;
  order: number;
};

function scoreSearchText(text: string | string[] | undefined, normalizedQuery: string, weight: number) {
  const source = Array.isArray(text) ? text.join(" ") : text ?? "";
  const normalizedText = source.toLowerCase();

  if (!normalizedText.includes(normalizedQuery)) {
    return 0;
  }

  if (normalizedText === normalizedQuery) {
    return weight * 5;
  }

  if (normalizedText.startsWith(normalizedQuery)) {
    return weight * 4;
  }

  if (new RegExp(`(^|[^a-z0-9])${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(normalizedText)) {
    return weight * 3;
  }

  return weight;
}

function typeSortWeight(type: SearchResultType) {
  return type === "segment" ? 3 : type === "subcategory" ? 2 : 1;
}

function toProductSearchResult(result: ScoredProductSearchResult): ProductSearchResult {
  return {
    type: result.type,
    title: result.title,
    description: result.description,
    href: result.href,
    segmentTitle: result.segmentTitle,
    segmentSlug: result.segmentSlug,
    categoryTitle: result.categoryTitle,
    categorySlug: result.categorySlug,
    subcategoryTitle: result.subcategoryTitle,
    familyTitle: result.familyTitle,
    familySlug: result.familySlug
  };
}

export function getProductSearchResults(query: string): ProductSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const results: ScoredProductSearchResult[] = [];
  let order = 0;

  productTaxonomy.forEach((segment) => {
    const segmentScore =
      scoreSearchText(segment.name, normalizedQuery, 120) +
      scoreSearchText(segment.slug, normalizedQuery, 100) +
      scoreSearchText(segment.productFamilies, normalizedQuery, 72) +
      scoreSearchText([segment.headline, segment.shortDescription], normalizedQuery, 45) +
      scoreSearchText([...segment.buyerUseCases, ...segment.buyerSpecs, ...segment.applications, ...segment.formats], normalizedQuery, 12) +
      typeSortWeight("segment");

    if (segmentScore > typeSortWeight("segment")) {
      results.push({
        type: "segment",
        title: segment.name,
        description: segment.shortDescription,
        href: `/products/${segment.slug}`,
        segmentTitle: segment.name,
        segmentSlug: segment.slug,
        score: segmentScore,
        order: order++
      });
    }

    segment.subcategories.forEach((subcategory) => {
      const subcategoryPath = [segment.name, segment.slug, subcategory.name, subcategory.slug];
      const subcategoryScore =
        scoreSearchText(subcategory.name, normalizedQuery, 110) +
        scoreSearchText(subcategory.slug, normalizedQuery, 96) +
        scoreSearchText(subcategoryPath, normalizedQuery, 74) +
        scoreSearchText(subcategory.families.map((family) => family.name), normalizedQuery, 56) +
        scoreSearchText([subcategory.shortDescription, subcategory.longDescription], normalizedQuery, 34) +
        scoreSearchText([...subcategory.buyerSpecs, ...subcategory.commonFormats, ...subcategory.applications, ...subcategory.documentationNeeds], normalizedQuery, 10) +
        typeSortWeight("subcategory");

      if (subcategoryScore > typeSortWeight("subcategory")) {
        results.push({
          type: "subcategory",
          title: subcategory.name,
          description: subcategory.shortDescription,
          href: `/products/${segment.slug}/${subcategory.slug}`,
          segmentTitle: segment.name,
          segmentSlug: segment.slug,
          categoryTitle: subcategory.name,
          categorySlug: subcategory.slug,
          subcategoryTitle: subcategory.name,
          score: subcategoryScore,
          order: order++
        });
      }

      subcategory.families.forEach((family) => {
        const familyPath = [segment.name, segment.slug, subcategory.name, subcategory.slug, family.name, family.slug];
        const familyScore =
          scoreSearchText(family.name, normalizedQuery, 116) +
          scoreSearchText(family.slug, normalizedQuery, 102) +
          scoreSearchText(familyPath, normalizedQuery, 70) +
          scoreSearchText([family.shortDescription, family.longDescription], normalizedQuery, 32) +
          scoreSearchText([...family.buyerSpecs, ...family.commonFormats], normalizedQuery, 14) +
          scoreSearchText([...family.applications, ...family.documentationNeeds, ...family.equivalentMatchingInputs], normalizedQuery, 8) +
          typeSortWeight("family");

        if (familyScore > typeSortWeight("family")) {
          results.push({
            type: "family",
            title: family.name,
            description: family.shortDescription,
            href: `/products/${segment.slug}/${subcategory.slug}/${family.slug}`,
            segmentTitle: segment.name,
            segmentSlug: segment.slug,
            categoryTitle: subcategory.name,
            categorySlug: subcategory.slug,
            subcategoryTitle: subcategory.name,
            familyTitle: family.name,
            familySlug: family.slug,
            score: familyScore,
            order: order++
          });
        }
      });
    });
  });

  return results
    .sort((a, b) => b.score - a.score || typeSortWeight(b.type) - typeSortWeight(a.type) || a.order - b.order)
    .slice(0, 42)
    .map(toProductSearchResult);
}

export function getAllProductHrefs() {
  return [
    "/products",
    ...productTaxonomy.flatMap((segment) => [
      `/products/${segment.slug}`,
      ...segment.subcategories.flatMap((subcategory) => [
        `/products/${segment.slug}/${subcategory.slug}`,
        ...subcategory.families.map((family) => `/products/${segment.slug}/${subcategory.slug}/${family.slug}`)
      ])
    ])
  ];
}

export function labelFromProductContext({
  segment,
  subcategory,
  family
}: {
  segment?: string;
  subcategory?: string;
  family?: string;
}) {
  const segmentMatch = segment ? getSegmentBySlug(segment) : undefined;
  const subcategoryMatch = segment && subcategory ? getSubcategoryBySlug(segment, subcategory)?.subcategory : undefined;
  const familyMatch = segment && subcategory && family ? getFamilyBySlug(segment, subcategory, family)?.family : undefined;

  return {
    segmentName: segmentMatch?.name ?? "",
    subcategoryName: subcategoryMatch?.name ?? "",
    familyName: familyMatch?.name ?? ""
  };
}

export function getSegmentSummaries() {
  return productTaxonomy.map((segment) => ({
    slug: segment.slug,
    name: segment.name,
    subcategoryCount: segment.subcategories.length,
    familyCount: segment.subcategories.reduce((count, subcategory) => count + subcategory.families.length, 0)
  }));
}
