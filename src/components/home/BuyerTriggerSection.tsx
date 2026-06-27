import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const buyerTriggers = [
  {
    title: "Current supplier out of stock",
    body: "Paste the current supplier SKU, product name, quantity, and timing so BioAxis can structure a sourcing path.",
    href: "/request-quote?requestType=quote&need=supplier-out-of-stock"
  },
  {
    title: "Find compatible equivalent",
    body: "Send a catalog number or product description for format, material, documentation, and sample-path review.",
    href: "/equivalent-finder?need=compatible-equivalent"
  },
  {
    title: "Request CoA / SDS / sterility documents",
    body: "List the product and documents needed before procurement, qualification, or supplier switching.",
    href: "/request-quote?requestType=documentation&need=documents"
  },
  {
    title: "Need samples before switching",
    body: "Request samples when cells, assays, automation decks, or QC workflows need buyer-side evaluation.",
    href: "/request-quote?requestType=sample&need=sample-before-switching"
  },
  {
    title: "Lower cost recurring supply",
    body: "Share monthly or annual usage, packaging preference, and documentation needs for recurring supply review.",
    href: "/request-quote?requestType=recurring-supply&need=recurring-supply"
  },
  {
    title: "Automation-compatible consumables",
    body: "Send platform, rack, barcode, conductivity, and format constraints for liquid-handler-compatible sourcing.",
    href: "/request-quote?requestType=quote&need=automation-compatible"
  }
];

export function BuyerTriggerSection() {
  return (
    <section className="border-b border-bioaxis-line bg-bioaxis-black">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeader
            title="What are you trying to solve?"
            subtitle="Start from the sourcing problem. BioAxis can turn a SKU, supplier name, product list, or short need into an RFQ, equivalent, sample, or documentation path."
          />
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/request-quote?type=product-list&requestType=product-list-review"
              className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-bold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
            >
              Paste product list
            </Link>
            <Link
              href="/equivalent-finder"
              className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-bold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
            >
              Find equivalent
            </Link>
          </div>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {buyerTriggers.map((trigger, index) => (
            <Link
              key={trigger.title}
              href={trigger.href}
              className="group border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <span className="text-xs font-bold text-bioaxis-dim">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-4 text-lg font-bold uppercase leading-tight text-bioaxis-text transition group-hover:text-bioaxis-accent">
                {trigger.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{trigger.body}</p>
              <span className="mt-5 inline-flex text-xs font-bold uppercase text-bioaxis-accent">Start request</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
