import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000";

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  return { response, body: await response.text() };
}

test("serve as duas assinaturas lineares oficiais", async () => {
  const dark = await get("/brand/lotti-linear-dark.svg");
  const light = await get("/brand/lotti-linear-light.svg");

  assert.equal(dark.response.status, 200);
  assert.match(dark.body, /#093323/i);
  assert.match(
    dark.body,
    /stop-color="black"|stop-color="#000000"|<stop offset="1"\s*\/>/i,
  );

  assert.equal(light.response.status, 200);
  assert.match(light.body, /#093323/i);
  assert.match(light.body, /stop-color="white"|stop-color="#ffffff"/i);
});

test("renderiza a assinatura clara sobre as superfícies escuras", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  // Header em pílula escura, CTA final e rodapé: todos usam a versão branca.
  assert.doesNotMatch(body, /\/brand\/lotti-linear-dark\.svg/);
  assert.ok((body.match(/\/brand\/lotti-white\.svg/g) ?? []).length >= 3);
  assert.match(body, /<title>Lotti<\/title>/);
});

test("exibe o vídeo do produto no hero, mudo e em loop", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.match(body, /data-hero-video=""/);
  assert.match(body, /src="\/product\/hero-demo\.mp4"/);
  assert.match(body, /poster="\/product\/hero-demo-poster\.jpg"/);
  assert.match(body, /aspect-ratio:1400 \/ 1034/);
  // Sem áudio e sem controles: é decoração, não um player.
  assert.match(body, /muted/);
  assert.match(body, /loop/);
  assert.doesNotMatch(body, /<video[^>]*\scontrols/);

  const video = await fetch(`${baseUrl}/product/hero-demo.mp4`, { method: "HEAD" });
  assert.equal(video.status, 200);
  assert.match(video.headers.get("content-type") ?? "", /video\/mp4/);
});

test("usa verde Lotti no lado escuro do degradê do título do hero", async () => {
  const { body } = await get("/");
  const styles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(body, /text-gradient-forest/);
  assert.match(
    body,
    /aria-label="Gestão imobiliária completa\."/,
  );
  assert.match(
    styles,
    /\.text-gradient-forest\s*\{\s*background:\s*linear-gradient\(to right, #093323, #000000\)/,
  );
});

test("exibe a captura de Kanban no recurso de funil de vendas", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.match(body, /<img[^>]+funil-pipeline\.png/);
  assert.match(body, /<img(?=[^>]+funil-pipeline\.png)(?=[^>]+object-cover)/);
  assert.match(body, /aspect-ratio:1466 \/ 1267/);
  assert.match(
    body,
    /<article[^>]*class="[^"]*lg:grid-cols-2/,
  );

  const image = await fetch(`${baseUrl}/product/funil-pipeline.png`, { method: "HEAD" });
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type") ?? "", /image\/png/);
});

test("exibe a captura real do app no recurso de fachadas", async () => {
  const { response, body } = await get("/");

  assert.equal(response.status, 200);
  assert.match(body, /<img[^>]+fachadas-painel\.png/);
  assert.match(body, /<img(?=[^>]+fachadas-painel\.png)(?=[^>]+object-cover)/);
  assert.match(body, /aspect-ratio:1462 \/ 1267/);
  assert.match(body, /leading-\[1\.15\] pt-1/);

  const image = await fetch(`${baseUrl}/product/fachadas-painel.png`, { method: "HEAD" });
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type") ?? "", /image\/png/);
});

test("preenche o carrossel sem lacunas e remove os quadros do CTA", async () => {
  const { body } = await get("/");
  const marqueeCopies = body.match(/data-marquee-copy=/g) ?? [];
  const trustCards = body.match(/data-trust-card=/g) ?? [];
  const reassuranceItems = body.match(/data-reassurance-item=/g) ?? [];

  assert.equal(marqueeCopies.length, 2);
  assert.equal(trustCards.length, 12);
  assert.equal(reassuranceItems.length, 0);
  assert.match(body, /data-final-logo=""/);
  assert.doesNotMatch(
    body,
    /data-final-logo=""[^>]*class="[^"]*hover:scale-105/,
  );
});

