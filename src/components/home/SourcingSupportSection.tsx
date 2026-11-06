import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const paths = [
  { title: "Availability check", body: "Review current supplier availability and timing for a specific requirement.", href: "/ready-supply" },
  { title: "Equivalent review", body: "Compare fit, documentation and sample needs before considering a switch.", href: "/equivalent-finder" },
  { title: "Private label / OEM", body: "Discuss packaging, specifications and recurring consumables demand.", href: "/private-label-oem" }
];

export function SourcingSupportSection() {
  return <>
    <section className="section-space border-t border-bioaxis-line" aria-labelledby="sourcing-support-title">
      <div className="page-container">
        <h2 id="sourcing-support-title">Sourcing support</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {paths.map((path) => <Link key={path.href} href={path.href} className="group block border-t border-bioaxis-line pt-6">
            <h3 className="flex items-center justify-between gap-4">{path.title}<ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-bioaxis-accent" /></h3>
            <p className="mt-3 text-bioaxis-muted">{path.body}</p>
          </Link>)}
        </div>
      </div>
    </section>
    <section className="section-space border-y border-bioaxis-line bg-bioaxis-panelSoft">
      <div className="page-container grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div><h2>Quality and documentation</h2><p className="mt-4 max-w-2xl text-bioaxis-muted">Request supplier documents and define sample review needs. Final suitability remains subject to your technical review.</p></div>
        <Link href="/trust-center" className="action-secondary">Explore quality &amp; trust<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
      </div>
    </section>
    <section className="section-space">
      <div className="page-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2>Tell us what you need.</h2><p className="mt-4 text-bioaxis-muted">Send a product reference, a list or a sourcing question.</p></div>
        <Link href="/contact" className="action-secondary">Contact BioAxis<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
      </div>
    </section>
  </>;
}
