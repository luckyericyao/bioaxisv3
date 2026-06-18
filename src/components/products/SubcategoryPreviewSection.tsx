import Link from "next/link";
import type { ProductSubcategory } from "@/data/productTaxonomy";
import { SpecTag } from "@/components/ui/SpecTag";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";

type SubcategoryPreviewSectionProps = {
  segmentSlug: string;
  subcategory: ProductSubcategory;
};

export function SubcategoryPreviewSection({ segmentSlug, subcategory }: SubcategoryPreviewSectionProps) {
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
            <Link href={`/products/${segmentSlug}/${subcategory.slug}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
              View products
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Featured product families</p>
          <div className="flex flex-wrap gap-2">
            {subcategory.featuredFamilies.map((family) => (
              <Link key={family.slug} href={`/products/${segmentSlug}/${subcategory.slug}/${family.slug}`}>
                <SpecTag>{family.title}</SpecTag>
              </Link>
            ))}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <TagBlock title="Typical products" values={subcategory.typicalProducts} />
            <TagBlock title="Applications" values={subcategory.commonApplications} />
            <TagBlock title="Specifications" values={subcategory.specifications} />
            <TagBlock title="Formats" values={subcategory.commonFormats} />
          </div>
          <div className="mt-6">
            <SourcingRequestButtonGroup segment={segmentSlug} category={subcategory.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TagBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-bioaxis-dim">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.slice(0, 5).map((value) => (
          <SpecTag key={value}>{value}</SpecTag>
        ))}
      </div>
    </div>
  );
}
