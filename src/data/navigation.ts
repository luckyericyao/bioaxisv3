export type NavigationItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const navigationItems: NavigationItem[] = [
  { label: "Products", href: "/products" },
  { label: "Sourcing support", href: "/ready-supply", children: [
    { label: "Availability check", href: "/ready-supply" },
    { label: "Equivalent review", href: "/equivalent-finder" },
    { label: "Private label / OEM", href: "/private-label-oem" }
  ] },
  { label: "Quality & trust", href: "/trust-center" },
  { label: "Contact", href: "/contact" },
  { label: "Request quote", href: "/request-quote" }
];

export const footerNavigationItems: NavigationItem[] = [
  { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
  { label: "Availability check", href: "/ready-supply" }, { label: "Private label / OEM", href: "/private-label-oem" },
  { label: "Products", href: "/products" }, { label: "Request quote", href: "/request-quote" },
  { label: "Equivalent review", href: "/equivalent-finder" }, { label: "Workflows", href: "/workflows" },
  { label: "Samples", href: "/samples" }, { label: "Quality", href: "/quality" },
  { label: "Supplier qualification", href: "/supplier-qualification" }, { label: "Quality & trust", href: "/trust-center" },
  { label: "Resources", href: "/resources" }, { label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }
];
