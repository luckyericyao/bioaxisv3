"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { IntakeState, SourcingListSummaryItem } from "./types";

const sourcingListStorageKey = "bioaxis:sourcing-list";
const sourcingListSubmissionStorageKey = "bioaxis:sourcing-list-submission";
const sourcingListItemsStorageKey = "bioaxis:sourcing-list-items";
const sourcingListSubmittedEvent = "bioaxis:sourcing-list-submitted";

function readStoredSourcingItems(raw: string | null) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SourcingListSummaryItem[]) : [];
  } catch {
    return [];
  }
}

export function clearStoredSourcingSubmission() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(sourcingListSubmissionStorageKey);
  window.sessionStorage.removeItem(sourcingListItemsStorageKey);
  window.dispatchEvent(new Event(sourcingListSubmittedEvent));
}

export function useSourcingListSession(setState: Dispatch<SetStateAction<IntakeState>>) {
  const [sourcingListItems, setSourcingListItems] = useState<SourcingListSummaryItem[]>([]);
  const [restoredSessionInput, setRestoredSessionInput] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionItems = readStoredSourcingItems(window.sessionStorage.getItem(sourcingListItemsStorageKey));
    const localItems = readStoredSourcingItems(window.localStorage.getItem(sourcingListStorageKey));
    const sessionProductList = window.sessionStorage.getItem(sourcingListSubmissionStorageKey)?.trim() ?? "";

    setSourcingListItems(sessionItems.length > 0 ? sessionItems : localItems);
    if (sessionProductList) {
      setRestoredSessionInput(true);
      setState((current) => (current.productInput.trim() ? current : { ...current, productInput: sessionProductList }));
    }
  }, [setState]);

  return { sourcingListItems, setSourcingListItems, restoredSessionInput, setRestoredSessionInput };
}
