import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FamilyPageTemplate } from "@/components/products/FamilyPageTemplate";
import { getAllFamilyPaths, getFamilyBySlug } from "@/data/productTaxonomy";
import { getPriorityProductContent } from "@/data/priorityProductContent";

type FamilyPageProps = {
  params: Promise<{
    segment: string;
    subcategory: string;
    family: string;
  }>;
};

export function generateStaticParams() {
  return getAllFamilyPaths();
}

export async function generateMetadata({ params }: FamilyPageProps): Promise<Metadata> {
  const { segment: segmentSlug, subcategory: subcategorySlug, family: familySlug } = await params;
  const match = getFamilyBySlug(segmentSlug, subcategorySlug, familySlug);

  if (!match) {
    return {
      title: "Product family | BioAxis"
    };
  }

  const priorityContent = getPriorityProductContent(match.segment.slug, match.subcategory.slug, match.family.slug);

  return {
    title: priorityContent?.metaTitle ?? match.family.seoTitle,
    description: priorityContent?.metaDescription ?? match.family.metaDescription,
    alternates: {
      canonical: `/products/${match.segment.slug}/${match.subcategory.slug}/${match.family.slug}`
    }
  };
}

export default async function ProductFamilyPage({ params }: FamilyPageProps) {
  const { segment: segmentSlug, subcategory: subcategorySlug, family: familySlug } = await params;
  const match = getFamilyBySlug(segmentSlug, subcategorySlug, familySlug);

  if (!match) {
    notFound();
  }

  return <FamilyPageTemplate segment={match.segment} category={match.subcategory} family={match.family} />;
}
