import Link from "next/link";

const actions = [
  {
    label: "Start RFQ",
    href: "/request-quote?type=product-list&requestType=product-list-review",
    primary: true
  },
  {
    label: "Find equivalent",
    href: "/equivalent-finder?sourcePage=resource-guide",
    primary: false
  },
  {
    label: "Request documents",
    href: "/request-quote?type=documentation&requestType=documentation",
    primary: false
  }
];

export function ResourceConversionCTA() {
  return (
    <section className="mt-12 border border-bioaxis-line bg-bioaxis-panel p-6">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Sourcing next step</p>
      <h2 className="mt-3 text-2xl font-bold uppercase text-bioaxis-text">Need help sourcing this product type?</h2>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">
        Paste your current supplier SKU or product list and BioAxis will help structure equivalent options, documents, samples, and quote next steps.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={[
              "inline-flex min-h-11 items-center justify-center border px-4 text-xs font-semibold uppercase transition",
              action.primary
                ? "border-bioaxis-accent bg-bioaxis-accent text-bioaxis-black hover:bg-transparent hover:text-bioaxis-accent"
                : "border-bioaxis-line text-bioaxis-steel hover:border-bioaxis-accent hover:text-bioaxis-accent"
            ].join(" ")}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
