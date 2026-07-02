import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Ready Supply | BioAxis",
  description:
    "Warehouse-backed lab consumables with faster dispatch, stable quality, reliable replenishment, and ready-stock availability review.",
  alternates: {
    canonical: "/ready-supply"
  }
};

const statusRows = [
  ["Warehouse inventory", "Available for selected lines"],
  ["Dispatch coordination", "Faster response path"],
  ["Quality consistency", "Stable batch control"],
  ["Documentation", "COA / sterility / compliance check"],
  ["Replenishment", "Repeat supply planning"]
];

const operationCards = [
  {
    title: "Fast dispatch",
    body: "Selected ready-stock lines can be checked and prepared faster than standard sourcing requests."
  },
  {
    title: "BioAxis warehouse",
    body: "Priority consumables are supported by BioAxis-controlled warehouse inventory and supplier coordination."
  },
  {
    title: "Stable quality",
    body: "Products are selected around consistent specifications, batch traceability, and repeat-use reliability."
  },
  {
    title: "Reliable replenishment",
    body: "For recurring demand, BioAxis can support repeat purchasing, planned replenishment, and supply continuity."
  }
];

const readySupplySteps = [
  {
    title: "Stocked / controlled supply",
    body: "BioAxis maintains selected consumable lines through warehouse-backed or tightly coordinated supply."
  },
  {
    title: "Fast availability check",
    body: "Send a SKU, brand, specification, or quantity requirement. We confirm availability and dispatch path."
  },
  {
    title: "Quality and documentation review",
    body: "Batch, specification, sterility, COA, and compliance documents can be checked before order confirmation."
  },
  {
    title: "Dispatch and replenishment",
    body: "For qualified demand, BioAxis supports fast shipment and recurring supply planning."
  }
];

const coverageItems = [
  "Pipette tips",
  "PCR plastics",
  "Tubes",
  "Plates",
  "Filtration",
  "Cell culture consumables",
  "Selected private-label lines"
];

export default function ReadySupplyPage() {
  return (
    <>
      <section className="border-b border-bioaxis-line px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.8fr)] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">Ready Supply</p>
            <h1 className="max-w-5xl text-4xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-6xl lg:text-7xl">
              Warehouse-backed consumables for faster lab procurement.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-bioaxis-muted sm:text-lg">
              Selected lab consumables supported by BioAxis warehouse inventory, stable quality control, and faster dispatch coordination.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-bioaxis-muted">
              Built for labs, distributors, and procurement teams that need reliable supply without repeated sourcing delays.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&intent=ready-stock">
                Request ready-stock availability
              </CTAButton>
              <CTAButton
                href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&intent=current-sku"
                variant="secondary"
              >
                Send current SKU
              </CTAButton>
            </div>
          </div>

          <aside className="border border-bioaxis-line bg-bioaxis-black p-5 shadow-2xl shadow-slate-900/12">
            <div className="mb-5 border-b border-bioaxis-line pb-4">
              <p className="text-xs font-bold uppercase text-bioaxis-accent">BioAxis Ready Supply</p>
              <p className="mt-2 text-sm leading-6 text-bioaxis-muted">
                Operational status areas for warehouse-backed supply, documentation, and replenishment planning.
              </p>
            </div>
            <div className="grid gap-2">
              {statusRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-3 border border-white/[0.1] bg-bioaxis-panel px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <p className="text-sm font-bold uppercase leading-5 text-bioaxis-text">{label}</p>
                  <p className="text-xs font-semibold uppercase text-bioaxis-accent">{value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {operationCards.map((card) => (
            <article key={card.title} className="border border-bioaxis-line bg-bioaxis-panel p-6">
              <h2 className="text-base font-bold uppercase text-bioaxis-text">{card.title}</h2>
              <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
          <SectionHeader
            title="How Ready Supply Works"
            subtitle="Ready Supply is built around availability confirmation, stable quality, batch traceability, and practical replenishment planning."
          />
          <div className="grid gap-3">
            {readySupplySteps.map((step, index) => (
              <article
                key={step.title}
                className="grid gap-4 border border-bioaxis-line bg-bioaxis-black p-5 sm:grid-cols-[72px_1fr] sm:items-start"
              >
                <p className="text-xs font-bold uppercase text-bioaxis-accent">{String(index + 1).padStart(2, "0")}</p>
                <div>
                  <h2 className="text-base font-bold uppercase text-bioaxis-text">{step.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="border border-bioaxis-line bg-bioaxis-black p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Typical ready-supply coverage</p>
          <p className="mt-4 max-w-4xl text-base leading-7 text-bioaxis-muted">
            Typical ready-supply coverage includes pipette tips, PCR plastics, tubes, plates, filtration, cell culture consumables, and selected private-label lines.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {coverageItems.map((item) => (
              <li key={item} className="border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-4xl text-sm leading-6 text-bioaxis-muted">
            Availability is confirmed per request rather than shown as a public inventory feed.
          </p>
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">Ready Supply request</p>
            <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
              Need stable consumables with faster delivery?
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
              Send us your current SKU, brand, specification, or estimated demand. BioAxis will check ready-stock availability, quality documents, dispatch timing, and replenishment options.
            </p>
          </div>
          <CTAButton href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&intent=ready-stock">
            Request ready-stock availability
          </CTAButton>
        </div>
      </section>
    </>
  );
}
