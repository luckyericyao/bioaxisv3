"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { CompactSourcingIntake } from "./CompactSourcingIntake";
import type { SourcingIntakeActivity } from "./sourcing-intake/types";

const activityLabels: Record<SourcingIntakeActivity, string> = {
  idle: "",
  sending: "Sending request...",
  received: "Request received",
  attention: "Request needs attention"
};

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
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState<SourcingIntakeActivity>("idle");
  const status = open ? "" : activityLabels[activity];

  useEffect(() => {
    // The native disclosure might already be open when hydration completes.
    if (disclosure.current?.open) {
      setOpen(true);
      setActivated(true);
    }
  }, []);

  return (
    <>
      <details
        ref={disclosure}
        className={className}
        data-sourcing-intake-disclosure="true"
        onToggle={(event) => {
          const isOpen = event.currentTarget.open;
          setOpen(isOpen);
          if (isOpen) setActivated(true);
        }}
      >
        <summary className={["min-h-11", summaryClassName, status ? "flex-wrap" : ""].filter(Boolean).join(" ")}>
          {children}
          {status ? <span data-sourcing-intake-status="true" aria-hidden="true" className="basis-full text-xs font-medium text-bioaxis-text">{status}</span> : null}
        </summary>
        <div className="border-t border-bioaxis-line p-4 sm:p-5">
          {activated ? <CompactSourcingIntake {...intake} onActivityChange={setActivity} /> : null}
          <Link href={fallbackHref} prefetch={false} className={`action-secondary${activated ? " mt-4" : ""}`} data-sourcing-intake-fallback="true">
            Open request form
          </Link>
        </div>
      </details>
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">{status}</span>
    </>
  );
}
