import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTaxonomySegmentBySlug, productTaxonomy } from "@/data/productTaxonomy";
import { SegmentPageTemplate } from "@/components/products/SegmentPageTemplate";
import { CatalogSegmentPage } from "@/components/products/catalog/CatalogPageTemplates";
import { getSegmentBySlug as getCatalogSegmentBySlug, productCatalogMenuSegments } from "@/data/productCatalog";

type SegmentPageProps = {
  params: Promise<{
    segment: string;
  }>;
};

export function generateStaticParams() {
  const slugs = new Set([...productTaxonomy.map((segment) => segment.slug), ...productCatalogMenuSegments.map((segment) => segment.slug)]);
  return [...slugs].map((segment) => ({ segment }));
}

export async function generateMetadata({ params }: SegmentPageProps): Promise<Metadata> {
  const { segment: segmentSlug } = await params;
  const catalogSegment = getCatalogSegmentBySlug(segmentSlug);

  if (catalogSegment) {
    return {
      title: `${catalogSegment.name} | BioAxis Products`,
      description: catalogSegment.shortDescription,
      alternates: {
        canonical: `/products/${catalogSegment.slug}`
      }
    };
  }

  const segment = getTaxonomySegmentBySlug(segmentSlug);

  if (!segment) {
    return {
      title: "Product category | BioAxis"
    };
  }

  return {
    title: segment.seoTitle,
    description: segment.metaDescription,
    alternates: {
      canonical: `/products/${segment.slug}`
    }
  };
}

export default async function ProductSegmentPage({ params }: SegmentPageProps) {
  const { segment: segmentSlug } = await params;
  const catalogSegment = getCatalogSegmentBySlug(segmentSlug);

  if (catalogSegment) {
    return <CatalogSegmentPage segment={catalogSegment} />;
  }

  const segment = getTaxonomySegmentBySlug(segmentSlug);

  if (!segment) {
    notFound();
  }

  return <SegmentPageTemplate segment={segment} />;
}
