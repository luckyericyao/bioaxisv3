import Link from "next/link";
import type { ReactNode } from "react";

type CTAButtonProps = { href: string; children: ReactNode; variant?: "primary" | "secondary"; className?: string };

export function CTAButton({ href, children, variant = "primary", className = "" }: CTAButtonProps) {
  return <Link href={href} className={[`action-${variant}`, className].filter(Boolean).join(" ")}>{children}</Link>;
}
