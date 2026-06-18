import { MissionCard } from "@/components/ui/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cards = [
  {
    title: "Search Everything",
    body: "Search products, catalog numbers, suppliers, equivalents, and workflows from one place."
  },
  {
    title: "Source Faster",
    body: "Request quotes, samples, and supplier options without jumping between fragmented catalogs."
  },
  {
    title: "Support Stronger",
    body: "Get support for product matching, alternatives, documentation, and sourcing questions."
  }
];

export function WhatBioAxisDoesSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeader title="SEARCH. SOURCE. SUPPORT." />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <MissionCard key={card.title} title={card.title} body={card.body} />
        ))}
      </div>
    </section>
  );
}

