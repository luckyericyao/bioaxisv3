import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Request Quote | BioAxis",
  description:
    "Submit quote, equivalent, sample, documentation, recurring supply, or product list review requests through BioAxis.",
  alternates: {
    canonical: "/request-quote"
  }
};

export default function RequestQuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request quote"
        title="Source products, equivalents, samples, and support from one platform."
        subtitle="Tell BioAxis what you need. We organize quotes, equivalent options, samples, documentation support, and recurring supply requests across suppliers."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <QuoteRequestForm />
      </section>
    </>
  );
}

