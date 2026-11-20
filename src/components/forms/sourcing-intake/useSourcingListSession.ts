import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useSourcingList } from "@/components/sourcing/SourcingListProvider";
import type { IntakeState, SourcingHandoffMode } from "./types";
import { parseSourcingList, readBrowserStorage, removeBrowserStorage, restoreSourcingListHandoff, retireSourcingListHandoff, sourcingListSubmissionHeader, type SourcingListItem } from "@/lib/sourcingListStorage";

const sourcingListStorageKey = "bioaxis:sourcing-list";
const sourcingListSubmissionStorageKey = "bioaxis:sourcing-list-submission";
const sourcingListItemsStorageKey = "bioaxis:sourcing-list-items";
const sourcingListSubmittedEvent = "bioaxis:sourcing-list-submitted";

type StoredSourcingSubmission = { productList: string | null; items: string | null; listHandoffId?: string };

function readStoredSourcingSubmission(mode: SourcingHandoffMode | undefined): StoredSourcingSubmission {
  if (!mode || mode === "list") return { productList: null, items: null };
  return {
    productList: readBrowserStorage("sessionStorage", sourcingListSubmissionStorageKey).value,
    items: mode === "text" ? null : readBrowserStorage("sessionStorage", sourcingListItemsStorageKey).value
  };
}

export function clearStoredSourcingSubmission(snapshot: StoredSourcingSubmission, submittedItems: readonly SourcingListItem[]) {
  if (typeof window === "undefined") return;

  for (const [key, submittedValue] of [[sourcingListSubmissionStorageKey, snapshot.productList], [sourcingListItemsStorageKey, snapshot.items]] as const) {
    if (submittedValue !== null && readBrowserStorage("sessionStorage", key).value === submittedValue) {
      removeBrowserStorage("sessionStorage", key);
    }
  }
  if (snapshot.listHandoffId && submittedItems.length) retireSourcingListHandoff(snapshot.listHandoffId);
  if (submittedItems.length) {
    window.dispatchEvent(new CustomEvent(sourcingListSubmittedEvent, { detail: submittedItems }));
  }
}

export function useSourcingListSession(setState: Dispatch<SetStateAction<IntakeState>>, handoffMode?: SourcingHandoffMode, listHandoffId?: string) {
  const [sourcingListItems, setSourcingListItems] = useState<SourcingListItem[]>([]);
  const [restoredSessionInput, setRestoredSessionInput] = useState(false);
  const [restoredListHandoff, setRestoredListHandoff] = useState(false);
  const { items } = useSourcingList();
  const usingLiveList = useRef(false);
  const reviewedItemIds = useRef<Set<string> | null>(null);
  const handoffSnapshot = useRef<StoredSourcingSubmission>({ productList: null, items: null });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handoff = readStoredSourcingSubmission(handoffMode);
    const selectedHandoff = handoffMode === "list" ? restoreSourcingListHandoff(listHandoffId) : null;
    reviewedItemIds.current = selectedHandoff ? new Set(selectedHandoff.items.map((item) => item.id)) : null;
    const sessionItems = selectedHandoff?.items ?? parseSourcingList(handoff.items).items;
    const localItems = parseSourcingList(readBrowserStorage("localStorage", sourcingListStorageKey).value).items;
    const listText = handoff.productList?.startsWith(`${sourcingListSubmissionHeader}\n`);
    const sessionProductList = !sessionItems.length ? handoff.productList?.trim() ?? "" : "";
    handoffSnapshot.current = {
      productList: sessionProductList || (sessionItems.length && listText) ? handoff.productList : null,
      items: sessionItems.length ? handoff.items : null,
      listHandoffId: selectedHandoff?.id
    };

    setRestoredListHandoff(Boolean(selectedHandoff));
    setSourcingListItems(sessionItems.length > 0 ? sessionItems : localItems);
    if (sessionProductList) {
      setRestoredSessionInput(true);
      setState((current) => (current.productInput.trim() ? current : { ...current, productInput: sessionProductList }));
    }
  }, [handoffMode, listHandoffId, setState]);

  useEffect(() => {
    if (items.length || usingLiveList.current) {
      usingLiveList.current = true;
      const reviewed = reviewedItemIds.current;
      setSourcingListItems(reviewed ? items.filter((item) => reviewed.has(item.id)) : items);
    }
  }, [items]);

  function resetListHandoff() {
    reviewedItemIds.current = null;
    handoffSnapshot.current = { productList: null, items: null };
    setRestoredListHandoff(false);
    setRestoredSessionInput(false);
    setSourcingListItems(items);
  }

  return { sourcingListItems, setSourcingListItems, restoredSessionInput, setRestoredSessionInput, restoredListHandoff, handoffSnapshot, resetListHandoff };
}
