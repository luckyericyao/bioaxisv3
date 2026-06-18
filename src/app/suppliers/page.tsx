import type { Metadata } from "next";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Suppliers & Coverage | BioAxis",
  description:
    "BioAxis helps labs navigate supplier options, equivalents, quote coordination, sample support, and recurring supply planning with careful sourcing-platform language.",
  alternates: {
    canonical: "/suppliers"
  }
};

export default function SuppliersPage() {
  return (
    <>
      <PageHero
        eyebrow="Supplier coverage"
        title="One platform for supplier options, equivalents, and quote support."
        subtitle="BioAxis helps labs navigate fragmented consumables sourcing by comparing supplier options, identifying equivalent formats, and coordinating quotes."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeader
          title="Why sourcing is fragmented"
          subtitle="Life science consumables sourcing often spans multiple catalogs, formats, brands, specifications, and documentation paths. BioAxis helps organize the comparison with supplier-option and documentation context."
        />
        <div className="mt-10">
          <ProcessSteps
            steps={[
              { title: "Multi-supplier sourcing support", body: "Submit product families, supplier names, catalog numbers, or required specifications. BioAxis helps organize supplier options where available." },
              { title: "Equivalent options", body: "BioAxis helps identify compatible formats and alternatives based on specifications, workflow fit, and sample needs." },
              { title: "Quote coordination", body: "BioAxis helps prepare quote requests and recurring supply context so supplier review can start from clearer requirements." }
            ]}
          />
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 pb-16 sm:px-8 md:grid-cols-3 lg:px-10">
        {[
          { title: "Sample support", body: "Request samples where available before switching supplier or scaling volume." },
          { title: "Recurring supply planning", body: "Share expected usage and timelines so BioAxis can support longer-term sourcing decisions." },
          { title: "Supplier list review", body: "Submit current suppliers, product names, or catalog numbers so BioAxis can help organize review." }
        ].map((item) => (
          <article key={item.title} className="border border-bioaxis-line bg-bioaxis-panel p-6">
            <h2 className="text-xl font-bold uppercase text-bioaxis-text">{item.title}</h2>
            <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{item.body}</p>
          </article>
        ))}
      </section>
      <CTASection
        title="Submit supplier options for review"
        body="Send your supplier list, product descriptions, catalog numbers, specifications, and usage needs. BioAxis helps organize equivalent options, quote support, samples, and recurring supply context."
        primaryLabel="Submit supplier list for review"
        primaryHref="/request-quote"
        secondaryLabel="Find equivalents across suppliers"
        secondaryHref="/equivalents"
      />
    </>
  );
}
