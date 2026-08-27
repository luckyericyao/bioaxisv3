import type { Metadata } from "next";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Supplier Qualification | BioAxis",
  description:
    "Review BioAxis supplier qualification approach for documentation review, lot traceability, sample-first evaluation, equivalent product validation, and recurring supply support.",
  path: "/supplier-qualification"
});

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

const buyerInputs = [
  "Supplier or brand under review",
  "Product family or catalog reference",
  "Required documents",
  "Critical specification or workflow",
  "Sample or pilot evaluation need",
  "Recurring usage or backup-source context"
];

const qualificationAreas = [
  {
    title: "Supplier qualification approach",
    body: "BioAxis organizes supplier options by product category, sourcing fit, responsiveness, documentation path, and the specific requirements of the lab workflow."
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
        title="Supplier evidence review before switching or scaling."
        subtitle="BioAxis helps buyers organize supplier-provided evidence through documentation requests, specification matching, sample-first evaluation, equivalent review, and recurring supply context. Certification, sterility, and quality claims remain tied to supplier-provided product documentation."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <SectionHeader
            title="What evidence buyers may request"
            subtitle="Documentation availability depends on the supplier, product family, and use case. BioAxis helps organize requests without making unsupported claims or replacing buyer-side qualification."
          />
          <ul className="mt-8 grid gap-2 text-sm leading-6 text-bioaxis-muted sm:grid-cols-2">
            {documents.map((document) => (
              <li key={document} className="border-l border-bioaxis-accent/40 pl-3">
                {document}
              </li>
            ))}
          </ul>
        </div>
        <ProcessSteps
          steps={[
            { title: "Define the requirement", body: "Share product family, current supplier, catalog number, application, and non-negotiable specifications." },
            { title: "Request evidence", body: "Ask for documents such as CoA, SDS, sterility, material, endotoxin, or lot information where available." },
            { title: "Evaluate before scale", body: "Use documentation review and sample testing to support switching, buyer-side qualification, or recurring supply decisions." }
          ]}
        />
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 border border-bioaxis-line bg-bioaxis-black p-5 sm:p-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-bioaxis-accent">Supplier review request</p>
            <h2 className="mt-4 text-2xl font-bold uppercase text-bioaxis-text sm:text-3xl">
              Send supplier context before committing to a switch.
            </h2>
            <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
              BioAxis can help organize the supplier, product, document, sample, and recurring supply context so your team can review evidence with fewer loose threads.
            </p>
          </div>
          <ul className="grid gap-2 text-sm leading-6 text-bioaxis-muted sm:grid-cols-2">
            {buyerInputs.map((item) => (
              <li key={item} className="border border-white/[0.12] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
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
        title="Need supplier evidence before a sourcing decision?"
        body="Send the supplier, product family or catalog reference, required documents, intended workflow, and sample or recurring usage needs. BioAxis helps organize the evidence request and compatible sourcing path."
        primaryLabel="Request supplier evidence review"
        primaryHref="/request-quote?requestType=documentation&sourcePage=%2Fsupplier-qualification&supportPath=documentation-review"
        secondaryLabel="Compare current supplier product"
        secondaryHref="/equivalent-finder?sourcePage=%2Fsupplier-qualification&supportPath=equivalent-review"
      />
    </>
  );
}
