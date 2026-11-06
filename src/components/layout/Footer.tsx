import Link from "next/link";
import { brand } from "@/data/brand";
import { footerNavigationItems } from "@/data/navigation";
import photoCredits from "../../../public/images/redesign/attribution.json";

export function Footer() {
  return (
    <footer className="border-t border-bioaxis-line bg-bioaxis-panelSoft">
      <div className="page-container grid gap-8 py-12 md:grid-cols-[1fr_auto]">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center text-lg font-semibold text-bioaxis-text">
            {brand.name}
          </Link>
          <p className="mt-4 max-w-md text-base leading-6 text-bioaxis-muted">
            Life science consumables sourcing, equivalent review, samples and supplier documentation.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
          {footerNavigationItems.map((item) => (
            <Link key={item.label} href={item.href} className="inline-flex min-h-11 items-center text-bioaxis-muted transition hover:text-bioaxis-accent">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <details className="page-container pb-8 text-sm text-bioaxis-muted">
        <summary className="min-h-11 cursor-pointer py-3">Image credits</summary>
        <p className="max-w-3xl">Reference photographs illustrate consumable types, not BioAxis inventory, facilities or supplier relationships.</p>
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
