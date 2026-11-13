import { maxSourcingListItems, sourcingListLimitError } from "./sourcingNeed";

type TextLimit = readonly [key: string, label: string, maximum: number, fallback?: string];

const requestTextLimits: readonly TextLimit[] = [
  ["productList", "Product details", 12_000],
  ["email", "Email", 240],
  ["name", "Name", 180],
  ["organization", "Company", 240, "company"],
  ["phone", "Phone", 80],
  ["roleTitle", "Role", 160],
  ["currentSupplier", "Current supplier", 220, "supplier"],
  ["catalogNumber", "Catalog number", 180],
  ["quantity", "Quantity", 120],
  ["timeline", "Timeline", 160],
  ["shippingRegion", "Shipping region", 180],
  ["documentationNeeds", "Required documents", 1_200],
  ["sterileStatus", "Sterility", 120],
  ["message", "Notes", 8_000]
];

const itemTextLimits: readonly TextLimit[] = [
  ["quantity", "Quantity", 120],
  ["currentSupplier", "Current supplier", 180],
  ["catalogNumber", "Catalog number", 180],
  ["notes", "Notes", 1_200]
];

export function trimRfqText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function recordOf(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function textLimitError(value: unknown, rules: readonly TextLimit[], prefix = "") {
  const fields = recordOf(value);
  for (const [key, label, maximum, fallback] of rules) {
    const text = trimRfqText(fields[key] || (fallback ? fields[fallback] : undefined));
    if (text.length > maximum) {
      return `${prefix}${label} exceeds the ${maximum.toLocaleString("en-US")}-character limit. Shorten it and try again; nothing has been submitted.`;
    }
  }
  return "";
}

export function rfqInputLimitError(value: unknown) {
  const request = recordOf(value);
  const items = Array.isArray(request.sourcingListItems) ? request.sourcingListItems : [];
  if (items.length > maxSourcingListItems) return sourcingListLimitError;

  const requestError = textLimitError(request, requestTextLimits);
  if (requestError) return requestError;

  for (const [index, item] of items.entries()) {
    const itemError = textLimitError(item, itemTextLimits, `Item ${index + 1} in the sourcing list: `);
    if (itemError) return itemError;
  }
  return "";
}
