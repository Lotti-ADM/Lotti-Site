import { Check, type LucideIcon } from "lucide-react";
import { FachadasDemo, FunilDemo } from "@/components/site/FeatureDemos";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { features } from "@/content/landing";

const primaryVisuals = [<FunilDemo key="funil" />, <FachadasDemo key="fachadas" />];

/** Ícone modular + nome do módulo. Sem a régua diagonal: o ícone já ancora. */
function FeatureLabel({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line text-ink">
        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="eyebrow eyebrow-bare">{label}</span>
    </span>
  );
}

export function Features() {
  return (
    <section id="recursos" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow={features.eyebrow}
          title={features.title}
          lead={features.lead}
        />

        {/* Os dois módulos que definem o produto ganham a linha inteira */}
        <div className="mt-14 flex flex-col gap-6">
          {features.primary.map((feature, index) => {
            const Icon = feature.icon;
            const flip = index % 2 === 1;

            return (
              <Reveal
                as="article"
                key={feature.label}
                className="card grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10"
              >
                <div className={flip ? "lg:order-2" : undefined}>
                  <FeatureLabel icon={Icon} label={feature.label} />
                  <h3 className="mt-5 max-w-[20ch] text-h2 text-balance leading-[1.15] pt-1">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-[52ch] text-muted">{feature.description}</p>

                  {feature.points ? (
                    <ul className="mt-6 flex flex-col gap-2.5">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-small">
                          <Check
                            size={16}
                            strokeWidth={2}
                            className="mt-0.5 shrink-0 text-ink"
                            aria-hidden="true"
                          />
                          <span className="text-muted">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className={flip ? "lg:order-1" : undefined}>
                  {primaryVisuals[index]}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Os quatro restantes, em grade */}
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.secondary.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal as="li" key={feature.label} delay={index * 60} className="border-t border-line pt-6">
                <Icon size={20} strokeWidth={1.5} className="text-forest" aria-hidden="true" />
                <h3 className="mt-4 text-[1.0625rem] font-semibold leading-snug text-ink">{feature.label}</h3>
                <p className="mt-2 text-small text-muted">{feature.title}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