test("mantém o selo do plano destacado fora da camada que recorta o efeito", async () => {
  const { response, body } = await get("/planos");

  assert.equal(response.status, 200);
  assert.match(
    body,
    /data-pricing-card="highlighted"[^>]*class="[^"]*overflow-visible/,
  );
  assert.match(
    body,
    /data-pricing-beam=""[^>]*class="[^"]*border-beam-wrapper/,
  );
});

test("apresenta os limites comerciais revisados nos três planos", async () => {
  const { response, body } = await get("/planos");

  assert.equal(response.status, 200);
  for (const content of [
    "Até 5 imóveis ativos",
    "Até 5 contratos de aluguel ativos",
    "10 gerações ou análises de contrato com IA por mês",
    "Suporte por e-mail",
    "Até 20 imóveis ativos",
    "Até 15 contratos de aluguel ativos",
    "20 Fachadas Inteligentes",
    "Até 100 imóveis ativos",
    "Até 100 contratos de aluguel ativos",
    "60 gerações ou análises de contrato com IA por mês",
  ]) {
    assert.ok(body.includes(content), `faltando conteúdo do plano: ${content}`);
  }
});

test("oferece somente os três planos com os novos valores mensais", async () => {
  const { response, body } = await get("/planos");
  const renderedText = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  assert.equal(response.status, 200);
  assert.match(renderedText, /Lotti Essencial[\s\S]*?R\$ 129/);
  assert.match(renderedText, /Lotti Profissional[\s\S]*?R\$ 249/);
  assert.match(renderedText, /Lotti Imobiliária[\s\S]*?R\$ 499/);
  assert.doesNotMatch(renderedText, /Enterprise/i);
});

test("usa o símbolo oficial da Lotti no ícone da aba", async () => {
  const icon = await readFile(
    new URL("../src/app/icon.svg", import.meta.url),
    "utf8",
  );

  assert.match(icon, /M124\.5 74\.5L0 187\.5/);
  assert.match(icon, /stop-color="#093323"/);
  assert.match(icon, /stop-color="#000000"/);
});

test("mantém o seletor de planos próximo do título da seção", async () => {
  const pricingCards = await readFile(
    new URL("../src/components/site/pricing/PricingCards.tsx", import.meta.url),
    "utf8",
  );

  assert.match(pricingCards, /<section className="section pt-0 pb-16">/);
});

