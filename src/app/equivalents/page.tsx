import type { Metadata } from "next";
import { SimpleRequestForm } from "@/components/forms/SimpleRequestForm";
import { CTASection } from "@/components/ui/CTASection";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Equivalents | BioAxis",
  description:
    "Find equivalent life science consumables and sourcing alternatives by supplier, catalog number, product format, workflow, and specifications.",
  alternates: {
    canonical: "/equivalents"
  }
};

export default function EquivalentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Equivalent sourcing"
        title="Find equivalent consumables and sourcing alternatives."
        subtitle="Enter a product name, supplier, catalog number, format, or specification. BioAxis helps organize equivalent and compatible options across suppliers and supports sample and quote requests."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <SectionHeader
            title="Start with what you already use"
            subtitle="Already using a specific supplier or catalog number? Submit the product you currently rely on, and BioAxis will help organize equivalent or compatible alternatives based on product family, format, specifications, and sourcing availability."
          />
          <div className="mt-8">
            <ComparisonTable
              rows={[
                { label: "When to request", value: "Current supplier is out of stock, lead time is too long, price increased, automation-compatible alternatives are needed, a new supplier is being qualified, or a sample is needed before switching." },
                { label: "What BioAxis reviews", value: "Product description, specifications, format, material, sterility requirements, workflow fit, documentation needs, and supplier options where available." },
                { label: "Sample-first evaluation", value: "For critical consumables, BioAxis supports sample requests so teams can evaluate fit before larger-volume purchasing." }
              ]}
            />
          </div>
        </div>
        <SimpleRequestForm
          title="Equivalent request form"
          submitLabel="Submit equivalent request"
          confirmation="Your equivalent request has been prepared. BioAxis can use this information to organize compatible options, sample paths, quote support, and documentation needs where available."
          fields={[
            { id: "currentSupplier", label: "Current supplier", required: true },
            { id: "catalogNumber", label: "Catalog number", required: true },
            { id: "productName", label: "Product name / description", required: true },
            { id: "requiredSpecification", label: "Required specification", required: true, kind: "textarea" },
            { id: "application", label: "Application / workflow" },
            { id: "estimatedUsage", label: "Estimated monthly usage" },
            { id: "needSample", label: "Need sample?", kind: "select", options: ["no", "yes"] },
            { id: "needDocumentation", label: "Need documentation?", kind: "select", options: ["no", "yes"] },
            { id: "notes", label: "Notes", kind: "textarea" }
          ]}
        />
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <ProcessSteps
          steps={[
            { title: "Submit current product", body: "Share supplier, catalog number, product name, format, and critical specifications." },
            { title: "Review alternatives", body: "BioAxis helps organize equivalent or compatible options based on product family, format, workflow fit, and documentation needs." },
            { title: "Sample or quote", body: "Request samples or quote support where applicable before switching or scaling usage." }
          ]}
        />
      </section>
      <CTASection
        title="Ready to compare equivalents?"
        body="Start with the product your lab already uses. BioAxis helps organize alternatives without claiming live inventory or guaranteed fulfillment."
        primaryLabel="Submit equivalent request"
        primaryHref="/request-quote"
      />
    </>
  );
}

