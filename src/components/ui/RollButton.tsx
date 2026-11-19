"use client";

import type { PointerEvent } from "react";

/*
 * Botão do hero: no hover o texto rola para cima, a seta sai e entra outra,
 * o principal ganha um brilho que segue o mouse e o de contorno enche a partir do cursor.
 * Estilos em .btn-roll (globals.css).
 */

function Seta() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

// Guarda a posição do mouse no botão para o brilho e o preenchimento partirem dali.
function marcarCursor(e: PointerEvent<HTMLAnchorElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function RollButton({
  href,
  children,
  variant,
  arrow = false,
  className = "",
}: {
  href: string;
  children: string;
  variant: "primary" | "ghost";
  arrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={children}
      onPointerEnter={marcarCursor}
      onPointerMove={marcarCursor}
      className={`btn-roll btn-roll--${variant} ${className}`}
    >
      <span className="btn-roll__fill" aria-hidden="true" />
      <span className="btn-roll__texto" aria-hidden="true">
        <span data-text={children}>{children}</span>
      </span>
      {arrow && (
        <span className="btn-roll__seta" aria-hidden="true">
          <Seta />
          <Seta />
        </span>
      )}
    </a>
  );
}
