export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Workflows", href: "/workflows" },
  { label: "Equivalent Finder", href: "/equivalent-finder" },
  { label: "Quality", href: "/quality" },
  { label: "Samples", href: "/samples" },
  { label: "Resources", href: "/resources" },
  { label: "Request Quote", href: "/request-quote" }
];

export const footerNavigationItems: NavigationItem[] = navigationItems;
