import type { Metadata } from "next";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Trust Center | BioAxis",
  description:
    "BioAxis trust center for documentation review, supplier screening, sample-first evaluation, equivalent review, and conservative sourcing claims.",
  alternates: {
    canonical: "/trust-center"
  }
};

const trustAreas = [
  {
    title: "Documentation review",
    body: "BioAxis helps request and organize supplier-provided CoA, SDS, sterility, material, lot-level, and specification documents where available."
  },
  {
    title: "Supplier screening",
    body: "BioAxis can help compare supplier options by product category, responsiveness, documentation path, and sourcing fit."
  },
  {
    title: "Sample-first evaluation",
    body: "For workflow-sensitive consumables, BioAxis can help coordinate sample requests before larger-volume or recurring sourcing."
  },
  {
    title: "Equivalent review",
    body: "Equivalent review compares format, volume, material, sterility, packaging, automation fit, documentation, and customer-side validation needs."
  },
  {
    title: "What BioAxis does not claim",
    body: "BioAxis does not claim live inventory for every listed product, automatic interchangeability, replacement of customer-side validation, or final regulatory or quality release decisions."
  }
];

export default function TrustCenterPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust Center"
        title="Clear sourcing evidence before procurement decisions."
        subtitle="BioAxis helps structure documentation review, supplier screening, sample-first evaluation, and equivalent review while avoiding unsupported claims about live inventory, automatic interchangeability, or final quality release decisions."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeader
          title="How BioAxis supports sourcing confidence"
          subtitle="The goal is to organize evidence and buyer review paths, not to replace supplier documentation or customer-side technical validation."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trustAreas.map((area) => (
            <article key={area.title} className="border border-bioaxis-line bg-bioaxis-panel p-6">
              <h2 className="text-xl font-bold uppercase text-bioaxis-text">{area.title}</h2>
              <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{area.body}</p>
            </article>
          ))}
        </div>
      </section>
      <CTASection
        title="Need documents or equivalent review before switching?"
        body="Paste the product, current supplier SKU, or product list. BioAxis can help organize documentation, sample, equivalent, and RFQ next steps."
        primaryLabel="Start RFQ"
        primaryHref="/request-quote?requestType=documentation&sourcePage=trust-center"
        secondaryLabel="Find equivalent"
        secondaryHref="/equivalent-finder?sourcePage=trust-center"
      />
    </>
  );
}
