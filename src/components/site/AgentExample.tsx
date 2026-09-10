import { ArrowRight, ClipboardList, MessageSquareText } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const messages = [
  { from: "Interessado", text: "Estou procurando um apartamento para alugar, com dois quartos." },
  { from: "Agente Lotti", text: "Em qual região você gostaria de morar? E qual valor total por mês faz sentido para você, incluindo condomínio?" },
  { from: "Interessado", text: "Na região central, até R$ 2.800 no total. Preciso de uma vaga e quero mudar em até dois meses." },
  { from: "Agente Lotti", text: "Entendi: dois quartos, uma vaga e até R$ 2.800 com condomínio, na região central. Vou organizar essas informações para o corretor pesquisar as opções com você." },
] as const;

const summary = [
  ["Objetivo", "Alugar um apartamento"],
  ["Região", "Central"],
  ["Orçamento informado", "Até R$ 2.800/mês, incluindo condomínio"],
  ["Indispensável", "Dois quartos e uma vaga"],
  ["Prazo de mudança", "Até dois meses"],
  ["A confirmar", "Bairros aceitos e demais despesas do imóvel"],
] as const;

export function AgentExample() {
  return (
    <section id="agente" className="section scroll-mt-28">
      <div className="shell">
        <SectionHeading
          eyebrow="O agente na conversa"
          title="De uma mensagem solta a uma procura bem definida."
          lead="Veja como as perguntas podem ajudar o interessado a explicar o que precisa — e o corretor a saber por onde começar."
        />
        <p className="mt-5 text-small text-muted">Exemplo ilustrativo com dados fictícios. Não é uma conversa real nem uma demonstração ao vivo.</p>
        <div className="mt-10 grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
            <h3 className="mb-7 flex items-center gap-3 text-h3 text-ink">
              <MessageSquareText className="h-5 w-5 text-forest" aria-hidden="true" />
              O que o interessado conversa
            </h3>
            <ol className="space-y-4" aria-label="Exemplo de qualificação imobiliária">
              {messages.map((message, index) => (
                <li key={index} className={message.from === "Agente Lotti" ? "ml-5 rounded-2xl bg-forest p-4 text-white sm:ml-8" : "mr-5 rounded-2xl border border-line bg-paper p-4 text-ink sm:mr-8"}>
                  <p className="mb-2 text-xs font-semibold">{message.from}</p>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </li>
              ))}
            </ol>
          </article>
          <article className="rounded-3xl border border-line bg-paper p-5 sm:p-8">
            <h3 className="mb-7 flex items-center gap-3 text-h3 text-ink">
              <ClipboardList className="h-5 w-5 text-forest" aria-hidden="true" />
              O que orienta o corretor
            </h3>
            <dl className="divide-y divide-line">
              {summary.map(([label, value]) => (
                <div key={label} className="py-4 first:pt-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 border-t border-line pt-5">
              <p className="flex items-center gap-2 font-semibold text-forest"><ArrowRight className="h-4 w-4" aria-hidden="true" /> Próximo passo do corretor</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">Confirmar os detalhes, pesquisar imóveis disponíveis e apresentar as opções ao cliente. A decisão e a negociação continuam com você.</p>
            </div>
          </article>
        </div>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-small text-muted">O atendimento é preparado com a sua operação. O agente está em implantação e depende de configuração e validação antes da ativação.</p>
          <Button href="#demo" arrow>Conversar sobre minha operação</Button>
        </div>
      </div>
    </section>
  );
}
