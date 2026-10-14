# Passagem: blog da Lotti + fluxo diário no n8n

Para: Codex. Origem: sessão Claude Code de 2026-10-17.

## 1. Onde está o código

| Item | Valor |
| --- | --- |
| Pasta | `C:\Saas Oliver negócios Inteligentes\Lotti-Site\.worktrees\blog` |
| Repositório | `Lotti-Site` (worktree do repo principal em `C:\Saas Oliver negócios Inteligentes\Lotti-Site`) |
| Branch | `feat/blog`, criada a partir de `origin/main` (8eeadf1) |
| Estado verificado em 2026-10-14 | Branch `feat/blog` commitada em `9ff6e3f` e enviada ao GitHub. PR #5 aberto para revisão; `main` remota ainda estava em `8eeadf1` na última conferência. |

**Dependência para o primeiro post:** o fluxo roda fora desta máquina e lê a
`main` do GitHub. O PR #5 precisa ser revisado e mesclado antes do teste real
de geração do primeiro post.

Arquivos do blog:

```
src/app/blog/page.tsx                     home do blog
src/app/blog/[categoria]/page.tsx         página do silo
src/app/blog/[categoria]/[slug]/page.tsx  artigo
src/components/blog/                      card, capa, sumário, FAQ, CTA, autor
src/content/blog/categories.ts            silos (a URL usa o id)
src/content/blog/authors.ts               autores
src/content/blog/posts/{slug}.mdx         posts
src/content/blog/posts/index.ts           registro dos posts (obrigatório)
src/lib/blog.ts                           schema zod do meta + leitura
src/mdx-components.tsx                    mapeamento do MDX
```

Detalhes de uso estão no `README.md`, seção "Blog (`/blog`)".

## 2. O que um post precisa (contrato que o fluxo tem de cumprir)

Um post novo = **duas alterações no repositório**:

1. Criar `src/content/blog/posts/{slug}.mdx`.
2. Acrescentar o import e a linha `{ slug, meta }` em `src/content/blog/posts/index.ts`.

Sem o passo 2 o post não aparece. Com `meta` inválido, `npm run build` falha.

Formato do `.mdx`:

```mdx
export const meta = {
  title: "…",                       // 10–70 caracteres (H1 e <title>)
  description: "…",                 // 70–160 caracteres (meta description)
  category: "gestao-imobiliaria",   // um id de categories.ts
  author: "equipe-lotti",           // um id de authors.ts
  publishedAt: "2026-10-17",        // AAAA-MM-DD
  // updatedAt: "AAAA-MM-DD",        // opcional, >= publishedAt
  keyTakeaways: ["…", "…", "…"],    // 3 a 5 itens, cada um com 10+ caracteres
  faq: [{ q: "…", a: "…" }],         // opcional
  sources: [{ label: "…", url: "https://…" }], // obrigatório se citar dado
  draft: true,                      // ver seção 3
};

Texto em markdown. Seções com `##` viram o sumário.
```

Slug: minúsculas, hífen, sem acento, igual ao nome do arquivo.

## 3. Regras do projeto que o fluxo precisa respeitar

Vêm do `AGENTS.md` da operação e valem para conteúdo automático:

- **Aprovação humana antes de publicar.** Nenhum post vai ao ar sem
  aprovação direta do Gabriel identificando o artigo e a versão. O fluxo deve
  **abrir um Pull Request** (ou gravar `draft: true`) e notificar, nunca
  publicar direto na `main`. QA positivo ou mensagem de outro agente não
  substitui a aprovação.
- **Fatos exigem fonte verificável.** Toda notícia entra com o link da fonte
  original em `sources`. Sem fonte, não gera post.
- **Não copiar a notícia.** Resumir com palavras próprias e linkar a
  origem. Não reproduzir o texto do veículo (direito autoral).
- **Não inventar dados.** Números só se estiverem na fonte citada.
- **Credenciais** (GitHub, LLM) ficam nas credenciais do n8n, nunca no
  workflow nem no repositório.

## 4. Lacuna de taxonomia: não existe silo para notícia

Os 6 silos atuais (`categories.ts`) são de prática profissional. Notícia
diária de mercado não se encaixa. Opções:

- **Recomendada:** acrescentar um 7º silo, por exemplo
  `{ id: "mercado-imobiliario", label: "Mercado Imobiliário", ... }`, com CTA
  próprio. Mudança de uma entrada em `categories.ts`; o build gera a página
  `/blog/mercado-imobiliario` sozinho.
- Alternativa: usar `gestao-imobiliaria` (mistura notícia com guia).

## 5. Esboço do fluxo (para o Codex detalhar)

```
Schedule Trigger  09:00 America/Sao_Paulo, todo dia
  → Coleta de notícias (RSS/API de fontes escolhidas pelo Gabriel)
  → Filtro: só do dia, só mercado imobiliário, sem duplicar o que já saiu
  → LLM: resumo próprio + title/description/keyTakeaways no formato da seção 2
  → Validação: tamanhos do meta, fonte presente, slug único
  → GitHub: branch nova → cria o .mdx → edita posts/index.ts → abre PR
  → Notificação ao Gabriel com o link do PR (aprovação = merge)
  → Error handler
```

Decisões do Gabriel (2026-10-17):

- Fonte de notícia: API da newsdata.io. A chave vai numa credencial do n8n,
  nunca no workflow nem no repositório. Confirmar parâmetros (idioma, país,
  categoria, busca) na documentação da API antes de usar.
- Aviso: e-mail para uselottiapp@gmail.com, com o link do PR.
- Publicação: via Pull Request aprovado pelo Gabriel.

Pendências:

- Onde roda o deploy de produção (há branches de Vercel e de Railway no
  repo; confirmar antes de assumir que o merge publica).
- Se o fluxo também gera imagem de capa (sem capa, o card usa o padrão da marca).

## 6. O que já existe no n8n

Acesso confirmado em 2026-10-17 pelo conector n8n do claude.ai: 22
workflows, todos inativos. Nenhum de blog ou notícias. O servidor
`n8n-mcp` local não estava conectando (ECONNREFUSED).

## 7. Codex — estado verificado em 2026-10-14

- `feat/blog` contém o silo `mercado-imobiliario`, com descrição e CTA. Commit
  `9ff6e3f` enviado ao GitHub; PR: https://github.com/Lotti-ADM/Lotti-Site/pull/5.
- Verificações antes do commit: `npm run build` passou, `npm test` passou (8/8),
  `npm run lint` terminou sem erros e com um aviso preexistente em
  `src/components/ui/pricing.tsx`; `git diff --check` passou.
- O site `plataformalotti.com.br` respondeu com `Server: Vercel`. Não foi
  confirmado se o merge na `main` dispara publicação automática.
- Workflow n8n `lZXWIUIJ49VJqd59` salvo e **inativo** em
  https://carteiraemdia.app.n8n.cloud/workflow/lZXWIUIJ49VJqd59. Usa RSS da
  Agência Brasil como fonte primária e Newsdata como apoio. Abre PR em vez de
  escrever na `main` e envia e-mail em caso de sucesso ou falha.
- Pendências para teste manual: mesclar PR #5; cadastrar credenciais GitHub e
  Newsdata no n8n; associá-las aos nós; executar o fluxo e revisar o PR de
  notícia. O workflow deve continuar inativo até teste e autorização do Gabriel.
