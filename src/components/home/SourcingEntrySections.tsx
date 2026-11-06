import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const tasks = [
  { title: "Find consumables", body: "Browse product lines or search a name, catalog reference or requirement.", href: "/products", action: "Explore products" },
  { title: "Review an alternative", body: "Compare format, workflow fit, documents and sample needs before switching.", href: "/equivalent-finder", action: "Review equivalents" },
  { title: "Plan recurring supply", body: "Discuss repeat demand, packaging and private-label or OEM requirements.", href: "/private-label-oem", action: "Discuss supply options" }
];

export function SourcingValueSection() {
  return <section id="sourcing-value" className="section-space bg-bioaxis-panelSoft" aria-labelledby="sourcing-value-title">
    <div className="page-container grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <h2 id="sourcing-value-title">From a product reference to a sourcing path.</h2>
      <div><p className="text-bioaxis-muted">Share a reference or requirement. Review options, documents and next steps.</p>
        <p className="mt-4 max-w-xl text-bioaxis-muted">For labs and procurement teams, BioAxis organizes product context, equivalent criteria and sample needs into a quote-ready request.</p>
        <Link href="/request-quote?requestType=product-list-review&sourcePage=homepage-value" className="mt-5 inline-flex min-h-11 items-center gap-2 font-medium text-bioaxis-accent">Send a product list<ArrowRight aria-hidden="true" size={18} /></Link>
      </div>
    </div>
  </section>;
}

export function SourcingTaskSection() {
  return <section className="section-space" aria-labelledby="home-task-title">
    <div className="page-container">
      <h2 id="home-task-title">Choose your next step.</h2>
      <div className="mt-8 grid gap-8 md:grid-cols-3">{tasks.map((task) => <Link href={task.href} key={task.href} className="group border-t border-bioaxis-line pt-6">
        <h3>{task.title}</h3><p className="mt-3 text-bioaxis-muted">{task.body}</p>
        <span className="mt-5 inline-flex min-h-11 items-center gap-2 font-medium text-bioaxis-accent">{task.action}<ArrowUpRight aria-hidden="true" size={18} /></span>
      </Link>)}</div>
    </div>
  </section>;
}
