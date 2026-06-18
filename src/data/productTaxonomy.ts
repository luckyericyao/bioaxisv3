export type FeaturedFamily = {
  id: string;
  slug: string;
  title: string;
  description: string;
  typicalProducts: string[];
  keySpecifications: string[];
  representativeFormats: string[];
  documentationNeeds: string[];
  applications: string[];
  requestCta: string;
};

export type ProductSubcategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  featuredFamilies: FeaturedFamily[];
  typicalProducts: string[];
  applications: string[];
  specifications: string[];
  formats: string[];
  documentationNeeds: string[];
  relatedSubcategories: string[];
  relatedSegments: string[];
  requestTypes: string[];
  seoTitle: string;
  metaDescription: string;
};

export type ProductTaxonomySegment = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  index: number;
  description: string;
  heroDescription: string;
  imageKey: string;
  visualTheme: string;
  subcategories: ProductSubcategory[];
  relatedSegments: string[];
  ctaCopy: string;
  seoTitle: string;
  metaDescription: string;
};

type SubcategoryInput = {
  title: string;
  description?: string;
  familyTitles: string[];
  typicalProducts?: string[];
  applications?: string[];
  specifications?: string[];
  formats?: string[];
  documentationNeeds?: string[];
  requestTypes?: string[];
};

type SegmentInput = {
  title: string;
  shortTitle?: string;
  slug?: string;
  description: string;
  heroDescription: string;
  subcategories: SubcategoryInput[];
  relatedSegments: string[];
  visualTheme: string;
};

