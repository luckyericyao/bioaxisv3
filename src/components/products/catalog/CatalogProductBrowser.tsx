"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToSourcingListButton } from "@/components/sourcing/AddToSourcingListButton";
import type { DocumentStatus, ProductCatalogItem } from "@/data/productCatalog";

export type CatalogProductRow = {
  href: string;
  segmentSlug: string;
  categorySlug: string;
  familySlug: string;
  segmentTitle: string;
  categoryTitle: string;
  familyTitle: string;
  product: ProductCatalogItem;
};

type CatalogProductBrowserProps = {
  rows: CatalogProductRow[];
  heading?: string;
  compact?: boolean;
};

const statusLabels: Record<DocumentStatus, string> = {
  available: "Available",
  request_required: "Request required",
  supplier_dependent: "Supplier dependent"
};

const documentLabels: Array<[keyof ProductCatalogItem["documents"], string]> = [
  ["sds", "SDS"],
  ["coa", "CoA"],
  ["specificationSheet", "Spec sheet"],
  ["sterilityStatement", "Sterility"],
  ["animalOriginStatement", "Animal origin"],
  ["lotLevelDocumentation", "Lot docs"]
];

function fieldValue(product: ProductCatalogItem, key: string) {
  const value = product.specs[key];
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function requestHref(row: CatalogProductRow, requestType: string, need?: string) {
  const params = new URLSearchParams({
    requestType,
    segment: row.segmentSlug,
    category: row.categorySlug,
    family: row.familySlug,
    product: row.product.slug,
    sourcePage: row.href
  });

  if (need) params.set("need", need);
  if (row.product.supplier && !/reviewed/i.test(row.product.supplier)) params.set("supplier", row.product.supplier);
  if (row.product.catalogNumber && !/optional/i.test(row.product.catalogNumber)) params.set("catalog", row.product.catalogNumber);

  return `/request-quote?${params.toString()}`;
}

function equivalentHref(row: CatalogProductRow) {
  const params = new URLSearchParams({
    product: row.product.slug,
    segment: row.segmentSlug,
    category: row.categorySlug,
    family: row.familySlug,
    sourcePage: row.href
  });

  if (row.product.catalogNumber && !/optional/i.test(row.product.catalogNumber)) params.set("catalog", row.product.catalogNumber);
  if (row.product.supplier && !/reviewed/i.test(row.product.supplier)) params.set("supplier", row.product.supplier);

  return `/equivalent-finder?${params.toString()}`;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[µμ]/g, "u");
}

function productHaystack(row: CatalogProductRow) {
  const product = row.product;
  return normalize(
    [
      row.segmentTitle,
      row.categoryTitle,
      row.familyTitle,
      product.name,
      product.description,
      product.productType,
      product.supplier,
      product.catalogNumber,
      product.tags.join(" "),
      Object.values(product.specs).flat().join(" ")
    ].join(" ")
  );
}

