import { useId } from "react";
import type { BioAxisProductContext } from "@/lib/submitBioAxisRequest";
import type { SourcingListItem } from "@/lib/sourcingListStorage";
import { maxSourcingListItems } from "@/lib/sourcingNeed";
import { sourcingSpecifications } from "@/lib/sourcingSpecifications";

function sourceLabel(value: string | undefined) {
  if (!value) return "";
  try {
    const url = new URL(value, "https://bioaxis.local");
    const pathname = decodeURIComponent(url.pathname);
    const search = decodeURIComponent(url.search.replace(/\+/g, " "));
    return `${pathname}${search}`
      .replace(/(\d+(?:\.\d+)?)\s*u[lL]\b/g, "$1 µL")
      .replace(/\bu[lL]\b/g, "µL").replace(/(\d+(?:\.\d+)?)\s*um\b/g, "$1 µm");
  } catch { return "Source page included"; }
}

export function RequestContextCard({ productContext }: {
  productContext: BioAxisProductContext;
  draftReady?: boolean;
  compact?: boolean;
}) {
  const rows = [
    ["Product", productContext.productName], ["Family", productContext.productFamily],
    ["Category", productContext.productCategory], ["Segment", productContext.productSegment],
    ["Request type", productContext.requestType], ["Source page", sourceLabel(productContext.sourcePageUrl || productContext.productUrl)]
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const title = productContext.productName || productContext.productFamily || productContext.productCategory || productContext.productSegment || "Source page included";
  return (
    <section data-product-context-summary="true" className="rounded border border-bioaxis-line bg-bioaxis-panelSoft px-4 py-3" aria-label="Included request context">
      <h2 className="tool-heading">Request context</h2>
      <p className="mt-2 break-words font-medium">{title}</p>
      {productContext.relevantSpecs?.length ? <ul className="mt-3 grid gap-1 text-sm text-bioaxis-muted" aria-label="Target details to review">{sourcingSpecifications(productContext.relevantSpecs).slice(0, 3).map((spec) => <li key={spec.key}>{spec.label}: {spec.status === "target" ? spec.value : "To confirm"}</li>)}</ul> : null}
      <details className="mt-2">
        <summary className="min-h-11 cursor-pointer py-2 text-sm font-medium text-bioaxis-accent">More context</summary>
        <div className="border-t border-bioaxis-line pb-1">
        <dl className="grid gap-3 pt-3">
          {rows.map(([label, value]) => <div key={label} className="grid gap-1 sm:grid-cols-[100px_minmax(0,1fr)]">
            <dt className="text-sm text-bioaxis-muted">{label}</dt><dd className="break-words text-sm">{value}</dd>
          </div>)}
        </dl>
        {productContext.relevantSpecs?.length ? <ul className="mt-3 grid gap-2 text-sm text-bioaxis-muted" aria-label="All source specifications">{productContext.relevantSpecs.map((spec, index) => <li key={`${index}-${spec}`}>{spec}</li>)}</ul> : null}
        </div>
      </details>
      <p className="helper-text text-bioaxis-muted">Included automatically; details to confirm.</p>
    </section>
  );
}

export function SourcingListSummary({ items, included, submitting, onIncludeChange, onEdit }: {
  items: SourcingListItem[];
  included: boolean;
  submitting: boolean;
  onIncludeChange: (included: boolean) => void;
  onEdit?: (target: HTMLButtonElement) => void;
}) {
  const limitId = useId();
  const overLimit = included && items.length > maxSourcingListItems;
  return (
    <section data-sourcing-list-summary="true" data-sourcing-list-context="true" className="rounded border border-bioaxis-line bg-bioaxis-panelSoft px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Sourcing list: {items.length} {items.length === 1 ? "item" : "items"} {overLimit ? "selected" : included ? "included" : "saved"}</span>
        {onEdit ? <button type="button" aria-haspopup="dialog" onClick={(event) => onEdit(event.currentTarget)}
          className="min-h-11 shrink-0 px-2 text-sm font-medium text-bioaxis-accent">Edit list</button> : null}
      </div>
      <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
        <input type="checkbox" checked={included} disabled={submitting} aria-describedby={overLimit ? limitId : undefined}
          onChange={(event) => onIncludeChange(event.target.checked)} className="field-focus size-4 accent-bioaxis-accent" />
        Include saved sourcing list
      </label>
      {overLimit ? <p id={limitId} role="status" className="mb-2 text-sm text-red-800">
        Up to {maxSourcingListItems} sourcing-list items per request. Your saved list has not changed.
      </p> : null}
      <details>
        <summary className="min-h-11 cursor-pointer py-2 text-sm text-bioaxis-muted">Review saved items</summary>
        <ul className="grid gap-2 border-t border-bioaxis-line pt-3 text-sm">
          {items.map((item) => <li key={item.id} className="break-words">{item.title}</li>)}
        </ul>
      </details>
    </section>
  );
}
