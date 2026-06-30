import Link from "next/link";
import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const baseClass =
  "inline-flex min-h-12 items-center justify-center border px-6 text-sm font-semibold uppercase shadow-sm transition";

const variantClass = {
  primary:
    "border-bioaxis-text bg-bioaxis-text text-white hover:border-bioaxis-ice hover:bg-bioaxis-ice hover:text-bioaxis-text",
  secondary:
    "border-bioaxis-line bg-white/70 text-bioaxis-text hover:border-bioaxis-accent hover:bg-white"
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = ""
}: CTAButtonProps) {
  return (
    <Link href={href} className={[baseClass, variantClass[variant], className].filter(Boolean).join(" ")}>
      {children}
    </Link>
  );
}
