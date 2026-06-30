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
    <section className="border-b border-bioaxis-line bg-[radial-gradient(circle_at_8%_12%,rgba(56,189,248,0.13),transparent_24rem),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
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
              className="group flex h-full flex-col overflow-hidden border border-white/80 bg-white/[0.82] shadow-[0_20px_70px_rgba(15,76,129,0.10)] backdrop-blur transition hover:border-bioaxis-ice hover:bg-white"
            >
              <div className="relative aspect-[16/9] border-b border-bioaxis-line bg-bioaxis-panelSoft">
                <Image
                  src={line.image.src}
                  alt={line.image.alt}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover grayscale-[8%] saturate-[0.82] transition duration-500 group-hover:scale-[1.03] group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.12)_0%,rgba(15,76,129,0.10)_100%)]" aria-hidden="true" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold uppercase leading-tight text-bioaxis-text transition group-hover:text-bioaxis-accent">
                  {line.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-bioaxis-muted">{line.description}</p>
                <div className="mt-5">
                  <Link
                    href={line.href}
                    className="inline-flex min-h-9 items-center justify-center border border-bioaxis-accent px-3 text-xs font-bold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-white"
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
