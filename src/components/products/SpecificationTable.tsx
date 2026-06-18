type SpecificationTableProps = {
  title?: string;
  specifications: string[];
  criteria?: string[];
};

export function SpecificationTable({ title = "Selection criteria", specifications, criteria = [] }: SpecificationTableProps) {
  const rows = specifications.map((specification, index) => ({
    specification,
    criterion: criteria[index] ?? "Confirm against the current product, method, or workflow before switching."
  }));

  return (
    <section className="overflow-hidden border border-bioaxis-line bg-bioaxis-panel">
      <div className="border-b border-bioaxis-line p-5">
        <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse text-left">
          <thead className="bg-bioaxis-black text-xs uppercase text-bioaxis-dim">
            <tr>
              <th className="border-b border-bioaxis-line px-4 py-3">Specification</th>
              <th className="border-b border-bioaxis-line px-4 py-3">Buyer check</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.specification} className="border-b border-bioaxis-line last:border-b-0">
                <td className="px-4 py-4 align-top text-sm font-semibold text-bioaxis-text">{row.specification}</td>
                <td className="px-4 py-4 align-top text-sm leading-6 text-bioaxis-muted">{row.criterion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
