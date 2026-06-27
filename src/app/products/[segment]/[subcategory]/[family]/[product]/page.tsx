import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductItemPageTemplate } from "@/components/products/ProductItemPageTemplate";
import { getAllProductItemPaths, getProductItemBySlug } from "@/data/productItems";
import { CatalogProductPage } from "@/components/products/catalog/CatalogPageTemplates";
import { getAllCatalogProductPaths, getProductBySlug as getCatalogProductBySlug } from "@/data/productCatalog";

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
  const catalogMatch = getCatalogProductBySlug(segment, subcategory, family, product);

  if (catalogMatch) {
    return {
      title: `${catalogMatch.product.name} | ${catalogMatch.family.name} | BioAxis`,
      description: catalogMatch.product.description,
      alternates: {
        canonical: `/products/${catalogMatch.segment.slug}/${catalogMatch.category.slug}/${catalogMatch.family.slug}/${catalogMatch.product.slug}`
      }
    };
  }

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
  const catalogMatch = getCatalogProductBySlug(segment, subcategory, family, product);

  if (catalogMatch) {
    return (
      <CatalogProductPage
        segment={catalogMatch.segment}
        category={catalogMatch.category}
        family={catalogMatch.family}
        product={catalogMatch.product}
      />
    );
  }

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
