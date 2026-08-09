import type { MetadataRoute } from "next";
import { getAllProductItemPaths } from "@/data/productItems";
import { getAllProductPaths } from "@/data/productTaxonomy";
import { resourceGuides } from "@/data/resources";

const baseUrl = "https://bioaxisv3.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/products",
    "/equivalent-finder",
    "/ready-supply",
    "/private-label-oem",
    "/private-label",
    "/trust-center",
    "/resources",
    "/request-quote",
    "/workflows",
    "/about",
    "/contact",
    "/samples",
    "/quality",
    "/supplier-qualification",
    "/privacy",
    "/terms"
  ];
  const productPaths = getAllProductPaths();
  const productRoutes = [
    ...productPaths.segments.map(({ segment }) => `/products/${segment}`),
    ...productPaths.subcategories.map(({ segment, subcategory }) => `/products/${segment}/${subcategory}`),
    ...productPaths.families.map(({ segment, subcategory, family }) => `/products/${segment}/${subcategory}/${family}`),
    ...getAllProductItemPaths().map(({ segment, subcategory, family, product }) => `/products/${segment}/${subcategory}/${family}/${product}`)
  ];
  const resourceRoutes = resourceGuides.map((guide) => `/resources/${guide.slug}`);
  const routes = [...new Set([...staticRoutes, ...productRoutes, ...resourceRoutes])];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));
}
