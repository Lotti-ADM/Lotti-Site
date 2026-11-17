import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RefreshCw, CheckCircle2, HelpCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { footer } from "@/content/landing";

export const metadata: Metadata = {
  title: "Política de Cancelamento e Reembolso",
  description:
    "Conheça as regras claras de cancelamento, direito de arrependimento (7 dias - CDC) e estorno da assinatura da Plataforma Lotti.",
  alternates: { canonical: "/politica-de-cancelamento" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/politica-de-cancelamento",
    title: "Política de Cancelamento e Reembolso - Plataforma Lotti",
    description:
      "Conheça as regras claras de cancelamento, direito de arrependimento (7 dias - CDC) e estorno da assinatura da Plataforma Lotti.",
  },
};

export default function PoliticaCancelamentoPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="shell">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-small font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar ao início
            </Link>

            <header className="mt-8 border-b border-line pb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-3.5 py-1 text-xs font-semibold text-forest">
                <RefreshCw size={14} aria-hidden="true" />
                Garantia e Transparência · Versão 1.0
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Política de Cancelamento e Reembolso
              </h1>
              <p className="mt-3 text-small text-muted">
                Última atualização: 17 de novembro de 2026. Aplicável a assinaturas mensais e anuais.
              </p>
            </header>

            <div className="mt-10 space-y-12 text-[0.9375rem] leading-relaxed text-muted">
              {/* Destaque CDC */}
              <div className="rounded-2xl border-2 border-forest/20 bg-forest/[0.03] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-white">
                    <CheckCircle2 size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-ink sm:text-xl">
                      Garantia Legal de 7 Dias (Direito de Arrependimento)
                    </h2>
                    <p className="mt-2 text-small text-muted">
                      Em estrito cumprimento ao artigo 49 do Código de Defesa do Consumidor (Lei Federal nº 8.078/1990),
                      você tem até <strong className="font-semibold text-ink">7 (sete) dias corridos</strong> a partir
                      da data da confirmação do primeiro pagamento para testar a Lotti. Se não atender às suas
                      expectativas, você pode solicitar o cancelamento com{" "}
                      <strong className="font-semibold text-ink">reembolso de 100% do valor pago</strong>, sem multas e
                      sem burocracia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 1 */}
              <section aria-labelledby="sec-mensal">
                <h2 id="sec-mensal" className="text-xl font-semibold text-ink sm:text-2xl">
                  1. Cancelamento do Plano Mensal (Cartão de Crédito)
                </h2>
                <p className="mt-3">
                  Nossos planos mensais são projetados com total flexibilidade para a sua operação:
                </p>
                <ul className="mt-3 list-inside list-disc space-y-2 pl-2">
                  <li>
                    <strong className="text-ink">Sem fidelidade ou multa:</strong> Você pode solicitar o cancelamento a
                    qualquer momento sem incidência de taxas rescisórias, multas ou penalidades.
                  </li>
                  <li>
                    <strong className="text-ink">Interrupção imediata de cobranças:</strong> Ao solicitar o
                    cancelamento, nenhuma nova mensalidade será lançada no seu cartão de crédito nas faturas subsequentes.
                  </li>
                  <li>
                    <strong className="text-ink">Acesso até o fim do ciclo:</strong> O acesso ao CRM, imóveis cadastrados
                    e atendimento de IA permanece totalmente ativo até a data de término do ciclo mensal que já foi pago.
                  </li>
                </ul>
              </section>

              {/* Seção 2 */}
              <section aria-labelledby="sec-anual">
                <h2 id="sec-anual" className="text-xl font-semibold text-ink sm:text-2xl">
                  2. Cancelamento do Plano Anual (Pix)
                </h2>
                <p className="mt-3">
                  O plano anual é concedido sob condição promocional expressa, oferecendo 12 meses de acesso pelo valor
                  equivalente a apenas 10 mensalidades (desconto de 2 mensalidades).
                </p>
                <ul className="mt-3 list-inside list-disc space-y-2 pl-2">
                  <li>
                    <strong className="text-ink">Durante os primeiros 7 dias:</strong> O reembolso é integral (100%),
                    pago diretamente na chave Pix de origem.
                  </li>
                  <li>
                    <strong className="text-ink">Após os 7 dias de garantia:</strong> O plano anual vigora pelo período
                    contratado de 12 meses. O cancelamento interrompe a renovação para o ano seguinte, permanecendo a sua
                    conta ativa com todos os benefícios e limites até o encerramento do período de 12 meses já quitado, não
                    havendo reembolso proporcional (pró-rata) do período restante em virtude da precificação com desconto.
                  </li>
                </ul>
              </section>

              {/* Seção 3 */}
              <section aria-labelledby="sec-franquias">
                <h2 id="sec-franquias" className="text-xl font-semibold text-ink sm:text-2xl">
                  3. Franquia de Atendimentos de IA
                </h2>
                <p className="mt-3">
                  Cada plano possui uma franquia mensal de contatos qualificados pelo agente de IA (ex.: 100 leads no
                  plano Atende, 250 leads no plano Completo).
                </p>
                <p className="mt-3">
                  Caso a franquia não seja totalmente utilizada dentro do mês, o saldo remanescente não acumula para os
                  meses posteriores nem dá direito a restituição pecuniária, reiniciando o limite a cada novo ciclo de
                  faturamento.
                </p>
              </section>

              {/* Seção 4 */}
              <section aria-labelledby="sec-procedimento">
                <h2 id="sec-procedimento" className="text-xl font-semibold text-ink sm:text-2xl">
                  4. Como Solicitar Cancelamento ou Reembolso
                </h2>
                <p className="mt-3">
                  O processo é simples e transparente, podendo ser realizado pelos canais oficiais:
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-surface/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-forest">Opção 1 · E-mail</p>
                    <p className="mt-2 text-small">
                      Envie um e-mail para{" "}
                      <a
                        href={`mailto:${footer.legal.email}?subject=Solicitação%20de%20Cancelamento%20/%20Reembolso`}
                        className="font-medium text-ink underline transition-colors hover:text-forest"
                      >
                        {footer.legal.email}
                      </a>{" "}
                      a partir do mesmo endereço de e-mail cadastrado na sua conta Lotti.
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-surface/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-forest">Opção 2 · WhatsApp</p>
                    <p className="mt-2 text-small">
                      Entre em contato com nossa equipe pelo número{" "}
                      <span className="font-medium text-ink">{footer.legal.phone}</span> informando seu e-mail de acesso
                      e CNPJ/CPF cadastrado no checkout.
                    </p>
                  </div>
                </div>
              </section>

              {/* Seção 5 */}
              <section aria-labelledby="sec-prazos">
                <h2 id="sec-prazos" className="text-xl font-semibold text-ink sm:text-2xl">
                  5. Prazos e Meios de Efetivação do Reembolso
                </h2>
                <p className="mt-3">
                  Após o recebimento da solicitação, nossa equipe processará a análise em até{" "}
                  <strong className="text-ink">2 (dois) dias úteis</strong>. Uma vez confirmado:
                </p>
                <ul className="mt-3 list-inside list-disc space-y-2 pl-2">
                  <li>
                    <strong className="text-ink">Pagamentos via Pix:</strong> O valor é devolvido em até 2 dias úteis
                    diretamente na mesma conta bancária associada à chave Pix pagadora, por meio do gateway Asaas.
                  </li>
                  <li>
                    <strong className="text-ink">Pagamentos via Cartão de Crédito:</strong> A solicitação de estorno é
                    transmitida à operadora do cartão de crédito imediatamente após aprovação. O crédito costuma constar
                    na fatura atual ou na fatura subsequente, conforme as regras da instituição bancária emissora.
                  </li>
                </ul>
              </section>

              {/* Seção 6 */}
              <section aria-labelledby="sec-dados">
                <h2 id="sec-dados" className="text-xl font-semibold text-ink sm:text-2xl">
                  6. Exportação e Guarda dos Seus Dados
                </h2>
                <p className="mt-3">
                  A Lotti respeita a propriedade dos seus dados. Antes do encerramento efetivo da conta ao final do ciclo
                  pago, recomendamos que o Usuário exporte sua base de contatos, clientes e históricos cadastrados no CRM.
                </p>
                <p className="mt-3">
                  Após 60 (sessenta) dias do encerramento definitivo da conta sem renovação, as informações da base
                  poderão ser anonimizadas ou excluídas de nossos servidores, ressalvadas as exigências legais de guarda
                  fiscal e tributária previstas em lei.
                </p>
              </section>

              {/* Dúvidas Box */}
              <div className="mt-12 rounded-2xl border border-line bg-surface/50 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-white">
                    <HelpCircle size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink">Precisa de assistência?</h3>
                    <p className="mt-1 text-small">
                      Caso tenha qualquer dúvida técnica ou queira auxílio para ajustar os parâmetros da sua assinatura,
                      fale conosco pelo e-mail{" "}
                      <a
                        href={`mailto:${footer.legal.email}`}
                        className="font-medium text-ink underline transition-colors hover:text-forest"
                      >
                        {footer.legal.email}
                      </a>{" "}
                      ou ligue/envie mensagem para{" "}
                      <span className="font-medium text-ink">{footer.legal.phone}</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
