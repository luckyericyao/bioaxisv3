import { getIndexableProductItemPaths, getProductItemBySlug, getProductItemHref } from "@/data/productItems";
import { getAllCatalogProductPaths, getProductBySlug, productCatalogHref } from "@/data/productCatalog";
import { sourcingSpecifications, type SourcingSpecification } from "@/lib/sourcingSpecifications";

export type SourcingConfiguration = {
  title: string;
  description: string;
  href: string;
  segment: string;
  category: string;
  family: string;
  product: string;
  segmentTitle: string;
  categoryTitle: string;
  familyTitle: string;
  fields: SourcingSpecification[];
};

export type SourcingTargetFilters = {
  q?: string;
  segment?: string;
  category?: string;
  volume?: string;
  barrier?: string;
  sterility?: string;
  packaging?: string;
  includeUnconfirmed?: boolean;
};

export function getSourcingConfigurations(): SourcingConfiguration[] {
  const taxonomy = getIndexableProductItemPaths().flatMap((path) => {
    const match = getProductItemBySlug(path.segment, path.subcategory, path.family, path.product);
    if (!match) return [];
    return [{ title: match.productItem.name, description: match.productItem.shortDescription,
      href: getProductItemHref(path.segment, path.subcategory, path.family, path.product),
      segment: path.segment, category: path.subcategory, family: path.family, product: path.product,
      segmentTitle: match.segment.title, categoryTitle: match.category.title, familyTitle: match.family.title,
      fields: sourcingSpecifications(match.productItem.commonSpecifications) }];
  });
  const catalog = getAllCatalogProductPaths().flatMap((path) => {
    const match = getProductBySlug(path.segment, path.subcategory, path.family, path.product);
    if (!match || match.product.configurationKind !== "specific") return [];
    return [{ title: match.product.name, description: match.product.description,
      href: productCatalogHref(path.segment, path.subcategory, path.family, path.product),
      segment: path.segment, category: path.subcategory, family: path.family, product: path.product,
      segmentTitle: match.segment.name, categoryTitle: match.category.name, familyTitle: match.family.name,
      fields: sourcingSpecifications(match.product.specs) }];
  });
  return [...new Map([...taxonomy, ...catalog].map((row) => [row.href, row])).values()];
}

const normalize = (value: string) => value.toLowerCase().replace(/[µμ]/g, "u").replace(/\s+/g, " ").trim();
const keys = { volume: ["nominal volume", "volume", "capacity"], barrier: ["filter barrier", "filter option"], sterility: ["sterility"], packaging: ["packaging", "rack format"] };

export function filterSourcingConfigurations(rows: SourcingConfiguration[], filters: SourcingTargetFilters) {
  return rows.flatMap((row) => {
    if (filters.segment && row.segment !== filters.segment) return [];
    if (filters.category && row.category !== filters.category) return [];
    const haystack = normalize([row.title, row.segmentTitle, row.categoryTitle, row.familyTitle, ...row.fields.map((field) => `${field.label} ${field.value}`)].join(" "));
    if (filters.q && !haystack.includes(normalize(filters.q))) return [];
    let needsConfirmation = false;
    for (const name of Object.keys(keys) as Array<keyof typeof keys>) {
      const wanted = filters[name];
      if (!wanted) continue;
      const field = row.fields.find((item) => keys[name].includes(item.key));
      if (!field || field.status !== "target") {
        if (!filters.includeUnconfirmed) return [];
        needsConfirmation = true;
      } else if (normalize(field.value) !== normalize(wanted)) return [];
    }
    return [{ ...row, needsConfirmation }];
  }).sort((a, b) => Number(a.needsConfirmation) - Number(b.needsConfirmation));
}

export function sourcingFilterBrief(filters: SourcingTargetFilters) {
  return [filters.q ? `Product or reference: ${filters.q}` : "", filters.segment ? `Product line: ${filters.segment}` : "", filters.category ? `Category: ${filters.category}` : "", ...Object.keys(keys).flatMap((key) => {
    const value = filters[key as keyof typeof keys];
    return value ? [`Requested ${key}: ${value}`] : [];
  })].filter(Boolean).join("\n");
}
