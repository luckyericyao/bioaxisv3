import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { PageHero } from "@/components/ui/PageHero";
import { normalizeRequestType } from "@/data/requestTypes";
import { getFamilyBySlug, labelFromProductContext } from "@/data/productTaxonomy";
import { getProductItemBySlug } from "@/data/productItems";
import { getFamilyBySlug as getCatalogFamilyBySlug, getProductBySlug as getCatalogProductBySlug } from "@/data/productCatalog";
import { workflows } from "@/data/workflows";
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
  intent,
  need
}: {
  sourcePage?: string;
  source?: string;
  intent?: string;
  need?: string;
}) {
  const normalizedSource = `${sourcePage ?? ""} ${source ?? ""}`.toLowerCase();
  const normalizedIntent = intent?.toLowerCase() ?? "";
  const normalizedNeed = need?.toLowerCase() ?? "";

  if (normalizedSource.includes("ready-supply")) {
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

  if (normalizedSource.includes("private-label-oem")) {
    if (normalizedNeed.includes("pipette")) {
      return [
        "Private-label / OEM pipette tips review",
        "Target tip format:",
        "Current brand or catalog reference:",
        "Packaging / label requirements:",
        "Estimated recurring demand:",
        "Documents or samples needed:"
      ].join("\n");
    }

    if (normalizedNeed.includes("tubes") || normalizedNeed.includes("plates") || normalizedNeed.includes("recurring")) {
      return [
        "Private-label / OEM recurring supply review",
        "Target product family:",
        "Current brand or catalog reference:",
        "Estimated monthly or annual usage:",
        "Packaging / label requirements:",
        "Documents or samples needed:"
      ].join("\n");
    }

    if (normalizedNeed.includes("filtration") || normalizedNeed.includes("pcr")) {
      return [
        "Private-label / OEM filtration or PCR plastics review",
        "Target product family:",
        "Current brand or catalog reference:",
        "Key format or material requirements:",
        "Packaging / label requirements:",
        "Documents or samples needed:"
      ].join("\n");
    }

    return [
      "Private-label / OEM sourcing discussion",
      "Target product family:",
      "Current brand or catalog reference:",
      "Packaging / label requirements:",
      "Estimated recurring demand:",
      "Documents or samples needed:"
    ].join("\n");
  }

  return "";
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

function defaultProductListFromNeed(need: string | undefined, requestType: string) {
  const normalizedNeed = need?.toLowerCase() ?? "";
  const normalizedRequestType = normalizeRequestType(requestType);

  if (normalizedRequestType === "documentation" || normalizedNeed.includes("document")) {
    return [
      "Documentation request",
      "Product or product family:",
      "Documents needed: CoA, SDS, sterility, material statement, or lot-level documentation",
      "Current supplier or catalog reference:",
      "Purchase timing:"
    ].join("\n");
  }

  if (normalizedRequestType === "recurring-supply" || normalizedNeed.includes("recurring")) {
    return [
      "Recurring supply review",
      "Product list or product family:",
      "Estimated monthly or annual usage:",
      "Current supplier or catalog reference:",
      "Packaging, lead time, or backup-source needs:"
    ].join("\n");
  }

  return "";
}

function defaultProductListFromWorkflow(workflowTitle: string | undefined, requestType: string) {
  if (!workflowTitle) {
    return "";
  }

  if (normalizeRequestType(requestType) === "documentation") {
    return [
      "Workflow documentation request",
      `Workflow: ${workflowTitle}`,
      "Product families or current supplier lines:",
      "Documents needed:",
      "Study, assay, or procurement timing:"
    ].join("\n");
  }

  return [
    "Workflow mapping request",
    `Workflow: ${workflowTitle}`,
    "Current protocol, assay, or product list:",
    "Consumables to source or compare:",
    "Equivalent, sample, documentation, or recurring supply needs:"
  ].join("\n");
}

function defaultProductListFromRequestType(requestType: string, hasRouteContext: boolean) {
  const normalizedRequestType = normalizeRequestType(requestType);

  if (normalizedRequestType === "quote" && !hasRouteContext) {
    return [
      "Quote request",
      "Product, SKU, catalog reference, or product list:",
      "Quantity / timing:",
      "Documents, samples, or equivalent needs:",
      "Delivery region if relevant:"
    ].join("\n");
  }

  if (normalizedRequestType === "equivalent") {
    return [
      "Equivalent review request",
      "Current product / catalog number:",
      "Must-match specs or workflow constraints:",
      "Documents or samples needed:",
      "Timing or recurring usage:"
    ].join("\n");
  }

  if (normalizedRequestType === "sample") {
    return [
      "Sample request",
      "Product or product family:",
      "Current supplier or catalog reference:",
      "Use case / workflow:",
      "Sample quantity or evaluation timing:",
      "Documents needed:"
    ].join("\n");
  }

  if (normalizedRequestType === "product-list-review") {
    return [
      "Product list review",
      "Paste product list or supplier lines:",
      "Quantity / timing:",
      "Equivalent, sample, or documentation needs:",
      "Recurring usage if known:"
    ].join("\n");
  }

  return "";
}

export default async function RequestQuotePage({ searchParams }: RequestQuotePageProps) {
  const params = await searchParams;
  const segment = first(params?.segment);
  const subcategory = first(params?.subcategory) ?? first(params?.category);
  const family = first(params?.family);
  const product = first(params?.product);
  const productNameParam = first(params?.productName) ?? first(params?.product_name);
  const workflowSlug = first(params?.workflow);
  const workflowMatch = workflows.find((workflow) => workflow.slug === workflowSlug || workflow.id === workflowSlug);
  const need = first(params?.need);
  const requestType = normalizeRequestType(first(params?.requestType) ?? first(params?.type) ?? first(params?.inquiryType) ?? requestTypeFromNeed(need) ?? "quote");
  const query = first(params?.query) ?? first(params?.q);
  const sourcePage = first(params?.sourcePage) ?? first(params?.sourcePageUrl) ?? "";
  const source = first(params?.source) ?? "";
  const intent = first(params?.intent) ?? "";
  const hasRouteContext = Boolean(segment || subcategory || family || product || productNameParam || workflowMatch || sourcePage || query);
  const explicitProductList = first(params?.productList) ?? first(params?.list);
  const productList =
    explicitProductList ??
    (defaultProductListFromContext({ sourcePage, source, intent, need }) ||
      defaultProductListFromSearch(query, requestType) ||
      defaultProductListFromNeed(need, requestType) ||
      defaultProductListFromWorkflow(workflowMatch?.title, requestType) ||
      defaultProductListFromRequestType(requestType, hasRouteContext));
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
  const sourceProductUrl = sourcePage || (workflowMatch ? `/workflows#${workflowMatch.slug}` : buildSourceProductUrl({ segment, subcategory, family, product }));
  const productCategory = productCategoryParam || catalogProductMatch?.category.name || catalogFamilyMatch?.category.name || labels.subcategoryName || labelize(subcategory) || "";
  const productName = catalogProductMatch?.product.name || productMatch?.productItem.name || labels.familyName || labelize(product) || productNameParam || workflowMatch?.title || labelize(family) || query || "";
  const productContext: BioAxisProductContext | undefined =
    segment || subcategory || family || product || productNameParam || workflowMatch || query || sourcePage
      ? {
          requestType: requestType ?? "quote",
          productName,
          productFamily: catalogProductMatch?.family.name || catalogFamilyMatch?.family.name || labels.familyName || labelize(family),
          productCategory: productCategory || (workflowMatch ? "Workflow mapping" : ""),
          productSegment: catalogProductMatch?.segment.name || catalogFamilyMatch?.segment.name || labels.segmentName || labelize(segment) || (workflowMatch ? "Drug R&D workflow" : ""),
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
