import { buildSegment } from "./productTaxonomy/builders";
import type { ProductSearchResult, ProductSegment, RawSegment, SearchResultType } from "./productTaxonomy/types";
import { liquidHandlingSegment } from "./productTaxonomy/liquid-handling";
import { labPlasticwareSegment } from "./productTaxonomy/lab-plasticware";
import { cellCultureSegment } from "./productTaxonomy/cell-culture";
import { molecularBiologyPcrSegment } from "./productTaxonomy/molecular-biology-pcr";
import { samplePrepFiltrationSegment } from "./productTaxonomy/sample-prep-filtration";
import { storageCryopreservationSegment } from "./productTaxonomy/storage-cryopreservation";
import { automationConsumablesSegment } from "./productTaxonomy/automation-consumables";
import { assaysDetectionSegment } from "./productTaxonomy/assays-detection";
import { proteinsAntibodiesImmunologySegment } from "./productTaxonomy/proteins-antibodies-immunology";
import { buffersChemicalsReagentsSegment } from "./productTaxonomy/buffers-chemicals-reagents";
import { smallLabEquipmentSegment } from "./productTaxonomy/small-lab-equipment";
import { earlyBioprocessSingleUseSegment } from "./productTaxonomy/early-bioprocess-single-use";

export type {
  ProductSpecification,
  DocumentationRequirement,
  ApplicationArea,
  ProductRequestType,
  ProductItem,
  RelatedCategory,
  ProductFamily,
  ProductSubcategory,
  ProductSegment,
  ProductTaxonomySegment,
  ProductCategory,
  FeaturedFamily,
  ProductSearchMatchTier,
  ProductSearchResult
} from "./productTaxonomy/types";

const rawSegments: RawSegment[] = [
  liquidHandlingSegment,
  labPlasticwareSegment,
  cellCultureSegment,
  molecularBiologyPcrSegment,
  samplePrepFiltrationSegment,
  storageCryopreservationSegment,
  automationConsumablesSegment,
  assaysDetectionSegment,
  proteinsAntibodiesImmunologySegment,
  buffersChemicalsReagentsSegment,
  smallLabEquipmentSegment,
  earlyBioprocessSingleUseSegment
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
  requestType = inquiryType ?? "quote",
  sourcePage,
  query
}: {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  product?: string;
  inquiryType?: string;
  requestType?: string;
  sourcePage?: string;
  query?: string;
}) {
  const params = new URLSearchParams();
  const resolvedSubcategory = subcategory ?? category;
  const hasProductContext = Boolean(segment || resolvedSubcategory || family || product);
  const resolvedSourcePage = sourcePage ?? buildProductContextPath({ segment, subcategory: resolvedSubcategory, family, product });

  params.set("type", requestTypeToQueryType(requestType));
  params.set("requestType", requestType);
  if (hasProductContext) {
    params.set("source", "product-page");
  }

  if (segment) {
    params.set("segment", segment);
  }

  if (resolvedSubcategory) {
    params.set("category", resolvedSubcategory);
    params.set("subcategory", resolvedSubcategory);
  }

  if (family) {
    params.set("family", family);
  }

  if (product) {
    params.set("product", product);
  }

  if (resolvedSourcePage) {
    params.set("sourcePage", resolvedSourcePage);
  }

  if (query) {
    params.set("query", query);
  }

  return `/request-quote?${params.toString()}`;
}

function requestTypeToQueryType(requestType: string) {
  const queryTypes: Record<string, string> = {
    quote: "rfq",
    equivalent: "equivalent",
    sample: "sample",
    documentation: "documentation",
    "recurring-supply": "recurring-supply",
    "product-list-review": "product-list",
    contact: "contact"
  };

  return queryTypes[requestType] ?? requestType;
}

export function buildEquivalentFinderHref({
  segment,
  category,
  subcategory,
  family,
  product,
  sourcePage,
  query
}: {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  product?: string;
  sourcePage?: string;
  query?: string;
}) {
  const params = new URLSearchParams();
  const resolvedSubcategory = subcategory ?? category;
  const hasProductContext = Boolean(segment || resolvedSubcategory || family || product);
  const resolvedSourcePage = sourcePage ?? buildProductContextPath({ segment, subcategory: resolvedSubcategory, family, product });

  params.set("requestType", "equivalent");
  if (hasProductContext) {
    params.set("source", "product-page");
  }

  if (segment) {
    params.set("segment", segment);
  }

  if (resolvedSubcategory) {
    params.set("category", resolvedSubcategory);
    params.set("subcategory", resolvedSubcategory);
  }

  if (family) {
    params.set("family", family);
  }

  if (product) {
    params.set("product", product);
  }

  if (resolvedSourcePage) {
    params.set("sourcePage", resolvedSourcePage);
  }

  if (query) {
    params.set("query", query);
  }

  return `/equivalent-finder?${params.toString()}`;
}

function buildProductContextPath({
  segment,
  subcategory,
  family,
  product
}: {
  segment?: string;
  subcategory?: string;
  family?: string;
  product?: string;
}) {
  const parts = ["products", segment, subcategory, family, product].filter(Boolean);
  return parts.length > 1 ? `/${parts.join("/")}` : "";
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
