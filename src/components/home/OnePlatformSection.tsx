import { CapabilityChip } from "@/components/ui/CapabilityChip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { brand } from "@/data/brand";

const capabilities = ["Products", "Suppliers", "Equivalent Finder", "Samples", "Quotes", "Quality"];

export function OnePlatformSection() {
  return (
    <section id="support" className="border-y border-bioaxis-line bg-bioaxis-panel/60">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-10">
        <SectionHeader title="ONE PLATFORM. EVERY LAB. EVERY WORKFLOW." subtitle={brand.platformBody} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {capabilities.map((capability) => (
            <CapabilityChip key={capability}>{capability}</CapabilityChip>
          ))}
        </div>
      </div>
    </section>
  );
}
