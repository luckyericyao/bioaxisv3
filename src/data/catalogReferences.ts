export type VerifiedCatalogReference = {
  reference: string;
  title: string;
  description: string;
  href: string;
  segmentTitle?: string;
  segmentSlug?: string;
  categoryTitle?: string;
  categorySlug?: string;
  familyTitle?: string;
  familySlug?: string;
  productTitle?: string;
  productSlug?: string;
};

// Keep this registry empty until a reference is backed by a supplier document or buyer-provided record.
// Taxonomy matches must never be presented as verified catalog-number matches.
export const verifiedCatalogReferences: VerifiedCatalogReference[] = [];

function normalizeReference(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "");
}

export function findVerifiedCatalogReferences(query: string) {
  const normalizedQuery = normalizeReference(query);

  if (!normalizedQuery) {
    return [];
  }

  return verifiedCatalogReferences.filter((item) => normalizeReference(item.reference) === normalizedQuery);
}
