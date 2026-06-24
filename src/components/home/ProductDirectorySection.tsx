import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const startingPoints = [
  {
    title: "Catalog number",
    body: "Paste a catalog number or supplier SKU and request sourcing options.",
    cta: "Submit catalog number",
    href: "/request-quote?type=rfq&requestType=quote"
  },
  {
    title: "Product list",
    body: "Send a current consumables list for quote, equivalent review, sample planning, or documentation support.",
    cta: "Paste product list",
    href: "/request-quote?type=product-list&requestType=product-list-review"
  },
  {
    title: "Current supplier",
    body: "Tell us what brand or supplier you currently use. BioAxis can help structure comparable options.",
    cta: "Find equivalent",
    href: "/request-quote?type=equivalent&requestType=equivalent"
  },
  {
    title: "Workflow need",
    body: "Describe the experiment, assay, automation system, or purchasing need.",
    cta: "Describe workflow",
    href: "/request-quote?type=rfq&requestType=quote&sourcePage=workflow-need"
  }
];

const buyerTriggers = [
  "Out-of-stock or long lead time",
  "Price increase from current supplier",
  "Need compatible equivalent",
  "Need CoA, SDS, sterility, material, or lot-level documentation",
  "Need samples before switching",
  "Need automation-compatible consumables",
  "Need recurring supply support",
  "Need to consolidate multiple product lines"
];

const scenarios = [
  {
    title: "Current supplier is out of stock",
    body: "Send the current catalog number and target timeline. BioAxis can help structure alternative sourcing and sample next steps."
  },
  {
    title: "You need an equivalent",
    body: "Share the brand, SKU, format, material, sterility, and workflow requirements. BioAxis can help review compatible options."
  },
  {
    title: "You need documents before purchasing",
    body: "Request CoA, SDS, sterility, material, lot-level, or supplier documentation context."
  },
  {
    title: "You need samples before switching",
    body: "Use BioAxis to organize sample requests before committing to a larger purchase."
  },
  {
    title: "You need recurring supply",
    body: "Share expected usage, product list, and purchasing cadence."
  },
  {
    title: "You are consolidating vendors",
    body: "Send a mixed list of consumables and BioAxis can help organize it by category, supplier, documentation needs, and quote path."
  }
];

export function ProductDirectorySection() {
  return (
    <section id="sourcing-paths" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <SectionHeader
        title="Start with what you have"
        subtitle="Start from a sourcing path: catalog number, product list, current supplier, or workflow context."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {startingPoints.map((point) => (
          <Link
            key={point.title}
            href={point.href}
            className="group flex h-full flex-col border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
          >
            <h2 className="text-lg font-bold uppercase text-bioaxis-text transition group-hover:text-bioaxis-accent">
              {point.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-bioaxis-muted">{point.body}</p>
            <span className="mt-5 inline-flex text-xs font-bold uppercase text-bioaxis-accent">{point.cta}</span>
          </Link>
        ))}
      </div>

      <section className="mt-10 border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-bioaxis-accent">Common buyer triggers</p>
            <h2 className="mt-2 text-2xl font-bold uppercase text-bioaxis-text">Start request from the buying problem.</h2>
          </div>
          <Link
            href="/request-quote?type=rfq&requestType=quote"
            className="inline-flex min-h-10 items-center justify-center border border-bioaxis-line px-4 text-xs font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Start request
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {buyerTriggers.map((trigger) => (
            <Link
              key={trigger}
              href={`/request-quote?type=rfq&requestType=quote&need=${encodeURIComponent(trigger.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`}
              className="border border-white/[0.12] bg-bioaxis-black p-4 text-sm font-semibold uppercase leading-6 text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              <span>{trigger}</span>
              <span className="mt-4 block text-xs font-bold text-bioaxis-accent">Start request</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border border-bioaxis-accent/60 bg-bioaxis-panel p-6">
          <p className="text-xs font-bold uppercase text-bioaxis-accent">Have a product list?</p>
          <h2 className="mt-3 text-3xl font-bold uppercase leading-tight text-bioaxis-text">
            Paste catalog numbers, supplier names, product descriptions, pack sizes, or notes.
          </h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            BioAxis will help organize the request into sourcing, equivalent review, documentation, sample, or quote next steps.
          </p>
          <Link
            href="/request-quote?type=product-list&requestType=product-list-review"
            className="mt-6 inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Paste product list
          </Link>
        </div>

        <section className="border border-bioaxis-line bg-bioaxis-panel p-5 sm:p-6">
          <p className="text-xs font-bold uppercase text-bioaxis-accent">Built for real purchasing situations</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {scenarios.map((scenario) => (
              <article key={scenario.title} className="border border-bioaxis-line bg-bioaxis-black p-4">
                <h3 className="text-sm font-bold uppercase text-bioaxis-text">{scenario.title}</h3>
                <p className="mt-3 text-xs leading-5 text-bioaxis-muted">{scenario.body}</p>
                <Link
                  href="/request-quote?type=rfq&requestType=quote"
                  className="mt-4 inline-flex text-xs font-bold uppercase text-bioaxis-accent transition hover:text-bioaxis-text"
                >
                  Start request
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
