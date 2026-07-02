import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Ready Supply | BioAxis",
  description:
    "Priority lab consumable lines with stronger supplier access, clearer documentation paths, sample review, and faster quote handling.",
  alternates: {
    canonical: "/ready-supply"
  }
};

const readySupplyBoard = [
  ["Pipette & Robotic Tips", "Priority access"],
  ["PCR / qPCR Plastics", "Documentation-ready"],
  ["Tubes, Plates & Storage", "Recurring supply path"],
  ["Cell Culture Consumables", "Sample path available"],
  ["Filtration", "Quote-ready lines"],
  ["Private Label / OEM", "Packaging discussion"]
];

const confidenceCards = [
  {
    title: "Supplier visibility",
    body: "Selected lines with clearer access and faster response paths."
  },
  {
    title: "Documentation path",
    body: "CoA, sterility, RNase/DNase-free, material, and compliance documents can be checked early."
  },
  {
    title: "Sample access",
    body: "For qualified requests, sample routes can be reviewed before volume discussion."
  },
  {
    title: "Recurring supply",
    body: "Suitable lines can be evaluated for repeat purchasing, replacement sourcing, or private-label planning."
  }
];

const readySupplyLines = [
  {
    title: "Pipette Tips & Robotic Tips",
    description: "Manual, filtered, low-retention, sterile, and automation-compatible tip formats.",
    bestFor: ["Brand replacement", "Robotic platform compatibility checks", "Bulk and recurring demand"],
    tags: ["Filtered", "Low-retention", "Sterile", "Robotic-compatible"],
    cta: "Check tip availability",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&line=pipette-tips"
  },
  {
    title: "PCR / qPCR Plastics",
    description: "PCR tubes, strips, optical plates, sealing films, and qPCR-compatible plastic formats.",
    bestFor: ["Optical compatibility", "RNase/DNase-free documentation", "Equivalent review against current SKUs"],
    tags: ["qPCR-ready", "Optical", "RNase/DNase-free", "Equivalent review"],
    cta: "Check PCR plastics",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&line=pcr-qpcr-plastics"
  },
  {
    title: "Tubes, Plates & Storage",
    description: "Microcentrifuge tubes, cryovials, deep-well plates, racks, reservoirs, and storage formats.",
    bestFor: ["Recurring lab consumption", "Storage format replacement", "Bulk quote preparation"],
    tags: ["Cryo", "Deep-well", "Racks", "Bulk supply"],
    cta: "Check storage supply",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&line=tubes-plates-storage"
  },
  {
    title: "Cell Culture Consumables",
    description: "Culture plates, flasks, dishes, serological pipettes, sterile vessels, and workflow support formats.",
    bestFor: ["Sterile consumable sourcing", "Sample-first review", "Routine cell workflow support"],
    tags: ["Sterile", "TC-treated", "Sample path", "Routine demand"],
    cta: "Check cell culture lines",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&line=cell-culture-consumables"
  },
  {
    title: "Filtration",
    description: "Syringe filters, membranes, vacuum filtration, sterile filtration, and routine filtration formats.",
    bestFor: ["Membrane/material matching", "Sterile filtration documentation", "Fast replacement sourcing"],
    tags: ["PES", "PVDF", "PTFE", "Sterile"],
    cta: "Check filtration options",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&line=filtration"
  },
  {
    title: "Private Label / OEM Ready Lines",
    description:
      "Selected recurring-demand consumables where BioAxis can discuss neutral-label, packaging, document, and repeat supply paths.",
    bestFor: ["Distributor programs", "Neutral packaging", "Repeat-volume planning"],
    tags: ["Neutral label", "Packaging", "Recurring demand", "OEM path"],
    cta: "Discuss OEM-ready lines",
    href: "/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&line=private-label-oem-ready-lines"
  }
];

const useSteps = [
  "Current SKU or brand",
  "Required specification",
  "Estimated monthly / quarterly volume",
  "Documentation requirement",
  "Sample or delivery timeline"
];

