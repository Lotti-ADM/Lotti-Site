import { RollButton } from "@/components/ui/RollButton";
import { BeamsBackground } from "@/components/ui/beams-background";
import { hero } from "@/content/landing";
import { HeroDemo } from "@/components/site/HeroDemo";

/**
 * O hero é o LCP da página.
 * O BeamsBackground cria um fundo escuro (verde-floresta Lotti #03130d)
 * com feixes de luz esmeralda que sobem suavemente.  O conteúdo usa as
 * variantes de botão "inverted" e texto branco para manter legibilidade
 * sobre a superfície escura — igual ao header pill.
 *
 * Performance: uses CSS animations instead of framer-motion to avoid
 * shipping ~40KB of JS for a simple fade-in. The hero-entrance animation
 * is defined in globals.css.
 */
export function Hero() {
  return (
    <BeamsBackground
      className="pt-[calc(var(--header-h)+clamp(2rem,4vw,3rem))] pb-[clamp(4rem,8vw,7rem)]"
      intensity="medium"
    >
      <div
        className="on-ink shell flex flex-col items-center text-center hero-entrance"
      >
        <div className="flex w-full flex-col items-center">
          <h1 className="max-w-[22ch] text-display text-balance text-gradient text-gradient-forest lg:max-w-none">
            <span aria-label={hero.headline[0]} className="block lg:whitespace-nowrap">{hero.headline[0]}</span>
            <span aria-label={hero.headline[1]} className="block pb-2 lg:whitespace-nowrap">{hero.headline[1]}</span>
          </h1>

          <p className="mt-6 max-w-[64ch] text-lead text-muted text-white/60">{hero.lead}</p>

          <div className="mt-8 flex w-full flex-col items-center" data-hero-actions="">
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <RollButton href="#agente" variant="primary" arrow className="w-full sm:w-auto">
                {hero.primaryCta}
              </RollButton>
              <RollButton href="#como-funciona" variant="ghost" className="w-full sm:w-auto">
                {hero.secondaryCta}
              </RollButton>
            </div>
            <p className="mt-5 text-small text-white/40">{hero.footnote}</p>
          </div>
        </div>

        {/* Demonstração do produto em interface desenhada em código */}
        <div data-hero-video="" className="relative mt-8 w-[min(94vw,1100px)] max-w-none pt-4 sm:mt-10 sm:pt-6">
          <div className="hero-product-glow" aria-hidden="true" />
          <HeroDemo />
        </div>
      </div>
    </BeamsBackground>
  );
}
