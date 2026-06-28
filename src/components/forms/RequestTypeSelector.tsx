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
      {requestTypes.map((requestType) => {
        const selected = requestType.id === selectedId;
        const shortLabel = shortRequestTypeLabel(requestType.id);
        const shortDescription = shortRequestTypeDescription(requestType.id);

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
              aria-label={`${shortLabel}. ${selected ? "Selected." : "Not selected."} ${shortDescription}`}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="text-sm font-bold uppercase leading-tight text-bioaxis-text">{shortLabel}</span>
                {selected ? <span className="text-[11px] font-bold uppercase text-bioaxis-accent">Selected</span> : null}
              </span>
              <span className="mt-3 block text-xs leading-5 text-bioaxis-muted">{shortDescription}</span>
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
    contact: "General sourcing question"
  };

  return labels[id] ?? id;
}

function shortRequestTypeDescription(id: string) {
  const descriptions: Record<string, string> = {
    quote: "Send product context for quote follow-up.",
    "product-list-review": "Paste multiple lines or a spreadsheet-style list.",
    equivalent: "Review alternatives for a current product.",
    sample: "Request samples before switching.",
    documentation: "Ask for CoA, SDS, sterility, or material documents.",
    "recurring-supply": "Plan repeat demand and monthly usage.",
    contact: "Ask a sourcing question."
  };

  return descriptions[id] ?? "Send sourcing context.";
}
