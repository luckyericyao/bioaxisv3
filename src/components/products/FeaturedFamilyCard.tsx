import Link from "next/link";
import type { FeaturedFamily } from "@/data/productTaxonomy";
import { SpecTag } from "@/components/ui/SpecTag";

type FeaturedFamilyCardProps = {
  family: FeaturedFamily;
  segmentSlug: string;
  subcategorySlug: string;
};

export function FeaturedFamilyCard({ family, segmentSlug, subcategorySlug }: FeaturedFamilyCardProps) {
  const query = `category=${segmentSlug}&subcategory=${subcategorySlug}&family=${family.slug}`;

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
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        <Link href={`/request-quote?${query}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-3 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black">
          Request quote
        </Link>
        <Link href={`/equivalents?${query}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
          Find equivalent
        </Link>
        <Link href={`/samples?${query}`} className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
          Request sample
        </Link>
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

