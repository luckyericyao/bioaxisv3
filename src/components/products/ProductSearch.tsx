"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductSearchResults } from "@/data/productTaxonomy";

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

export function ProductSearch({ initialQuery = "" }: ProductSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const trimmedQuery = query.trim();
  const results = useMemo(() => getProductSearchResults(trimmedQuery), [trimmedQuery]);

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
        <section className="mt-5 border border-bioaxis-line bg-bioaxis-panel p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-bioaxis-dim">Search results</p>
              <p className="mt-1 text-sm text-bioaxis-muted">
                {results.length} matching segment, category, or family result{results.length === 1 ? "" : "s"}.
              </p>
            </div>
            <Link
              href={`/request-quote?q=${encodeURIComponent(trimmedQuery)}&requestType=quote`}
              className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
            >
              Prepare request
            </Link>
          </div>
          {results.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.href}`}
                  href={`${result.href}?q=${encodeURIComponent(trimmedQuery)}`}
                  className="border border-bioaxis-line bg-bioaxis-black p-4 transition hover:border-bioaxis-accent"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-bioaxis-line px-2 py-1 text-[0.68rem] font-bold uppercase text-bioaxis-dim">
                      {result.type}
                    </span>
                    <span className="text-sm font-bold uppercase text-bioaxis-text">{result.title}</span>
                  </div>
                  <p className="mt-2 text-xs uppercase text-bioaxis-dim">
                    {[result.segmentTitle, result.categoryTitle, result.familyTitle].filter(Boolean).join(" / ")}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-bioaxis-muted">{result.description}</p>
                </Link>
              ))}
            </div>
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
