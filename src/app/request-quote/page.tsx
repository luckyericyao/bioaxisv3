import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { PageHero } from "@/components/ui/PageHero";
import { labelFromProductContext } from "@/data/productTaxonomy";

export const metadata: Metadata = {
  title: "Request Quote | BioAxis Consumables Sourcing",
  description:
    "Submit quote, equivalent, sample, documentation, recurring supply, contact, or product-list review requests through BioAxis.",
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
  const subcategory = first(params?.subcategory) ?? first(params?.category);
  const family = first(params?.family);
  const requestType = first(params?.requestType) ?? first(params?.inquiryType);
  const query = first(params?.q);
  const labels = labelFromProductContext({ segment, subcategory, family });
  const productCategory = [labels.segmentName || labelize(segment), labels.subcategoryName || labelize(subcategory)].filter(Boolean).join(" / ");

  return (
    <>
      <PageHero
        eyebrow="Request quote"
        title="Turn product details into a quote-ready sourcing request."
        subtitle="Use BioAxis for quote requests, equivalent review, sample evaluation, documentation requests, recurring supply planning, contact messages, and product-list review. Include the current supplier, catalog number, quantity, sterile status, documentation needs, and target timeline where available."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <QuoteRequestForm
          initialValues={{
            requestType: requestType ?? "quote",
            productCategory,
            productName: labels.familyName || labelize(family) || query || ""
          }}
        />
      </section>
    </>
  );
}
