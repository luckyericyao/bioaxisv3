import { MissionCard } from "@/components/ui/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cards = [
  {
    title: "Search Everything",
    body: "Search product families, catalog numbers, suppliers, equivalent options, and workflows from one place."
  },
  {
    title: "Source With Context",
    body: "Request quotes, sample evaluation, documentation support, recurring supply review, and product-list review without starting from a blank email."
  },
  {
    title: "Switch Carefully",
    body: "Compare compatible options by specification, format, documentation, and sample-first testing before changing suppliers."
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
