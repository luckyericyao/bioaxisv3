import Link from "next/link";

export function FinalCTASection() {
  return (
    <section className="border-t border-bioaxis-line bg-bioaxis-panel">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Ready to source?</p>
          <h2 className="mt-3 text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Ready to consolidate consumables sourcing?</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-bioaxis-muted">
            Paste a SKU, supplier line, or product list. BioAxis helps turn fragmented sourcing work
            into one clear path: equivalent, sample, document, quote, and supply review.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/request-quote?requestType=quote"
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-6 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Request quote
          </Link>
          <Link
            href="/equivalent-finder"
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line px-6 text-sm font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Find equivalent
          </Link>
        </div>
      </div>
    </section>
  );
}
