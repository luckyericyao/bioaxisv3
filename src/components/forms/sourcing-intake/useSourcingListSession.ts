import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useSourcingList } from "@/components/sourcing/SourcingListProvider";
import type { IntakeState, SourcingHandoffMode } from "./types";
import { parseSourcingList, readBrowserStorage, removeBrowserStorage, restoreSourcingListHandoff, retireSourcingListHandoff, sourcingListSubmissionHeader, type SourcingListItem } from "@/lib/sourcingListStorage";

const sourcingListStorageKey = "bioaxis:sourcing-list";
const sourcingListSubmissionStorageKey = "bioaxis:sourcing-list-submission";
const sourcingListItemsStorageKey = "bioaxis:sourcing-list-items";
const sourcingListSubmittedEvent = "bioaxis:sourcing-list-submitted";

type StoredSourcingSubmission = { productList: string | null; items: string | null; listHandoffId?: string };

function reviewedRowsOnly(items: SourcingListItem[], reviewed: ReadonlyMap<string, string> | null) {
  return reviewed ? items.filter((item) => reviewed.get(item.id) === item.addedAt) : items;
}

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
  const [listHandoffStatus, setListHandoffStatus] = useState<"none" | "restored" | "unavailable">("none");
  const { items } = useSourcingList();
  const usingLiveList = useRef(false);
  const reviewedRows = useRef<ReadonlyMap<string, string> | null>(null);
  const handoffSnapshot = useRef<StoredSourcingSubmission>({ productList: null, items: null });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handoff = readStoredSourcingSubmission(handoffMode);
    const selectedHandoff = handoffMode === "list" ? restoreSourcingListHandoff(listHandoffId) : null;
    reviewedRows.current = selectedHandoff ? new Map(selectedHandoff.items.map((item) => [item.id, item.addedAt])) : null;
    const sessionItems = selectedHandoff?.items ?? parseSourcingList(handoff.items).items;
    const savedList = readBrowserStorage("localStorage", sourcingListStorageKey);
    const { items: localItems, needsReview } = parseSourcingList(savedList.value);
    // A readable empty saved list means the reviewed rows were removed, not that the draft needs recovering.
    const restoredItems = selectedHandoff?.followsSavedList && savedList.available && !needsReview
      ? reviewedRowsOnly(localItems, reviewedRows.current)
      : sessionItems.length > 0 ? sessionItems : localItems;
    const listText = handoff.productList?.startsWith(`${sourcingListSubmissionHeader}\n`);
    const sessionProductList = !sessionItems.length ? handoff.productList?.trim() ?? "" : "";
    handoffSnapshot.current = {
      productList: sessionProductList || (sessionItems.length && listText) ? handoff.productList : null,
      items: sessionItems.length ? handoff.items : null,
      listHandoffId: selectedHandoff?.id
    };

    setListHandoffStatus(handoffMode !== "list" ? "none" : selectedHandoff ? "restored" : "unavailable");
    setSourcingListItems(restoredItems);
    if (sessionProductList) {
      setRestoredSessionInput(true);
      setState((current) => (current.productInput.trim() ? current : { ...current, productInput: sessionProductList }));
    }
  }, [handoffMode, listHandoffId, setState]);

  useEffect(() => {
    if (items.length || usingLiveList.current) {
      usingLiveList.current = true;
      setSourcingListItems(reviewedRowsOnly(items, reviewedRows.current));
    }
  }, [items]);

  function resetListHandoff() {
    reviewedRows.current = null;
    handoffSnapshot.current = { productList: null, items: null };
    setListHandoffStatus("none");
    setRestoredSessionInput(false);
    setSourcingListItems(items);
  }

  return {
    sourcingListItems, setSourcingListItems, restoredSessionInput, setRestoredSessionInput,
    listHandoffStatus, handoffSnapshot, resetListHandoff
  };
}
