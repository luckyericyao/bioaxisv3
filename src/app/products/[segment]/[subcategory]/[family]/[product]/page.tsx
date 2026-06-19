import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductItemPageTemplate } from "@/components/products/ProductItemPageTemplate";
import { getAllProductItemPaths, getProductItemBySlug } from "@/data/productItems";

type ProductItemPageProps = {
  params: Promise<{
    segment: string;
    subcategory: string;
    family: string;
    product: string;
  }>;
};

export function generateStaticParams() {
  return getAllProductItemPaths().map((path) => ({
    segment: path.segment,
    subcategory: path.subcategory,
    family: path.family,
    product: path.product
  }));
}

export async function generateMetadata({ params }: ProductItemPageProps): Promise<Metadata> {
  const { segment, subcategory, family, product } = await params;
  const match = getProductItemBySlug(segment, subcategory, family, product);

  if (!match) {
    return {
      title: "Product item | BioAxis"
    };
  }

  return {
    title: `${match.productItem.name} | ${match.family.name} | BioAxis`,
    description: match.productItem.shortDescription,
    alternates: {
      canonical: `/products/${match.segment.slug}/${match.subcategory.slug}/${match.family.slug}/${match.productItem.slug}`
    }
  };
}

export default async function ProductItemPage({ params }: ProductItemPageProps) {
  const { segment, subcategory, family, product } = await params;
  const match = getProductItemBySlug(segment, subcategory, family, product);

  if (!match) {
    notFound();
  }

  return (
    <ProductItemPageTemplate
      segment={match.segment}
      category={match.category}
      family={match.family}
      productItem={match.productItem}
    />
  );
}
