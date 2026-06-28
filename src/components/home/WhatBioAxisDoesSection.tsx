import { MissionCard } from "@/components/ui/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cards = [
  {
    title: "Matched product family",
    body: "Your SKU, product name, or list is mapped into sourcing context."
  },
  {
    title: "Equivalent review path",
    body: "Comparable options are structured around fit, documents, and samples."
  },
  {
    title: "Quote-ready fields",
    body: "Product, quantity, timing, documents, and usage rhythm are organized."
  },
  {
    title: "Sample and documentation path",
    body: "Sample needs and supplier evidence stay attached to the request."
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
