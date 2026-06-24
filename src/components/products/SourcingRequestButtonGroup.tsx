import Link from "next/link";
import { buildRequestHref } from "@/data/productTaxonomy";

type SourcingRequestButtonGroupProps = {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  product?: string;
  size?: "sm" | "md";
  layout?: "grid" | "inline";
  includeSupport?: boolean;
  includeDocumentation?: boolean;
  sourcePage?: string;
  query?: string;
};

const baseClass =
  "inline-flex items-center justify-center border text-center font-semibold uppercase transition";

const sizeClass = {
  sm: "min-h-10 px-3 text-xs",
  md: "min-h-11 px-5 text-sm"
};

export function SourcingRequestButtonGroup({
  segment,
  category,
  subcategory,
  family,
  product,
  size = "sm",
  layout = "grid",
  includeSupport = false,
  sourcePage,
  query
}: SourcingRequestButtonGroupProps) {
  const requests = [
    { label: product ? "Request quote for this product" : "Request quote", requestType: "quote", primary: true },
    { label: "Find equivalent", requestType: "equivalent", primary: false },
    { label: "Request sample", requestType: "sample", primary: false },
    { label: "Ask for documents", requestType: "documentation", primary: false },
    ...(includeSupport ? [{ label: "Recurring supply", requestType: "recurring-supply", primary: false }] : [])
  ];

  return (
    <div className={layout === "grid" ? "grid gap-2 sm:grid-cols-2 xl:grid-cols-4" : "flex flex-col gap-2 sm:flex-row sm:flex-wrap"}>
      {requests.map((request) => (
        <Link
          key={request.requestType}
          href={buildRequestHref({ segment, category, subcategory, family, product, requestType: request.requestType, sourcePage, query })}
          className={[
            baseClass,
            sizeClass[size],
            request.primary
              ? "border-bioaxis-accent bg-bioaxis-accent text-bioaxis-black hover:bg-transparent hover:text-bioaxis-accent"
              : "border-bioaxis-line text-bioaxis-steel hover:border-bioaxis-accent hover:text-bioaxis-accent"
          ].join(" ")}
        >
          {request.label}
        </Link>
      ))}
    </div>
  );
}
