import type { ProductFamily } from "@/data/productTaxonomy";
import { SpecTag } from "@/components/ui/SpecTag";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";
import { SourcingRequestLink } from "./SourcingRequestLink";

type ProductFamilyCardProps = {
  family: ProductFamily;
  segmentSlug: string;
  categorySlug: string;
};

export function ProductFamilyCard({ family, segmentSlug, categorySlug }: ProductFamilyCardProps) {
  return (
    <article className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <h3 className="text-xl font-bold text-bioaxis-text">{family.title}</h3>
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
        <SourcingRequestLink
          href={`/products/${segmentSlug}/${categorySlug}/${family.slug}`}
          preserveProductQuery
          className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
        >
          View family
        </SourcingRequestLink>
        <details className="group border-t border-bioaxis-line">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 text-xs font-semibold text-bioaxis-steel [&::-webkit-details-marker]:hidden">
            <span>Family sourcing actions</span>
            <span aria-hidden="true" className="text-bioaxis-accent transition group-open:rotate-45">+</span>
          </summary>
          <SourcingRequestButtonGroup segment={segmentSlug} category={categorySlug} family={family.slug} />
        </details>
      </div>
    </article>
  );
}
