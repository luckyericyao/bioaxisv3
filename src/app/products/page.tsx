import Link from "next/link";
import { ProductSegmentGrid } from "@/components/products/ProductSegmentGrid";
import { SearchBox } from "@/components/ui/SearchBox";

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
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-16 sm:px-8 lg:px-10">
      <section className="border-b border-bioaxis-line pb-12 pt-10">
        <p className="mb-5 text-sm uppercase text-bioaxis-muted">Product universe</p>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-6xl lg:text-7xl">
              SEARCH THE BIOAXIS PRODUCT UNIVERSE.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-bioaxis-muted sm:text-lg">
              Search by product family, catalog number, supplier, equivalent, workflow, or consumable type. BioAxis organizes the first sourcing map without inventing results.
            </p>
          </div>
          <SearchBox
            initialQuery={query}
            helperText="Product name, catalog number, supplier, equivalent, workflow, or consumable type."
            variant="page"
          />
        </div>
      </section>

      {query ? (
        <section className="mt-10 flex flex-col gap-4 border border-bioaxis-line bg-bioaxis-panel p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase text-bioaxis-muted">Searching product universe for</p>
            <p className="mt-1 break-words text-xl font-semibold text-bioaxis-text">{query}</p>
          </div>
          <Link
            href="/request-quote"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
          >
            Request quote
          </Link>
        </section>
      ) : null}

      <section className="pt-12">
        <ProductSegmentGrid query={query} mode="full" />
      </section>
    </div>
  );
}

