import { meta as modeloDePost } from "./modelo-de-post.mdx";

/**
 * Registro dos posts. Para publicar um post novo:
 *
 * 1. Crie `src/content/blog/posts/{slug}.mdx` com `export const meta = { ... }`
 *    no topo (copie o modelo-de-post.mdx — os campos estão documentados em
 *    src/lib/blog.ts).
 * 2. Acrescente aqui um import do `meta` e uma linha `{ slug, meta }`.
 *    O slug precisa ser idêntico ao nome do arquivo, sem a extensão: é por ele
 *    que a página do artigo importa o conteúdo.
 * 3. Rode `npm run build`. Um meta inválido derruba o build com o motivo.
 */
export const postRegistry: readonly { slug: string; meta: unknown }[] = [
  { slug: "modelo-de-post", meta: modeloDePost },
];
