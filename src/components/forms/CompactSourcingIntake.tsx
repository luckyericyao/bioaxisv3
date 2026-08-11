import { SourcingIntakeForm, type SourcingIntakeFormProps } from "./SourcingIntakeForm";

type CompactSourcingIntakeProps = Omit<SourcingIntakeFormProps, "compact"> & {
  className?: string;
};

export function CompactSourcingIntake({ className = "", ...props }: CompactSourcingIntakeProps) {
  return (
    <div
      data-sourcing-intake="compact"
      className={["w-full", className].filter(Boolean).join(" ")}
    >
      <SourcingIntakeForm {...props} compact />
    </div>
  );
}
