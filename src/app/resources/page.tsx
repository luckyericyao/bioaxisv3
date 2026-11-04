import type { Metadata } from "next";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { resourceGuides } from "@/data/resources";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Resources | BioAxis",
  description:
    "Guides for smarter life science consumables sourcing, equivalents, RFQs, sterile formats, cell culture, PCR, and automation consumables.",
  path: "/resources"
});

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Consumables sourcing guides"
        subtitle="Choose a guide to check product fit, compare alternatives, or prepare a request."
        compact
      />
      <section aria-label="Sourcing guides" className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 md:grid-cols-2 xl:grid-cols-3 lg:px-10">
        {resourceGuides.map((guide) => (
          <ResourceCard key={guide.id} guide={guide} />
        ))}
      </section>
      <CTASection
        title="Start a sourcing request"
        body="Send product names, catalog numbers, specifications, and workflow requirements."
        primaryLabel="Send product context"
        primaryHref="/request-quote?requestType=product-list-review&sourcePage=%2Fresources"
      />
    </>
  );
}
