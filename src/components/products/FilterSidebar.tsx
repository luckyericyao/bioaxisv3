import type { ProductSubcategory } from "@/data/productTaxonomy";
import { FilterChip } from "./FilterChip";

type FilterSidebarProps = {
  subcategory: ProductSubcategory;
};

export function FilterSidebar({ subcategory }: FilterSidebarProps) {
  const filterGroups = [
    { title: "Product family", values: subcategory.featuredFamilies.map((family) => family.title) },
    { title: "Format", values: subcategory.formats },
    { title: "Sterility", values: ["sterile where required", "non-sterile where applicable", "documentation where available"] },
    { title: "Material", values: ["plastic", "membrane", "glass where applicable", "supplier material information"] },
    { title: "Application", values: subcategory.applications },
    { title: "Documentation", values: subcategory.documentationNeeds },
    { title: "Request type", values: subcategory.requestTypes }
  ];

  return (
    <aside className="border border-bioaxis-line bg-bioaxis-panel p-5">
      <h2 className="text-lg font-bold uppercase text-bioaxis-text">Filter sourcing options</h2>
      <p className="mt-3 text-xs leading-5 text-bioaxis-muted">
        Static taxonomy filters. BioAxis can connect these controls to live search when backend catalog data is added.
      </p>
      <div className="mt-6 grid gap-6">
        {filterGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">{group.title}</p>
            <div className="grid gap-2">
              {group.values.slice(0, 5).map((value) => (
                <FilterChip key={value} name={group.title} label={value} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
