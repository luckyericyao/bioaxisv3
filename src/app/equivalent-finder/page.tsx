import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { buildRequestHref } from "@/data/productTaxonomy";

export const metadata: Metadata = {
  title: "Find Compatible Alternatives | BioAxis",
  description:
    "Send BioAxis a catalog number, supplier, product description, or specification sheet for equivalent consumables review.",
  alternates: {
    canonical: "/equivalent-finder"
  }
};

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

export default async function EquivalentFinderPage({ searchParams }: EquivalentFinderPageProps) {
  const params = await searchParams;
  const initialQuery = first(params?.catalog) ?? first(params?.query) ?? first(params?.product) ?? "";
  const initialSupplier = first(params?.supplier) ?? "";

  return (
    <>
      <PageHero
        eyebrow="Equivalent finder"
        title="Find compatible alternatives for your current consumables"
        subtitle="Equivalent review is not a name match. BioAxis compares practical fit across format, material, sterility, packaging, workflow constraints, documents, samples, and recurring supply needs."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={requestHref()}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Start equivalent review
          </Link>
          <Link
            href="/request-quote?type=sample&requestType=sample"
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request sample first
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <form action="/request-quote" method="get" className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-6">
          <input type="hidden" name="type" value="equivalent" />
          <input type="hidden" name="requestType" value="equivalent" />
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Equivalent intake</p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Send the current product context.</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold uppercase text-bioaxis-steel">
              Current product or catalog number
              <input
                name="query"
                defaultValue={initialQuery}
                className="field-focus min-h-12 border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text placeholder:text-bioaxis-dim"
                placeholder="Supplier SKU, catalog number, or product name"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold uppercase text-bioaxis-steel">
              Current brand / supplier
              <input
                name="supplier"
                defaultValue={initialSupplier}
                className="field-focus min-h-12 border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text placeholder:text-bioaxis-dim"
                placeholder="Current supplier or brand"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold uppercase text-bioaxis-steel md:col-span-2">
              Product type
              <input
                name="productCategory"
                className="field-focus min-h-12 border border-bioaxis-line bg-bioaxis-black px-4 text-base text-bioaxis-text placeholder:text-bioaxis-dim"
                placeholder="Pipette tips, cryovials, PCR plates, syringe filters..."
              />
            </label>
            <fieldset className="md:col-span-2">
              <legend className="mb-3 text-sm font-semibold uppercase text-bioaxis-steel">What matters most?</legend>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {intakePriorities.map((priority) => (
                  <label key={priority} className="flex min-h-10 items-center gap-2 border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                    <input type="checkbox" name="need" value={priority} className="h-4 w-4 accent-bioaxis-accent" />
                    <span>{priority}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Start equivalent review
          </button>
        </form>

        <aside className="border border-bioaxis-line bg-bioaxis-black p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Fit assessment, not a name match.</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            BioAxis turns current-product information into a practical alternatives review across fit, evidence, sample path, and sourcing follow-up.
          </p>
          <div className="mt-6 grid gap-2">
            {["Format, material, sterility, packaging", "Workflow fit and automation constraints", "Documentation and sample path"].map((item) => (
              <div key={item} className="border border-white/[0.1] bg-bioaxis-panel px-4 py-3 text-sm font-semibold uppercase text-bioaxis-steel">
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Comparison matrix</p>
            <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">A cleaner way to compare alternatives.</h2>
          </div>
          <p className="text-sm leading-6 text-bioaxis-muted">
            BioAxis structures the inputs buyers need before requesting candidates, samples, documentation, or quotes.
          </p>
        </div>
        <div className="overflow-x-auto border border-bioaxis-line bg-bioaxis-panel">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="text-xs font-bold uppercase text-bioaxis-dim">
                <th className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">Current product</th>
                <th className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">Candidate option</th>
                <th className="border-b border-bioaxis-line bg-bioaxis-black px-4 py-4">Review notes</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.area} className="align-top">
                  <td className="border-b border-bioaxis-line px-4 py-4 text-sm font-semibold uppercase text-bioaxis-text">
                    {row.area}{" "}
                  </td>
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
            BioAxis supports equivalent review and sourcing comparison. Final suitability depends on supplier documentation, sample testing, and customer-side validation.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Common equivalent requests</p>
            <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Start with the current product type.</h2>
          </div>
          <Link
            href={requestHref()}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request equivalent
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {commonEquivalentRequests.map((request) => (
            <Link
              key={request}
              href={requestHref(request)}
              className="group border border-bioaxis-line bg-bioaxis-panel p-4 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <h3 className="text-sm font-bold uppercase leading-6 text-bioaxis-text transition group-hover:text-bioaxis-accent">{request}</h3>
              <span className="mt-4 block text-xs font-bold uppercase text-bioaxis-accent">Request equivalent</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
