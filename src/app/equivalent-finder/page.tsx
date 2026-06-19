import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { buildRequestHref } from "@/data/productTaxonomy";

export const metadata: Metadata = {
  title: "Equivalent Finder | BioAxis",
  description:
    "Send BioAxis a catalog number, supplier, product description, or specification sheet for equivalent consumables review.",
  alternates: {
    canonical: "/equivalent-finder"
  }
};

const comparisonInputs = [
  "current supplier and catalog number",
  "dimensions, material, and surface treatment",
  "sterile status, packaging, and lot requirements",
  "instrument, plate reader, liquid handler, or workflow fit",
  "CoA, SDS, sterility, DNase/RNase-free, endotoxin, or material documents",
  "sample testing criteria before switching"
];

const commonEquivalentRequests = [
  "Pipette tips",
  "PCR/qPCR plates",
  "Syringe filters",
  "Cryovials",
  "Automation-compatible tips",
  "Assay plates",
  "Storage plates",
  "HPLC/LC-MS vials"
];

const fitComparisonDimensions = [
  "Format and dimensions",
  "Material and surface treatment",
  "Sterile / clean claims",
  "Instrument or workflow compatibility",
  "Packaging and volume",
  "Documentation availability",
  "Sample-first evaluation path"
];

const switchingSteps = [
  {
    title: "Send current product or catalog number",
    body: "Share the supplier name, catalog number, product description, or spec sheet when available."
  },
  {
    title: "Compare specifications and documentation",
    body: "BioAxis helps compare format, material, clean claims, packaging, workflow fit, and available documents."
  },
  {
    title: "Request sample or quote before switching",
    body: "Use a sample-first path or quote review before changing critical recurring consumables."
  }
];

function cleanListItem(item: string) {
  return item.replace(/^\s*(?:[-*•]\s*)+/, "").trim();
}

type EquivalentFinderPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EquivalentFinderPage({ searchParams }: EquivalentFinderPageProps) {
  const params = await searchParams;
  const equivalentRequestHref = buildRequestHref({
    requestType: "equivalent",
    segment: first(params?.segment),
    subcategory: first(params?.subcategory) ?? first(params?.category),
    family: first(params?.family),
    product: first(params?.product)
  });

  return (
    <>
      <PageHero
        eyebrow="Equivalent finder"
        title="Send the catalog number or spec. BioAxis helps compare the fit."
        subtitle="BioAxis helps compare format, material, sterility, packaging, documentation, and application fit so labs can evaluate supplier alternatives without guessing from product names alone."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={equivalentRequestHref}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Start equivalent request
          </Link>
          <Link
            href="/samples"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request sample first
          </Link>
        </div>
      </PageHero>
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">What to send</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-bioaxis-muted">
            {comparisonInputs.map((input) => (
              <li key={input} className="border border-white/[0.1] bg-bioaxis-black px-4 py-3 text-bioaxis-steel">
                {cleanListItem(input)}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">How BioAxis reviews equivalents</h2>
          <p className="mt-5 text-sm leading-6 text-bioaxis-muted">
            BioAxis helps compare compatible options across practical sourcing dimensions. Final suitability depends on customer validation in the intended workflow.
          </p>
          <Link
            href={equivalentRequestHref}
            className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Submit current product
          </Link>
        </div>
      </section>
      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Common equivalent requests</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {commonEquivalentRequests.map((request) => (
              <span key={request} className="border border-bioaxis-line bg-bioaxis-black px-4 py-3 text-sm font-semibold uppercase text-bioaxis-steel">
                {request}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-10">
        <div>
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">How BioAxis compares fit</h2>
          <p className="mt-5 text-sm leading-6 text-bioaxis-muted">
            Equivalent review is not a name match. BioAxis helps organize the details that affect practical substitution, sample-first evaluation, and quote follow-up.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {fitComparisonDimensions.map((dimension) => (
            <div key={dimension} className="border border-bioaxis-line bg-bioaxis-panel p-4 text-sm font-semibold uppercase leading-6 text-bioaxis-steel">
              {dimension}
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Safer switching path</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-bioaxis-muted">
            BioAxis helps compare compatible options. Final suitability depends on customer validation.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {switchingSteps.map((step, index) => (
            <article key={step.title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-accent">Step {(index + 1).toString().padStart(2, "0")}</p>
              <h3 className="mt-4 text-lg font-bold uppercase leading-snug text-bioaxis-text">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
