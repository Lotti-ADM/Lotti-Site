import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { siteConfig } from "@/config/site";
import { footer } from "@/content/landing";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos e condições gerais de uso da Plataforma Lotti. Regras de contratação, licença de software SaaS, limites do agente de IA e responsabilidades.",
  alternates: { canonical: "/termos" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/termos",
    title: "Termos de Uso - Plataforma Lotti",
    description:
      "Termos e condições gerais de uso da Plataforma Lotti. Regras de contratação, licença de software SaaS, limites do agente de IA e responsabilidades.",
  },
};

export default function TermosPage() {
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
                <Shield size={14} aria-hidden="true" />
                Documento Oficial · Versão 1.0
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Termos de Uso
              </h1>
              <p className="mt-3 text-small text-muted">
                Última atualização: 17 de novembro de 2026. Vigente para todas as contas e acessos.
              </p>
            </header>

            <div className="mt-10 space-y-12 text-[0.9375rem] leading-relaxed text-muted">
              {/* Seção 1 */}
              <section aria-labelledby="sec-identificacao">
                <h2 id="sec-identificacao" className="text-xl font-semibold text-ink sm:text-2xl">
                  1. Identificação das Partes e Objeto
                </h2>
                <p className="mt-3">
                  Estes Termos de Uso regulam o acesso e a utilização dos serviços fornecidos pela{" "}
                  <strong className="text-ink">Lotti</strong> (inscrita no CNPJ sob o nº{" "}
                  {footer.legal.cnpj.replace("CNPJ ", "")}), doravante denominada simplesmente{" "}
                  <strong className="text-ink">Lotti</strong> ou{" "}
                  <strong className="text-ink">Contratada</strong>, por meio de sua plataforma web hospedada no
                  domínio <strong className="text-ink">{siteConfig.domain}</strong> e subdomínios associados.
                </p>
                <p className="mt-3">
                  Ao cadastrar-se, acessar ou contratar planos no sistema, você (doravante denominado{" "}
                  <strong className="text-ink">Usuário</strong> ou <strong className="text-ink">Contratante</strong>)
                  concorda de maneira expressa, irrevogável e integral com estes termos.
                </p>
              </section>

              {/* Seção 2 */}
              <section aria-labelledby="sec-licenca">
                <h2 id="sec-licenca" className="text-xl font-semibold text-ink sm:text-2xl">
                  2. Concessão de Licença SaaS
                </h2>
                <p className="mt-3">
                  A Lotti concede ao Usuário uma licença pessoal, onerosa, temporária, intransferível e não exclusiva
                  para uso do software como serviço (SaaS), abrangendo:
                </p>
                <ul className="mt-3 list-inside list-disc space-y-1.5 pl-2">
                  <li>Sistema de Gestão Imobiliária e CRM integrado;</li>
                  <li>Agente de Inteligência Artificial para qualificação e primeiro atendimento de contatos;</li>
                  <li>Módulo de Fachadas Inteligentes com QR Code e direcionamento de imóveis;</li>
                  <li>Apoio na geração e organização de minutas de contratos e gestão de locações.</li>
                </ul>
                <p className="mt-3">
                  É terminantemente proibido sublicenciar, revender, decompilar, aplicar engenharia reversa ou explorar
                  comercialmente a infraestrutura do software sem autorização prévia e por escrito.
                </p>
              </section>

              {/* Seção 3 */}
              <section aria-labelledby="sec-ia">
                <h2 id="sec-ia" className="text-xl font-semibold text-ink sm:text-2xl">
                  3. Papel da Inteligência Artificial e Limites Operacionais
                </h2>
                <div className="mt-3 rounded-2xl border border-line bg-surface/60 p-5 sm:p-6">
                  <h3 className="font-semibold text-ink">
                    Papel consultivo e de triagem do agente de IA:
                  </h3>
                  <p className="mt-2 text-small">
                    O agente de IA da Lotti foi projetado para acolher quem busca um imóvel, esclarecer dúvidas
                    iniciais, identificar preferências (orçamento, região, tipo de imóvel e urgência) e entregar um
                    resumo qualificado ao corretor ou à equipe de vendas.
                  </p>
                </div>
                <p className="mt-4">
                  O Contratante reconhece e aceita expressamente que:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-2 pl-2">
                  <li>
                    <strong className="text-ink">Não substitui o Corretor de Imóveis:</strong> A intermediação
                    imobiliária, consultoria de valores, conferência de matrículas, certidões e viabilidade jurídica
                    são de atribuição exclusiva de corretores de imóveis e imobiliárias devidamente credenciados perante
                    o CRECI competente.
                  </li>
                  <li>
                    <strong className="text-ink">Conferência de dados:</strong> O sistema não garante a disponibilidade
                    ou o valor final de imóveis anunciados, cabendo sempre ao corretor responsável validar todos os dados
                    junto ao proprietário e ao interessado antes de formular qualquer proposta vinculante.
                  </li>
                  <li>
                    <strong className="text-ink">Inexistência de promessa de resultado:</strong> A Lotti não garante taxa
                    mínima de conversão de vendas, contratos assinados ou locações fechadas.
                  </li>
                </ul>
              </section>

              {/* Seção 4 */}
              <section aria-labelledby="sec-contas">
                <h2 id="sec-contas" className="text-xl font-semibold text-ink sm:text-2xl">
                  4. Contas, Acesso e Segurança
                </h2>
                <p className="mt-3">
                  O acesso à conta é concedido via link único e senha pessoal intransferível enviada ao e-mail informado
                  no momento do pagamento no checkout. O Usuário é o único responsável pela guarda e confidencialidade
                  de suas credenciais.
                </p>
                <p className="mt-3">
                  O Usuário compromete-se a fornecer informações verídicas, exatas e atualizadas (incluindo CPF ou CNPJ)
                  e a comunicar a Lotti imediatamente acerca de qualquer uso não autorizado ou suspeita de quebra de
                  segurança.
                </p>
              </section>

              {/* Seção 5 */}
              <section aria-labelledby="sec-planos">
                <h2 id="sec-planos" className="text-xl font-semibold text-ink sm:text-2xl">
                  5. Planos, Franquias e Pagamento
                </h2>
                <p className="mt-3">
                  Os valores e capacidades de cada plano seguem a tabela oficial divulgada em{" "}
                  <Link href="/planos" className="font-medium text-ink underline underline-offset-2 hover:text-forest">
                    plataformalotti.com.br/planos
                  </Link>.
                </p>
                <ul className="mt-3 list-inside list-disc space-y-2 pl-2">
                  <li>
                    <strong className="text-ink">Plano Mensal (Cartão de Crédito):</strong> Cobrança recorrente a cada
                    30 dias, processada de forma segura pela instituição autorizada Asaas.
                  </li>
                  <li>
                    <strong className="text-ink">Plano Anual (Pix):</strong> Pagamento único com vigência contratual de
                    12 meses pelo valor promocional equivalente a 10 mensalidades.
                  </li>
                  <li>
                    <strong className="text-ink">Franquia de Leads atendidos:</strong> Cada plano possui um teto mensal
                    de atendimentos iniciados pelo agente de IA. A franquia é renovada mensalmente e o saldo não utilizado
                    não acumula para o ciclo posterior.
                  </li>
                </ul>
              </section>

              {/* Seção 6 */}
              <section aria-labelledby="sec-cancelamento-resumo">
                <h2 id="sec-cancelamento-resumo" className="text-xl font-semibold text-ink sm:text-2xl">
                  6. Cancelamento e Reembolso
                </h2>
                <p className="mt-3">
                  As regras detalhadas de cancelamento, direito de arrependimento em conformidade com o artigo 49 do
                  Código de Defesa do Consumidor e estorno de valores estão dispostas em documento apartado e vinculante:
                  a nossa{" "}
                  <Link
                    href="/politica-de-cancelamento"
                    className="font-medium text-ink underline underline-offset-2 hover:text-forest"
                  >
                    Política de Cancelamento e Reembolso
                  </Link>.
                </p>
                <p className="mt-3">
                  Nos planos mensais, o cancelamento pode ser efetuado a qualquer momento sem qualquer multa ou carência,
                  interrompendo as cobranças do ciclo seguinte.
                </p>
              </section>

              {/* Seção 7 */}
              <section aria-labelledby="sec-lgpd">
                <h2 id="sec-lgpd" className="text-xl font-semibold text-ink sm:text-2xl">
                  7. Proteção de Dados (LGPD) e Propriedade Intelectual
                </h2>
                <p className="mt-3">
                  Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD):
                </p>
                <ul className="mt-2 list-inside list-disc space-y-2 pl-2">
                  <li>
                    <strong className="text-ink">Dados de Imóveis e Clientes:</strong> Pertencem exclusivamente ao
                    Contratante. A Lotti atua na qualidade de Operadora, implementando controles de criptografia,
                    isolamento de banco de dados e políticas de acesso restrito.
                  </li>
                  <li>
                    <strong className="text-ink">Propriedade Intelectual:</strong> A marca, o código-fonte, designs,
                    métricas e modelos do software Lotti pertencem exclusivamente à Lotti, protegidos pela Lei de Software
                    (Lei nº 9.609/1998) e pela Lei de Direitos Autorais (Lei nº 9.610/1998).
                  </li>
                </ul>
              </section>

              {/* Seção 8 */}
              <section aria-labelledby="sec-sla">
                <h2 id="sec-sla" className="text-xl font-semibold text-ink sm:text-2xl">
                  8. Nível de Serviço (SLA) e Disponibilidade
                </h2>
                <p className="mt-3">
                  A Lotti empenha seus melhores esforços técnicos para manter a disponibilidade anual da plataforma acima
                  de 99%. Interrupções programadas para manutenção serão previamente notificadas sempre que viável e
                  agendadas prioritariamente fora dos horários comerciais de pico.
                </p>
                <p className="mt-3">
                  A Lotti não se responsabiliza por interrupções oriundas de falhas em operadoras de telecomunicação,
                  quedas gerais de rede, falhas de APIs de terceiros (como WhatsApp Cloud API/Meta ou Asaas) ou causas de
                  força maior.
                </p>
              </section>

              {/* Seção 9 */}
              <section aria-labelledby="sec-foro">
                <h2 id="sec-foro" className="text-xl font-semibold text-ink sm:text-2xl">
                  9. Disposições Finais e Foro
                </h2>
                <p className="mt-3">
                  A Lotti poderá atualizar estes Termos de Uso periodicamente para refletir melhorias do produto ou
                  adequações regulatórias, notificando os Usuários por e-mail ou aviso no painel da plataforma.
                </p>
                <p className="mt-3">
                  Para dirimir eventuais litígios decorrentes deste instrumento, as partes elegem o Foro da Comarca de
                  Goiânia, Estado de Goiás, com expressa renúncia a qualquer outro, por mais privilegiado que seja.
                </p>
              </section>

              {/* Contato Box */}
              <div className="mt-12 rounded-2xl border border-line bg-surface/50 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-white">
                    <FileText size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink">Dúvidas sobre os Termos?</h3>
                    <p className="mt-1 text-small">
                      Nossa equipe jurídica e de atendimento está à disposição pelo e-mail{" "}
                      <a
                        href={`mailto:${footer.legal.email}`}
                        className="font-medium text-ink underline transition-colors hover:text-forest"
                      >
                        {footer.legal.email}
                      </a>{" "}
                      ou via WhatsApp pelo número{" "}
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
