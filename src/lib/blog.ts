import { readFileSync } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { z } from "zod";
import { authorIds, getAuthor, type Author } from "@/content/blog/authors";
import {
  categoryIds,
  getCategory,
  type Category,
} from "@/content/blog/categories";
import { postRegistry } from "@/content/blog/posts";

/**
 * Leitura e validação dos posts do blog.
 *
 * Todo `meta` passa pelo schema abaixo durante o build. Um post com campo
 * faltando, silo inexistente ou descrição fora do tamanho derruba o build com
 * a mensagem do zod — é a trava que impede uma URL "sem-categoria" ou uma
 * meta description vazia de chegar à produção.
 */

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "use o formato AAAA-MM-DD");

const postMetaSchema = z
  .object({
    /** H1 e <title>. O template do layout acrescenta " - Lotti". */
    title: z.string().min(10).max(70),
    /** Meta description e resumo do card. O Google exibe ~155 caracteres. */
    description: z.string().min(70).max(160),
    category: z.enum(categoryIds),
    author: z.enum(authorIds),
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    cover: z
      .object({
        /** Arquivo em public/blog/. */
        src: z.string().startsWith("/blog/"),
        alt: z.string().min(5),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
    /** Bloco "Em resumo" no topo do post. */
    keyTakeaways: z.array(z.string().min(10)).min(3).max(5),
    faq: z
      .array(z.object({ q: z.string().min(5), a: z.string().min(10) }))
      .default([]),
    /** Obrigatório sempre que o texto citar número, lei ou pesquisa. */
    sources: z
      .array(z.object({ label: z.string().min(3), url: z.url() }))
      .default([]),
    /** Entra em "Mais lidas". Curadoria manual: o site não tem banco. */
    featured: z.boolean().default(false),
    /** Rascunho aparece no `next dev` e nunca no build de produção. */
    draft: z.boolean().default(false),
  })
  .strict()
  .refine((m) => !m.updatedAt || m.updatedAt >= m.publishedAt, {
    message: "updatedAt não pode ser anterior a publishedAt",
    path: ["updatedAt"],
  });

export type PostMeta = z.infer<typeof postMetaSchema>;

export type TocItem = { id: string; text: string; level: 2 | 3 };

export type Post = PostMeta & {
  slug: string;
  url: string;
  categoryData: Category;
  authorData: Author;
  readingMinutes: number;
  toc: TocItem[];
};

const POSTS_DIR = path.join(process.cwd(), "src", "content", "blog", "posts");
const WORDS_PER_MINUTE = 200;

/** Markdown inline mínimo removido para chegar ao texto que o rehype-slug vê. */
function plainHeading(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

/**
 * Lê o .mdx do disco para tirar sumário e tempo de leitura. Os ids saem do
 * mesmo github-slugger que o rehype-slug usa, então o link do sumário e o id
 * do título coincidem.
 */
function analyzeSource(slug: string): { toc: TocItem[]; readingMinutes: number } {
  const source = readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let inFence = false;
  let inMeta = false;
  let words = 0;

  for (const line of source.split(/\r?\n/)) {
    // O bloco `export const meta = { ... };` e os imports não são texto de
    // leitura. O bloco termina na primeira linha que é só `}` ou `};`.
    if (inMeta) {
      if (/^\};?\s*$/.test(line)) inMeta = false;
      continue;
    }
    if (/^export\s+const\s+meta\b/.test(line)) {
      inMeta = !/\};?\s*$/.test(line);
      continue;
    }
    if (/^(import|export)\s/.test(line)) continue;

    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const heading = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) {
      const text = plainHeading(heading[2]);
      toc.push({
        id: slugger.slug(text),
        text,
        level: heading[1].length as 2 | 3,
      });
    }

    words += line.split(/\s+/).filter(Boolean).length;
  }

  return { toc, readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)) };
}

const showDrafts = process.env.NODE_ENV !== "production";

function loadPosts(): Post[] {
  const seen = new Set<string>();

  return postRegistry
    .map(({ slug, meta }) => {
      if (seen.has(slug)) throw new Error(`Blog: slug duplicado "${slug}"`);
      seen.add(slug);

      const parsed = postMetaSchema.safeParse(meta);
      if (!parsed.success) {
        throw new Error(
          `Blog: meta inválido em posts/${slug}.mdx\n${z.prettifyError(parsed.error)}`,
        );
      }

      const data = parsed.data;
      // O schema já restringe aos ids válidos; os ! apenas informam o TS.
      const categoryData = getCategory(data.category)!;
      const authorData = getAuthor(data.author)!;

      return {
        ...data,
        slug,
        url: `/blog/${data.category}/${slug}`,
        categoryData,
        authorData,
        ...analyzeSource(slug),
      } satisfies Post;
    })
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

// Calculado uma vez por processo: no build, cada página reaproveita a lista.
let cache: Post[] | undefined;

export function getAllPosts(): Post[] {
  cache ??= loadPosts();
  return cache;
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPost(category: string, slug: string): Post | undefined {
  return getAllPosts().find((p) => p.category === category && p.slug === slug);
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((p) => p.featured);
}

/** Mesmo silo primeiro; completa com os mais recentes de outros silos. */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  // Datas AAAA-MM-DD viram meia-noite UTC; sem fixar o fuso, o Brasil
  // mostraria o dia anterior.
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00Z`));
}
