import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - CRM Imobiliário e Qualificação de Leads com IA`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: "Plataforma Lotti",
  keywords: [
    "CRM imobiliário",
    "qualificação de leads com IA",
    "software para imobiliária",
    "sistema para corretor de imóveis",
    "gestão de aluguéis",
    "fachadas inteligentes",
    "placa com QR code imobiliária",
    "contrato de locação com IA",
    "funil de vendas imobiliário",
    "captação de leads imobiliários",
    "automação imobiliária",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    siteName: "Plataforma Lotti",
    title: `${siteConfig.name} - CRM Imobiliário e Qualificação de Leads com IA`,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Plataforma Lotti - CRM Imobiliário e Qualificação de Leads com IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - CRM Imobiliário e Qualificação de Leads com IA`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={sora.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/product/hero-demo-poster.jpg"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
