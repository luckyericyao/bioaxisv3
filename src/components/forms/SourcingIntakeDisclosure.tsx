"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { CompactSourcingIntake } from "./CompactSourcingIntake";

type SourcingIntakeDisclosureProps = {
  className: string;
  summaryClassName: string;
  children: ReactNode;
  fallbackHref: string;
  intake: ComponentProps<typeof CompactSourcingIntake>;
};

export function SourcingIntakeDisclosure({ className, summaryClassName, children, fallbackHref, intake }: SourcingIntakeDisclosureProps) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    // The native disclosure might already be open when hydration completes.
    if (disclosure.current?.open) setActivated(true);
  }, []);

  return (
    <details
      ref={disclosure}
      className={className}
      data-sourcing-intake-disclosure="true"
      onToggle={(event) => { if (event.currentTarget.open) setActivated(true); }}
    >
      <summary className={["min-h-11", summaryClassName].join(" ")}>{children}</summary>
      <div className="border-t border-bioaxis-line p-4 sm:p-5">
        {activated ? <CompactSourcingIntake {...intake} /> : null}
        <Link href={fallbackHref} prefetch={false} className={`action-secondary${activated ? " mt-4" : ""}`} data-sourcing-intake-fallback="true">
          Open request form
        </Link>
      </div>
    </details>
  );
}
