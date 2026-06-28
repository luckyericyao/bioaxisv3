import Link from "next/link";

export function FinalCTASection() {
  return (
    <section className="border-t border-bioaxis-line bg-bioaxis-panel">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Ready to source?</p>
          <h2 className="mt-3 text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Send the product context.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-bioaxis-muted">
            Paste a SKU, supplier catalog number, product list, or sourcing need. BioAxis can follow up by email for missing details.
          </p>
        </div>
        <Link
          href="/request-quote?requestType=product-list-review"
          className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-6 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
        >
          Paste product list
        </Link>
      </div>
    </section>
  );
}
