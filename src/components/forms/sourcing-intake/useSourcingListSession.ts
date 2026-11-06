import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useSourcingList } from "@/components/sourcing/SourcingListProvider";
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
  const { items } = useSourcingList();
  const usingLiveList = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionItems = readStoredSourcingItems(window.sessionStorage.getItem(sourcingListItemsStorageKey));
    const localItems = readStoredSourcingItems(window.localStorage.getItem(sourcingListStorageKey));
    const sessionProductList = window.sessionStorage.getItem(sourcingListSubmissionStorageKey)?.trim() ?? "";

    setSourcingListItems(sessionItems.length > 0 ? sessionItems : localItems);
    if (sessionProductList && sessionItems.length === 0) {
      setRestoredSessionInput(true);
      setState((current) => (current.productInput.trim() ? current : { ...current, productInput: sessionProductList }));
    }
  }, [setState]);

  useEffect(() => {
    if (items.length || usingLiveList.current) {
      usingLiveList.current = true;
      setSourcingListItems(items);
    }
  }, [items]);

  return { sourcingListItems, setSourcingListItems, restoredSessionInput, setRestoredSessionInput };
}
