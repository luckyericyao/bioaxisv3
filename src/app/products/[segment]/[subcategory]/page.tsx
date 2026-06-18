import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSubcategoryPaths, getTaxonomySubcategory } from "@/data/productTaxonomy";
import { SubcategoryPageTemplate } from "@/components/products/SubcategoryPageTemplate";

type SubcategoryPageProps = {
  params: Promise<{
    segment: string;
    subcategory: string;
  }>;
};

export function generateStaticParams() {
  return getAllSubcategoryPaths();
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { segment: segmentSlug, subcategory: subcategorySlug } = await params;
  const match = getTaxonomySubcategory(segmentSlug, subcategorySlug);

  if (!match) {
    return {
      title: "Product subcategory | BioAxis"
    };
  }

  return {
    title: match.subcategory.seoTitle,
    description: match.subcategory.metaDescription,
    alternates: {
      canonical: `/products/${match.segment.slug}/${match.subcategory.slug}`
    }
  };
}

export default async function ProductSubcategoryPage({ params }: SubcategoryPageProps) {
  const { segment: segmentSlug, subcategory: subcategorySlug } = await params;
  const match = getTaxonomySubcategory(segmentSlug, subcategorySlug);

  if (!match) {
    notFound();
  }

  return <SubcategoryPageTemplate segment={match.segment} subcategory={match.subcategory} />;
}

