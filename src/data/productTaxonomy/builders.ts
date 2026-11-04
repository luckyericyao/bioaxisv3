import type { ProductFamily, ProductSegment, ProductSubcategory, RawSegment, RawSubcategory } from "./types";

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

export function buildSegment(index: number, segment: RawSegment): ProductSegment {
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
