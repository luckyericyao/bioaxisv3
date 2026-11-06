import Link from "next/link";
import { brand } from "@/data/brand";
import { footerNavigationGroups } from "@/data/navigation";
import photoCredits from "../../../public/images/redesign/attribution.json";

export function Footer() {
  return (
    <footer className="border-t border-bioaxis-line bg-bioaxis-panelSoft">
      <div className="page-container py-12">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center text-lg font-semibold text-bioaxis-text">
            {brand.name}
          </Link>
          <p className="mt-4 max-w-md text-base leading-6 text-bioaxis-muted">
            Life science consumables sourcing, equivalent review, samples and supplier documentation.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="mt-10 grid gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {footerNavigationGroups.map((group) => <section key={group.label} aria-label={group.label}>
            <h2 className="text-base font-medium text-bioaxis-text">{group.label}</h2>
            <ul className="mt-3">{group.items.map((item) => <li key={item.href}>
              <Link href={item.href} className="inline-flex min-h-11 items-center text-bioaxis-muted transition hover:text-bioaxis-accent">{item.label}</Link>
            </li>)}</ul>
          </section>)}
        </nav>
      </div>
      <details className="page-container pb-8 text-sm text-bioaxis-muted">
        <summary className="min-h-11 cursor-pointer py-3">Image credits</summary>
        <p className="max-w-3xl">Reference photographs illustrate consumable types, not BioAxis inventory, facilities or supplier relationships.</p>
        <p className="mt-3 max-w-3xl">The brand opening and filtered-tip rack also use generated illustrations. These are visual representations, not photographs or evidence of a supplier product, specifications, packaging or available stock.</p>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {photoCredits.assets.map((photo) => <li key={photo.id}>
            <a href={photo.sourceUrl} className="underline">{photo.title}</a>{" by "}
            <a href={photo.authorUrl} className="underline">{photo.author}</a>{". "}
            <a href={photo.licenseUrl} className="underline">{photo.license}</a>{". "}
            {photo.sourceCredit.includes("Fotoedukacja") ? "In cooperation with Fotoedukacja. " : ""}
            {photo.changes}
          </li>)}
        </ul>
      </details>
    </footer>
  );
}
