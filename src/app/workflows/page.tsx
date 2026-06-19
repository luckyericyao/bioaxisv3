import type { Metadata } from "next";
import Link from "next/link";
import { WorkflowCard } from "@/components/cards/WorkflowCard";
import { CTAButton } from "@/components/ui/CTAButton";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { workflowProductFamilyMap, workflows, workflowUseCases } from "@/data/workflows";

export const metadata: Metadata = {
  title: "Drug R&D Workflows | BioAxis",
  description:
    "Map drug discovery and development workflows to consumables, reagents, formats, equivalents, samples, documentation, and quote support.",
  alternates: {
    canonical: "/workflows"
  }
};

export default function WorkflowsPage() {
  return (
    <>
      <PageHero
        eyebrow="Workflows"
        title="Source consumables by drug discovery and development workflow."
        subtitle="Map each stage of biotech and pharma R&D to the plates, tips, tubes, reagents, filtration products, storage formats, QC consumables, equivalent sourcing options, samples, and quote support required to keep experiments moving."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <CTAButton href="/request-quote?requestType=product-list-review">Map my workflow</CTAButton>
          <CTAButton href="/equivalent-finder?requestType=equivalent" variant="secondary">
            Request equivalent options
          </CTAButton>
          <CTAButton href="/request-quote?requestType=product-list-review" variant="secondary">
            Send product list
          </CTAButton>
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-bioaxis-dim">
          Built for discovery, screening, preclinical, early CMC, and analytical teams.
        </p>
      </PageHero>

      <section className="border-b border-bioaxis-line bg-bioaxis-panel/45">
        <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-bioaxis-accent">Workflow navigator</p>
              <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text sm:text-3xl">
                Follow the sourcing path from discovery to QC.
              </h2>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-bioaxis-muted">
              Use the roadmap to jump from an R&D stage to the consumables, formats, equivalent options,
              samples, documentation, and quote support that stage usually needs.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflows.map((workflow, index) => (
              <Link
                key={workflow.id}
                href={`#${workflow.slug}`}
                className="group relative flex min-h-[17rem] flex-col border border-bioaxis-line bg-bioaxis-black/70 p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
              >
                <span className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-accent">
                  {workflow.stage}
                </span>
                <span className="absolute right-4 top-4 text-3xl font-bold text-bioaxis-line">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="mt-4 block pr-9 text-sm font-semibold uppercase leading-snug text-bioaxis-text">
                  {workflow.title}
                </span>
                <span className="mt-3 block text-sm leading-6 text-bioaxis-muted">{workflow.shortDescription}</span>
                <span className="mt-auto flex flex-wrap gap-2 pt-5">
                  {workflow.productFamilies.map((family) => (
                    <span key={family} className="border border-bioaxis-line bg-bioaxis-panel px-2.5 py-1.5 text-[11px] font-semibold uppercase text-bioaxis-steel">
                      {family}
                    </span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeader
            title="Drug R&D sourcing stages"
            subtitle="Start with the work your team is doing, then map the consumables, equivalents, samples, documents, and quote inputs needed to keep the study moving."
          />
          <div className="border border-bioaxis-line bg-bioaxis-panel p-5">
            <p className="text-sm leading-6 text-bioaxis-muted">
              Products stay organized in the product directory. This page organizes sourcing around discovery,
              screening, preclinical, early CMC, and analytical workflows so R&D, procurement, and lab operations
              teams can move from protocol context to quote-ready lists.
            </p>
          </div>
        </div>

        <div className="grid gap-7">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            title="Workflow → Product Family Map"
            subtitle="Workflow context leads the page. Product families stay close enough for buyers to translate protocols into sourcing requests."
          />
          <div className="mt-10 grid gap-4">
            {workflowProductFamilyMap.map((item) => (
              <div
                key={item.workflow}
                className="grid gap-4 border border-bioaxis-line bg-bioaxis-black p-5 sm:grid-cols-[0.34fr_1fr] sm:items-center"
              >
                <h3 className="border-l-2 border-bioaxis-accent pl-4 text-sm font-bold uppercase text-bioaxis-text">
                  {item.workflow}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.families.map((family) => (
                    <span key={family} className="border border-bioaxis-line bg-bioaxis-panel px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                      {family}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <SectionHeader
            title="Procurement and R&D operations use cases"
            subtitle="BioAxis can help turn protocol context, current supplier products, and purchasing constraints into organized sourcing paths."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {workflowUseCases.map((useCase, index) => (
              <div key={useCase} className="border border-bioaxis-line bg-bioaxis-panel p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-accent">
                  Use case {(index + 1).toString().padStart(2, "0")}
                </p>
                <p className="mt-3 text-sm font-semibold uppercase leading-6 text-bioaxis-steel">
                  {useCase}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bioaxis-line bg-bioaxis-panel/70">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">Workflow mapping</p>
            <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
              Send us your workflow. We will map the consumables.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
              Share your assay, protocol, current supplier list, product numbers, or recurring purchasing needs.
              BioAxis will help map required consumables, identify equivalent options, organize sample requests,
              collect documentation, and prepare a quote-ready sourcing list.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <CTAButton href="/request-quote?requestType=product-list-review">Request workflow mapping</CTAButton>
            <CTAButton href="/equivalent-finder?requestType=equivalent" variant="secondary">
              Find equivalent products
            </CTAButton>
            <CTAButton href="/request-quote?requestType=product-list-review" variant="secondary">
              Send product list
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
