"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BeamsBackground } from "@/components/ui/beams-background";
import { hero } from "@/content/landing";

/**
 * O hero é o LCP da página.
 * O BeamsBackground cria um fundo escuro (verde-floresta Lotti #03130d)
 * com feixes de luz esmeralda que sobem suavemente.  O conteúdo usa as
 * variantes de botão "inverted" e texto branco para manter legibilidade
 * sobre a superfície escura — igual ao header pill.
 */
export function Hero() {
  return (
    <BeamsBackground
      className="pt-[calc(var(--header-h)+clamp(2rem,4vw,3rem))] pb-[clamp(4rem,8vw,7rem)]"
      intensity="medium"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
        className="on-ink shell flex flex-col items-center text-center"
      >
        <div className="flex w-full flex-col items-center">
          <h1 className="max-w-[22ch] text-display text-balance text-gradient lg:max-w-none">
            <span aria-label={hero.headline[0]} className="block lg:whitespace-nowrap">{hero.headline[0]}</span>
            <span aria-label={hero.headline[1]} className="block pb-2 lg:whitespace-nowrap">{hero.headline[1]}</span>
          </h1>

          <p className="mt-6 max-w-[64ch] text-lead text-white/60">{hero.lead}</p>

          <div className="mt-8 flex w-full flex-col items-center" data-hero-actions="">
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button href="#agente" variant="inverted" arrow className="btn-shimmer w-full shadow-lg sm:w-auto">
                {hero.primaryCta}
              </Button>
              <Button
                href="#como-funciona"
                variant="inverted-ghost"
                className="w-full transition-transform hover:scale-105 sm:w-auto"
              >
                {hero.secondaryCta}
              </Button>
            </div>
            <p className="mt-5 text-small text-white/40">{hero.footnote}</p>
          </div>
        </div>

        {/* Video do produto */}
        <div className="relative mt-8 w-[min(94vw,1280px)] max-w-none pt-4 sm:mt-10 sm:pt-6">
          <div className="hero-product-glow" aria-hidden="true" />
          <video
            data-hero-video=""
            className="relative z-10 w-full rounded-xl border border-white/10 bg-paper object-cover shadow-[0_28px_80px_rgba(0,0,0,0.4)]"
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
      </motion.div>
    </BeamsBackground>
  );
}
