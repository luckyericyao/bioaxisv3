import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const buyerTriggers = [
  {
    title: "Out of stock",
    body: "Check Ready Supply paths when lead time, allocation, or availability blocks purchasing.",
    href: "/ready-supply",
    cta: "Check ready supply"
  },
  {
    title: "Need an equivalent",
    body: "Compare format, material, sterility, packaging, workflow fit, and automation constraints before switching.",
    href: "/equivalent-finder?need=compatible-equivalent",
    cta: "Find equivalent"
  },
  {
    title: "Documents required",
    body: "Organize CoA, SDS, sterility, material, lot-level, and supplier specification requirements.",
    href: "/request-quote?requestType=documentation&need=documents",
    cta: "Request documents"
  },
  {
    title: "Recurring demand",
    body: "Review MOQ, packaging, lead time, backup sources, and private-label / OEM options for repeat usage.",
    href: "/request-quote?requestType=recurring-supply&need=recurring-supply",
    cta: "Send product list"
  }
];

export function BuyerTriggerSection() {
  return (
    <section className="border-b border-bioaxis-line bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="max-w-4xl">
          <SectionHeader
            title="Route every consumables request into the right sourcing path."
            subtitle="From urgent replacement to equivalent review, samples, documentation, RFQ, and recurring supply planning — BioAxis structures the next step."
          />
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {buyerTriggers.map((trigger, index) => (
            <Link
              key={trigger.title}
              href={trigger.href}
              data-buyer-trigger-card="true"
              className={[
                "group border bg-white/[0.78] p-5 shadow-[0_18px_55px_rgba(15,76,129,0.09)] backdrop-blur transition hover:bg-white",
                trigger.title.includes("Documents") ? "border-bioaxis-trust/30 hover:border-bioaxis-trust" : "border-white/70 hover:border-bioaxis-ice"
              ].join(" ")}
            >
              <span className="text-xs font-bold text-bioaxis-dim">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-4 text-lg font-bold uppercase leading-tight text-bioaxis-text transition group-hover:text-bioaxis-accent">
                {trigger.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{trigger.body}</p>
              <span className={["mt-5 inline-flex text-xs font-bold uppercase", trigger.title.includes("Documents") ? "text-bioaxis-trust" : "text-bioaxis-accent"].join(" ")}>{trigger.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
