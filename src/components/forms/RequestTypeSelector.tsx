"use client";

import type { RequestType } from "@/data/requestTypes";

type RequestTypeSelectorProps = {
  requestTypes: RequestType[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function RequestTypeSelector({ requestTypes, selectedId, onSelect }: RequestTypeSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {requestTypes.map((requestType, index) => {
        const selected = requestType.id === selectedId;

        return (
          <button
            key={requestType.id}
            type="button"
            onClick={() => onSelect(requestType.id)}
            className={[
              "flex min-h-40 flex-col justify-start border p-5 text-left transition",
              selected ? "border-bioaxis-accent bg-bioaxis-accent/10" : "border-bioaxis-line bg-bioaxis-black hover:border-bioaxis-accent/70"
            ].join(" ")}
            aria-pressed={selected}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-accent">
                Type {(index + 1).toString().padStart(2, "0")}
              </span>
              {selected ? <span className="text-[11px] font-bold uppercase text-bioaxis-accent">Selected</span> : null}
            </span>
            <span className="mt-4 text-sm font-bold uppercase text-bioaxis-text">{requestType.label}</span>
            <span className="mt-3 block text-sm leading-6 text-bioaxis-muted">{requestType.description}</span>
          </button>
        );
      })}
    </div>
  );
}
