import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Contact BioAxis | Consumables Sourcing Requests",
  description:
    "Contact BioAxis for quotes, equivalent product matching, sample evaluation, documentation requests, and recurring life science consumables supply support.",
  alternates: {
    canonical: "/contact"
  }
};

const contactPaths = [
  { title: "For quotes", body: "Send product category, product name, quantity, sterile status, target date, and any current supplier or catalog number." },
  { title: "For equivalent product matching", body: "Include the current supplier, catalog number, required specifications, documentation constraints, and whether sample testing is needed." },
  { title: "For sample evaluation", body: "Share the workflow, acceptance criteria, quantity needed for testing, and timeline for switching or scale-up." },
  { title: "For documentation requests", body: "List the documents needed, such as CoA, SDS, sterility statement, DNase/RNase-free statement, material declaration, or lot traceability." },
  { title: "For recurring supply support", body: "Provide monthly or annual usage, shipping region, packaging preference, documentation requirements, and timing constraints." }
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact BioAxis"
        title="Send a sourcing question or product request."
        subtitle="Use this page for quote requests, equivalent product matching, sample evaluation, documentation requests, and recurring supply support. BioAxis routes contact requests through the same sourcing request backend as the RFQ flow."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <SectionHeader
            title="What to include"
            subtitle="A clear request helps BioAxis organize sourcing review faster and reduces back-and-forth around product fit, documentation, samples, and recurring supply context."
          />
          <div className="mt-8 grid gap-4">
            {contactPaths.map((item) => (
              <article key={item.title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
                <h2 className="text-lg font-bold uppercase text-bioaxis-text">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
