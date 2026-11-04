import { bioAxisSiteUrl } from "./siteMetadata";

// Brand fields already published by the site. Legal identity, contact details,
// certifications and availability require evidence and are deliberately omitted.
export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${bioAxisSiteUrl}/#organization`,
      name: "BioAxis",
      url: bioAxisSiteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${bioAxisSiteUrl}/icon.png`,
        width: 512,
        height: 512
      },
      description:
        "Life science consumables sourcing support for product requests, equivalent review, samples, documentation, RFQ preparation, and recurring supply planning."
    },
    {
      "@type": "WebSite",
      "@id": `${bioAxisSiteUrl}/#website`,
      url: bioAxisSiteUrl,
      name: "BioAxis",
      publisher: { "@id": `${bioAxisSiteUrl}/#organization` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${bioAxisSiteUrl}/products?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export function createBreadcrumbStructuredData(items: readonly { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, bioAxisSiteUrl).toString() } : {})
    }))
  };
}

export type DirectoryItemListProps = {
  name: string;
  path: string;
  items: readonly { name: string; href: string }[];
};

export function createItemListStructuredData({ name, path, items }: DirectoryItemListProps) {
  const url = new URL(path, bioAxisSiteUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    url,
    name,
    numberOfItems: items.length,
    // Directory links include sourcing templates, without asserting verified
    // supplier SKUs, offers or stock.
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: new URL(item.href, bioAxisSiteUrl).toString()
    }))
  };
}
