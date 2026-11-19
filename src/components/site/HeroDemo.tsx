"use client";

import { CalendarCheck, Check, Sparkles } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { useDemoLoop } from "@/components/site/useDemoLoop";

/*
 * Demonstração do produto no hero, desenhada em HTML (não é print nem vídeo):
 * o lead chega no WhatsApp, o agente qualifica e o card anda no funil até a visita.
 * Roda em loop (useDemoLoop); a transição de cada passo está em .hero-demo-step.
 */

function Step({ on, className = "", children }: { on: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`hero-demo-step ${className}`} data-on={on}>
      {children}
    </div>
  );
}

const bubble = "w-fit max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-snug";
const lead = "Mariana R.";

function Card({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <div className={`rounded-lg border p-2.5 ${active ? "border-forest/40 bg-paper shadow-md" : "border-line bg-paper"}`}>
      {children}
    </div>
  );
}

// Ordem dos passos: 1 msg, 2 card Novo, 3 agente, 4 msg, 5 Qualificado, 6 agente, 7 msg, 8 Visita.
const TOTAL = 8;

export function HeroDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useDemoLoop(ref, TOTAL, 900);
  const columns = [
    { title: "Novo", others: ["João S."] },
    { title: "Qualificado", others: ["Ana L."] },
    { title: "Visita agendada", others: [] as string[] },
  ];

  return (
    <div
      ref={ref}
      data-hero-demo=""
      data-demo-loop=""
      role="img"
      aria-label="Demonstração da Lotti: o agente de IA atende o lead no WhatsApp, qualifica e agenda a visita no funil"
      className="hero-demo relative z-10 overflow-hidden rounded-xl border border-white/10 bg-surface text-left text-ink shadow-[0_28px_80px_rgba(0,0,0,0.4)]"
    >
      <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-line bg-paper px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 text-[12px] text-muted">Lotti · Atendimento e funil</span>
      </div>

      <div aria-hidden="true" className="grid gap-4 p-4 md:grid-cols-[1fr_1.4fr] md:p-6">
        {/* Conversa no WhatsApp */}
        <div className="min-h-[300px] rounded-xl bg-paper p-4">
          <p className="flex items-center gap-2 border-b border-line pb-2 text-[12px] text-muted">
            <span className="h-2 w-2 rounded-full bg-forest" /> WhatsApp · Agente Lotti
            <span className="ml-auto">agora</span>
          </p>
          <div className="mt-3 space-y-2">
            <Step on={p >= 1}><p className={`${bubble} ml-auto bg-forest text-white`}>Oi! Vi o apê da Rua 9 no portal</p></Step>
            <Step on={p >= 3}><p className={`${bubble} bg-surface`}>Olá, Mariana! Você procura para comprar ou alugar?</p></Step>
            <Step on={p >= 4}><p className={`${bubble} ml-auto bg-forest text-white`}>Alugar, 2 quartos, até R$ 3 mil</p></Step>
            <Step on={p >= 6}><p className={`${bubble} bg-surface`}>Perfeito. Tenho sábado às 10h para a visita, pode ser?</p></Step>
            <Step on={p >= 7}><p className={`${bubble} ml-auto bg-forest text-white`}>Pode sim!</p></Step>
          </div>
        </div>

        {/* Funil */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {columns.map((col, i) => (
            <div key={col.title} className="rounded-xl bg-paper/60 p-2 md:p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">{col.title}</p>
              <div className="space-y-2">
                {i === 0 && (
                  <Step on={p >= 2} className={p >= 5 ? "opacity-35" : ""}>
                    <Card><p className="text-[12px] font-semibold">{lead}</p><p className="text-[11px] text-muted">Novo lead</p></Card>
                  </Step>
                )}
                {i === 1 && (
                  <Step on={p >= 5} className={p >= 8 ? "opacity-35" : ""}>
                    <Card active={p < 8}>
                      <p className="flex items-center gap-1 text-[12px] font-semibold"><Sparkles className="h-3 w-3 text-forest" />{lead}</p>
                      <p className="text-[11px] text-muted">Aluguel · 2 quartos · até R$ 3 mil</p>
                    </Card>
                  </Step>
                )}
                {i === 2 && (
                  <Step on={p >= 8}>
                    <Card active>
                      <p className="flex items-center gap-1 text-[12px] font-semibold"><CalendarCheck className="h-3 w-3 text-forest" />{lead}</p>
                      <p className="flex items-center gap-1 text-[11px] text-forest"><Check className="h-3 w-3" />Sáb, 10h</p>
                    </Card>
                  </Step>
                )}
                {col.others.map((n) => (
                  <Card key={n}><p className="text-[12px] font-semibold">{n}</p><span className="mt-1 block h-1 w-2/3 rounded bg-line" /></Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
