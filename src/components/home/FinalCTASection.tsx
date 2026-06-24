import { CTAButton } from "@/components/ui/CTAButton";
import { SearchBox } from "@/components/ui/SearchBox";

export function FinalCTASection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <h2 className="text-4xl font-bold uppercase leading-tight text-bioaxis-text sm:text-6xl">
            SEND A PRODUCT LIST, CATALOG NUMBER, OR CURRENT SUPPLIER.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-bioaxis-muted sm:text-lg">
            Enter a product name, supplier, catalog number, equivalent target, workflow, or consumable type. BioAxis helps organize quote paths, compatible options, samples, documentation, and recurring supply review from one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/request-quote?type=product-list&requestType=product-list-review">Paste Product List</CTAButton>
            <CTAButton href="/request-quote?type=rfq&requestType=quote" variant="secondary">
              Request Quote
            </CTAButton>
            <CTAButton href="/equivalent-finder" variant="secondary">
              Find Equivalent
            </CTAButton>
          </div>
        </div>

        <SearchBox helperText="Search the product universe or prepare a sourcing request when you need quote, sample, documentation, or equivalent review support." variant="page" />
      </div>
    </section>
  );
}
