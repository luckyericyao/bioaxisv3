"use client";

import { useEffect, useRef, useState } from "react";
import { type SourcingListItem, useSourcingList } from "./SourcingListProvider";
import { trackBioAxisEvent } from "@/lib/trackBioAxisEvent";

type AddToSourcingListButtonProps = Omit<
  SourcingListItem,
  | "id"
  | "quantity"
  | "currentSupplier"
  | "catalogNumber"
  | "requestedAction"
  | "equivalentNeeded"
  | "sampleNeeded"
  | "documentationNeeded"
  | "notes"
  | "sourcePageUrl"
  | "addedAt"
> & {
  className?: string;
  label?: string;
  addedLabel?: string;
  requestedAction?: string;
};

export function AddToSourcingListButton({
  className = "",
  label = "Add to sourcing list",
  addedLabel = "Added to sourcing list",
  requestedAction = "Quote",
  ...item
}: AddToSourcingListButtonProps) {
  const { addItem, items } = useSourcingList();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [ready, setReady] = useState(false);
  const alreadyAdded = items.some((existingItem) => existingItem.href === item.href);
  useEffect(() => setReady(true), []);

  return (
    <button
      type="button"
      disabled={!ready}
      aria-pressed={alreadyAdded}
      aria-haspopup="dialog"
      onClick={() => {
        if (!alreadyAdded) {
          trackBioAxisEvent("sourcing_list_add", { itemType: item.productSlug ? "product" : "family" });
        }
        addItem({ ...item, requestedAction }, buttonRef.current);
      }}
      ref={buttonRef}
      className={[
        "inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold  text-bioaxis-accent transition enabled:hover:bg-bioaxis-accent enabled:hover:text-bioaxis-black disabled:cursor-not-allowed disabled:opacity-70",
        className
      ].join(" ")}
    >
      {alreadyAdded ? addedLabel : label}
    </button>
  );
}
