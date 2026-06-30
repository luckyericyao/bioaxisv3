import Link from "next/link";
import { brand } from "@/data/brand";
import { footerNavigationItems } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-[#111827]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <Link href="/" className="text-lg font-bold uppercase text-white transition hover:text-bioaxis-ice">
            {brand.name.toUpperCase()}
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
            BioAxis is a one-stop consumables sourcing support platform for product lists, equivalent review,
            sample requests, supplier documents, RFQ preparation, recurring supply, and private-label/OEM
            discussions.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
          {footerNavigationItems.map((item) => (
            <Link key={item.label} href={item.href} className="uppercase text-slate-400 transition hover:text-bioaxis-ice">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
