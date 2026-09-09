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
  headline: ["A IA qualifica seus leads.", "Você encontra o imóvel."],
  lead: "Um agente de IA para conversar com quem procura um imóvel, entender região, orçamento e preferências e preparar um resumo para você continuar o atendimento. Tudo junto da sua plataforma imobiliária.",
  capabilities: [
    "CRM imobiliário",
    "Gestão de imóveis",
    "Funil de vendas",
    "Fachadas Inteligentes",
    "Contratos com IA",
    "Gestão de aluguéis",
    "Financeiro integrado",
    "Assistente de IA",
    "Gestão jurídica",
    "Mídias com IA",
  ],
  primaryCta: "Conhecer o atendimento com IA",
  secondaryCta: "Ver como funciona",
  footnote: "Agente em implantação. Consulte a equipe sobre a ativação na sua operação.",
} as const;

export const problem = {
  eyebrow: "Menos perguntas repetidas. Mais contexto.",
  title: "O primeiro contato precisa virar uma conversa útil.",
  lead: "Quem chega perguntando por um imóvel nem sempre sabe explicar tudo o que precisa. A proposta da Lotti é organizar essa conversa para orientar o próximo passo do corretor.",
  columns: { before: "Como é hoje", after: "Com a Lotti" },
  rows: [
    {
      before: "Você recebe um “tenho interesse” e precisa descobrir tudo do zero.",
      after: "O agente pergunta se a pessoa quer comprar ou alugar e em qual região procura.",
    },
    {
      before: "As preferências ficam espalhadas em várias mensagens.",
      after: "Orçamento, tipo de imóvel, características e prazo ficam organizados em um resumo.",
    },
    {
      before: "Você apresenta opções antes de entender o que é indispensável.",
      after: "A qualificação ajuda a separar o que o cliente precisa do que ele apenas prefere.",
    },
    {
      before: "O corretor precisa reler a conversa inteira para continuar.",
      after: "Você recebe o contexto e as dúvidas pendentes para buscar opções e seguir a conversa.",
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
  eyebrow: "Do interesse à busca do imóvel.",
  title: "Entenda a procura. Organize o próximo passo.",
  lead: "Qualificar um lead é entender o que aquela pessoa procura. A Lotti reúne esse contexto com clientes, imóveis e negociações para apoiar seu atendimento.",
  primary: [
    {
      icon: KanbanSquare,
      label: "Funil de vendas",
      title: "Continue a conversa sabendo o que o cliente procura.",
      description:
        "Organize o histórico, a etapa da negociação e a próxima ação no CRM. O corretor usa as informações da qualificação para procurar imóveis, apresentar opções e acompanhar o interessado.",
      points: [
        "Valor em negociação por etapa",
        "Histórico completo por cliente",
        "Follow-up agendado com alerta",
      ],
    },
    {
      icon: QrCode,
      label: "Fachadas Inteligentes",
      title: "Dê um próximo passo ao interesse que vem da fachada.",
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
  title: "Uma conversa clara para o cliente. Um resumo útil para você.",
  items: [
    {
      icon: Sparkles,
      title: "Perguntas que ajudam a entender a procura",
      description:
        "Compra ou aluguel, região, orçamento, características e prazo: a qualificação reúne as informações que orientam a busca de um imóvel.",
    },
    {
      icon: ScanLine,
      title: "Linguagem simples, sem jargão",
      description:
        "O agente deve fazer perguntas claras e confirmar o que entendeu, para o interessado conseguir explicar sua necessidade com as próprias palavras.",
    },
    {
      icon: ShieldCheck,
      title: "O corretor continua no controle",
      description:
        "Você avalia as opções, confirma a disponibilidade dos imóveis e conduz visitas e negociação. A IA apoia o primeiro atendimento.",
    },
    {
      icon: BadgeCheck,
      title: "Contexto para dar continuidade",
      description:
        "O resumo ajuda a retomar o contato sem repetir todas as perguntas. O CRM mantém clientes, imóveis e oportunidades organizados para acompanhar a jornada.",
    },
  ],
} as const;

export const howItWorks = {
  eyebrow: "Como funciona",
  title: "Da primeira mensagem ao resumo para o corretor.",
  steps: [
    {
      title: "Prepare o atendimento com a equipe",
      description:
        "Na implantação, defina o canal, as perguntas e o momento de passar a conversa ao corretor. A ativação depende da configuração e validação do atendimento.",
    },
    {
      title: "Entenda o que a pessoa procura",
      description:
        "O agente conversa com o interessado sobre compra ou aluguel, região, orçamento e características desejadas, usando linguagem simples.",
    },
    {
      title: "Receba um resumo da necessidade",
      description:
        "As respostas formam um perfil de procura com preferências, prazo e informações que ainda precisam ser confirmadas.",
    },
    {
      title: "Encontre opções e continue o atendimento",
      description:
        "Com o contexto em mãos, o corretor pesquisa os imóveis adequados, confirma os detalhes e combina os próximos passos com o cliente.",
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
  title: "Escolha quantos leads sua IA vai atender.",
  lead: "Inteligente, Profissional ou Eficazes: plataforma e franquia de atendimento por IA no mesmo preço. Escolha pelo volume de interessados que chegam à sua operação.",
  points: [
    "Valores mensais claros.",
    "Limites definidos por faixa de operação.",
    "Pagamento por Pix ou cartão.",
  ],
  cta: "Ver planos e preços",
} as const;

export const finalCta = {
  eyebrow: "Conheça a Lotti",
  title: "Planeje seu atendimento com IA.",
  lead: "Conte como os interessados chegam até você. Vamos conversar sobre o que o agente deve perguntar, o resumo que o corretor precisa receber e as etapas de ativação.",
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
  /**
   * Falha no envio. Duas versões porque o convite ao WhatsApp só pode ser
   * feito quando o número existe — com siteConfig.whatsapp em PENDING o botão
   * não é renderizado, e mandar o visitante para um canal ausente o deixa sem
   * saída nenhuma. schedule-demo.ts escolhe entre as duas.
   */
  genericError:
    "Não conseguimos enviar agora. Tente de novo em instantes.",
  genericErrorWithWhatsapp:
    "Não conseguimos enviar agora. Tente de novo em instantes ou fale com a gente pelo WhatsApp.",
} as const;

export const footer = {
  description:
    "Qualificação de leads com IA e gestão imobiliária no mesmo lugar. Entenda a procura do cliente e organize o trabalho do primeiro contato ao contrato.",
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
