import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: ReactNode;
  children?: ReactNode;
  compact?: boolean;
  tight?: boolean;
  mobileContentFirst?: boolean;
  align?: "start" | "end";
};

export function PageHero({ eyebrow, title, subtitle, children, compact = false, tight = false, mobileContentFirst = false, align = "end" }: PageHeroProps) {
  return (
    <section className={`border-b border-bioaxis-line ${tight ? "py-4 sm:py-6" : compact ? "py-8" : "section-space"}`}>
      <div
        className={`page-container grid ${align === "start" ? "lg:items-start" : "lg:items-end"} ${
          compact ? `${tight ? "gap-3" : "gap-5"} lg:grid-cols-[0.9fr_1fr] lg:gap-12` : "gap-8 lg:grid-cols-[1fr_0.72fr]"
        }`}
      >
        <div className={mobileContentFirst ? "order-2 lg:order-1" : undefined}>
          {eyebrow ? <p className={`${compact ? "mb-3" : "mb-5"} text-sm font-semibold text-bioaxis-accent`}>{eyebrow}</p> : null}
          <h1
            className={`max-w-5xl font-semibold text-bioaxis-text ${
              compact
                ? tight
                  ? "text-3xl leading-tight sm:text-4xl"
                  : "text-4xl leading-[1.02] sm:text-5xl"
                : "text-4xl leading-[0.95] sm:text-6xl lg:text-7xl"
            }`}
          >
            {title}
          </h1>
        </div>
        <div className={`flex flex-col ${mobileContentFirst ? "order-1 lg:order-2" : undefined}`}>
          <p className={mobileContentFirst ? "order-2 text-base leading-7 text-bioaxis-muted sm:text-lg" : "order-1 text-base leading-7 text-bioaxis-muted sm:text-lg"}>{subtitle}</p>
          {children ? <div className={mobileContentFirst ? "order-1 mt-0 lg:order-2 lg:mt-6" : tight ? "order-2 mt-4 sm:mt-6" : "order-2 mt-6"}>{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
