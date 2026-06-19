"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductSearchResults } from "@/data/productSearch";
import type { ProductSearchResult } from "@/data/productTaxonomy";

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

const resultTypes: ProductSearchResult["type"][] = ["segment", "subcategory", "family", "product", "workflow", "resource"];

function resultTypeLabel(type: ProductSearchResult["type"]) {
  return type === "subcategory" ? "category" : type;
}

function resultPath(result: ProductSearchResult) {
  if (result.type === "workflow") {
    return "Workflows";
  }

  if (result.type === "resource") {
    return "Resources";
  }

  return [result.segmentTitle, result.categoryTitle, result.familyTitle, result.productTitle].filter(Boolean).join(" / ");
}

function requestHref(result: ProductSearchResult, requestType: "quote" | "equivalent", query: string) {
  const params = new URLSearchParams({ requestType, q: query });

  if (result.segmentSlug) {
    params.set("segment", result.segmentSlug);
  }

  if (result.categorySlug) {
    params.set("subcategory", result.categorySlug);
  }

  if (result.familySlug) {
    params.set("family", result.familySlug);
  }

  if (result.productSlug) {
    params.set("product", result.productSlug);
  }

  return `${requestType === "equivalent" ? "/equivalent-finder" : "/request-quote"}?${params.toString()}`;
}

function detailHref(result: ProductSearchResult, query: string) {
  if (result.type === "workflow" || result.type === "resource") {
    return result.href;
  }

  return `${result.href}?q=${encodeURIComponent(query)}`;
}

function relevanceLabel(result: ProductSearchResult) {
  const fields = result.matchedFields ?? [];

  if (fields.includes("title") || fields.includes("path")) {
    return "Direct title/path match";
  }

  if (fields.includes("specifications") || fields.includes("applications")) {
    return "Spec/application match";
  }

  return "Ranked relevance";
}

