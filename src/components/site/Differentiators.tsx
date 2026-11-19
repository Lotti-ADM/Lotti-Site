import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { differentiators } from "@/content/landing";
import { DiferencialCard } from "@/components/site/DiferencialCards";

/** Diferenciais em cards coloridos com ilustração, para a página não ficar só em texto. */
export function Differentiators() {
  return (
    <section id="diferenciais" className="section bg-surface">
      <div className="shell">
        <SectionHeading eyebrow={differentiators.eyebrow} title={differentiators.title} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {differentiators.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="h-full">
              <DiferencialCard index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
