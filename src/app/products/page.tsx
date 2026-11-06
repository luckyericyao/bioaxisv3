import Link from "next/link";
import type { Metadata } from "next";
import { ProductCategoryGrid } from "@/components/products/ProductCategoryGrid";
import { ProductSearch } from "@/components/products/ProductSearch";
import { getProductSearchIndexSize, getProductSearchResults, isCatalogReferenceQuery } from "@/data/productSearch";
import { productTaxonomy } from "@/data/productTaxonomy";
import { createRouteMetadata } from "@/lib/siteMetadata";
import { DirectoryItemList } from "@/components/seo/StructuredData";
import { SourcingConfigurationBrowser } from "@/components/products/SourcingConfigurationBrowser";

export const metadata: Metadata = createRouteMetadata({
  title: "Products | BioAxis",
  description:
    "Browse BioAxis life science consumables segments for equivalent review, product list intake, documentation support, samples, and RFQ paths.",
  path: "/products"
});

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeQuery(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = normalizeQuery(params?.q).trim();
  if (normalizeQuery(params?.view) === "configurations") {
    return <SourcingConfigurationBrowser filters={{ q: query.slice(0, 180), segment: normalizeQuery(params?.segment), category: normalizeQuery(params?.category), volume: normalizeQuery(params?.volume), barrier: normalizeQuery(params?.barrier), sterility: normalizeQuery(params?.sterility), packaging: normalizeQuery(params?.packaging), includeUnconfirmed: normalizeQuery(params?.includeUnconfirmed) === "1" }} />;
  }
  const searchProps = {
    initialQuery: query,
    results: getProductSearchResults(query),
    indexedPathCount: getProductSearchIndexSize(),
    referenceQuery: isCatalogReferenceQuery(query)
  };
  const hasSearchResults = searchProps.results.length > 0;

  return (
    <>
      {(!query || hasSearchResults) ? (
        <DirectoryItemList
          name="Browse BioAxis product lines"
          path="/products"
          items={productTaxonomy.map((segment) => ({ name: segment.name, href: `/products/${segment.slug}` }))}
        />
      ) : null}
      <section className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${query ? "pb-4 pt-3 sm:pb-6 sm:pt-5" : "pb-4 pt-4 sm:pb-12 sm:pt-12"}`}>
        {query ? (
          <div>
            <h1 className="sr-only">BioAxis product search</h1>
            <div>
              <ProductSearch key={query} {...searchProps} />
            </div>
          </div>
        ) : (
          <div className="grid gap-3 border-b border-bioaxis-line pb-4 pt-0 sm:gap-5 sm:pb-8 sm:pt-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-end lg:gap-8 lg:pb-12 lg:pt-10">
            <div>
              <p className="mb-1 text-sm font-semibold  text-bioaxis-accent sm:mb-5 sm:text-sm">One stop for life science consumables</p>
              <h1 className="max-w-5xl text-3xl font-semibold  leading-[0.95] text-bioaxis-text sm:text-7xl lg:text-8xl">Products</h1>
              <p className="mt-2 max-w-3xl text-sm leading-4 text-bioaxis-muted sm:mt-6 sm:text-lg sm:leading-7">
                <span className="sm:hidden">Search or browse 12 product segments.</span>
                <span className="hidden sm:inline">Explore 12 product segments. Search a reference or browse the product families buyers source most.</span>
              </p>
            </div>
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <ProductSearch key="product-search" {...searchProps} />
            </div>
          </div>
        )}
      </section>

      {(!query || hasSearchResults) ? <section id="product-categories" className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-3 grid gap-3 sm:mb-8 sm:gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className={query ? "text-xl font-semibold  text-bioaxis-text sm:text-3xl" : "text-xl font-semibold  text-bioaxis-text sm:text-5xl"}>
              {query ? "Browse all product lines" : "Browse BioAxis product lines"}
            </h2>
            <p className="mt-3 hidden max-w-3xl text-sm leading-6 text-bioaxis-muted sm:block">
              {query
                ? "Search results are ranked above. Use this compact directory when you want to browse across BioAxis product lines."
                : "Browse a product line, or go directly to configuration targets and compare the fields that matter."}
            </p>
          </div>
          <Link href="/products?view=configurations" className="inline-flex min-h-11 items-center text-sm font-medium text-bioaxis-accent underline underline-offset-4">Compare configuration targets</Link>
        </div>
        {query ? (
          <details className="border border-bioaxis-line bg-bioaxis-panel">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-xs font-semibold   text-bioaxis-accent [&::-webkit-details-marker]:hidden">
              <span>Browse all product lines</span>
              <span className="text-bioaxis-dim">Optional directory</span>
            </summary>
            <div className="grid gap-3 border-t border-bioaxis-line p-4 sm:grid-cols-2 lg:grid-cols-4">
              {productTaxonomy.map((segment) => (
                <Link key={segment.slug} href={`/products/${segment.slug}`} className="border border-bioaxis-line bg-bioaxis-black p-4 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft">
                  <h3 className="text-sm font-semibold  text-bioaxis-text">{segment.name}</h3>
                  <p className="mt-3 text-xs leading-5 text-bioaxis-muted">{segment.shortDescription}</p>
                </Link>
              ))}
            </div>
          </details>
        ) : (
          <ProductCategoryGrid segments={productTaxonomy} />
        )}
      </section> : null}
    </>
  );
}
