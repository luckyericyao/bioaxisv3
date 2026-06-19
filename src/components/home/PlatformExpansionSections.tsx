import Link from "next/link";
import { CTASection } from "@/components/ui/CTASection";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

const sourcingProblems = [
  "Current supplier is out of stock",
  "Product price increased",
  "Need an equivalent format",
  "Need a sample before switching",
  "Need documentation before purchasing",
  "Need automation-compatible consumables",
  "Need recurring supply planning",
  "Need a faster quote response"
];

const popularStartingPoints = [
  { label: "Find low-retention pipette tips", href: "/products/liquid-handling" },
  { label: "Search qPCR plates", href: "/products/molecular-biology-pcr" },
  { label: "Request cryovial samples", href: "/samples" },
  { label: "Compare centrifugal filter membranes", href: "/products/sample-prep-filtration" },
  { label: "Find automation-compatible tips", href: "/products/automation-consumables" },
  { label: "Prepare a consumables RFQ", href: "/request-quote" }
];

const workflowPreviewCards = [
  { title: "Target Discovery", href: "/workflows#target-discovery-biology-validation", tags: ["Biology", "Biomarkers"] },
  { title: "Assay Development", href: "/workflows#cell-model-assay-development", tags: ["Plates", "Readouts"] },
  { title: "Screening", href: "/workflows#screening-hit-identification", tags: ["Automation", "HTS"] },
  { title: "Lead Optimization", href: "/workflows#lead-optimization-in-vitro-profiling", tags: ["Profiling", "Repeat use"] },
  { title: "ADME / DMPK", href: "/workflows#adme-dmpk-bioanalysis", tags: ["Bioanalysis", "Sample prep"] },
  { title: "Preclinical Storage", href: "/workflows#preclinical-sample-collection-storage", tags: ["Cold chain", "Traceability"] },
  { title: "Early CMC", href: "/workflows#process-development-early-cmc", tags: ["Sterile", "Single-use"] },
  { title: "QC / Analytical", href: "/workflows#qc-analytical-testing-release-support", tags: ["Documents", "Testing"] }
];

export function HowBioAxisWorksSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeader
        title="How BioAxis works"
        subtitle="Search products, match specifications, and source quotes, samples, documentation, and alternatives from one platform."
      />
      <div className="mt-10">
        <ProcessSteps
          steps={[
            {
              title: "Search",
              body: "Enter a product name, catalog number, supplier, equivalent, workflow, or consumable type. BioAxis organizes your starting point without inventing results."
            },
            {
              title: "Match",
              body: "BioAxis helps organize product families, specifications, equivalent options, and supplier paths so your team can compare with more context."
            },
            {
              title: "Source",
              body: "Request quotes, samples, documentation, and recurring supply support. A sourcing specialist can review your needs and help coordinate next steps."
            }
          ]}
        />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
          Search product universe
        </Link>
        <Link href="/equivalent-finder" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
          Find equivalents
        </Link>
        <Link href="/request-quote" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
          Request quote
        </Link>
      </div>
    </section>
  );
}

