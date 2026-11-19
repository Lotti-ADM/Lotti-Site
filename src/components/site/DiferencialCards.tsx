"use client";

import { type ReactNode, useRef } from "react";
import { differentiators } from "@/content/landing";
import { useDemoLoop } from "@/components/site/useDemoLoop";

/*
 * Os diferenciais do agente em cards coloridos. Cada ilustração fica sobre uma forma
 * própria (círculo, nuvem, arco, cruz) e roda em loop só na tela. Dados fictícios.
 */

const cores = ["bg-[#dcefe5]", "bg-[#f3ead6]", "bg-[#dde9f5]", "bg-[#e8e1f2]"];

function Circulo() {
  return <span className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/70" />;
}
function Nuvem() {
  return (
    <span className="absolute inset-0">
      <span className="absolute left-[18%] top-[22%] h-32 w-32 rounded-full bg-paper/70" />
      <span className="absolute left-[38%] top-[8%] h-40 w-40 rounded-full bg-paper/70" />
      <span className="absolute right-[14%] top-[26%] h-32 w-32 rounded-full bg-paper/70" />
      <span className="absolute bottom-[10%] left-[30%] h-28 w-36 rounded-full bg-paper/70" />
    </span>
  );
}
function Arco() {
  return <span className="absolute bottom-0 left-1/2 h-[88%] w-[78%] -translate-x-1/2 rounded-t-full bg-paper/70" />;
}
function Cruz() {
  return (
    <span className="absolute inset-0">
      <span className="absolute left-1/2 top-1/2 h-16 w-[86%] -translate-x-1/2 -translate-y-1/2 rotate-[38deg] rounded-full bg-paper/70" />
      <span className="absolute left-1/2 top-1/2 h-16 w-[86%] -translate-x-1/2 -translate-y-1/2 -rotate-[38deg] rounded-full bg-paper/70" />
    </span>
  );
}

function Passo({ on, children, className = "" }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={`hero-demo-step ${className}`} data-on={on}>
      {children}
    </div>
  );
}

const bolha = "w-fit rounded-xl px-3 py-1.5 text-[12px] leading-snug shadow-sm";

/* 1. Perguntas que ajudam: as perguntas do agente entram em sequência. */
function Perguntas({ p }: { p: number }) {
  const perguntas = ["Compra ou aluguel?", "Qual região?", "Até quanto por mês?", "Para quando?"];
  return (
    <div className="relative flex flex-col items-start gap-2">
      {perguntas.map((q, i) => (
        <Passo key={q} on={p > i} className={i % 2 ? "ml-6" : ""}>
          <p className={`${bolha} bg-paper text-ink`}>{q}</p>
        </Passo>
      ))}
    </div>
  );
}

/* 2. Linguagem simples: o interessado fala do jeito dele e o agente confirma. */
function Simples({ p }: { p: number }) {
  return (
    <div className="relative flex w-56 flex-col gap-2">
      <Passo on={p >= 1}>
        <p className={`${bolha} bg-paper text-ink`}>quero algo perto do metrô, sem muito barulho</p>
      </Passo>
      <Passo on={p >= 2} className="self-end">
        <p className={`${bolha} bg-forest text-white`}>Entendi: perto do metrô e em rua tranquila, certo?</p>
      </Passo>
      <Passo on={p >= 3}>
        <p className={`${bolha} bg-paper text-ink`}>isso!</p>
      </Passo>
    </div>
  );
}

/* 3. Corretor no controle: o lead pede um humano e o corretor assume. */
function Controle({ p }: { p: number }) {
  const assumiu = p >= 2;
  return (
    <div className="relative w-52 rounded-2xl bg-paper p-3 text-ink shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
      <p className="text-[11px] text-muted">Mariana R.</p>
      <Passo on={p >= 1}>
        <p className="mt-1 text-[12px] font-semibold">“Posso falar com o corretor?”</p>
      </Passo>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-surface px-2.5 py-2 text-[11px]">
        <span className="font-semibold">{assumiu ? "Corretor assumiu" : "Agente atendendo"}</span>
        <span className={`relative h-4 w-7 rounded-full transition-colors duration-500 ${assumiu ? "bg-forest" : "bg-line"}`}>
          <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-paper transition-all duration-500 ${assumiu ? "left-3.5" : "left-0.5"}`} />
        </span>
      </div>
      <Passo on={p >= 3}>
        <p className="mt-2 text-[11px] text-forest">Rafael continua daqui, com o histórico.</p>
      </Passo>
    </div>
  );
}

/* 4. Contexto: o resumo se monta e vai para o CRM. */
function Contexto({ p }: { p: number }) {
  const campos = [
    ["Procura", "Aluguel, 2 quartos"],
    ["Região", "Centro"],
    ["Até", "R$ 2.800/mês"],
  ];
  return (
    <div className="relative w-52 rounded-2xl bg-paper p-3 text-ink shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Resumo</p>
      <div className="mt-2 space-y-1.5">
        {campos.map(([k, v], i) => (
          <Passo key={k} on={p > i} className="flex justify-between gap-2 text-[12px]">
            <span className="text-muted">{k}</span>
            <span className="font-semibold">{v}</span>
          </Passo>
        ))}
      </div>
      <Passo on={p >= 4}>
        <p className="mt-2.5 rounded-lg bg-forest px-2 py-1.5 text-center text-[11px] font-semibold text-white">Resumo no CRM</p>
      </Passo>
    </div>
  );
}

const cards = [
  { forma: <Circulo />, total: 4, desenho: (p: number) => <Perguntas p={p} /> },
  { forma: <Nuvem />, total: 3, desenho: (p: number) => <Simples p={p} /> },
  { forma: <Arco />, total: 3, desenho: (p: number) => <Controle p={p} /> },
  { forma: <Cruz />, total: 4, desenho: (p: number) => <Contexto p={p} /> },
];

// Recebe só o índice: o item de conteúdo carrega um ícone (função), que não cruza do servidor para o cliente.
export function DiferencialCard({ index }: { index: number }) {
  const item = differentiators.items[index];
  const card = cards[index];
  const ref = useRef<HTMLDivElement>(null);
  const p = useDemoLoop(ref, card.total, 1200, 3);

  return (
    <article data-card-diferencial="" className={`flex h-full flex-col rounded-[28px] p-6 sm:p-7 ${cores[index]}`}>
      <div
        ref={ref}
        data-demo-loop=""
        aria-hidden="true"
        className="relative flex h-60 items-center justify-center overflow-hidden"
      >
        {card.forma}
        {card.desenho(p)}
      </div>
      <h3 className="mt-6 text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.02em] text-ink text-balance">{item.title}</h3>
      <p className="mt-3 text-small text-ink/70">{item.description}</p>
    </article>
  );
}
