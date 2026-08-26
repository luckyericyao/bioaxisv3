import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Suppliers & Coverage | BioAxis",
  description:
    "BioAxis helps labs turn supplier lists, catalog references, equivalent needs, quote requests, and documentation constraints into structured consumables sourcing review.",
  alternates: {
    canonical: "/suppliers"
  }
};

const supplierReviewPaths = [
  {
    title: "Supplier line review",
    body: "Send current supplier names, catalog references, product descriptions, and usage notes. BioAxis can organize the list into product families, documents, samples, and RFQ fields.",
    href: "/request-quote?requestType=product-list-review&sourcePage=%2Fsuppliers&supportPath=product-matching",
    cta: "Send supplier list"
  },
  {
    title: "Equivalent comparison",
    body: "Use current products as the reference point, then compare candidate options by format, material, sterility, packaging, workflow fit, and documentation.",
    href: "/equivalent-finder?sourcePage=%2Fsuppliers&supportPath=equivalent-review",
    cta: "Compare equivalents"
  },
  {
    title: "Quote-ready supplier brief",
    body: "Turn supplier lines, quantities, delivery timing, required documents, and recurring usage into a cleaner request for sourcing follow-up.",
    href: "/request-quote?requestType=quote&sourcePage=%2Fsuppliers&supportPath=rfq-preparation",
    cta: "Prepare supplier RFQ"
  }
];

export default function SuppliersPage() {
  return (
    <>
      <PageHero
        eyebrow="Supplier coverage"
        title="Turn supplier lists into sourcing review."
        subtitle="BioAxis helps labs and procurement teams structure supplier lines, catalog references, equivalent targets, documents, samples, and RFQ details without claiming universal stock or automatic interchangeability."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeader
          title="Start with the supplier information you already have."
          subtitle="A current supplier name, catalog reference, rough product description, or spreadsheet row is enough to begin a structured review."
        />
        <div className="mt-10">
          <ProcessSteps
            steps={[
              { title: "Normalize the input", body: "Group supplier lines by product family, format, required specifications, documents, and quantity context." },
              { title: "Compare sourcing paths", body: "Review equivalent criteria, sample needs, documentation requirements, and recurring supply constraints before switching." },
              { title: "Prepare the next request", body: "Move from scattered supplier notes to a quote-ready brief with fewer follow-up questions." }
            ]}
          />
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {supplierReviewPaths.map((item) => (
            <article key={item.title} className="border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
              <h2 className="text-xl font-bold uppercase text-bioaxis-text">{item.title}</h2>
              <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{item.body}</p>
              <Link
                href={item.href}
                className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
              >
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-6 border border-bioaxis-line bg-bioaxis-black p-5">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Useful input</p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-bioaxis-muted md:grid-cols-3">
            {["Supplier or brand", "Catalog reference", "Product description", "Required documents", "Quantity and timing", "Equivalent or sample need"].map((item) => (
              <li key={item} className="border-l border-bioaxis-accent/40 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 pb-16 sm:px-8 md:grid-cols-3 lg:px-10">
        {[
          { title: "Sample support", body: "Request samples where available before switching supplier or scaling volume." },
          { title: "Recurring supply planning", body: "Share expected usage and timelines so BioAxis can support longer-term sourcing decisions." },
          { title: "Documentation review", body: "Organize CoA, SDS, sterility, material, lot-level, and supplier specification requirements." }
        ].map((item) => (
          <article key={item.title} className="border border-bioaxis-line bg-bioaxis-panel p-6">
            <h2 className="text-xl font-bold uppercase text-bioaxis-text">{item.title}</h2>
            <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{item.body}</p>
          </article>
        ))}
      </section>
      <CTASection
        title="Send supplier lines for structured review"
        body="Share supplier names, catalog references, product descriptions, quantities, required documents, or equivalent targets. BioAxis will organize the sourcing context for the next quote, sample, document, or comparison step."
        primaryLabel="Send supplier list"
        primaryHref="/request-quote?requestType=product-list-review&sourcePage=%2Fsuppliers&supportPath=product-matching"
        secondaryLabel="Review equivalents across suppliers"
        secondaryHref="/equivalent-finder?sourcePage=%2Fsuppliers&supportPath=equivalent-review"
      />
    </>
  );
}
