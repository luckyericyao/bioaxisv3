import Link from "next/link";
import { buildEquivalentFinderHref, buildRequestHref, type ProductCategory, type ProductFamily, type ProductTaxonomySegment } from "@/data/productTaxonomy";
import { getProductItemHref, getProductItemsForFamily } from "@/data/productItems";

type ProductConfigurationSectionProps = {
  segment: ProductTaxonomySegment;
  category: ProductCategory;
  family: ProductFamily;
};

export function ProductConfigurationSection({ segment, category, family }: ProductConfigurationSectionProps) {
  const productItems = getProductItemsForFamily(segment.slug, category.slug, family.slug);

  if (productItems.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-bioaxis-accent">Sourcing configuration templates</p>
          <h2 className="text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Choose a sourcing template.</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-bioaxis-muted">
          Product item pages contain the detailed RFQ fields, documentation requests, equivalent review inputs, and sample-first notes.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productItems.map((productItem) => {
          const productHref = getProductItemHref(segment.slug, category.slug, family.slug, productItem.slug);
          const quoteHref = buildRequestHref({
            segment: segment.slug,
            category: category.slug,
            family: family.slug,
            product: productItem.slug,
            requestType: "quote"
          });
          const equivalentHref = buildEquivalentFinderHref({
            segment: segment.slug,
            category: category.slug,
            family: family.slug,
            product: productItem.slug
          });

          return (
            <article key={productItem.slug} className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5">
              <h3 className="text-lg font-bold uppercase leading-tight text-bioaxis-text">{productItem.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-bioaxis-muted">{productItem.shortDescription}</p>
              <div className="mt-5 grid gap-2">
                {productItem.commonSpecifications.slice(0, 3).map((specification) => (
                  <div key={specification} className="border border-white/[0.1] bg-bioaxis-black px-3 py-2 text-xs leading-5 text-bioaxis-steel">
                    {specification}
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <Link
                  href={productHref}
                  className="inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-3 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
                >
                  View product
                </Link>
                <Link
                  href={quoteHref}
                  className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                >
                  Request quote
                </Link>
                <Link
                  href={equivalentHref}
                  className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-3 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
                >
                  Find equivalent
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
