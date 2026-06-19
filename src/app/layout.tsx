import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SourcingListProvider } from "@/components/sourcing/SourcingListProvider";

export const metadata: Metadata = {
  title: "BioAxis | One-Stop Life Science Consumables Sourcing",
  description:
    "Source life science consumables, request equivalent options, compare specifications, request samples, and organize documentation for biotech, pharma, and research labs.",
  metadataBase: new URL("https://bioaxisv3.vercel.app")
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
