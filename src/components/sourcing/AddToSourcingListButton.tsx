"use client";

import { useRef } from "react";
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
  const alreadyAdded = items.some((existingItem) => existingItem.href === item.href);

  return (
    <button
      type="button"
      aria-pressed={alreadyAdded}
      onClick={() => {
        if (!alreadyAdded) {
          trackBioAxisEvent("sourcing_list_add", { itemType: item.productSlug ? "product" : "family" });
        }
        addItem({ ...item, requestedAction }, buttonRef.current);
      }}
      ref={buttonRef}
      className={[
        "inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-bold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black",
        className
      ].join(" ")}
    >
      {alreadyAdded ? addedLabel : label}
    </button>
  );
}
