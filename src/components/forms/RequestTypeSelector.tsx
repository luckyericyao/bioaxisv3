"use client";

import type { RequestType } from "@/data/requestTypes";

type RequestTypeSelectorProps = {
  requestTypes: RequestType[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function RequestTypeSelector({ requestTypes, selectedId, onSelect }: RequestTypeSelectorProps) {
  return (
    <ul className="grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Request type options">
      {requestTypes.map((requestType, index) => {
        const selected = requestType.id === selectedId;
        const typeNumber = (index + 1).toString().padStart(2, "0");
        const shortLabel = shortRequestTypeLabel(requestType.id);

        return (
          <li key={requestType.id}>
            <button
              type="button"
              onClick={() => onSelect(requestType.id)}
              className={[
                "flex min-h-20 w-full flex-col justify-between border p-3 text-left transition",
                selected ? "border-bioaxis-accent bg-bioaxis-accent/10" : "border-bioaxis-line bg-bioaxis-black hover:border-bioaxis-accent/70"
              ].join(" ")}
              aria-pressed={selected}
              aria-label={`Request type ${typeNumber}. ${shortLabel}. ${selected ? "Selected." : "Not selected."} ${requestType.description}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-accent">Type {typeNumber}</span>
                <span className={selected ? "text-[11px] font-bold uppercase text-bioaxis-accent" : "text-[11px] font-bold uppercase text-bioaxis-dim"}>
                  {selected ? "Selected" : "Choose"}
                </span>
              </span>
              <span className="mt-3 block text-sm font-bold uppercase text-bioaxis-text">{shortLabel}</span>
              <span className="sr-only"> {requestType.description} End of {shortLabel} card.</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function shortRequestTypeLabel(id: string) {
  const labels: Record<string, string> = {
    quote: "Quote",
    equivalent: "Equivalent",
    sample: "Sample",
    documentation: "Documentation",
    "recurring-supply": "Recurring supply",
    "product-list-review": "Product list",
    contact: "Contact"
  };

  return labels[id] ?? id;
}
