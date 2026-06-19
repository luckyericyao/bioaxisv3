import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Applications | BioAxis",
  description:
    "Browse BioAxis application areas for cell culture, molecular biology, protein biology, sample preparation, analytical workflows, automation, storage, and early bioprocess.",
  alternates: {
    canonical: "/applications"
  }
};

const applications = [
  {
    id: "cell-culture",
    title: "Cell Culture",
    description: "Media, supplements, cultureware, sterile filtration, cryopreservation, and analysis consumables.",
    href: "/products/cell-culture"
  },
  {
    id: "molecular-biology-pcr",
    title: "Molecular Biology & PCR",
    description: "PCR plastics, qPCR consumables, purification kits, electrophoresis, NGS, cloning, and gene editing support.",
    href: "/products/molecular-biology-pcr"
  },
  {
    id: "protein-immunology",
    title: "Protein & Immunology",
    description: "Antibodies, Western blotting, protein electrophoresis, ELISA, protein prep, and immunoassay workflows.",
    href: "/products/proteins-antibodies-immunology"
  },
  {
    id: "sample-preparation",
    title: "Sample Preparation",
    description: "Syringe filters, membranes, vacuum filtration, concentration filters, collection, and clarification.",
    href: "/products/sample-prep-filtration"
  },
  {
    id: "analytical-workflows",
    title: "Analytical Workflows",
    description: "Chromatography vials, sample prep, standards, rapid tests, and QC documentation support.",
    href: "/products/sample-prep-filtration"
  },
  {
    id: "automation-hts",
    title: "Automation-Compatible Formats",
    description: "Automation-compatible plates, tips, reservoirs, seals, barcoded formats, and equipment-fit consumables.",
    href: "/products/liquid-handling"
  },
  {
    id: "storage-cryopreservation",
    title: "Storage & Cryopreservation",
    description: "Cryovials, freezer boxes, barcoded tubes, controlled-rate freezing, labels, and identification.",
    href: "/products/storage-cryopreservation"
  },
  {
    id: "early-bioprocess",
    title: "Early Bioprocess",
    description: "Single-use fluid management, upstream consumables, sterile filtration, sampling, and process QC.",
    href: "/products/early-bioprocess-single-use"
  }
];

export default function ApplicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Source by workflow context."
        subtitle="Start with the scientific workflow, then move into BioAxis product segments, categories, families, equivalents, samples, quotes, and documentation support."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {applications.map((application) => (
            <article key={application.id} id={application.id} className="scroll-mt-24 border border-bioaxis-line bg-bioaxis-panel p-6">
              <h2 className="text-xl font-bold uppercase text-bioaxis-text">{application.title}</h2>
              <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{application.description}</p>
              <Link
                href={application.href}
                className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
              >
                View products
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
