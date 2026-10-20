import type { Metadata } from "next";
import "./globals.css";
import { getBaseUrl } from "@/lib/site";

const base = getBaseUrl();

export const metadata: Metadata = {
  title: "Pozeidon Engineering SARL — Accessoires & matériel Starlink au Cameroun",
  description:
    "Boutique d'équipement informatique et d'accessoires Starlink au Cameroun : ordinateurs, câbles, supports, routeurs. Livraison et installation à Douala, Yaoundé et partout au Cameroun.",
  metadataBase: new URL(base),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Pozeidon Engineering SARL",
    images: [`${base}/logo-mark.png`],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${base}/logo-mark.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
