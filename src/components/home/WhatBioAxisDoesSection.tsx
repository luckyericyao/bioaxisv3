import { MissionCard } from "@/components/ui/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cards = [
  {
    title: "Matched product family",
    body: "BioAxis helps map product names, supplier numbers, workflows, and specifications to the closest product family context."
  },
  {
    title: "Equivalent review path",
    body: "Current supplier and catalog numbers can be organized into a comparison path for format, fit, documentation, sample, and quote review."
  },
  {
    title: "Quote-ready fields",
    body: "Requests are structured around product, quantity, timeline, sterility, packaging, documentation, and usage rhythm."
  },
  {
    title: "Sample request path",
    body: "For switching-sensitive consumables, BioAxis can help request samples so teams can evaluate fit before larger-volume sourcing."
  },
  {
    title: "Documentation checklist",
    body: "BioAxis can help collect required supplier-provided documents such as CoA, SDS, sterility, material, and lot information where available."
  },
  {
    title: "Recurring supply planning",
    body: "Usage rhythm, delivery timing, pack format, and documentation needs can be organized for repeat sourcing conversations."
  }
];

export function WhatBioAxisDoesSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeader
        title="What BioAxis returns"
        subtitle="A search or product list becomes a structured sourcing path instead of a blank procurement email."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <MissionCard key={card.title} title={card.title} body={card.body} />
        ))}
      </div>
    </section>
  );
}
