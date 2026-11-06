import type { ProductCategory, ProductFamily, ProductItem, ProductTaxonomySegment } from "@/data/productTaxonomy";
import { getProductItemHref, getProductItemsForFamily } from "@/data/productItems";
import { SourcingRequestLink } from "./SourcingRequestLink";
import { DirectoryItemList } from "@/components/seo/StructuredData";

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

  const specificItems = productItems.filter((item) => item.indexable);
  const generalItems = productItems.filter((item) => !item.indexable);
  const renderConfiguration = (productItem: ProductItem) => {
    return (
      <article key={productItem.slug} className="flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5" data-family-template-kind={productItem.indexable ? "specific" : "general"}>
        <h3 className="text-lg font-semibold leading-snug text-bioaxis-text">{productItem.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-bioaxis-muted">{productItem.shortDescription}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${productItem.name} sourcing fields`}>
          {productItem.commonSpecifications.slice(0, 3).map((specification) => (
            <li key={specification} className="max-w-full border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs leading-5 text-bioaxis-steel">
              {specification}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <SourcingRequestLink
            href={getProductItemHref(segment.slug, category.slug, family.slug, productItem.slug)}
            preserveProductQuery
            className="action-secondary w-full"
          >
            Review configuration
          </SourcingRequestLink>
        </div>
      </article>
    );
  };

  return (
    <section id="family-configurations" className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-8 sm:px-8 sm:py-12 lg:px-10" data-family-configurations="true">
      <DirectoryItemList
        name={family.title}
        path={`/products/${segment.slug}/${category.slug}/${family.slug}`}
        items={[...specificItems, ...generalItems].map((item) => ({
          name: item.name,
          href: getProductItemHref(segment.slug, category.slug, family.slug, item.slug)
        }))}
      />
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold text-bioaxis-accent">Sourcing configuration templates</p>
          <h2 className="text-2xl font-semibold text-bioaxis-text">Configurations for review</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-bioaxis-muted">
          Sourcing templates, not supplier listings. Specifications and availability need confirmation.
        </p>
      </div>
      {specificItems.length > 0 ? (
        <div className={specificItems.length === 1 ? "max-w-xl" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
          {specificItems.map(renderConfiguration)}
        </div>
      ) : null}
      {generalItems.length > 0 ? (
        <details className="group mt-4 border-t border-bioaxis-line" data-general-family-templates="true">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold text-bioaxis-steel [&::-webkit-details-marker]:hidden">
            <span>General sourcing template</span>
            <span aria-hidden="true" className="text-bioaxis-accent transition group-open:rotate-45">+</span>
          </summary>
          <div className="grid gap-4 pt-2 md:grid-cols-2 xl:grid-cols-3">{generalItems.map(renderConfiguration)}</div>
        </details>
      ) : null}
    </section>
  );
}