export default function ReadySupplyPage() {
  return (
    <>
      <section className="border-b border-bioaxis-line px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.8fr)] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">Ready Supply</p>
            <h1 className="max-w-5xl text-5xl font-bold uppercase leading-[0.9] text-bioaxis-text sm:text-7xl lg:text-8xl">
              Ready Supply
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-bioaxis-muted sm:text-lg">
              Priority consumable lines where BioAxis has stronger supplier access, clearer documentation paths,
              and faster quote handling.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-bioaxis-muted">
              Built for buyers who need availability checks, equivalent options, sample paths, and recurring supply
              coordination without starting from a blank catalog search.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply">
                Request availability
              </CTAButton>
              <CTAButton
                href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&intent=send-sku"
                variant="secondary"
              >
                Send a SKU
              </CTAButton>
            </div>
          </div>

          <aside className="border border-bioaxis-line bg-bioaxis-black p-5 shadow-2xl shadow-slate-900/12">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-bioaxis-line pb-4">
              <div>
                <p className="text-xs font-bold uppercase text-bioaxis-accent">Ready Supply Board</p>
                <p className="mt-2 text-sm leading-6 text-bioaxis-muted">Priority lanes for access, documents, and quote handling.</p>
              </div>
              <span className="border border-white/[0.12] px-3 py-1 text-[11px] font-bold uppercase text-bioaxis-steel">
                Curated
              </span>
            </div>
            <div className="grid gap-2">
              {readySupplyBoard.map(([line, status]) => (
                <div key={line} className="grid gap-3 border border-white/[0.1] bg-bioaxis-panel px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <p className="text-sm font-bold uppercase leading-5 text-bioaxis-text">{line}</p>
                  <p className="text-xs font-semibold uppercase text-bioaxis-accent">{status}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {confidenceCards.map((card) => (
            <article key={card.title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <h2 className="text-sm font-bold uppercase text-bioaxis-text">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            title="Priority product lines"
            subtitle="Specific consumable lanes for availability checks, documentation readiness, sample review, equivalent sourcing, and recurring supply planning."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {readySupplyLines.map((line, index) => (
              <article key={line.title} className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-black p-6">
                <p className="text-xs font-bold uppercase text-bioaxis-accent">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-4 text-xl font-bold uppercase leading-6 text-bioaxis-text">{line.title}</h2>
                <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{line.description}</p>
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase text-bioaxis-dim">Best for</p>
                  <ul className="mt-3 grid gap-2">
                    {line.bestFor.map((item) => (
                      <li key={item} className="border border-white/[0.1] bg-bioaxis-panel px-3 py-2 text-sm leading-5 text-bioaxis-steel">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {line.tags.map((tag) => (
                    <li key={tag} className="border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase text-bioaxis-steel">
                      {tag}
                    </li>
                  ))}
                </ul>
                <CTAButton href={line.href} variant="secondary" className="mt-6">
                  {line.cta}
                </CTAButton>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <SectionHeader
          title="How to use Ready Supply"
          subtitle="Send us any of the following and BioAxis will review availability, equivalent options, document readiness, and practical supply paths."
        />
        <ol className="grid gap-3">
          {useSteps.map((step, index) => (
            <li key={step} className="grid gap-4 border border-bioaxis-line bg-bioaxis-panel p-5 sm:grid-cols-[72px_1fr] sm:items-center">
              <span className="text-xs font-bold uppercase text-bioaxis-accent">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-base font-bold uppercase text-bioaxis-text">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Not a real-time inventory feed</p>
          <p className="mt-4 max-w-4xl text-base leading-7 text-bioaxis-muted">
            Ready Supply is a curated supply-access layer for product lines where BioAxis has better supplier
            visibility, faster quote paths, or stronger recurring supply coordination.
          </p>
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">Ready Supply request</p>
            <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
              Send us your current SKU, brand, or required specification.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
              We will check availability, equivalents, documentation, sample paths, and supply options.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply">
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
