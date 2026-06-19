import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

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

export default function EquivalentFinderPage() {
  return (
    <>
      <PageHero
        eyebrow="Equivalent finder"
        title="Send the catalog number or spec. BioAxis helps compare the fit."
        subtitle="BioAxis helps compare format, material, sterility, packaging, documentation, and application fit so labs can evaluate supplier alternatives without guessing from product names alone."
      >
        <Link
          href="/request-quote?requestType=equivalent"
          className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
        >
          Start equivalent request
        </Link>
      </PageHero>
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">What to send</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-bioaxis-muted">
            {comparisonInputs.map((input) => (
              <li key={input} className="border border-white/[0.1] bg-bioaxis-black px-4 py-3 text-bioaxis-steel">
                {input}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">How BioAxis reviews equivalents</h2>
          <p className="mt-5 text-sm leading-6 text-bioaxis-muted">
            Equivalent review focuses on practical sourcing compatibility: format, material, sterility, dimensions, packaging, workflow fit, documentation, and whether a sample-first evaluation is appropriate. BioAxis does not claim guaranteed equivalence; final suitability depends on customer validation.
          </p>
          <Link
            href="/request-quote?requestType=equivalent"
            className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Submit current product
          </Link>
        </div>
      </section>
    </>
  );
}
