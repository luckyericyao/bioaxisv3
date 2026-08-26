import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Contact BioAxis | Consumables Sourcing Requests",
  description:
    "Contact BioAxis for quotes, equivalent product matching, sample evaluation, documentation requests, and recurring life science consumables supply support.",
  path: "/contact"
});

const contactPaths = [
  { title: "Current product or supplier line", body: "A name, catalog reference, supplier line, or rough description is enough to begin." },
  { title: "What you need next", body: "Quote, equivalent review, sample path, document check, recurring supply, or a general sourcing question." },
  { title: "Any constraints you know", body: "Format, sterility, material, workflow fit, documentation, timing, or shipping region if already known." },
  { title: "A messy product list", body: "Paste it as-is. BioAxis can help organize the sourcing path and follow up for missing details." }
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact BioAxis"
        title="Ask a sourcing question. Send what you have."
        subtitle="Only your email is required. BioAxis can route a rough product note, supplier line, catalog reference, product list, or workflow question into the right sourcing next step."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <SectionHeader
            title="Useful context, not required fields."
            subtitle="Send the question as-is. These details simply help BioAxis reduce back-and-forth around product fit, documentation, samples, and recurring supply context."
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
