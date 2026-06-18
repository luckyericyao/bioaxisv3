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
        subtitle="Learn how to choose the right consumables, evaluate equivalents, prepare RFQs, and optimize your lab workflow."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-2 xl:grid-cols-3 lg:px-10">
        {resourceGuides.map((guide) => (
          <ResourceCard key={guide.id} guide={guide} />
        ))}
      </section>
      <CTASection
        title="Need sourcing support before the guide is published?"
        body="Send your product names, catalog numbers, specifications, and workflow context. BioAxis helps organize quote, sample, equivalent, and documentation support where applicable."
        primaryLabel="Request sourcing support"
        primaryHref="/request-quote"
      />
    </>
  );
}

