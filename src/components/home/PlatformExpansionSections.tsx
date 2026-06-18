import Link from "next/link";
import { workflows } from "@/data/workflows";
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
        <Link href="/equivalents" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
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
          subtitle="Labs often buy by experiment, not by catalog structure. BioAxis organizes consumables around the workflows your team actually runs."
        />
        <Link href="/workflows" className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
          Explore workflows
        </Link>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workflows.map((workflow) => (
          <Link key={workflow.id} href={`/workflows#${workflow.slug}`} className="border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft">
            <h3 className="text-xl font-bold uppercase text-bioaxis-text">{workflow.title}</h3>
            <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{workflow.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function EquivalentSourcingHomeSection() {
  return (
    <CTASection
      title="Find equivalent consumables and sourcing alternatives"
      body="Already using a specific supplier or catalog number? BioAxis helps identify equivalent and compatible consumables across multiple suppliers. Enter a product name, supplier, catalog number, format, or specification, and we will organize your alternatives."
      primaryLabel="Find an equivalent"
      primaryHref="/equivalents"
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
      body="BioAxis supports sourcing decisions with supplier screening, documentation organization, and specification review. Where available, we help request COA, SDS, sterility information, material information, and lot-level documentation."
      primaryLabel="Learn about documentation support"
      primaryHref="/quality"
      secondaryLabel="Review supplier coverage"
      secondaryHref="/suppliers"
    />
  );
}

export function HumanSupportHomeSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <SectionHeader
        title="Talk to BioAxis sourcing support"
        subtitle="Need help selecting the right consumables, finding equivalents, organizing documentation, or planning recurring supply? BioAxis provides human support for product matching, alternative sourcing, and procurement questions."
      />
      <Link href="/support" className="mt-8 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
        Ask BioAxis support
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

