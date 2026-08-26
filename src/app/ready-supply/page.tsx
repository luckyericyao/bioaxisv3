import type { Metadata } from "next";
import { CompactSourcingIntake } from "@/components/forms/CompactSourcingIntake";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { readySupplyEvidenceRows, selectedLineRegistry, selectedLineRegistryNote } from "@/data/readySupplyEvidence";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Availability Check | BioAxis",
  description:
    "Request supplier-backed availability, documentation, dispatch timing, sample options, and recurring supply review for life science consumables.",
  path: "/ready-supply"
});

const operationCards = [
  {
    title: "Current status",
    body: "Availability and dispatch timing are checked against current supplier evidence for each request."
  },
  {
    title: "Supplier confirmation",
    body: "BioAxis coordinates the check; no public warehouse or live-inventory status is claimed."
  },
  {
    title: "Evidence requested",
    body: "Review can include specifications, batch evidence, documentation, sample options, and repeat-use requirements."
  },
  {
    title: "Recurring planning",
    body: "For recurring demand, BioAxis can organize usage, packaging, timing, and backup-source requirements for supplier review."
  }
];

const readySupplySteps = [
  {
    title: "Submit the current requirement",
    body: "Send the SKU, supplier line, specification, quantity, shipping region, and timing you know."
  },
  {
    title: "Check current evidence",
    body: "BioAxis requests current supplier availability, dispatch timing, documentation, and sample information."
  },
  {
    title: "Quality and documentation review",
    body: "Specification, sterility, CoA, and other supplier documents can be requested and reviewed before order confirmation."
  },
  {
    title: "Return a sourcing response",
    body: "The response separates what was confirmed, when it was checked, what remains unknown, and what the buyer must review."
  }
];

