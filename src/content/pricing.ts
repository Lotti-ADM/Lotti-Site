import {
  Building2,
  Crown,
  Gauge,
  Headphones,
  Rocket,
} from "lucide-react";
import { officialPlans, planCodes, capacityLabel } from "@/content/plans";

export const pricingCopy = {
  title: "Sua plataforma e o primeiro atendimento no mesmo plano",
  subtitle:
    "Escolha uma franquia de leads atendidos pela IA. O agente entende a procura e organiza as informações; o corretor busca os imóveis e conduz a negociação.",
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
  { category: "atendimento", label: "Preço", essencial: "R$ 199/mês ou R$ 1.990/ano", profissional: "R$ 349/mês ou R$ 3.490/ano", imobiliaria: "A partir de R$ 1.244/mês" },
  { category: "atendimento", label: "Suporte", essencial: "Por e-mail", profissional: "Prioritário", imobiliaria: "Prioritário" },
  { category: "atendimento", label: "Onboarding", essencial: "Não incluído", profissional: "Não incluído", imobiliaria: "Orientado" },
];

export const pricingFAQ = [
  { question: "E se o interessado quiser falar com o corretor?", answer: "O atendimento deve permitir que a pessoa peça ajuda humana. Na implantação, combinamos com você quando interromper a qualificação e como encaminhar o contexto para a equipe." },
  { question: "O agente serve para compra e aluguel?", answer: "A qualificação considera os dois objetivos. As perguntas devem se adaptar à procura: região, orçamento, tipo de imóvel, características e prazo. As regras são definidas com a sua operação." },
  { question: "Ele confirma preço e disponibilidade do imóvel?", answer: "O corretor confirma valores, despesas e disponibilidade antes de apresentar uma oferta. O agente organiza o que a pessoa procura; não deve inventar informações sobre imóveis." },
  { question: "O que significa qualificar um lead?", answer: "É entender a necessidade de quem demonstrou interesse: compra ou aluguel, região, orçamento, tipo de imóvel e prazo. O resultado é um resumo para orientar o trabalho do corretor." },
  { question: "O agente já começa a responder após a contratação?", answer: "O agente está em implantação. A ativação exige configuração do canal e validação do atendimento com a equipe Lotti. Confirme as condições e o prazo de ativação antes de contratar." },
  { question: "A IA escolhe o imóvel ou fecha a venda?", answer: "O agente apoia a qualificação inicial. O corretor procura opções, verifica disponibilidade, conduz visitas e negocia com o cliente. A qualificação não garante uma venda." },
  { question: "O agente de IA está incluído no preço?", answer: "Sim. Todos os planos incluem a plataforma e a franquia mensal de atendimento por IA: 100 leads no Atende, 250 no Completo e 600 no White Label. O agente entende região, orçamento, preferências e prazo e organiza um resumo para o corretor." },
  { question: "O que conta como lead atendido?", answer: "Um contato que responde e inicia a qualificação. Mensagens e retomadas da mesma pessoa no mesmo mês não são novos leads. Spam, mensagens sem resposta e falhas do sistema não entram na franquia." },
  { question: "E quando a franquia de leads acabar?", answer: "Você pode contratar capacidade adicional ou mudar de plano. Não há cobrança automática de excedente sem sua autorização." },
  {
    question: "Quando acontece a migração do Atende para o Completo?",
    answer:
      "A migração acontece quando o cliente ultrapassa os limites do plano Atende.",
  },
  {
    question: "O que significa um item ativo?",
    answer:
      "Os limites de imóveis e contratos de aluguel consideram os itens ativos na operação.",
  },
  {
    question: "Quais recursos não têm limite?",
    answer:
      "Nos planos Atende e Completo, CRM, clientes, funil e lançamentos financeiros não têm limite.",
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
      "A integração com Asaas está incluída nos planos Atende e Completo, conforme os benefícios de cada plano.",
  },
  {
    question: "Posso cancelar a assinatura quando quiser?",
    answer:
      "Sim. No plano mensal no cartão de crédito, você pode cancelar a qualquer momento sem qualquer multa ou período de fidelidade. As cobranças futuras são interrompidas e o acesso permanece ativo até o fim do ciclo mensal vigente.",
  },
  {
    question: "Como funciona a garantia de reembolso (7 dias)?",
    answer:
      "Garantimos 100% de reembolso integral caso você solicite o cancelamento em até 7 dias corridos após a contratação, em estrito cumprimento ao art. 49 do Código de Defesa do Consumidor. A solicitação pode ser feita via WhatsApp ou e-mail de suporte.",
  },
] as const;
