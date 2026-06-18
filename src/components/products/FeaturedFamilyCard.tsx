import Link from "next/link";
import type { FeaturedFamily } from "@/data/productTaxonomy";
import { SpecTag } from "@/components/ui/SpecTag";
import { SourcingRequestButtonGroup } from "./SourcingRequestButtonGroup";

type FeaturedFamilyCardProps = {
  family: FeaturedFamily;
  segmentSlug: string;
  subcategorySlug: string;
};

export function FeaturedFamilyCard({ family, segmentSlug, subcategorySlug }: FeaturedFamilyCardProps) {
  return (
    <article id={family.slug} className="scroll-mt-24 border border-bioaxis-line bg-bioaxis-panel p-6">
      <h3 className="text-xl font-bold uppercase text-bioaxis-text">{family.title}</h3>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{family.description}</p>
      <div className="mt-5 grid gap-5">
        <TagBlock title="Typical products" tags={family.typicalProducts} />
        <TagBlock title="Key specifications" tags={family.keySpecifications} />
        <TagBlock title="Representative formats" tags={family.representativeFormats} />
        <TagBlock title="Documentation needs" tags={family.documentationNeeds} />
      </div>
      <div className="mt-6 grid gap-2">
        <Link href={`/products/${segmentSlug}/${subcategorySlug}/${family.slug}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-3 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
          View product family
        </Link>
        <SourcingRequestButtonGroup segment={segmentSlug} category={subcategorySlug} family={family.slug} />
      </div>
    </article>
  );
}

function TagBlock({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">{title}</p>
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 7).map((tag) => (
          <SpecTag key={tag}>{tag}</SpecTag>
        ))}
      </div>
    </div>
  );
}
