type CapabilityChipProps = {
  children: string;
};

export function CapabilityChip({ children }: CapabilityChipProps) {
  return (
    <span className="inline-flex min-h-9 items-center border border-bioaxis-line bg-bioaxis-panel px-4 text-sm font-semibold uppercase text-bioaxis-steel">
      {children}
    </span>
  );
}

