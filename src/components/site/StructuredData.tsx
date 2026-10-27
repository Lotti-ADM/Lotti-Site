import { isPending, siteConfig } from "@/config/site";
import { officialPlans, planCodes } from "@/content/plans";
import { pricingFAQ } from "@/content/pricing";

/**
 * JSON-LD para o Google entender a Lotti como plataforma SaaS de CRM
 * imobiliário e inteligência artificial no Brasil, com ofertas de planos
 * e página de perguntas frequentes (FAQPage) para Rich Snippets.
 */
export function StructuredData() {
  const organization = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: "Plataforma Lotti",
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/lotti-linear-dark.svg`,
    description: siteConfig.description,
    ...(isPending(siteConfig.email) ? {} : { email: siteConfig.email }),
    ...(isPending(siteConfig.whatsapp)
      ? {}
      : { telephone: `+${siteConfig.whatsapp}` }),
    ...(() => {
      const profiles = Object.values(siteConfig.social).filter(
        (url) => !isPending(url),
      );
      return profiles.length > 0 ? { sameAs: profiles } : {};
    })(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(isPending(siteConfig.whatsapp)
        ? {}
        : { telephone: `+${siteConfig.whatsapp}` }),
      ...(isPending(siteConfig.email) ? {} : { email: siteConfig.email }),
      availableLanguage: ["Portuguese"],
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: "Plataforma Lotti",
    url: siteConfig.url,
    inLanguage: "pt-BR",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  const software = {
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${siteConfig.url}/#software`,
    name: "Plataforma Lotti",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "CRM imobiliário e Qualificação de Leads com IA",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript and HTML5 support",
    inLanguage: "pt-BR",
    description: siteConfig.description,
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    audience: {
      "@type": "Audience",
      audienceType: "Corretores de imóveis e imobiliárias",
      geographicArea: { "@type": "Country", name: "Brasil" },
    },
    featureList: [
      "Qualificação e atendimento de leads com Inteligência Artificial",
      "Funil de vendas visual em Kanban para corretores",
      "Fachadas Inteligentes com QR Code para placas de imóveis",
      "Geração e leitura de contratos imobiliários por IA",
      "Gestão de aluguéis com faturas e repasses automáticos via Asaas",
      "Assistente de IA sobre os dados do CRM",
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: "279",
      highPrice: "799",
      offerCount: "3",
      offers: planCodes.map((code) => {
        const plan = officialPlans[code];
        return {
          "@type": "Offer",
          name: plan.name,
          price: String(plan.monthlyPrice),
          priceCurrency: "BRL",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: `${siteConfig.url}/planos`,
          description: `${plan.audience}. Inclui ${plan.capacity.attendedLeads} leads atendidos por IA/mês.`,
        };
      }),
    },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    mainEntity: pricingFAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const payload = {
    "@context": "https://schema.org",
    "@graph": [organization, website, software, faq],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
