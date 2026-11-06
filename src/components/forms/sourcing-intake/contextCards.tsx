import type { BioAxisProductContext } from "@/lib/submitBioAxisRequest";
import type { SourcingListSummaryItem } from "./types";

function sourceLabel(value: string | undefined) {
  if (!value) return "";
  try {
    const url = new URL(value, "https://bioaxis.local");
    return decodeURIComponent(`${url.pathname}${url.search}`)
      .replace(/\+/g, " ").replace(/(\d+(?:\.\d+)?)\s*u[lL]\b/g, "$1 µL")
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
    <details data-product-context-summary="true" className="rounded border border-bioaxis-line bg-bioaxis-panelSoft">
      <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-medium">
        Request context: <span className="break-words">{title}</span>
      </summary>
      <div className="border-t border-bioaxis-line px-4 pb-4">
        <dl className="grid gap-3 pt-3">
          {rows.map(([label, value]) => <div key={label} className="grid gap-1 sm:grid-cols-[100px_minmax(0,1fr)]">
            <dt className="text-sm text-bioaxis-muted">{label}</dt><dd className="break-words text-sm">{value}</dd>
          </div>)}
        </dl>
        <p className="helper-text mt-3 text-bioaxis-muted">Included automatically. Edit your request in the field above.</p>
      </div>
    </details>
  );
}

export function SourcingListSummary({ items, onEdit }: {
  items: SourcingListSummaryItem[];
  onEdit?: (target: HTMLButtonElement) => void;
}) {
  return (
    <section data-sourcing-list-summary="true" data-sourcing-list-context="true" className="rounded border border-bioaxis-line bg-bioaxis-panelSoft px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Sourcing list: {items.length} {items.length === 1 ? "item" : "items"} included</span>
        {onEdit ? <button type="button" aria-haspopup="dialog" onClick={(event) => onEdit(event.currentTarget)}
          className="min-h-11 shrink-0 px-2 text-sm font-medium text-bioaxis-accent">Edit list</button> : null}
      </div>
      <details>
        <summary className="min-h-11 cursor-pointer py-2 text-sm text-bioaxis-muted">Review selected items</summary>
        <ul className="grid gap-2 border-t border-bioaxis-line pt-3 text-sm">
          {items.map((item, index) => <li key={item.id ?? index} className="break-words">{item.title || item.productTitle || item.familyTitle}</li>)}
        </ul>
      </details>
    </section>
  );
}
