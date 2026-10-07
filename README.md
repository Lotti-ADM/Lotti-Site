# Lotti — site institucional

Landing page e checkout público da Lotti (Next.js 16, App Router, Tailwind v4).
O conteúdo institucional é estático; a rota `/checkout` usa APIs server-side
para criar a assinatura no Asaas e provisionar o acesso pela API da Lotti (Railway).

O aplicativo (CRM) vive em **outro repositório e outro projeto da Vercel**, em
`app.plataformalotti.com.br`. Todo botão de "Entrar" / "Acessar plataforma"
aponta para lá — nunca para uma rota interna deste site.

## Comandos

```bash
npm run dev           # desenvolvimento
npm run build         # build de produção
npm run lint          # eslint
npm run test:visual   # testes de marca/layout — exigem servidor no ar
```

`npm test` roda os testes de validação do checkout e do cliente da API da Lotti (sem rede).

`test:visual` faz requisições HTTP contra um servidor já rodando. Ele usa
`http://localhost:3000` por padrão; aponte para outro endereço com
`TEST_BASE_URL`:

O checkout de planos está disponível em `/checkout`. A integração segura com
Asaas, a API da Lotti e o link de criação de senha está documentada em
[`docs/ASAAS_CHECKOUT.md`](docs/ASAAS_CHECKOUT.md).

```bash
npm run build && npx next start -p 3100
TEST_BASE_URL=http://localhost:3100 npm run test:visual
```

## Variáveis de ambiente

Configure na Vercel (Project → Settings → Environment Variables). **Nenhum
valor fica no repositório.** Variável nova só passa a valer em um deployment
novo — depois de criar, refaça o deploy.

| Nome | Obrigatória | Ambiente | Para que serve |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | **Sim, em produção** | Production | Chave da API do Resend. Sem ela o formulário de demonstração **não entrega o lead a ninguém**. |
| `RESEND_FROM` | Não | Production | Remetente do e-mail de lead. |

### `RESEND_API_KEY`

Lida em [`src/app/actions/schedule-demo.ts`](src/app/actions/schedule-demo.ts).
Ausente, a server action registra o lead em `console.error` (recuperável pelos
runtime logs da Vercel, dentro da retenção do plano) e devolve erro ao
visitante. Ela **não** finge sucesso — mas o lead não chega ao destino.

Para provisionar pelo Marketplace, que já cria a variável:

```bash
npx vercel integration add resend/resend-email
```

### `RESEND_FROM`

Opcional. Sem ela, o remetente cai no padrão `Lotti <onboarding@resend.dev>`,
que **serve só para teste e não para produção** — é o domínio compartilhado de
sandbox do Resend, com entregabilidade ruim e sem identidade da marca. Para
produção, verifique um domínio próprio no Resend e defina, por exemplo,
`Lotti <contato@plataformalotti.com.br>`.

## `src/config/site.ts`

Fonte única de verdade para contato, domínio e redes sociais. Header, footer,
CTAs, formulário, canonical, sitemap, robots, Open Graph e JSON-LD derivam
daqui — troque em um lugar só.

### Sentinela `PENDING`

Campos ainda não definidos ficam como `PENDING` (`"[PREENCHER]"`). Enquanto
estiverem assim, `whatsappUrl()` e `mailtoUrl()` devolvem `null` e os
componentes **omitem o link em vez de gerar um quebrado** (`wa.me/[PREENCHER]`).

Isso tem um efeito colateral a considerar: a mensagem de erro do formulário
convida a "falar com a gente pelo WhatsApp", então enquanto `whatsapp` estiver
`PENDING` o visitante que vê o erro fica sem canal nenhum.

### Campos travados

`domain` e `url` **não podem ser alterados isoladamente**: o CRM deriva dessas
URLs os QR Codes das fachadas e os links de indicação de parceiro. Mudar aqui
sem mudar lá quebra QR Code já impresso e link já distribuído.

O mesmo vale para `appUrl` (endereço do CRM): Header e Hero leem esse campo em
`siteConfig`, sem manter cópias do domínio nos componentes.

Os códigos dos planos (`essencial`, `profissional`, `imobiliaria`, em
[`src/content/pricing.ts`](src/content/pricing.ts)) são chave primária no banco
do CRM (`plans.code`). Nome de exibição e descrição podem mudar livremente; o
**código**, não.

## Marca e prints do produto

Os arquivos oficiais já estão no repositório:

- `public/brand/` — assinaturas e símbolo em SVG, consumidos por
  [`Logo.tsx`](src/components/brand/Logo.tsx) e
  [`LottiMark.tsx`](src/components/brand/LottiMark.tsx).
- `public/product/` — capturas reais do CRM, consumidas por
  [`ProductCarousel.tsx`](src/components/ui/ProductCarousel.tsx) e
  [`ProductShot.tsx`](src/components/ui/ProductShot.tsx).

`tests/visual-brand.test.mjs` existe para proteger isso — ele falha se o site
parar de servir a assinatura correta ou trocar um print real por placeholder.

Nunca gere telas fictícias nem invente números de dashboard: quando não houver
print, `ProductShot` desenha a moldura de sistema do manual, que mostra
estrutura de interface sem dado inventado.

## Domínios

| Domínio | Projeto |
| --- | --- |
| `plataformalotti.com.br`, `www.` | `lotti-site` — este repositório |
| `app.plataformalotti.com.br` | `olivercrm` — o CRM, outro repositório |

Não use `lotti.com.br`: pertence a outro negócio (Lotti e Araújo Advogados).
