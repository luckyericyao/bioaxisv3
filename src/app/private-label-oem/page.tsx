import type { Metadata } from "next";
import Link from "next/link";
import { SourcingIntakeForm } from "@/components/forms/SourcingIntakeForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpecTag } from "@/components/ui/SpecTag";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Private-Label & OEM-Style Consumables Sourcing | BioAxis",
  description:
    "Evaluate neutral-label, private-label, and OEM-style life science consumables sourcing paths with BioAxis support for documentation, samples, packaging, and recurring supply review.",
  path: "/private-label-oem"
});

const priorityCategories = [
  "Pipette tips",
  "Tubes, plates, and storage",
  "Filtration consumables",
  "PCR / qPCR plastics",
  "Cell culture plastics",
  "Automation-compatible consumables"
];

const conversionBlocks = [
  {
    title: "Pipette tips",
    body: "Include tip format, sterility, rack or reload style, documents, and recurring usage.",
    href: "/request-quote?requestType=quote&sourcePage=private-label-oem&need=pipette-tips-private-label"
  },
  {
    title: "Tubes and plates",
    body: "Include tube, plate or storage format, packaging, documents, and expected volumes.",
    href: "/request-quote?requestType=recurring-supply&sourcePage=private-label-oem&need=tubes-plates-recurring"
  },
  {
    title: "Filtration and PCR plastics",
    body: "Include product format, packaging, sample needs, and required supplier evidence.",
    href: "/request-quote?requestType=quote&sourcePage=private-label-oem&need=filtration-pcr-oem"
  }
];

export default function PrivateLabelOemPage() {
  return (
    <>
      <PageHero
        eyebrow="Private label / OEM"
        title="Private-label & OEM sourcing"
        subtitle="Share product specs, packaging or label needs, and recurring volumes to review neutral-label, private-label, or OEM-style feasibility."
        compact
        tight
        align="start"
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

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <SourcingIntakeForm
          requestType="private-label"
          sourcePage="/private-label-oem"
          title="Send product and volume needs"
          productFieldLabel="Product family, supplier line, or recurring demand"
          submitLabel="Discuss private-label sourcing"
          contextLocked
          compact
        />
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <SectionHeader title="Choose a review" />
        <div className="grid gap-3 lg:grid-cols-3">
          {conversionBlocks.map((block) => (
            <article key={block.title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <h3 className="text-base font-bold leading-6 text-bioaxis-text">{block.title}</h3>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{block.body}</p>
              <Link href={block.href} className="mt-5 inline-flex text-xs font-bold uppercase text-bioaxis-accent">
                Start review
              </Link>
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
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Review limits</p>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-bioaxis-muted">
            BioAxis does not claim factory ownership, guaranteed inventory, automatic interchangeability, fixed lead time, or final customer-side validation.
          </p>
        </div>
      </section>
    </>
  );
}
