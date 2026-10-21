/**
 * Silos do blog — fonte única. Cada silo espelha uma parte do produto e
 * termina numa chamada para o recurso correspondente da Lotti.
 *
 * O id vira o primeiro segmento da URL (/blog/{id}/{slug}) e não deve mudar
 * depois de publicado: trocar o id quebra todos os links do silo.
 * Não existe "sem categoria" — post sem silo válido não passa no build.
 */
export const categories = [
  {
    id: "atendimento-e-leads",
    label: "Atendimento e Leads",
    description:
      "Como responder rápido, qualificar o contato e não perder o cliente entre a primeira mensagem e a visita.",
    cta: {
      title: "Deixe a IA fazer a primeira conversa",
      text: "O agente da Lotti atende o lead, entende o que ele procura e entrega a conversa qualificada no seu funil.",
      label: "Conhecer o agente",
      href: "/#agente",
    },
  },
  {
    id: "captacao",
    label: "Captação",
    description:
      "Placas, anúncios e indicações: como transformar cada ponto de contato em um lead registrado.",
    cta: {
      title: "Cada leitura do QR Code vira lead",
      text: "Com a Lotti, a placa na fachada registra nome, telefone, origem e horário de quem se interessou.",
      label: "Ver recursos",
      href: "/#recursos",
    },
  },
  {
    id: "funil-de-vendas",
    label: "Funil de Vendas",
    description:
      "Etapas, follow-up e rotina comercial para levar o lead da primeira conversa ao fechamento.",
    cta: {
      title: "Seu funil em um quadro só",
      text: "Acompanhe cada negociação por etapa e saiba quem precisa de retorno hoje.",
      label: "Ver como funciona",
      href: "/#como-funciona",
    },
  },
  {
    id: "contratos",
    label: "Contratos",
    description:
      "Documentação, cláusulas e cuidados na hora de formalizar venda e locação.",
    cta: {
      title: "Contratos gerados por IA",
      text: "A Lotti monta a minuta a partir dos dados do negócio e lê contratos recebidos para você revisar.",
      label: "Ver recursos",
      href: "/#recursos",
    },
  },
  {
    id: "aluguel-e-financeiro",
    label: "Aluguel e Financeiro",
    description:
      "Cobrança, repasse, reajuste e inadimplência na administração de aluguéis.",
    cta: {
      title: "Faturas e repasses no automático",
      text: "A Lotti gera as cobranças do aluguel e organiza os repasses ao proprietário.",
      label: "Ver recursos",
      href: "/#recursos",
    },
  },
  {
    id: "gestao-imobiliaria",
    label: "Gestão Imobiliária",
    description:
      "Indicadores, processos e organização para o corretor autônomo e a imobiliária pequena.",
    cta: {
      title: "A operação inteira no mesmo lugar",
      text: "Leads, funil, contratos e aluguéis num CRM feito para o tamanho do seu negócio.",
      label: "Ver planos",
      href: "/planos",
    },
  },
  {
    id: "mercado-imobiliario",
    label: "Mercado Imobiliário",
    description:
      "Notícias e movimentos do mercado imobiliário brasileiro explicados para corretores e imobiliárias pequenas.",
    cta: {
      title: "Transforme notícias em oportunidades",
      text: "A Lotti organiza seus leads, negociações e rotina para você agir com contexto quando o mercado muda.",
      label: "Conhecer a Lotti",
      href: "/#recursos",
    },
  },
] as const;

export type Category = (typeof categories)[number];
export type CategoryId = Category["id"];

export const categoryIds = categories.map((c) => c.id) as [
  CategoryId,
  ...CategoryId[],
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