test("usa o verde Lotti como acento em ações e progresso", async () => {
  const styles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );
  const header = await readFile(
    new URL("../src/components/site/Header.tsx", import.meta.url),
    "utf8",
  );
  const steps = await readFile(
    new URL("../src/components/site/HowItWorks.tsx", import.meta.url),
    "utf8",
  );

  assert.match(styles, /--color-forest: #093323/);
  assert.match(
    styles,
    /\.btn-primary\s*\{\s*background: linear-gradient\(to right, var\(--color-forest\), var\(--color-ink\)\)/,
  );
  assert.match(
    styles,
    /\.eyebrow::before\s*\{[^}]*background: linear-gradient\(to right, var\(--color-forest\), var\(--color-ink\)\)/,
  );
  assert.match(
    styles,
    /\.link-underline::after\s*\{[^}]*background: linear-gradient\(to right, var\(--color-forest\), var\(--color-ink\)\)/,
  );
  // No header escuro o verde aparece como acento no botão "Entrar".
  assert.match(header, /bg-\[#093323\]/);
  assert.match(steps, /text-eyebrow uppercase text-forest/);
});

test("apresenta uma proposta de valor direta na página principal", async () => {
  const { response } = await get("/");
  const landing = await readFile(
    new URL("../src/content/landing.ts", import.meta.url),
    "utf8",
  );
  assert.equal(response.status, 200);
  for (const content of [
    "Tudo o que você precisa para captar, negociar e administrar imóveis.",
    "Não é um CRM genérico adaptado à sua rotina.",
    "Comece com o que precisa hoje. Evolua quando sua operação pedir.",
  ]) {
    assert.ok(landing.includes(content), `faltando copy estratégica: ${content}`);
  }
});

test("usa grafite no cabeçalho e verde Lotti no centro das lâminas", async () => {
  const styles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(
    styles,
    /\.header-pill\s*\{[\s\S]*?background:\s*linear-gradient\([\s\S]*?#000000[\s\S]*?#093323/,
  );
  assert.doesNotMatch(styles, /\.header-pill--top\s*\{[^}]*background:/s);
  assert.match(
    styles,
    /\.header-pill--scrolled\s*\{[^}]*rgba\(0, 0, 0, 0\.995\)[^}]*backdrop-filter:\s*blur\(24px\)/s,
  );
  assert.match(
    styles,
    /\.blade\s*\{[\s\S]*?background:\s*linear-gradient\([\s\S]*?#000000 1\.44231%[\s\S]*?#093323 50\.4808%[\s\S]*?#000000 100%[\s\S]*?\);/,
  );
  // A ponta da lâmina dissolve em vez de terminar num corte reto.
  assert.match(styles, /\.blade\s*\{[\s\S]*?mask-image:\s*linear-gradient\(to bottom/);
  assert.doesNotMatch(styles, /\.blade\s*\{[^}]*opacity:/s);
});

test("mantém o cabeçalho mais baixo e compacto", async () => {
  const header = await readFile(
    new URL("../src/components/site/Header.tsx", import.meta.url),
    "utf8",
  );

  assert.match(header, /justify-center pt-5/);
  assert.match(header, /rounded-full px-6 py-2 transition-all/);
  assert.doesNotMatch(header, /justify-center pt-3/);
  assert.doesNotMatch(header, /rounded-full px-6 py-3 transition-all/);
});

test("não usa mais o campo de lâminas no hero", async () => {
  const hero = await readFile(
    new URL("../src/components/site/Hero.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(hero, /BladeField|blade-field/);
});

test("mantém o lead do hero na largura de leitura", async () => {
  const hero = await readFile(
    new URL("../src/components/site/Hero.tsx", import.meta.url),
    "utf8",
  );

  assert.match(hero, /className="mt-6 max-w-\[64ch\] text-lead text-muted"/);
});

test("apresenta funcionalidades e produto na primeira dobra", async () => {
  const heroComponent = await readFile(
    new URL("../src/components/site/Hero.tsx", import.meta.url),
    "utf8",
  );
  const landing = await readFile(
    new URL("../src/content/landing.ts", import.meta.url),
    "utf8",
  );
  const styles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(heroComponent, /items-center text-center/);
  assert.match(heroComponent, /data-hero-actions/);
  // A faixa animada de funcionalidades foi removida do hero.
  assert.doesNotMatch(heroComponent, /hero-feature-track|hero-feature-viewport|HeroFeatureCopy/);
  assert.doesNotMatch(styles, /hero-feature-track|hero-feature-viewport/);
  assert.ok(
    heroComponent.indexOf("data-hero-actions") < heroComponent.indexOf("data-hero-video"),
    "as ações devem permanecer com a mensagem principal, antes do produto",
  );
  assert.match(
    heroComponent,
    /pt-\[calc\(var\(--header-h\)\+clamp\(2rem,4vw,3rem\)\)\]/,
  );
  assert.match(
    heroComponent,
    // O degradê cobre o h1 inteiro, não uma linha só.
    /<h1 className="[^"]*text-gradient-forest[^"]*"/,
  );
  assert.match(heroComponent, /hero-product-glow/);
  assert.match(heroComponent, /data-hero-video/);

  for (const capability of [
    "CRM imobiliário",
    "Contratos com IA",
    "Gestão de aluguéis",
    "Financeiro integrado",
    "Gestão de imóveis",
    "Funil de vendas",
    "Fachadas Inteligentes",
    "Assistente de IA",
    "Gestão jurídica",
    "Mídias com IA",
  ]) {
    assert.ok(landing.includes(capability), `funcionalidade ausente no hero: ${capability}`);
  }
});
