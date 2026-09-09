import {
  Building2,
  Crown,
  Gauge,
  Headphones,
  Rocket,
} from "lucide-react";
import { officialPlans, planCodes, capacityLabel } from "@/content/plans";

export const pricingCopy = {
  title: "Planos claros para cada fase da sua operação imobiliária",
  subtitle:
    "Plataforma completa e agente de IA no mesmo plano. Atendimento dos leads, qualificação e resumo para o corretor encontrar o imóvel certo.",
  highlightBadge: "PARA QUEM ESTÁ CRESCENDO",
  faqTitle: "Perguntas frequentes",
  ctaFinal: {
    title: "Escolha a estrutura certa para a sua operação.",
    subtitle: "Cartão com cobrança mensal ou Pix anual, processados pelo Asaas.",
    cta: "Assinar agora",
  },
} as const;

const planIcons = {
  essencial: Rocket,
  profissional: Crown,
  imobiliaria: Building2,
} as const;

export const plansData = planCodes.map((code) => ({
  ...officialPlans[code],
  icon: planIcons[code],
  highlighted: code === "profissional",
  cta: "Assinar agora",
}));

export const comparisonCategories = [
  { key: "capacidade", label: "Capacidade", icon: Gauge },
  { key: "atendimento", label: "Atendimento", icon: Headphones },
] as const;

export const comparisonFeatures = [
  ...[
    ["Leads atendidos pela IA / mês", "attendedLeads"],
    ["Imóveis ativos", "properties"],
    ["Contratos de aluguel ativos", "rentalContracts"],
    ["Fachadas Inteligentes", "facades"],
    ["Gerações ou análises de contrato com IA / mês", "aiContracts"],
  ].map(([label, key]) => ({
    category: "capacidade", label,
    ...Object.fromEntries(planCodes.map(code => [code, capacityLabel(officialPlans[code].capacity[key as keyof typeof officialPlans.essencial.capacity])])),
  })) as Array<{ category: string; label: string; essencial: string; profissional: string; imobiliaria: string }>,
  { category: "atendimento", label: "Suporte", essencial: "Por e-mail", profissional: "Prioritário", imobiliaria: "Prioritário" },
  { category: "atendimento", label: "Onboarding", essencial: "—", profissional: "—", imobiliaria: "Orientado" },
];

export const pricingFAQ = [
  { question: "O agente de IA está incluído no preço?", answer: "Sim. Todos os planos incluem a plataforma e a franquia mensal de atendimento por IA: 100 leads no Inteligente, 250 no Profissional e 600 no Eficazes. O agente entende região, orçamento, preferências e prazo e organiza um resumo para o corretor." },
  { question: "O que conta como lead atendido?", answer: "Um contato que responde e inicia a qualificação. Mensagens e retomadas da mesma pessoa no mesmo mês não são novos leads. Spam, mensagens sem resposta e falhas do sistema não entram na franquia." },
  { question: "E quando a franquia de leads acabar?", answer: "Você pode contratar capacidade adicional ou mudar de plano. Não há cobrança automática de excedente sem sua autorização." },
  {
    question: "Quando acontece a migração do Inteligente para o Profissional?",
    answer:
      "A migração acontece quando o cliente ultrapassa os limites do plano Inteligente.",
  },
  {
    question: "O que significa um item ativo?",
    answer:
      "Os limites de imóveis e contratos de aluguel consideram os itens ativos na operação.",
  },
  {
    question: "Quais recursos não têm limite?",
    answer:
      "Nos planos Inteligente e Profissional, CRM, clientes, funil e lançamentos financeiros não têm limite.",
  },
  {
    question: "Como posso pagar a assinatura?",
    answer:
      "O checkout aceita cartão com cobrança mensal ou Pix anual, no valor equivalente a 10 mensalidades, com 12 meses de acesso. O pagamento é processado com segurança pelo Asaas.",
  },
  {
    question: "Como recebo meu acesso depois do pagamento?",
    answer:
      "Após a confirmação, o link para criar a senha é enviado ao mesmo e-mail informado no checkout. Esse e-mail é o único autorizado a iniciar o onboarding.",
  },
  {
    question: "A integração com Asaas está incluída?",
    answer:
      "A integração com Asaas está incluída nos planos Inteligente e Profissional, conforme os benefícios de cada plano.",
  },
] as const;
