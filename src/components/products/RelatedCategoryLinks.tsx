import Link from "next/link";
import type { ProductTaxonomySegment } from "@/data/productTaxonomy";

type RelatedCategoryLinksProps = {
  title?: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  relatedSegments?: ProductTaxonomySegment[];
};

export function RelatedCategoryLinks({ title = "Related categories", links, relatedSegments = [] }: RelatedCategoryLinksProps) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="border border-bioaxis-line px-4 py-3 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            {link.label}
          </Link>
        ))}
        {relatedSegments.map((segment) => (
          <Link key={segment.slug} href={`/products/${segment.slug}`} className="border border-bioaxis-line px-4 py-3 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
            {segment.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

