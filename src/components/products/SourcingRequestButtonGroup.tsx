import Link from "next/link";
import { buildRequestHref } from "@/data/productTaxonomy";

type SourcingRequestButtonGroupProps = {
  segment?: string;
  category?: string;
  family?: string;
  size?: "sm" | "md";
  layout?: "grid" | "inline";
  includeSupport?: boolean;
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
  family,
  size = "sm",
  layout = "grid",
  includeSupport = false
}: SourcingRequestButtonGroupProps) {
  const requests = [
    { label: "Request quote", inquiryType: "quote", primary: true },
    { label: "Find equivalent", inquiryType: "equivalent", primary: false },
    { label: "Request sample", inquiryType: "sample", primary: false },
    ...(includeSupport ? [{ label: "Ask support", inquiryType: "support", primary: false }] : [])
  ];

  return (
    <div className={layout === "grid" ? "grid gap-2 sm:grid-cols-3" : "flex flex-col gap-2 sm:flex-row"}>
      {requests.map((request) => (
        <Link
          key={request.inquiryType}
          href={buildRequestHref({ segment, category, family, inquiryType: request.inquiryType })}
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
