// Keep URL builders independent of catalog data so client components can reuse them.
export function buildRequestHref({
  segment,
  category,
  subcategory,
  family,
  product,
  inquiryType,
  requestType = inquiryType ?? "quote",
  sourcePage,
  query
}: {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  product?: string;
  inquiryType?: string;
  requestType?: string;
  sourcePage?: string;
  query?: string;
}) {
  const params = new URLSearchParams();
  const resolvedSubcategory = subcategory ?? category;
  const hasProductContext = Boolean(segment || resolvedSubcategory || family || product);
  const resolvedSourcePage = sourcePage ?? buildProductContextPath({ segment, subcategory: resolvedSubcategory, family, product });

  params.set("type", requestTypeToQueryType(requestType));
  params.set("requestType", requestType);
  if (hasProductContext) {
    params.set("source", "product-page");
  }

  if (segment) {
    params.set("segment", segment);
  }

  if (resolvedSubcategory) {
    params.set("category", resolvedSubcategory);
    params.set("subcategory", resolvedSubcategory);
  }

  if (family) {
    params.set("family", family);
  }

  if (product) {
    params.set("product", product);
  }

  if (resolvedSourcePage) {
    params.set("sourcePage", resolvedSourcePage);
  }

  if (query) {
    params.set("query", query);
  }

  return `/request-quote?${params.toString()}`;
}

function requestTypeToQueryType(requestType: string) {
  const queryTypes: Record<string, string> = {
    quote: "rfq",
    equivalent: "equivalent",
    sample: "sample",
    documentation: "documentation",
    "recurring-supply": "recurring-supply",
    "product-list-review": "product-list",
    contact: "contact"
  };

  return queryTypes[requestType] ?? requestType;
}

export function buildEquivalentFinderHref({
  segment,
  category,
  subcategory,
  family,
  product,
  sourcePage,
  query
}: {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  product?: string;
  sourcePage?: string;
  query?: string;
}) {
  const params = new URLSearchParams();
  const resolvedSubcategory = subcategory ?? category;
  const hasProductContext = Boolean(segment || resolvedSubcategory || family || product);
  const resolvedSourcePage = sourcePage ?? buildProductContextPath({ segment, subcategory: resolvedSubcategory, family, product });

  params.set("requestType", "equivalent");
  if (hasProductContext) {
    params.set("source", "product-page");
  }

  if (segment) {
    params.set("segment", segment);
  }

  if (resolvedSubcategory) {
    params.set("category", resolvedSubcategory);
    params.set("subcategory", resolvedSubcategory);
  }

  if (family) {
    params.set("family", family);
  }

  if (product) {
    params.set("product", product);
  }

  if (resolvedSourcePage) {
    params.set("sourcePage", resolvedSourcePage);
  }

  if (query) {
    params.set("query", query);
  }

  return `/equivalent-finder?${params.toString()}`;
}

function buildProductContextPath({
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
