import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";

export default function RequestQuotePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-16 sm:px-8 lg:px-10">
      <section className="grid gap-10 border-b border-bioaxis-line pb-12 pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="mb-5 text-sm uppercase text-bioaxis-muted">Request quote</p>
          <h1 className="max-w-3xl text-4xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-6xl">
            SOURCE PRODUCTS, EQUIVALENTS, SAMPLES, AND SUPPORT.
          </h1>
        </div>
        <p className="max-w-2xl text-base leading-7 text-bioaxis-muted sm:text-lg">
          Tell BioAxis what you need. The first version prepares a clean sourcing request on the client so a specialist can review product needs, quote options, samples, and alternatives.
        </p>
      </section>

      <section className="pt-12">
        <QuoteRequestForm />
      </section>
    </div>
  );
}

