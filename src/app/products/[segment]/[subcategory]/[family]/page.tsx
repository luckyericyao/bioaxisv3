import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FamilyPageTemplate } from "@/components/products/FamilyPageTemplate";
import { getAllFamilyPaths, getFamilyBySlug } from "@/data/productTaxonomy";
import { getPriorityProductContent } from "@/data/priorityProductContent";
import { CatalogFamilyPage } from "@/components/products/catalog/CatalogPageTemplates";
import { getAllCatalogFamilyPaths, getFamilyBySlug as getCatalogFamilyBySlug } from "@/data/productCatalog";
import { createRouteMetadata } from "@/lib/siteMetadata";

type FamilyPageProps = {
  params: Promise<{
    segment: string;
    subcategory: string;
    family: string;
  }>;
};

export function generateStaticParams() {
  const paths = [...getAllFamilyPaths(), ...getAllCatalogFamilyPaths()];
  const seen = new Set<string>();

  return paths.filter((path) => {
    const key = `${path.segment}/${path.subcategory}/${path.family}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function generateMetadata({ params }: FamilyPageProps): Promise<Metadata> {
  const { segment: segmentSlug, subcategory: subcategorySlug, family: familySlug } = await params;
  const match = getFamilyBySlug(segmentSlug, subcategorySlug, familySlug);

  if (match) {
    const priorityContent = getPriorityProductContent(match.segment.slug, match.subcategory.slug, match.family.slug);

    return createRouteMetadata({
      title: priorityContent?.metaTitle ?? match.family.seoTitle,
      description: priorityContent?.metaDescription ?? match.family.metaDescription,
      path: `/products/${match.segment.slug}/${match.subcategory.slug}/${match.family.slug}`
    });
  }

  const catalogMatch = getCatalogFamilyBySlug(segmentSlug, subcategorySlug, familySlug);

  if (!catalogMatch) {
    return {
      title: "Product family | BioAxis"
    };
  }

  return createRouteMetadata({
    title: `${catalogMatch.family.name} | ${catalogMatch.category.name} | BioAxis`,
    description: catalogMatch.family.description,
    path: `/products/${catalogMatch.segment.slug}/${catalogMatch.category.slug}/${catalogMatch.family.slug}`
  });
}

export default async function ProductFamilyPage({ params }: FamilyPageProps) {
  const { segment: segmentSlug, subcategory: subcategorySlug, family: familySlug } = await params;
  const match = getFamilyBySlug(segmentSlug, subcategorySlug, familySlug);

  if (match) {
    return <FamilyPageTemplate segment={match.segment} category={match.subcategory} family={match.family} />;
  }

  const catalogMatch = getCatalogFamilyBySlug(segmentSlug, subcategorySlug, familySlug);

  if (!catalogMatch) {
    notFound();
  }

  return <CatalogFamilyPage segment={catalogMatch.segment} category={catalogMatch.category} family={catalogMatch.family} />;
}
