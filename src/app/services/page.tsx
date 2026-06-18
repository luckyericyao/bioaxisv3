import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Services | BioAxis",
  description:
    "BioAxis service areas for product matching, equivalent sourcing, samples, documentation, quotes, recurring supply, product-list review, and automation compatibility.",
  alternates: {
    canonical: "/services"
  }
};

const services = [
  {
    title: "Product Matching",
    description: "Map a product name, supplier, catalog number, or specification to the right sourcing path.",
    href: "/support?topic=product-matching"
  },
  {
    title: "Equivalent Sourcing",
    description: "Review current products against compatible alternatives, critical specifications, and sample needs.",
    href: "/request-quote?inquiryType=equivalent"
  },
  {
    title: "Sample Coordination",
    description: "Prepare sample requests for products that need evaluation before switching or scaling.",
    href: "/request-quote?inquiryType=sample"
  },
  {
    title: "Documentation Support",
    description: "Organize CoA, SDS, sterility, material, and lot-level documentation requests where available.",
    href: "/support?topic=documentation"
  },
  {
    title: "Quote Preparation",
    description: "Turn product families, quantities, target dates, and documentation needs into sourcing-ready RFQs.",
    href: "/request-quote?inquiryType=quote"
  },
  {
    title: "Recurring Supply Planning",
    description: "Share usage rhythm, quantities, and delivery timing for recurring sourcing support.",
    href: "/request-quote?inquiryType=recurring"
  },
  {
    title: "Product List Review",
    description: "Submit a product list for BioAxis to organize by segment, family, equivalent path, and documentation need.",
    href: "/request-quote?inquiryType=product-list"
  },
  {
    title: "Automation Compatibility Review",
    description: "Review tips, plates, reservoirs, seals, tubes, and accessories against platform and deck requirements.",
    href: "/support?topic=automation-compatibility"
  }
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Sourcing support around the product taxonomy."
        subtitle="BioAxis is not a cart-first storefront. The service layer helps teams match equivalents, coordinate samples, prepare quotes, review documentation, and plan recurring supply."
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
                Open service
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
