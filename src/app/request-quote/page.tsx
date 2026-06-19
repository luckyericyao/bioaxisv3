import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { PageHero } from "@/components/ui/PageHero";
import { labelFromProductContext } from "@/data/productTaxonomy";
import { getProductItemBySlug } from "@/data/productItems";

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
  const product = first(params?.product);
  const requestType = first(params?.requestType) ?? first(params?.inquiryType);
  const query = first(params?.q);
  const productList = first(params?.productList) ?? first(params?.list) ?? "";
  const labels = labelFromProductContext({ segment, subcategory, family });
  const productMatch = segment && subcategory && family && product ? getProductItemBySlug(segment, subcategory, family, product) : null;
  const contextLabels = [
    labels.segmentName || labelize(segment),
    labels.subcategoryName || labelize(subcategory),
    labels.familyName || labelize(family),
    productMatch?.productItem.name || labelize(product)
  ].filter(Boolean);
  const productCategory = contextLabels.slice(0, 3).join(" / ");
  const productName = productMatch?.productItem.name || labels.familyName || labelize(product) || labelize(family) || query || "";

  return (
    <>
      <PageHero
        eyebrow="Request quote"
        title="Turn product details into a quote-ready sourcing request."
        subtitle="Use BioAxis for quote requests, equivalent review, sample evaluation, documentation requests, recurring supply planning, contact messages, and product-list review. Include the current supplier, catalog number, quantity, sterile status, documentation needs, and target timeline where available."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {contextLabels.length > 0 ? (
          <div className="mb-6 border border-bioaxis-line bg-bioaxis-panel p-5">
            <p className="text-xs font-semibold uppercase text-bioaxis-accent">Product context</p>
            <p className="mt-3 text-sm font-semibold text-bioaxis-text">{contextLabels.join(" > ")}</p>
          </div>
        ) : null}
        <QuoteRequestForm
          initialValues={{
            requestType: requestType ?? "quote",
            productCategory,
            productName,
            productList
          }}
        />
      </section>
    </>
  );
}
