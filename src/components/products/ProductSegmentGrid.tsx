import Link from "next/link";
import { productTaxonomy, type ProductSegment } from "@/data/productTaxonomy";
import { ProductSegmentCard } from "./ProductSegmentCard";

type ProductSegmentGridProps = {
  limit?: number;
  query?: string;
  mode?: "preview" | "full";
};

function segmentMatchesQuery(segment: ProductSegment, query: string) {
  const normalizedQuery = query.toLowerCase();
  const searchableText = [
    segment.title,
    segment.description,
    segment.heroStatement,
    ...segment.productFamilies,
    ...segment.applications,
    ...segment.specifications,
    ...segment.formats,
    ...segment.primaryApplications,
    ...segment.categories.map((category) => category.title)
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function ProductSegmentGrid({ limit, query = "", mode = "preview" }: ProductSegmentGridProps) {
  const baseSegments = typeof limit === "number" ? productTaxonomy.slice(0, limit) : productTaxonomy;
  const normalizedQuery = query.trim();
  const visibleSegments = normalizedQuery
    ? baseSegments.filter((segment) => segmentMatchesQuery(segment, normalizedQuery))
    : baseSegments;

  if (visibleSegments.length === 0) {
    return (
      <div className="border border-bioaxis-line bg-bioaxis-panel p-8">
        <p className="text-sm font-semibold uppercase text-bioaxis-muted">No matching directory segment</p>
        <h2 className="mt-4 text-2xl font-bold uppercase text-bioaxis-text">Request sourcing support.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-bioaxis-muted">
          The first product universe is organized by workflow segments. If your search uses a catalog number, supplier, or exact equivalent, send it through the quote flow so BioAxis can prepare sourcing options.
        </p>
        <Link
          href="/request-quote"
          className="mt-6 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          Request quote
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {visibleSegments.map((segment, index) => (
        <ProductSegmentCard key={segment.title} segment={segment} index={index} mode={mode} />
      ))}
    </div>
  );
}
