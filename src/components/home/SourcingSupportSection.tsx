import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const evidencePaths = [
  { title: "Specification review", body: "Align the target format, material and workflow fit. Final specifications remain supplier-confirmed.", href: "/trust-center#document-package" },
  { title: "Supplier documents", body: "Request CoA, SDS, sterility, material or lot documents where relevant and available.", href: "/quality" },
  { title: "Sample-first evaluation", body: "Define what your team needs to assess before a switch or recurring purchase.", href: "/samples" }
];

const process = [
  { title: "Share the requirement", body: "A product name, current reference or rough product list is enough to begin." },
  { title: "Structure the review", body: "BioAxis organizes specifications, supplier questions, documents and sample needs." },
  { title: "Agree the next step", body: "Review a quote, a sample path or an alternative against your requirements." }
];

export function SourcingSupportSection() {
  return <>
    <section className="section-space border-t border-bioaxis-line" aria-labelledby="sourcing-support-title">
      <div className="page-container">
        <h2 id="sourcing-support-title">Evidence for the next decision.</h2>
        <p className="mt-4 max-w-2xl text-bioaxis-muted">Product specifications, supplier evidence and your own evaluation have different roles. Keep them connected without treating them as interchangeable.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {evidencePaths.map((path) => <Link key={path.href} href={path.href} className="group block border-t border-bioaxis-line pt-6">
            <h3 className="flex items-center justify-between gap-4">{path.title}<ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-bioaxis-accent" /></h3>
            <p className="mt-3 text-bioaxis-muted">{path.body}</p>
          </Link>)}
        </div>
      </div>
    </section>
    <section className="section-space border-y border-bioaxis-line bg-bioaxis-panelSoft">
      <div className="page-container">
        <h2>A clear path from request to review.</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">{process.map((step, index) => <li key={step.title}>
          <span className="font-medium text-bioaxis-accent">0{index + 1}</span><h3 className="mt-3">{step.title}</h3><p className="mt-3 text-bioaxis-muted">{step.body}</p>
        </li>)}</ol>
      </div>
    </section>
    <section className="section-space">
      <div className="page-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><h2>Bring your next sourcing request.</h2><p className="mt-4 max-w-xl text-bioaxis-muted">Send a reference, a product list or a requirement. BioAxis will help organize the review.</p></div>
        <div className="flex flex-wrap items-center gap-5"><Link href="/request-quote" className="action-primary">Request a quote<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link><Link href="/contact" className="inline-flex min-h-11 items-center font-medium text-bioaxis-accent underline underline-offset-4">Contact BioAxis</Link></div>
      </div>
    </section>
  </>;
}
