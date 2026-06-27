import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpecTag } from "@/components/ui/SpecTag";

export const metadata: Metadata = {
  title: "Private-Label & OEM-Style Consumables Sourcing | BioAxis",
  description:
    "Evaluate neutral-label, private-label, and OEM-style life science consumables sourcing paths with BioAxis support for documentation, samples, packaging, and recurring supply review.",
  alternates: {
    canonical: "/private-label-oem"
  }
};

const priorityCategories = [
  "Pipette tips",
  "Tubes and plates",
  "Sample storage",
  "Filtration consumables",
  "PCR / qPCR plastics",
  "Cell culture plastics",
  "Automation-compatible consumables"
];

const reviewAreas = [
  "Target product type and critical specs",
  "Neutral-label or private-label packaging requirements",
  "Documentation checklist and supplier evidence path",
  "Sample request and buyer-side evaluation",
  "Equivalent comparison against current products",
  "Recurring supply rhythm and RFQ preparation"
];

export default function PrivateLabelOemPage() {
  return (
    <>
      <PageHero
        eyebrow="Private-label / OEM-style sourcing"
        title="Private-label and OEM-style consumables sourcing for recurring lab supply."
        subtitle="BioAxis helps evaluate neutral-label, private-label, and OEM-style options across selected life-science consumable categories, with documentation, sample, packaging, and recurring supply review."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/request-quote?requestType=quote&sourcePage=private-label-oem&need=private-label"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Discuss private-label sourcing
          </Link>
          <Link
            href="/request-quote?requestType=recurring-supply&sourcePage=private-label-oem&need=recurring-supply"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request recurring supply review
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <SectionHeader
          title="A commercial lane, not a marketplace listing."
          subtitle="BioAxis does not claim factory ownership, guaranteed inventory, fixed lead time, or automatic interchangeability. The page is for careful sourcing discussions where product type, specs, packaging, documentation, and usage volume can be reviewed."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {reviewAreas.map((area) => (
            <article key={area} className="border border-bioaxis-line bg-bioaxis-panel p-4">
              <p className="text-sm font-semibold uppercase leading-6 text-bioaxis-steel">{area}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            title="Priority categories"
            subtitle="Private-label or OEM-style feasibility depends on product type, supplier qualification, documentation requirements, MOQ, destination market, and buyer-side compliance review."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {priorityCategories.map((category) => (
              <SpecTag key={category}>{category}</SpecTag>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Careful sourcing note</p>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-bioaxis-muted">
            BioAxis can help coordinate evaluation, RFQ preparation, sample requests, packaging requirement collection, and documentation review. Final suitability, regulatory use, and quality release decisions remain buyer-side responsibilities.
          </p>
        </div>
      </section>
    </>
  );
}
