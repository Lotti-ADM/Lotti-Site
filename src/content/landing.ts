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
  lead: "Centralize imóveis, clientes, negociações, contratos e aluguéis. A Lotti conecta CRM, IA e gestão financeira para você reduzir tarefas manuais e crescer com controle.",
  primaryCta: "Começar teste grátis",
  secondaryCta: "Conhecer a Lotti",
  footnote: "Teste por 14 dias. Sem cartão de crédito.",
} as const;

export const problem = {
  eyebrow: "Da rotina manual ao controle",
  title: "Sua equipe perde tempo quando cada etapa está em um lugar.",
  lead: "A Lotti conecta os pontos críticos da operação e transforma tarefas dispersas em um fluxo simples e rastreável.",
  columns: { before: "Como é hoje", after: "Com a Lotti" },
  rows: [
    {
      before: "A placa gera contatos que nem sempre chegam ao CRM.",
      after: "Cada leitura do QR Code vira um lead identificado e entra direto no funil.",
    },
    {
      before: "O acompanhamento depende de memória, anotações e conversas espalhadas.",
      after: "O funil reúne etapa, histórico, valor negociado e próximo contato em uma única tela.",
    },
    {
      before: "Contratos consomem horas entre modelos antigos, preenchimento e conferência.",
      after: "A IA gera novos contratos e extrai os dados dos documentos que você já utiliza.",
    },
    {
      before: "Cobranças, baixas e repasses manuais aumentam o trabalho e o risco de erro.",
      after: "Faturas, baixas e repasses seguem um fluxo automatizado, integrado ao Asaas e auditável.",
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
  eyebrow: "Recursos",
  title: "Da captação ao repasse, tudo conectado.",
  lead: "CRM, imóveis, contratos e financeiro compartilham a mesma base. A informação entra uma vez e acompanha toda a operação.",
  primary: [
    {
      icon: KanbanSquare,
      label: "Funil de vendas",
      title: "Veja cada negociação e saiba qual é o próximo passo.",
      description:
        "Organize oportunidades em um funil visual, acompanhe o valor negociado por etapa e programe retornos com alerta. Todo o histórico permanece ligado ao cliente.",
      points: [
        "Valor em negociação por etapa",
        "Histórico completo por cliente",
        "Follow-up agendado com alerta",
      ],
    },
    {
      icon: QrCode,
      label: "Fachadas Inteligentes",
      title: "Transforme a fachada do imóvel em um canal de captação.",
      description:
        "Crie placas e banners com QR Code prontos para impressão. O interessado acessa a página do imóvel, deixa o contato e entra automaticamente no funil.",
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
      title: "Gere contratos e extraia dados com IA.",
      description:
        "Gere contratos completos em minutos a partir dos dados do CRM. Ou envie um PDF ou uma foto de contrato que já existe e a IA extrai inquilino, proprietário, imóvel, valor, prazo e taxa.",
    },
    {
      icon: Banknote,
      label: "Aluguéis",
      title: "Automatize cobranças, baixas e repasses.",
      description:
        "Faturas mensais geradas automaticamente, baixa de boleto e PIX pelo Asaas, cálculo do repasse ao proprietário, proteção contra repasse duplicado e trilha de auditoria de cada operação.",
    },
    {
      icon: MessageSquareText,
      label: "Assistente de IA",
      title: "Consulte sua operação usando linguagem simples.",
      description:
        "Pergunte sobre clientes, imóveis, contratos e finanças e receba a resposta com base nos dados reais do seu CRM. O assistente sugere a próxima ação e toda ação passa pela sua confirmação.",
    },
    {
      icon: FileStack,
      label: "Módulos de apoio",
      title: "Centralize os módulos que sustentam sua rotina.",
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
  eyebrow: "Diferenciais",
  title: "Mais que um CRM. Uma operação que trabalha integrada.",
  items: [
    {
      icon: Sparkles,
      title: "IA aplicada a tarefas reais",
      description:
        "A IA da Lotti redige contrato, lê documento antigo e consulta os seus números. Não é um chat solto no canto da tela para dizer que tem IA.",
    },
    {
      icon: ScanLine,
      title: "Captação conectada ao CRM",
      description:
        "O imóvel na rua e o funil no computador viram a mesma coisa. O lead que nasce na calçada chega registrado, com origem e horário.",
    },
    {
      icon: ShieldCheck,
      title: "Automação financeira com rastreabilidade",
      description:
        "Fatura, baixa e repasse ficam registrados e conferíveis depois. Repasse duplicado é bloqueado pelo sistema, não pela sua atenção.",
    },
    {
      icon: BadgeCheck,
      title: "Uma base única para toda a operação",
      description:
        "Contrato por IA, financeiro de aluguéis autônomo e inteligência de inadimplência. Separados, existem. No mesmo lugar, é a Lotti.",
    },
  ],
} as const;

export const howItWorks = {
  eyebrow: "Como funciona",
  title: "Comece a organizar sua operação em quatro passos.",
  steps: [
    {
      title: "Crie sua conta",
      description:
        "Cadastro self-service com o seu CRECI. Sua base nasce isolada, os seus dados não dividem espaço com os de ninguém.",
    },
    {
      title: "Traga imóveis e clientes",
      description:
        "Cadastre o portfólio com fotos e vídeos e organize os clientes nas etapas do funil.",
    },
    {
      title: "Gere placa e contrato com IA",
      description:
        "Placa com QR Code pronta para imprimir e contrato redigido em minutos, a partir dos dados que já estão lá.",
    },
    {
      title: "Cobre e repasse no automático",
      description:
        "Fatura mensal, baixa via Asaas e repasse calculado ao proprietário. Você confere e não digita.",
    },
  ],
} as const;

export const trust = {
  eyebrow: "Confiança e segurança",
  title: "Segurança e rastreabilidade em cada operação.",
  items: [
    {
      icon: ShieldCheck,
      title: "Isolamento total por conta",
      description:
        "Os dados da sua imobiliária ficam separados dos de qualquer outra. Sem base compartilhada, sem vizinho de tabela.",
    },
    {
      icon: Landmark,
      title: "Pagamentos por instituição regulada",
      description:
        "Boleto e PIX passam pelo Asaas. A Lotti organiza e registra; o processamento financeiro é de quem tem licença para isso.",
    },
    {
      icon: CalendarClock,
      title: "Trilha de auditoria de cada centavo",
      description:
        "Cada fatura, baixa e repasse fica registrado com data e origem. Dá para reconstruir qualquer operação meses depois.",
    },
  ],
} as const;

export const plans = {
  eyebrow: "Planos e Assinaturas",
  title: "Um plano para cada fase da sua operação.",
  lead: "Comece com o essencial e avance conforme sua carteira e sua equipe crescerem. Todos os planos mantêm clientes, funil e lançamentos financeiros sem limite.",
  points: [
    "Teste grátis por 14 dias sem cartão.",
    "Planos que acompanham seu crescimento.",
    "Desconto de 2 meses no ciclo anual.",
  ],
  cta: "Ver planos e preços",
} as const;

export const finalCta = {
  eyebrow: "Demonstração",
  title: "Veja a Lotti aplicada à sua rotina.",
  lead: "Em 30 minutos, mostramos como organizar seu funil, captar contatos pelas fachadas, gerar contratos e controlar aluguéis em uma única operação.",
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
    "SaaS e CRM para imobiliárias e corretores. Gestão imobiliária inteligente, do primeiro lead ao repasse do aluguel.",
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
