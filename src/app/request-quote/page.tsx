import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { PageHero } from "@/components/ui/PageHero";
import { normalizeRequestType } from "@/data/requestTypes";
import { getFamilyBySlug, labelFromProductContext } from "@/data/productTaxonomy";
import { getProductItemBySlug } from "@/data/productItems";
import type { BioAxisProductContext } from "@/lib/submitBioAxisRequest";

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
  const requestType = normalizeRequestType(first(params?.type) ?? first(params?.requestType) ?? first(params?.inquiryType) ?? "quote");
  const query = first(params?.query) ?? first(params?.q);
  const sourcePage = first(params?.sourcePage) ?? first(params?.sourcePageUrl) ?? "";
  const productList = first(params?.productList) ?? first(params?.list) ?? "";
  const supplier = first(params?.supplier) ?? first(params?.currentSupplier) ?? "";
  const catalogNumber = first(params?.catalogNumber) ?? first(params?.catalog) ?? "";
  const quantity = first(params?.quantity) ?? first(params?.qty) ?? "";
  const timeline = first(params?.timeline) ?? "";
  const requiredDocuments = first(params?.requiredDocuments) ?? first(params?.docs) ?? "";
  const productCategoryParam = first(params?.productCategory) ?? "";
  const labels = labelFromProductContext({ segment, subcategory, family });
  const productMatch = segment && subcategory && family && product ? getProductItemBySlug(segment, subcategory, family, product) : null;
  const familyMatch = segment && subcategory && family ? getFamilyBySlug(segment, subcategory, family) : null;
  const sourceProductUrl = sourcePage || buildSourceProductUrl({ segment, subcategory, family, product });
  const productCategory = productCategoryParam || labels.subcategoryName || labelize(subcategory) || "";
  const productName = productMatch?.productItem.name || labels.familyName || labelize(product) || labelize(family) || query || "";
  const productContext: BioAxisProductContext | undefined =
    segment || subcategory || family || product || query || sourcePage
      ? {
          requestType: requestType ?? "quote",
          productName,
          productFamily: labels.familyName || labelize(family),
          productCategory,
          productSegment: labels.segmentName || labelize(segment),
          productUrl: sourceProductUrl,
          sourcePageUrl: sourceProductUrl,
          relevantSpecs:
            productMatch?.productItem.commonSpecifications.slice(0, 8) ??
            familyMatch?.family.keySpecifications.slice(0, 8) ??
            [],
          documentationNotes:
            productMatch?.productItem.documentationNeeds.slice(0, 8) ??
            familyMatch?.family.documentationChecklist.slice(0, 8) ??
            [],
          timestamp: new Date().toISOString()
        }
      : undefined;

  return (
    <>
      <PageHero
        eyebrow="Request quote"
        title="Send a product, catalog number, or list"
        subtitle="Use this page for RFQs, equivalent review, sample requests, documentation requests, recurring supply needs, or general sourcing questions. Only your email is required to start."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <QuoteRequestForm
          initialValues={{
            requestType: requestType ?? "quote",
            productList,
            supplier,
            catalogNumber,
            quantity,
            timeline,
            productCategory,
            requiredDocuments
          }}
          productContext={productContext}
        />
      </section>
    </>
  );
}

function buildSourceProductUrl({
  segment,
  subcategory,
  family,
  product
}: {
  segment?: string;
  subcategory?: string;
  family?: string;
  product?: string;
}) {
  const parts = ["products", segment, subcategory, family, product].filter(Boolean);
  return parts.length > 1 ? `/${parts.join("/")}` : "";
}
