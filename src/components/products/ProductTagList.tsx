type ProductTagListProps = {
  label: string;
  tags: string[];
  maxItems?: number;
};

export function ProductTagList({ label, tags, maxItems = tags.length }: ProductTagListProps) {
  const visibleTags = tags.slice(0, maxItems);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase text-bioaxis-dim">{label}</p>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <span key={tag} className="border border-white/[0.12] bg-white/[0.03] px-3 py-1 text-xs text-bioaxis-muted">
            {tag}
          </span>
        ))}
        {hiddenCount > 0 ? (
          <span className="border border-white/[0.12] px-3 py-1 text-xs uppercase text-bioaxis-dim">+{hiddenCount}</span>
        ) : null}
      </div>
    </div>
  );
}
