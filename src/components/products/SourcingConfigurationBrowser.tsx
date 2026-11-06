import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productTaxonomy } from "@/data/productTaxonomy";
import { buildRequestHref } from "@/lib/productRequestHref";
import { filterSourcingConfigurations, getSourcingConfigurations, sourcingFilterBrief, type SourcingTargetFilters, type SourcingConfiguration } from "@/lib/server/sourcingConfigurations";
import { SourcingFiltersDisclosure } from "./SourcingFiltersDisclosure";

function uniqueOptions(values: readonly string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase().replace(/[µμ]/g, "u").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function SourcingConfigurationBrowser({ filters }: { filters: SourcingTargetFilters }) {
  const rows = getSourcingConfigurations();
  const results = filterSourcingConfigurations(rows, filters);
  const brief = sourcingFilterBrief(filters);
  const valuesFor = (key: string[]) => [...new Set(rows.flatMap((row) => row.fields.filter((field) => key.includes(field.key) && field.status === "target").map((field) => field.value)))].sort();
  const sourceParams = new URLSearchParams({ view: "configurations" });
  for (const [key, value] of Object.entries(filters)) if (value) sourceParams.set(key, typeof value === "boolean" ? "1" : value);
  const noResultRequest = new URLSearchParams({ requestType: "quote", sourcePage: `/products?${sourceParams}`, productList: brief || "Help define a consumables sourcing configuration" });
  if (filters.segment) noResultRequest.set("segment", filters.segment);
  if (filters.category) noResultRequest.set("category", filters.category);
  const filteredHref = (row: SourcingConfiguration, destination: string) => {
    const url = new URL(destination, "https://bioaxis.local");
    if (brief) url.searchParams.set("productList", brief);
    if (filters.q) url.searchParams.set("q", filters.q);
    return `${url.pathname}${url.search}`;
  };
  const renderRow = (row: SourcingConfiguration & { needsConfirmation: boolean }) => <article key={row.href} className="border-b border-bioaxis-line py-6" data-sourcing-target="true">
    <div className="flex flex-wrap items-center gap-3 text-sm text-bioaxis-muted"><span>Sourcing target</span>{row.needsConfirmation ? <span>Selected fields need confirmation</span> : null}</div>
    <h2 className="mt-2"><Link href={filteredHref(row, row.href)} className="hover:text-bioaxis-accent">{row.title}</Link></h2>
    <p className="helper-text mt-2 text-bioaxis-muted">{row.segmentTitle} / {row.categoryTitle} / {row.familyTitle}</p>
    <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{row.fields.slice(0, 4).map((field) => <div key={field.key} className="flex gap-2"><dt className="font-medium">{field.label}:</dt><dd>{field.status === "target" ? `${field.value} · Target` : "To confirm"}</dd></div>)}</dl>
    <div className="mt-5 flex flex-wrap items-center gap-5"><Link href={filteredHref(row, row.href)} className="action-primary">Configure request<ArrowRight aria-hidden="true" size={16} /></Link>
      <Link href={filteredHref(row, buildRequestHref({ segment: row.segment, category: row.category, family: row.family, product: row.product, sourcePage: row.href }))} className="inline-flex min-h-11 items-center text-sm font-medium text-bioaxis-accent underline underline-offset-4">Request a quote</Link></div>
  </article>;
  return <section className="page-container section-space" data-sourcing-target-browser="true">
    <Link href="/products" className="inline-flex min-h-11 items-center text-sm font-medium text-bioaxis-accent">Back to all product lines</Link>
    <h1 className="mt-4">Find a sourcing configuration.</h1>
    <p className="mt-4 max-w-2xl text-bioaxis-muted">Compare buyer targets, not live supplier listings. Specifications, compatibility and availability are confirmed per request.</p>
    <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <SourcingFiltersDisclosure><form action="/products" method="get" className="pb-5 pt-3" aria-label="Filter sourcing targets">
        <input type="hidden" name="view" value="configurations" />
        {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}
        <label className="block text-sm font-medium">Product or reference<input type="search" name="q" defaultValue={filters.q} className="field-focus mt-2 block min-h-11 w-full border bg-white px-3" /></label>
        <label className="mt-5 block text-sm font-medium">Product line<select name="segment" defaultValue={filters.segment ?? ""} className="field-focus mt-2 block min-h-11 w-full border bg-white px-2"><option value="">All lines</option>{productTaxonomy.map((segment) => <option key={segment.slug} value={segment.slug}>{segment.title}</option>)}</select></label>
        {([{ name: "volume", label: "Volume target", keys: ["nominal volume", "volume"], requirements: [] }, { name: "barrier", label: "Barrier target", keys: ["filter barrier"], requirements: ["Filtered", "Non-filtered"] }, { name: "sterility", label: "Sterility target", keys: ["sterility"], requirements: ["Sterile", "Non-sterile"] }, { name: "packaging", label: "Packaging target", keys: ["packaging"], requirements: ["Racked", "Reload", "Bulk"] }] as const).map((filter) => <label key={filter.name} className="mt-5 block text-sm font-medium">{filter.label}<select name={filter.name} defaultValue={filters[filter.name] ?? ""} className="field-focus mt-2 block min-h-11 w-full border bg-white px-2"><option value="">Any / not specified</option>{uniqueOptions([...(filters[filter.name] ? [filters[filter.name]!] : []), ...filter.requirements, ...valuesFor([...filter.keys])]).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>)}
        <p className="helper-text mt-4 text-bioaxis-muted">Filters describe your requirement, not confirmed supply.</p>
        <label className="mt-5 flex min-h-11 items-start gap-3 text-sm"><input type="checkbox" name="includeUnconfirmed" value="1" defaultChecked={filters.includeUnconfirmed} className="mt-1" /><span>Also show targets whose selected fields need confirmation</span></label>
        <button className="action-primary mt-5 w-full" type="submit">Apply filters</button><Link href="/products?view=configurations" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-bioaxis-accent">Clear filters</Link>
      </form></SourcingFiltersDisclosure>
      <div><p role="status" className="text-bioaxis-muted">{results.length} matching sourcing {results.length === 1 ? "target" : "targets"}; {rows.length} specific templates in this view. These are not verified supplier SKUs.</p>
        {results.length ? <>{results.slice(0, 6).map(renderRow)}{results.length > 6 ? <details className="mt-6 border-t border-bioaxis-line"><summary className="min-h-11 cursor-pointer py-3 font-medium text-bioaxis-accent">Show {results.length - 6} more targets</summary>{results.slice(6).map(renderRow)}</details> : null}</> : <div className="py-10"><h2>No exact target matches these filters.</h2><p className="mt-4 max-w-xl text-bioaxis-muted">This does not establish supplier availability. Send the requirement for a sourcing review.</p><Link href={`/request-quote?${noResultRequest}`} className="action-primary mt-6">Send this requirement</Link></div>}
      </div>
    </div>
  </section>;
}
