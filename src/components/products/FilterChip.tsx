type FilterChipProps = {
  label: string;
  name: string;
};

export function FilterChip({ label, name }: FilterChipProps) {
  return (
    <label className="flex min-h-10 items-start gap-2 border border-bioaxis-line bg-bioaxis-black px-3 py-2 text-xs leading-5 text-bioaxis-muted transition hover:border-bioaxis-accent hover:text-bioaxis-steel">
      <input type="checkbox" name={name} value={label} className="mt-1 accent-bioaxis-accent" />
      <span>{label}</span>
    </label>
  );
}
