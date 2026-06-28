import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const buyerTriggers = [
  {
    title: "Current supplier out of stock",
    body: "Send the current SKU, quantity, and timing.",
    href: "/request-quote?requestType=quote&need=supplier-out-of-stock"
  },
  {
    title: "Need compatible equivalent",
    body: "Compare fit, format, documents, and sample path.",
    href: "/equivalent-finder?need=compatible-equivalent"
  },
  {
    title: "Need CoA / SDS / sterility documents",
    body: "List the product and required evidence.",
    href: "/request-quote?requestType=documentation&need=documents"
  },
  {
    title: "Need samples before switching",
    body: "Coordinate samples before buyer-side evaluation.",
    href: "/request-quote?requestType=sample&need=sample-before-switching"
  },
  {
    title: "Lower-cost recurring supply",
    body: "Share usage rhythm and required documents.",
    href: "/request-quote?requestType=recurring-supply&need=recurring-supply"
  },
  {
    title: "Automation-compatible consumables",
    body: "Send platform, rack, barcode, and format constraints.",
    href: "/request-quote?requestType=quote&need=automation-compatible"
  }
];

export function BuyerTriggerSection() {
  return (
    <section className="border-b border-bioaxis-line bg-bioaxis-black">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="max-w-4xl">
          <SectionHeader
            title="What are you trying to solve?"
            subtitle="Start from the buying problem. BioAxis routes it into RFQ, equivalent, sample, documentation, or recurring supply review."
          />
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
