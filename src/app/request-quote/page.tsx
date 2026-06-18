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

type RequestQuotePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function labelize(value: string | undefined) {
  return value
    ? value
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "";
}

export default async function RequestQuotePage({ searchParams }: RequestQuotePageProps) {
  const params = await searchParams;
  const segment = first(params?.segment);
  const category = first(params?.category);
  const family = first(params?.family);
  const inquiryType = first(params?.inquiryType);
  const query = first(params?.q);
  const productCategory = [labelize(segment), labelize(category)].filter(Boolean).join(" / ");

  return (
    <>
      <PageHero
        eyebrow="Request quote"
        title="Source products, equivalents, samples, and support from one platform."
        subtitle="Tell BioAxis what you need. We organize quotes, equivalent options, samples, documentation support, and recurring supply requests across suppliers."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <QuoteRequestForm
          initialValues={{
            requestType: inquiryType ?? "quote",
            productCategory,
            productName: labelize(family) || query || ""
          }}
        />
      </section>
    </>
  );
}
