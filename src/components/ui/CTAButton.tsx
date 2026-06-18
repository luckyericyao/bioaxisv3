import Link from "next/link";
import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const baseClass =
  "inline-flex min-h-12 items-center justify-center border px-6 text-sm font-semibold uppercase transition";

const variantClass = {
  primary:
    "border-bioaxis-accent bg-bioaxis-accent text-bioaxis-black hover:bg-transparent hover:text-bioaxis-accent",
  secondary:
    "border-white/[0.24] bg-white/5 text-bioaxis-text hover:border-bioaxis-text hover:bg-white/10"
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
