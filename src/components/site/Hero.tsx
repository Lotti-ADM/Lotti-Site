import { Button } from "@/components/ui/Button";
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
          {/* O degrade fica no h1 inteiro: assim ele varre as duas linhas de
              uma vez, em vez de recomecar em cada uma. */}
          <h1 className="max-w-[22ch] text-display text-balance text-gradient-forest lg:max-w-none">
            <span aria-label={hero.headline[0]} className="block lg:whitespace-nowrap">{hero.headline[0]}</span>
            <span aria-label={hero.headline[1]} className="block pb-2 lg:whitespace-nowrap">{hero.headline[1]}</span>
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

        {/* Video do produto no lugar do carrossel de prints. Fica perto da
            borda, mas nao colado: a gravacao e quase quadrada (1400x1034),
            entao cada 100px de largura custam 74px de altura. */}
        <div className="relative mt-8 w-[min(92vw,1150px)] max-w-none pt-4 sm:mt-10 sm:pt-6">
          <div className="hero-product-glow" aria-hidden="true" />
          <video
            data-hero-video=""
            className="relative z-10 w-full border border-line bg-paper shadow-[0_28px_80px_rgba(9,51,35,0.18)]"
            src="/product/hero-demo.mp4"
            poster="/product/hero-demo-poster.jpg"
            style={{ aspectRatio: "1400 / 1034" }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Demonstracao da plataforma Lotti"
          />
        </div>

      </div>
    </section>
  );
}
