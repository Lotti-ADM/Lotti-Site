import { Button } from "@/components/ui/Button";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { hero } from "@/content/landing";
import { Banknote, Building2, FileSignature, KanbanSquare } from "lucide-react";

/**
 * O hero é o LCP da página: nada aqui entra com fade ou observer.
 * O campo de lâminas ao fundo é a geometria do símbolo virando estrutura.
 */
import { TextReveal } from "@/components/ui/TextReveal";

const capabilityIcons = [KanbanSquare, FileSignature, Building2, Banknote] as const;

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-[calc(var(--header-h)+clamp(4rem,8vw,7rem))] pb-[clamp(4rem,8vw,7rem)] hero-mesh">
      <div className="shell relative z-10 flex flex-col items-center text-center">
        <p className="eyebrow">{hero.eyebrow}</p>

        <h1 className="mt-7 max-w-[22ch] text-display text-balance lg:max-w-none">
          <TextReveal as="span" className="block text-gradient-forest lg:whitespace-nowrap" text={hero.headline[0]} delay={100} />
          <TextReveal as="span" className="block text-gradient-forest pb-2 lg:whitespace-nowrap" text={hero.headline[1]} delay={300} />
        </h1>

        <TextReveal
          as="p"
          text={hero.lead}
          delay={500}
          className="mt-6 max-w-[64ch] text-lead text-muted"
        />

        <ul
          className="mt-10 grid w-full max-w-5xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Principais funcionalidades"
          data-hero-capabilities=""
        >
          {hero.capabilities.map((capability, index) => {
            const Icon = capabilityIcons[index];
            return (
              <li
                key={capability.title}
                className="group flex min-h-24 items-center gap-3.5 rounded-2xl border border-line bg-paper/85 p-4 shadow-[0_12px_35px_rgba(9,51,35,0.07)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-paper shadow-sm">
                  <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-small font-semibold text-ink">{capability.title}</strong>
                  <span className="mt-1 block text-[0.75rem] leading-5 text-muted">{capability.description}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-11 flex w-full flex-col items-center" data-hero-actions="">
          <span className="mb-7 h-px w-24 bg-gradient-to-r from-transparent via-forest/40 to-transparent" aria-hidden="true" />
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
