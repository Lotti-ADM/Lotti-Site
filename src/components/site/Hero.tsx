import { Button } from "@/components/ui/Button";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { hero } from "@/content/landing";

/**
 * O hero é o LCP da página: nada aqui entra com fade ou observer.
 * O campo de lâminas ao fundo é a geometria do símbolo virando estrutura.
 */
export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-[calc(var(--header-h)+clamp(2rem,4vw,3rem))] pb-[clamp(4rem,8vw,7rem)] hero-mesh">
      <div className="shell relative z-10 flex flex-col items-center text-center">
        {/* Sem espaco morto na dobra: o que espia no rodape da tela e o
            print do app. */}
        <div className="flex w-full flex-col items-center">
          <p className="eyebrow">{hero.eyebrow}</p>

          <h1 className="mt-7 max-w-[22ch] text-display text-balance lg:max-w-none">
            <span aria-label={hero.headline[0]} className="block text-gradient-forest lg:whitespace-nowrap">{hero.headline[0]}</span>
            <span aria-label={hero.headline[1]} className="block text-gradient-forest pb-2 lg:whitespace-nowrap">{hero.headline[1]}</span>
          </h1>

          <p className="mt-6 max-w-[64ch] text-lead text-muted">{hero.lead}</p>

          <div className="mt-8 flex w-full flex-col items-center" data-hero-actions="">
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button href="https://olivercrm.vercel.app/" arrow className="btn-shimmer w-full shadow-lg sm:w-auto" target="_blank" rel="noopener noreferrer">
                {hero.primaryCta}
              </Button>
              <Button
                href="#recursos"
                variant="secondary"
                className="glass w-full transition-transform hover:scale-105 sm:w-auto"
              >
                {hero.secondaryCta}
              </Button>
            </div>
            <p className="mt-5 text-small text-muted">{hero.footnote}</p>
          </div>
        </div>

        {/* Quadro do produto na proporcao da referencia: no video o painel
            ocupa ~91% da largura da janela, entao ele estoura o shell em vez
            de respeitar o padding dele. */}
        <div className="relative mt-12 w-[min(91vw,1400px)] max-w-none pt-8 sm:mt-16 sm:pt-10 perspective-[2000px]">
          <BladeField />
          <div className="hero-product-glow" aria-hidden="true" />
          <div className="relative z-10 transform-gpu transition-all duration-700 hover:rotate-x-[1deg] hover:rotate-y-[-1deg] hover:scale-[1.005]">
            <ProductCarousel
              sizes="(max-width: 1400px) 91vw, 1400px"
              className="shadow-[0_28px_80px_rgba(9,51,35,0.18)]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

/**
 * Três lâminas ascendentes no ângulo do símbolo. Puramente decorativas:
 * ficam atrás do conteúdo, repetem o degradê preto-verde-preto da marca e
 * descem além do quadro do produto.
 */
function BladeField() {
  // Larguras e folgas na proporção do símbolo: lâminas grossas, respiro fino,
  // espaçamento regular; as duas últimas têm o mesmo comprimento.
  const blades = [
    { left: "62%", width: "5rem", top: "-26%", height: "126%" },
    { left: "70%", width: "5rem", top: "-10%", height: "110%" },
    { left: "78%", width: "5rem", top: "-10%", height: "126%" },
  ];

  return (
    <div className="blade-field -bottom-[38%]" aria-hidden="true">
      {blades.map((blade) => (
        <span key={blade.left} className="blade" style={blade} />
      ))}
    </div>
  );
}
