import {
  BadgeCheck,
  Banknote,
  Building2,
  CalendarClock,
  FileSignature,
  FileStack,
  Gavel,
  Images,
  KanbanSquare,
  Landmark,
  type LucideIcon,
  MessageSquareText,
  QrCode,
  Receipt,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/**
 * Toda a copy da página, em pt-BR e tipada.
 * Edite aqui — os componentes não guardam texto.
 */

export const nav = [
  { label: "Recursos", href: "/#recursos" },
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Preços", href: "/#planos" },
] as const;

export const hero = {
  eyebrow: "Gestão imobiliária inteligente",
  headline: ["Pare de operar.", "Comece a gerir."],
  lead: "Controle toda a sua operação imobiliária em um só lugar. A Lotti conecta CRM, imóveis, contratos e aluguéis para sua equipe ganhar tempo e não perder oportunidades.",
  primaryCta: "Começar teste grátis",
  secondaryCta: "Conhecer a Lotti",
  footnote: "Teste por 14 dias. Sem cartão de crédito.",
} as const;

export const problem = {
  eyebrow: "Menos tarefas. Mais controle.",
  title: "Sua operação não precisa depender de planilhas, memória e retrabalho.",
  lead: "Da entrada do lead ao repasse do aluguel, a Lotti mantém cada etapa conectada, organizada e fácil de acompanhar.",
  columns: { before: "Como é hoje", after: "Com a Lotti" },
  rows: [
    {
      before: "Contatos de placas e anúncios se perdem antes de chegar ao corretor.",
      after: "Cada leitura do QR Code gera um lead identificado e registrado no funil.",
    },
    {
      before: "O acompanhamento depende de memória, anotações e conversas espalhadas.",
      after: "O funil mostra etapa, histórico e próxima ação de cada oportunidade.",
    },
    {
      before: "Contratos consomem horas de preenchimento, revisão e conferência.",
      after: "A IA gera contratos e organiza os dados dos documentos que você já utiliza.",
    },
    {
      before: "Cobranças, baixas e repasses manuais aumentam o risco de erro.",
      after: "A Lotti automatiza o fluxo financeiro com integração ao Asaas e histórico auditável.",
    },
  ],
} as const;

export type Feature = {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  points?: readonly string[];
};

export const features = {
  eyebrow: "Uma plataforma. Toda a operação.",
  title: "Tudo o que você precisa para captar, negociar e administrar imóveis.",
  lead: "A informação entra uma vez e acompanha toda a jornada. Sua equipe trabalha com contexto, agilidade e uma visão clara do que precisa acontecer.",
  primary: [
    {
      icon: KanbanSquare,
      label: "Funil de vendas",
      title: "Conduza cada oportunidade até o fechamento.",
      description:
        "Visualize todas as negociações, acompanhe o histórico de cada cliente e receba alertas para agir na hora certa — sem depender da memória.",
      points: [
        "Valor em negociação por etapa",
        "Histórico completo por cliente",
        "Follow-up agendado com alerta",
      ],
    },
    {
      icon: QrCode,
      label: "Fachadas Inteligentes",
      title: "Transforme cada fachada em uma nova oportunidade.",
      description:
        "Crie placas com QR Code prontas para impressão. O interessado conhece o imóvel, deixa o contato e entra automaticamente no seu funil.",
      points: [
        "Formatos prontos para impressão",
        "Página do imóvel com captura de contato",
        "Escaneamentos, leads e conversão medidos",
        "Alerta de lead quente",
      ],
    },
  ] as const satisfies readonly Feature[],
  secondary: [
    {
      icon: FileSignature,
      label: "Contratos por IA",
      title: "Prepare contratos em minutos, não em horas.",
      description:
        "Use os dados do CRM para gerar contratos com IA ou importe um documento existente para identificar automaticamente as informações mais importantes.",
    },
    {
      icon: Banknote,
      label: "Aluguéis",
      title: "Administre aluguéis com menos trabalho manual.",
      description:
        "Automatize faturas, baixas e repasses com integração ao Asaas. Cada movimentação fica registrada para sua equipe acompanhar com segurança.",
    },
    {
      icon: MessageSquareText,
      label: "Assistente de IA",
      title: "Encontre respostas sem procurar em várias telas.",
      description:
        "Pergunte sobre clientes, imóveis, contratos e finanças em linguagem simples. A IA consulta os dados reais da sua operação e ajuda você a decidir o próximo passo.",
    },
    {
      icon: FileStack,
      label: "Módulos de apoio",
      title: "Tenha toda a rotina no mesmo ambiente.",
      description:
        "Imóveis com fotos e vídeos, Financeiro com KPIs e gráficos, Jurídico com documentos e vencimentos, e Mídias com melhoria de fotos por IA.",
    },
  ] as const satisfies readonly Feature[],
  supportModules: [
    { icon: Building2, label: "Imóveis" },
    { icon: Receipt, label: "Financeiro" },
    { icon: Gavel, label: "Jurídico" },
    { icon: Images, label: "Mídias" },
  ],
} as const;

export const differentiators = {
  eyebrow: "Feita para o mercado imobiliário",
  title: "Não é um CRM genérico adaptado à sua rotina.",
  items: [
    {
      icon: Sparkles,
      title: "IA aplicada a tarefas reais",
      description:
        "A IA ajuda a gerar contratos, interpretar documentos e consultar os números da operação. Tecnologia aplicada onde realmente economiza tempo.",
    },
    {
      icon: ScanLine,
      title: "Captação conectada ao CRM",
      description:
        "O interesse gerado na fachada chega ao CRM com origem e horário. Sua equipe recebe a oportunidade pronta para ser atendida.",
    },
    {
      icon: ShieldCheck,
      title: "Automação financeira com rastreabilidade",
      description:
        "Faturas, baixas e repasses ficam registrados e fáceis de conferir. O sistema reduz falhas e protege sua rotina contra duplicidades.",
    },
    {
      icon: BadgeCheck,
      title: "Uma base única para toda a operação",
      description:
        "Clientes, imóveis, negociações, contratos e financeiro compartilham os mesmos dados. Menos sistemas, menos retrabalho e mais clareza.",
    },
  ],
} as const;

export const howItWorks = {
  eyebrow: "Como funciona",
  title: "Comece simples. Ganhe controle desde o primeiro dia.",
  steps: [
    {
      title: "Configure sua operação",
      description:
        "Crie sua conta e organize o acesso da sua operação em um ambiente seguro e exclusivo.",
    },
    {
      title: "Centralize sua carteira",
      description:
        "Cadastre imóveis, proprietários e clientes e acompanhe as oportunidades em um funil visual.",
    },
    {
      title: "Automatize tarefas repetitivas",
      description:
        "Crie fachadas inteligentes e gere contratos com os dados que já estão organizados na plataforma.",
    },
    {
      title: "Acompanhe e faça sua operação crescer",
      description:
        "Automatize a rotina de aluguéis, acompanhe resultados e tome decisões com uma visão completa do negócio.",
    },
  ],
} as const;

export const trust = {
  eyebrow: "Sua operação protegida",
  title: "Segurança para os dados. Clareza para a gestão.",
  items: [
    {
      icon: ShieldCheck,
      title: "Isolamento total por conta",
      description:
        "Os dados da sua operação permanecem separados dos de outras contas e protegidos em um ambiente exclusivo.",
    },
    {
      icon: Landmark,
      title: "Pagamentos por instituição regulada",
      description:
        "Boletos e Pix são processados pelo Asaas. A Lotti organiza as informações e mantém cada movimentação registrada.",
    },
    {
      icon: CalendarClock,
      title: "Trilha de auditoria de cada centavo",
      description:
        "Cada fatura, baixa e repasse registra data e origem para facilitar conferências e manter o histórico da operação.",
    },
  ],
} as const;

export const plans = {
  eyebrow: "Planos para crescer",
  title: "Comece com o que precisa hoje. Evolua quando sua operação pedir.",
  lead: "Escolha a capacidade ideal para sua carteira. Clientes, funil e lançamentos financeiros continuam sem limite em todos os planos.",
  points: [
    "Teste grátis por 14 dias sem cartão.",
    "Planos que acompanham seu crescimento.",
    "Desconto de 2 meses no ciclo anual.",
  ],
  cta: "Ver planos e preços",
} as const;

export const finalCta = {
  eyebrow: "Conheça a Lotti",
  title: "Veja como simplificar sua operação imobiliária.",
  lead: "Em uma conversa rápida, mostramos como a Lotti pode organizar sua carteira, acelerar o atendimento e reduzir tarefas manuais na sua rotina.",
  reassurance: [
    "Sem compromisso",
    "Conversa com quem construiu o produto",
    "Resposta em até 1 dia útil",
  ],
} as const;

export const form = {
  title: "Fale com a gente",
  fields: {
    name: { label: "Nome completo", placeholder: "Como podemos te chamar" },
    whatsapp: { label: "WhatsApp", placeholder: "(00) 00000-0000" },
    email: { label: "E-mail", placeholder: "voce@exemplo.com.br" },
    creci: { label: "CRECI", placeholder: "Opcional", optional: true },
    portfolio: { label: "Imóveis administrados" },
  },
  portfolioOptions: [
    "Ainda não administro",
    "1 a 10",
    "11 a 50",
    "51 a 200",
    "Mais de 200",
  ],
  submit: "Agendar demonstração",
  submitting: "Enviando…",
  whatsappAlt: "Prefiro falar no WhatsApp",
  success: {
    title: "Recebemos seu pedido.",
    description:
      "Entramos em contato pelo WhatsApp em até 1 dia útil para combinar o horário.",
  },
  genericError:
    "Não conseguimos enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.",
} as const;

export const footer = {
  description:
    "Gestão imobiliária inteligente para centralizar clientes, imóveis, contratos e aluguéis — do primeiro contato ao repasse.",
  columns: [
    {
      title: "Produto",
      links: [
        { label: "Recursos", href: "#recursos" },
        { label: "Como funciona", href: "#como-funciona" },
        { label: "Diferenciais", href: "/#diferenciais" },
        { label: "Planos", href: "/#planos" },
        { label: "Comparar planos", href: "/planos" },
      ],
    },
  ],
} as const;
