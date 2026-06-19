import {
  getFamilyBySlug,
  productTaxonomy,
  type ProductCategory,
  type ProductFamily,
  type ProductItem,
  type ProductRequestType,
  type ProductTaxonomySegment
} from "@/data/productTaxonomy";

type ProductItemContext = {
  segment: ProductTaxonomySegment;
  subcategory: ProductCategory;
  family: ProductFamily;
};

type ProductProfile = {
  details: string[];
  commonSpecifications: string[];
  applications: string[];
  compatibilityConsiderations: string[];
  documentationNeeds: string[];
  equivalentMatchingInputs: string[];
  sampleEvaluationNotes: string[];
};

type ConfiguredProductItem = {
  slug: string;
  name: string;
  shortDescription: string;
  introduction?: string;
  details?: string[];
  commonSpecifications?: string[];
  applications?: string[];
  compatibilityConsiderations?: string[];
  documentationNeeds?: string[];
  equivalentMatchingInputs?: string[];
  sampleEvaluationNotes?: string[];
};

const allRequestTypes: ProductRequestType[] = ["quote", "equivalent", "sample", "documentation"];

function routeKey(segmentSlug: string, subcategorySlug: string, familySlug: string) {
  return `${segmentSlug}/${subcategorySlug}/${familySlug}`;
}

function compactList(items: Array<string | undefined>) {
  return items.filter((item): item is string => Boolean(item && item.trim()));
}

function baseProfile(context: ProductItemContext): ProductProfile {
  return {
    details: [
      `Reviewed as part of ${context.family.name} sourcing within ${context.subcategory.name}.`,
      "Useful when buyers need a structured request that includes specifications, documentation, quantity, and evaluation needs.",
      "Equivalent review should compare the current product, critical dimensions or format, application fit, and documentation requirements."
    ],
    commonSpecifications: compactList([
      `product family: ${context.family.name}`,
      `category: ${context.subcategory.name}`,
      ...context.family.keySpecifications.slice(0, 4),
      ...context.family.representativeFormats.slice(0, 2)
    ]).slice(0, 7),
    applications: context.family.commonUseCases.slice(0, 5),
    compatibilityConsiderations: [
      "current product format and workflow fit",
      "material, sterility, and packaging constraints",
      "instrument, vessel, plate, rack, or storage compatibility where relevant",
      "sample type, assay sensitivity, or process impact",
      "customer validation requirements before switching"
    ],
    documentationNeeds: context.family.documentationChecklist.slice(0, 5),
    equivalentMatchingInputs: context.family.equivalentMatchingInputs.slice(0, 6),
    sampleEvaluationNotes: [
      "request enough material to test the critical workflow step",
      "compare fit, handling, storage, or assay behavior against the current product",
      "confirm packaging, labeling, and documentation expectations",
      "record any application-specific acceptance criteria before recurring purchase"
    ]
  };
}