function FilterButton({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "border px-2.5 py-1.5 text-[11px] font-semibold uppercase transition",
        active
          ? "border-bioaxis-accent bg-bioaxis-accent text-bioaxis-black"
          : "border-bioaxis-line bg-bioaxis-black text-bioaxis-steel hover:border-bioaxis-accent hover:text-bioaxis-accent"
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function DocsSummary({ product }: { product: ProductCatalogItem }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {documentLabels.slice(0, 4).map(([key, label]) => {
        const status = product.documents[key];

        if (!status) return null;

        return (
          <span key={key} className="border border-white/[0.12] px-2 py-1 text-[10px] font-semibold uppercase text-bioaxis-steel">
            {label}: <span className="text-bioaxis-accent">{statusLabels[status]}</span>
          </span>
        );
      })}
    </div>
  );
}

export function CatalogProductBrowser({ rows, heading = "Product list preview", compact = false }: CatalogProductBrowserProps) {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSterility, setSelectedSterility] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const productTypes = useMemo(() => [...new Set(rows.map((row) => row.product.productType))].slice(0, 10), [rows]);
  const sterilityOptions = useMemo(
    () => [...new Set(rows.map((row) => fieldValue(row.product, "Sterility")).filter(Boolean))].slice(0, 8),
    [rows]
  );
  const docOptions = ["Available", "Request required", "Supplier dependent"];
  const filteredRows = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return rows.filter((row) => {
      if (normalizedQuery && !productHaystack(row).includes(normalizedQuery)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(row.product.productType)) return false;
      if (selectedSterility.length > 0 && !selectedSterility.some((value) => fieldValue(row.product, "Sterility").includes(value))) return false;
      if (
        selectedDocs.length > 0 &&
        !Object.values(row.product.documents).some((status) => status && selectedDocs.includes(statusLabels[status]))
      ) {
        return false;
      }

      return true;
    });
  }, [query, rows, selectedDocs, selectedSterility, selectedTypes]);
  const visibleRows = compact ? filteredRows.slice(0, 8) : filteredRows;

  function toggleFilter(value: string, current: string[], setter: (value: string[]) => void) {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function toggleCompare(id: string) {
    setCompareIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:border-r lg:border-bioaxis-line lg:pr-5">
          <p className="text-xs font-bold uppercase text-bioaxis-accent">Filter products</p>
          <h2 className="mt-2 text-2xl font-bold uppercase text-bioaxis-text">{heading}</h2>
          <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
            Compare sourcing configurations, buyer-supplied SKU context, key specs, and documentation status before sending a quote-ready request.
          </p>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-bold uppercase text-bioaxis-steel">Search within list</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by spec, family, catalog..."
              className="field-focus min-h-10 w-full border border-bioaxis-line bg-bioaxis-black px-3 text-sm text-bioaxis-text"
            />
          </label>
          <FilterGroup title="Product type" values={productTypes} active={selectedTypes} onToggle={(value) => toggleFilter(value, selectedTypes, setSelectedTypes)} />
          <FilterGroup
            title="Sterility"
            values={sterilityOptions}
            active={selectedSterility}
            onToggle={(value) => toggleFilter(value, selectedSterility, setSelectedSterility)}
          />
          <FilterGroup title="Key documents" values={docOptions} active={selectedDocs} onToggle={(value) => toggleFilter(value, selectedDocs, setSelectedDocs)} />
          {compareIds.length > 0 ? (
            <div className="mt-5 border border-bioaxis-accent/40 bg-bioaxis-black p-3">
              <p className="text-xs font-bold uppercase text-bioaxis-accent">{compareIds.length} item{compareIds.length === 1 ? "" : "s"} selected for comparison</p>
              <p className="mt-2 text-xs leading-5 text-bioaxis-muted">Add selected products to the sourcing list from the row actions, then continue to RFQ.</p>
            </div>
          ) : null}
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-bioaxis-dim">Showing {visibleRows.length} of {filteredRows.length} matching products</p>
              {compact && filteredRows.length > visibleRows.length ? (
                <p className="mt-1 text-xs leading-5 text-bioaxis-muted">Preview list capped here. Open the family or product page for the full context.</p>
              ) : null}
            </div>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase text-bioaxis-dim">
                  <th className="border-y border-l border-bioaxis-line bg-bioaxis-black px-3 py-3">Compare</th>
                  <th className="border-y border-bioaxis-line bg-bioaxis-black px-3 py-3">Product name</th>
                  <th className="border-y border-bioaxis-line bg-bioaxis-black px-3 py-3">Supplier context</th>
                  <th className="border-y border-bioaxis-line bg-bioaxis-black px-3 py-3">Current SKU</th>
                  <th className="border-y border-bioaxis-line bg-bioaxis-black px-3 py-3">Key specs</th>
                  <th className="border-y border-bioaxis-line bg-bioaxis-black px-3 py-3">Documents</th>
                  <th className="border-y border-r border-bioaxis-line bg-bioaxis-black px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.product.id} className="align-top">
                    <td className="border-b border-l border-bioaxis-line px-3 py-4">
                      <input
                        type="checkbox"
                        checked={compareIds.includes(row.product.id)}
                        onChange={() => toggleCompare(row.product.id)}
                        aria-label={`Compare ${row.product.name}`}
                        className="h-4 w-4 accent-bioaxis-accent"
                      />
                    </td>
                    <td className="border-b border-bioaxis-line px-3 py-4">
                      <Link href={row.href} className="text-sm font-bold uppercase text-bioaxis-text transition hover:text-bioaxis-accent">
                        {row.product.name}
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-bioaxis-muted">{row.familyTitle}</p>
                    </td>
                    <td className="border-b border-bioaxis-line px-3 py-4 text-xs leading-5 text-bioaxis-steel">{row.product.supplier ?? "Reviewed during sourcing intake"}</td>
                    <td className="border-b border-bioaxis-line px-3 py-4 text-xs leading-5 text-bioaxis-steel">{row.product.catalogNumber ?? "Current SKU optional"}</td>
                    <td className="border-b border-bioaxis-line px-3 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {row.product.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="border border-white/[0.12] px-2 py-1 text-[10px] font-semibold uppercase text-bioaxis-steel">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="border-b border-bioaxis-line px-3 py-4">
                      <DocsSummary product={row.product} />
                    </td>
                    <td className="border-b border-r border-bioaxis-line px-3 py-4">
                      <RowActions row={row} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {visibleRows.map((row) => (
              <article key={row.product.id} className="border border-bioaxis-line bg-bioaxis-black p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={row.href} className="text-base font-bold uppercase text-bioaxis-text">
                      {row.product.name}
                    </Link>
                    <p className="mt-2 text-xs leading-5 text-bioaxis-muted">{row.segmentTitle} / {row.categoryTitle} / {row.familyTitle}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={compareIds.includes(row.product.id)}
                    onChange={() => toggleCompare(row.product.id)}
                    aria-label={`Compare ${row.product.name}`}
                    className="h-4 w-4 accent-bioaxis-accent"
                  />
                </div>
                <div className="mt-4 grid gap-2 text-xs leading-5 text-bioaxis-steel">
                  <p>Supplier context: {row.product.supplier ?? "Reviewed during sourcing intake"}</p>
                  <p>Current SKU: {row.product.catalogNumber ?? "Current SKU optional"}</p>
                  <DocsSummary product={row.product} />
                </div>
                <div className="mt-4">
                  <RowActions row={row} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterGroup({
  title,
  values,
  active,
  onToggle
}: {
  title: string;
  values: string[];
  active: string[];
  onToggle: (value: string) => void;
}) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-bold uppercase text-bioaxis-steel">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <FilterButton key={value} label={value} active={active.includes(value)} onClick={() => onToggle(value)} />
        ))}
      </div>
    </div>
  );
}

