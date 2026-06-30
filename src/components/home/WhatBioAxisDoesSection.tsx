import Image from "next/image";
import { pageVisuals } from "@/data/visualAssets";

const cards = [
  {
    title: "Matched product family",
    body: "BioAxis maps each item to the right segment, category, product family, and sourcing template."
  },
  {
    title: "Equivalent options",
    body: "BioAxis structures fit criteria including format, material, sterility, packaging, workflow use, and automation compatibility."
  },
  {
    title: "Samples and documents",
    body: "BioAxis identifies sample needs and required supplier documents before switching or purchasing."
  },
  {
    title: "Quote-ready sourcing brief",
    body: "BioAxis organizes supplier, SKU, quantity, timeline, documentation, and recurring usage context for follow-up."
  }
];

export function WhatBioAxisDoesSection() {
  return (
    <section className="bg-[#111827] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-ice">Structured sourcing output</p>
          <h2 className="text-3xl font-bold uppercase leading-tight text-white sm:text-5xl">From product list to sourcing action</h2>
          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
            A messy SKU, catalog number, or product list becomes a structured sourcing path your team can act on.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div className="relative min-h-[260px] overflow-hidden border border-white/10 bg-slate-950/40 shadow-2xl shadow-black/20">
            <Image
              src={pageVisuals.structuredSourcingOutput.src}
              alt={pageVisuals.structuredSourcingOutput.alt}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover grayscale-[10%] saturate-[0.78]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.08)_0%,rgba(17,24,39,0.58)_100%)]" aria-hidden="true" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <article key={card.title} className="border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur transition hover:border-bioaxis-ice/70 hover:bg-white/[0.09]">
                <h3 className="text-xl font-bold uppercase text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
