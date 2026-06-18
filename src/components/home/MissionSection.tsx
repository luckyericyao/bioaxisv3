import { MissionCard } from "@/components/ui/MissionCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { brand } from "@/data/brand";

const cards = [
  {
    title: "Higher Quality",
    body: "Supplier screening, documentation support, and sample-first evaluation where applicable."
  },
  {
    title: "Faster Delivery",
    body: "Faster sourcing, quote response, and fulfillment coordination through a centralized platform."
  },
  {
    title: "Stronger Support",
    body: "Human support for product matching, alternative sourcing, and procurement questions."
  }
];

export function MissionSection() {
  return (
    <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <SectionHeader title={brand.mission.toUpperCase()} subtitle={brand.vision} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <MissionCard key={card.title} title={card.title} body={card.body} />
          ))}
        </div>
      </div>
    </section>
  );
}

