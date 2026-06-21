import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const priorityLines = [
  {
    title: "Cell Culture Media & Supplements",
    description: "Media, supplements, sera, buffers, and culture support materials for routine and specialized workflows.",
    cta: "Explore cell culture",
    href: "/products/cell-culture/media-and-supplements"
  },
  {
    title: "Liquid Handling Consumables",
    description: "Filtered tips, standard tips, reservoirs, and automation-compatible liquid handling formats.",
    cta: "Explore liquid handling",
    href: "/products/liquid-handling"
  },
  {
    title: "Filtration Consumables",
    description: "Syringe filters, bottle-top filters, membrane filters, and sterile filtration formats.",
    cta: "Explore filtration",
    href: "/products/sample-prep-filtration/syringe-filters"
  },
  {
    title: "Tubes, Plates & Storage",
    description: "Tubes, cryovials, plates, seals, and storage formats for sample handling and recurring lab use.",
    cta: "Explore storage formats",
    href: "/products/storage-cryopreservation"
  },
  {
    title: "PCR / qPCR Consumables",
    description: "PCR tubes, plates, seals, strips, and compatible formats for molecular biology workflows.",
    cta: "Explore PCR consumables",
    href: "/products/molecular-biology-pcr/pcr-plastics"
  },
  {
    title: "Sample Preparation Consumables",
    description: "Spin columns, extraction plates, cleanup formats, and workflow-specific sample prep supplies.",
    cta: "Explore sample prep",
    href: "/products/sample-prep-filtration/sample-cleanup"
  },
  {
    title: "Private Label / OEM Consumables",
    description:
      "Selected consumables where BioAxis can help evaluate private-label, neutral-label, or OEM-style sourcing options, including documentation, samples, packaging requirements, and RFQ preparation.",
    cta: "Explore private label options",
    href: "/private-label"
  }
];

export function PrioritySourcingLinesSection() {
  return (
    <section className="border-b border-bioaxis-line bg-bioaxis-black">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            title="Priority Sourcing Lines"
            subtitle="Start with the consumable categories where BioAxis can move fastest — equivalent review, sample coordination, documentation checks, and RFQ preparation."
          />
          <Link
            href="/request-quote?requestType=product-list-review"
            className="inline-flex min-h-11 shrink-0 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
          >
            Request quote with a product list
          </Link>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {priorityLines.map((line, index) => (
            <Link
              key={line.title}
              href={line.href}
              className="group flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <span className="text-xs font-bold text-bioaxis-dim">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-4 text-lg font-bold uppercase leading-tight text-bioaxis-text transition group-hover:text-bioaxis-accent">
                {line.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-bioaxis-muted">{line.description}</p>
              <span className="mt-5 inline-flex text-xs font-bold uppercase text-bioaxis-accent">
                {line.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
