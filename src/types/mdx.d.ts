// Complementa a declaração de @types/mdx: todo post do blog exporta `meta`.
// Fica `unknown` de propósito — quem dá o tipo é o schema zod em src/lib/blog.ts.
declare module "*.mdx" {
  export const meta: unknown;
}
