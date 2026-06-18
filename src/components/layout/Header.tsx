import Link from "next/link";
import { brand } from "@/data/brand";
import { navigationItems } from "@/data/navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bioaxis-black/[0.88] backdrop-blur-md">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-base font-bold uppercase text-bioaxis-text transition hover:text-bioaxis-accent"
          aria-label="BioAxis home"
        >
          {brand.name.toUpperCase()}
        </Link>

        <nav aria-label="Primary navigation" className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-2 py-2 text-xs font-semibold uppercase text-bioaxis-muted transition hover:text-bioaxis-text sm:px-3"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
