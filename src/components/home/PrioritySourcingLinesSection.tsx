import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const priorityLines = [
  {
    title: "Liquid Handling Consumables",
    description: "Pipette tips, reservoirs, robotic tips, sterile formats.",
    href: "/products/liquid-handling",
    cta: "Explore liquid handling"
  },
  {
    title: "Cell Culture Consumables",
    description: "Media, supplements, sera, vessels, passaging support.",
    href: "/products/cell-culture",
    cta: "Explore cell culture"
  },
  {
    title: "Filtration Consumables",
    description: "Syringe filters, bottle-top filters, membranes, and sterile formats.",
    href: "/products/sample-prep-filtration",
    cta: "Explore filtration"
  },
  {
    title: "Tubes, Plates & Storage",
    description: "Tubes, plates, cryovials, seals, racks, sample storage.",
    href: "/products/storage-cryopreservation",
    cta: "Explore storage"
  },
  {
    title: "PCR / qPCR Consumables",
    description: "PCR plates, tubes, strips, optical seals, qPCR plastics.",
    href: "/products/molecular-biology-pcr",
    cta: "Explore PCR"
  },
  {
    title: "Private Label / OEM",
    description: "Neutral-label and OEM-style sourcing discussions for recurring consumables demand.",
    href: "/private-label-oem",
    cta: "Discuss private label"
  }
];

export function PrioritySourcingLinesSection() {
  return (
    <section className="border-b border-bioaxis-line bg-bioaxis-black">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="max-w-4xl">
          <SectionHeader
            title="Priority sourcing lines"
            subtitle="Start with consumables where buyers often need equivalent review, samples, documentation checks, and recurring demand planning."
          />
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {priorityLines.map((line) => (
            <article
              key={line.title}
              className="group flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <h2 className="text-lg font-bold uppercase leading-tight text-bioaxis-text transition group-hover:text-bioaxis-accent">
                {line.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-bioaxis-muted">{line.description}</p>
              <div className="mt-5">
                <Link
                  href={line.href}
                  className="inline-flex min-h-9 items-center justify-center border border-bioaxis-accent px-3 text-xs font-bold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
                >
                  {line.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
