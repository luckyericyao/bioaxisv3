import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductSegmentBySlug, productSegments } from "@/data/productSegments";
import { SegmentPageTemplate } from "@/components/products/SegmentPageTemplate";

type SegmentPageProps = {
  params: Promise<{
    segment: string;
  }>;
};

export function generateStaticParams() {
  return productSegments.map((segment) => ({ segment: segment.slug }));
}

export async function generateMetadata({ params }: SegmentPageProps): Promise<Metadata> {
  const { segment: segmentSlug } = await params;
  const segment = getProductSegmentBySlug(segmentSlug);

  if (!segment) {
    return {
      title: "Product segment | BioAxis"
    };
  }

  return {
    title: `${segment.title} | BioAxis Products`,
    description: segment.hero,
    alternates: {
      canonical: `/products/${segment.slug}`
    }
  };
}

export default async function ProductSegmentPage({ params }: SegmentPageProps) {
  const { segment: segmentSlug } = await params;
  const segment = getProductSegmentBySlug(segmentSlug);

  if (!segment) {
    notFound();
  }

  return <SegmentPageTemplate segment={segment} />;
}

