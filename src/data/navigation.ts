export type NavigationItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const navigationItems: NavigationItem[] = [
  { label: "Products", href: "/products" },
  { label: "Sourcing", href: "/ready-supply", children: [
    { label: "Availability check", href: "/ready-supply" },
    { label: "Equivalent review", href: "/equivalent-finder" },
    { label: "Private label / OEM", href: "/private-label-oem" }
  ] },
  { label: "Quality & Documentation", href: "/trust-center" },
  { label: "About", href: "/about" },
  { label: "Request a quote", href: "/request-quote" }
];

export const footerNavigationGroups: { label: string; items: NavigationItem[] }[] = [
  { label: "Products", items: [
    { label: "Browse product lines", href: "/products" }, { label: "Workflows", href: "/workflows" }
  ] },
  { label: "Sourcing support", items: [
    { label: "Availability check", href: "/ready-supply" }, { label: "Equivalent review", href: "/equivalent-finder" },
    { label: "Private label / OEM", href: "/private-label-oem" }, { label: "Samples", href: "/samples" },
    { label: "Request a quote", href: "/request-quote" }
  ] },
  { label: "Company", items: [
    { label: "About BioAxis", href: "/about" }, { label: "Contact", href: "/contact" }
  ] },
  { label: "Documentation & Legal", items: [
    { label: "Quality & Documentation", href: "/trust-center" }, { label: "Product documentation", href: "/quality" },
    { label: "Supplier qualification", href: "/supplier-qualification" }, { label: "Resources", href: "/resources" },
    { label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }
  ] }
];

export const footerNavigationItems = footerNavigationGroups.flatMap((group) => group.items);
