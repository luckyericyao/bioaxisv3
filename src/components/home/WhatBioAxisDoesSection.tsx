import { MissionCard } from "@/components/ui/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MissionCard key={card.title} title={card.title} body={card.body} />
        ))}
      </div>
    </section>
  );
}
