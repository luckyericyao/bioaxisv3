"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductSearchResults, type ProductSearchResult } from "@/data/productTaxonomy";

type ProductSearchProps = {
  initialQuery?: string;
};

const quickSearches = [
  { label: "filtered 200 µL tips", href: "/products/liquid-handling/pipette-tips/filtered-pipette-tips/filtered-200ul-pipette-tips" },
  { label: "serum-free media", href: "/products/cell-culture/media-and-supplements/serum-free-media/serum-free-cell-culture-media" },
  { label: "96-well PCR plates", href: "/products/molecular-biology-pcr/pcr-plastics/96-well-pcr-plates/96-well-pcr-plates" },
  { label: "PES 0.22 µm syringe filters", href: "/products/sample-prep-filtration/syringe-filters/pes-syringe-filters/pes-022um-syringe-filters" },
  { label: "Hamilton-compatible tips", href: "/products/automation-consumables/robotic-pipette-tips/hamilton-robotic-tips/hamilton-compatible-robotic-tips" },
  { label: "cryogenic vials", href: "/products/storage-cryopreservation/cryogenic-vials/sterile-cryovials/sterile-cryogenic-vials" }
];

function resultTypeLabel(type: ProductSearchResult["type"]) {
  return type === "subcategory" ? "category" : type;
}

function resultPath(result: ProductSearchResult) {
  return [result.segmentTitle, result.categoryTitle, result.familyTitle].filter(Boolean).join(" / ");
}

function requestHref(result: ProductSearchResult, requestType: "quote" | "equivalent", query: string) {
  const params = new URLSearchParams({ requestType, q: query });

  params.set("segment", result.segmentSlug);

  if (result.categorySlug) {
    params.set("subcategory", result.categorySlug);
  }

  if (result.familySlug) {
    params.set("family", result.familySlug);
  }

  return `${requestType === "equivalent" ? "/equivalent-finder" : "/request-quote"}?${params.toString()}`;
}

function ProductResultCard({ result, query }: { result: ProductSearchResult; query: string }) {
  return (
    <article className="border border-bioaxis-line bg-bioaxis-black p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="border border-bioaxis-line px-2 py-1 text-[0.68rem] font-bold uppercase text-bioaxis-dim">
          {resultTypeLabel(result.type)}
        </span>
        <span className="text-xs font-semibold uppercase text-bioaxis-accent">{resultPath(result)}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold uppercase leading-snug text-bioaxis-text">{result.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-bioaxis-muted">{result.description}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={`${result.href}?q=${encodeURIComponent(query)}`}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          View details
        </Link>
        <Link
          href={requestHref(result, "quote", query)}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Request quote
        </Link>
        <Link
          href={requestHref(result, "equivalent", query)}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Find equivalent
        </Link>
      </div>
    </article>
  );
}

export function ProductSearch({ initialQuery = "" }: ProductSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const trimmedQuery = query.trim();
  const results = useMemo(() => getProductSearchResults(trimmedQuery), [trimmedQuery]);
  const topMatches = results.slice(0, 6);
  const relatedMatches = results.slice(6, 18);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(trimmedQuery ? `/products?q=${encodeURIComponent(trimmedQuery)}` : "/products");
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="product-search" className="sr-only">
          Search BioAxis products
        </label>
        <div className="flex w-full flex-col gap-3 border border-white/[0.18] bg-black/[0.62] p-3 shadow-search backdrop-blur-md transition focus-within:border-bioaxis-accent/80 sm:flex-row sm:items-center">
          <input
            id="product-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pipette tips, serum-free media, PCR plates, PES syringe filters..."
            className="field-focus min-h-12 min-w-0 flex-1 border-0 bg-transparent text-xl font-semibold text-bioaxis-text placeholder:text-bioaxis-dim sm:text-2xl"
          />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-7 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Quick searches</p>
        <div className="flex flex-wrap gap-2">
          {quickSearches.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="border border-bioaxis-line bg-bioaxis-panel px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {trimmedQuery ? (
        <section className="mt-5 border border-bioaxis-line bg-bioaxis-panel p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-bioaxis-dim">Product search</p>
              <h2 className="mt-2 text-2xl font-bold uppercase text-bioaxis-text">
                Results for &ldquo;{trimmedQuery}&rdquo;
              </h2>
              <p className="mt-2 text-sm text-bioaxis-muted">
                {results.length} matching segment, category, or family result{results.length === 1 ? "" : "s"}.
              </p>
              {results.length > 18 ? (
                <p className="mt-2 text-xs leading-5 text-bioaxis-dim">
                  Showing top matches. Refine your search or send us a product list for sourcing support.
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
              >
                Clear search
              </Link>
              <Link
                href={`/request-quote?q=${encodeURIComponent(trimmedQuery)}&requestType=quote`}
                className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
              >
                Prepare request
              </Link>
            </div>
          </div>
          {results.length > 0 ? (
            <>
              <div className="mt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-bioaxis-accent">Top matches</p>
                <div className="grid gap-4">
                  {topMatches.map((result) => (
                    <ProductResultCard key={`${result.type}-${result.href}`} result={result} query={trimmedQuery} />
                  ))}
                </div>
              </div>
              {relatedMatches.length > 0 ? (
                <div className="mt-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-bioaxis-dim">Related matches</p>
                  <div className="grid gap-4">
                    {relatedMatches.map((result) => (
                      <ProductResultCard key={`${result.type}-${result.href}`} result={result} query={trimmedQuery} />
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-6 border border-bioaxis-line bg-bioaxis-black p-4">
                <p className="text-sm leading-6 text-bioaxis-muted">
                  Showing top matches. Refine your search or send us a product list for sourcing support.
                </p>
                <Link
                  href="/products#product-categories"
                  className="mt-4 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                >
                  Browse all product segments
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
              No taxonomy result matched this query. Submit the product name, current supplier, catalog number, or workflow and BioAxis can organize sourcing support.
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}
