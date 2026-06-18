import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/CTAButton";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "About BioAxis | Life Science Consumables Sourcing",
  description:
    "BioAxis helps labs and procurement teams source life science consumables, compare equivalent options, request samples, and organize supplier documentation.",
  alternates: {
    canonical: "/about"
  }
};

const serve = [
  "Biotech research and platform teams",
  "Pharma discovery, translational, and QC-adjacent labs",
  "Academic research groups and core facilities",
  "Lab managers and procurement teams",
  "Scientists evaluating supplier alternatives"
];

const hardProblems = [
  "Catalog naming varies across suppliers, even for similar formats.",
  "Equivalent review requires more than a product title or pack size.",
  "Sterility, nuclease-free, endotoxin, material, and lot needs can change by workflow.",
  "Sample testing is often needed before switching critical consumables.",
  "Recurring supply planning needs usage, documentation, lead-time, and packaging context."
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About BioAxis"
        title="One stop for life science consumables sourcing."
        subtitle="BioAxis helps labs and procurement teams source life science consumables, compare compatible options, request samples, organize documentation, and support recurring supply needs without claiming automatic equivalence or unsupported certification status."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/request-quote">Request Quote</CTAButton>
          <CTAButton href="/equivalent-finder" variant="secondary">
            Equivalent Finder
          </CTAButton>
        </div>
      </PageHero>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <SectionHeader
          title="What BioAxis does"
          subtitle="BioAxis is a sourcing platform for research consumables. The work starts with product context: category, current supplier, catalog number, specifications, documents, sample needs, quantity, and timeline."
        />
        <ProcessSteps
          steps={[
            { title: "Organize", body: "Turn product names, catalog numbers, supplier notes, and workflow requirements into quote-ready sourcing context." },
            { title: "Review", body: "Compare compatible options by format, material, sterility, packaging, documentation, and intended use." },
            { title: "Support", body: "Coordinate quote, sample, documentation, and recurring supply requests with clearer procurement inputs." }
          ]}
        />
      </section>

      <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
          <InfoPanel title="Who we serve" items={serve} />
          <InfoPanel title="Why consumables sourcing is hard" items={hardProblems} />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
        <article className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">How BioAxis helps</h2>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
            BioAxis helps teams prepare sourcing requests, compare equivalent candidates, request samples before switching, organize documentation requests, and plan recurring supply conversations. The platform is built for procurement clarity, not fake inventory counts or unsupported product claims.
          </p>
        </article>
        <article className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">What BioAxis does not claim</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-bioaxis-muted">
            <li>- BioAxis does not claim to manufacture every product it helps source.</li>
            <li>- BioAxis does not guarantee that an alternative is the same product as a named brand.</li>
            <li>- BioAxis does not claim FDA, GMP, ISO, or other certification status unless tied to a verified supplier or product document.</li>
            <li>- BioAxis does not replace customer validation for the intended workflow.</li>
          </ul>
        </article>
      </section>

      <CTASection
        title="Start with a product, supplier, catalog number, or workflow."
        body="BioAxis can help organize the next sourcing step: quote request, equivalent review, sample evaluation, documentation request, or recurring supply support."
        primaryLabel="Request Quote"
        primaryHref="/request-quote"
        secondaryLabel="Equivalent Finder"
        secondaryHref="/equivalent-finder"
      />
    </>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{title}</h2>
      <ul className="mt-5 grid gap-3 text-sm leading-6 text-bioaxis-muted">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </article>
  );
}
