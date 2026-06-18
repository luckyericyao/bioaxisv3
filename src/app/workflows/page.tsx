import type { Metadata } from "next";
import { WorkflowCard } from "@/components/cards/WorkflowCard";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { workflows } from "@/data/workflows";

export const metadata: Metadata = {
  title: "Workflows | BioAxis",
  description:
    "Source life science consumables by workflow across cell culture, PCR, immunology, sample prep, automation, storage, and early bioprocess.",
  alternates: {
    canonical: "/workflows"
  }
};

export default function WorkflowsPage() {
  return (
    <>
      <PageHero
        eyebrow="Workflows"
        title="Source consumables by life science workflow."
        subtitle="From cell culture and PCR to immunology and early bioprocess, BioAxis helps you identify the right consumables, equivalents, samples, and quote options for each workflow."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </section>
      <CTASection
        title="Need help mapping products to a workflow?"
        body="Send the workflow, application, product list, and required specifications. BioAxis helps organize product categories, equivalent options, sample requests, and quote support."
        primaryLabel="Request workflow support"
        primaryHref="/request-quote"
      />
    </>
  );
}

