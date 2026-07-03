import type { Metadata } from "next";
import { SupportCard } from "@/components/cards/SupportCard";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { supportTypes } from "@/data/supportTypes";

export const metadata: Metadata = {
  title: "Support | BioAxis",
  description:
    "Dedicated BioAxis sourcing support for product matching, equivalents, samples, documentation, quote preparation, recurring supply, and automation review.",
  alternates: {
    canonical: "/support"
  }
};

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Choose the right sourcing support path."
        subtitle="Send the product context you have. BioAxis routes it into product matching, equivalent review, sample coordination, documentation review, RFQ preparation, or recurring supply planning."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeader
          title="Start with the decision you need to make."
          subtitle="Each path opens the right request flow with sourcing context already attached, so your team can start with a rough note rather than a perfect form."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {supportTypes.map((supportType) => (
            <SupportCard key={supportType.id} supportType={supportType} />
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <SectionHeader title="What to send us" subtitle="BioAxis support is faster when you include product context, workflow context, and decision constraints." />
        <div className="mt-10">
          <ProcessSteps
            steps={[
              { title: "Product context", body: "Send product name, supplier, catalog number, product family, and any known equivalent targets." },
              { title: "Workflow context", body: "Share the application, instrument or platform, required specifications, and any documentation needs." },
              { title: "Sourcing context", body: "Include usage volume, timeline, shipping region, sample needs, and whether recurring supply planning is needed." }
            ]}
          />
        </div>
      </section>
      <CTASection
        title="How support works"
        body="Submit your request details. BioAxis helps organize the product, equivalent, sample, documentation, or quote path so a sourcing specialist can review next steps with more context."
        primaryLabel="Request support"
        primaryHref="/request-quote"
      />
    </>
  );
}
