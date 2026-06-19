import type { Metadata } from "next";
import { CTASection } from "@/components/ui/CTASection";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpecTag } from "@/components/ui/SpecTag";

export const metadata: Metadata = {
  title: "Quality & Documentation | BioAxis",
  description:
    "BioAxis helps request and organize supplier documentation, specification review, and sample-first evaluation where available.",
  alternates: {
    canonical: "/quality"
  }
};

const documentationExamples = [
  "CoA",
  "SDS",
  "Sterility information",
  "DNase/RNase-free information",
  "Material information",
  "Lot-level documentation where available",
  "Compatibility notes where available"
];

const trustSections = [
  {
    title: "Supplier qualification",
    body: "BioAxis supports review of supplier options by product category, documentation path, responsiveness, and suitability for the requested workflow."
  },
  {
    title: "CoA/SDS availability",
    body: "Common documentation requests include CoA, SDS, sterility statements, DNase/RNase-free information, material declarations, and storage conditions."
  },
  {
    title: "Sterility and clean claims",
    body: "For sterile, PCR-clean, endotoxin-sensitive, or cell culture workflows, BioAxis helps organize the supporting statements buyers need to review."
  },
  {
    title: "Lot traceability",
    body: "Where available, BioAxis helps request lot-level documentation so procurement and lab teams can connect received products to the relevant records."
  },
  {
    title: "Equivalent product validation",
    body: "Equivalent review compares format, material, dimensions, workflow fit, documentation, packaging, and sample testing needs before a switch."
  },
  {
    title: "Sample-first switching",
    body: "For critical consumables, BioAxis encourages sample-first evaluation before larger-volume purchasing or recurring supply planning."
  }
];

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust Center"
        title="Quality, documentation, and supplier confidence."
        subtitle="BioAxis helps buyers review supplier-provided evidence through documentation organization, supplier screening context, specification review, and sample-first switching support. Where available, we help request CoA, SDS, sterility information, material information, and lot-level documentation."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div>
          <SectionHeader
            title="Documentation support"
            subtitle="BioAxis helps request, organize, and support review of supplier documentation where available. Product documentation remains tied to the relevant supplier and product record."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {documentationExamples.map((item) => (
              <SpecTag key={item}>{item}</SpecTag>
            ))}
          </div>
        </div>
        <ComparisonTable
          rows={[
            { label: "Supplier screening", value: "BioAxis supports review of supplier options, product families, documentation paths, and sourcing context." },
            { label: "Specification matching", value: "BioAxis helps organize specifications such as material, sterility, format, volume, compatibility, and workflow fit." },
            { label: "Sample-first evaluation", value: "Where available, BioAxis supports sample requests so teams can evaluate quality, fit, and performance before larger-volume purchasing." },
            { label: "Human review", value: "A sourcing specialist can help review product matching, equivalent sourcing, and documentation needs with careful platform language." }
          ]}
        />
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Quality support areas</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trustSections.map((section) => (
            <article key={section.title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
              <h3 className="text-lg font-bold uppercase text-bioaxis-text">{section.title}</h3>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8 border border-bioaxis-line bg-bioaxis-black p-5">
          <p className="text-sm leading-6 text-bioaxis-muted">
            Certification, sterility, and quality claims remain tied to supplier-provided product documentation.
          </p>
        </div>
        <ProcessSteps
          steps={[
            { title: "Request documents", body: "Send product details, supplier or catalog number if known, and documentation needed." },
            { title: "Organize review", body: "BioAxis helps organize supplier documentation and specification information where available." },
            { title: "Support decision", body: "Use documentation, specification review, and sample-first evaluation to support sourcing decisions." }
          ]}
        />
      </section>
      <CTASection
        title="Need documentation before purchasing?"
        body="Submit product details and the documentation you need. BioAxis helps request and organize CoA, SDS, sterility, material, or lot-level documentation where available."
        primaryLabel="Request documentation support"
        primaryHref="/request-quote?requestType=documentation"
        secondaryLabel="Submit current supplier/catalog number"
        secondaryHref="/equivalent-finder?requestType=equivalent"
      />
    </>
  );
}
