import { Button } from "@/components/ui/Button";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { hero } from "@/content/landing";

/**
 * O hero é o LCP da página: nada aqui entra com fade ou observer.
 * O campo de lâminas ao fundo é a geometria do símbolo virando estrutura.
 */
import { TextReveal } from "@/components/ui/TextReveal";

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4.5rem))] pb-[clamp(4rem,8vw,7rem)] hero-mesh">
      <div className="shell relative z-10 flex flex-col items-center text-center">
        <p className="eyebrow">{hero.eyebrow}</p>

        <h1 className="mt-6 max-w-[19ch] text-display text-balance">
          <TextReveal as="span" className="block text-ink" text={hero.headline[0]} delay={100} />
          <TextReveal as="span" className="block text-gradient-forest pb-2" text={hero.headline[1]} delay={300} />
        </h1>

        <TextReveal
          as="p"
          text={hero.lead}
          delay={500}
          className="mt-6 max-w-[64ch] text-lead text-muted"
        />

        <ul className="mt-7 flex max-w-4xl flex-wrap justify-center gap-2.5" aria-label="Principais funcionalidades">
          {hero.capabilities.map((capability) => (
            <li
              key={capability}
              className="rounded-full border border-forest/15 bg-paper/80 px-4 py-2 text-small font-medium text-ink shadow-sm backdrop-blur-sm"
            >
              {capability}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
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

        <div className="relative mt-12 w-full pt-8 sm:mt-16 sm:pt-10 perspective-[2000px]">
          <BladeField />
          <div className="hero-product-glow" aria-hidden="true" />
          <div className="relative z-10 transform-gpu transition-all duration-700 hover:rotate-x-[1deg] hover:rotate-y-[-1deg] hover:scale-[1.005]">
            <ProductCarousel
              sizes="(max-width: 1216px) 100vw, 1216px"
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
 * ficam atrás do conteúdo e repetem o degradê preto-verde-preto da marca.
 */
function BladeField() {
  // Larguras e folgas na proporção do símbolo: lâminas grossas, respiro fino,
  // espaçamento regular; as duas últimas têm o mesmo comprimento.
  const blades = [
    { left: "62%", width: "5rem", top: "-26%", height: "96%" },
    { left: "70%", width: "5rem", top: "-10%", height: "80%" },
    { left: "78%", width: "5rem", top: "-10%", height: "96%" },
  ];

  return (
    <div className="blade-field" aria-hidden="true">
      {blades.map((blade) => (
        <span key={blade.left} className="blade" style={blade} />
      ))}
    </div>
  );
}
