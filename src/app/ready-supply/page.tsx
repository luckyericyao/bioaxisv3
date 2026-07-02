import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/CTAButton";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Ready Supply | BioAxis",
  description:
    "BioAxis Ready Supply highlights selected consumable lines with stronger supplier access, clearer documentation paths, and faster quote handling.",
  alternates: {
    canonical: "/ready-supply"
  }
};

const readySupplyLines = [
  {
    title: "Pipette Tips & Robotic Tips",
    body: "Manual and automation-compatible tip formats where supplier access, sample paths, and documentation review can move quickly.",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&line=pipette-tips-robotic-tips"
  },
  {
    title: "PCR / qPCR Plastics",
    body: "PCR tubes, strips, plates, and optical sealing formats for molecular workflows that need clear compatibility and document context.",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&line=pcr-qpcr-plastics"
  },
  {
    title: "Tubes, Plates & Storage",
    body: "Tubes, plates, cryovials, racks, and storage formats for recurring sample handling and replacement sourcing needs.",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&line=tubes-plates-storage"
  },
  {
    title: "Cell Culture Consumables",
    body: "Culture vessels, media-adjacent consumables, sterile support formats, and sample-first sourcing paths for cell workflows.",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&line=cell-culture-consumables"
  },
  {
    title: "Filtration",
    body: "Syringe filters, membranes, sterile filtration formats, and documentation-ready options for routine lab use.",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&line=filtration"
  },
  {
    title: "Private Label / OEM Ready Lines",
    body: "Selected recurring-demand consumables where BioAxis can help discuss neutral-label, packaging, sample, and RFQ paths.",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&line=private-label-oem-ready-lines"
  }
];

const supportPoints = ["Availability visibility", "Documentation support", "Sample / quote path"];

export default function ReadySupplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Ready Supply"
        title="Ready Supply"
        subtitle="Priority consumable lines with stronger supplier access, clearer documentation paths, and faster quote handling."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/request-quote?requestType=quote&sourcePage=ready-supply">
            Request availability
          </CTAButton>
          <CTAButton href="/products" variant="secondary">
            Browse products
          </CTAButton>
        </div>
      </PageHero>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <SectionHeader
          title="Selected lines with clearer sourcing paths."
          subtitle="Ready Supply is not a live inventory marketplace. It highlights product lines where BioAxis has better visibility into availability, samples, documentation, and recurring supply coordination."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            "Stronger supplier access",
            "Better availability visibility",
            "Recurring supply coordination"
          ].map((item) => (
            <div key={item} className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <p className="text-sm font-bold uppercase text-bioaxis-text">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            title="Priority product lines"
            subtitle="Use this page when the buying question is availability, sample access, documentation path, or repeat supply planning before a formal RFQ."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {readySupplyLines.map((line, index) => (
              <article key={line.title} className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-black p-6">
                <p className="text-xs font-bold uppercase text-bioaxis-accent">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-4 text-xl font-bold uppercase leading-6 text-bioaxis-text">{line.title}</h2>
                <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{line.body}</p>
                <ul className="mt-6 grid gap-2">
                  {supportPoints.map((point) => (
                    <li key={point} className="border border-white/[0.12] bg-bioaxis-panel px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                      {point}
                    </li>
                  ))}
                </ul>
                <CTAButton href={line.href} variant="secondary" className="mt-6">
                  Request availability
                </CTAButton>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Ready Supply request</p>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
            Send us your current SKU, brand, or required specification.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
            We will check availability, equivalents, documentation, and supply options.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/request-quote?requestType=quote&sourcePage=ready-supply">
              Request availability
            </CTAButton>
            <CTAButton href="/equivalent-finder?sourcePage=ready-supply" variant="secondary">
              Find equivalent
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
