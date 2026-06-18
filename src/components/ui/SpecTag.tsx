type SpecTagProps = {
  children: string;
};

export function SpecTag({ children }: SpecTagProps) {
  return <span className="border border-white/[0.12] bg-white/[0.03] px-3 py-1 text-xs text-bioaxis-muted">{children}</span>;
}

