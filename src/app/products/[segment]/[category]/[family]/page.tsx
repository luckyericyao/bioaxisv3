import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FamilyPageTemplate } from "@/components/products/FamilyPageTemplate";
import { getAllFamilyPaths, getTaxonomyFamily } from "@/data/productTaxonomy";

type FamilyPageProps = {
  params: Promise<{
    segment: string;
    category: string;
    family: string;
  }>;
};

export function generateStaticParams() {
  return getAllFamilyPaths();
}

export async function generateMetadata({ params }: FamilyPageProps): Promise<Metadata> {
  const { segment: segmentSlug, category: categorySlug, family: familySlug } = await params;
  const match = getTaxonomyFamily(segmentSlug, categorySlug, familySlug);

  if (!match) {
    return {
      title: "Product family | BioAxis"
    };
  }

  return {
    title: match.family.seoTitle,
    description: match.family.metaDescription,
    alternates: {
      canonical: `/products/${match.segment.slug}/${match.category.slug}/${match.family.slug}`
    }
  };
}

export default async function ProductFamilyPage({ params }: FamilyPageProps) {
  const { segment: segmentSlug, category: categorySlug, family: familySlug } = await params;
  const match = getTaxonomyFamily(segmentSlug, categorySlug, familySlug);

  if (!match) {
    notFound();
  }

  return <FamilyPageTemplate segment={match.segment} category={match.category} family={match.family} />;
}
