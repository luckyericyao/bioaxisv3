type SpecTagProps = {
  children: string;
};

export function SpecTag({ children }: SpecTagProps) {
  return <span className="border border-bioaxis-line bg-white/[0.72] px-3 py-1 text-xs text-bioaxis-muted shadow-sm">{children}</span>;
}
