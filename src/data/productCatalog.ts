import { buildSegment } from "./productCatalog/builders";
import type { ProductCatalogFilters, ProductCatalogItem, ProductCatalogSegment, SegmentSeed } from "./productCatalog/types";
import { liquidHandlingSeed } from "./productCatalog/liquid-handling";
import { labPlasticwareSeed } from "./productCatalog/lab-plasticware";
import { cellCultureSeed } from "./productCatalog/cell-culture";
import { molecularBiologyPcrSeed } from "./productCatalog/molecular-biology-pcr";
import { samplePrepFiltrationSeed } from "./productCatalog/sample-prep-filtration";
import { storageCryopreservationSegment } from "./productCatalog/storage-cryopreservation";
import { assaysDetectionSegment } from "./productCatalog/assays-detection";
import { earlyBioprocessSingleUseSegment } from "./productCatalog/early-bioprocess-single-use";
import { safetyCleanroomSegment } from "./productCatalog/safety-cleanroom";
import { generalLabSuppliesSegment } from "./productCatalog/general-lab-supplies";
import { privateLabelSegment } from "./productCatalog/private-label";
import { documentsComplianceSegment } from "./productCatalog/documents-compliance";

export type {
  DocumentStatus,
  ProductDocuments,
  ProductCatalogItem,
  ProductCatalogFamily,
  ProductCatalogCategory,
  ProductCatalogSegment,
  ProductCatalogFilters
} from "./productCatalog/types";

const catalogSeeds: SegmentSeed[] = [
  liquidHandlingSeed,
  labPlasticwareSeed,
  cellCultureSeed,
  molecularBiologyPcrSeed,
  samplePrepFiltrationSeed
];

const supplementalMenuSegments: ProductCatalogSegment[] = [
  storageCryopreservationSegment,
  assaysDetectionSegment,
  earlyBioprocessSingleUseSegment,
  safetyCleanroomSegment,
  generalLabSuppliesSegment,
  privateLabelSegment,
  documentsComplianceSegment
];

export const productCatalogSegments: ProductCatalogSegment[] = catalogSeeds.map(buildSegment);
export const productCatalogMenuSegments: ProductCatalogSegment[] = [...productCatalogSegments, ...supplementalMenuSegments];

export function getAllSegments() {
  return productCatalogSegments;
}

export function getSegmentBySlug(slug: string) {
  return productCatalogSegments.find((segment) => segment.slug === slug) ?? supplementalMenuSegments.find((segment) => segment.slug === slug) ?? null;
}

export function getCategoryBySlug(segmentSlug: string, categorySlug: string) {
  const segment = getSegmentBySlug(segmentSlug);
  const category = segment?.categories.find((item) => item.slug === categorySlug) ?? null;
  return segment && category ? { segment, category } : null;
}

export function getFamilyBySlug(segmentSlug: string, categorySlug: string, familySlug: string) {
  const match = getCategoryBySlug(segmentSlug, categorySlug);
  const family = match?.category.families.find((item) => item.slug === familySlug) ?? null;
  return match && family ? { ...match, family } : null;
}

export function getProductBySlug(segmentSlug: string, categorySlug: string, familySlug: string, productSlug: string) {
  const match = getFamilyBySlug(segmentSlug, categorySlug, familySlug);
  const product = match?.family.products.find((item) => item.slug === productSlug) ?? null;
  return match && product ? { ...match, product } : null;
}

export function getAllCatalogCategoryPaths() {
  return productCatalogSegments.flatMap((segment) =>
    segment.categories.map((category) => ({ segment: segment.slug, subcategory: category.slug }))
  );
}

export function getAllCatalogFamilyPaths() {
  return productCatalogSegments.flatMap((segment) =>
    segment.categories.flatMap((category) =>
      category.families.map((family) => ({ segment: segment.slug, subcategory: category.slug, family: family.slug }))
    )
  );
}

export function getAllCatalogProductPaths() {
  return productCatalogSegments.flatMap((segment) =>
    segment.categories.flatMap((category) =>
      category.families.flatMap((family) =>
        family.products.map((product) => ({ segment: segment.slug, subcategory: category.slug, family: family.slug, product: product.slug }))
      )
    )
  );
}

export function getProductsForCategory(segmentSlug: string, categorySlug: string) {
  return getCategoryBySlug(segmentSlug, categorySlug)?.category.families.flatMap((family) => family.products) ?? [];
}

export function getProductsForSegment(segmentSlug: string) {
  return getSegmentBySlug(segmentSlug)?.categories.flatMap((category) => category.families.flatMap((family) => family.products)) ?? [];
}

export function searchProducts(query: string) {
  const normalized = query.trim().toLowerCase();
  const products = productCatalogSegments.flatMap((segment) =>
    segment.categories.flatMap((category) =>
      category.families.flatMap((family) => family.products.map((product) => ({ segment, category, family, product })))
    )
  );

  if (!normalized) return products;

  return products.filter(({ segment, category, family, product }) =>
    [segment.name, category.name, family.name, product.name, product.description, product.supplier, product.catalogNumber, product.productType, product.tags.join(" "), Object.values(product.specs).flat().join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}

export function filterProducts(products: ProductCatalogItem[], filters: ProductCatalogFilters) {
  const active = Object.entries(filters).filter(([key, value]) => key !== "query" && Array.isArray(value) && value.length > 0) as Array<[keyof ProductCatalogFilters, string[]]>;
  const query = filters.query?.trim().toLowerCase();

  return products.filter((product) => {
    const haystack = [product.name, product.description, product.productType, product.supplier, product.catalogNumber, product.tags.join(" "), Object.values(product.specs).flat().join(" ")]
      .join(" ")
      .toLowerCase();

    if (query && !haystack.includes(query)) return false;

    return active.every(([, values]) => values.some((value) => haystack.includes(value.toLowerCase())));
  });
}

export function productCatalogHref(segmentSlug: string, categorySlug?: string, familySlug?: string, productSlug?: string) {
  return `/${["products", segmentSlug, categorySlug, familySlug, productSlug].filter(Boolean).join("/")}`;
}
