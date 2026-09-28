import Link from "next/link";
import type { Metadata } from "next";
import { ProductCategoryGrid } from "@/components/products/ProductCategoryGrid";
import { ProductSearch } from "@/components/products/ProductSearch";
import { getProductSearchResults } from "@/data/productSearch";
import { productTaxonomy } from "@/data/productTaxonomy";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Products | BioAxis",
  description:
    "Browse BioAxis life science consumables segments for equivalent review, product list intake, documentation support, samples, and RFQ paths.",
  path: "/products"
});

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
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
  const hasSearchResults = query ? getProductSearchResults(query).length > 0 : false;

  return (
    <>
      <section className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${query ? "pb-4 pt-3 sm:pb-6 sm:pt-5" : "pb-8 pt-8 sm:pb-12 sm:pt-12"}`}>
        {query ? (
          <div>
            <h1 className="sr-only">BioAxis product search</h1>
            <div>
              <ProductSearch key={query} initialQuery={query} />
            </div>
          </div>
        ) : (
          <div className="grid gap-5 border-b border-bioaxis-line pb-8 pt-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-end lg:gap-8 lg:pb-12 lg:pt-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-accent sm:mb-5 sm:text-sm">One stop for life science consumables</p>
              <h1 className="max-w-5xl text-4xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-7xl lg:text-8xl">Products</h1>
              <p className="mt-3 max-w-3xl text-xs leading-5 text-bioaxis-muted sm:mt-6 sm:text-lg sm:leading-7">
                <span className="sm:hidden">Search or browse 12 product segments.</span>
                <span className="hidden sm:inline">Explore 12 product segments. Search a reference or browse the product families buyers source most.</span>
              </p>
            </div>
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <ProductSearch key="product-search" initialQuery={query} />
            </div>
          </div>
        )}
      </section>

      {(!query || hasSearchResults) ? <section id="product-categories" className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className={query ? "text-2xl font-bold uppercase text-bioaxis-text sm:text-3xl" : "text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl"}>
              {query ? "Browse all product lines" : "Browse BioAxis product lines"}
            </h2>
            <p className="mt-3 hidden max-w-3xl text-sm leading-6 text-bioaxis-muted sm:block">
              {query
                ? "Search results are ranked above. Use this compact directory when you want to browse across BioAxis product lines."
                : "Start with one of 12 top-level product segments. Each segment opens into category and family pages with sourcing templates, equivalent review paths, sample requests, and quote-ready fields."}
            </p>
          </div>
        </div>
        {query ? (
          <details className="border border-bioaxis-line bg-bioaxis-panel">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-xs font-bold uppercase tracking-wide text-bioaxis-accent [&::-webkit-details-marker]:hidden">
              <span>Browse all product lines</span>
              <span className="text-bioaxis-dim">Optional directory</span>
            </summary>
            <div className="grid gap-3 border-t border-bioaxis-line p-4 sm:grid-cols-2 lg:grid-cols-4">
              {productTaxonomy.map((segment) => (
                <Link key={segment.slug} href={`/products/${segment.slug}`} className="border border-bioaxis-line bg-bioaxis-black p-4 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft">
                  <h3 className="text-sm font-bold uppercase text-bioaxis-text">{segment.name}</h3>
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
