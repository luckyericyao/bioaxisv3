import Link from "next/link";
import { buildEquivalentFinderHref, buildRequestHref } from "@/data/productTaxonomy";

type SourcingRequestButtonGroupProps = {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  size?: "sm" | "md";
  layout?: "grid" | "inline";
  includeSupport?: boolean;
  includeDocumentation?: boolean;
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
  size = "sm",
  layout = "grid",
  includeSupport = false,
  includeDocumentation = false
}: SourcingRequestButtonGroupProps) {
  const requests = [
    { label: "Request quote", requestType: "quote", primary: true },
    { label: "Find equivalent", requestType: "equivalent", primary: false },
    { label: "Request sample", requestType: "sample", primary: false },
    ...(includeDocumentation ? [{ label: "Ask for documentation", requestType: "documentation", primary: false }] : []),
    ...(includeSupport ? [{ label: "Ask support", requestType: "support", primary: false }] : [])
  ];

  return (
    <div className={layout === "grid" ? "grid gap-2 sm:grid-cols-3" : "flex flex-col gap-2 sm:flex-row"}>
      {requests.map((request) => (
        <Link
          key={request.requestType}
          href={
            request.requestType === "equivalent"
              ? buildEquivalentFinderHref({ segment, category, subcategory, family })
              : buildRequestHref({ segment, category, subcategory, family, requestType: request.requestType })
          }
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
