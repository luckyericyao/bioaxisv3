import { buildRequestHref } from "@/data/productTaxonomy";
import { SourcingRequestLink } from "./SourcingRequestLink";

type SourcingRequestButtonGroupProps = {
  segment?: string;
  category?: string;
  subcategory?: string;
  family?: string;
  product?: string;
  size?: "sm" | "md";
  layout?: "grid" | "inline" | "decision";
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
  includeDocumentation = true,
  sourcePage,
  query
}: SourcingRequestButtonGroupProps) {
  const requests = [
    { label: product ? "Request quote for this product" : "Request quote", requestType: "quote", primary: true },
    { label: "Review equivalent", requestType: "equivalent", primary: false },
    { label: "Request sample", requestType: "sample", primary: false },
    ...(includeDocumentation ? [{ label: "Ask for documents", requestType: "documentation", primary: false }] : []),
    ...(includeSupport ? [{ label: "Recurring supply", requestType: "recurring-supply", primary: false }] : [])
  ];

  const renderRequest = (request: (typeof requests)[number]) => (
    <SourcingRequestLink
      key={request.requestType}
      href={buildRequestHref({ segment, category, subcategory, family, product, requestType: request.requestType, sourcePage, query })}
      className={[
        baseClass,
        layout === "decision" ? `min-h-11 px-4 text-xs ${request.primary ? "col-span-2" : ""}` : sizeClass[size],
        request.primary
          ? "border-bioaxis-accent bg-bioaxis-accent text-bioaxis-black hover:bg-transparent hover:text-bioaxis-accent"
          : "border-bioaxis-line text-bioaxis-steel hover:border-bioaxis-accent hover:text-bioaxis-accent"
      ].join(" ")}
    >
      {request.label}
    </SourcingRequestLink>
  );

  if (layout === "decision") {
    const primaryRequests = requests.filter((request) => ["quote", "sample", "equivalent"].includes(request.requestType));
    const additionalRequests = requests.filter((request) => !primaryRequests.includes(request));

    return (
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" data-sourcing-primary-actions="true">
          {primaryRequests.map(renderRequest)}
        </div>
        {additionalRequests.length > 0 ? (
          <details className="group border border-bioaxis-line bg-bioaxis-panel">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-semibold text-bioaxis-steel [&::-webkit-details-marker]:hidden">
              <span>More sourcing actions</span>
              <span aria-hidden="true" className="text-bioaxis-accent transition group-open:rotate-45">+</span>
            </summary>
            <div className="grid gap-2 border-t border-bioaxis-line p-3 sm:grid-cols-2">
              {additionalRequests.map(renderRequest)}
            </div>
          </details>
        ) : null}
      </div>
    );
  }

  return (
    <div className={layout === "grid" ? "grid gap-2 sm:grid-cols-2 xl:grid-cols-4" : "flex flex-col gap-2 sm:flex-row sm:flex-wrap"}>
      {requests.map(renderRequest)}
    </div>
  );
}
