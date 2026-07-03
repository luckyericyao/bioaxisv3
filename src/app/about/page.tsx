import type { Metadata } from "next";
import { CTAButton } from "@/components/ui/CTAButton";
import { CTASection } from "@/components/ui/CTASection";
import { PageHero } from "@/components/ui/PageHero";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "About BioAxis | Life Science Consumables Sourcing",
  description:
    "BioAxis turns life science consumables requests into structured sourcing paths for equivalents, samples, documentation, RFQs, and recurring supply review.",
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
        title="BioAxis turns consumables requests into sourcing paths."
        subtitle="BioAxis helps labs and procurement teams structure product context, compare equivalent criteria, request samples, organize documentation needs, and prepare RFQ-ready sourcing briefs without claiming automatic equivalence or unsupported certification status."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/request-quote?requestType=product-list-review&sourcePage=%2Fabout">
            Send product context
          </CTAButton>
          <CTAButton href="/equivalent-finder?sourcePage=%2Fabout" variant="secondary">
            Review equivalent
          </CTAButton>
        </div>
      </PageHero>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <SectionHeader
          title="What you can send"
          subtitle="A catalog reference, supplier line, product list, workflow note, or rough sourcing need is enough to start. BioAxis organizes it into the next procurement action."
        />
        <ProcessSteps
          steps={[
            { title: "Structure", body: "Turn product names, catalog references, supplier notes, and workflow requirements into quote-ready sourcing context." },
            { title: "Compare", body: "Review compatible options by format, material, sterility, packaging, documentation, and intended use." },
            { title: "Route", body: "Move the request into the right path: RFQ, equivalent review, sample request, documentation check, or recurring supply planning." }
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
            BioAxis helps teams prepare sourcing requests, compare equivalent candidates, request samples before switching, organize documentation requirements, and plan recurring supply conversations. The platform is built for procurement clarity without unsupported inventory counts, price guarantees, or final product-validation claims.
          </p>
        </article>
        <article className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <h2 className="text-2xl font-bold uppercase text-bioaxis-text">What BioAxis does not claim</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-bioaxis-muted">
            <li className="border-l border-bioaxis-accent/40 pl-3">BioAxis does not claim to manufacture every product it helps source.</li>
            <li className="border-l border-bioaxis-accent/40 pl-3">BioAxis does not guarantee that an alternative is the same product as a named brand.</li>
            <li className="border-l border-bioaxis-accent/40 pl-3">BioAxis does not claim FDA, GMP, ISO, or other certification status unless tied to a verified supplier or product document.</li>
            <li className="border-l border-bioaxis-accent/40 pl-3">BioAxis does not replace customer validation for the intended workflow.</li>
          </ul>
        </article>
      </section>

      <CTASection
        title="Start with what you already have."
        body="Send a product name, catalog reference, supplier line, product list, or workflow note. BioAxis will organize the next sourcing step: quote request, equivalent review, sample evaluation, documentation request, or recurring supply support."
        primaryLabel="Send product context"
        primaryHref="/request-quote?requestType=product-list-review&sourcePage=%2Fabout"
        secondaryLabel="Review equivalent"
        secondaryHref="/equivalent-finder?sourcePage=%2Fabout"
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
          <li key={item} className="border-l border-bioaxis-accent/40 pl-3">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
