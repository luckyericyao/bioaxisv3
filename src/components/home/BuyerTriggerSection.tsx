import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const buyerTriggers = [
  {
    title: "Current supplier out of stock",
    body: "Find sourcing paths when lead time, allocation, or availability blocks purchasing.",
    href: "/request-quote?requestType=quote&need=supplier-out-of-stock",
    cta: "Start RFQ"
  },
  {
    title: "Need compatible equivalent",
    body: "Compare current SKU context against format, material, sterility, packaging, workflow fit, automation constraints, and sample needs.",
    href: "/equivalent-finder?need=compatible-equivalent",
    cta: "Find equivalent"
  },
  {
    title: "Need documents before purchasing",
    body: "Organize CoA, SDS, sterility, material, lot-level, or supplier specification requirements before purchasing.",
    href: "/request-quote?requestType=documentation&need=documents",
    cta: "Request documents"
  },
  {
    title: "Recurring supply / lower-cost review",
    body: "Review recurring demand, packaging, MOQ, lead-time, and backup-source options.",
    href: "/request-quote?requestType=recurring-supply&need=recurring-supply",
    cta: "Send product list"
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
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {buyerTriggers.map((trigger, index) => (
            <Link
              key={trigger.title}
              href={trigger.href}
              data-buyer-trigger-card="true"
              className="group border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
            >
              <span className="text-xs font-bold text-bioaxis-dim">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-4 text-lg font-bold uppercase leading-tight text-bioaxis-text transition group-hover:text-bioaxis-accent">
                {trigger.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{trigger.body}</p>
              <span className="mt-5 inline-flex text-xs font-bold uppercase text-bioaxis-accent">{trigger.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
