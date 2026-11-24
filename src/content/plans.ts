export const planCodes = ["essencial", "profissional", "imobiliaria"] as const;

export type PlanCode = (typeof planCodes)[number];

/** Só estes passam pelo checkout. O White Label (`imobiliaria`) é vendido por conversa. */
export const checkoutPlanCodes = ["essencial", "profissional"] as const;

export type CheckoutPlanCode = (typeof checkoutPlanCodes)[number];

export type SeatPricing = {
  /** Mensalidade base da operação (marca, ambiente, gestor principal, suporte). */
  readonly base: number;
  /** Por cadeira de corretor por mês. */
  readonly perSeat: number;
  readonly minSeats: number;
};

export type OfficialPlan = {
  readonly code: PlanCode;
  readonly name: string;
  readonly audience: string;
  /** Mensalidade cobrada. É o que o checkout usa (anual = 10 mensalidades). */
  readonly monthlyPrice: number;
  /** Não é comprado pelo checkout: o botão leva a uma conversa. */
  readonly contactOnly?: boolean;
  readonly seatPricing?: SeatPricing;
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

// Preços cheios (sem preço de lançamento nem valor riscado). O app cobra pelo catálogo do banco,
// que precisa ter os mesmos valores (Lotti-ADM/Lotti, migration de preços dos planos).
export const officialPlans: Record<PlanCode, OfficialPlan> = {
  essencial: {
    code: "essencial",
    name: "Lotti Atende",
    audience: "Para o corretor autônomo",
    monthlyPrice: 199,
    capacity: {
      properties: 100,
      rentalContracts: 50,
      facades: 15,
      aiContracts: 15,
      attendedLeads: 100,
    },
    benefits: [
      "Agente de IA para atendimento e qualificação de leads",
      "Resumo das necessidades do cliente para o corretor",
      "Agente em implantação: ativação com a equipe Lotti",
      "CRM, clientes, funil e lançamentos financeiros sem limite",
      "Fachadas com QR Code que abrem direto o seu WhatsApp",
      "Integração com Asaas",
      "Financeiro básico",
      "Suporte por e-mail",
    ],
    support: "Por e-mail",
    onboarding: "Não incluído",
  },
  profissional: {
    code: "profissional",
    name: "Lotti Completo",
    audience: "Para quem administra aluguéis e pequenas equipes",
    monthlyPrice: 349,
    capacity: {
      properties: 200,
      rentalContracts: 100,
      facades: 60,
      aiContracts: 30,
      attendedLeads: 250,
    },
    benefits: [
      "Agente de IA para atendimento e qualificação de leads",
      "Resumo das necessidades do cliente para o corretor",
      "Agente em implantação: ativação com a equipe Lotti",
      "Até 3 corretores (3 contas de acesso)",
      "CRM, clientes, funil e lançamentos financeiros sem limite",
      "Gestão de aluguéis com cobrança por boleto e Pix",
      "Financeiro completo",
      "Integração com Asaas",
      "Relatórios e automações",
      "Suporte prioritário",
    ],
    support: "Prioritário",
    onboarding: "Não incluído",
    migrationNote: "A migração acontece quando os limites do Atende são ultrapassados.",
  },
  imobiliaria: {
    code: "imobiliaria",
    name: "Lotti White Label",
    audience: "Para imobiliárias com equipe de corretores",
    // Referência para SEO e comparativo: base + 5 cadeiras. O valor real sai da conversa.
    monthlyPrice: 1244,
    contactOnly: true,
    seatPricing: { base: 499, perSeat: 149, minSeats: 5 },
    capacity: {
      properties: null,
      rentalContracts: null,
      facades: null,
      aiContracts: 40,
      attendedLeads: 600,
    },
    benefits: [
      "Imóveis ativos ilimitados",
      "A marca da sua imobiliária no app dos corretores",
      "Gestor acompanha a equipe: leads, respostas e produção",
      "Distribuição de leads e metas por corretor",
      "Tudo do Completo para cada cadeira",
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

/** Exemplo de mensalidade do White Label para um número de cadeiras. */
export function seatPlanPrice(pricing: SeatPricing, seats: number): number {
  return pricing.base + pricing.perSeat * Math.max(seats, pricing.minSeats);
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
