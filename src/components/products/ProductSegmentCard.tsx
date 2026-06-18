import Link from "next/link";
import type { ProductSegment } from "@/data/productSegments";
import { ProductFamilyList } from "./ProductFamilyList";
import { ProductTagList } from "./ProductTagList";

type ProductSegmentCardProps = {
  segment: ProductSegment;
  index: number;
  mode?: "preview" | "full";
};

export function ProductSegmentCard({ segment, index, mode = "preview" }: ProductSegmentCardProps) {
  const fullMode = mode === "full";

  return (
    <article className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold uppercase leading-tight text-bioaxis-text">{segment.title}</h3>
        <span className="shrink-0 text-sm font-bold text-bioaxis-dim">{String(segment.index || index + 1).padStart(2, "0")}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{segment.description}</p>

      <div className="mt-6 grid flex-1 gap-6">
        <ProductFamilyList families={segment.productFamilies} maxItems={fullMode ? 14 : 6} />
        <ProductTagList label="Applications" tags={segment.applications} maxItems={fullMode ? 8 : 4} />
        {fullMode ? (
          <>
            <ProductTagList label="Specifications" tags={segment.specifications} />
            <ProductTagList label="Representative formats" tags={segment.formats} />
          </>
        ) : (
          <ProductTagList label="Formats" tags={segment.formats} maxItems={4} />
        )}
      </div>

      <div className="mt-6 grid gap-2 border-t border-bioaxis-line pt-5 sm:grid-cols-3">
        <Link href={`/products/${segment.slug}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
          View segment
        </Link>
        <Link href={`/equivalents?segment=${segment.slug}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
          Find equivalent
        </Link>
        <Link href={`/samples?segment=${segment.slug}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
          Request sample
        </Link>
      </div>
    </article>
  );
}