function productProfileFor(context: ProductItemContext): ProductProfile {
  const searchText = [context.segment.slug, context.subcategory.slug, context.family.slug].join(" ");

  if (searchText.includes("pipette-tip") || searchText.includes("pipette-tips")) {
    return {
      details: [
        "Used for manual, multichannel, or automated liquid transfers where volume range, fit, and packaging format matter.",
        "Often specified by nominal volume, filter barrier, sterility, low-retention surface, and racked, reload, or bulk packaging.",
        "Equivalent review should include pipette brand or platform, rack footprint, cleanliness requirements, and sample testing needs."
      ],
      commonSpecifications: [
        "volume range",
        "filtered or non-filtered barrier",
        "sterile or non-sterile format",
        "standard or low-retention surface",
        "DNase/RNase-free or PCR-clean requirement",
        "racked, reload, nested rack, or bulk packaging",
        "manual pipette or robotic platform compatibility"
      ],
      applications: ["PCR and qPCR setup", "molecular biology sample prep", "cell culture support", "assay setup", "automated liquid handling"],
      compatibilityConsiderations: ["pipette or platform fit", "multichannel spacing", "rack footprint", "deck position or nested rack format", "retention behavior and sample type"],
      documentationNeeds: ["CoA where available", "sterility statement", "DNase/RNase-free statement", "material declaration", "lot traceability"],
      equivalentMatchingInputs: ["current supplier and catalog number", "pipette or liquid handler model", "volume range", "filtered and sterile requirements", "rack, reload, or bulk format", "documentation requirements"],
      sampleEvaluationNotes: ["test tip fit on current pipettes or decks", "compare aspiration and dispensing behavior", "check rack compatibility", "confirm contamination-control needs"]
    };
  }

  if (searchText.includes("lab-plasticware") || searchText.includes("tube") || searchText.includes("plate") || searchText.includes("bottle") || searchText.includes("rack") || searchText.includes("seal")) {
    return {
      details: [
        "Used for sample handling, assay setup, storage, sealing, or routine bench workflows.",
        "Often specified by material, capacity, footprint, sterility, centrifuge rating, surface treatment, and packaging format.",
        "Equivalent review should include workflow fit, instrument or storage compatibility, and documentation needs."
      ],
      commonSpecifications: ["material such as polypropylene, polystyrene, or polycarbonate", "capacity, well count, or tube format", "sterile or non-sterile format", "centrifuge rating, SBS footprint, or storage fit where relevant", "surface treatment or low-bind option where relevant", "packaging format"],
      applications: ["sample handling", "assay preparation", "reagent storage", "freezer organization", "routine bench workflows"],
      compatibilityConsiderations: ["centrifuge, freezer, plate reader, or automation fit", "cap, seal, rack, or holder compatibility", "sample volume and material requirements", "sterility and packaging constraints", "workflow validation before switching"],
      documentationNeeds: ["material declaration", "sterility statement where applicable", "lot traceability", "CoA where available", "SDS where applicable"],
      equivalentMatchingInputs: ["current supplier and catalog number", "material", "capacity or footprint", "sterility", "cap, rack, or seal fit", "documentation requirements"],
      sampleEvaluationNotes: ["check physical fit in current workflow", "confirm cap, seal, rack, or instrument compatibility", "compare handling and storage behavior", "review documentation before recurring use"]
    };
  }

  if (searchText.includes("pcr") || searchText.includes("qpcr")) {
    return {
      details: [
        "Used in PCR, qPCR, RT-PCR, and molecular biology workflows where well geometry, optical properties, and sealing fit can affect results.",
        "Often specified by well count, skirt style, profile height, optical clarity, and thermal cycler or qPCR instrument compatibility.",
        "Equivalent review should include instrument model, seal format, evaporation sensitivity, and cleanliness requirements."
      ],
      commonSpecifications: ["96-well, 384-well, strip, tube, film, or reagent format", "skirted, semi-skirted, or non-skirted profile", "optical clarity where applicable", "PCR-clean or DNase/RNase-free requirement", "sealing compatibility", "thermal cycler or qPCR system fit"],
      applications: ["PCR", "qPCR", "RT-PCR", "genotyping", "molecular biology assay setup"],
      compatibilityConsiderations: ["instrument block fit", "seal adhesion or heat-seal compatibility", "optical readout requirements", "sample volume and evaporation profile", "automation or manual handling format"],
      documentationNeeds: ["DNase/RNase-free statement", "PCR-clean statement where available", "CoA where available", "lot traceability", "storage condition"],
      equivalentMatchingInputs: ["current supplier and catalog number", "instrument model", "plate or tube profile", "seal format", "optical or low-evaporation requirement", "documentation requirement"],
      sampleEvaluationNotes: ["test plate or tube fit in the instrument", "confirm seal performance", "compare amplification behavior", "check optical readout consistency"]
    };
  }

  if (searchText.includes("assay") || searchText.includes("elisa") || searchText.includes("detection") || searchText.includes("luminescence") || searchText.includes("fluorescence") || searchText.includes("western")) {
    return {
      details: [
        "Used for plate-based, immunoassay, fluorescence, luminescence, staining, or detection workflows.",
        "Often specified by assay format, plate color, surface treatment, signal type, reader compatibility, sample type, and storage condition.",
        "Equivalent review should include readout method, plate or reagent format, assay sensitivity, and documentation requirements."
      ],
      commonSpecifications: ["assay or detection format", "plate color, surface treatment, or membrane type where applicable", "signal type such as absorbance, fluorescence, or luminescence", "reader or instrument compatibility", "sample type", "storage condition"],
      applications: ["ELISA", "cell-based assays", "plate reader workflows", "Western blot detection", "staining and labeling"],
      compatibilityConsiderations: ["reader or imaging system fit", "signal and background sensitivity", "sample type and assay protocol", "surface treatment or membrane compatibility", "storage and handling needs"],
      documentationNeeds: ["assay format information", "storage condition", "CoA where available", "sample type guidance", "lot traceability"],
      equivalentMatchingInputs: ["current supplier and catalog number", "assay format", "signal type", "plate or reagent format", "sample type", "documentation requirements"],
      sampleEvaluationNotes: ["compare signal and background", "check reader compatibility", "run a limited assay-side review", "document acceptance criteria before switching"]
    };
  }

  if (searchText.includes("filter") || searchText.includes("filtration") || searchText.includes("membrane") || searchText.includes("concentrator")) {
    return {
      details: [
        "Used for clarification, sterile filtration, concentration, cleanup, or sample preparation workflows.",
        "Often specified by membrane material, pore size, device diameter or capacity, sterile status, binding behavior, and sample compatibility.",
        "Equivalent review should include sample type, solvent or buffer conditions, throughput, and documentation needs."
      ],
      commonSpecifications: ["membrane material", "pore size or molecular weight cutoff", "device diameter, capacity, or hold-up volume", "sterile or non-sterile format", "aqueous, solvent, or protein compatibility", "low protein binding where required"],
      applications: ["sample clarification", "sterile filtration", "analytical sample prep", "protein concentration", "cell suspension preparation"],
      compatibilityConsiderations: ["sample volume", "chemical compatibility", "protein binding sensitivity", "flow rate expectations", "container, syringe, or centrifuge fit"],
      documentationNeeds: ["membrane material information", "sterility statement", "CoA where available", "chemical compatibility guidance", "extractables/leachables information where relevant"],
      equivalentMatchingInputs: ["current supplier and catalog number", "membrane material", "pore size or MWCO", "diameter or capacity", "sterile status", "sample matrix and documentation requirements"],
      sampleEvaluationNotes: ["compare flow rate and recovery", "check hold-up volume", "evaluate binding or analyte loss", "confirm sample clarity and sterility requirements"]
    };
  }

  if (searchText.includes("single-use") || searchText.includes("bioprocess") || searchText.includes("tubing") || searchText.includes("connector") || searchText.includes("assembly") || searchText.includes("bag")) {
    return {
      details: [
        "Used for process development, sterile fluid handling, sampling, clarification, or small-scale bioprocess workflows.",
        "Often specified by material, sterility or irradiation status, connector type, closed-system fit, scale, and extractables/leachables documentation needs.",
        "Equivalent review should include process contact materials, connection strategy, volume, and documentation requirements."
      ],
      commonSpecifications: ["sterile or gamma-irradiated format where required", "material and process contact surface", "connector or tubing type", "closed-system compatibility", "scale or working volume", "extractables/leachables documentation where relevant"],
      applications: ["early process development", "buffer and media handling", "sterile sampling", "clarification", "small-scale bioprocess"],
      compatibilityConsiderations: ["fluid path material", "connector strategy", "sterile transfer workflow", "process scale", "documentation and validation expectations"],
      documentationNeeds: ["sterility statement", "material declaration", "USP Class VI information where available", "extractables/leachables information where relevant", "lot traceability"],
      equivalentMatchingInputs: ["current supplier and catalog number", "material", "connector type", "working volume", "sterility or irradiation requirement", "documentation requirements"],
      sampleEvaluationNotes: ["check connector fit", "review material contact requirements", "test handling in the intended workflow", "confirm documentation before recurring use"]
    };
  }

  if (searchText.includes("media") || searchText.includes("sera") || searchText.includes("culture") || searchText.includes("dissociation") || searchText.includes("coating")) {
    return {
      details: [
        "Used for cell growth, passaging, attachment, freezing, recovery, or culture support workflows.",
        "Often specified by cell type, formulation, serum-free or xeno-free status, supplement requirements, storage condition, and lot consistency.",
        "Equivalent review should include the current formulation, cell model, documentation needs, and sample evaluation plan."
      ],
      commonSpecifications: ["cell type or model", "serum-free, xeno-free, animal-origin-free, or classical format", "sterile liquid, frozen, or ready-to-use format", "supplement or coating requirements", "storage condition", "lot consistency and documentation needs"],
      applications: ["cell expansion", "passaging", "media preparation", "cryopreservation", "cell attachment"],
      compatibilityConsiderations: ["cell line or primary-cell fit", "serum and supplement strategy", "storage and handling conditions", "lot-to-lot sensitivity", "sample testing before switching"],
      documentationNeeds: ["CoA where available", "sterility statement", "mycoplasma information where available", "endotoxin information", "origin and treatment documentation"],
      equivalentMatchingInputs: ["current supplier and catalog number", "cell type", "serum-free or xeno-free requirement", "supplement needs", "storage condition", "sample evaluation criteria"],
      sampleEvaluationNotes: ["compare cell morphology and growth behavior", "check passaging or recovery performance", "review lot documentation", "evaluate with a defined acceptance window"]
    };
  }

  if (searchText.includes("cryo") || searchText.includes("freezer") || searchText.includes("storage") || searchText.includes("barcoded") || searchText.includes("cold-chain")) {
    return {
      details: [
        "Used for traceable sample storage, cryopreservation, freezer organization, and cold-chain support.",
        "Often specified by volume, thread style, barcode format, storage temperature, sterility, and leak-resistance expectations.",
        "Equivalent review should include freezer or rack format, storage conditions, labeling workflow, and traceability needs."
      ],
      commonSpecifications: ["volume or capacity", "internal or external thread where applicable", "sterile or non-sterile format", "vapor-phase liquid nitrogen or freezer compatibility where required", "barcode or labeling format", "rack or box footprint"],
      applications: ["sample storage", "cell banking", "freezer inventory", "cryopreservation", "cold shipment"],
      compatibilityConsiderations: ["rack and freezer footprint", "thread and cap style", "barcode scanner or inventory workflow", "temperature range", "sample traceability"],
      documentationNeeds: ["sterility statement", "material declaration", "temperature range information", "barcode specification", "lot traceability"],
      equivalentMatchingInputs: ["current supplier and catalog number", "volume", "thread style", "barcode requirement", "storage temperature", "rack and documentation requirements"],
      sampleEvaluationNotes: ["check cap closure and labeling workflow", "confirm rack or box fit", "test scan readability where relevant", "review storage-condition requirements"]
    };
  }

  if (searchText.includes("antibod") || searchText.includes("protein") || searchText.includes("cytokine") || searchText.includes("bead") || searchText.includes("flow-cytometry")) {
    return {
      details: [
        "Used for immunology, protein analysis, flow cytometry, pull-down, staining, or assay workflows.",
        "Often specified by target, host species, clonality, conjugation, application validation, purity, activity, and storage condition.",
        "Equivalent review should focus on intended use and documentation rather than product title alone."
      ],
      commonSpecifications: ["target or analyte", "host species and clonality", "conjugation or tag", "validated application", "purity, activity, or carrier-free status where relevant", "storage condition"],
      applications: ["Western blot", "flow cytometry", "immunofluorescence", "pull-down", "immune cell assays"],
      compatibilityConsiderations: ["target and species reactivity", "sample type", "assay format", "secondary reagent or instrument fit", "storage and handling sensitivity"],
      documentationNeeds: ["target information", "species reactivity", "application information", "CoA where available", "activity or purity information"],
      equivalentMatchingInputs: ["current supplier and catalog number", "target", "host and clonality", "conjugation", "application", "validation and documentation requirements"],
      sampleEvaluationNotes: ["run a side-by-side application check", "confirm signal and background", "review storage and dilution behavior", "document acceptance criteria before switching"]
    };
  }

  if (searchText.includes("buffer") || searchText.includes("chemical") || searchText.includes("solvent") || searchText.includes("reagent") || searchText.includes("salt")) {
    return {
      details: [
        "Used for buffer preparation, molecular biology, protein work, cell culture support, analytical workflows, or assay setup.",
        "Often specified by grade, purity, concentration, pH, sterility, storage condition, and COA or SDS needs.",
        "Equivalent review should include application grade and documentation requirements before sourcing."
      ],
      commonSpecifications: ["grade or purity", "concentration or pH", "sterile or non-sterile format", "molecular biology, cell culture, or analytical use", "storage condition", "COA and SDS availability"],
      applications: ["buffer preparation", "cell culture support", "molecular biology", "protein analysis", "analytical chemistry"],
      compatibilityConsiderations: ["application grade", "concentration and pH", "container and pack size", "storage and stability", "documentation requirements"],
      documentationNeeds: ["CoA where available", "SDS", "grade and purity information", "storage condition", "lot traceability"],
      equivalentMatchingInputs: ["current supplier and catalog number", "grade", "concentration or pH", "pack size", "application", "COA/SDS requirement"],
      sampleEvaluationNotes: ["confirm formulation or grade", "check storage and handling fit", "review COA/SDS details", "test in the intended workflow if switching affects results"]
    };
  }

  if (searchText.includes("equipment") || searchText.includes("centrifuge") || searchText.includes("mixer") || searchText.includes("bath") || searchText.includes("meter") || searchText.includes("balance")) {
    return {
      details: [
        "Used for benchtop setup, sample preparation, temperature control, mixing, measurement, or routine workflow support.",
        "Often specified by capacity, footprint, voltage, compatible consumables, maintenance, warranty, and calibration needs.",
        "Equivalent review should include the intended workflow, space constraints, accessories, and service expectations."
      ],
      commonSpecifications: ["capacity", "footprint", "voltage", "compatible consumables or adapters", "calibration need where applicable", "warranty and maintenance information"],
      applications: ["sample preparation", "incubation", "mixing", "temperature control", "basic measurement"],
      compatibilityConsiderations: ["bench space and power", "tube, plate, block, or accessory fit", "maintenance and calibration requirements", "workflow throughput", "operating environment"],
      documentationNeeds: ["specification sheet", "warranty information", "calibration information where applicable", "compatible consumables", "operating requirements"],
      equivalentMatchingInputs: ["current model", "capacity", "power requirement", "compatible consumables", "accessory needs", "service or calibration expectations"],
      sampleEvaluationNotes: ["confirm footprint and accessory fit", "review operating requirements", "test with intended consumables where possible", "confirm maintenance expectations"]
    };
  }

  return baseProfile(context);
}

