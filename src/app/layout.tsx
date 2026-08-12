import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SourcingListProvider } from "@/components/sourcing/SourcingListProvider";

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
        url: "/images/hero-lab-procurement.png",
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
    images: ["/images/hero-lab-procurement.png"]
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
    <html lang="en">
      <body>
        <SourcingListProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SourcingListProvider>
      </body>
    </html>
  );
}
