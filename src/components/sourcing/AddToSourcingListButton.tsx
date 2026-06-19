"use client";

import { useState } from "react";
import { type SourcingListItem, useSourcingList } from "./SourcingListProvider";

type AddToSourcingListButtonProps = Omit<
  SourcingListItem,
  | "id"
  | "quantity"
  | "currentSupplier"
  | "catalogNumber"
  | "equivalentNeeded"
  | "sampleNeeded"
  | "documentationNeeded"
  | "notes"
  | "sourcePageUrl"
  | "addedAt"
> & {
  className?: string;
};

export function AddToSourcingListButton({ className = "", ...item }: AddToSourcingListButtonProps) {
  const { addItem } = useSourcingList();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(item);
        setAdded(true);
      }}
      className={[
        "inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-bold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black",
        className
      ].join(" ")}
    >
      {added ? "Added to sourcing list" : "Add to sourcing list"}
    </button>
  );
}
