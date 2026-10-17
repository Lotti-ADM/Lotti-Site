/**
 * Quem assina os posts.
 *
 * Autor identificado pesa na avaliação de confiança do Google (E-E-A-T) —
 * foi a principal falha observada nos blogs do ZAP ("Redação ZAP") e do
 * VivaReal (sem autor). Enquanto não houver autores reais, os posts saem
 * assinados pela equipe, como organização. Para incluir uma pessoa, acrescente
 * uma entrada kind: "person" com nome, função e bio verdadeiros — nunca
 * invente credencial (CRECI, cargo) que a pessoa não tenha.
 */
export const authors = [
  {
    id: "equipe-lotti",
    kind: "organization",
    name: "Equipe Lotti",
    role: "Conteúdo",
    bio: "Conteúdo produzido pela equipe da Lotti, o CRM imobiliário com IA para corretores e pequenas imobiliárias.",
  },
] as const satisfies readonly {
  id: string;
  kind: "person" | "organization";
  name: string;
  role: string;
  bio: string;
}[];

export type Author = (typeof authors)[number];
export type AuthorId = Author["id"];

export const authorIds = authors.map((a) => a.id) as [AuthorId, ...AuthorId[]];

export function getAuthor(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}
