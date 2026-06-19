"use client";

import type { RequestType } from "@/data/requestTypes";

type RequestTypeSelectorProps = {
  requestTypes: RequestType[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function RequestTypeSelector({ requestTypes, selectedId, onSelect }: RequestTypeSelectorProps) {
  return (
    <ul className="grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3" role="list" aria-label="Request type options">
      {requestTypes.map((requestType, index) => {
        const selected = requestType.id === selectedId;
        const typeNumber = (index + 1).toString().padStart(2, "0");

        return (
          <li key={requestType.id}>
            <button
              type="button"
              onClick={() => onSelect(requestType.id)}
              className={[
                "flex min-h-44 w-full flex-col justify-start border p-5 text-left transition",
                selected ? "border-bioaxis-accent bg-bioaxis-accent/10" : "border-bioaxis-line bg-bioaxis-black hover:border-bioaxis-accent/70"
              ].join(" ")}
              aria-pressed={selected}
              aria-label={`Request type ${typeNumber}. ${requestType.label}. ${selected ? "Selected." : "Not selected."} ${requestType.description}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-accent">
                  Request type {typeNumber}{" "}
                </span>
                <span className={selected ? "text-[11px] font-bold uppercase text-bioaxis-accent" : "text-[11px] font-bold uppercase text-bioaxis-dim"}>
                  {selected ? "Selected request " : "Available request "}
                </span>
              </span>
              <span className="mt-4 block text-sm font-bold uppercase text-bioaxis-text">{requestType.label} </span>
              <span className="mt-3 block text-sm leading-6 text-bioaxis-muted">{requestType.description}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
