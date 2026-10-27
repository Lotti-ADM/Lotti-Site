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
    "Compare os planos da Lotti: Inteligente por R$ 279, Profissional por R$ 399 e Eficazes por R$ 799/mês. CRM imobiliário completo com franquia de leads atendidos por IA.",
  alternates: { canonical: "/planos" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/planos",
    title: "Planos e Preços - CRM Imobiliário Lotti",
    description:
      "Compare os planos da Lotti: Inteligente por R$ 279, Profissional por R$ 399 e Eficazes por R$ 799/mês. CRM imobiliário completo com franquia de leads atendidos por IA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planos e Preços - CRM Imobiliário Lotti",
    description:
      "Compare os planos da Lotti: Inteligente por R$ 279, Profissional por R$ 399 e Eficazes por R$ 799/mês. CRM imobiliário completo com franquia de leads atendidos por IA.",
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
