import { CTAButton } from "./CTAButton";

type CTASectionProps = {
  eyebrow?: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CTASection({
  eyebrow,
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref
}: CTASectionProps) {
  return (
    <section className="border-y border-bioaxis-line bg-bioaxis-panel/60">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
        <div>
          {eyebrow ? <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-accent">{eyebrow}</p> : null}
          <h2 className="max-w-4xl text-3xl font-bold uppercase text-bioaxis-text sm:text-5xl">{title}</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-bioaxis-muted">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CTAButton href={primaryHref}>{primaryLabel}</CTAButton>
          {secondaryLabel && secondaryHref ? (
            <CTAButton href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </CTAButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}

