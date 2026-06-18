"use client";

import type { RequestType } from "@/data/requestTypes";

type RequestTypeSelectorProps = {
  requestTypes: RequestType[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function RequestTypeSelector({ requestTypes, selectedId, onSelect }: RequestTypeSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {requestTypes.map((requestType) => {
        const selected = requestType.id === selectedId;

        return (
          <button
            key={requestType.id}
            type="button"
            onClick={() => onSelect(requestType.id)}
            className={[
              "min-h-28 border p-4 text-left transition",
              selected ? "border-bioaxis-accent bg-bioaxis-accent/10" : "border-bioaxis-line bg-bioaxis-panel hover:border-bioaxis-accent/70"
            ].join(" ")}
            aria-pressed={selected}
          >
            <span className="text-sm font-bold uppercase text-bioaxis-text">{requestType.label}</span>
            <span className="mt-2 block text-xs leading-5 text-bioaxis-muted">{requestType.description}</span>
          </button>
        );
      })}
    </div>
  );
}

