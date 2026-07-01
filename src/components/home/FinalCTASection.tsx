import Link from "next/link";

export function FinalCTASection() {
  return (
    <section className="border-t border-bioaxis-line bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.18),transparent_24rem),radial-gradient(circle_at_86%_0%,rgba(16,185,129,0.12),transparent_22rem),linear-gradient(180deg,#eef3f8_0%,#f8fafc_100%)]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Ready to source?</p>
          <h2 className="mt-3 text-3xl font-bold uppercase text-bioaxis-text sm:text-4xl">Ready to structure your consumables sourcing?</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-bioaxis-muted">
            Paste a SKU, supplier line, or product list. BioAxis helps turn fragmented sourcing work
            into one clear path: equivalent, sample, document, quote, and supply review.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/request-quote?requestType=quote"
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-text bg-bioaxis-text px-6 text-sm font-bold uppercase text-white shadow-sm transition hover:border-bioaxis-ice hover:bg-bioaxis-ice hover:text-bioaxis-text"
          >
            Send sourcing request
          </Link>
          <Link
            href="/equivalent-finder"
            className="inline-flex min-h-12 items-center justify-center border border-bioaxis-line bg-white/[0.72] px-6 text-sm font-bold uppercase text-bioaxis-steel shadow-sm transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Find equivalent
          </Link>
        </div>
      </div>
    </section>
  );
}
