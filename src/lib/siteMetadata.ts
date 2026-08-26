import type { Metadata } from "next";

export const bioAxisSiteUrl = "https://bioaxisv3.vercel.app";

export function createRouteMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "BioAxis",
      url: path,
      title,
      description,
      images: [{ url: "/images/bioaxis-social-preview.jpg", width: 1672, height: 941, alt: "BioAxis sourcing workspace" }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/bioaxis-social-preview.jpg"]
    }
  };
}
