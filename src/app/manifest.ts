import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BioAxis Life Science Consumables Sourcing",
    short_name: "BioAxis",
    description:
      "Structure life science consumables requests, equivalent reviews, sample paths, documentation needs, and quote-ready sourcing briefs.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#111827",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
