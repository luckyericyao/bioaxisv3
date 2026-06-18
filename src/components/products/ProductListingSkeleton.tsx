import Link from "next/link";
import type { ProductSubcategory } from "@/data/productTaxonomy";

type ProductListingSkeletonProps = {
  segmentSlug: string;
  subcategory: ProductSubcategory;
};

export function ProductListingSkeleton({ segmentSlug, subcategory }: ProductListingSkeletonProps) {
  return (
    <section className="overflow-hidden border border-bioaxis-line bg-bioaxis-panel">
      <div className="border-b border-bioaxis-line p-5">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Sourcing options preview</h2>
        <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
          Representative taxonomy rows only. BioAxis does not present pricing, availability labels, or cart behavior.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full border-collapse text-left">
          <thead className="bg-bioaxis-black text-xs uppercase text-bioaxis-dim">
            <tr>
              <th className="border-b border-bioaxis-line px-4 py-3">Compare</th>
              <th className="border-b border-bioaxis-line px-4 py-3">Product family</th>
              <th className="border-b border-bioaxis-line px-4 py-3">Typical format</th>
              <th className="border-b border-bioaxis-line px-4 py-3">Key specifications</th>
              <th className="border-b border-bioaxis-line px-4 py-3">Documentation</th>
              <th className="border-b border-bioaxis-line px-4 py-3">Request</th>
            </tr>
          </thead>
          <tbody>
            {subcategory.featuredFamilies.map((family) => {
              const query = `category=${segmentSlug}&subcategory=${subcategory.slug}&family=${family.slug}`;

              return (
                <tr key={family.slug} className="border-b border-bioaxis-line last:border-b-0">
                  <td className="px-4 py-4 align-top">
                    <input type="checkbox" className="accent-bioaxis-accent" aria-label={`Compare ${family.title}`} />
                  </td>
                  <td className="px-4 py-4 align-top text-sm font-semibold text-bioaxis-text">{family.title}</td>
                  <td className="px-4 py-4 align-top text-sm text-bioaxis-muted">{family.representativeFormats.slice(0, 3).join(", ")}</td>
                  <td className="px-4 py-4 align-top text-sm text-bioaxis-muted">{family.keySpecifications.slice(0, 3).join(", ")}</td>
                  <td className="px-4 py-4 align-top text-sm text-bioaxis-muted">{family.documentationNeeds.slice(0, 2).join(", ")}</td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/request-quote?${query}`} className="border border-bioaxis-line px-3 py-1 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                        Quote
                      </Link>
                      <Link href={`/equivalents?${query}`} className="border border-bioaxis-line px-3 py-1 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                        Equivalent
                      </Link>
                      <Link href={`/samples?${query}`} className="border border-bioaxis-line px-3 py-1 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent">
                        Sample
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
