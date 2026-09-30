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
  buyerInputs: string[];
};

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
  productTitle,
  buyerInputs
}: SupplierComparisonModuleProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-8 sm:px-8 lg:px-10">
      <details className="group border border-bioaxis-line bg-bioaxis-panel">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-bold uppercase text-bioaxis-text outline-none transition hover:bg-bioaxis-panelSoft focus-visible:ring-2 focus-visible:ring-bioaxis-accent sm:px-6 [&::-webkit-details-marker]:hidden">
          <span>Compare this target with a current supplier</span>
          <span className="shrink-0 text-xs font-semibold text-bioaxis-accent">Optional · +</span>
        </summary>
        <div className="border-t border-bioaxis-line p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-bold uppercase text-bioaxis-text sm:text-3xl">Add a supplier reference when you have one.</h2>
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
              <p className="text-xs font-bold uppercase text-bioaxis-dim">Comparison inputs to consider</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {buyerInputs.map((input) => (
                  <div key={input} className="border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs font-semibold text-bioaxis-steel">
                    {input}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </details>
    </section>
  );
}
