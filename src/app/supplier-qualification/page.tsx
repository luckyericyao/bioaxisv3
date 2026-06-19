import type { Metadata } from "next";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpecTag } from "@/components/ui/SpecTag";

export const metadata: Metadata = {
  title: "Supplier Qualification | BioAxis",
  description:
    "Review BioAxis supplier qualification approach for documentation review, lot traceability, sample-first evaluation, equivalent product validation, and recurring supply support.",
  alternates: {
    canonical: "/supplier-qualification"
  }
};

const documents = [
  "CoA",
  "SDS",
  "Sterility statement",
  "DNase/RNase-free statement",
  "Endotoxin information",
  "Material declaration",
  "Lot traceability",
  "Certificate of origin if applicable"
];

const qualificationAreas = [
  {
    title: "Supplier qualification approach",
    body: "BioAxis reviews supplier options by product category, sourcing fit, responsiveness, documentation path, and the specific requirements of the lab workflow."
  },
  {
    title: "Documentation review",
    body: "BioAxis helps request and organize supplier-provided documents where available so procurement and lab teams can review evidence before purchasing."
  },
  {
    title: "Lot traceability",
    body: "For products where lot-level review matters, BioAxis helps request traceability information and connects documentation needs to the product request."
  },
  {
    title: "Sample-first evaluation",
    body: "For critical consumables, BioAxis supports sample-first evaluation so teams can test fit before larger-volume purchasing or supplier switching."
  },
  {
    title: "Equivalent product validation",
    body: "Equivalent review compares dimensions, material, format, sterility, packaging, documentation, workflow fit, and sample testing criteria."
  },
  {
    title: "Recurring supply support",
    body: "BioAxis helps teams share usage rhythm, forecast quantity, delivery timing, and documentation requirements for repeat sourcing conversations."
  }
];

export default function SupplierQualificationPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust Center"
        title="Procurement confidence starts with clearer sourcing evidence."
        subtitle="BioAxis helps buyers review supplier-provided evidence through documentation requests, specification matching, sample-first evaluation, equivalent review, and recurring supply context. Certification, sterility, and quality claims remain tied to supplier-provided product documentation."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <SectionHeader
            title="What documents labs may request"
            subtitle="Documentation availability depends on the supplier, product family, and use case. BioAxis helps organize requests without making unsupported claims."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {documents.map((document) => (
              <SpecTag key={document}>{document}</SpecTag>
            ))}
          </div>
        </div>
        <ProcessSteps
          steps={[
            { title: "Define the requirement", body: "Share product family, current supplier, catalog number, application, and non-negotiable specifications." },
            { title: "Request evidence", body: "Ask for documents such as CoA, SDS, sterility, material, endotoxin, or lot information where available." },
            { title: "Evaluate before scale", body: "Use documentation review and sample testing to support switching, qualification, or recurring supply decisions." }
          ]}
        />
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {qualificationAreas.map((area) => (
            <article key={area.title} className="border border-bioaxis-line bg-bioaxis-panel p-6">
              <h2 className="text-xl font-bold uppercase text-bioaxis-text">{area.title}</h2>
              <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{area.body}</p>
            </article>
          ))}
        </div>
      </section>
      <CTASection
        title="Need documentation before a sourcing decision?"
        body="Send the product, supplier or catalog number if known, required documents, and intended workflow. BioAxis helps organize the documentation request and compatible sourcing path."
        primaryLabel="Request documentation"
        primaryHref="/request-quote?requestType=documentation"
        secondaryLabel="Submit current supplier/catalog number"
        secondaryHref="/equivalent-finder?requestType=equivalent"
      />
    </>
  );
}
