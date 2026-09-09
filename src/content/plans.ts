export const planCodes = ["essencial", "profissional", "imobiliaria"] as const;

export type PlanCode = (typeof planCodes)[number];

export type OfficialPlan = {
  readonly code: PlanCode;
  readonly name: string;
  readonly audience: string;
  readonly monthlyPrice: number;
  readonly capacity: {
    readonly properties: number | null;
    readonly rentalContracts: number | null;
    readonly facades: number | null;
    readonly aiContracts: number;
    readonly attendedLeads: number;
  };
  readonly benefits: readonly string[];
  readonly support: string;
  readonly onboarding: string;
  readonly migrationNote?: string;
};

export const officialPlans: Record<PlanCode, OfficialPlan> = {
  essencial: {
    code: "essencial",
    name: "Lotti Inteligente",
    audience: "Para corretor autônomo começando",
    monthlyPrice: 279,
    capacity: {
      properties: 250,
      rentalContracts: 5,
      facades: 15,
      aiContracts: 10,
      attendedLeads: 100,
    },
    benefits: [
      "Agente de IA para atendimento e qualificação de leads",
      "Resumo das necessidades do cliente para o corretor",
      "Agente em implantação: ativação com a equipe Lotti",
      "CRM, clientes, funil e lançamentos financeiros sem limite",
      "Integração com Asaas",
      "Financeiro básico",
      "Suporte por e-mail",
    ],
    support: "Por e-mail",
    onboarding: "—",
  },
  profissional: {
    code: "profissional",
    name: "Lotti Profissional",
    audience: "Para corretores com operação maior ou pequenas equipes",
    monthlyPrice: 399,
    capacity: {
      properties: 1500,
      rentalContracts: 30,
      facades: 60,
      aiContracts: 25,
      attendedLeads: 250,
    },
    benefits: [
      "Agente de IA para atendimento e qualificação de leads",
      "Resumo das necessidades do cliente para o corretor",
      "Agente em implantação: ativação com a equipe Lotti",
      "CRM, clientes, funil e lançamentos financeiros sem limite",
      "Financeiro completo",
      "Gestão de aluguéis",
      "Integração com Asaas",
      "Relatórios e automações",
      "Suporte prioritário",
    ],
    support: "Prioritário",
    onboarding: "—",
    migrationNote: "A migração acontece quando os limites do Inteligente são ultrapassados.",
  },
  imobiliaria: {
    code: "imobiliaria",
    name: "Lotti Eficazes",
    audience: "Para imobiliárias com equipe e carteira maior",
    monthlyPrice: 799,
    capacity: {
      properties: null,
      rentalContracts: null,
      facades: null,
      aiContracts: 40,
      attendedLeads: 600,
    },
    benefits: [
      "Agente de IA para atendimento e qualificação de leads",
      "Resumo das necessidades do cliente para o corretor",
      "Agente em implantação: ativação com a equipe Lotti",
      "Onboarding orientado",
      "Suporte prioritário",
    ],
    support: "Prioritário",
    onboarding: "Orientado",
  },
};

export function capacityLabel(value: number | null): string {
  return value === null ? "Sem limite" : `Até ${value}`;
}

export function planCapacityItems(plan: OfficialPlan) {
  return [
    { label: "Leads atendidos pela IA", value: `${plan.capacity.attendedLeads}/mês` },
    { label: "Imóveis ativos", value: capacityLabel(plan.capacity.properties) },
    { label: "Contratos de aluguel ativos", value: capacityLabel(plan.capacity.rentalContracts) },
    { label: "Fachadas Inteligentes", value: capacityLabel(plan.capacity.facades) },
    { label: "Gerações ou análises com IA", value: `${plan.capacity.aiContracts}/mês` },
  ] as const;
}
