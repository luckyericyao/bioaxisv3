import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpecTag } from "@/components/ui/SpecTag";
import { pageVisuals } from "@/data/visualAssets";

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

const conversionBlocks = [
  {
    title: "Pipette tips private-label review",
    body: "Review tip format, sterility, rack or reload style, documentation needs, and recurring usage before RFQ.",
    href: "/request-quote?requestType=quote&sourcePage=private-label-oem&need=pipette-tips-private-label"
  },
  {
    title: "Tubes / plates recurring demand review",
    body: "Organize tube, plate, storage, packaging, document, and volume context for repeat purchasing discussions.",
    href: "/request-quote?requestType=recurring-supply&sourcePage=private-label-oem&need=tubes-plates-recurring"
  },
  {
    title: "Filtration / PCR plastics OEM-style sourcing",
    body: "Compare filtration formats, PCR plastics, packaging expectations, sample path, and supplier evidence needs.",
    href: "/request-quote?requestType=quote&sourcePage=private-label-oem&need=filtration-pcr-oem"
  }
];

export default function PrivateLabelOemPage() {
  return (
    <>
      <PageHero
        eyebrow="Private-label / OEM-style sourcing"
        title="Private-label sourcing for recurring consumables demand"
        subtitle="BioAxis helps evaluate neutral-label, private-label, and OEM-style options across selected consumable categories, with documentation, sample, packaging, and recurring supply review."
      >
        <div className="relative mb-6 aspect-[16/9] overflow-hidden border border-bioaxis-line bg-bioaxis-panel">
          <Image
            src={pageVisuals.privateLabelOem.src}
            alt={pageVisuals.privateLabelOem.alt}
            fill
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bioaxis-black/70 via-transparent to-transparent" aria-hidden="true" />
        </div>
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
        <div className="grid gap-3 lg:grid-cols-3">
          {conversionBlocks.map((block) => (
            <article key={block.title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <h2 className="text-base font-bold uppercase leading-6 text-bioaxis-text">{block.title}</h2>
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
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">What BioAxis does not claim</p>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-bioaxis-muted">
            BioAxis does not claim factory ownership, guaranteed inventory, automatic interchangeability, fixed lead time, or final customer-side validation. BioAxis can help coordinate evaluation, RFQ preparation, sample requests, packaging requirements, and documentation review.
          </p>
        </div>
      </section>
    </>
  );
}
