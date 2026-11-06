import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PerformanceMetrics } from "@/components/layout/PerformanceMetrics";
import { SourcingListProvider } from "@/components/sourcing/SourcingListProvider";
import { JsonLd } from "@/components/seo/StructuredData";
import { siteStructuredData } from "@/lib/structuredData";
import { productTaxonomy } from "@/data/productTaxonomy";

// Only the visible segment links cross into the interactive header.
const headerProductSegments = productTaxonomy.map((segment) => ({
  slug: segment.slug,
  href: `/products/${segment.slug}`,
  index: String(segment.index).padStart(2, "0"),
  label: segment.name
}));

const inter = localFont({ src: "../../public/fonts/InterVariable.woff2", display: "swap", variable: "--font-inter", weight: "100 900", fallback: ["Arial", "Helvetica", "sans-serif"] });

export const metadata: Metadata = {
  title: "BioAxis | One-Stop Life Science Consumables Sourcing",
  description:
    "Source life science consumables, request equivalent options, compare specifications, request samples, and organize documentation for biotech, pharma, and research labs.",
  metadataBase: new URL("https://bioaxisv3.vercel.app"),
  applicationName: "BioAxis",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "BioAxis",
    title: "BioAxis | One-Stop Life Science Consumables Sourcing",
    description:
      "Structure consumables requests, equivalent reviews, sample paths, documentation needs, and quote-ready sourcing briefs.",
    images: [
      {
        url: "/images/bioaxis-social-preview.jpg",
        width: 1672,
        height: 941,
        alt: "Life science consumables sourcing workspace"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BioAxis | Life Science Consumables Sourcing",
    description:
      "Structure consumables requests, equivalent reviews, sample paths, documentation needs, and quote-ready sourcing briefs.",
    images: ["/images/bioaxis-social-preview.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <PerformanceMetrics />
        <JsonLd data={siteStructuredData} />
        <SourcingListProvider>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Header productNavigationSegments={headerProductSegments} />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </SourcingListProvider>
      </body>
    </html>
  );
}