export function SourcingProblemsSection() {
  return (
    <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <SectionHeader
          title="Built for real sourcing problems"
          subtitle="BioAxis is designed for the moments when ordinary catalogs, backorders, fragmented suppliers, and unclear specifications slow your lab down."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sourcingProblems.map((problem) => (
            <div key={problem} className="border border-bioaxis-line bg-bioaxis-panel p-5 text-sm font-semibold uppercase text-bioaxis-steel">
              {problem}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SourceByWorkflowSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          title="Source by workflow"
          subtitle="Labs buy by experiment and development stage, not only by catalog structure. BioAxis maps drug discovery and development workflows to consumables, equivalents, samples, documentation, and quote support required to keep studies moving."
        />
        <Link href="/workflows" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
          Explore Drug R&D Workflows
        </Link>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {workflowPreviewCards.map((workflow) => (
          <Link key={workflow.title} href={workflow.href} className="border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft">
            <h3 className="text-base font-bold uppercase text-bioaxis-text">{workflow.title}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {workflow.tags.map((tag) => (
                <span key={tag} className="border border-bioaxis-line bg-bioaxis-black px-2.5 py-1.5 text-[11px] font-semibold uppercase text-bioaxis-steel">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProductListIntakeHomeSection() {
  const exampleRows = [
    ["Supplier", "Catalog No.", "Product", "Qty", "Required docs", "Timeline"],
    ["Corning", "352097", "96-well plate", "20 cases", "CoA / Sterility", "July"],
    ["Axygen", "T-200-C", "200 µL filtered tips", "50 racks", "DNase/RNase-free", "ASAP"]
  ];

  return (
    <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <SectionHeader
            title="Paste a product list. BioAxis will organize the sourcing path."
            subtitle="Send supplier names, catalog numbers, product descriptions, quantities, required documents, and timing. BioAxis can help structure the request into product families, equivalent review paths, sample needs, documentation checklists, and quote-ready fields."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/request-quote?requestType=product-list-review" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent">
              Paste product list
            </Link>
            <Link href="/request-quote?requestType=quote" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Request quote
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto border border-bioaxis-line bg-bioaxis-black">
          <p className="border-b border-bioaxis-line px-3 py-3 font-mono text-xs text-bioaxis-accent">
            Supplier | Catalog No. | Product | Qty | Required docs | Timeline
          </p>
          <div className="grid min-w-[620px] grid-cols-[1fr_1fr_1.4fr_0.8fr_1.2fr_0.8fr] text-xs">
            {exampleRows.flatMap((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}-${cell}`}
                  className={[
                    "border-b border-r border-bioaxis-line px-3 py-3",
                    rowIndex === 0 ? "font-bold uppercase text-bioaxis-accent" : "text-bioaxis-steel",
                    cellIndex === row.length - 1 ? "border-r-0" : ""
                  ].join(" ")}
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EquivalentSourcingHomeSection() {
  return (
    <CTASection
      title="Find equivalent consumables and sourcing alternatives"
      body="Already using a specific supplier or catalog number? BioAxis helps review equivalent and compatible consumables across supplier options. Enter a product name, supplier, catalog number, format, or specification, and BioAxis will organize the comparison path without claiming automatic one-to-one equivalence."
      primaryLabel="Find an equivalent"
      primaryHref="/equivalent-finder"
    />
  );
}

export function SampleRequestHomeSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeader
        title="Request samples before you switch"
        subtitle="Validate consumables before committing to a new supplier. BioAxis supports sample requests for critical products so your team can evaluate quality, fit, and performance before larger-volume purchasing."
      />
      <Link href="/samples" className="mt-8 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
        Request a sample
      </Link>
    </section>
  );
}

export function DocumentationSupportHomeSection() {
  return (
    <CTASection
      title="Quality, documentation, and supplier confidence"
      body="BioAxis supports sourcing decisions with supplier screening, documentation organization, and specification review. Where available, we help request CoA, SDS, sterility information, material information, and lot-level documentation."
      primaryLabel="Learn about documentation support"
      primaryHref="/quality"
      secondaryLabel="Supplier qualification"
      secondaryHref="/supplier-qualification"
    />
  );
}

export function HumanSupportHomeSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeader
        title="Support recurring supply"
        subtitle="Need help selecting consumables, finding compatible alternatives, organizing documentation, or planning repeat purchasing? BioAxis supports product matching, sample evaluation, documentation requests, and recurring supply conversations."
      />
      <Link href="/request-quote?requestType=recurring-supply" className="mt-8 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
        Plan recurring supply
      </Link>
    </section>
  );
}

export function PopularStartingPointsSection() {
  return (
    <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <SectionHeader title="Popular starting points" subtitle="Start with a workflow, product family, equivalent, sample request, or RFQ." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularStartingPoints.map((item) => (
            <Link key={item.label} href={item.href} className="border border-bioaxis-line bg-bioaxis-panel p-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
