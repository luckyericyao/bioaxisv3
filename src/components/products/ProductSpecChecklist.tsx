import type { ProductSpecChecklistItem } from "@/data/priorityProductContent";

type ProductSpecChecklistProps = {
  items: ProductSpecChecklistItem[];
};

export function ProductSpecChecklist({ items }: ProductSpecChecklistProps) {
  return (
    <section className="overflow-hidden border border-bioaxis-line bg-bioaxis-panel">
      <div className="border-b border-bioaxis-line p-5">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Specification checklist</h2>
        <p className="mt-3 text-sm leading-6 text-bioaxis-muted">
          Use these fields to make sourcing, equivalent review, sample evaluation, and documentation requests more precise.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[820px] w-full border-collapse text-left">
          <thead className="bg-bioaxis-black text-xs uppercase text-bioaxis-dim">
            <tr>
              <th className="border-b border-bioaxis-line px-4 py-3">Specification</th>
              <th className="border-b border-bioaxis-line px-4 py-3">Why it matters</th>
              <th className="border-b border-bioaxis-line px-4 py-3">Example values</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.specification} className="border-b border-bioaxis-line last:border-b-0">
                <td className="px-4 py-4 align-top text-sm font-semibold text-bioaxis-text">{item.specification}</td>
                <td className="px-4 py-4 align-top text-sm leading-6 text-bioaxis-muted">{item.whyItMatters}</td>
                <td className="px-4 py-4 align-top text-sm leading-6 text-bioaxis-muted">{item.exampleValues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
