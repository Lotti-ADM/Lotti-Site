"use client";

import { Pricing } from "@/components/ui/pricing";
import { officialPlans, planCodes, planCapacityItems, seatPlanPrice } from "@/content/plans";
import { pricingCopy } from "@/content/pricing";
import { whatsappUrl } from "@/config/site";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

const plans = planCodes.map((code) => {
  const plan = officialPlans[code];
  const capacity = planCapacityItems(plan);

  // White Label: preço por cadeira e conversa, não checkout. Sem número de WhatsApp preenchido
  // no site, o botão leva ao formulário de demonstração — nunca a um canal que não existe.
  if (plan.contactOnly && plan.seatPricing) {
    const { base, perSeat, minSeats } = plan.seatPricing;
    const whatsapp = whatsappUrl(
      `Olá! Quero saber sobre o Lotti White Label para a minha imobiliária.`,
    );
    return {
      name: plan.name,
      pricePrefix: "a partir de",
      price: String(seatPlanPrice(plan.seatPricing, minSeats)),
      yearlyPrice: String(seatPlanPrice(plan.seatPricing, minSeats)),
      period: "mês",
      priceNote: `${formatBRL(base)} + ${formatBRL(perSeat)} por cadeira · mínimo ${minSeats} cadeiras`,
      features: [
        "Gestor principal incluído",
        `${plan.capacity.attendedLeads} leads atendidos pela IA / mês`,
        ...plan.benefits,
      ],
      description: plan.audience,
      buttonText: whatsapp ? "Falar no WhatsApp" : "Falar com a Lotti",
      href: whatsapp ?? "/#demo",
      external: Boolean(whatsapp),
      isPopular: false,
    };
  }

  return {
    name: plan.name,
    price: String(plan.monthlyPrice),
    // Anual = 10 mensalidades (12 meses pelo preço de 10).
    yearlyPrice: String(plan.monthlyPrice * 10),
    period: "mês",
    features: [
      `${plan.capacity.attendedLeads} leads atendidos pela IA / mês`,
      ...capacity.slice(1).map((c) => `${c.value} ${c.label.toLowerCase()}`),
      ...plan.benefits.filter(
        (b) =>
          !b.includes("Agente de IA") &&
          !b.includes("Resumo das necessidades") &&
          !b.includes("Agente em implantação")
      ),
    ],
    description: plan.audience,
    buttonText: "Assinar agora",
    href: `/checkout?plano=${code}`,
    isPopular: code === "profissional",
  };
});

export function PricingCards() {
  return (
    <section className="section pt-0 pb-16">
      <div className="shell">
        <Pricing
          plans={plans}
          title={pricingCopy.title}
          description={pricingCopy.subtitle}
        />
      </div>
    </section>
  );
}
