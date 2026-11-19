"use client";

import { QrCode } from "lucide-react";
import { type ReactNode, type RefObject, useRef } from "react";
import { useDemoLoop } from "@/components/site/useDemoLoop";

/*
 * Ilustrações da seção Recursos desenhadas em código, com dados fictícios e em loop.
 * Não usar prints do app aqui: eles mostram nomes, telefones e endereços de clientes reais.
 */

function Frame({ label, children, ref, ...data }: { label: string; children: ReactNode; ref: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      {...data}
      ref={ref}
      data-demo-loop=""
      role="img"
      aria-label={label}
      className="rounded-2xl border border-line bg-paper p-5 text-left text-ink shadow-[0_18px_50px_rgba(0,0,0,0.06)] sm:p-6"
    >
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

function Lead({ nome, detalhe, ativo }: { nome: string; detalhe: string; ativo?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 transition-colors ${ativo ? "border-forest bg-forest text-white" : "border-line bg-paper"}`}>
      <p className="text-[13px] font-semibold leading-tight">{nome}</p>
      <p className={`mt-0.5 text-[11px] leading-tight ${ativo ? "text-white/75" : "text-muted"}`}>{detalhe}</p>
    </div>
  );
}

/* Loop: o lead é qualificado (1) e anda para Visita agendada (2). */
export function FunilDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useDemoLoop(ref, 2, 1400, 2);
  const naVisita = p >= 2;

  const colunas = [
    { etapa: "Qualificação", fixo: ["Ana Exemplo", "Apto · Centro"], temBruno: !naVisita },
    { etapa: "Visita", fixo: ["Diego Fictício", "Sáb, 10h"], temBruno: naVisita },
    { etapa: "Proposta", fixo: ["Elisa Amostra", "R$ 380 mil"], temBruno: false },
  ];

  return (
    <Frame ref={ref} data-demo-funil="" label="Ilustração do funil de vendas: um lead fictício é qualificado e passa para a etapa de visita">
      <div className="grid grid-cols-3 gap-3">
        {colunas.map((col) => (
          <div key={col.etapa}>
            <p className="mb-3 flex items-center justify-between border-b border-line pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {col.etapa}
              <span className="tabular-nums">{1 + (col.temBruno ? 1 : 0)}</span>
            </p>
            <div className="space-y-2">
              {col.temBruno && (
                <div className="demo-enter" key={naVisita ? "visita" : "qualif"}>
                  <Lead nome="Bruno Teste" detalhe={naVisita ? "Seg, 15h" : p >= 1 ? "Qualificado" : "Casa · até R$ 450 mil"} ativo={p >= 1} />
                </div>
              )}
              <Lead nome={col.fixo[0]} detalhe={col.fixo[1]} />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* Loop: o QR da placa é lido (1), a leitura conta (2) e chega um lead (3). */
export function FachadasDemo() {
  // 1 celular lê o QR, 2 abre a página do imóvel, 3 toca em "Quero visitar", 4 o lead chega no painel.
  const ref = useRef<HTMLDivElement>(null);
  const p = useDemoLoop(ref, 4, 1500, 3);
  const tela = p >= 2 ? "imovel" : "camera";

  return (
    <Frame ref={ref} data-demo-fachadas="" label="Ilustração de Fachadas Inteligentes: um celular lê o QR Code de uma placa fictícia, abre a página do imóvel e o pedido de visita chega como lead">
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        {/* A placa */}
        <div className="w-28 shrink-0 rounded-xl bg-forest p-3 text-center text-white sm:w-32">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">À venda</p>
          <div
            key={p === 1 ? "lendo" : "parado"}
            className={`relative mx-auto mt-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-white ${p === 1 ? "demo-pulse" : ""}`}
          >
            <QrCode className="h-3/4 w-3/4 text-ink" strokeWidth={1.25} />
            {p === 1 && <span className="demo-scan absolute inset-x-1 h-0.5 rounded bg-forest shadow-[0_0_8px_var(--color-forest)]" />}
          </div>
          <p className="mt-2 text-[10px] text-white/80">Casa · Bairro Modelo</p>
        </div>

        {/* O celular de quem passa na rua */}
        <div data-demo-celular="" className="w-40 shrink-0 rounded-[26px] border-[5px] border-ink bg-ink sm:w-44">
          <div className="relative h-64 overflow-hidden rounded-[20px] bg-paper">
            {tela === "camera" ? (
              <div key="camera" className="demo-enter flex h-full flex-col items-center justify-center bg-ink/90 text-white">
                <div className="relative h-24 w-24">
                  <span className="absolute left-0 top-0 h-5 w-5 rounded-tl-md border-l-2 border-t-2 border-white" />
                  <span className="absolute right-0 top-0 h-5 w-5 rounded-tr-md border-r-2 border-t-2 border-white" />
                  <span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl-md border-b-2 border-l-2 border-white" />
                  <span className="absolute bottom-0 right-0 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-white" />
                  {p === 1 && <QrCode className="demo-enter absolute inset-3 h-[4.5rem] w-[4.5rem] text-white/80" strokeWidth={1.25} />}
                </div>
                <p className="mt-4 text-[11px] text-white/75">{p === 1 ? "Lendo o QR Code…" : "Aponte para a placa"}</p>
              </div>
            ) : (
              <div key="imovel" className="demo-enter flex h-full flex-col">
                <div className="h-24 bg-gradient-to-br from-forest/80 to-forest/30" />
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-[12px] font-semibold leading-tight">Casa com 3 quartos e quintal</p>
                  <p className="mt-1 text-[10px] text-muted">Rua Exemplo, 100 · Bairro Modelo</p>
                  <p className="mt-1 text-[13px] font-semibold">R$ 480 mil</p>
                  <div className="mt-auto">
                    <p
                      className={`rounded-lg py-2 text-center text-[11px] font-semibold text-white transition-all duration-300 ${
                        p >= 3 ? "scale-95 bg-ink" : "bg-forest"
                      }`}
                    >
                      Quero visitar
                    </p>
                    <p className={`mt-1.5 text-center text-[10px] text-forest transition-opacity duration-300 ${p >= 3 ? "opacity-100" : "opacity-0"}`}>
                      Pronto! O corretor vai te chamar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* O que o corretor vê no painel */}
      <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <div className="hero-demo-step min-w-0 flex-1" data-on={p >= 4}>
          <p className="truncate rounded-lg bg-forest/10 px-3 py-2 text-[12px] text-ink">
            <span className="font-semibold text-forest">Novo lead</span> · Fábio Exemplo quer visitar a casa
          </p>
        </div>
        <p className="shrink-0 text-right text-[11px] leading-tight text-muted">
          Leituras <strong className="text-[15px] text-ink tabular-nums">{p >= 1 ? 129 : 128}</strong>
          <br />
          Leads <strong className="text-[15px] text-ink tabular-nums">{p >= 4 ? 15 : 14}</strong>
        </p>
      </div>
    </Frame>
  );
}