function buildIntroduction(name: string, context: ProductItemContext) {
  return `BioAxis reviews ${name.toLowerCase()} as part of ${context.family.name.toLowerCase()} sourcing for ${context.subcategory.name.toLowerCase()} and ${context.segment.name.toLowerCase()} workflows. BioAxis uses application, specification, compatibility, documentation, quantity, and sample-evaluation context to prepare quote, equivalent, sample, or documentation requests.`;
}

function buildGeneralProductItem(context: ProductItemContext): ProductItem {
  const name = `${context.family.name} General Configuration`;
  const profile = productProfileFor(context);

  return {
    slug: `${context.family.slug}-general`,
    name,
    shortDescription: `General sourcing configuration for ${context.family.name.toLowerCase()} with buyer specifications, documentation needs, and evaluation criteria.`,
    introduction: buildIntroduction(name, context),
    details: profile.details,
    commonSpecifications: profile.commonSpecifications,
    applications: profile.applications,
    compatibilityConsiderations: profile.compatibilityConsiderations,
    documentationNeeds: profile.documentationNeeds,
    equivalentMatchingInputs: profile.equivalentMatchingInputs,
    sampleEvaluationNotes: profile.sampleEvaluationNotes,
    relatedRequestTypes: allRequestTypes
  };
}

