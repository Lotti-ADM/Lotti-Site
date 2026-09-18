"use client";

import { Pricing } from "@/components/ui/pricing";
import { officialPlans, planCodes, planCapacityItems } from "@/content/plans";
import { pricingCopy } from "@/content/pricing";

const plans = planCodes.map((code) => {
  const plan = officialPlans[code];
  const capacity = planCapacityItems(plan);
  // Preço anual = 10 mensalidades (2 meses grátis), dividido por 12 para mostrar o valor equivalente mensal
  const yearlyEquivalent = Math.round((plan.monthlyPrice * 10) / 12);

  return {
    name: plan.name,
    price: String(plan.monthlyPrice),
    yearlyPrice: String(yearlyEquivalent),
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
