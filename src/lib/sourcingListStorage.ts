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

type StorageKind = "localStorage" | "sessionStorage";
const text = (value: unknown) => typeof value === "string" ? value : "";
export const sourcingListSubmissionHeader = "Product / family | Path | Requested action | Qty | Current supplier | Catalog no. | Equivalent | Sample | Docs | Notes | Source | Added";
const listHandoffKey = "bioaxis:sourcing-list-handoff";
type ListHandoff = { id: string; items: SourcingListItem[] };
let activeListHandoff: ListHandoff | null = null;

export function isSourcingListHandoffId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{32}$/.test(value);
}

function readSavedListHandoff(): ListHandoff | null {
  const raw = readBrowserStorage("sessionStorage", listHandoffKey).value;
  if (!raw) return null;
  try {
    const record = JSON.parse(raw);
    if (!isSourcingListHandoffId(record?.id) || !Array.isArray(record.items)) return null;
    const { items } = parseSourcingList(JSON.stringify(record.items));
    return items.length ? { id: record.id, items } : null;
  } catch { return null; }
}

export function beginSourcingListHandoff(items: SourcingListItem[]) {
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (value) => value.toString(16).padStart(2, "0")).join("");
  activeListHandoff = { id, items };
  if (!writeBrowserStorage("sessionStorage", listHandoffKey, JSON.stringify(activeListHandoff))) {
    removeBrowserStorage("sessionStorage", listHandoffKey);
  }
  return id;
}

export function restoreSourcingListHandoff(id: string | undefined) {
  if (!isSourcingListHandoffId(id)) return null;
  const handoff = activeListHandoff ?? readSavedListHandoff();
  return handoff?.id === id ? handoff : null;
}

export function retireSourcingListHandoff(id: string) {
  if (activeListHandoff?.id === id) activeListHandoff = null;
  if (readSavedListHandoff()?.id === id) removeBrowserStorage("sessionStorage", listHandoffKey);
}

function productHref(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/products") || value.includes("\\")) return "";
  try {
    const url = new URL(value, "https://bioaxis.local");
    return url.origin === "https://bioaxis.local" && /^\/products(?:\/|$)/.test(url.pathname)
      ? `${url.pathname}${url.search}${url.hash}` : "";
  } catch { return ""; }
}

export function parseSourcingList(raw: string | null): { items: SourcingListItem[]; needsReview: boolean } {
  if (!raw) return { items: [], needsReview: false };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { items: [], needsReview: true };
    const ids = new Set<string>();
    const items = parsed.flatMap((value, index): SourcingListItem[] => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return [];
      const row = value as Record<string, unknown>;
      const title = text(row.title) || text(row.productTitle) || text(row.familyTitle);
      if (!title.trim()) return [];
      let id = text(row.id) || `restored:${index}:${title}`;
      while (ids.has(id)) id = `${id}:restored:${index}`;
      ids.add(id);
      return [{
        id, title, href: productHref(row.href),
        ...Object.fromEntries(["segmentSlug", "categorySlug", "familySlug", "productSlug", "segmentTitle", "categoryTitle", "familyTitle", "productTitle"].flatMap((key) => typeof row[key] === "string" ? [[key, row[key]]] : [])),
        quantity: text(row.quantity), currentSupplier: text(row.currentSupplier), catalogNumber: text(row.catalogNumber),
        requestedAction: text(row.requestedAction) || "Quote", notes: text(row.notes),
        sourcePageUrl: text(row.sourcePageUrl), addedAt: text(row.addedAt),
        equivalentNeeded: row.equivalentNeeded === true, sampleNeeded: row.sampleNeeded === true,
        documentationNeeded: row.documentationNeeded === true
      }];
    });
    return { items, needsReview: items.length !== parsed.length };
  } catch { return { items: [], needsReview: true }; }
}

export function retainUnsubmittedSourcingItems(items: SourcingListItem[], submitted: readonly SourcingListItem[]) {
  const sentById = new Map(submitted.map((item) => [item.id, item]));
  const remaining = items.filter((item) => {
    const sent = sentById.get(item.id);
    if (!sent) return true;
    const keys = [...Object.keys(item), ...Object.keys(sent)] as (keyof SourcingListItem)[];
    return keys.some((key) => item[key] !== sent[key]);
  });
  return remaining.length === items.length ? items : remaining;
}

export function readBrowserStorage(kind: StorageKind, key: string) {
  try { return { available: true, value: window[kind].getItem(key) }; }
  catch { return { available: false, value: null }; }
}

export function writeBrowserStorage(kind: StorageKind, key: string, value: string) {
  try { window[kind].setItem(key, value); return true; }
  catch { return false; }
}

export function removeBrowserStorage(kind: StorageKind, key: string) {
  try { window[kind].removeItem(key); return true; }
  catch { return writeBrowserStorage(kind, key, ""); }
}
