import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Applications | BioAxis",
  description:
    "Map BioAxis application contexts into product lines, equivalent review, sample needs, documentation checks, and quote-ready sourcing briefs.",
  alternates: {
    canonical: "/applications"
  }
};

const applications = [
  {
    id: "cell-culture",
    title: "Cell Culture",
    description: "Media, supplements, cultureware, sterile filtration, cryopreservation, and analysis consumables.",
    href: "/products/cell-culture",
    requestHref: "/request-quote?requestType=quote&sourcePage=%2Fapplications&query=cell%20culture%20consumables",
    equivalentHref: "/equivalent-finder?sourcePage=%2Fapplications&need=cell-culture-equivalent"
  },
  {
    id: "molecular-biology-pcr",
    title: "Molecular Biology & PCR",
    description: "PCR plastics, qPCR consumables, purification kits, electrophoresis, NGS, cloning, and gene editing support.",
    href: "/products/molecular-biology-pcr",
    requestHref: "/request-quote?requestType=quote&sourcePage=%2Fapplications&query=molecular%20biology%20PCR%20consumables",
    equivalentHref: "/equivalent-finder?sourcePage=%2Fapplications&need=pcr-consumables-equivalent"
  },
  {
    id: "protein-immunology",
    title: "Protein & Immunology",
    description: "Antibodies, Western blotting, protein electrophoresis, ELISA, protein prep, and immunoassay workflows.",
    href: "/products/proteins-antibodies-immunology",
    requestHref: "/request-quote?requestType=quote&sourcePage=%2Fapplications&query=protein%20immunology%20consumables",
    equivalentHref: "/equivalent-finder?sourcePage=%2Fapplications&need=immunology-consumables-equivalent"
  },
  {
    id: "sample-preparation",
    title: "Sample Preparation",
    description: "Syringe filters, membranes, vacuum filtration, concentration filters, collection, and clarification.",
    href: "/products/sample-prep-filtration",
    requestHref: "/request-quote?requestType=quote&sourcePage=%2Fapplications&query=sample%20preparation%20consumables",
    equivalentHref: "/equivalent-finder?sourcePage=%2Fapplications&need=sample-prep-equivalent"
  },
  {
    id: "analytical-workflows",
    title: "Analytical Workflows",
    description: "Chromatography vials, sample prep, standards, rapid tests, and QC documentation support.",
    href: "/products/sample-prep-filtration",
    requestHref: "/request-quote?requestType=documentation&sourcePage=%2Fapplications&query=analytical%20QC%20consumables",
    equivalentHref: "/equivalent-finder?sourcePage=%2Fapplications&need=analytical-consumables-equivalent"
  },
  {
    id: "automation-hts",
    title: "Automation-Compatible Formats",
    description: "Automation-compatible plates, tips, reservoirs, seals, barcoded formats, and equipment-fit consumables.",
    href: "/products/liquid-handling",
    requestHref: "/request-quote?requestType=equivalent&sourcePage=%2Fapplications&supportPath=automation-fit",
    equivalentHref: "/equivalent-finder?sourcePage=%2Fapplications&supportPath=automation-fit"
  },
  {
    id: "storage-cryopreservation",
    title: "Storage & Cryopreservation",
    description: "Cryovials, freezer boxes, barcoded tubes, controlled-rate freezing, labels, and identification.",
    href: "/products/storage-cryopreservation",
    requestHref: "/request-quote?requestType=quote&sourcePage=%2Fapplications&query=storage%20cryopreservation%20consumables",
    equivalentHref: "/equivalent-finder?sourcePage=%2Fapplications&need=storage-consumables-equivalent"
  },
  {
    id: "early-bioprocess",
    title: "Early Bioprocess",
    description: "Single-use fluid management, upstream consumables, sterile filtration, sampling, and process QC.",
    href: "/products/early-bioprocess-single-use",
    requestHref: "/request-quote?requestType=quote&sourcePage=%2Fapplications&query=early%20bioprocess%20single-use%20consumables",
    equivalentHref: "/equivalent-finder?sourcePage=%2Fapplications&need=bioprocess-consumables-equivalent"
  }
];

const usefulContext = [
  "Workflow or assay type",
  "Current product or supplier line",
  "Format, material, sterility, or packaging constraints",
  "Documents, samples, quantity, and timing"
];

export default function ApplicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Start from the workflow. BioAxis maps the sourcing path."
        subtitle="Choose the application area closest to the work. BioAxis can route the context into product lines, equivalent review, sample needs, documentation checks, and quote-ready sourcing briefs."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {applications.map((application) => (
            <article key={application.id} id={application.id} className="scroll-mt-24 border border-bioaxis-line bg-bioaxis-panel p-6">
              <h2 className="text-xl font-bold uppercase text-bioaxis-text">{application.title}</h2>
              <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{application.description}</p>
              <div className="mt-6 grid gap-2">
                <Link
                  href={application.href}
                  className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
                >
                  View product lines
                </Link>
                <Link
                  href={application.requestHref}
                  className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                >
                  Map sourcing request
                </Link>
                <Link
                  href={application.equivalentHref}
                  className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                >
                  Review equivalent
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Useful workflow context</p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-bioaxis-muted md:grid-cols-4">
            {usefulContext.map((item) => (
              <li key={item} className="border-l border-bioaxis-accent/40 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        title="Have a workflow product list?"
        body="Send the protocol context, current supplier lines, catalog references, product list, or required documents. BioAxis will organize the sourcing path for quote, equivalent, sample, or documentation follow-up."
        primaryLabel="Map workflow sourcing"
        primaryHref="/request-quote?requestType=product-list-review&sourcePage=%2Fapplications"
        secondaryLabel="Find compatible alternatives"
        secondaryHref="/equivalent-finder?sourcePage=%2Fapplications"
      />
    </>
  );
}
