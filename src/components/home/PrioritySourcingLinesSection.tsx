import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageVisuals, segmentVisuals } from "@/data/visualAssets";

const priorityLines = [
  {
    title: "Liquid Handling Consumables",
    description: "Pipette tips, reservoirs, robotic tips, sterile formats.",
    href: "/products/liquid-handling",
    cta: "Explore liquid handling",
    image: segmentVisuals["liquid-handling"]
  },
  {
    title: "Cell Culture Consumables",
    description: "Media, supplements, sera, vessels, passaging support.",
    href: "/products/cell-culture",
    cta: "Explore cell culture",
    image: segmentVisuals["cell-culture"]
  },
  {
    title: "Filtration Consumables",
    description: "Syringe filters, bottle-top filters, membranes, and sterile formats.",
    href: "/products/sample-prep-filtration",
    cta: "Explore filtration",
    image: segmentVisuals["sample-prep-filtration"]
  },
  {
    title: "Tubes, Plates & Storage",
    description: "Tubes, plates, cryovials, seals, racks, sample storage.",
    href: "/products/storage-cryopreservation",
    cta: "Explore storage",
    image: segmentVisuals["storage-cryopreservation"]
  },
  {
    title: "PCR / qPCR Consumables",
    description: "PCR plates, tubes, strips, optical seals, qPCR plastics.",
    href: "/products/molecular-biology-pcr",
    cta: "Explore PCR",
    image: segmentVisuals["molecular-biology-pcr"]
  },
  {
    title: "Private Label / OEM",
    description: "Neutral-label and OEM-style sourcing discussions for recurring consumables demand.",
    href: "/private-label-oem",
    cta: "Discuss private label",
    image: pageVisuals.privateLabelOem
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
              className="group flex h-full flex-col overflow-hidden border border-bioaxis-line bg-bioaxis-panel transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <div className="relative aspect-[16/9] border-b border-bioaxis-line bg-bioaxis-black">
                <Image
                  src={line.image.src}
                  alt={line.image.alt}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bioaxis-black/70 via-transparent to-transparent" aria-hidden="true" />
              </div>
              <div className="flex flex-1 flex-col p-5">
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
