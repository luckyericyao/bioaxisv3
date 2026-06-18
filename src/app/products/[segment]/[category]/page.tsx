import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageTemplate } from "@/components/products/CategoryPageTemplate";
import { getAllCategoryPaths, getTaxonomyCategory } from "@/data/productTaxonomy";

type CategoryPageProps = {
  params: Promise<{
    segment: string;
    category: string;
  }>;
};

export function generateStaticParams() {
  return getAllCategoryPaths();
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { segment: segmentSlug, category: categorySlug } = await params;
  const match = getTaxonomyCategory(segmentSlug, categorySlug);

  if (!match) {
    return {
      title: "Product category | BioAxis"
    };
  }

  return {
    title: match.category.seoTitle,
    description: match.category.metaDescription,
    alternates: {
      canonical: `/products/${match.segment.slug}/${match.category.slug}`
    }
  };
}

export default async function ProductCategoryPage({ params }: CategoryPageProps) {
  const { segment: segmentSlug, category: categorySlug } = await params;
  const match = getTaxonomyCategory(segmentSlug, categorySlug);

  if (!match) {
    notFound();
  }

  return <CategoryPageTemplate segment={match.segment} category={match.category} />;
}
