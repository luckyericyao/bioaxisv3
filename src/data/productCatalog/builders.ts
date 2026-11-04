import type { CategorySeed, FamilySeed, ProductCatalogCategory, ProductCatalogFamily, ProductCatalogItem, ProductCatalogSegment, ProductDocuments, ProductNameSeed, SegmentSeed } from "./types";

const actions = {
  quote: true,
  equivalent: true,
  sample: true,
  documents: true,
  recurringSupply: true
};

const defaultDocuments: ProductDocuments = {
  sds: "supplier_dependent",
  coa: "request_required",
  specificationSheet: "supplier_dependent",
  sterilityStatement: "supplier_dependent",
  animalOriginStatement: "supplier_dependent",
  lotLevelDocumentation: "request_required"
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function menuOnlySegment(index: string, slug: string, name: string, shortDescription: string, categories: string[]): ProductCatalogSegment {
  return {
    id: slug,
    slug,
    index,
    name,
    shortDescription,
    heroDescription: shortDescription,
    categories: categories.map((categoryName) => {
      const categorySlug = slugify(categoryName);
      return {
        id: categorySlug,
        slug: categorySlug,
        name: categoryName,
        description: `${categoryName} sourcing context can be reviewed through BioAxis RFQ, equivalent, sample, or documentation workflows.`,
        tags: ["sourcing review", "documentation", "RFQ"],
        families: []
      };
    })
  };
}

function makeCatalogProduct(segment: SegmentSeed, category: CategorySeed, family: FamilySeed, index: number, override?: ProductNameSeed): ProductCatalogItem {
  const baseNames = [
    `${family.name} General Configuration`,
    `Sterile ${family.name}`,
    `Documentation-Ready ${family.name}`
  ];
  const name = override?.name ?? baseNames[index - 1] ?? `${family.name} Configuration ${index}`;
  const slug = override?.slug ?? slugify(name);
  const tags = override?.tags ?? [...category.tags.slice(0, 3), ...(family.typicalSpecs?.slice(0, 2) ?? [])].slice(0, 6);
  const specs = {
    "Product Type": family.name,
    Format: family.typicalSpecs?.[0] ?? category.tags[0] ?? "Format review required",
    Sterility: tags.some((tag) => /sterile/i.test(tag)) ? "Sterile option" : "Sterile / non-sterile review",
    Material: materialFor(segment.slug),
    "Volume / Size": "Size and pack format reviewed during RFQ",
    Application: category.description,
    Packaging: tags.find((tag) => /rack|bulk|bottle|plate|tube|bag/i.test(tag)) ?? "Packaging reviewed during RFQ",
    Documentation: "SDS / CoA / specification sheet reviewed on request",
    "Compatible Platforms": compatibilityFor(segment.slug)
  };

  return {
    id: `${segment.slug}-${category.slug}-${family.slug}-${slug}`,
    slug,
    name,
    configurationKind: override ? "specific" : "generic",
    supplier: "Buyer supplier input optional",
    catalogNumber: "Buyer SKU input optional",
    description:
      override?.specs?.Description?.toString() ??
      `${name} sourcing profile for ${category.name.toLowerCase()} requests, equivalent review, documentation checks, and quote preparation.`,
    productType: family.name,
    specs: { ...specs, ...(override?.specs ?? {}) },
    tags,
    documents: {
      ...defaultDocuments,
      sterilityStatement: tags.some((tag) => /sterile/i.test(tag)) ? "request_required" : "supplier_dependent"
    },
    actions
  };
}

function materialFor(segmentSlug: string) {
  if (segmentSlug === "sample-prep-filtration") return "Membrane / housing reviewed by product type";
  if (segmentSlug === "cell-culture") return "Formulation or treated plastic reviewed by workflow";
  if (segmentSlug === "molecular-biology-pcr") return "PCR-grade polymer or reagent format";
  return "Polypropylene / polystyrene / material reviewed during sourcing";
}

function compatibilityFor(segmentSlug: string) {
  if (segmentSlug === "liquid-handling") return "Manual pipette or automation platform fit";
  if (segmentSlug === "molecular-biology-pcr") return "Thermal cycler / qPCR instrument fit";
  if (segmentSlug === "sample-prep-filtration") return "Syringe, centrifuge, vacuum, or plate workflow fit";
  if (segmentSlug === "cell-culture") return "Cell model, culture format, or vessel fit";
  return "Workflow compatibility reviewed during sourcing";
}

function buildFamily(segment: SegmentSeed, category: CategorySeed, family: FamilySeed): ProductCatalogFamily {
  const overrides = family.productNames ?? [];
  const products = [1, 2, 3].map((index) => makeCatalogProduct(segment, category, family, index, overrides[index - 1]));

  if (overrides.length > 3) {
    products.push(...overrides.slice(3).map((override, index) => makeCatalogProduct(segment, category, family, index + 4, override)));
  }

  return {
    id: family.slug,
    slug: family.slug,
    name: family.name,
    description:
      family.description ??
      `${family.name} for ${category.name.toLowerCase()} sourcing, equivalent review, documentation checks, sample requests, and recurring supply planning.`,
    typicalSpecs: family.typicalSpecs ?? category.tags,
    products
  };
}

function buildCategory(segment: SegmentSeed, category: CategorySeed): ProductCatalogCategory {
  return {
    id: category.slug,
    slug: category.slug,
    name: category.name,
    description: category.description,
    tags: category.tags,
    families: category.families.map((family) => buildFamily(segment, category, family))
  };
}

export function buildSegment(segment: SegmentSeed): ProductCatalogSegment {
  return {
    id: segment.slug,
    slug: segment.slug,
    index: segment.index,
    name: segment.name,
    shortDescription: segment.shortDescription,
    heroDescription: segment.heroDescription,
    categories: segment.categories.map((category) => buildCategory(segment, category))
  };
}
