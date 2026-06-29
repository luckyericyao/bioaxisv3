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
  "Tubes, plates, and storage",
  "Filtration consumables",
  "PCR / qPCR plastics",
  "Cell culture plastics",
  "Automation-compatible consumables"
];

const reviewAreas = [
  "Recurring usage",
  "Packaging expectations",
  "Document requirements",
  "Sample path",
  "MOQ / lead-time discussion",
  "Backup source logic",
  "Category fit"
];

export default function PrivateLabelOemPage() {
  return (
    <>
      <PageHero
        eyebrow="Private-label / OEM-style sourcing"
        title="Private-label sourcing for recurring consumables demand"
        subtitle="BioAxis helps evaluate neutral-label, private-label, and OEM-style options across selected consumable categories, with documentation, sample, packaging, and recurring supply review."
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
          title="Built for recurring demand conversations."
          subtitle="Use this path when the product family, expected usage, packaging requirements, and documentation needs are worth reviewing before a standard spot quote."
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
          <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {priorityCategories.map((category) => (
              <li key={category}>
                <SpecTag>{category}</SpecTag>
                <span className="sr-only">.</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">What BioAxis does not claim</p>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-bioaxis-muted">
            BioAxis does not claim factory ownership, guaranteed inventory, automatic interchangeability, fixed lead time, or final customer-side validation. BioAxis can help coordinate evaluation, RFQ preparation, sample requests, packaging requirements, and documentation review.
          </p>
        </div>
      </section>
    </>
  );
}
