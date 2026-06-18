import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTaxonomySegmentBySlug, productTaxonomy } from "@/data/productTaxonomy";
import { SegmentPageTemplate } from "@/components/products/SegmentPageTemplate";

type SegmentPageProps = {
  params: Promise<{
    segment: string;
  }>;
};

export function generateStaticParams() {
  return productTaxonomy.map((segment) => ({ segment: segment.slug }));
}

export async function generateMetadata({ params }: SegmentPageProps): Promise<Metadata> {
  const { segment: segmentSlug } = await params;
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
  const segment = getTaxonomySegmentBySlug(segmentSlug);

  if (!segment) {
    notFound();
  }

  return <SegmentPageTemplate segment={segment} />;
}

