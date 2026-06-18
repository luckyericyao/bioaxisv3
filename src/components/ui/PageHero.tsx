import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="border-b border-bioaxis-line px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          {eyebrow ? <p className="mb-5 text-sm font-semibold uppercase text-bioaxis-accent">{eyebrow}</p> : null}
          <h1 className="max-w-5xl text-4xl font-bold uppercase leading-[0.95] text-bioaxis-text sm:text-6xl lg:text-7xl">
            {title}
          </h1>
        </div>
        <div>
          <p className="text-base leading-7 text-bioaxis-muted sm:text-lg">{subtitle}</p>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

