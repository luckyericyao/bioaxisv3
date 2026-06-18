import Link from "next/link";
import type { ProductFamily } from "@/data/productTaxonomy";
import { SpecTag } from "@/components/ui/SpecTag";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";

type ProductFamilyCardProps = {
  family: ProductFamily;
  segmentSlug: string;
  categorySlug: string;
};

export function ProductFamilyCard({ family, segmentSlug, categorySlug }: ProductFamilyCardProps) {
  return (
    <article className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <h3 className="text-xl font-bold uppercase text-bioaxis-text">{family.title}</h3>
      <p className="mt-4 flex-1 text-sm leading-6 text-bioaxis-muted">{family.shortDescription}</p>
      <div className="mt-5">
        <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Common formats</p>
        <div className="flex flex-wrap gap-2">
          {family.commonFormats.slice(0, 4).map((format) => (
            <SpecTag key={format}>{format}</SpecTag>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-2">
        <Link
          href={`/products/${segmentSlug}/${categorySlug}/${family.slug}`}
          className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          View family
        </Link>
        <SourcingRequestButtonGroup segment={segmentSlug} category={categorySlug} family={family.slug} />
      </div>
    </article>
  );
}
