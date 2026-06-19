import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { buildEquivalentFinderHref, buildRequestHref } from "@/data/productTaxonomy";
import { getProductNavigationSegment, type ProductNavigationCategory } from "@/data/productNavigation";

type ProductCategoryCardProps = {
  segment: ProductTaxonomySegment;
};

type ListItem = {
  label: string;
  href?: string;
};

function cleanListLabel(value: string) {
  return value.replace(/^\s*[-*•]\s+/, "").trim();
}

export function ProductCategoryCard({ segment }: ProductCategoryCardProps) {
  const navigationSegment = getProductNavigationSegment(segment.slug);
  const families: ListItem[] = segment.subcategories
    .flatMap((subcategory) =>
      subcategory.productFamilies.map((family) => ({
        label: cleanListLabel(family.title),
        href: `/products/${segment.slug}/${subcategory.slug}/${family.slug}`
      }))
    )
    .slice(0, 6);
  const buyerSpecs = segment.buyerSpecs.slice(0, 6).map((item) => ({ label: cleanListLabel(item) }));
  const applications = segment.primaryApplications.slice(0, 4).map((item) => ({ label: cleanListLabel(item) }));

  return (
    <article className="group flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft focus-within:border-bioaxis-accent/70">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold uppercase leading-tight text-bioaxis-text">{segment.title}</h2>
        <span className="text-sm font-bold text-bioaxis-dim">{String(segment.index).padStart(2, "0")}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{segment.description}</p>

      <div className="mt-6 grid flex-1 gap-6">
        <ListBlock title="Representative families" items={families} tone="strong" />
        <ListBlock title="Common buyer specs" items={buyerSpecs} />
        <ListBlock title="Primary applications" items={applications} />
      </div>

      {navigationSegment ? <SegmentFamilyReveal categories={navigationSegment.categories} /> : null}

      <div className="mt-6 grid gap-2 border-t border-bioaxis-line pt-5 sm:grid-cols-3">
        <Link
          href={`/products/${segment.slug}`}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-3 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          View category
        </Link>
        <Link
          href={buildRequestHref({ segment: segment.slug, requestType: "quote" })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Request quote
        </Link>
        <Link
          href={buildEquivalentFinderHref({ segment: segment.slug })}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
        >
          Find equivalent
        </Link>
      </div>
    </article>
  );
}

function SegmentFamilyReveal({ categories }: { categories: ProductNavigationCategory[] }) {
  return (
    <div className="mt-5 max-h-80 overflow-y-auto border-t border-bioaxis-line pt-5 opacity-100 transition-all duration-300 md:max-h-0 md:overflow-hidden md:pt-0 md:opacity-0 md:group-hover:max-h-80 md:group-hover:overflow-y-auto md:group-hover:pt-5 md:group-hover:opacity-100 md:group-focus-within:max-h-80 md:group-focus-within:overflow-y-auto md:group-focus-within:pt-5 md:group-focus-within:opacity-100">
      <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-accent">Family links</p>
      <div className="grid gap-3">
        {categories.map((category) => (
          <div key={category.slug}>
            <Link
              href={category.href}
              className="text-[11px] font-bold uppercase tracking-wide text-bioaxis-dim transition hover:text-bioaxis-accent"
            >
              {category.label}
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              {category.families.map((family) => (
                <Link
                  key={family.href}
                  href={family.href}
                  className="border border-white/[0.1] bg-bioaxis-black px-2 py-1 text-[11px] leading-5 text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                >
                  {family.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListBlock({ title, items, tone = "muted" }: { title: string; items: ListItem[]; tone?: "strong" | "muted" }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          item.href ? (
            <Link
              key={item.href}
              href={item.href}
              aria-label={`View ${item.label}`}
              className={[
                "border border-white/[0.12] px-3 py-1 text-xs leading-5 underline decoration-bioaxis-accent/40 underline-offset-4 transition hover:border-bioaxis-accent hover:text-bioaxis-accent",
                tone === "strong" ? "bg-white/[0.05] text-bioaxis-steel" : "bg-white/[0.03] text-bioaxis-muted"
              ].join(" ")}
            >
              {item.label}
            </Link>
          ) : (
            <span
              key={item.label}
              className={[
                "border border-white/[0.12] px-3 py-1 text-xs leading-5",
                tone === "strong" ? "bg-white/[0.05] text-bioaxis-steel" : "bg-white/[0.03] text-bioaxis-muted"
              ].join(" ")}
            >
              {item.label}
            </span>
          )
        ))}
      </div>
    </div>
  );
}
