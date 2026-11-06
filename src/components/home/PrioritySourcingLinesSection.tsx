import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import photoCredits from "../../../public/images/redesign/attribution.json";

function photograph(id: string) {
  const asset = photoCredits.assets.find((image) => image.id === id);
  if (!asset) throw new Error(`Missing category photograph: ${id}`);
  return { src: asset.path, alt: asset.alt };
}

const priorityLines = [
  { title: "Liquid handling", description: "Tips & pipettes", href: "/products/liquid-handling", image: photograph("liquid-handling") },
  { title: "Cell culture", description: "Culture vessels", href: "/products/cell-culture", image: photograph("cell-culture") },
  { title: "Filtration", description: "Filters & prep", href: "/products/sample-prep-filtration", image: photograph("filtration") },
  { title: "Tubes, plates & storage", description: "Sample storage", href: "/products/lab-plasticware", image: photograph("tubes-storage") },
  { title: "PCR / qPCR", description: "Plates & tubes", href: "/products/molecular-biology-pcr", image: photograph("pcr") }
];

export function PrioritySourcingLinesSection() {
  return (
    <section className="section-space bg-bioaxis-panelSoft" aria-labelledby="home-products-title">
      <div className="page-container">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="home-products-title">Products</h2>
          <Link href="/products" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-bioaxis-accent">View all<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
        <div className="mt-6 grid gap-x-8 md:grid-cols-2 xl:grid-cols-3">
          {priorityLines.map((line) => (
            <Link key={line.title} href={line.href} data-home-product-entry="true" className="group grid min-w-0 grid-cols-[96px_minmax(0,1fr)_16px] items-center gap-4 border-b border-bioaxis-line py-5 transition hover:text-bioaxis-accent">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white">
                <Image src={line.image.src} alt={line.image.alt} fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0"><h3>{line.title}</h3><p className="mt-1 text-bioaxis-muted">{line.description}</p></div>
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
