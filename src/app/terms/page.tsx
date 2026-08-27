import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Terms | BioAxis",
  description: "Terms for using the BioAxis sourcing support platform.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Terms</p>
      <h1 className="mt-4 text-4xl font-bold uppercase text-bioaxis-text sm:text-6xl">Sourcing support terms.</h1>
      <p className="mt-6 text-base leading-7 text-bioaxis-muted">
        BioAxis provides an intake and sourcing-support workflow for life science consumables. A submitted request is a request for review, not an order, inventory reservation, certification, or guarantee of supply.
      </p>
      <div className="mt-10 grid gap-4">
        {[
          ["Sourcing review", "BioAxis may help organize product context, compare candidate options, request samples, collect supplier documents, and prepare quote-ready information."],
          ["Buyer responsibility", "The buyer remains responsible for technical fit, supplier qualification, sample testing, regulatory and quality review, purchase approval, and final suitability decisions."],
          ["Availability and timing", "Availability, pricing, lead time, documentation, and replenishment options are confirmed per request and may vary by product, supplier, destination, and quantity."],
          ["No automatic interchangeability", "Equivalent review produces candidates and comparison criteria. It does not represent a guaranteed replacement or a final validation release."]
        ].map(([title, body]) => (
          <article key={title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
            <h2 className="text-base font-bold uppercase text-bioaxis-text">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
