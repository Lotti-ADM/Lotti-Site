"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { pricingFAQ } from "@/content/pricing";

/* Título grande e texto lado a lado, lista numerada na largura toda (home e /planos). */
export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ids = useId();

  return (
    <section data-faq="" className="relative overflow-hidden bg-surface py-20 text-ink sm:py-28">
      {/* Brilho verde suave no canto, para a seção não ficar chapada */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-forest)_14%,transparent)_0%,transparent_70%)]"
      />
      <div className="shell relative">
        <Reveal className="grid items-end gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-muted">// Dúvidas</p>
            <h2 className="mt-4 text-display text-balance text-ink">Perguntas frequentes.</h2>
          </div>
          <p className="max-w-[46ch] text-lead text-muted">
            O que corretores e imobiliárias costumam perguntar antes de começar com a Lotti.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-14 border-t border-ink/10">
            {pricingFAQ.map((faq, index) => {
              const isOpen = openIndex === index;
              const triggerId = `${ids}-faq-trigger-${index}`;
              const panelId = `${ids}-faq-panel-${index}`;
              const numero = `F.${String(index + 1).padStart(2, "0")}`;

              return (
                <div key={faq.question} className="border-b border-ink/10">
                  <h3 className="m-0">
                    <button
                      id={triggerId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full cursor-pointer items-center gap-4 py-6 text-left sm:gap-8"
                    >
                      <span className="w-10 shrink-0 font-mono text-[12px] font-semibold text-muted">{numero}</span>
                      <span className={`flex-1 text-[17px] font-semibold leading-snug transition-colors duration-300 group-hover:text-forest sm:text-[20px] ${isOpen ? "text-forest" : "text-ink"}`}>{faq.question}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isOpen ? "rotate-45 border-forest bg-forest text-white" : "border-ink/15 bg-paper text-ink group-hover:border-forest"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className={`max-w-[70ch] pb-7 pl-14 pr-12 text-muted transition-transform duration-500 sm:pl-[4.5rem] ${isOpen ? "translate-y-0" : "-translate-y-2"}`}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
