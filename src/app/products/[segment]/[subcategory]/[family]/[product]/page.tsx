import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductItemPageTemplate } from "@/components/products/ProductItemPageTemplate";
import { getAllProductItemPaths, getProductItemBySlug } from "@/data/productItems";
import { CatalogProductPage } from "@/components/products/catalog/CatalogPageTemplates";
import { getAllCatalogProductPaths, getProductBySlug as getCatalogProductBySlug } from "@/data/productCatalog";
import { createRouteMetadata } from "@/lib/siteMetadata";

type ProductItemPageProps = {
  params: Promise<{
    segment: string;
    subcategory: string;
    family: string;
    product: string;
  }>;
};

export function generateStaticParams() {
  const paths = [
    ...getAllProductItemPaths().map((path) => ({
      segment: path.segment,
      subcategory: path.subcategory,
      family: path.family,
      product: path.product
    })),
    ...getAllCatalogProductPaths()
  ];
  const seen = new Set<string>();

  return paths.filter((path) => {
    const key = `${path.segment}/${path.subcategory}/${path.family}/${path.product}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((path) => ({
    segment: path.segment,
    subcategory: path.subcategory,
    family: path.family,
    product: path.product
  }));
}

export async function generateMetadata({ params }: ProductItemPageProps): Promise<Metadata> {
  const { segment, subcategory, family, product } = await params;
  const match = getProductItemBySlug(segment, subcategory, family, product);

  if (match) {
    return {
      ...createRouteMetadata({
      title: `${match.productItem.name} sourcing template | BioAxis`,
      description: `${match.productItem.shortDescription} This is a configurable sourcing template, not a verified supplier SKU.`,
      path: `/products/${match.segment.slug}/${match.subcategory.slug}/${match.family.slug}/${match.productItem.slug}`
      }),
      ...(match.productItem.indexable ? {} : { robots: { index: false, follow: true } })
    };
  }

  const catalogMatch = getCatalogProductBySlug(segment, subcategory, family, product);

  if (catalogMatch) {
    return {
      ...createRouteMetadata({
      title: `${catalogMatch.product.name} sourcing template | BioAxis`,
      description: `${catalogMatch.product.description} This is a sourcing template; supplier SKU and specifications require confirmation.`,
      path: `/products/${catalogMatch.segment.slug}/${catalogMatch.category.slug}/${catalogMatch.family.slug}/${catalogMatch.product.slug}`
      }),
      robots: { index: false, follow: true }
    };
  }

  return {
    title: "Product item | BioAxis"
  };
}

export default async function ProductItemPage({ params }: ProductItemPageProps) {
  const { segment, subcategory, family, product } = await params;
  const match = getProductItemBySlug(segment, subcategory, family, product);

  if (match) {
    return (
      <ProductItemPageTemplate
        segment={match.segment}
        category={match.category}
        family={match.family}
        productItem={match.productItem}
      />
    );
  }

  const catalogMatch = getCatalogProductBySlug(segment, subcategory, family, product);

  if (!catalogMatch) {
    notFound();
  }

  return (
    <CatalogProductPage
      segment={catalogMatch.segment}
      category={catalogMatch.category}
      family={catalogMatch.family}
      product={catalogMatch.product}
    />
  );
}
