import { CTAButton } from "@/components/ui/CTAButton";
import { SearchBox } from "@/components/ui/SearchBox";

export function FinalCTASection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <h2 className="text-4xl font-bold uppercase leading-tight text-bioaxis-text sm:text-6xl">
            START WITH A SEARCH.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-bioaxis-muted sm:text-lg">
            Enter anything: a product name, supplier, catalog number, equivalent, workflow, or consumable type. BioAxis helps you find sourcing options from one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/products">Search</CTAButton>
            <CTAButton href="/request-quote" variant="secondary">
              Request Quote
            </CTAButton>
          </div>
        </div>

        <SearchBox helperText="Search the product universe or prepare a sourcing request when you need quote support." variant="page" />
      </div>
    </section>
  );
}