function buildConfiguredProductItem(context: ProductItemContext, item: ConfiguredProductItem): ProductItem {
  const profile = productProfileFor(context);

  return {
    slug: item.slug,
    name: item.name,
    shortDescription: item.shortDescription,
    introduction: item.introduction ?? buildIntroduction(item.name, context),
    details: item.details ?? profile.details,
    commonSpecifications: item.commonSpecifications ?? profile.commonSpecifications,
    applications: item.applications ?? profile.applications,
    compatibilityConsiderations: item.compatibilityConsiderations ?? profile.compatibilityConsiderations,
    documentationNeeds: item.documentationNeeds ?? profile.documentationNeeds,
    equivalentMatchingInputs: item.equivalentMatchingInputs ?? profile.equivalentMatchingInputs,
    sampleEvaluationNotes: item.sampleEvaluationNotes ?? profile.sampleEvaluationNotes,
    relatedRequestTypes: allRequestTypes
  };
}

const configuredProductItems: Record<string, ConfiguredProductItem[]> = {
  [routeKey("liquid-handling", "pipette-tips", "universal-pipette-tips")]: [
    {
      slug: "universal-200ul-pipette-tips",
      name: "Universal 200 uL Pipette Tips",
      shortDescription: "General-fit 200 uL pipette tips for routine manual and multichannel liquid handling.",
      commonSpecifications: ["nominal volume: 200 uL", "fit: universal/manual pipette review", "sterility: sterile or non-sterile", "cleanliness: DNase/RNase-free where required", "packaging: racked, reload, or bulk", "surface: standard or low-retention option"]
    }
  ],
  [routeKey("liquid-handling", "pipette-tips", "filtered-pipette-tips")]: [
    {
      slug: "filtered-200ul-pipette-tips",
      name: "Filtered 200 uL Pipette Tips",
      shortDescription: "Aerosol-barrier 200 uL pipette tips for contamination-sensitive liquid handling workflows.",
      details: [
        "Used for mid-volume transfers in manual and multichannel workflows.",
        "Often specified by volume range, filter barrier, sterile status, and rack format.",
        "Equivalent review should include current pipette fit, packaging format, cleanliness requirements, and documentation needs."
      ],
      commonSpecifications: ["nominal volume: 200 uL", "filter barrier: filtered or aerosol barrier", "sterility: sterile or non-sterile", "cleanliness: DNase/RNase-free or PCR-clean where required", "packaging: racked, reload, or bulk", "surface: standard or low-retention"],
      applications: ["PCR and qPCR setup", "molecular biology sample prep", "contamination-sensitive liquid handling", "cell culture support", "assay setup"]
    }
  ],
  [routeKey("liquid-handling", "pipette-tips", "low-retention-pipette-tips")]: [
    {
      slug: "low-retention-200ul-pipette-tips",
      name: "Low Retention 200 uL Pipette Tips",
      shortDescription: "Low-retention 200 uL tips for viscous, protein-containing, or low-volume-sensitive transfers.",
      commonSpecifications: ["nominal volume: 200 uL", "surface: low-retention", "filter option: filtered or non-filtered", "sterility: sterile or non-sterile", "packaging: racked or reload", "cleanliness: molecular biology grade where required"],
      applications: ["protein sample handling", "PCR/qPCR setup", "assay reagent transfer", "low-volume liquid handling", "viscous sample transfer"]
    }
  ],
  [routeKey("liquid-handling", "pipette-tips", "sterile-pipette-tips")]: [
    {
      slug: "sterile-1000ul-pipette-tips",
      name: "Sterile 1000 uL Pipette Tips",
      shortDescription: "Sterile high-volume pipette tips for cell culture, reagent transfer, and sample preparation workflows.",
      commonSpecifications: ["nominal volume: 1000 uL", "sterility: sterile", "filter option: filtered or non-filtered", "packaging: racked or reload", "cleanliness: DNase/RNase-free where required", "fit: manual pipette compatibility review"],
      applications: ["cell culture support", "buffer and reagent transfer", "sample preparation", "sterile workflow support", "assay setup"]
    }
  ],
  [routeKey("liquid-handling", "pipette-tips", "reload-and-bulk-pipette-tips")]: [
    {
      slug: "reload-pipette-tip-system",
      name: "Reload Pipette Tip System",
      shortDescription: "Reload-style pipette tip packaging for labs comparing rack reuse, waste reduction, and recurring supply needs.",
      commonSpecifications: ["format: reload or stack system", "volume range", "sterile or non-sterile option", "filtered or non-filtered option", "compatible rack footprint", "lot and packaging consistency"],
      applications: ["routine pipetting", "high-usage liquid handling", "lab waste reduction programs", "recurring procurement planning", "assay setup"]
    }
  ],

  [routeKey("automation-consumables", "robotic-pipette-tips", "hamilton-robotic-tips")]: [
    {
      slug: "hamilton-compatible-robotic-tips",
      name: "Hamilton-Compatible Robotic Tips",
      shortDescription: "Robotic pipette tips for Hamilton-style liquid handling workflows that need platform-fit review.",
      commonSpecifications: ["platform review: Hamilton-style deck", "conductive or non-conductive option", "filtered or non-filtered option", "sterile or non-sterile option", "nested rack or SBS footprint", "lot consistency"],
      applications: ["automated liquid handling", "high-throughput screening", "automated PCR setup", "automated extraction", "assay setup"]
    }
  ],
  [routeKey("automation-consumables", "robotic-pipette-tips", "tecan-robotic-tips")]: [
    {
      slug: "tecan-compatible-robotic-tips",
      name: "Tecan-Compatible Robotic Tips",
      shortDescription: "Robotic pipette tips for Tecan-style workflows where deck fit, conductivity, and rack format must be reviewed.",
      commonSpecifications: ["platform review: Tecan-style deck", "conductive or non-conductive option", "filtered or non-filtered option", "rack or nested rack format", "sterile option where required", "SBS footprint"],
      applications: ["automated liquid handling", "plate-based assays", "sample prep automation", "automated extraction", "qPCR setup"]
    }
  ],
  [routeKey("automation-consumables", "robotic-pipette-tips", "conductive-filtered-tips")]: [
    {
      slug: "conductive-filtered-robotic-tips",
      name: "Conductive Filtered Robotic Tips",
      shortDescription: "Conductive filtered robotic tips for liquid-level sensing and contamination-sensitive automated workflows.",
      commonSpecifications: ["format: conductive robotic tip", "filter barrier: filtered", "sterility: sterile or non-sterile", "rack format: SBS or nested rack", "platform compatibility review", "lot consistency and documentation"],
      applications: ["liquid-level sensing workflows", "automated assay setup", "automated sample prep", "molecular biology automation", "cell culture support"]
    }
  ],

  [routeKey("cell-culture", "media-and-supplements", "serum-free-media")]: [
    {
      slug: "serum-free-cell-culture-media",
      name: "Serum-Free Cell Culture Media",
      shortDescription: "Serum-free media sourcing support for cell culture workflows that require formulation and documentation review.",
      commonSpecifications: ["format: sterile liquid media", "serum status: serum-free", "cell type or platform", "supplement requirements", "storage condition", "mycoplasma and endotoxin information where available"],
      applications: ["cell expansion", "serum-reduced or serum-free culture", "primary cell workflows", "stem cell support", "media switching evaluation"]
    }
  ],
  [routeKey("cell-culture", "media-and-supplements", "basal-media")]: [
    {
      slug: "basal-cell-culture-media",
      name: "Basal Cell Culture Media",
      shortDescription: "Basal media configurations for buyers comparing formulation, supplement strategy, and documentation needs.",
      commonSpecifications: ["format: sterile liquid media", "base formulation", "with or without L-glutamine or phenol red where relevant", "supplement compatibility", "storage condition", "lot documentation"],
      applications: ["routine culture", "media preparation", "cell expansion", "assay support", "formulation comparison"]
    }
  ],
  [routeKey("cell-culture", "media-and-supplements", "cell-culture-supplements")]: [
    {
      slug: "cell-culture-supplements",
      name: "Cell Culture Supplements",
      shortDescription: "Supplement sourcing support for growth factors, additives, and media components used in cell culture workflows.",
      commonSpecifications: ["supplement type", "concentration or format", "sterile status", "cell type or formulation fit", "storage condition", "origin and documentation needs"],
      applications: ["media supplementation", "cell expansion", "primary cell workflows", "stem cell support", "assay preparation"]
    }
  ],

  [routeKey("molecular-biology-pcr", "pcr-plastics", "96-well-pcr-plates")]: [
    {
      slug: "96-well-pcr-plates",
      name: "96-Well PCR Plates",
      shortDescription: "96-well PCR plates for thermal cycling workflows that require profile, seal, and instrument-fit review.",
      commonSpecifications: ["format: 96-well PCR plate", "profile: full, semi-skirted, or non-skirted", "well volume and profile height", "PCR-clean or DNase/RNase-free requirement", "sealing compatibility", "thermal cycler compatibility"],
      applications: ["PCR", "RT-PCR", "genotyping", "sample amplification", "molecular biology assay setup"]
    }
  ],
  [routeKey("molecular-biology-pcr", "pcr-plastics", "384-well-pcr-plates")]: [
    {
      slug: "384-well-pcr-plates",
      name: "384-Well PCR Plates",
      shortDescription: "384-well PCR plate configurations for higher-throughput amplification workflows.",
      commonSpecifications: ["format: 384-well PCR plate", "skirt style and profile height", "optical or standard format", "low evaporation and seal fit", "PCR-clean requirement", "instrument compatibility"],
      applications: ["high-throughput PCR", "qPCR setup", "genotyping", "automation workflows", "molecular screening"]
    }
  ],
  [routeKey("molecular-biology-pcr", "pcr-plastics", "optical-pcr-seals")]: [
    {
      slug: "optical-pcr-sealing-films",
      name: "Optical PCR Sealing Films",
      shortDescription: "Optical sealing films for PCR and qPCR plates where clarity, adhesion, and instrument readout matter.",
      commonSpecifications: ["format: optical adhesive film", "plate compatibility", "qPCR optical clarity", "seal temperature range", "low evaporation performance", "automation or manual handling fit"],
      applications: ["qPCR", "PCR plate sealing", "optical plate reader workflows", "thermal cycling", "sample protection"]
    }
  ],
  [routeKey("molecular-biology-pcr", "pcr-qpcr-reagents", "qpcr-master-mixes")]: [
    {
      slug: "qpcr-master-mix-general",
      name: "qPCR Master Mix General Configuration",
      shortDescription: "General qPCR master mix sourcing profile for assay setup, storage, and instrument compatibility review.",
      commonSpecifications: ["chemistry or detection format", "probe or dye compatibility", "storage condition", "reaction volume", "instrument compatibility", "template type"],
      applications: ["qPCR", "RT-qPCR", "gene expression workflows", "genotyping", "molecular assay setup"]
    }
  ],

  [routeKey("sample-prep-filtration", "syringe-filters", "pes-syringe-filters")]: [
    {
      slug: "pes-022um-syringe-filters",
      name: "PES 0.22 um Syringe Filters",
      shortDescription: "PES 0.22 um syringe filters for aqueous sample prep and sterile filtration review.",
      commonSpecifications: ["membrane: PES", "pore size: 0.22 um", "diameter: application-dependent", "sterility: sterile or non-sterile", "binding profile: low protein binding where required", "housing and syringe compatibility"],
      applications: ["sterile filtration", "cell culture media filtration", "aqueous sample clarification", "protein-containing sample prep", "assay reagent filtration"]
    }
  ],
  [routeKey("sample-prep-filtration", "syringe-filters", "pvdf-syringe-filters")]: [
    {
      slug: "pvdf-045um-syringe-filters",
      name: "PVDF 0.45 um Syringe Filters",
      shortDescription: "PVDF 0.45 um syringe filter configurations for clarification and compatibility-sensitive sample prep.",
      commonSpecifications: ["membrane: PVDF", "pore size: 0.45 um", "diameter: application-dependent", "sterility: sterile or non-sterile", "aqueous or solvent compatibility review", "protein binding considerations"],
      applications: ["sample clarification", "analytical prep", "protein sample handling", "buffer filtration", "assay reagent prep"]
    }
  ],
  [routeKey("sample-prep-filtration", "bottle-top-vacuum-filtration", "bottle-top-filters")]: [
    {
      slug: "sterile-bottle-top-filters",
      name: "Sterile Bottle-Top Filters",
      shortDescription: "Sterile bottle-top filtration units for larger-volume aqueous or media filtration workflows.",
      commonSpecifications: ["format: bottle-top filter", "sterility: sterile", "membrane material", "pore size", "receiver bottle compatibility", "volume capacity"],
      applications: ["cell culture media filtration", "buffer filtration", "sterile aqueous filtration", "reagent preparation", "larger-volume sample prep"]
    }
  ],
  [routeKey("sample-prep-filtration", "centrifugal-filters", "protein-concentrators")]: [
    {
      slug: "protein-concentrators-general",
      name: "Protein Concentrators General Configuration",
      shortDescription: "Centrifugal protein concentrator sourcing profile for MWCO, recovery, and sample-volume review.",
      commonSpecifications: ["format: centrifugal concentrator", "MWCO", "sample volume", "membrane material", "recovery and hold-up volume", "centrifuge compatibility"],
      applications: ["protein concentration", "buffer exchange", "sample cleanup", "assay prep", "protein workflow support"]
    }
  ],

  [routeKey("storage-cryopreservation", "cryogenic-vials", "sterile-cryovials")]: [
    {
      slug: "sterile-cryogenic-vials",
      name: "Sterile Cryogenic Vials",
      shortDescription: "Sterile cryogenic vials for sample storage and cell banking workflows that require volume, thread, and documentation review.",
      commonSpecifications: ["format: sterile cryovial", "volume", "internal or external thread", "vapor-phase liquid nitrogen compatibility review", "cap and seal style", "lot traceability"],
      applications: ["cell banking", "cryogenic sample storage", "freezer archiving", "sample traceability", "cell culture freezing workflows"]
    }
  ],
  [routeKey("storage-cryopreservation", "cryogenic-vials", "barcoded-cryovials")]: [
    {
      slug: "barcoded-cryovials",
      name: "Barcoded Cryovials",
      shortDescription: "Barcoded cryovial configurations for traceable storage workflows and inventory systems.",
      commonSpecifications: ["barcode format", "human-readable label option", "volume", "thread style", "sterility", "scanner and storage workflow fit"],
      applications: ["sample tracking", "biobank storage", "freezer inventory", "cell banking", "long-term archive workflows"]
    }
  ],
  [routeKey("storage-cryopreservation", "sample-storage-tubes", "2d-barcoded-tubes")]: [
    {
      slug: "2d-barcoded-storage-tubes",
      name: "2D Barcoded Storage Tubes",
      shortDescription: "2D barcoded storage tubes for traceable sample management, freezer organization, and automation-ready storage.",
      commonSpecifications: ["barcode: 2D bottom code", "tube volume", "rack footprint", "cap style", "temperature range", "automation and scanner compatibility"],
      applications: ["sample tracking", "compound or biosample storage", "freezer inventory", "automation-ready storage", "biobank workflows"]
    }
  ]
};

