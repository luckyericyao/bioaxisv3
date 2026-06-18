type ProductFamilyListProps = {
  families: string[];
  maxItems?: number;
};

export function ProductFamilyList({ families, maxItems = families.length }: ProductFamilyListProps) {
  const visibleFamilies = families.slice(0, maxItems);
  const hiddenCount = families.length - visibleFamilies.length;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">Product families</p>
      <ul className="grid gap-2 text-sm text-bioaxis-steel sm:grid-cols-2">
        {visibleFamilies.map((family) => (
          <li key={family} className="flex gap-2 leading-5">
            <span className="mt-2 h-1 w-1 shrink-0 bg-bioaxis-accent" aria-hidden="true" />
            <span>{family}</span>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 ? <p className="mt-3 text-xs uppercase text-bioaxis-dim">+{hiddenCount} more</p> : null}
    </div>
  );
}

