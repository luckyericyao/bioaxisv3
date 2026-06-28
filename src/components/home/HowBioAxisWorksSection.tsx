import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    title: "Paste what you have",
    body: "SKU, catalog number, product name, supplier line, spreadsheet, or sourcing need."
  },
  {
    title: "BioAxis structures the request",
    body: "Product family, equivalent criteria, documentation needs, sample path, and quote fields."
  },
  {
    title: "Move to sourcing follow-up",
    body: "BioAxis follows up with the missing context needed for equivalent review, documents, samples, or quote next steps."
  }
];

export function HowBioAxisWorksSection() {
  return (
    <section className="border-t border-bioaxis-line bg-bioaxis-black">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <SectionHeader
          title="How BioAxis works"
          subtitle="A lightweight intake flow for consumables sourcing, not a live-inventory storefront."
        />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <span className="text-xs font-bold text-bioaxis-dim">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-4 text-lg font-bold uppercase leading-tight text-bioaxis-text">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
