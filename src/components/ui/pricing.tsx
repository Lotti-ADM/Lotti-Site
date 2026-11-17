"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
// Dynamic import — loads ~8KB only when user toggles annual pricing
const loadConfetti = () => import("canvas-confetti").then((m) => m.default);
import NumberFlow from "@number-flow/react";

export interface PricingPlan {
  name: string;
  price: string;
  /** Total cobrado por ano (10 mensalidades). */
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  /** Texto acima do preço (ex.: "a partir de"). */
  pricePrefix?: string;
  /** Nota fixa embaixo do preço; sem ela, a nota segue o ciclo mensal/anual. */
  priceNote?: string;
  /** Link externo (WhatsApp): sem `?ciclo=`, abre em outra aba. */
  external?: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      void loadConfetti().then((confetti) => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
          colors: ["#093323", "#5e687a", "#d9deea", "#eef1f6"],
          ticks: 200,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: 30,
          shapes: ["circle"],
        });
      });
    }
  };

  return (
    <div className="py-10 w-full">
      <div className="flex justify-center mb-10">
        <label className="relative inline-flex items-center cursor-pointer">
          <Label>
            <Switch
              ref={switchRef as React.Ref<HTMLButtonElement>}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
          </Label>
        </label>
        <span className="ml-3 font-semibold text-ink">
          Anual{" "}
          <span className="text-forest font-bold">(12 meses pelo preço de 10)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, index) => (
          <Reveal
            key={index}
            delay={index * 150}
            className={cn(
              "rounded-2xl border p-6 bg-paper text-center lg:flex lg:flex-col lg:justify-center relative transition-transform duration-500",
              plan.isPopular
                ? "border-forest border-2 shadow-xl md:-translate-y-5 md:z-20"
                : "border-line md:z-10",
              "flex flex-col",
              !plan.isPopular && "mt-5",
              index === 0 && "md:translate-x-8 md:scale-[0.96] md:origin-right",
              index === 2 && "md:-translate-x-8 md:scale-[0.96] md:origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-forest py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-white h-4 w-4 fill-current" aria-hidden="true" />
                <span className="text-white ml-1 font-sans font-semibold text-sm">
                  Mais escolhido
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <h3 className="text-base font-semibold text-muted">{plan.name}</h3>
              {plan.pricePrefix ? (
                <p className="mt-4 text-sm font-semibold text-muted">{plan.pricePrefix}</p>
              ) : null}
              <div className={cn("flex items-center justify-center gap-x-2", plan.pricePrefix ? "mt-1" : "mt-6")}>
                <span className="text-5xl font-bold tracking-tight text-ink">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    locales="pt-BR"
                    prefix="R$ "
                    format={{
                      useGrouping: "always",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                    className="font-variant-numeric: tabular-nums"
                  />
                </span>
                {plan.period && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-muted">
                    / {isMonthly || plan.priceNote ? plan.period : "ano"}
                  </span>
                )}
              </div>

              <p className="text-xs leading-5 text-muted mt-1">
                {plan.priceNote
                  ? plan.priceNote
                  : isMonthly
                    ? "Cobrança mensal"
                    : "Cobrança anual · 10 mensalidades"}
              </p>

              <ul className="mt-7 mb-7 gap-3 flex flex-col flex-1 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-muted">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href.startsWith("/checkout") ? `${plan.href}${plan.href.includes("?") ? "&" : "?"}ciclo=${isMonthly ? "monthly" : "annual"}` : plan.href}
                target={plan.external ? "_blank" : undefined}
                rel={plan.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "group relative w-full gap-2 overflow-hidden text-sm font-semibold tracking-tight cursor-pointer",
                  "inline-flex items-center justify-center rounded-full px-6 py-3",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out",
                  "hover:ring-2 hover:ring-forest hover:ring-offset-1",
                  plan.isPopular
                    ? "bg-forest text-white hover:bg-forest/90 shadow-md btn-shimmer"
                    : "border border-line bg-paper text-ink hover:bg-forest hover:text-white"
                )}
              >
                {plan.buttonText}
              </Link>
              <p className="mt-4 text-xs leading-5 text-muted">
                {plan.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
