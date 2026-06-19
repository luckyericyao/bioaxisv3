import type { Metadata } from "next";
import Link from "next/link";
import { SimpleRequestForm } from "@/components/forms/SimpleRequestForm";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Samples | BioAxis",
  description:
    "Request samples before switching suppliers, evaluating equivalents, testing sterile or low-retention formats, or qualifying automation-compatible consumables.",
  alternates: {
    canonical: "/samples"
  }
};

export default function SamplesPage() {
  return (
    <>
      <PageHero
        eyebrow="Samples"
        title="Request samples before you switch or scale."
        subtitle="BioAxis helps labs evaluate consumables before larger-volume purchasing, especially when switching suppliers, evaluating equivalents, or qualifying new formats."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <SectionHeader
            title="Evaluate before you switch"
            subtitle="Use samples to reduce switching risk, review workflow fit, and support specification review before recurring supply decisions."
          />
          <div className="mt-8 grid gap-3">
            {[
              "Switching from a current supplier",
              "Validating an equivalent consumable",
              "Testing sterile, low-bind, or low-retention formats",
              "Checking automation compatibility",
              "Running a pilot purchase before recurring supply"
            ].map((item) => (
              <div key={item} className="border border-bioaxis-line bg-bioaxis-panel p-4 text-sm font-semibold uppercase text-bioaxis-steel">
                {item}
              </div>
            ))}
          </div>
          <Link href="/equivalent-finder?requestType=equivalent" className="mt-8 inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            Find equivalent first
          </Link>
        </div>
        <SimpleRequestForm
          title="Sample request form"
          submitLabel="Request sample"
          confirmation="Your sample request has been prepared. BioAxis can use this information to review product fit, sample options, documentation needs, and quote paths where available."
          fields={[
            { id: "name", label: "Name", required: true },
            { id: "organization", label: "Organization", required: true },
            { id: "email", label: "Email", required: true, kind: "email" },
            { id: "productCategory", label: "Product category", required: true },
            { id: "currentSupplier", label: "Current supplier / catalog number" },
            { id: "requiredSpecifications", label: "Required specifications", required: true, kind: "textarea" },
            { id: "application", label: "Application / workflow" },
            { id: "estimatedUsage", label: "Estimated monthly usage" },
            { id: "shippingRegion", label: "Shipping region", required: true },
            { id: "evaluationTimeline", label: "Evaluation timeline" },
            { id: "notes", label: "Notes", kind: "textarea" }
          ]}
        />
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <ProcessSteps
          steps={[
            { title: "Define fit", body: "Send product category, current product, required specifications, workflow, and shipping region." },
            { title: "Review sample path", body: "BioAxis helps organize sample request details and documentation needs where available." },
            { title: "Evaluate before scale", body: "Use pilot evaluation to support product matching, equivalent review, and recurring supply planning." }
          ]}
        />
      </section>
      <CTASection
        title="Need a sample before switching?"
        body="BioAxis supports sample-first evaluation where available for critical consumables, equivalents, automation formats, and recurring sourcing needs."
        primaryLabel="Request sample"
        primaryHref="/request-quote?requestType=sample"
        secondaryLabel="Find equivalent first"
        secondaryHref="/equivalent-finder?requestType=equivalent"
      />
    </>
  );
}