function highlightText(value: string, query: string) {
  const tokens = [
    ...new Set(
      query
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length > 1)
    )
  ];

  if (tokens.length === 0) {
    return value;
  }

  const pattern = new RegExp(`(${tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = value.split(pattern);

  return parts.map((part, index) =>
    tokens.some((token) => part.toLowerCase() === token.toLowerCase()) ? (
      <mark key={`${part}-${index}`} className="bg-bioaxis-accent/20 px-1 text-bioaxis-accent">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function topCounts(values: string[], limit: number) {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    if (value) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

function ProductResultCard({ result, query }: { result: ProductSearchResult; query: string }) {
  return (
    <article className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-black p-5 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <div className="flex flex-wrap items-center gap-2">
        <span className="border border-bioaxis-line bg-bioaxis-panel px-2 py-1 text-[0.68rem] font-bold uppercase text-bioaxis-dim">
          {resultTypeLabel(result.type)}
        </span>
        <span className="border border-bioaxis-accent/40 bg-bioaxis-accent/10 px-2 py-1 text-[0.68rem] font-bold uppercase text-bioaxis-accent">
          {relevanceLabel(result)}
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase leading-5 text-bioaxis-accent">{highlightText(resultPath(result), query)}</p>
      <h3 className="mt-3 text-lg font-bold uppercase leading-snug text-bioaxis-text">{highlightText(result.title, query)}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-bioaxis-muted">{highlightText(result.description, query)}</p>
      {result.matchedFields && result.matchedFields.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {result.matchedFields.slice(0, 5).map((field) => (
            <span key={field} className="border border-bioaxis-line bg-bioaxis-panel px-2.5 py-1.5 text-[0.68rem] font-semibold uppercase text-bioaxis-steel">
              {field}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row sm:flex-wrap">
        <Link
          href={detailHref(result, query)}
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
  const typeCounts = resultTypes.map((type) => [resultTypeLabel(type), results.filter((result) => result.type === type).length] as const);
  const topSegments = topCounts(results.map((result) => result.segmentTitle ?? resultTypeLabel(result.type)), 5);
  const matchedFields = topCounts(results.flatMap((result) => result.matchedFields ?? []), 6);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(trimmedQuery ? `/products?q=${encodeURIComponent(trimmedQuery)}` : "/products");
  }

  const searchForm = (
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
  );

  const quickSearchLinks = (
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
  );

  if (!trimmedQuery) {
    return (
      <div className="w-full">
        {searchForm}
        {quickSearchLinks}
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.62fr)] xl:items-start">
          <div>
            <p className="text-xs font-semibold uppercase text-bioaxis-dim">Product search command center</p>
            <h2 className="mt-2 text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
              Results for &ldquo;{trimmedQuery}&rdquo;
            </h2>
            <p className="mt-4 text-base leading-7 text-bioaxis-muted">
              {results.length} ranked segment, category, family, product, workflow, or resource result{results.length === 1 ? "" : "s"}.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-bioaxis-dim">
              Ranked across BioAxis product segments, categories, families, product configurations, specifications, applications, workflows, resources, aliases, and descriptions.
            </p>
          </div>
          <div>
            {searchForm}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
        </div>
        {quickSearchLinks}
      </section>

      {results.length > 0 ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_260px]">
          <aside className="grid gap-4 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-accent">Search coverage</p>
              <div className="mt-5 grid gap-3">
                {typeCounts.map(([label, count]) => (
                  <div key={label} className="flex items-center justify-between border border-bioaxis-line bg-bioaxis-black px-3 py-2">
                    <span className="text-xs font-semibold uppercase text-bioaxis-steel">{label}</span>
                    <span className="text-sm font-bold text-bioaxis-accent">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-accent">Top product areas</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {topSegments.map(([segment, count]) => (
                  <span key={segment} className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                    {segment} <span className="text-bioaxis-accent">{count}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-accent">Matched across</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {matchedFields.map(([field, count]) => (
                  <span key={field} className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                    {field} <span className="text-bioaxis-accent">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-accent">Top matches</p>
                <h3 className="mt-2 text-2xl font-bold uppercase text-bioaxis-text">{topMatches.length} highest relevance results</h3>
              </div>
              <p className="max-w-md text-sm leading-6 text-bioaxis-dim">
                Direct title, path, family, and specification matches appear ahead of loose application-only matches.
              </p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {topMatches.map((result) => (
                <ProductResultCard key={`${result.type}-${result.href}`} result={result} query={trimmedQuery} />
              ))}
            </div>

            {relatedMatches.length > 0 ? (
              <div className="mt-10">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-dim">Related matches</p>
                    <h3 className="mt-2 text-2xl font-bold uppercase text-bioaxis-text">{relatedMatches.length} additional ranked results</h3>
                  </div>
                  <p className="max-w-md text-sm leading-6 text-bioaxis-dim">
                    Showing top ranked matches. Refine your search or send us a product list for sourcing support.
                  </p>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {relatedMatches.map((result) => (
                    <ProductResultCard key={`${result.type}-${result.href}`} result={result} query={trimmedQuery} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="border border-bioaxis-line bg-bioaxis-panel p-5 xl:sticky xl:top-24 xl:self-start">
            <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-accent">Sourcing next steps</p>
            <div className="mt-5 grid gap-3">
              {["View product details", "Request quote", "Find equivalent", "Send product list"].map((action) => (
                <div key={action} className="border border-bioaxis-line bg-bioaxis-black px-3 py-3 text-xs font-semibold uppercase text-bioaxis-steel">
                  {action}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-bioaxis-muted">
              BioAxis can help compare equivalent options, samples, documentation, and quote-ready sourcing lists.
            </p>
            <Link
              href={`/request-quote?q=${encodeURIComponent(trimmedQuery)}&requestType=product-list-review`}
              className="mt-5 inline-flex min-h-10 w-full items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
            >
              Send product list
            </Link>
          </aside>
        </section>
      ) : (
        <section className="mt-6 border border-bioaxis-line bg-bioaxis-panel p-5">
          <p className="text-sm leading-6 text-bioaxis-muted">
            No product-universe result matched this query. Submit the product name, current supplier, catalog number, or workflow and BioAxis can organize sourcing support.
          </p>
        </section>
      )}

      <div className="mt-6 border border-bioaxis-line bg-bioaxis-black p-5">
        <p className="text-sm leading-6 text-bioaxis-muted">
          Search results are ranked above. Browse all segments if you want to explore the full catalog.
        </p>
        <Link
          href="/products#product-categories"
          className="mt-4 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Browse all product segments
        </Link>
      </div>
    </div>
  );
}