function RowActions({ row }: { row: CatalogProductRow }) {
  return (
    <div className="grid gap-2">
      <Link
        href={row.href}
        className="inline-flex min-h-9 items-center justify-center border border-bioaxis-line px-3 text-[11px] font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
      >
        Details
      </Link>
      <Link
        href={requestHref(row, "quote", "quote")}
        className="inline-flex min-h-9 items-center justify-center border border-bioaxis-accent px-3 text-[11px] font-bold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
      >
        Request quote
      </Link>
      <Link
        href={equivalentHref(row)}
        className="inline-flex min-h-9 items-center justify-center border border-bioaxis-line px-3 text-[11px] font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
      >
        Equivalent
      </Link>
      <Link
        href={requestHref(row, "documentation", "documents")}
        className="inline-flex min-h-9 items-center justify-center border border-bioaxis-line px-3 text-[11px] font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
      >
        Documents
      </Link>
      <AddToSourcingListButton
        title={row.product.name}
        href={row.href}
        segmentSlug={row.segmentSlug}
        categorySlug={row.categorySlug}
        familySlug={row.familySlug}
        productSlug={row.product.slug}
        segmentTitle={row.segmentTitle}
        categoryTitle={row.categoryTitle}
        familyTitle={row.familyTitle}
        productTitle={row.product.name}
        label="Add to list"
        addedLabel="Added"
        requestedAction="Quote"
        className="min-h-9 px-3 text-[11px]"
      />
    </div>
  );
}
