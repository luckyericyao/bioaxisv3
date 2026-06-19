import Link from "next/link";
import { AddToSourcingListButton } from "@/components/sourcing/AddToSourcingListButton";

type SupplierComparisonModuleProps = {
  title: string;
  href: string;
  segmentSlug: string;
  categorySlug: string;
  familySlug: string;
  productSlug?: string;
  segmentTitle: string;
  categoryTitle: string;
  familyTitle: string;
  productTitle?: string;
};

const buyerInputs = [
  "Current supplier",
  "Catalog number",
  "Quantity",
  "Sterility / cleanliness",
  "Format / packaging",
  "Compatibility",
  "Required documents",
  "Timeline"
];

const buyerCases = [
  "Current supplier out of stock",
  "Equivalent candidate review",
  "Sample before switching",
  "Documentation before purchasing",
  "Recurring supply planning"
];

export function SupplierComparisonModule({
  title,
  href,
  segmentSlug,
  categorySlug,
  familySlug,
  productSlug,
  segmentTitle,
  categoryTitle,
  familyTitle,
  productTitle
}: SupplierComparisonModuleProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8 lg:px-10">
      <div className="border border-bioaxis-line bg-bioaxis-panel p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-bioaxis-accent">Already using another supplier?</p>
            <h2 className="mt-3 text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Send your current supplier and catalog number.</h2>
            <p className="mt-5 text-sm leading-6 text-bioaxis-muted">
              BioAxis can help compare fit, documentation, sample path, and quote options for {title} without claiming automatic one-to-one equivalence.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AddToSourcingListButton
                title={title}
                href={href}
                segmentSlug={segmentSlug}
                categorySlug={categorySlug}
                familySlug={familySlug}
                productSlug={productSlug}
                segmentTitle={segmentTitle}
                categoryTitle={categoryTitle}
                familyTitle={familyTitle}
                productTitle={productTitle}
              />
              <Link
                href={`/equivalent-finder?requestType=equivalent&segment=${segmentSlug}&subcategory=${categorySlug}&family=${familySlug}${productSlug ? `&product=${productSlug}` : ""}`}
                className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
              >
                Compare equivalent path
              </Link>
            </div>
          </div>
          <div className="grid gap-5">
            <div>
              <p className="text-xs font-bold uppercase text-bioaxis-dim">Buyer inputs</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {buyerInputs.map((input) => (
                  <div key={input} className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                    {input}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-bioaxis-dim">Typical buyer cases</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {buyerCases.map((item) => (
                  <span key={item} className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
