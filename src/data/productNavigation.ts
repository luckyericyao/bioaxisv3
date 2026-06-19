import { productTaxonomy } from "@/data/productTaxonomy";

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
  index: number;
  label: string;
  shortDescription: string;
  href: string;
  slug: string;
  categories: ProductNavigationCategory[];
  familyLinks: ProductNavigationFamilyLink[];
};

export const productNavigationSegments: ProductNavigationSegment[] = productTaxonomy.map((segment) => {
  const categories = segment.subcategories.map((category) => {
    const categoryHref = `/products/${segment.slug}/${category.slug}`;
    const families = category.productFamilies.map((family) => ({
      label: family.title,
      href: `${categoryHref}/${family.slug}`,
      categoryLabel: category.title,
      categorySlug: category.slug,
      familySlug: family.slug
    }));

    return {
      label: category.title,
      href: categoryHref,
      slug: category.slug,
      families
    };
  });

  return {
    index: segment.index,
    label: segment.title,
    shortDescription: segment.shortDescription,
    href: `/products/${segment.slug}`,
    slug: segment.slug,
    categories,
    familyLinks: categories.flatMap((category) => category.families)
  };
});

export function getProductNavigationSegment(slug: string) {
  return productNavigationSegments.find((segment) => segment.slug === slug);
}
