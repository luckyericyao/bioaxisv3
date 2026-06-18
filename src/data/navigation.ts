export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Products", href: "/products" },
  { label: "Workflows", href: "/workflows" },
  { label: "Equivalents", href: "/equivalents" },
  { label: "Samples", href: "/samples" },
  { label: "Resources", href: "/resources" },
  { label: "Support", href: "/support" },
  { label: "Request Quote", href: "/request-quote" }
];

export const footerNavigationItems: NavigationItem[] = [
  ...navigationItems,
  { label: "Quality", href: "/quality" },
  { label: "Suppliers", href: "/suppliers" }
];
