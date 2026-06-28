import Link from "next/link";
import type { Metadata } from "next";
import { ProductCategoryGrid } from "@/components/products/ProductCategoryGrid";
import { ProductSearch } from "@/components/products/ProductSearch";
import { productTaxonomy } from "@/data/productTaxonomy";

export const metadata: Metadata = {
  title: "Products | BioAxis",
  description:
    "Search the BioAxis product universe by product category, workflow, specification, equivalent, sample request, quote option, and documentation need.",
  alternates: {
    canonical: "/products"
  }
};

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

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:px-10">
        {query ? (
          <div className="border-b border-bioaxis-line pb-12 pt-10">
            <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">BioAxis product universe search</p>
            <h1 className="max-w-5xl text-5xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-7xl lg:text-8xl">Products</h1>
            <p className="mt-6 max-w-4xl text-base leading-7 text-bioaxis-muted sm:text-lg">
              Search across BioAxis segments, categories, families, sourcing templates, specifications, workflows, resources, aliases, and descriptions. Results are ranked for sourcing relevance before the compact directory appears below.
            </p>
            <div className="mt-8">
              <ProductSearch initialQuery={query} />
            </div>
          </div>
        ) : (
          <div className="grid gap-8 border-b border-bioaxis-line pb-12 pt-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-end">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">One stop for life science consumables</p>
              <h1 className="max-w-5xl text-5xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-7xl lg:text-8xl">Products</h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-bioaxis-muted sm:text-lg">
                Browse BioAxis product segments, drill into category and family pages, prepare equivalent reviews, request samples, and submit quote-ready sourcing requests. Availability, documentation, and pricing are confirmed through sourcing review.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="#product-categories" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent">
                  Browse categories
                </Link>
                <Link href="/equivalent-finder?requestType=equivalent" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                  Find equivalent
                </Link>
                <Link href="/request-quote?requestType=quote" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                  Request quote
                </Link>
              </div>
            </div>
            <ProductSearch initialQuery={query} />
          </div>
        )}
      </section>

      <section id="product-categories" className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className={query ? "text-2xl font-bold uppercase text-bioaxis-text sm:text-3xl" : "text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl"}>
              {query ? "Browse all product segments" : "Browse the BioAxis product universe"}
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-bioaxis-muted">
              {query
                ? "Search results are ranked above. Use this compact directory when you want to browse across the full BioAxis product universe."
                : "Start with one of 12 top-level product segments. Each segment opens into category and family pages with sourcing templates, filters, and quote/sample/equivalent request paths."}
            </p>
          </div>
        </div>
        {query ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {productTaxonomy.map((segment) => (
              <Link key={segment.slug} href={`/products/${segment.slug}`} className="border border-bioaxis-line bg-bioaxis-panel p-4 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft">
                <h3 className="text-sm font-bold uppercase text-bioaxis-text">{segment.name}</h3>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-bioaxis-muted">{segment.shortDescription}</p>
              </Link>
            ))}
          </div>
        ) : (
          <ProductCategoryGrid segments={productTaxonomy} />
        )}
      </section>
    </>
  );
}
