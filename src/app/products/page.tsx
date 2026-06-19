import Link from "next/link";
import type { Metadata } from "next";
import { ProductCategoryGrid } from "@/components/products/ProductCategoryGrid";
import { ProductSearch } from "@/components/products/ProductSearch";
import { productTaxonomy } from "@/data/productTaxonomy";
import { workflows } from "@/data/workflows";

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

const buyerNeedCards = [
  {
    title: "Current supplier out of stock",
    body: "Send the supplier, catalog number, product description, quantity, and timing so BioAxis can help source available options.",
    href: "/request-quote?requestType=quote&need=supplier-out-of-stock"
  },
  {
    title: "Need lower-cost equivalent",
    body: "Share the current product and non-negotiable specifications so BioAxis can help compare candidate alternatives.",
    href: "/equivalent-finder?requestType=equivalent&need=lower-cost-equivalent"
  },
  {
    title: "Need sample before switching",
    body: "Request evaluation samples when fit, cells, assays, automation decks, or QC review could be affected.",
    href: "/request-quote?requestType=sample&need=sample-before-switching"
  },
  {
    title: "Need sterile / DNase-free documentation",
    body: "List required documents such as CoA, SDS, sterility, DNase/RNase-free, material, or lot information.",
    href: "/request-quote?requestType=documentation&need=sterile-dnase-documentation"
  },
  {
    title: "Need automation-compatible format",
    body: "Include liquid handler platform, rack format, conductivity, barcode needs, and validated method constraints.",
    href: "/request-quote?requestType=quote&need=automation-compatible-format"
  },
  {
    title: "Need recurring monthly supply",
    body: "Share expected usage rhythm, preferred pack size, shipping region, timeline, and documentation requirements.",
    href: "/request-quote?requestType=recurring-supply&need=monthly-supply"
  },
  {
    title: "Need quote from product list",
    body: "Paste product numbers, quantities, required documents, and delivery timing into a quote-ready sourcing list.",
    href: "/request-quote?requestType=product-list-review&need=product-list-quote"
  }
];

function BuyerEntryModes() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
      <div className="grid gap-5 lg:grid-cols-3">
        <article className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-xs font-bold uppercase text-bioaxis-accent">Browse by Product Type</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Start from the 12 BioAxis segments.</h2>
          <div className="mt-6 grid gap-2">
            {productTaxonomy.slice(0, 6).map((segment) => (
              <Link key={segment.slug} href={`/products/${segment.slug}`} className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                {segment.name}
              </Link>
            ))}
          </div>
          <Link href="#product-categories" className="mt-5 inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
            View all product types
          </Link>
        </article>

        <article className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-xs font-bold uppercase text-bioaxis-accent">Browse by Workflow</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Map what R&D teams are doing.</h2>
          <div className="mt-6 grid gap-2">
            {workflows.slice(0, 6).map((workflow) => (
              <Link key={workflow.slug} href={`/workflows#${workflow.slug}`} className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                {workflow.title}
              </Link>
            ))}
          </div>
          <Link href="/workflows" className="mt-5 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Explore workflows
          </Link>
        </article>

        <article className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <p className="text-xs font-bold uppercase text-bioaxis-accent">Browse by Buyer Need</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Start from the sourcing problem.</h2>
          <div className="mt-6 grid gap-2">
            {buyerNeedCards.map((need) => (
              <Link key={need.title} href={need.href} className="border border-bioaxis-line bg-bioaxis-black p-3 transition hover:border-bioaxis-accent">
                <span className="text-xs font-bold uppercase text-bioaxis-text">{need.title}</span>
                <span className="mt-2 block text-xs leading-5 text-bioaxis-muted">{need.body}</span>
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
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
              Search across BioAxis segments, categories, families, product configurations, specifications, applications, workflows, resources, aliases, and descriptions. Results are ranked for sourcing relevance before the full directory appears below.
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
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Browse by category", body: "Start from 12 product segments and move into category and family pages." },
                  { title: "Find an equivalent", body: "Submit a current supplier, catalog number, product description, or critical specification." },
                  { title: "Request quote or sample", body: "Share quantity, timeline, documentation needs, and evaluation requirements." }
                ].map((mode) => (
                  <article key={mode.title} className="border border-bioaxis-line bg-bioaxis-panel/70 p-4">
                    <h2 className="text-sm font-bold uppercase text-bioaxis-text">{mode.title}</h2>
                    <p className="mt-2 text-xs leading-5 text-bioaxis-muted">{mode.body}</p>
                  </article>
                ))}
              </div>
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

      {!query ? <BuyerEntryModes /> : null}

      <section id="product-categories" className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className={query ? "text-2xl font-bold uppercase text-bioaxis-text sm:text-3xl" : "text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl"}>
              {query ? "Browse all product segments" : "Browse the BioAxis product universe"}
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-bioaxis-muted">
              {query
                ? "Search results are ranked above. Use this compact directory when you want to browse across the full BioAxis product universe."
                : "Start with one of 12 top-level product segments. Each segment opens into category pages, product-family pages, sourcing-option previews, filters, and quote/sample/equivalent request paths."}
            </p>
          </div>
          <Link href="/workflows" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Browse workflows
          </Link>
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

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-panel p-6 sm:p-8">
          <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">How BioAxis sourcing works</p>
          <div className="grid gap-3 md:grid-cols-5">
            {[
              { title: "Search", body: "Start from a product category, supplier name, catalog number, workflow, or required specification." },
              { title: "Match", body: "BioAxis reviews format, material, sterility, compatibility, documentation, and equivalent options." },
              { title: "Quote", body: "Submit quantity, target date, packaging preference, and required documents." },
              { title: "Sample", body: "Request samples for fit, workflow compatibility, and switching evaluation." },
              { title: "Supply", body: "Support recurring sourcing needs once specifications and documentation are aligned." }
            ].map((step, index) => (
              <div key={step.title} className="border border-bioaxis-line bg-bioaxis-black p-4">
                <span className="text-xs font-bold text-bioaxis-dim">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-3 text-lg font-bold uppercase text-bioaxis-text">{step.title}</h2>
                <p className="mt-3 text-xs leading-5 text-bioaxis-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">Sourcing support</p>
            <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
              Not sure where to start?
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
              Send a product name, catalog number, supplier, workflow, or specification. BioAxis can help structure the request, compare equivalent options, prepare documentation needs, and support quote or sample follow-up.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href="/equivalent-finder?requestType=equivalent" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Find equivalent
            </Link>
            <Link href="/request-quote?requestType=quote" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-6 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent">
              Request quote
            </Link>
            <Link href="/request-quote?requestType=sample" className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Request sample
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