export type ProductItemMatch = ProductItemContext & {
  category: ProductCategory;
  productItem: ProductItem;
};

export function getProductItemsForFamily(segmentSlug: string, subcategorySlug: string, familySlug: string): ProductItem[] {
  const match = getFamilyBySlug(segmentSlug, subcategorySlug, familySlug);

  if (!match) {
    return [];
  }

  const context = { segment: match.segment, subcategory: match.subcategory, family: match.family };
  const configured = (configuredProductItems[routeKey(segmentSlug, subcategorySlug, familySlug)] ?? []).map((item) =>
    buildConfiguredProductItem(context, item)
  );
  const general = buildGeneralProductItem(context);

  if (configured.some((item) => item.slug === general.slug)) {
    return configured;
  }

  return [general, ...configured];
}

export function getProductItemBySlug(segmentSlug: string, subcategorySlug: string, familySlug: string, productSlug: string): ProductItemMatch | null {
  const match = getFamilyBySlug(segmentSlug, subcategorySlug, familySlug);

  if (!match) {
    return null;
  }

  const productItem = getProductItemsForFamily(segmentSlug, subcategorySlug, familySlug).find((item) => item.slug === productSlug);

  if (!productItem) {
    return null;
  }

  return {
    segment: match.segment,
    subcategory: match.subcategory,
    category: match.subcategory,
    family: match.family,
    productItem
  };
}

export function getAllProductItemPaths() {
  return productTaxonomy.flatMap((segment) =>
    segment.subcategories.flatMap((subcategory) =>
      subcategory.families.flatMap((family) =>
        getProductItemsForFamily(segment.slug, subcategory.slug, family.slug).map((productItem) => ({
          segment: segment.slug,
          subcategory: subcategory.slug,
          category: subcategory.slug,
          family: family.slug,
          product: productItem.slug
        }))
      )
    )
  );
}

export function getProductItemHref(segmentSlug: string, subcategorySlug: string, familySlug: string, productSlug: string) {
  return `/products/${segmentSlug}/${subcategorySlug}/${familySlug}/${productSlug}`;
}
