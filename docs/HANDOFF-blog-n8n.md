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

## 4. Lacuna de taxonomia resolvida: silo de notícia

Os 6 silos originais (`categories.ts`) são de prática profissional. A notícia
diária de mercado ganhou o 7º silo `mercado-imobiliario` no PR #5. Opções
consideradas na decisão:

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

Decisões originais do Gabriel (2026-10-17; fonte atualizada na seção 8):

- Fonte de notícia: API da newsdata.io. A chave ficaria numa credencial do n8n;
  a escolha posterior foi fazer a consulta pela API da Lotti (seção 8).
- Aviso: e-mail para uselottiapp@gmail.com, com o link do PR.
- Publicação: via Pull Request aprovado pelo Gabriel.

Pendências:

- Onde roda o deploy de produção (há branches de Vercel e de Railway no
  repo; confirmar antes de assumir que o merge publica).
- Se o fluxo também gera imagem de capa (sem capa, o card usa o padrão da marca).

## 6. O que já existe no n8n

O workflow de blog `lZXWIUIJ49VJqd59` existe e está inativo. Seu estado
atual foi conferido pelo conector n8n do Codex em 2026-10-17 e está descrito
na seção 8.

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

## 8. Codex — estado verificado em 2026-10-17

- `feat/blog` já estava commitada e enviada ao GitHub no início desta etapa,
  sem alterações locais. O PR #5 continua aberto e mesclável. O silo
  `mercado-imobiliario` já existe; `npm run build` passou nesta etapa e gerou
  `/blog` e `/blog/mercado-imobiliario`.
- Gabriel escolheu a API do PR #56 como responsável por consultar as fontes.
  O workflow `lZXWIUIJ49VJqd59` foi atualizado para fazer `POST` na rota
  `/api/internal/blog/research`; os nós de RSS e Newsdata diretos foram
  removidos. O workflow continua **inativo**, com agendamento diário às 9h e
  timezone `America/Sao_Paulo`. A seleção aceita somente notícia do dia com
  fonte HTTPS e conteúdo suficiente; ausência de pauta segue para o aviso.
- Os nós HTTP e de seleção passaram na validação de configuração do n8n.
  Simulação local da seleção retornou `ok` para candidato válido e `no_news`
  para lista vazia. Não houve execução manual integrada, PR de notícia nem
  envio de e-mail nesta etapa.
- Pendências para teste real: integrar os PRs #5 (site) e #56 (API), configurar
  `BLOG_RESEARCH_SECRET` e `NEWSDATA_API_KEY` no serviço API do Railway,
  associar uma credencial HTTP de autenticação ao nó do n8n e configurar a
  credencial GitHub do workflow. As credenciais Gmail e Gemini já estão
  associadas aos respectivos nós. A chave Newsdata fica na API, conforme a
  escolha atual de Gabriel; não no workflow.
- O domínio `plataformalotti.com.br` pertence ao projeto `lotti-site` da
  Vercel. O projeto está ligado ao repositório GitHub (ID 1325664626), com
  `main` como branch de produção e `createDeployments: enabled`; há deploy de
  produção registrado para um commit da `main`. O merge do PR #5 deve acionar
  um novo deploy automático, sujeito ao build; conferir o resultado no domínio
  após o merge. `/blog` retornou 404 antes do merge. Não ativar o workflow
  antes do teste real e da aprovação.

## 9. Codex — estado verificado em 2026-10-23

- O PR #5 foi mesclado na `main` como `3b59ead`. Em checkout limpo desse
  commit, `npm ci`, `npm test` (8/8) e `npm run build` passaram; o build gerou
  `/blog` e `/blog/mercado-imobiliario`.
- A produção do site é o serviço `Lotti-Site` no Railway, conectado ao
  repositório `Lotti-ADM/Lotti-Site`, branch `main`. Foi feito deploy do commit
  `3b59ead` em 2026-10-23 e ele ficou `SUCCESS`; no domínio interno do Railway,
  `/`, `/blog`, `/blog/mercado-imobiliario`, `/sitemap.xml` e `/robots.txt`
  responderam 200. O blog fica `noindex` enquanto não houver post publicado,
  e o sitemap só adiciona rotas do blog após existir artigo publicado.
- O domínio público ainda não foi migrado: `plataformalotti.com.br` e `www`
  continuavam no IP da Vercel. O Railway exige os CNAMEs e TXT de verificação
  exibidos no painel/CLI do Railway antes de o certificado e as rotas públicas
  responderem por ele. Não alterar registros de e-mail.
- O workflow `lZXWIUIJ49VJqd59` está **ativo**, com horário
  `America/Sao_Paulo` e agenda diária às 9h. Credenciais ficam somente no n8n.
  A seleção aceita uma matéria relevante de hoje ou ontem, pois o plano gratuito
  da Newsdata pode atrasar a fonte. Mantém fonte HTTPS, checagem de assunto já
  publicado, geração de MDX, branch e PR; nunca grava direto na `main`.
- Execução manual 1289 confirmou a seleção de notícia válida. A execução 1290
  identificou que o Gemini encerrou o JSON antes de terminar o texto; não abriu
  PR e enviou o aviso de falha. A próxima correção deve ampliar a saída do nó
  Gemini e repetir o teste manual, confirmando o PR e o e-mail antes de confiar
  na rota diária.
