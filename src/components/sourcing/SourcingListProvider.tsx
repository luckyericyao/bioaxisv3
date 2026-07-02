"use client";

import Link from "next/link";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type SourcingListItem = {
  id: string;
  title: string;
  href: string;
  segmentSlug?: string;
  categorySlug?: string;
  familySlug?: string;
  productSlug?: string;
  segmentTitle?: string;
  categoryTitle?: string;
  familyTitle?: string;
  productTitle?: string;
  quantity: string;
  currentSupplier: string;
  catalogNumber: string;
  requestedAction: string;
  equivalentNeeded: boolean;
  sampleNeeded: boolean;
  documentationNeeded: boolean;
  notes: string;
  sourcePageUrl: string;
  addedAt: string;
};

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
  addItem: (item: SourcingListInput) => void;
  updateItem: (id: string, patch: Partial<SourcingListItem>) => void;
  removeItem: (id: string) => void;
  openDrawer: () => void;
};

const storageKey = "bioaxis:sourcing-list";
const submissionStorageKey = "bioaxis:sourcing-list-submission";
const submissionItemsStorageKey = "bioaxis:sourcing-list-items";
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

function readStoredItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as SourcingListItem[]) : [];
  } catch {
    return [];
  }
}

function formatSubmission(items: SourcingListItem[]) {
  const header = "Product / family | Path | Requested action | Qty | Current supplier | Catalog no. | Equivalent | Sample | Docs | Notes | Source | Added";
  const rows = items.map((item) => {
    const path = [item.segmentTitle, item.categoryTitle, item.familyTitle, item.productTitle].filter(Boolean).join(" / ");

    return [
      item.title,
      path || item.href,
      item.requestedAction || "Quote",
      item.quantity || "-",
      item.currentSupplier || "-",
      item.catalogNumber || "-",
      item.equivalentNeeded ? "yes" : "no",
      item.sampleNeeded ? "yes" : "no",
      item.documentationNeeded ? "yes" : "no",
      item.notes || "-",
      item.sourcePageUrl || item.href,
      item.addedAt || "-"
    ].join(" | ");
  });

  return [header, ...rows].join("\n");
}

export function SourcingListProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [items, setItems] = useState<SourcingListItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [hydrated, items]);

  useEffect(() => {
    function handleSubmissionComplete() {
      setItems([]);
      setDrawerOpen(false);
      window.localStorage.removeItem(storageKey);
    }

    window.addEventListener(submissionCompleteEvent, handleSubmissionComplete);
    return () => window.removeEventListener(submissionCompleteEvent, handleSubmissionComplete);
  }, []);

  const value = useMemo<SourcingListContextValue>(
    () => ({
      items,
      addItem: (input) => {
        setItems((current) => {
          const id = itemKey(input);
          if (current.some((item) => item.id === id)) {
            return current;
          }

          return [...current, emptyFields(input)];
        });
        setDrawerOpen(true);
      },
      updateItem: (id, patch) => {
        setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      },
      removeItem: (id) => {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      openDrawer: () => setDrawerOpen(true)
    }),
    [items]
  );

  function submitSourcingList() {
    const productList = formatSubmission(items);
    window.sessionStorage.setItem(submissionStorageKey, productList);
    window.sessionStorage.setItem(submissionItemsStorageKey, JSON.stringify(items));
    const params = new URLSearchParams({
      requestType: "product-list-review",
      source: "sourcing-list",
      storedInput: "1"
    });

    router.push(`/request-quote?${params.toString()}`);
  }

  return (
    <SourcingListContext.Provider value={value}>
      {children}
      {items.length > 0 ? (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-xs font-bold uppercase text-bioaxis-black shadow-2xl transition hover:bg-bioaxis-black hover:text-bioaxis-accent"
        >
          Sourcing list ({items.length})
        </button>
      ) : null}

      {drawerOpen ? (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Sourcing list">
          <div className="ml-auto flex h-full w-full max-w-3xl flex-col border-l border-bioaxis-line bg-bioaxis-black shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-bioaxis-line p-5">
              <div>
                <p className="text-xs font-bold uppercase text-bioaxis-accent">Sourcing list</p>
                <h2 className="mt-2 text-2xl font-bold uppercase text-bioaxis-text">Prepare product-list RFQ details.</h2>
                <p className="mt-2 text-sm leading-6 text-bioaxis-muted">
                  This is a sourcing intake list, not a cart. Add quantities, supplier context, sample needs, and documentation needs before submitting.
                </p>
              </div>
              <button type="button" onClick={() => setDrawerOpen(false)} className="border border-bioaxis-line px-3 py-2 text-xs font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-4">
                {items.map((item) => (
                  <article key={item.id} className="border border-bioaxis-line bg-bioaxis-panel p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-bold uppercase text-bioaxis-text">{item.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-bioaxis-muted">
                          {[item.segmentTitle, item.categoryTitle, item.familyTitle, item.productTitle].filter(Boolean).join(" / ")}
                        </p>
                        <Link href={item.href} className="mt-2 inline-flex text-xs font-semibold uppercase text-bioaxis-accent">
                          View page
                        </Link>
                      </div>
                      <button type="button" onClick={() => value.removeItem(item.id)} className="border border-bioaxis-line px-3 py-2 text-xs font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <DrawerField label="Quantity" value={item.quantity} onChange={(quantity) => value.updateItem(item.id, { quantity })} />
                      <DrawerField label="Current supplier" value={item.currentSupplier} onChange={(currentSupplier) => value.updateItem(item.id, { currentSupplier })} />
                      <DrawerField label="Catalog number" value={item.catalogNumber} onChange={(catalogNumber) => value.updateItem(item.id, { catalogNumber })} />
                    </div>
                    <label className="mt-4 block">
                      <span className="mb-2 block text-xs font-bold uppercase text-bioaxis-steel">Requested action</span>
                      <select
                        value={item.requestedAction}
                        onChange={(event) => value.updateItem(item.id, { requestedAction: event.target.value })}
                        className="field-focus min-h-10 w-full border border-bioaxis-line bg-bioaxis-black px-3 text-sm text-bioaxis-text"
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
                      <span className="mb-2 block text-xs font-bold uppercase text-bioaxis-steel">Notes</span>
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
              <button
                type="button"
                onClick={submitSourcingList}
                className="inline-flex min-h-12 w-full items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
              >
                Continue to RFQ
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
      <span className="mb-2 block text-xs font-bold uppercase text-bioaxis-steel">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-focus min-h-10 w-full border border-bioaxis-line bg-bioaxis-black px-3 text-sm text-bioaxis-text"
      />
    </label>
  );
}

function DrawerToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex min-h-10 items-center gap-3 border border-bioaxis-line bg-bioaxis-black px-3 text-xs font-bold uppercase text-bioaxis-steel">
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
