import Link from "next/link";
import type { ProductSubcategory } from "@/data/productTaxonomy";
import { SpecTag } from "@/components/ui/SpecTag";

type SubcategoryPreviewSectionProps = {
  segmentSlug: string;
  subcategory: ProductSubcategory;
};

export function SubcategoryPreviewSection({ segmentSlug, subcategory }: SubcategoryPreviewSectionProps) {
  const query = `category=${segmentSlug}&subcategory=${subcategory.slug}`;

  return (
    <section id={subcategory.slug} className="scroll-mt-24 border border-bioaxis-line bg-bioaxis-panel p-6">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{subcategory.title}</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{subcategory.description}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <Link href={`/products/${segmentSlug}/${subcategory.slug}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
              View more
            </Link>
            <Link href={`/request-quote?${query}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              View products
            </Link>
            <Link href={`/equivalents?${query}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              Find equivalent
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Featured subcategories / product families</p>
          <div className="flex flex-wrap gap-2">
            {subcategory.featuredFamilies.map((family) => (
              <Link key={family.slug} href={`/products/${segmentSlug}/${subcategory.slug}#${family.slug}`}>
                <SpecTag>{family.title}</SpecTag>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

