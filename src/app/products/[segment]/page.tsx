import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTaxonomySegmentBySlug, productTaxonomy } from "@/data/productTaxonomy";
import { SegmentPageTemplate } from "@/components/products/SegmentPageTemplate";
import { CatalogSegmentPage } from "@/components/products/catalog/CatalogPageTemplates";
import { getSegmentBySlug as getCatalogSegmentBySlug, productCatalogMenuSegments } from "@/data/productCatalog";
import { createRouteMetadata } from "@/lib/siteMetadata";

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
  const segment = getTaxonomySegmentBySlug(segmentSlug);

  if (segment) {
    return createRouteMetadata({
      title: segment.seoTitle,
      description: segment.metaDescription,
      path: `/products/${segment.slug}`
    });
  }

  const catalogSegment = getCatalogSegmentBySlug(segmentSlug);

  if (!catalogSegment) {
    return {
      title: "Product category | BioAxis"
    };
  }

  return createRouteMetadata({
    title: `${catalogSegment.name} | BioAxis Products`,
    description: catalogSegment.shortDescription,
    path: `/products/${catalogSegment.slug}`
  });
}

export default async function ProductSegmentPage({ params }: SegmentPageProps) {
  const { segment: segmentSlug } = await params;
  const segment = getTaxonomySegmentBySlug(segmentSlug);

  if (segment) {
    return <SegmentPageTemplate segment={segment} />;
  }

  const catalogSegment = getCatalogSegmentBySlug(segmentSlug);

  if (!catalogSegment) {
    notFound();
  }

  return <CatalogSegmentPage segment={catalogSegment} />;
}