const defaultSpecifications = ["format", "material", "sterility where required", "workflow fit", "supplier documentation"];
const defaultFormats = ["sterile where required", "non-sterile where applicable", "standard formats", "workflow-compatible formats"];
const defaultApplications = ["research workflows", "routine lab operations", "sourcing review"];
const defaultDocumentation = ["COA where available", "SDS where applicable", "material information", "sterility information where applicable"];
const defaultRequestTypes = ["Quote", "Equivalent", "Sample"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildFamily(title: string, segmentTitle: string, subcategory: SubcategoryInput): FeaturedFamily {
  const slug = slugify(title);
  const typicalProducts = subcategory.typicalProducts?.slice(0, 4) ?? [title, subcategory.title, segmentTitle];
  const applications = subcategory.applications ?? defaultApplications;
  const keySpecifications = subcategory.specifications ?? defaultSpecifications;
  const representativeFormats = subcategory.formats ?? defaultFormats;
  const documentationNeeds = subcategory.documentationNeeds ?? defaultDocumentation;

  return {
    id: slug,
    slug,
    title,
    description: `${title} within ${subcategory.title} for ${segmentTitle.toLowerCase()} sourcing, equivalent review, sample-first evaluation, and documentation support where available.`,
    typicalProducts,
    keySpecifications,
    representativeFormats,
    documentationNeeds,
    applications,
    requestCta: `Request sourcing support for ${title.toLowerCase()}`
  };
}

function buildSubcategory(segmentTitle: string, relatedSegments: string[], subcategory: SubcategoryInput): ProductSubcategory {
  const slug = slugify(subcategory.title);
  const featuredFamilies = subcategory.familyTitles.map((familyTitle) => buildFamily(familyTitle, segmentTitle, subcategory));
  const typicalProducts = subcategory.typicalProducts ?? subcategory.familyTitles;
  const applications = subcategory.applications ?? defaultApplications;
  const specifications = subcategory.specifications ?? defaultSpecifications;
  const formats = subcategory.formats ?? defaultFormats;
  const documentationNeeds = subcategory.documentationNeeds ?? defaultDocumentation;
  const description =
    subcategory.description ??
    `BioAxis helps organize ${subcategory.title.toLowerCase()} by product family, format, specification, application, documentation need, equivalent options, and sample request path.`;

  return {
    id: slug,
    slug,
    title: subcategory.title,
    description,
    featuredFamilies,
    typicalProducts,
    applications,
    specifications,
    formats,
    documentationNeeds,
    relatedSubcategories: [],
    relatedSegments,
    requestTypes: subcategory.requestTypes ?? defaultRequestTypes,
    seoTitle: `${subcategory.title} | ${segmentTitle} | BioAxis`,
    metaDescription: `Explore ${subcategory.title.toLowerCase()} within ${segmentTitle.toLowerCase()} for quote support, equivalents, samples, and documentation organization.`
  };
}

function buildSegment(index: number, input: SegmentInput): ProductTaxonomySegment {
  const slug = input.slug ?? slugify(input.title);
  const subcategories = input.subcategories.map((subcategory) =>
    buildSubcategory(input.title, input.relatedSegments, subcategory)
  );

  return {
    id: slug,
    slug,
    title: input.title,
    shortTitle: input.shortTitle ?? input.title,
    index,
    description: input.description,
    heroDescription: input.heroDescription,
    imageKey: slug,
    visualTheme: input.visualTheme,
    subcategories: subcategories.map((subcategory) => ({
      ...subcategory,
      relatedSubcategories: subcategories
        .filter((item) => item.slug !== subcategory.slug)
        .slice(0, 4)
        .map((item) => item.slug)
    })),
    relatedSegments: input.relatedSegments,
    ctaCopy: `BioAxis helps organize ${input.title.toLowerCase()} sourcing requests by category, specification, equivalent options, sample paths, and documentation support where available.`,
    seoTitle: `${input.title} | BioAxis Products`,
    metaDescription: input.heroDescription
  };
}

export const productTaxonomy: ProductTaxonomySegment[] = [
  buildSegment(1, {
    title: "Liquid Handling",
    description: "Pipette tips, pipettes, reservoirs, dispensers, and liquid transfer accessories for manual and automated workflows.",
    heroDescription:
      "Explore liquid handling consumables by tip format, barrier type, retention profile, automation compatibility, packaging, and sourcing need.",
    visualTheme: "precision transfer",
    relatedSegments: ["automation-consumables", "molecular-biology-pcr", "cell-culture", "lab-plasticware"],
    subcategories: [
      { title: "Pipette Tips", familyTitles: ["Universal Pipette Tips", "Racked Pipette Tips", "Bulk Pipette Tips"], specifications: ["volume range", "tip fit", "packaging", "sterility", "low-retention option"], formats: ["racked", "bulk", "sterile", "non-sterile"] },
      { title: "Filter Pipette Tips", familyTitles: ["Sterile Filter Tips", "Low-Retention Filter Tips", "Aerosol Barrier Tips"], specifications: ["filter barrier", "sterility", "volume range", "low-retention surface"], formats: ["filtered", "sterile", "racked", "low-retention"] },
      { title: "Low-Retention Tips", familyTitles: ["Low-Retention Universal Tips", "Low-Retention Filter Tips", "Low-Retention Robotic Tips"], specifications: ["surface treatment", "sample recovery", "filter option", "instrument fit"], formats: ["low-retention", "filtered", "non-filtered", "racked"] },
      { title: "Robotic Pipette Tips", familyTitles: ["Conductive Robotic Tips", "Filtered Robotic Tips", "Automation-Compatible Racked Tips"], specifications: ["robot compatibility", "conductivity", "filter barrier", "rack format", "sterility"], formats: ["conductive", "filtered", "SBS-compatible", "automation-ready"] },
      { title: "Serological Pipettes", familyTitles: ["Sterile Serological Pipettes", "Individually Wrapped Pipettes", "Bulk-Packed Serological Pipettes"], specifications: ["volume range", "sterility", "graduation style", "packaging"], formats: ["sterile", "individually wrapped", "bulk", "polystyrene"] },
      { title: "Reagent Reservoirs", familyTitles: ["Automation Reservoirs", "Low-Dead-Volume Reservoirs", "Sterile Reagent Reservoirs"], specifications: ["dead volume", "well geometry", "sterility", "automation fit"], formats: ["single-channel", "multi-channel", "sterile", "automation-compatible"] },
      { title: "Pipettes & Controllers", familyTitles: ["Single-Channel Pipettes", "Multi-Channel Pipettes", "Pipette Controllers"], specifications: ["volume range", "channel count", "calibration support", "ergonomics"], formats: ["manual", "electronic", "single-channel", "multi-channel"] },
      { title: "Dispensers & Accessories", familyTitles: ["Bottle-Top Dispensers", "Repeating Dispensers", "Pipette Accessories"], specifications: ["volume range", "chemical compatibility", "dispensing mode", "accessory fit"], formats: ["bottle-top", "repeating", "manual", "accessory-compatible"] }
    ]
  }),
  buildSegment(2, {
    title: "Lab Plasticware",
    description: "Tubes, plates, bottles, containers, racks, sealing products, and general plasticware used across life science labs.",
    heroDescription:
      "Browse lab plasticware by sample format, volume, material, binding profile, sterility, barcode support, and workflow fit.",
    visualTheme: "sample handling",
    relatedSegments: ["liquid-handling", "storage-cryopreservation", "automation-consumables", "cell-culture"],
    subcategories: [
      { title: "Microcentrifuge Tubes", familyTitles: ["Standard Microcentrifuge Tubes", "Low-Bind Microcentrifuge Tubes", "Screw-Cap Microtubes"], specifications: ["volume", "cap type", "binding profile", "temperature range"], formats: ["clear", "amber", "low-bind", "screw-cap"] },
      { title: "Centrifuge & Conical Tubes", familyTitles: ["15 mL Conical Tubes", "50 mL Conical Tubes", "High-Speed Centrifuge Tubes"], specifications: ["volume", "RCF rating", "sterility", "cap seal"], formats: ["15 mL", "50 mL", "sterile", "non-sterile"] },
      { title: "Multiwell Plates", familyTitles: ["96-Well Plates", "384-Well Plates", "Clear, White & Black Plates"], specifications: ["well count", "color", "surface treatment", "reader compatibility"], formats: ["96-well", "384-well", "clear", "white", "black"] },
      { title: "Deep-Well Plates", familyTitles: ["1 mL Deep-Well Plates", "2 mL Deep-Well Plates", "Round-Bottom & V-Bottom Plates"], specifications: ["well volume", "bottom shape", "SBS fit", "sealing compatibility"], formats: ["1 mL", "2 mL", "round-bottom", "V-bottom"] },
      { title: "Assay Plates", familyTitles: ["Clear Assay Plates", "White Assay Plates", "Black Assay Plates"], specifications: ["readout compatibility", "surface treatment", "well count", "optical clarity"], formats: ["clear", "white", "black", "96-well", "384-well"] },
      { title: "Bottles & Containers", familyTitles: ["Media Bottles", "Storage Bottles", "General Lab Containers"], specifications: ["material", "volume", "closure type", "sterility"], formats: ["PETG", "HDPE", "clear", "amber"] },
      { title: "Sealing Films & Foils", familyTitles: ["PCR Plate Seals", "Aluminum Foil Seals", "Breathable Sealing Films"], specifications: ["temperature range", "pierceability", "seal strength", "application fit"], formats: ["optical", "foil", "breathable", "adhesive"] },
      { title: "Racks & Storage Accessories", familyTitles: ["Tube Racks", "Freezer Box Inserts", "Plate Storage Accessories"], specifications: ["tube size", "temperature range", "material", "layout"], formats: ["tube rack", "box insert", "plate accessory"] },
      { title: "Low-Bind Plasticware", familyTitles: ["Low-Bind Tubes", "Low-Bind Plates", "Protein Low-Bind Formats"], specifications: ["binding profile", "sample type", "volume", "sterility"], formats: ["low-bind", "protein low-bind", "clear", "sterile where required"] }
    ]
  }),
  buildSegment(3, {
    title: "Cell Culture",
    description: "Media, sera, supplements, cultureware, dissociation reagents, freezing media, coatings, and specialty cell culture supplies.",
    heroDescription:
      "Organize cell culture sourcing by formulation, surface treatment, sterility, culture format, sample evaluation, and documentation needs.",
    visualTheme: "culture workflow",
    relatedSegments: ["storage-cryopreservation", "lab-plasticware", "sample-prep-filtration", "early-bioprocess-single-use"],
    subcategories: [
      { title: "Cell Culture Media & Buffers", familyTitles: ["DMEM & RPMI Media", "Serum-Free Media", "Balanced Salt Solutions"], specifications: ["formulation", "serum status", "buffer system", "sterility"], formats: ["liquid", "powder", "serum-free", "ready-to-use"] },
      { title: "Sera & Supplements", familyTitles: ["Fetal Bovine Serum", "Defined Supplements", "Growth Supplement Blends"], specifications: ["origin profile", "treatment", "sterility", "documentation"], formats: ["bottle", "aliquot", "heat-inactivated where available"] },
      { title: "Cell Culture Flasks", familyTitles: ["Treated Culture Flasks", "Vent-Cap Flasks", "Low-Attachment Flasks"], specifications: ["surface treatment", "growth area", "cap style", "sterility"], formats: ["T-25", "T-75", "T-175", "vent cap"] },
      { title: "Cell Culture Plates & Dishes", familyTitles: ["Tissue-Culture-Treated Plates", "Low-Attachment Plates", "Coated Plates"], specifications: ["well count", "surface treatment", "coating", "sterility"], formats: ["6-well", "12-well", "24-well", "96-well", "dish"] },
      { title: "3D Cell Culture", familyTitles: ["Spheroid Culture Plates", "Hydrogel Matrices", "Organoid Culture Reagents"], specifications: ["matrix type", "attachment profile", "culture format", "sterility"], formats: ["low-attachment", "hydrogel", "matrix", "plate-based"] },
      { title: "Cell Culture Supplements & Reagents", familyTitles: ["Growth Factors", "Antibiotics", "Attachment Reagents"], specifications: ["activity", "sterility", "storage condition", "formulation"], formats: ["liquid", "lyophilized", "ready-to-use"] },
      { title: "Cell Lines & Specialty Cell Culture", familyTitles: ["Specialty Culture Reagents", "Cell Line Support Products", "Primary Culture Accessories"], specifications: ["cell type", "workflow fit", "storage", "documentation"], formats: ["kit", "reagent", "accessory"] },
      { title: "Dissociation Reagents", familyTitles: ["Trypsin Reagents", "Non-Enzymatic Dissociation Reagents", "Cell Detachment Solutions"], specifications: ["enzyme status", "concentration", "cell type", "sterility"], formats: ["liquid", "ready-to-use", "animal-origin-free where available"] },
      { title: "Cryopreservation Media", familyTitles: ["DMSO-Based Freezing Media", "Serum-Free Freezing Media", "Cell Recovery Media"], specifications: ["DMSO content", "serum status", "cell type", "sterility"], formats: ["ready-to-use", "serum-free", "bottle", "aliquot"] },
      { title: "ECM & Coatings", familyTitles: ["Collagen Coatings", "Fibronectin Coatings", "Basement Membrane Matrices"], specifications: ["coating type", "concentration", "cell type", "storage"], formats: ["liquid", "coated surface", "matrix"] },
      { title: "Sterile Lab Media Filtration & Cultureware", familyTitles: ["Sterile Filters", "Vacuum Filtration Units", "Cell Culture Supplies"], specifications: ["pore size", "membrane material", "sterility", "culture fit"], formats: ["0.22 µm", "0.45 µm", "vacuum unit", "sterile"] }
    ]
  }),
  buildSegment(4, {
    title: "Molecular Biology & PCR",
    slug: "molecular-biology-pcr",
    description: "PCR plastics, qPCR formats, seals, master mixes, extraction kits, cleanup kits, electrophoresis reagents, cloning tools, and oligos.",
    heroDescription:
      "Explore molecular biology and PCR consumables by instrument fit, nuclease control, optical format, reaction chemistry, and workflow requirement.",
    visualTheme: "amplification",
    relatedSegments: ["assays-detection", "buffers-chemicals-reagents", "automation-consumables", "liquid-handling"],
    subcategories: [
      { title: "PCR Tubes & Strips", familyTitles: ["PCR Tubes", "8-Strip PCR Tubes", "Low-Profile PCR Tubes"], specifications: ["tube profile", "cap fit", "nuclease control", "instrument fit"], formats: ["tube", "strip", "low-profile", "nuclease-free"] },
      { title: "PCR Plates", familyTitles: ["96-Well PCR Plates", "384-Well PCR Plates", "Skirted & Semi-Skirted PCR Plates"], specifications: ["well count", "skirt style", "instrument fit", "nuclease control"], formats: ["96-well", "384-well", "skirted", "semi-skirted"] },
      { title: "qPCR Plates", familyTitles: ["Optical qPCR Plates", "Low-Profile qPCR Plates", "White qPCR Plates"], specifications: ["optical performance", "well count", "instrument fit", "plate color"], formats: ["optical", "white", "low-profile", "384-well"] },
      { title: "Optical Seals", familyTitles: ["Optical Adhesive Films", "qPCR Plate Seals", "Heat Seals"], specifications: ["optical clarity", "adhesion", "temperature range", "pierceability"], formats: ["adhesive", "heat seal", "optical", "film"] },
      { title: "PCR Master Mixes", familyTitles: ["Standard PCR Master Mixes", "High-Fidelity PCR Mixes", "Hot-Start PCR Mixes"], specifications: ["polymerase type", "fidelity", "hot-start chemistry", "template type"], formats: ["2x mix", "kit", "ready-to-use"] },
      { title: "qPCR & RT-qPCR Reagents", familyTitles: ["SYBR qPCR Mixes", "Probe qPCR Mixes", "RT-qPCR Reagents"], specifications: ["detection chemistry", "reverse transcription", "instrument compatibility", "sample type"], formats: ["SYBR", "probe", "one-step", "two-step"] },
      { title: "DNA/RNA Extraction Kits", familyTitles: ["Genomic DNA Extraction Kits", "RNA Extraction Kits", "Plasmid Prep Kits"], specifications: ["sample type", "yield range", "cleanup chemistry", "throughput"], formats: ["spin column", "magnetic bead", "kit"] },
      { title: "Cleanup Kits", familyTitles: ["PCR Cleanup Kits", "Gel Extraction Kits", "Reaction Cleanup Kits"], specifications: ["sample type", "recovery range", "format", "throughput"], formats: ["spin column", "magnetic bead", "kit"] },
      { title: "Electrophoresis Reagents", familyTitles: ["Agarose", "DNA Ladders", "Gel Stains"], specifications: ["gel percentage", "ladder range", "stain chemistry", "sample type"], formats: ["powder", "ready-to-use", "ladder", "stain"] },
      { title: "Cloning Reagents", familyTitles: ["Restriction Enzymes", "Ligases", "Assembly Reagents"], specifications: ["enzyme type", "reaction chemistry", "buffer", "workflow fit"], formats: ["enzyme", "kit", "master mix"] },
      { title: "Primers & Oligos", familyTitles: ["PCR Primers", "qPCR Probes", "Custom Oligos"], specifications: ["sequence", "purification", "scale", "modification"], formats: ["desalted", "HPLC-purified", "probe", "primer"] }
    ]
  }),
  buildSegment(5, {
    title: "Sample Prep & Filtration",
    slug: "sample-prep-filtration",
    description: "Syringe filters, membranes, vacuum filters, concentration filters, centrifugal filters, dialysis products, protein concentrators, and homogenization supplies.",
    heroDescription:
      "Browse sample preparation and filtration products by membrane, pore size, molecular weight cutoff, sample compatibility, and preparation workflow.",
    visualTheme: "filtration path",
    relatedSegments: ["buffers-chemicals-reagents", "early-bioprocess-single-use", "proteins-antibodies-immunology", "cell-culture"],
    subcategories: [
      { title: "Syringe Filters", familyTitles: ["PES Syringe Filters", "PVDF Syringe Filters", "PTFE Syringe Filters", "Nylon Syringe Filters"], specifications: ["membrane material", "pore size", "diameter", "sterility"], formats: ["PES", "PVDF", "PTFE", "nylon", "0.22 µm", "0.45 µm"] },
      { title: "Laboratory Filter Membranes", familyTitles: ["PES Membranes", "PTFE Membranes", "Nylon Membranes", "Cellulose Acetate Membranes"], specifications: ["membrane material", "pore size", "diameter", "chemical compatibility"], formats: ["disc", "sheet", "0.22 µm", "0.45 µm"] },
      { title: "Filter Paper", familyTitles: ["Qualitative Filter Paper", "Quantitative Filter Paper", "Glass Fiber Filters"], specifications: ["grade", "retention", "flow rate", "diameter"], formats: ["circle", "sheet", "grade-specific"] },
      { title: "Vacuum Filters", familyTitles: ["Vacuum Filtration Units", "Sterile Vacuum Filters", "Bottle-Top Vacuum Filters"], specifications: ["membrane", "volume", "sterility", "receiver fit"], formats: ["vacuum unit", "bottle-top", "sterile"] },
      { title: "Bottle-Top Filters", familyTitles: ["PES Bottle-Top Filters", "PVDF Bottle-Top Filters", "Sterile Media Filters"], specifications: ["membrane", "pore size", "bottle fit", "sterility"], formats: ["bottle-top", "0.22 µm", "0.45 µm", "sterile"] },
      { title: "Filtration for Bioprocessing", familyTitles: ["Capsule Filters", "Vent Filters", "Depth Filters"], specifications: ["filter type", "porosity", "connection", "process scale"], formats: ["capsule", "vent", "depth", "sterile"] },
      { title: "Concentration Filters", familyTitles: ["3 kDa MWCO Filters", "10 kDa MWCO Filters", "30 kDa MWCO Filters", "100 kDa MWCO Filters"], specifications: ["MWCO", "sample volume", "centrifuge fit", "recovery"], formats: ["3 kDa", "10 kDa", "30 kDa", "100 kDa"] },
      { title: "Centrifugal Filters", familyTitles: ["Centrifugal Concentrators", "Spin Filters", "Ultrafiltration Devices"], specifications: ["MWCO", "volume", "membrane", "centrifuge compatibility"], formats: ["centrifugal", "spin column", "ultrafiltration"] },
      { title: "Dialysis & Desalting", familyTitles: ["Dialysis Tubing", "Desalting Columns", "Buffer Exchange Devices"], specifications: ["MWCO", "sample volume", "format", "buffer compatibility"], formats: ["tubing", "column", "cassette", "device"] },
      { title: "Protein Concentrators", familyTitles: ["Centrifugal Protein Concentrators", "Spin Concentrators", "High-Recovery Concentrators"], specifications: ["MWCO", "sample volume", "protein recovery", "membrane"], formats: ["centrifugal", "spin", "device"] },
      { title: "Homogenization Products", familyTitles: ["Bead Beating Tubes", "Homogenization Tubes", "Sample Grinding Accessories"], specifications: ["tube material", "bead type", "sample type", "volume"], formats: ["tube", "bead tube", "accessory"] }
    ]
  }),
  buildSegment(6, {
    title: "Storage & Cryopreservation",
    slug: "storage-cryopreservation",
    description: "Cryovials, cryogenic tubes, barcoded tubes, freezer boxes, racks, plates, seals, cap mats, freezing media, cold blocks, and labels.",
    heroDescription:
      "Organize storage and cryopreservation products by tube format, barcode support, temperature range, SBS compatibility, and sample management needs.",
    visualTheme: "cold storage",
    relatedSegments: ["lab-plasticware", "cell-culture", "automation-consumables", "early-bioprocess-single-use"],
    subcategories: [
      { title: "Cryovials", familyTitles: ["Internal Thread Cryovials", "External Thread Cryovials", "Sterile Cryovials"], specifications: ["thread type", "volume", "sterility", "temperature range"], formats: ["internal thread", "external thread", "sterile", "cryogenic"] },
      { title: "Cryogenic Tubes", familyTitles: ["Cryogenic Storage Tubes", "Screw-Cap Cryogenic Tubes", "Low-Temperature Tubes"], specifications: ["volume", "cap type", "temperature range", "material"], formats: ["cryogenic", "screw-cap", "low-temperature"] },
      { title: "2D Barcoded Tubes", familyTitles: ["SBS-Format Tubes", "Screw-Cap Barcoded Tubes", "Automation-Compatible Barcoded Tubes"], specifications: ["barcode type", "rack format", "automation fit", "volume"], formats: ["2D barcoded", "SBS-format", "screw-cap"] },
      { title: "Freezer Boxes", familyTitles: ["Cardboard Freezer Boxes", "Plastic Freezer Boxes", "Cryogenic Storage Boxes"], specifications: ["box layout", "temperature range", "material", "tube fit"], formats: ["9x9", "10x10", "cardboard", "plastic"] },
      { title: "Freezer Racks", familyTitles: ["Upright Freezer Racks", "Chest Freezer Racks", "Plate Storage Racks"], specifications: ["freezer type", "box fit", "material", "capacity"], formats: ["upright", "chest", "plate rack"] },
      { title: "Storage Plates", familyTitles: ["96-Well Storage Plates", "Deep-Well Storage Plates", "Barcoded Storage Plates"], specifications: ["well volume", "SBS fit", "barcode option", "sealing"], formats: ["96-well", "deep-well", "barcoded"] },
      { title: "Plate Seals", familyTitles: ["Adhesive Plate Seals", "Foil Plate Seals", "Heat Seals"], specifications: ["temperature range", "seal strength", "pierceability", "application"], formats: ["adhesive", "foil", "heat seal"] },
      { title: "Cap Mats", familyTitles: ["Silicone Cap Mats", "Sealing Cap Mats", "Automation-Compatible Cap Mats"], specifications: ["plate fit", "material", "pierceability", "temperature range"], formats: ["silicone", "pierceable", "SBS-compatible"] },
      { title: "Cryopreservation Media", familyTitles: ["DMSO-Based Media", "Serum-Free Freezing Media", "Cell Recovery Media"], specifications: ["DMSO content", "serum status", "sterility", "cell type"], formats: ["ready-to-use", "serum-free", "bottle"] },
      { title: "Cold Blocks", familyTitles: ["Tube Cold Blocks", "Plate Cold Blocks", "Benchtop Cooling Blocks"], specifications: ["format", "temperature range", "sample fit", "material"], formats: ["tube block", "plate block", "benchtop"] },
      { title: "Labels & Identification", familyTitles: ["Cryogenic Labels", "Barcode Labels", "Freezer Identification Supplies"], specifications: ["temperature range", "adhesive", "barcode support", "label format"], formats: ["cryogenic label", "barcode label", "sheet"] }
    ]
  }),
  buildSegment(7, {
    title: "Automation Consumables",
    description: "Robotic tips, conductive tips, automation reservoirs, plates, seals, cap mats, barcoded tubes, magnetic stands, and waste accessories.",
    heroDescription:
      "Explore automation consumables by robotic platform fit, SBS format, conductivity, filter barrier, sterility, barcoding, and packaging.",
    visualTheme: "automated workflow",
    relatedSegments: ["liquid-handling", "lab-plasticware", "molecular-biology-pcr", "storage-cryopreservation"],
    subcategories: [
      { title: "Robotic Pipette Tips", familyTitles: ["Conductive Robotic Tips", "Filtered Robotic Tips", "Sterile Robotic Tips"], specifications: ["robot platform", "conductivity", "filter type", "sterility"], formats: ["robotic", "conductive", "filtered", "sterile"] },
      { title: "Conductive Tips", familyTitles: ["Conductive Automation Tips", "Conductive Filter Tips", "Liquid-Level-Sensing Tips"], specifications: ["conductivity", "platform fit", "filter option", "rack format"], formats: ["conductive", "filtered", "automation-ready"] },
      { title: "Filter Robotic Tips", familyTitles: ["Filtered Automation Tips", "Sterile Filter Robotic Tips", "Low-Retention Filter Robotic Tips"], specifications: ["filter barrier", "robot fit", "sterility", "surface treatment"], formats: ["filtered", "sterile", "low-retention"] },
      { title: "Automation Reservoirs", familyTitles: ["Low-Dead-Volume Reservoirs", "Multi-Channel Reservoirs", "Sterile Automation Reservoirs"], specifications: ["dead volume", "channel layout", "platform fit", "sterility"], formats: ["reservoir", "low-dead-volume", "sterile"] },
      { title: "Automation Plates", familyTitles: ["96-Well Automation Plates", "384-Well Automation Plates", "SBS-Format Assay Plates"], specifications: ["SBS compliance", "well count", "plate material", "reader fit"], formats: ["96-well", "384-well", "SBS-format"] },
      { title: "Deep-Well Automation Plates", familyTitles: ["1 mL Automation Plates", "2 mL Automation Plates", "Barcoded Deep-Well Plates"], specifications: ["well volume", "SBS fit", "barcode support", "seal compatibility"], formats: ["1 mL", "2 mL", "barcoded", "deep-well"] },
      { title: "Seals & Cap Mats", familyTitles: ["Automation Plate Seals", "Pierceable Seals", "Silicone Cap Mats"], specifications: ["pierceability", "temperature range", "plate fit", "robot compatibility"], formats: ["seal", "foil", "cap mat", "pierceable"] },
      { title: "Barcoded Tubes", familyTitles: ["2D Barcoded Tubes", "SBS Rack Tubes", "Automation-Compatible Tube Racks"], specifications: ["barcode type", "rack geometry", "volume", "automation fit"], formats: ["2D barcoded", "SBS rack", "screw-cap"] },
      { title: "Magnetic Stands", familyTitles: ["Plate Magnetic Stands", "Tube Magnetic Stands", "Automation Magnetic Modules"], specifications: ["format", "magnet geometry", "platform fit", "sample type"], formats: ["plate", "tube", "automation-compatible"] },
      { title: "Waste Accessories", familyTitles: ["Tip Waste Containers", "Automation Waste Liners", "Deck Waste Accessories"], specifications: ["platform fit", "capacity", "material", "deck layout"], formats: ["container", "liner", "deck accessory"] }
    ]
  }),
  buildSegment(8, {
    title: "Assays & Detection",
    slug: "assays-detection",
    description: "ELISA kits, multiplex assays, cytokine panels, arrays, viability assays, western blot reagents, flow cytometry reagents, imaging reagents, and IHC/IF products.",
    heroDescription:
      "Browse assay and detection products by method, sample type, species reactivity, sensitivity, readout, and documentation needs.",
    visualTheme: "detection signal",
    relatedSegments: ["proteins-antibodies-immunology", "cell-culture", "molecular-biology-pcr", "automation-consumables"],
    subcategories: [
      { title: "ELISA Kits", familyTitles: ["Sandwich ELISA Kits", "Competitive ELISA Kits", "Colorimetric ELISA Kits"], specifications: ["assay format", "species reactivity", "sample type", "sensitivity"], formats: ["sandwich", "competitive", "colorimetric", "kit"] },
      { title: "ELISA Antibody Pairs", familyTitles: ["Capture Antibody Pairs", "Detection Antibody Pairs", "Matched Antibody Sets"], specifications: ["target", "species", "pair validation information where available", "format"], formats: ["antibody pair", "matched set", "kit component"] },
      { title: "Multiplex Assays", familyTitles: ["Bead-Based Multiplex Assays", "Multiplex Cytokine Panels", "Custom Multiplex Panels"], specifications: ["analyte count", "sample type", "platform", "dynamic range"], formats: ["bead-based", "panel", "kit"] },
      { title: "Cytokine Panels", familyTitles: ["Human Cytokine Panels", "Mouse Cytokine Panels", "Inflammation Panels"], specifications: ["species", "analytes", "sample type", "platform"], formats: ["panel", "multiplex", "kit"] },
      { title: "Antibody Arrays", familyTitles: ["Cytokine Antibody Arrays", "Pathway Antibody Arrays", "Membrane-Based Arrays"], specifications: ["target set", "sample type", "readout", "species"], formats: ["array", "membrane", "kit"] },
      { title: "Protein Arrays", familyTitles: ["Protein Interaction Arrays", "Biomarker Arrays", "Screening Arrays"], specifications: ["array content", "sample type", "readout", "format"], formats: ["array", "slide", "membrane"] },
      { title: "Cell Viability Assays", familyTitles: ["ATP-Based Assays", "Colorimetric Viability Assays", "Fluorescent Viability Assays"], specifications: ["readout", "cell type", "plate format", "sensitivity"], formats: ["ATP-based", "colorimetric", "fluorescent"] },
      { title: "Apoptosis Assays", familyTitles: ["Annexin V Assays", "Caspase Assays", "TUNEL Assays"], specifications: ["detection method", "sample type", "readout", "workflow"], formats: ["flow", "plate-based", "imaging"] },
      { title: "Western Blot Reagents", familyTitles: ["ECL Substrates", "Blocking Buffers", "Transfer Reagents"], specifications: ["detection chemistry", "membrane fit", "sensitivity", "format"], formats: ["chemiluminescent", "buffer", "substrate"] },
      { title: "Flow Cytometry Reagents", familyTitles: ["Fluorophore Antibodies", "Viability Dyes", "Compensation Controls"], specifications: ["fluorophore", "target", "species", "instrument channel"], formats: ["antibody", "dye", "control"] },
      { title: "Imaging Reagents", familyTitles: ["Fluorescent Dyes", "Nuclear Stains", "Cell Imaging Reagents"], specifications: ["excitation/emission", "sample type", "staining protocol", "format"], formats: ["dye", "stain", "ready-to-use"] },
      { title: "IHC & IF Products", familyTitles: ["IHC Antibodies", "IF Antibodies", "Blocking & Retrieval Reagents"], specifications: ["application", "species reactivity", "sample type", "detection method"], formats: ["IHC", "IF", "antibody", "reagent"] }
    ]
  }),
  buildSegment(9, {
    title: "Proteins, Antibodies & Immunology",
    slug: "proteins-antibodies-immunology",
    shortTitle: "Proteins & Immunology",
    description: "Recombinant proteins, cytokines, growth factors, chemokines, enzymes, receptors, antibodies, controls, peptides, lysates, and cell lines.",
    heroDescription:
      "Organize protein, antibody, and immunology sourcing by target, species reactivity, purity, tag, activity, carrier status, and documentation needs.",
    visualTheme: "immunology target",
    relatedSegments: ["assays-detection", "cell-culture", "buffers-chemicals-reagents", "sample-prep-filtration"],
    subcategories: [
      { title: "Recombinant Proteins", familyTitles: ["Carrier-Free Proteins", "His-Tagged Proteins", "Fc-Tagged Proteins"], specifications: ["purity", "tag", "carrier status", "activity"], formats: ["recombinant", "carrier-free", "His-tagged", "Fc-tagged"] },
      { title: "Cytokines", familyTitles: ["Interleukins", "Interferons", "TNF Family Cytokines"], specifications: ["species", "activity", "endotoxin level", "carrier status"], formats: ["lyophilized", "liquid", "carrier-free"] },
      { title: "Growth Factors", familyTitles: ["Stem Cell Growth Factors", "Cell Culture Growth Factors", "Recombinant Growth Factors"], specifications: ["activity", "species", "purity", "carrier status"], formats: ["recombinant", "lyophilized", "liquid"] },
      { title: "Chemokines", familyTitles: ["CC Chemokines", "CXC Chemokines", "Chemokine Receptor Ligands"], specifications: ["target", "species", "activity", "purity"], formats: ["recombinant", "lyophilized", "carrier-free"] },
      { title: "Enzymes", familyTitles: ["Research Enzymes", "Assay Enzymes", "Tagged Enzymes"], specifications: ["activity", "purity", "tag", "buffer"], formats: ["enzyme", "recombinant", "liquid"] },
      { title: "Receptors", familyTitles: ["Recombinant Receptors", "Fc-Fusion Receptors", "Ligand Binding Proteins"], specifications: ["domain", "tag", "activity", "species"], formats: ["Fc-tagged", "His-tagged", "recombinant"] },
      { title: "Primary Antibodies", familyTitles: ["Monoclonal Primary Antibodies", "Polyclonal Primary Antibodies", "Application-Tested Primary Antibodies"], specifications: ["target", "host", "application", "species reactivity"], formats: ["monoclonal", "polyclonal", "unconjugated"] },
      { title: "Secondary Antibodies", familyTitles: ["Fluorescent Secondary Antibodies", "HRP Secondary Antibodies", "Species-Specific Secondary Antibodies"], specifications: ["host species", "target species", "conjugate", "application"], formats: ["fluorescent", "HRP", "conjugated"] },
      { title: "Isotype Controls", familyTitles: ["Mouse Isotype Controls", "Rat Isotype Controls", "Fluorophore Isotype Controls"], specifications: ["species", "isotype", "conjugate", "application"], formats: ["control", "conjugated", "flow-compatible"] },
      { title: "Peptides", familyTitles: ["Synthetic Peptides", "Control Peptides", "Modified Peptides"], specifications: ["sequence", "purity", "modification", "scale"], formats: ["lyophilized", "modified", "control"] },
      { title: "Lysates", familyTitles: ["Cell Lysates", "Tissue Lysates", "Control Lysates"], specifications: ["sample source", "protein concentration", "buffer", "application"], formats: ["lysate", "control", "ready-to-use"] },
      { title: "Cell Lines", familyTitles: ["Research Cell Lines", "Control Cell Lines", "Specialty Cell Lines"], specifications: ["cell type", "growth conditions", "storage", "documentation"], formats: ["frozen vial", "culture-ready support", "control"] }
    ]
  }),
  buildSegment(10, {
    title: "Buffers, Chemicals & Reagents",
    slug: "buffers-chemicals-reagents",
    shortTitle: "Buffers & Reagents",
    description: "Biological buffers, PBS, DPBS, TBS, detergents, reducing agents, antibiotics, stains, dyes, water, solvents, salts, and specialty reagents.",
    heroDescription:
      "Browse buffers, chemicals, and reagents by formulation, concentration, grade, pH, sterility, purity, package size, and application.",
    visualTheme: "reagent bench",
    relatedSegments: ["molecular-biology-pcr", "assays-detection", "sample-prep-filtration", "cell-culture"],
    subcategories: [
      { title: "Biological Buffers", familyTitles: ["Tris Buffers", "HEPES Buffers", "MOPS Buffers"], specifications: ["buffer system", "pH", "concentration", "grade"], formats: ["ready-to-use", "concentrate", "powder"] },
      { title: "PBS, DPBS & TBS", familyTitles: ["PBS Buffers", "DPBS Buffers", "TBS Buffers"], specifications: ["formulation", "pH", "sterility", "calcium/magnesium status"], formats: ["ready-to-use", "sterile", "concentrate"] },
      { title: "Detergents", familyTitles: ["Tween", "Triton", "SDS", "CHAPS"], specifications: ["detergent type", "purity", "concentration", "application"], formats: ["liquid", "powder", "solution"] },
      { title: "Reducing Agents", familyTitles: ["DTT", "TCEP", "Beta-Mercaptoethanol Alternatives"], specifications: ["reducing chemistry", "concentration", "storage", "application"], formats: ["powder", "solution", "single-use aliquot"] },
      { title: "Antibiotics", familyTitles: ["Penicillin-Streptomycin", "Selection Antibiotics", "Antimycotic Reagents"], specifications: ["active agent", "concentration", "sterility", "cell culture fit"], formats: ["solution", "powder", "sterile"] },
      { title: "Stains & Dyes", familyTitles: ["Nucleic Acid Stains", "Protein Stains", "Fluorescent Dyes"], specifications: ["readout", "sample type", "excitation/emission", "format"], formats: ["solution", "powder", "ready-to-use"] },
      { title: "Water & Solvents", familyTitles: ["Molecular Biology Grade Water", "Cell Culture Grade Water", "Analytical Solvents"], specifications: ["grade", "purity", "package size", "application"], formats: ["bottle", "bulk", "sterile where required"] },
      { title: "Salts", familyTitles: ["Sodium Salts", "Potassium Salts", "Buffer Preparation Salts"], specifications: ["purity", "grade", "package size", "application"], formats: ["powder", "crystal", "solution"] },
      { title: "Cleaning Reagents", familyTitles: ["Lab Cleaning Solutions", "Decontamination Reagents", "Instrument Cleaning Reagents"], specifications: ["application", "compatibility", "concentration", "format"], formats: ["solution", "concentrate", "ready-to-use"] },
      { title: "Specialty Reagents", familyTitles: ["Molecular Biology Reagents", "Protein Biology Reagents", "Assay Support Reagents"], specifications: ["workflow", "grade", "format", "documentation"], formats: ["kit", "solution", "powder"] }
    ]
  }),
  buildSegment(11, {
    title: "Small Lab Equipment",
    description: "Compact bench equipment including centrifuges, mixers, rotators, shakers, heat blocks, thermal mixers, stirrers, hot plates, electrophoresis units, measurement devices, and accessories.",
    heroDescription:
      "Organize small lab equipment sourcing by capacity, speed range, temperature range, footprint, control type, accessory fit, and workflow need.",
    visualTheme: "benchtop tools",
    relatedSegments: ["molecular-biology-pcr", "sample-prep-filtration", "cell-culture", "liquid-handling"],
    subcategories: [
      { title: "Mini Centrifuges", familyTitles: ["Compact Mini Centrifuges", "Quick-Spin Centrifuges", "PCR Strip Centrifuges"], specifications: ["speed", "capacity", "rotor type", "footprint"], formats: ["compact", "benchtop", "quick-spin"] },
      { title: "Microcentrifuges", familyTitles: ["Standard Microcentrifuges", "High-Speed Microcentrifuges", "Refrigerated Microcentrifuges"], specifications: ["speed", "capacity", "temperature control", "rotor"], formats: ["benchtop", "refrigerated", "digital"] },
      { title: "Plate Centrifuges", familyTitles: ["PCR Plate Centrifuges", "Microplate Centrifuges", "Compact Plate Spinners"], specifications: ["plate fit", "speed", "footprint", "capacity"], formats: ["plate", "compact", "benchtop"] },
      { title: "Vortex Mixers", familyTitles: ["Fixed-Speed Vortex Mixers", "Variable-Speed Vortex Mixers", "Multi-Tube Vortexers"], specifications: ["speed range", "control type", "accessory fit", "footprint"], formats: ["analog", "digital", "multi-tube"] },
      { title: "Tube Rotators", familyTitles: ["Tube Rotators", "Variable-Speed Rotators", "End-Over-End Rotators"], specifications: ["tube capacity", "speed", "angle", "control type"], formats: ["benchtop", "variable speed", "tube rack"] },
      { title: "Rockers & Shakers", familyTitles: ["Platform Rockers", "Orbital Shakers", "Plate Shakers"], specifications: ["motion", "speed range", "platform size", "temperature option"], formats: ["rocker", "orbital", "plate shaker"] },
      { title: "Heat Blocks", familyTitles: ["Dry Baths", "Interchangeable Block Heaters", "Digital Heat Blocks"], specifications: ["temperature range", "block format", "control type", "capacity"], formats: ["digital", "analog", "interchangeable block"] },
      { title: "Thermal Mixers", familyTitles: ["Heated Shakers", "Thermal Mixers", "Tube Thermal Mixers"], specifications: ["temperature range", "mixing speed", "block format", "capacity"], formats: ["heated", "shaking", "tube block"] },
      { title: "Magnetic Stirrers", familyTitles: ["Compact Magnetic Stirrers", "Digital Magnetic Stirrers", "Multi-Position Stirrers"], specifications: ["stirring capacity", "speed", "control type", "positions"], formats: ["compact", "digital", "multi-position"] },
      { title: "Hot Plates", familyTitles: ["Digital Hot Plates", "Stirring Hot Plates", "Compact Hot Plates"], specifications: ["temperature range", "plate size", "control type", "stirring option"], formats: ["digital", "stirring", "compact"] },
      { title: "Electrophoresis Units", familyTitles: ["Gel Tanks", "Power Supplies", "Blue Light Transilluminators"], specifications: ["gel size", "voltage range", "viewing method", "accessory fit"], formats: ["tank", "power supply", "transilluminator"] },
      { title: "Measurement Devices", familyTitles: ["pH Meters", "Balances", "Thermometers"], specifications: ["range", "accuracy", "calibration", "display type"], formats: ["digital", "benchtop", "portable"] },
      { title: "Accessories", familyTitles: ["Rotors", "Tube Adapters", "Replacement Blocks"], specifications: ["equipment fit", "capacity", "material", "format"], formats: ["accessory", "adapter", "replacement"] }
    ]
  }),
  buildSegment(12, {
    title: "Early Bioprocess & Single-Use",
    slug: "early-bioprocess-single-use",
    shortTitle: "Bioprocess & Single-Use",
    description: "Single-use bags, tubing, connectors, sampling products, filters, bottles, flasks, sensors, and QC consumables for early process development.",
    heroDescription:
      "Explore early bioprocess and single-use sourcing by bag type, tubing, connector, sterility, material, scale, sampling workflow, and documentation need.",
    visualTheme: "process development",
    relatedSegments: ["cell-culture", "sample-prep-filtration", "storage-cryopreservation", "buffers-chemicals-reagents"],
    subcategories: [
      { title: "Single-Use Bags", familyTitles: ["2D Bags", "3D Bags", "Sterile Storage Bags"], specifications: ["bag volume", "film material", "sterilization method", "port type"], formats: ["2D", "3D", "sterile", "storage"] },
      { title: "Media Bags", familyTitles: ["Media Storage Bags", "Media Transfer Bags", "Sterile Media Bags"], specifications: ["volume", "connection", "sterility", "material"], formats: ["bag", "sterile", "transfer-ready"] },
      { title: "Buffer Bags", familyTitles: ["Buffer Storage Bags", "Buffer Transfer Bags", "Process Buffer Bags"], specifications: ["volume", "port type", "material", "sterility"], formats: ["bag", "storage", "transfer"] },
      { title: "Storage Bags", familyTitles: ["Sterile Storage Bags", "Sample Storage Bags", "Process Storage Bags"], specifications: ["volume", "temperature range", "material", "closure"], formats: ["sterile", "storage", "2D", "3D"] },
      { title: "Sampling Bags", familyTitles: ["Sterile Sampling Bags", "Process Sampling Bags", "Single-Use Sampling Bags"], specifications: ["volume", "port type", "sterility", "sample type"], formats: ["sampling", "sterile", "single-use"] },
      { title: "Transfer Bags", familyTitles: ["Fluid Transfer Bags", "Aseptic Transfer Bags", "Closed-System Transfer Bags"], specifications: ["connector type", "volume", "sterility", "closure"], formats: ["transfer", "aseptic", "closed-system"] },
      { title: "Tubing Sets", familyTitles: ["Tubing Sets", "Silicone Tubing Assemblies", "TPE Tubing Assemblies"], specifications: ["tubing diameter", "material", "connector type", "sterility"], formats: ["assembly", "silicone", "TPE"] },
      { title: "Aseptic Connectors", familyTitles: ["Aseptic Connectors", "Quick-Connect Fittings", "Sterile Connectors"], specifications: ["connector type", "tubing fit", "sterility", "closure"], formats: ["aseptic", "quick-connect", "sterile"] },
      { title: "Filters", familyTitles: ["Capsule Filters", "Vent Filters", "Sterile Filtration Units"], specifications: ["filter type", "pore size", "connection", "scale"], formats: ["capsule", "vent", "sterile"] },
      { title: "Bottles", familyTitles: ["PETG Bottles", "HDPE Bottles", "Process Bottles"], specifications: ["material", "volume", "closure", "sterility"], formats: ["PETG", "HDPE", "bottle"] },
      { title: "Sampling Kits", familyTitles: ["Sterile Sampling Kits", "QC Sampling Kits", "Process Sampling Kits"], specifications: ["sample type", "components", "sterility", "workflow"], formats: ["kit", "sterile", "QC"] },
      { title: "QC Consumables", familyTitles: ["QC Tubes", "QC Plates", "Process Documentation Consumables"], specifications: ["sample format", "documentation need", "workflow fit", "material"], formats: ["tube", "plate", "consumable"] }
    ]
  })
];

export function getTaxonomySegmentBySlug(slug: string) {
  return productTaxonomy.find((segment) => segment.slug === slug);
}

export function getTaxonomySubcategory(segmentSlug: string, subcategorySlug: string) {
  const segment = getTaxonomySegmentBySlug(segmentSlug);
  const subcategory = segment?.subcategories.find((item) => item.slug === subcategorySlug);

  if (!segment || !subcategory) {
    return null;
  }

  return { segment, subcategory };
}

export function getAllSubcategoryPaths() {
  return productTaxonomy.flatMap((segment) =>
    segment.subcategories.map((subcategory) => ({
      segment: segment.slug,
      subcategory: subcategory.slug
    }))
  );
}
