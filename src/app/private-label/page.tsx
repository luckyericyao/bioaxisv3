import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpecTag } from "@/components/ui/SpecTag";

export const metadata: Metadata = {
  title: "Private Label / OEM Consumables | BioAxis",
  description:
    "Evaluate private-label, neutral-label, and OEM-style sourcing options for selected life science consumables with BioAxis support for specifications, samples, documentation, RFQs, and recurring supply planning.",
  alternates: {
    canonical: "/private-label"
  }
};

const audienceNeeds = [
  "Buyers who want alternative branding or neutral-label consumables.",
  "Distributors or lab suppliers looking for private-label supply options.",
  "Labs or procurement teams that need equivalent consumables with consistent documentation.",
  "Teams comparing branded, equivalent, and private-label supply paths."
];

const suitableProductAreas = [
  "Pipette tips and liquid handling consumables",
  "Tubes, plates, cryovials, and storage consumables",
  "Filtration consumables",
  "PCR / qPCR consumables",
  "Sample preparation consumables",
  "Selected cell culture support consumables"
];

const coordinationAreas = [
  "Specification alignment",
  "Packaging and label requirement collection",
  "Sample request coordination",
  "Documentation checklist",
  "Equivalent comparison",
  "RFQ preparation",
  "Recurring supply planning"
];

const buyerPreparation = [
  "Target product type",
  "Current brand or catalog number",
  "Required specs",
  "Packaging or label requirements",
  "Estimated annual or monthly usage",
  "Required documents",
  "Target market or use case"
];

export default function PrivateLabelPage() {
  return (
    <>
      <PageHero
        eyebrow="Private Label / OEM Consumables"
        title="Private Label / OEM Consumables"
        subtitle="Explore private-label, neutral-label, and OEM-style sourcing options for selected life science consumables."
      >
        <p className="max-w-3xl text-base leading-7 text-bioaxis-muted">
          BioAxis helps buyers evaluate whether selected consumables can be sourced under private-label or neutral-label arrangements, with attention to specifications, packaging, documentation, sample review, and recurring supply planning.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/request-quote?requestType=quote&sourcePage=private-label"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Discuss private-label sourcing
          </Link>
          <Link
            href="/request-quote?requestType=quote&sourcePage=private-label-product-list"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Submit a product list
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div>
          <SectionHeader
            title="What this is for"
            subtitle="Private-label and neutral-label discussions are most useful when buyers already know the product type, required specifications, use case, and documentation expectations."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/products" className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Back to Products
            </Link>
            <Link href="/equivalent-finder" className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Equivalent Finder
            </Link>
          </div>
        </div>
        <div className="grid gap-3">
          {audienceNeeds.map((need) => (
            <article key={need} className="border border-bioaxis-line bg-bioaxis-panel p-4">
              <p className="text-sm leading-6 text-bioaxis-muted">{need}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            title="Suitable product areas"
            subtitle="BioAxis can help evaluate selected consumable categories for private-label, neutral-label, or OEM-style sourcing discussions without assuming feasibility before supplier and documentation review."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {suitableProductAreas.map((area) => (
              <article key={area} className="border border-bioaxis-line bg-bioaxis-black p-5">
                <h2 className="text-lg font-bold uppercase leading-tight text-bioaxis-text">{area}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <ChecklistPanel title="What BioAxis can help coordinate" items={coordinationAreas} />
        <ChecklistPanel title="What buyers should prepare" items={buyerPreparation} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Compliance / limitation note</p>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            Private-label feasibility depends on product type, supplier qualification, documentation requirements, minimum order quantity, destination market, and regulatory/compliance constraints. BioAxis does not present private-label options as interchangeable with regulated products without buyer-side technical and compliance review.
          </p>
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">Private-label sourcing discussion</p>
            <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
              Prepare a careful RFQ path before discussing label or packaging options.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
              Share target products, specifications, packaging requirements, documents, and expected usage. BioAxis can help organize the request and discuss sourcing options where appropriate.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/request-quote?requestType=quote&sourcePage=private-label"
              className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-6 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
            >
              Discuss private-label sourcing
            </Link>
            <Link
              href="/request-quote?requestType=quote&sourcePage=private-label-product-list"
              className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              Submit a product list
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ChecklistPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <SpecTag key={item}>{item}</SpecTag>
        ))}
      </div>
    </section>
  );
}
