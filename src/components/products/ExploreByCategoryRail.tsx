import Link from "next/link";
import type { ProductSubcategory } from "@/data/productTaxonomy";

type ExploreByCategoryRailProps = {
  segmentSlug: string;
  subcategories: ProductSubcategory[];
};

export function ExploreByCategoryRail({ segmentSlug, subcategories }: ExploreByCategoryRailProps) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex min-w-full gap-3">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.slug}
            href={`/products/${segmentSlug}/${subcategory.slug}`}
            className="min-w-[220px] border border-bioaxis-line bg-bioaxis-panel p-4 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
          >
            <span className="block text-sm font-bold uppercase text-bioaxis-text">{subcategory.title}</span>
            <span className="mt-2 line-clamp-3 block text-xs leading-5 text-bioaxis-muted">{subcategory.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

