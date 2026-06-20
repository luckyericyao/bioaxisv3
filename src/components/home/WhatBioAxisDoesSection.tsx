import { MissionCard } from "@/components/ui/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cards = [
  {
    title: "Matched product family",
    body: "Product names, supplier numbers, and workflow notes are mapped into the right segment, category, and family context."
  },
  {
    title: "Equivalent review path",
    body: "Current products can be organized for format, fit, documentation, sample, and quote review."
  },
  {
    title: "Quote-ready fields",
    body: "BioAxis structures the useful fields: product, quantity, timeline, documents, and usage rhythm."
  },
  {
    title: "Sample and documentation path",
    body: "Sample needs and supplier-provided documents can be attached to the request when they matter."
  }
];

export function WhatBioAxisDoesSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeader
        title="What BioAxis returns"
        subtitle="A search, product page, or pasted list becomes the next useful sourcing step."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MissionCard key={card.title} title={card.title} body={card.body} />
        ))}
      </div>
    </section>
  );
}
