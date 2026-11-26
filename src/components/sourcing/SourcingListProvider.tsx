"use client";

import Link from "next/link";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { beginSourcingListHandoff, parseSourcingList, readBrowserStorage, writeBrowserStorage, removeBrowserStorage, retainUnsubmittedSourcingItems, type SourcingListItem } from "@/lib/sourcingListStorage";
import { maxSourcingListItems } from "@/lib/sourcingNeed";
export type { SourcingListItem } from "@/lib/sourcingListStorage";

type SourcingListInput = Omit<
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
  requestedAction?: string;
};

type SourcingListContextValue = {
  items: SourcingListItem[];
  storageNotice: string;
  addItem: (item: SourcingListInput, restoreFocusTo?: HTMLElement | null) => void;
  updateItem: (id: string, patch: Partial<SourcingListItem>) => void;
  removeItem: (id: string) => void;
  openDrawer: (restoreFocusTo?: HTMLElement | null) => void;
};

const storageKey = "bioaxis:sourcing-list";
const submissionCompleteEvent = "bioaxis:sourcing-list-submitted";
const SourcingListContext = createContext<SourcingListContextValue | null>(null);

function itemKey(item: SourcingListInput) {
  return [item.segmentSlug, item.categorySlug, item.familySlug, item.productSlug, item.title].filter(Boolean).join(":");
}

function emptyFields(item: SourcingListInput): SourcingListItem {
  return {
    ...item,
    id: itemKey(item),
    quantity: "",
    currentSupplier: "",
    catalogNumber: "",
    requestedAction: item.requestedAction ?? "Quote",
    equivalentNeeded: false,
    sampleNeeded: false,
    documentationNeeded: false,
    notes: "",
    sourcePageUrl: typeof window !== "undefined" ? window.location.href : item.href,
    addedAt: new Date().toISOString()
  };
}

