type NeedContext = {
  productName?: string;
  productFamily?: string;
  productCategory?: string;
  productSegment?: string;
};

type NeedInput = NeedContext & {
  productList?: string;
  message?: string;
  catalogNumber?: string;
  productContext?: NeedContext;
  sourcingListItems?: { title?: string; productTitle?: string; familyTitle?: string; catalogNumber?: string }[];
};

// Empty starters and service labels are context, not a buyer's product need.
const serviceLabel = /^(?:contact request|availability check(?: request| current SKU review)?|availability and replenishment review|supplier-confirmed consumables availability|support path:.*|support routing|BioAxis support|product matching|equivalent review|sample path|documentation review|RFQ preparation|recurring supply planning|automation compatibility review|private-label \/ OEM .*review|private-label \/ OEM sourcing discussion|equivalent review request|sample request|product list review|documentation request|recurring supply review|workflow (?:documentation|mapping) request)$/i;

export const sourcingNeedError = "Add a product, catalog reference or sourcing need, or select an item from the catalog.";

export function hasMeaningfulNeedText(value: string | undefined) {
  return Boolean(value?.split("\n").some((line) => {
    const text = line.trim();
    return /[\p{L}\p{N}]/u.test(text) && !text.endsWith(":") && !serviceLabel.test(text)
      && !/^(?:Supplier|Product \/ family)\s*\|/i.test(text)
      && !/^(?:required documents|documents needed|original request mode|selected review details):/i.test(text);
  }));
}

export function hasSourcingNeed(input: NeedInput) {
  const context = input.productContext;
  return [input.productList, input.message, input.catalogNumber, input.productName, input.productFamily,
    input.productCategory, input.productSegment, context?.productName, context?.productFamily,
    context?.productCategory, context?.productSegment].some(hasMeaningfulNeedText)
    || Boolean(input.sourcingListItems?.some((item) =>
      [item.title, item.productTitle, item.familyTitle, item.catalogNumber].some(hasMeaningfulNeedText)));
}
