import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageTemplate } from "@/components/products/CategoryPageTemplate";
import { getAllSubcategoryPaths, getSubcategoryBySlug } from "@/data/productTaxonomy";
import { getPriorityProductContent } from "@/data/priorityProductContent";
import { CatalogCategoryPage } from "@/components/products/catalog/CatalogPageTemplates";
import { getAllCatalogCategoryPaths, getCategoryBySlug as getCatalogCategoryBySlug } from "@/data/productCatalog";
import { createRouteMetadata } from "@/lib/siteMetadata";

type SubcategoryPageProps = {
  params: Promise<{
    segment: string;
    subcategory: string;
  }>;
};

export function generateStaticParams() {
  const paths = [...getAllSubcategoryPaths(), ...getAllCatalogCategoryPaths()];
  const seen = new Set<string>();

  return paths.filter((path) => {
    const key = `${path.segment}/${path.subcategory}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { segment: segmentSlug, subcategory: subcategorySlug } = await params;
  const match = getSubcategoryBySlug(segmentSlug, subcategorySlug);

  if (match) {
    const priorityContent = getPriorityProductContent(match.segment.slug, match.subcategory.slug);

    return createRouteMetadata({
      title: priorityContent?.metaTitle ?? match.subcategory.seoTitle,
      description: priorityContent?.metaDescription ?? match.subcategory.metaDescription,
      path: `/products/${match.segment.slug}/${match.subcategory.slug}`
    });
  }

  const catalogMatch = getCatalogCategoryBySlug(segmentSlug, subcategorySlug);

  if (!catalogMatch) {
    return {
      title: "Product subcategory | BioAxis"
    };
  }

  return createRouteMetadata({
    title: `${catalogMatch.category.name} | ${catalogMatch.segment.name} | BioAxis`,
    description: catalogMatch.category.description,
    path: `/products/${catalogMatch.segment.slug}/${catalogMatch.category.slug}`
  });
}

export default async function ProductSubcategoryPage({ params }: SubcategoryPageProps) {
  const { segment: segmentSlug, subcategory: subcategorySlug } = await params;
  const match = getSubcategoryBySlug(segmentSlug, subcategorySlug);

  if (match) {
    return <CategoryPageTemplate segment={match.segment} category={match.subcategory} />;
  }

  const catalogMatch = getCatalogCategoryBySlug(segmentSlug, subcategorySlug);

  if (!catalogMatch) {
    notFound();
  }

  return <CatalogCategoryPage segment={catalogMatch.segment} category={catalogMatch.category} />;
}