export function SourcingListProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [items, setItems] = useState<SourcingListItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [memoryOnly, setMemoryOnly] = useState(false);
  const [needsReview, setNeedsReview] = useState(false);
  const remainingItems = Math.max(items.length - maxSourcingListItems, 0);
  const storageNotice = memoryOnly
    ? "Your list is available in this tab only. Keep it open until you send your request."
    : needsReview ? "Some saved items could not be restored. Review your list before sending." : "";
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<{ items: SourcingListItem[]; savedValue: string | null | undefined; unsaved: boolean }>({
    items: [], savedValue: undefined, unsaved: false
  });

  const syncSavedList = useCallback((stored = readBrowserStorage("localStorage", storageKey)) => {
    const current = listRef.current;
    if (current.unsaved) return;
    setMemoryOnly(!stored.available);
    if (!stored.available || stored.value === current.savedValue) return;

    const restored = parseSourcingList(stored.value);
    listRef.current = { items: restored.items, savedValue: stored.value, unsaved: false };
    setItems(restored.items);
    setNeedsReview(restored.needsReview);
  }, []);

  const changeList = useCallback((update: (current: SourcingListItem[]) => SourcingListItem[]) => {
    const stored = readBrowserStorage("localStorage", storageKey);
    syncSavedList(stored);
    const current = listRef.current;
    const next = update(current.items);
    if (next === current.items) return;

    // After a failed write, don't publish a tab-only draft over a changed shared list.
    const maySave = stored.available && (!current.unsaved || stored.value === current.savedValue);
    const nextValue = next.length ? JSON.stringify(next) : null;
    const saved = maySave && (nextValue === null
      ? removeBrowserStorage("localStorage", storageKey)
      : writeBrowserStorage("localStorage", storageKey, nextValue));
    listRef.current = { items: next, savedValue: saved ? nextValue : current.savedValue, unsaved: !saved };
    setItems(next);
    setMemoryOnly(!saved);
  }, [syncSavedList]);

  const rememberActiveElement = useCallback(() => {
    const activeElement = document.activeElement;
    lastActiveElementRef.current = activeElement instanceof HTMLElement ? activeElement : null;
  }, []);

  const openDrawer = useCallback((restoreFocusTo?: HTMLElement | null) => {
    if (restoreFocusTo) {
      lastActiveElementRef.current = restoreFocusTo;
    } else {
      rememberActiveElement();
    }
    setDrawerOpen(true);
  }, [rememberActiveElement]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    requestAnimationFrame(() => {
      const element = lastActiveElementRef.current;
      const focusTarget = element?.isConnected ? element : document.getElementById("main-content");
      focusTarget?.focus();
      lastActiveElementRef.current = null;
    });
  }, []);

  useEffect(() => {
    syncSavedList();
    function handleStorage(event: StorageEvent) {
      if (event.key === storageKey || event.key === null) syncSavedList();
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [syncSavedList]);

  useEffect(() => {
    function handleSubmissionComplete(event: Event) {
      const submitted = (event as CustomEvent<SourcingListItem[]>).detail;
      if (!Array.isArray(submitted) || !submitted.length) return;
      changeList((current) => retainUnsubmittedSourcingItems(current, submitted));
      setDrawerOpen(false);
    }

    window.addEventListener(submissionCompleteEvent, handleSubmissionComplete);
    return () => window.removeEventListener(submissionCompleteEvent, handleSubmissionComplete);
  }, [changeList]);

  useEffect(() => {
    if (drawerOpen && !dialogRef.current?.contains(document.activeElement)) closeButtonRef.current?.focus();
  }, [drawerOpen, items]);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusable = [...dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].filter((element) => element.getClientRects().length > 0 && !element.closest('[aria-hidden="true"], [inert]'));

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeDrawer, drawerOpen]);

  const value = useMemo<SourcingListContextValue>(
    () => ({
      items,
      storageNotice,
      addItem: (input, restoreFocusTo) => {
        openDrawer(restoreFocusTo);
        changeList((current) => {
          const id = itemKey(input);
          if (current.some((item) => item.id === id)) {
            return current;
          }

          return [...current, emptyFields(input)];
        });
      },
      updateItem: (id, patch) => {
        changeList((current) => current.some((item) => item.id === id)
          ? current.map((item) => (item.id === id ? { ...item, ...patch } : item))
          : current);
      },
      removeItem: (id) => {
        changeList((current) => current.some((item) => item.id === id) ? current.filter((item) => item.id !== id) : current);
      },
      openDrawer
    }),
    [changeList, items, openDrawer, storageNotice]
  );

  function submitSourcingList(reviewBatch: boolean) {
    const stored = readBrowserStorage("localStorage", storageKey);
    syncSavedList(stored);
    const { items: latest, unsaved } = listRef.current;
    if (!latest.length || (latest.length > maxSourcingListItems && (!reviewBatch || unsaved || !stored.available))) return;
    const currentItems = reviewBatch ? latest.slice(0, maxSourcingListItems) : latest;
    const params = new URLSearchParams({
      requestType: "product-list-review",
      source: "sourcing-list",
      storedInput: "1",
      listHandoff: beginSourcingListHandoff(currentItems, !unsaved)
    });

    setDrawerOpen(false);
    lastActiveElementRef.current = null;
    router.push(`/request-quote?${params.toString()}`);
  }

  return (
    <SourcingListContext.Provider value={value}>
      <div inert={drawerOpen}>
        {children}
        {items.length > 0 ? (
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => openDrawer()}
            className="fixed bottom-5 right-5 z-50 hidden min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-xs font-semibold  text-bioaxis-black shadow-2xl transition hover:bg-bioaxis-black hover:text-bioaxis-accent sm:inline-flex"
          >
            Sourcing list ({items.length})
          </button>
        ) : null}
      </div>

      {drawerOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          role="dialog"
          data-sourcing-list-modal="true"
          aria-modal="true"
          aria-labelledby="sourcing-list-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeDrawer();
            }
          }}
        >
          <div ref={dialogRef} id="sourcing-list-dialog" className="ml-auto flex h-full w-full max-w-3xl flex-col border-l border-bioaxis-line bg-bioaxis-black shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-bioaxis-line p-5">
              <div>
                <p className="text-xs font-semibold  text-bioaxis-accent">Sourcing list</p>
                <h2 id="sourcing-list-title" className="mt-2 text-2xl font-semibold  text-bioaxis-text">Review items before sending.</h2>
                <p className="mt-2 text-sm leading-6 text-bioaxis-muted">
                  Add quantities, supplier context, sample needs, and documentation needs. BioAxis will carry the list into a structured sourcing request.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Close sourcing list"
                className="min-h-11 min-w-11 shrink-0 border border-bioaxis-line px-3 py-2 text-xs font-semibold  text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
              >
                Close
              </button>
            </div>

            <div data-sourcing-list-scroll="true" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
              {storageNotice ? <p role="status" className="mb-4 text-sm text-bioaxis-muted">{storageNotice}</p> : null}
              {items.length === 0 ? (
                <p role="status" className="text-sm leading-6 text-bioaxis-muted">
                  Your sourcing list is empty. Close this panel to add items.
                </p>
              ) : null}
              <div className="grid gap-4">
                {items.map((item, itemIndex) => (
                  <article key={item.id} aria-label={item.title} className="border border-bioaxis-line bg-bioaxis-panel p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-bioaxis-text">{item.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-bioaxis-muted">
                          {[item.segmentTitle, item.categoryTitle, item.familyTitle, item.productTitle].filter(Boolean).join(" / ")}
                        </p>
                        {item.href ? <Link
                          href={item.href}
                          onClick={closeDrawer}
                          className="mt-2 inline-flex min-h-11 items-center text-xs font-semibold  text-bioaxis-accent"
                        >
                          View page
                        </Link> : null}
                      </div>
                      <button
                        type="button"
                        data-remove-sourcing-item="true"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => {
                          value.removeItem(item.id);
                          requestAnimationFrame(() => {
                            const remainingButtons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("[data-remove-sourcing-item]");
                            const nextButton = remainingButtons?.[Math.min(itemIndex, remainingButtons.length - 1)];
                            (nextButton ?? closeButtonRef.current)?.focus();
                          });
                        }}
                        className="min-h-11 border border-bioaxis-line px-3 py-2 text-xs font-semibold  text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <DrawerField label="Quantity" value={item.quantity} onChange={(quantity) => value.updateItem(item.id, { quantity })} />
                      <DrawerField label="Current supplier" value={item.currentSupplier} onChange={(currentSupplier) => value.updateItem(item.id, { currentSupplier })} />
                      <DrawerField label="Catalog number" value={item.catalogNumber} onChange={(catalogNumber) => value.updateItem(item.id, { catalogNumber })} />
                    </div>
                    <label className="mt-4 block">
                      <span className="mb-2 block text-xs font-semibold  text-bioaxis-steel">Requested action</span>
                      <select
                        value={item.requestedAction}
                        onChange={(event) => value.updateItem(item.id, { requestedAction: event.target.value })}
                        className="field-focus min-h-11 w-full border border-bioaxis-line bg-bioaxis-black px-3 text-sm text-bioaxis-text"
                      >
                        <option>Quote</option>
                        <option>Equivalent</option>
                        <option>Sample</option>
                        <option>Documents</option>
                        <option>Recurring supply</option>
                      </select>
                    </label>
                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                      <DrawerToggle label="Equivalent needed" checked={item.equivalentNeeded} onChange={(equivalentNeeded) => value.updateItem(item.id, { equivalentNeeded })} />
                      <DrawerToggle label="Sample needed" checked={item.sampleNeeded} onChange={(sampleNeeded) => value.updateItem(item.id, { sampleNeeded })} />
                      <DrawerToggle label="Documentation needed" checked={item.documentationNeeded} onChange={(documentationNeeded) => value.updateItem(item.id, { documentationNeeded })} />
                    </div>
                    <label className="mt-4 block">
                      <span className="mb-2 block text-xs font-semibold  text-bioaxis-steel">Notes</span>
                      <textarea
                        value={item.notes}
                        rows={3}
                        onChange={(event) => value.updateItem(item.id, { notes: event.target.value })}
                        className="field-focus w-full resize-y border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-sm text-bioaxis-text"
                      />
                    </label>
                  </article>
                ))}
              </div>
            </div>

            <div className="border-t border-bioaxis-line p-5">
              {remainingItems > 0 ? <p id="sourcing-list-batch-note" role="status" className="mb-3 text-sm text-bioaxis-muted">
                {memoryOnly ? `This tab-only list exceeds the ${maxSourcingListItems}-item limit per request.`
                  : `${remainingItems} ${remainingItems === 1 ? "item" : "items"} will stay in the saved list for a separate request.`}
              </p> : null}
              <button
                type="button"
                disabled={items.length === 0 || (remainingItems > 0 && memoryOnly)}
                aria-describedby={remainingItems > 0 ? "sourcing-list-batch-note" : undefined}
                onClick={() => submitSourcingList(remainingItems > 0)}
                className="inline-flex min-h-12 w-full items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold  text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {remainingItems > 0 && !memoryOnly ? `Review first ${maxSourcingListItems} items` : "Send list for review"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SourcingListContext.Provider>
  );
}

export function useSourcingList() {
  const context = useContext(SourcingListContext);

  if (!context) {
    throw new Error("useSourcingList must be used inside SourcingListProvider");
  }

  return context;
}

function DrawerField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold  text-bioaxis-steel">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus min-h-11 w-full border border-bioaxis-line bg-bioaxis-black px-3 text-sm text-bioaxis-text"
      />
    </label>
  );
}

function DrawerToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-3 border border-bioaxis-line bg-bioaxis-black px-3 text-xs font-semibold  text-bioaxis-steel">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-bioaxis-accent"
      />
      {label}
    </label>
  );
}
