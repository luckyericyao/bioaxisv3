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
        title="Start a sample-first review path."
        subtitle="Send the product context you have. BioAxis can help organize sample needs, fit criteria, documentation, and quote follow-up before larger-volume purchasing."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <SectionHeader
            title="Use samples to reduce switching risk."
            subtitle="Only your email is required to start. Add a product, current supplier, workflow, or acceptance criteria only if it helps BioAxis review the sample path."
          />
          <div className="mt-8 grid gap-3">
            {[
              "Compare a current supplier product before switching",
              "Check sterile, low-bind, low-retention, or documentation needs",
              "Confirm automation, workflow, or packaging fit",
              "Plan pilot evaluation before recurring supply"
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
          title="Request a sample path. BioAxis will follow up by email."
          requestType="sample"
          submitLabel="Request sample"
          confirmation="Your sample request has been prepared. BioAxis can use this information to review product fit, sample options, documentation needs, and quote paths where available."
          fields={[
            { id: "name", label: "Name" },
            { id: "organization", label: "Organization" },
            { id: "email", label: "Email", required: true, kind: "email" },
            { id: "productCategory", label: "Product category" },
            { id: "currentSupplier", label: "Current supplier / catalog number" },
            { id: "requiredSpecifications", label: "Specifications or notes", kind: "textarea" },
            { id: "application", label: "Application / workflow" },
            { id: "estimatedUsage", label: "Estimated monthly usage" },
            { id: "shippingRegion", label: "Shipping region" },
            { id: "evaluationTimeline", label: "Evaluation timeline" },
            { id: "notes", label: "Notes", kind: "textarea" }
          ]}
        />
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <ProcessSteps
          steps={[
            { title: "Define fit", body: "Send product category, current product, specs, workflow, or shipping region if already known." },
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