export default function ReadySupplyPage() {
  return (
    <>
      <section className="border-b border-bioaxis-line px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(400px,0.82fr)] lg:items-start">
          <div className="order-1 lg:order-1">
            <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">Availability check</p>
            <h1 className="max-w-5xl text-4xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-5xl lg:text-5xl">
              Check current supply evidence before procurement.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-bioaxis-muted sm:text-lg">
              Send a current SKU, supplier line, specification, quantity, and timing requirement for a request-level availability review.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-bioaxis-muted sm:text-base">
              BioAxis coordinates supplier status, documentation, sample, dispatch, and recurring-supply questions without presenting an unverified inventory promise.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-bioaxis-muted">
              Built for labs, distributors, and procurement teams that need a traceable answer to what is confirmed now and what remains supplier-dependent.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&intent=availability-check">
                Request availability check
              </CTAButton>
              <CTAButton
                href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&intent=current-sku"
                variant="secondary"
              >
                Send current SKU
              </CTAButton>
            </div>
          </div>

          <div className="order-2 grid gap-3 lg:order-2">
            <aside className="border border-bioaxis-line bg-bioaxis-black p-4">
              <p className="text-xs font-bold uppercase text-bioaxis-accent">BioAxis availability check</p>
              <p className="mt-2 text-xs leading-5 text-bioaxis-muted">
                Selected-line status is confirmed per request, not shown as public live inventory.
              </p>
              <dl className="mt-4 grid gap-2">
                {[
                  ["Supply mode", "Supplier-coordinated; confirm per request"],
                  ["Availability", "No public live inventory; current check required"],
                  ["Documents", "CoA / sterility / compliance check where available"],
                  ["Replenishment", "Usage, packaging, and backup source reviewed per request"]
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 border-t border-white/[0.12] pt-2 sm:grid-cols-[0.38fr_0.62fr] sm:gap-3">
                    <dt className="text-[0.68rem] font-bold uppercase text-bioaxis-dim">{label}</dt>
                    <dd className="text-xs leading-5 text-bioaxis-steel">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
            <details className="border border-bioaxis-line bg-white shadow-[0_18px_55px_rgba(15,76,129,0.08)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-bold uppercase text-bioaxis-text outline-none transition hover:bg-bioaxis-panelSoft focus-visible:ring-2 focus-visible:ring-bioaxis-accent [&::-webkit-details-marker]:hidden">
                <span>Open availability request</span>
                <span className="text-xs font-semibold text-bioaxis-accent">Email only to start · +</span>
              </summary>
              <div className="border-t border-bioaxis-line p-4 sm:p-5">
                <CompactSourcingIntake
                  requestType="quote"
                  sourcePage="/ready-supply"
                  title="Send the current supply need."
                  productFieldLabel="SKU, catalog number, supplier line, or product list"
                  submitLabel="Request availability"
                />
              </div>
            </details>
          </div>
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
            title="How the availability check works"
            subtitle="The service structures a current supplier check and evidence trail; it does not imply warehouse ownership, live inventory, guaranteed lead time, or product suitability."
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
          <p className="text-sm font-semibold uppercase text-bioaxis-accent">Typical request coverage</p>
          <p className="mt-4 max-w-4xl text-base leading-7 text-bioaxis-muted">
            Availability requests can cover pipette tips, PCR plastics, tubes, plates, filtration, cell culture consumables, and private-label sourcing discussions.
          </p>
          <p className="mt-6 max-w-4xl text-sm leading-6 text-bioaxis-muted">
            This page is not a real-time inventory feed. Availability, batch information, documents, dispatch timing, and replenishment options are supplier-coordinated and confirmed per request. BioAxis organizes the review but does not certify final suitability.
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-bioaxis-muted">
            A document package may include CoA, SDS, sterility certificate, material statement, lot-level documentation, and a supplier specification sheet where available. BioAxis can request and organize these records; the buyer remains responsible for technical and compliance review.
          </p>
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            title="What is confirmed per request"
            subtitle="The status, evidence date, sample path, supply owner, and buyer responsibility are clarified for each request; no line is presented as currently available without a published record."
          />
          <p className="mt-5 border border-bioaxis-line bg-bioaxis-black p-4 text-sm leading-6 text-bioaxis-muted">
            {selectedLineRegistry.length > 0 ? "Selected-line registry records are shown below." : selectedLineRegistryNote}
          </p>
          {selectedLineRegistry.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {selectedLineRegistry.map((record) => (
                <article key={record.line} className="border border-bioaxis-line bg-bioaxis-black p-5">
                  <h3 className="text-sm font-bold uppercase text-bioaxis-text">{record.line}</h3>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Supply mode", record.supplyMode],
                      ["Confirmation owner", record.confirmationOwner],
                      ["Last confirmed", record.lastConfirmed],
                      ["Documents", record.documents.join(", ")],
                      ["Sample path", record.samplePath],
                      ["Buyer responsibility", record.buyerResponsibility]
                    ].map(([label, value]) => (
                      <div key={label} className="border border-white/[0.1] bg-bioaxis-panel px-3 py-2">
                        <dt className="text-[11px] font-bold uppercase text-bioaxis-dim">{label}</dt>
                        <dd className="mt-1 text-sm leading-5 text-bioaxis-steel">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          ) : null}
          <div className="mt-8 grid gap-3">
            {readySupplyEvidenceRows.map((row) => (
              <article key={row.label} className="grid gap-3 border border-bioaxis-line bg-bioaxis-black p-4 sm:grid-cols-[0.7fr_1fr_1fr_1fr] sm:items-start">
                <p className="text-xs font-bold uppercase text-bioaxis-accent">{row.label}</p>
                <p className="text-sm leading-6 text-bioaxis-text">{row.status}</p>
                <p className="text-sm leading-6 text-bioaxis-steel">{row.confirmation}</p>
                <p className="text-sm leading-6 text-bioaxis-muted">{row.boundary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">Availability request</p>
            <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">
              Need a current answer on availability and dispatch?
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">
              Send the current SKU, brand, specification, quantity, region, or estimated demand. BioAxis will coordinate a current availability, document, sample, dispatch, and replenishment check.
            </p>
          </div>
          <CTAButton href="/request-quote?requestType=quote&sourcePage=ready-supply&source=ready-supply&intent=availability-check">
            Request availability check
          </CTAButton>
        </div>
      </section>
    </>
  );
}
