import type { Metadata } from "next";
import Image from "next/image";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageVisuals } from "@/data/visualAssets";

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
  }
];

const trustMatrix = [
  {
    area: "CoA / SDS / sterility documents",
    helps: "Collect document requirements and request supplier-provided evidence.",
    buyer: "Review document suitability for the intended use."
  },
  {
    area: "Material / resin / specification review",
    helps: "Organize critical specs, materials, dimensions, and format needs.",
    buyer: "Confirm technical acceptance criteria."
  },
  {
    area: "Supplier screening",
    helps: "Compare supplier responsiveness, documentation path, and sourcing fit.",
    buyer: "Approve supplier qualification decisions."
  },
  {
    area: "Sample-first evaluation",
    helps: "Coordinate sample request context before larger-volume sourcing.",
    buyer: "Test samples in the intended workflow."
  },
  {
    area: "Equivalent review",
    helps: "Map current product context to compatible option review.",
    buyer: "Validate final suitability before substitution."
  },
  {
    area: "Recurring supply readiness",
    helps: "Organize usage rhythm, documentation needs, and RFQ follow-up.",
    buyer: "Confirm demand planning and quality requirements."
  }
];

const documentPackage = [
  "CoA",
  "SDS",
  "Sterility certificate",
  "Material statement",
  "Lot-level documentation",
  "Supplier specification sheet",
  "Packaging / format information",
  "Compatibility notes when supplier-provided"
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
        <div className="mt-4 overflow-hidden border border-bioaxis-line bg-bioaxis-black">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.35fr] lg:items-stretch">
            <div>
              <div className="relative min-h-[240px] border-b border-bioaxis-line bg-bioaxis-panel lg:h-full lg:border-b-0 lg:border-r">
                <Image
                  src={pageVisuals.trustDocuments.src}
                  alt={pageVisuals.trustDocuments.alt}
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bioaxis-black/70 via-transparent to-transparent" aria-hidden="true" />
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold uppercase text-bioaxis-accent">Document package BioAxis can help organize</p>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
                BioAxis can help organize document requirements and request supplier-provided evidence. BioAxis does not certify, release, validate, or approve final product suitability.
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {documentPackage.map((document) => (
                  <li key={document} className="border border-white/[0.12] bg-bioaxis-panel px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                    {document}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="overflow-x-auto border border-bioaxis-line bg-bioaxis-panel">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="text-xs font-bold uppercase text-bioaxis-dim">
                <th className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">Area</th>
                <th className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">What BioAxis helps organize</th>
                <th className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">What remains buyer-side</th>
              </tr>
            </thead>
            <tbody>
              {trustMatrix.map((row) => (
                <tr key={row.area} className="align-top">
                  <td className="border-b border-bioaxis-line px-4 py-4 text-sm font-bold uppercase text-bioaxis-text">
                    {row.area}{" "}
                  </td>
                  <td className="border-b border-bioaxis-line px-4 py-4 text-sm leading-6 text-bioaxis-steel">
                    {row.helps}{" "}
                  </td>
                  <td className="border-b border-bioaxis-line px-4 py-4 text-sm leading-6 text-bioaxis-muted">{row.buyer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">What BioAxis does not claim</p>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-bioaxis-muted">
            BioAxis does not claim live inventory for every listed product, automatic interchangeability, replacement of customer-side validation, or final regulatory or quality release decisions.
          </p>
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
