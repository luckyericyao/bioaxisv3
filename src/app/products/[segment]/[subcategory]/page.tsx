import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageTemplate } from "@/components/products/CategoryPageTemplate";
import { getAllSubcategoryPaths, getSubcategoryBySlug } from "@/data/productTaxonomy";
import { getPriorityProductContent } from "@/data/priorityProductContent";
import { CatalogCategoryPage } from "@/components/products/catalog/CatalogPageTemplates";
import { getAllCatalogCategoryPaths, getCategoryBySlug as getCatalogCategoryBySlug } from "@/data/productCatalog";

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
  const catalogMatch = getCatalogCategoryBySlug(segmentSlug, subcategorySlug);

  if (catalogMatch) {
    return {
      title: `${catalogMatch.category.name} | ${catalogMatch.segment.name} | BioAxis`,
      description: catalogMatch.category.description,
      alternates: {
        canonical: `/products/${catalogMatch.segment.slug}/${catalogMatch.category.slug}`
      }
    };
  }

  const match = getSubcategoryBySlug(segmentSlug, subcategorySlug);

  if (!match) {
    return {
      title: "Product subcategory | BioAxis"
    };
  }

  const priorityContent = getPriorityProductContent(match.segment.slug, match.subcategory.slug);

  return {
    title: priorityContent?.metaTitle ?? match.subcategory.seoTitle,
    description: priorityContent?.metaDescription ?? match.subcategory.metaDescription,
    alternates: {
      canonical: `/products/${match.segment.slug}/${match.subcategory.slug}`
    }
  };
}

export default async function ProductSubcategoryPage({ params }: SubcategoryPageProps) {
  const { segment: segmentSlug, subcategory: subcategorySlug } = await params;
  const catalogMatch = getCatalogCategoryBySlug(segmentSlug, subcategorySlug);

  if (catalogMatch) {
    return <CatalogCategoryPage segment={catalogMatch.segment} category={catalogMatch.category} />;
  }

  const match = getSubcategoryBySlug(segmentSlug, subcategorySlug);

  if (!match) {
    notFound();
  }

  return <CategoryPageTemplate segment={match.segment} category={match.subcategory} />;
}
