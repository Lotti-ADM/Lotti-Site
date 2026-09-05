"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const CAROUSEL_INTERVAL_MS = 3_500;

export const PRODUCT_SCREENSHOTS = [
  {
    src: "/product/tela-inicio.png",
    alt: "Tela inicial da Lotti",
  },
  {
    src: "/product/tela-clientes.png",
    alt: "Lista de clientes da Lotti",
  },
  {
    src: "/product/tela-imoveis.png",
    alt: "Lista de imóveis da Lotti",
  },
  {
    src: "/product/tela-funil.png",
    alt: "Funil de vendas da Lotti em quadro Kanban",
  },
  {
    src: "/product/tela-alugueis.png",
    alt: "Gestão de aluguéis da Lotti",
  },
  {
    src: "/product/tela-financeiro.png",
    alt: "Painel financeiro da Lotti",
  },
  {
    src: "/product/tela-juridico.png",
    alt: "Painel jurídico da Lotti",
  },
  {
    src: "/product/tela-midias.png",
    alt: "Biblioteca de mídias da Lotti",
  },
  {
    src: "/product/tela-fachadas.png",
    alt: "Fachadas Inteligentes da Lotti com QR Code",
  },
  {
    src: "/product/tela-assistente-ia.png",
    alt: "Assistente de IA da Lotti",
  },
] as const;

type ProductCarouselProps = {
  className?: string;
  sizes: string;
};

export function ProductCarousel({ className, sizes }: ProductCarouselProps) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [previousScreenIndex, setPreviousScreenIndex] = useState<number | null>(null);
  const [currentLoaded, setCurrentLoaded] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const screen = PRODUCT_SCREENSHOTS[screenIndex];
  const previousScreen = previousScreenIndex === null
    ? null
    : PRODUCT_SCREENSHOTS[previousScreenIndex];

  // O carrossel só gira enquanto está na tela e a aba está em primeiro plano:
  // fora disso cada troca custava um PNG novo e um repaint por nada.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let interval: number | null = null;

    const stop = () => {
      if (interval === null) return;
      window.clearInterval(interval);
      interval = null;
    };

    const start = () => {
      if (interval !== null) return;
      interval = window.setInterval(() => {
        setScreenIndex((current) => {
          setPreviousScreenIndex(current);
          setCurrentLoaded(false);
          return (current + 1) % PRODUCT_SCREENSHOTS.length;
        });
      }, CAROUSEL_INTERVAL_MS);
    };

    // Começa girando: se o IntersectionObserver não responder, o carrossel
    // cai no comportamento antigo em vez de congelar.
    let onScreen = true;
    const sync = () => (onScreen && !document.hidden ? start() : stop());
    sync();

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(frame);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, []);

  useEffect(() => {
    if (previousScreenIndex === null || !currentLoaded) return;

    const timeout = window.setTimeout(() => setPreviousScreenIndex(null), 500);
    return () => window.clearTimeout(timeout);
  }, [currentLoaded, previousScreenIndex]);

  return (
    <div
      ref={frameRef}
      className={[
        "relative w-full overflow-hidden border border-line bg-paper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: "2 / 1" }}
      data-product-carousel=""
      data-carousel-interval={CAROUSEL_INTERVAL_MS}
    >
      {previousScreen ? (
        <Image
          src={previousScreen.src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover object-left-top transition-opacity duration-500"
        />
      ) : null}
      <Image
        key={screen.src}
        src={screen.src}
        alt={screen.alt}
        fill
        priority={screenIndex === 0}
        sizes={sizes}
        onLoad={() => setCurrentLoaded(true)}
        className={[
          "object-cover object-left-top transition-opacity duration-500",
          currentLoaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </div>
  );
}
