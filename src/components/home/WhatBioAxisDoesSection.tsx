import Image from "next/image";
import { MissionCard } from "@/components/ui/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageVisuals } from "@/data/visualAssets";

const cards = [
  {
    title: "Matched product family",
    body: "BioAxis maps messy product input to the relevant segment, category, family, and sourcing template."
  },
  {
    title: "Equivalent review path",
    body: "BioAxis structures fit criteria such as format, material, sterility, packaging, documentation, and workflow use."
  },
  {
    title: "Sample and documentation path",
    body: "BioAxis identifies which supplier documents or sample steps are needed before switching."
  },
  {
    title: "Quote-ready fields",
    body: "BioAxis organizes supplier, SKU, quantity, timeline, documentation, and recurring usage context for follow-up."
  }
];

export function WhatBioAxisDoesSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeader
        title="What BioAxis returns"
        subtitle="A pasted SKU or list becomes a sourcing path your team can act on."
      />
      <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <div className="relative min-h-[260px] overflow-hidden border border-bioaxis-line bg-bioaxis-panel">
          <Image
            src={pageVisuals.structuredSourcingOutput.src}
            alt={pageVisuals.structuredSourcingOutput.alt}
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bioaxis-black/65 via-transparent to-transparent" aria-hidden="true" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <MissionCard key={card.title} title={card.title} body={card.body} />
          ))}
        </div>
      </div>
    </section>
  );
}
