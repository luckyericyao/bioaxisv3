type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left"
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      {eyebrow ? <p className="mb-4 text-sm font-semibold uppercase text-bioaxis-muted">{eyebrow}</p> : null}
      <h2 className="text-3xl font-bold uppercase leading-tight text-bioaxis-text sm:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-5 text-base leading-7 text-bioaxis-muted sm:text-lg">{subtitle}</p> : null}
    </div>
  );
}

