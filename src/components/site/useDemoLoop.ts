"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * Passo atual de uma demonstração em loop: 0..total, segura no fim e recomeça.
 * Começa no quadro final (é o que o HTML do servidor e quem pede menos movimento veem)
 * e só anima enquanto `ref` está na tela, para a página não pesar ao rolar.
 */
export function useDemoLoop(ref: RefObject<Element | null>, total: number, msPorPasso = 800, pausaFinal = 4) {
  const [passo, setPasso] = useState(total);
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { rootMargin: "100px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!naTela) return;
    let tick = 0;
    const ciclo = total + 1 + pausaFinal;
    setPasso(0);
    const id = setInterval(() => {
      tick = (tick + 1) % ciclo;
      setPasso(Math.min(tick, total));
    }, msPorPasso);
    return () => clearInterval(id);
  }, [naTela, total, msPorPasso, pausaFinal]);

  return passo;
}
