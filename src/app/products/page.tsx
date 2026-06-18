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
        <div className="grid gap-8 border-b border-bioaxis-line pb-12 pt-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">One stop for life science consumables</p>
            <h1 className="max-w-5xl text-5xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-7xl lg:text-8xl">Products</h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-bioaxis-muted sm:text-lg">
              Search anything. Source everything. Browse a BioAxis-owned product taxonomy across segments, categories, product families, equivalents, samples, quotes, and documentation support without fake inventory or pricing claims.
            </p>
          </div>
          <ProductSearch initialQuery={query} />
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "Browse by Product Category", body: "Start with 12 product segments, then drill into category and family pages." },
            { title: "Find an Equivalent", body: "Submit a current brand, catalog number, and critical specifications for review." },
            { title: "Request Quote / Sample", body: "Prepare a sourcing request with quantity, sterile status, documentation, and target date." }
          ].map((mode) => (
            <article key={mode.title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <h2 className="text-lg font-bold uppercase text-bioaxis-text">{mode.title}</h2>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{mode.body}</p>
            </article>
          ))}
        </section>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">Browse the BioAxis product universe</h2>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-bioaxis-muted">
              Start with one of 12 top-level product segments. Each segment opens into category pages, product-family pages, sourcing-option previews, filters, and quote/sample/equivalent request paths.
            </p>
          </div>
          <Link href="/workflows" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Browse workflows
          </Link>
        </div>
        <ProductCategoryGrid segments={productTaxonomy} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-panel p-6 sm:p-8">
          <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">How BioAxis sourcing works</p>
          <div className="grid gap-3 md:grid-cols-5">
            {["Search", "Match", "Quote", "Sample", "Supply"].map((step, index) => (
              <div key={step} className="border border-bioaxis-line bg-bioaxis-black p-4">
                <span className="text-xs font-bold text-bioaxis-dim">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-3 text-lg font-bold uppercase text-bioaxis-text">{step}</h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">Not sure where to start?</p>
            <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
              Start with a product, supplier, specification, or workflow.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
              BioAxis helps organize equivalent sourcing support, quote options, samples, and documentation paths without presenting inventory counts, pricing, or cart behavior.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href="/request-quote?inquiryType=equivalent" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Find equivalent
            </Link>
            <Link href="/request-quote?inquiryType=quote" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-6 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent">
              Request quote
            </Link>
            <Link href="/request-quote?inquiryType=sample" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Request sample
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
