import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageTemplate } from "@/components/products/CategoryPageTemplate";
import { getAllSubcategoryPaths, getSubcategoryBySlug } from "@/data/productTaxonomy";

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
  const match = getSubcategoryBySlug(segmentSlug, subcategorySlug);

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
  const match = getSubcategoryBySlug(segmentSlug, subcategorySlug);

  if (!match) {
    notFound();
  }

  return <CategoryPageTemplate segment={match.segment} category={match.subcategory} />;
}
