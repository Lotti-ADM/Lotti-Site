import { form } from "./landing";

export const quizQuestions: { name: "leadVolume" | "attendance" | "portfolio"; title: string; hint: string; options: readonly string[] }[] = [
  { name: "leadVolume", title: "Quantos leads você recebe por mês?", hint: "Pode ser uma estimativa dos contatos interessados em imóveis.", options: ["Até 100 por mês", "De 101 a 250 por mês", "De 251 a 600 por mês", "Mais de 600 por mês"] },
  { name: "attendance", title: "Como esses leads são atendidos hoje?", hint: "Escolha a opção que mais se aproxima da sua rotina.", options: ["Eu faço o atendimento", "Minha equipe faz o atendimento", "Respondemos quando sobra tempo", "Já usamos uma automação"] },
  { name: "portfolio", title: "Quantos imóveis você administra hoje?", hint: "Isso ajuda a entender o tamanho da sua operação.", options: form.portfolioOptions },
];

export const contactConsent = {
  version: "2026-09-10-v1",
  text: "Autorizo a Lotti a usar os dados e as respostas deste formulário para entrar em contato comigo por WhatsApp e e-mail sobre esta solicitação.",
  error: "Confirme a autorização de contato para enviar sua solicitação.",
};
