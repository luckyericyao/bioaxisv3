import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const sourcingPaths = [
  {
    title: "Browse product universe",
    body: "Start with 12 product segments, then move into categories, families, and product items.",
    href: "/products"
  },
  {
    title: "Find equivalent",
    body: "Send a supplier, catalog number, product name, or spec so BioAxis can help compare options.",
    href: "/equivalent-finder?requestType=equivalent"
  },
  {
    title: "Paste product list",
    body: "Share a short list and BioAxis can organize it into quote-ready sourcing context.",
    href: "/request-quote?requestType=product-list-review"
  },
  {
    title: "Request sample/documentation",
    body: "Ask for evaluation samples, CoA, SDS, sterility, or other supplier-provided documents.",
    href: "/request-quote?requestType=sample"
  }
];

const buyerProblems = [
  "Out-of-stock items",
  "Price increases",
  "Equivalent needs",
  "Documentation needs",
  "Sample-before-switching",
  "Automation-compatible formats"
];

export function ProductDirectorySection() {
  return (
    <section id="sourcing-paths" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <SectionHeader
        title="Start from a sourcing path"
        subtitle="Pick the next decision. BioAxis can capture product context as you move deeper."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sourcingPaths.map((path) => (
          <Link
            key={path.title}
            href={path.href}
            className="group border border-bioaxis-line bg-bioaxis-panel p-5 transition hover:border-bioaxis-accent hover:bg-bioaxis-panelSoft"
          >
            <h2 className="text-lg font-bold uppercase text-bioaxis-text transition group-hover:text-bioaxis-accent">
              {path.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{path.body}</p>
            <span className="mt-5 inline-flex text-xs font-bold uppercase text-bioaxis-accent">
              Continue
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6 border border-bioaxis-line bg-bioaxis-panel p-4">
        <p className="text-xs font-bold uppercase text-bioaxis-accent">Common buyer triggers</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {buyerProblems.map((problem) => (
            <span key={problem} className="border border-white/[0.12] bg-bioaxis-black px-3 py-2 text-xs font-semibold uppercase text-bioaxis-steel">
              {problem}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
