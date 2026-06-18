import type { ProductTaxonomySegment } from "@/data/productTaxonomy";
import { ProductCategoryCard } from "./ProductCategoryCard";

type ProductCategoryGridProps = {
  segments: ProductTaxonomySegment[];
};

export function ProductCategoryGrid({ segments }: ProductCategoryGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {segments.map((segment) => (
        <ProductCategoryCard key={segment.slug} segment={segment} />
      ))}
    </div>
  );
}

