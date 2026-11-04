import type { Metadata } from "next";
import Link from "next/link";
import { CompactSourcingIntake } from "@/components/forms/CompactSourcingIntake";
import { PageHero } from "@/components/ui/PageHero";
import { buildRequestHref } from "@/data/productTaxonomy";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Equivalent Review | BioAxis",
  description:
    "Send BioAxis a catalog number, supplier, product description, or specification sheet for equivalent consumables review.",
  path: "/equivalent-finder"
});

const intakePriorities = [
  "Format match",
  "Sterility",
  "Material",
  "Low retention / binding",
  "Automation compatibility",
  "Packaging",
  "Documentation",
  "Price / availability",
  "Sample before switching"
];

const commonEquivalentRequests = [
  "Pipette tips",
  "Filter tips",
  "Centrifuge tubes",
  "Cell culture plates",
  "Cryovials",
  "Syringe filters",
  "Bottle-top filters",
  "PCR plates and seals",
  "Automation tips",
  "Single-use bags and connectors"
];

const comparisonRows = [
  {
    area: "Supplier / SKU",
    candidate: "Candidate supplier name, catalog number, or sourcing reference once identified",
    notes: "Check whether the candidate maps to the buyer's current product and procurement context."
  },
  {
    area: "Format / volume",
    candidate: "Tip volume, plate format, tube size, membrane diameter, pore size, or other physical format",
    notes: "Confirm physical compatibility before equivalent review or sample request."
  },
  {
    area: "Material",
    candidate: "Resin, membrane, polymer, coating, and chemical-compatibility attributes",
    notes: "Review material fit against sample type, reagent exposure, assay chemistry, or cell-contact requirements."
  },
  {
    area: "Sterility",
    candidate: "Sterile claim, irradiation method, aseptic handling statement, and packaging status",
    notes: "Match sterility expectations to supplier evidence before requesting quotes or samples."
  },
  {
    area: "Low-retention / surface treatment",
    candidate: "Binding profile, surface treatment type, coating, and assay-impact considerations",
    notes: "Compare recovery, adsorption, wetting behavior, and protocol sensitivity before switching."
  },
  {
    area: "Packaging",
    candidate: "Rack, bulk, reload, individually wrapped, sleeve, and case-pack configuration",
    notes: "Confirm handling format, storage footprint, sterility boundary, and purchasing unit before RFQ."
  },
  {
    area: "Automation fit",
    candidate: "Deck compatibility, SBS footprint, conductivity, rack geometry, and barcode location",
    notes: "Review candidate geometry against instrument method, gripper/tip pickup behavior, and scan requirements."
  },
  {
    area: "Documentation available",
    candidate: "CoA, SDS, sterility certificate, material statement, and lot-level document package",
    notes: "Identify required evidence early so missing documents do not block sample or purchasing review."
  },
  {
    area: "Sample path",
    candidate: "Sample availability, minimum sample quantity, evaluation workflow, and acceptance criteria",
    notes: "Use sample review to test fit, handling, documentation, and workflow performance before larger demand."
  },
  {
    area: "Recurring supply feasibility",
    candidate: "MOQ, lead time, recurring usage, backup source, and packaging consistency",
    notes: "Assess repeat-demand feasibility without implying guaranteed inventory, pricing, or lead time."
  }
];

function requestHref(query?: string) {
  return buildRequestHref({
    requestType: "equivalent",
    query
  });
}

type EquivalentFinderPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function defaultEquivalentMessage({ query, supplier, need }: { query?: string; supplier?: string; need?: string }) {
  const providedContext = [supplier, query].filter(Boolean).join(" ").trim();

  if (providedContext) {
    return providedContext;
  }

  if (need?.toLowerCase().includes("compatible")) {
    return [
      "Need compatible equivalent review",
      "Current product or catalog number:",
      "Must match format, material, sterility, packaging:",
      "Workflow or instrument constraints:",
      "Documents or sample needed:"
    ].join("\n");
  }

  return "";
}

export default async function EquivalentFinderPage({ searchParams }: EquivalentFinderPageProps) {
  const params = await searchParams;
  const initialQuery = first(params?.catalog) ?? first(params?.query) ?? first(params?.product) ?? "";
  const initialSupplier = first(params?.supplier) ?? "";
  const initialNeed = first(params?.need) ?? "";
  const defaultMessage = defaultEquivalentMessage({
    query: initialQuery,
    supplier: initialSupplier,
    need: initialNeed
  });

  return (
    <>
      <PageHero
        eyebrow="Equivalent review"
        title="Review consumable alternatives"
        subtitle="Send your current product or catalog number and must-match requirements. This starts a sourcing review; it does not automatically return verified alternatives."
        compact
        tight
        align="start"
      >
        <div className="grid gap-3">
          <details className="border border-bioaxis-line bg-white shadow-[0_18px_55px_rgba(15,76,129,0.08)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-bold uppercase text-bioaxis-text outline-none transition hover:bg-bioaxis-panelSoft focus-visible:ring-2 focus-visible:ring-bioaxis-accent [&::-webkit-details-marker]:hidden">
              <span>Start review</span>
              <span className="text-xs font-semibold text-bioaxis-accent">Email only to start · +</span>
            </summary>
            <div className="border-t border-bioaxis-line p-4 sm:p-5">
              <CompactSourcingIntake
                requestType="equivalent"
                sourcePage={initialQuery ? `/equivalent-finder?query=${encodeURIComponent(initialQuery)}` : "/equivalent-finder"}
                product={initialQuery}
                title="Send the current product."
                defaultMessage={defaultMessage}
                productFieldLabel="Current product, catalog number, or supplier line"
                submitLabel="Send review request"
                optionalChips={intakePriorities}
              />
            </div>
          </details>
          <Link
            href="/request-quote?type=sample&requestType=sample"
            className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent sm:justify-self-start"
          >
            Request sample first
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-3xl font-bold text-bioaxis-text sm:text-4xl">Choose a product type</h2>
          </div>
          <Link
            href={requestHref()}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request review
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {commonEquivalentRequests.map((request) => (
            <Link
              key={request}
              href={requestHref(request)}
              className="group border border-bioaxis-line bg-bioaxis-panel p-4 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <h3 className="text-sm font-bold leading-6 text-bioaxis-text transition group-hover:text-bioaxis-accent">{request}</h3>
              <span className="mt-4 block text-xs font-bold uppercase text-bioaxis-accent">Request review</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8">
          <h2 id="comparison-heading" className="text-3xl font-bold text-bioaxis-text sm:text-4xl">Compare requirements</h2>
        </div>
        <div className="overflow-x-auto border border-bioaxis-line bg-bioaxis-panel">
          <table aria-labelledby="comparison-heading" className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="text-xs font-bold uppercase text-bioaxis-dim">
                <th scope="col" className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">Review area</th>
                <th scope="col" className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">Candidate details to check</th>
                <th scope="col" className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">Review notes</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.area} className="align-top">
                  <th scope="row" className="border-b border-bioaxis-line px-4 py-4 text-sm font-semibold text-bioaxis-text">
                    {row.area}{" "}
                  </th>
                  <td className="border-b border-bioaxis-line px-4 py-4 text-sm leading-6 text-bioaxis-steel">
                    {row.candidate}{" "}
                  </td>
                  <td className="border-b border-bioaxis-line px-4 py-4 text-sm leading-6 text-bioaxis-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 border border-bioaxis-line bg-bioaxis-black p-5">
          <p className="text-sm leading-6 text-bioaxis-muted">
            Final suitability depends on supplier documentation, sample testing, and customer-side validation.
          </p>
        </div>
      </section>
    </>
  );
}
