type ComparisonTableProps = {
  rows: {
    label: string;
    value: string;
  }[];
};

export function ComparisonTable({ rows }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden border border-bioaxis-line">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-3 border-b border-bioaxis-line bg-bioaxis-panel p-4 last:border-b-0 md:grid-cols-[220px_1fr]">
          <p className="text-sm font-semibold uppercase text-bioaxis-steel">{row.label}</p>
          <p className="text-sm leading-6 text-bioaxis-muted">{row.value}</p>
        </div>
      ))}
    </div>
  );
}

