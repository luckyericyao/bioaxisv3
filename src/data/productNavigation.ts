import { productCatalogMenuSegments } from "@/data/productCatalog";

export type ProductNavigationFamilyLink = {
  label: string;
  href: string;
  categoryLabel: string;
  categorySlug: string;
  familySlug: string;
};

export type ProductNavigationCategory = {
  label: string;
  href: string;
  slug: string;
  families: ProductNavigationFamilyLink[];
};

export type ProductNavigationSegment = {
  index: string;
  label: string;
  shortDescription: string;
  href: string;
  slug: string;
  categories: ProductNavigationCategory[];
  familyLinks: ProductNavigationFamilyLink[];
};

export const productNavigationSegments: ProductNavigationSegment[] = productCatalogMenuSegments.map((segment) => {
  const categories = segment.categories.map((category) => {
    const categoryHref = segment.slug === "private-label" ? "/private-label" : segment.slug === "documents-compliance" ? "/resources" : `/products/${segment.slug}/${category.slug}`;
    const families = category.families.map((family) => ({
      label: family.name,
      href: `${categoryHref}/${family.slug}`,
      categoryLabel: category.name,
      categorySlug: category.slug,
      familySlug: family.slug
    }));

    return {
      label: category.name,
      href: categoryHref,
      slug: category.slug,
      families
    };
  });

  return {
    index: segment.index,
    label: segment.name,
    shortDescription: segment.shortDescription,
    href: segment.slug === "private-label" ? "/private-label" : segment.slug === "documents-compliance" ? "/resources" : `/products/${segment.slug}`,
    slug: segment.slug,
    categories,
    familyLinks: categories.flatMap((category) => category.families)
  };
});

export function getProductNavigationSegment(slug: string) {
  return productNavigationSegments.find((segment) => segment.slug === slug);
}
