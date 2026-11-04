import { getRequestTypeById } from "@/data/requestTypes";
import type { BioAxisProductContext } from "@/lib/submitBioAxisRequest";
import { apiRequestType } from "./intakeState";
import type { SourcingListSummaryItem } from "./types";

function requestTypeLabel(requestType: string) {
  return getRequestTypeById(apiRequestType(requestType)).label;
}

function sourcingItemPath(item: SourcingListSummaryItem) {
  return [item.segmentTitle, item.categoryTitle, item.familyTitle, item.productTitle].filter(Boolean).join(" / ");
}

function displaySourcePage(value: string) {
  try {
    const parsed = new URL(value, "https://bioaxis.local");
    const formatVisibleUnits = (text: string) =>
      text
        .replace(/(\d+(?:\.\d+)?)\s*u[lL]\b/g, "$1 µL")
        .replace(/\bu[lL]\b/g, "µL")
        .replace(/(\d+(?:\.\d+)?)\s*u[mM]\b/g, "$1 µm")
        .replace(/\bu[mM]\b/g, "µm");
    const search = [...parsed.searchParams.entries()]
      .map(([key, item]) => `${decodeURIComponent(key)}=${formatVisibleUnits(item)}`)
      .join("&");

    const pathSegments = parsed.pathname
      .split("/")
      .filter(Boolean)
    const lastPathIndex = pathSegments.length - 1;
    const displayPath = pathSegments
      .map((segment, index) =>
        index === lastPathIndex ? formatVisibleUnits(decodeURIComponent(segment).replace(/-/g, " ")) : segment
      )
      .join("/");

    return `${displayPath ? `/${displayPath}` : "/"}${search ? `?${search}` : ""}`;
  } catch {
    return value;
  }
}

function contextRows(productContext: BioAxisProductContext) {
  const sourcePage = productContext.sourcePageUrl || productContext.productUrl || "";

  return [
    ["Request type", requestTypeLabel(productContext.requestType ?? "quote")],
    ["Product", productContext.productName],
    ["Family", productContext.productFamily],
    ["Category", productContext.productCategory],
    ["Segment", productContext.productSegment],
    ["Source page", sourcePage ? displaySourcePage(sourcePage) : ""]
  ].filter((row): row is [string, string] => Boolean(row[1]));
}

export function CapturedInputCard({ restored = false, captured = false }: { restored?: boolean; captured?: boolean }) {
  const title = restored ? "Pasted input captured" : "Request draft ready";
  const body = restored
    ? "BioAxis restored the input you sent from the previous page. Review or edit it below before submitting."
    : captured
      ? "BioAxis prepared this request context from the link you used. Review or edit it below before submitting."
      : "BioAxis will carry this input into the request form so you do not need to paste it again.";

  return (
    <section
      data-pasted-input-captured="true"
      className="flex flex-col gap-2 border border-bioaxis-accent/60 bg-bioaxis-panel p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
    >
      <p className="shrink-0 text-sm font-semibold uppercase text-bioaxis-accent">{title}</p>
      <p className="text-sm leading-5 text-bioaxis-muted sm:text-right">{body}</p>
    </section>
  );
}

export function SourcingListNotice({ count }: { count: number }) {
  return (
    <div data-sourcing-list-context="true" className="mb-4 border border-bioaxis-accent/60 bg-bioaxis-black px-3 py-2.5">
      <p className="text-xs font-semibold uppercase text-bioaxis-accent">Sourcing list context</p>
      <p className="mt-1 text-xs leading-5 text-bioaxis-muted">
        BioAxis will include {count} sourcing list {count === 1 ? "item" : "items"} with this request. Only your email is required.
      </p>
    </div>
  );
}

export function RequestContextCard({
  productContext,
  draftReady,
  compact = false
}: {
  productContext: BioAxisProductContext;
  draftReady: boolean;
  compact?: boolean;
}) {
  const rows = contextRows(productContext);
  const compactRows = rows.filter(([label]) => label !== "Source page");

  return (
    <section data-product-context-summary="true" className={compact ? "mb-3 border border-bioaxis-accent/60 bg-bioaxis-panel p-2 sm:p-4" : "border border-bioaxis-accent/60 bg-bioaxis-panel p-4 sm:p-5"}>
      <div className="flex items-center justify-between gap-3">
        <p className={compact ? "text-[10px] font-semibold uppercase text-bioaxis-accent sm:text-sm" : "text-xs font-semibold uppercase text-bioaxis-accent sm:text-sm"}>Request context</p>
        <p className={compact ? "sr-only" : "text-[10px] font-semibold uppercase text-bioaxis-dim sm:text-xs"}>
          <span className="sm:hidden">{draftReady ? "Draft ready" : "Captured"}</span>
          <span className="hidden sm:inline">{draftReady ? "Request draft ready" : "Captured automatically"}</span>
        </p>
      </div>
      <p className={compact ? "sr-only" : "mt-2 max-w-4xl text-xs leading-5 text-bioaxis-muted sm:text-sm"}>
        {compact ? (
          <>
            Context included automatically.
            <span className="sr-only"> BioAxis will include this product context with your request. You can add more details below, but it is not required.</span>
          </>
        ) : (
          <>
            <span className="sm:hidden">Product context is included automatically.</span>
            <span className="hidden sm:inline">BioAxis will include this product context with your request. You can add more details below, but it is not required.</span>
          </>
        )}
      </p>
      {compact ? (
        <dl className="mt-2 grid gap-1 border-t border-bioaxis-line pt-2 sm:grid-cols-2 sm:gap-x-4">
          {compactRows.map(([label, value]) => (
            <div key={label} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-baseline gap-1.5">
              <dt className="text-[10px] font-bold uppercase text-bioaxis-dim">{label}:</dt>
              <dd className="min-w-0 text-xs font-semibold leading-5 text-bioaxis-text" title={value}>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <dl className="mt-3 grid border-t border-bioaxis-line md:grid-cols-[0.55fr_1.5fr_0.7fr] md:gap-2 md:border-0">
          {rows.map(([label, value]) => (
            <div key={label} className="border-b border-bioaxis-line py-2.5 last:border-b-0 md:border md:bg-bioaxis-black md:px-3">
              <dt className="text-xs font-bold uppercase text-bioaxis-dim">{label}</dt>
              <dd className="mt-1 break-words text-sm font-semibold leading-5 text-bioaxis-text">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

export function SourcingListSummary({ items }: { items: SourcingListSummaryItem[] }) {
  return (
    <section data-sourcing-list-summary="true" className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Sourcing list detected</p>
      <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">BioAxis will include these items.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-bioaxis-muted">
        Submit with only an email. Sourcing list drawer items are included automatically.
      </p>
      <div className="mt-6 grid gap-3">
        {items.slice(0, 6).map((item, index) => (
          <article key={item.id ?? `${item.title}-${index}`} className="border border-bioaxis-line bg-bioaxis-black p-4">
            <h3 className="text-sm font-bold text-bioaxis-text">{item.title ?? item.productTitle ?? `Sourcing item ${index + 1}`}</h3>
            <p className="mt-2 text-xs leading-5 text-bioaxis-muted">{sourcingItemPath(item) || item.href || "Product context captured"}</p>
          </article>
        ))}
      </div>
      {items.length > 6 ? <p className="mt-4 text-sm text-bioaxis-muted">Plus {items.length - 6} more sourcing list items.</p> : null}
    </section>
  );
}

