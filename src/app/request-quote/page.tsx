import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { PageHero } from "@/components/ui/PageHero";
import { normalizeRequestType } from "@/data/requestTypes";
import { getFamilyBySlug, labelFromProductContext } from "@/data/productTaxonomy";
import { getProductItemBySlug } from "@/data/productItems";
import { getFamilyBySlug as getCatalogFamilyBySlug, getProductBySlug as getCatalogProductBySlug } from "@/data/productCatalog";
import type { BioAxisProductContext } from "@/lib/submitBioAxisRequest";

export const metadata: Metadata = {
  title: "Request Quote | BioAxis Consumables Sourcing",
  description:
    "Submit quote, equivalent, sample, documentation, recurring supply, contact, or product-list review requests through BioAxis.",
  alternates: {
    canonical: "/request-quote"
  }
};

export const dynamic = "force-dynamic";

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

function requestTypeFromNeed(value: string | undefined) {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized.includes("document") || normalized.includes("coa") || normalized.includes("sds")) return "documentation";
  if (normalized.includes("equivalent") || normalized.includes("alternative")) return "equivalent";
  if (normalized.includes("sample")) return "sample";
  if (normalized.includes("recurring") || normalized.includes("monthly")) return "recurring-supply";
  if (normalized.includes("product-list") || normalized.includes("list")) return "product-list-review";

  return undefined;
}

function defaultProductListFromContext({
  sourcePage,
  source,
  intent
}: {
  sourcePage?: string;
  source?: string;
  intent?: string;
}) {
  const normalizedSource = `${sourcePage ?? ""} ${source ?? ""}`.toLowerCase();
  const normalizedIntent = intent?.toLowerCase() ?? "";

  if (!normalizedSource.includes("ready-supply")) {
    return "";
  }

  if (normalizedIntent.includes("current-sku")) {
    return [
      "Ready Supply current SKU review",
      "Current SKU / brand:",
      "Consumable type or specification:",
      "Quantity / timing:",
      "Documents needed:"
    ].join("\n");
  }

  return [
    "Ready Supply availability check",
    "Current SKU / brand:",
    "Key specification:",
    "Quantity / timing:",
    "Delivery region:"
  ].join("\n");
}

function defaultProductListFromSearch(query: string | undefined, requestType: string) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return "";
  }

  if (normalizeRequestType(requestType) === "product-list-review") {
    return [
      "BioAxis product search handoff",
      `Search term: ${trimmedQuery}`,
      "Product list / supplier lines:",
      "Quantity / timing:",
      "Documents, samples, or equivalent needs:"
    ].join("\n");
  }

  return [
    "BioAxis product search handoff",
    `Search term: ${trimmedQuery}`,
    "Sourcing need:",
    "Quantity / timing:",
    "Documents or samples needed:"
  ].join("\n");
}

export default async function RequestQuotePage({ searchParams }: RequestQuotePageProps) {
  const params = await searchParams;
  const segment = first(params?.segment);
  const subcategory = first(params?.subcategory) ?? first(params?.category);
  const family = first(params?.family);
  const product = first(params?.product);
  const need = first(params?.need);
  const requestType = normalizeRequestType(first(params?.requestType) ?? first(params?.type) ?? first(params?.inquiryType) ?? requestTypeFromNeed(need) ?? "quote");
  const query = first(params?.query) ?? first(params?.q);
  const sourcePage = first(params?.sourcePage) ?? first(params?.sourcePageUrl) ?? "";
  const source = first(params?.source) ?? "";
  const intent = first(params?.intent) ?? "";
  const explicitProductList = first(params?.productList) ?? first(params?.list);
  const productList =
    explicitProductList ??
    (defaultProductListFromContext({ sourcePage, source, intent }) || defaultProductListFromSearch(query, requestType));
  const supplier = first(params?.supplier) ?? first(params?.currentSupplier) ?? "";
  const catalogNumber = first(params?.catalogNumber) ?? first(params?.catalog) ?? "";
  const quantity = first(params?.quantity) ?? first(params?.qty) ?? "";
  const timeline = first(params?.timeline) ?? "";
  const requiredDocuments = first(params?.requiredDocuments) ?? first(params?.docs) ?? "";
  const productCategoryParam = first(params?.productCategory) ?? "";
  const labels = labelFromProductContext({ segment, subcategory, family });
  const productMatch = segment && subcategory && family && product ? getProductItemBySlug(segment, subcategory, family, product) : null;
  const familyMatch = segment && subcategory && family ? getFamilyBySlug(segment, subcategory, family) : null;
  const catalogProductMatch = segment && subcategory && family && product ? getCatalogProductBySlug(segment, subcategory, family, product) : null;
  const catalogFamilyMatch = segment && subcategory && family ? getCatalogFamilyBySlug(segment, subcategory, family) : null;
  const sourceProductUrl = sourcePage || buildSourceProductUrl({ segment, subcategory, family, product });
  const productCategory = productCategoryParam || catalogProductMatch?.category.name || catalogFamilyMatch?.category.name || labels.subcategoryName || labelize(subcategory) || "";
  const productName = catalogProductMatch?.product.name || productMatch?.productItem.name || labels.familyName || labelize(product) || labelize(family) || query || "";
  const productContext: BioAxisProductContext | undefined =
    segment || subcategory || family || product || query || sourcePage
      ? {
          requestType: requestType ?? "quote",
          productName,
          productFamily: catalogProductMatch?.family.name || catalogFamilyMatch?.family.name || labels.familyName || labelize(family),
          productCategory,
          productSegment: catalogProductMatch?.segment.name || catalogFamilyMatch?.segment.name || labels.segmentName || labelize(segment),
          productUrl: sourceProductUrl,
          sourcePageUrl: sourceProductUrl,
          relevantSpecs:
            catalogProductMatch ? catalogProductMatch.product.tags.slice(0, 8) :
            catalogFamilyMatch ? catalogFamilyMatch.family.typicalSpecs.slice(0, 8) :
            productMatch?.productItem.commonSpecifications.slice(0, 8) ??
            familyMatch?.family.keySpecifications.slice(0, 8) ??
            [],
          documentationNotes:
            catalogProductMatch ? Object.entries(catalogProductMatch.product.documents).map(([key, value]) => `${key}: ${value}`) :
            productMatch?.productItem.documentationNeeds.slice(0, 8) ??
            familyMatch?.family.documentationChecklist.slice(0, 8) ??
            [],
          timestamp: new Date().toISOString()
        }
      : undefined;

  return (
    <>
      <PageHero
        eyebrow="Sourcing request"
        title="Send a product, catalog number, or list"
        subtitle="Only your email is required. Paste a SKU, supplier catalog number, product list, or sourcing need, and BioAxis can follow up for missing details."
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
            requiredDocuments,
            needs: need ? [labelize(need)] : []
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
