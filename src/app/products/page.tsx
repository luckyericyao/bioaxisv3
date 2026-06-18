import Link from "next/link";
import type { Metadata } from "next";
import { ProductCategoryGrid } from "@/components/products/ProductCategoryGrid";
import { SearchBar } from "@/components/ui/SearchBar";
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

function segmentMatchesQuery(query: string) {
  const normalizedQuery = query.toLowerCase();

  return productTaxonomy.filter((segment) => {
    const searchableText = [
      segment.title,
      segment.description,
      segment.heroDescription,
      ...segment.subcategories.flatMap((subcategory) => [
        subcategory.title,
        subcategory.description,
        ...subcategory.typicalProducts,
        ...subcategory.applications,
        ...subcategory.specifications,
        ...subcategory.formats,
        ...subcategory.featuredFamilies.map((family) => family.title)
      ])
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = normalizeQuery(params?.q).trim();
  const visibleSegments = query ? segmentMatchesQuery(query) : productTaxonomy;

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:px-10">
        <div className="grid gap-8 border-b border-bioaxis-line pb-12 pt-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">Products</p>
            <h1 className="max-w-5xl text-4xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-6xl lg:text-7xl">
              Search the BioAxis product universe.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-bioaxis-muted sm:text-lg">
              Browse life science consumables by product category, workflow, specification, equivalent, or sourcing need. BioAxis organizes product families, subcategories, quote options, samples, and documentation support from one platform.
            </p>
          </div>
          <SearchBar
            initialQuery={query}
            helperText="Product name, catalog number, supplier, equivalent, workflow, subcategory, or consumable type."
          />
        </div>

        {query ? (
          <section className="mt-10 flex flex-col gap-4 border border-bioaxis-line bg-bioaxis-panel p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase text-bioaxis-muted">Showing taxonomy matches for</p>
              <p className="mt-1 break-words text-xl font-semibold text-bioaxis-text">{query}</p>
            </div>
            <Link
              href={`/request-quote?q=${encodeURIComponent(query)}`}
              className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
            >
              Prepare sourcing request
            </Link>
          </section>
        ) : null}
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">Browse the BioAxis product universe</h2>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-bioaxis-muted">
              Start with one of 12 top-level product categories. Each category opens into subcategories, featured product families, sourcing-option previews, filters, and quote/sample/equivalent request paths.
            </p>
          </div>
          <Link href="/workflows" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Browse workflows
          </Link>
        </div>
        {visibleSegments.length > 0 ? (
          <ProductCategoryGrid segments={visibleSegments} />
        ) : (
          <div className="border border-bioaxis-line bg-bioaxis-panel p-8">
            <h2 className="text-2xl font-bold uppercase text-bioaxis-text">No matching category found.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-bioaxis-muted">
              Submit the product name, supplier, catalog number, or workflow and BioAxis can help organize sourcing options, equivalents, samples, and documentation support where available.
            </p>
          </div>
        )}
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
            <Link href="/equivalents" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Find equivalent
            </Link>
            <Link href="/request-quote" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-6 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent">
              Request quote
            </Link>
            <Link href="/support" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Ask sourcing support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
