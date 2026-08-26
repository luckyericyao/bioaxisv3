import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Services | BioAxis",
  description:
    "BioAxis sourcing workflows for product matching, equivalent review, sample coordination, documentation checks, RFQ preparation, and recurring supply planning.",
  alternates: {
    canonical: "/services"
  }
};

const services = [
  {
    title: "Product Matching",
    description: "Turn a product name, catalog reference, supplier line, or specification into the right sourcing path.",
    href: "/request-quote?requestType=product-list-review",
    cta: "Send product context"
  },
  {
    title: "Equivalent Review",
    description: "Compare current consumables against format, material, sterility, packaging, workflow fit, and sample needs.",
    href: "/equivalent-finder",
    cta: "Review equivalent"
  },
  {
    title: "Sample Coordination",
    description: "Prepare sample requests for products that need evaluation before switching or scaling.",
    href: "/request-quote?requestType=sample",
    cta: "Request sample"
  },
  {
    title: "Documentation Review",
    description: "Organize CoA, SDS, sterility, material, lot-level, and supplier specification requirements before purchasing.",
    href: "/request-quote?requestType=documentation",
    cta: "Request documents"
  },
  {
    title: "RFQ Preparation",
    description: "Turn product families, quantities, target dates, and documentation needs into sourcing-ready RFQs.",
    href: "/request-quote?requestType=quote",
    cta: "Prepare RFQ"
  },
  {
    title: "Recurring Supply Planning",
    description: "Share usage rhythm, quantities, and delivery timing for recurring sourcing support.",
    href: "/request-quote?requestType=recurring-supply",
    cta: "Review recurring demand"
  },
  {
    title: "Product List Review",
    description: "Submit a messy list for BioAxis to organize by family, equivalent path, documentation need, and RFQ fields.",
    href: "/request-quote?requestType=product-list-review",
    cta: "Send product list"
  },
  {
    title: "Automation Compatibility Review",
    description: "Review tips, plates, reservoirs, seals, tubes, and accessories against platform and deck requirements.",
    href: "/request-quote?requestType=equivalent&need=automation-compatible-format",
    cta: "Review automation fit"
  }
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Sourcing workflows your team can act on."
        subtitle="BioAxis structures consumables requests into product matching, equivalent review, sample coordination, documentation checks, RFQ preparation, and recurring supply planning."
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="border border-bioaxis-line bg-bioaxis-panel p-6">
              <h2 className="text-xl font-bold uppercase text-bioaxis-text">{service.title}</h2>
              <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{service.description}</p>
              <Link
                href={service.href}
                className="mt-6 inline-flex min-h-10 items-center justify-center border border-bioaxis-accent px-4 text-xs font-semibold uppercase text-bioaxis-accent transition hover:bg-bioaxis-accent hover:text-bioaxis-black"
              >
                {service.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
