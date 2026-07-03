import type { Metadata } from "next";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { resourceGuides } from "@/data/resources";

export const metadata: Metadata = {
  title: "Resources | BioAxis",
  description:
    "Guides for smarter life science consumables sourcing, equivalents, RFQs, sterile formats, cell culture, PCR, and automation consumables.",
  alternates: {
    canonical: "/resources"
  }
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Guides for smarter life science consumables sourcing."
        subtitle="Use each guide to clarify product fit, equivalent criteria, documentation needs, sample paths, and quote-ready sourcing inputs."
      />
      <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 border border-bioaxis-line bg-bioaxis-black p-5 sm:grid-cols-3 sm:p-6">
          {[
            { title: "Read the guide", body: "Clarify formats, documents, equivalent criteria, or sample needs." },
            { title: "Send the context", body: "Use the guide as a request starter with the topic already attached." },
            { title: "BioAxis structures next steps", body: "Move into RFQ, equivalent review, sample, documentation, or recurring supply follow-up." }
          ].map((step) => (
            <article key={step.title}>
              <h2 className="text-sm font-semibold uppercase text-bioaxis-accent">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-2 xl:grid-cols-3 lg:px-10">
        {resourceGuides.map((guide) => (
          <ResourceCard key={guide.id} guide={guide} />
        ))}
      </section>
      <CTASection
        title="Need sourcing support for a live product request?"
        body="Send your product names, catalog numbers, specifications, and workflow context. BioAxis helps organize quote, sample, equivalent, and documentation support where applicable."
        primaryLabel="Send product context"
        primaryHref="/request-quote?requestType=product-list-review&sourcePage=%2Fresources"
      />
    </>
  );
}
