import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PricingHero } from "@/components/site/pricing/PricingHero";
import { PricingCards } from "@/components/site/pricing/PricingCards";
import { PricingComparison } from "@/components/site/pricing/PricingComparison";
import { PricingFAQ } from "@/components/site/pricing/PricingFAQ";
import { StructuredData } from "@/components/site/StructuredData";

export const metadata: Metadata = {
  title: "Planos e Preços",
  description:
    "Compare os planos da Lotti: Atende por R$ 199 e Completo por R$ 349/mês, e White Label para imobiliárias a partir de R$ 1.244/mês (R$ 499 + R$ 149 por cadeira, mínimo 5). CRM imobiliário com IA que atende seus leads 24h.",
  alternates: { canonical: "/planos" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/planos",
    title: "Planos e Preços - CRM Imobiliário Lotti",
    description:
      "Compare os planos da Lotti: Atende por R$ 199 e Completo por R$ 349/mês, e White Label para imobiliárias a partir de R$ 1.244/mês (R$ 499 + R$ 149 por cadeira, mínimo 5). CRM imobiliário com IA que atende seus leads 24h.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planos e Preços - CRM Imobiliário Lotti",
    description:
      "Compare os planos da Lotti: Atende por R$ 199 e Completo por R$ 349/mês, e White Label para imobiliárias a partir de R$ 1.244/mês (R$ 499 + R$ 149 por cadeira, mínimo 5). CRM imobiliário com IA que atende seus leads 24h.",
  },
};

export default function PlanosPage() {
  return (
    <>
      <StructuredData />
      <Header />
      <main className="pt-24 pb-16">
        <PricingHero />
        <PricingCards />
        <PricingComparison />
        <PricingFAQ />
      </main>
      <Footer />
    </>
  );
}
