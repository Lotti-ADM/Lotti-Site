"use client";

import { useActionState, useId, useRef, useState } from "react";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { type DemoFormState, scheduleDemo } from "@/app/actions/schedule-demo";
import { form as copy } from "@/content/landing";
import { contactConsent, quizQuestions } from "@/content/demo-quiz";
import { demoSchema } from "@/lib/demo-validation";
import { whatsappUrl } from "@/config/site";

const initialState: DemoFormState = { status: "idle" };
const emptyValues = { name: "", whatsapp: "", email: "", creci: "", portfolio: "", leadVolume: "", attendance: "", consent: "" };
type Field = keyof typeof emptyValues;

export function DemoForm() {
  const [state, action, pending] = useActionState(scheduleDemo, initialState);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const ids = useId();
  const whatsapp = whatsappUrl();
  const question = quizQuestions[step];
  const goTo = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const change = (field: Field, value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
  };
  const next = () => {
    if (!values[question.name]) {
      setErrors({ [question.name]: "Selecione uma opção para continuar." });
      return;
    }
    goTo(step + 1);
  };

  if (state.status === "success") {
    return <div className="demo-quiz rounded-[28px] bg-white p-7 text-[#14251c] sm:p-9" role="status">
      <CheckCircle2 size={32} className="text-[#093323]" />
      <h3 className="mt-5 text-h3">{copy.success.title}</h3>
      <p className="mt-3 text-[#56625c]">{copy.success.description}</p>
    </div>;
  }

  return <form action={action} noValidate aria-busy={pending} className="demo-quiz rounded-[28px] bg-white p-6 text-[#14251c] shadow-xl sm:p-8"
    onSubmit={event => {
      if (pending) { event.preventDefault(); return; }
      if (step < 3) { event.preventDefault(); next(); return; }
      const result = demoSchema.safeParse(values);
      if (!result.success) {
        event.preventDefault();
        const found: Partial<Record<Field, string>> = {};
        for (const issue of result.error.issues) found[issue.path[0] as Field] ??= issue.message;
        setErrors(found);
        const firstQuestion = quizQuestions.findIndex(item => found[item.name]);
        if (firstQuestion >= 0) goTo(firstQuestion);
        else requestAnimationFrame(() => document.getElementById(`${ids}-${Object.keys(found)[0]}`)?.focus());
      }
    }}>
    <div role="progressbar" aria-label="Progresso do formulário" aria-valuemin={0} aria-valuemax={4} aria-valuenow={step + 1} className="h-1.5 overflow-hidden rounded-full bg-[#e9eeeb]">
      <div className="h-full rounded-full bg-[#093323] transition-[width] motion-reduce:transition-none" style={{ width: `${(step + 1) * 25}%` }} />
    </div>
    <p className="mt-3 text-sm text-[#56625c]" aria-live="polite">Etapa {step + 1} de 4</p>
    <h3 ref={heading} tabIndex={-1} id={`${ids}-title`} className="mt-5 text-xl leading-snug font-semibold sm:text-2xl">{question?.title ?? "Como podemos falar com você?"}</h3>
    <p className="mt-2 text-sm leading-relaxed text-[#56625c]">{question?.hint ?? "Vamos usar suas respostas para conversar sobre o atendimento dos seus leads com a Lotti."}</p>
    <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
      <label htmlFor={`${ids}-empresa`}>Empresa</label><input id={`${ids}-empresa`} name="empresa" tabIndex={-1} autoComplete="off" />
    </div>
    {quizQuestions.map((item, index) => <div key={item.name} hidden={step !== index}>
      <fieldset className="mt-6 space-y-3" aria-describedby={errors[item.name] ? `${ids}-${item.name}-error` : undefined}>
        <legend className="sr-only">{item.title}</legend>
        {item.options.map(option => <label key={option} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors sm:text-base ${values[item.name] === option ? "border-[#093323] bg-[#edf5ef]" : "border-[#dce3df] hover:border-[#799a88]"}`}>
          <input type="radio" name={item.name} value={option} checked={values[item.name] === option} onChange={() => change(item.name, option)} className="h-4 w-4 shrink-0 accent-[#093323]" />{option}
        </label>)}
      </fieldset>
      {errors[item.name] && <p role="alert" id={`${ids}-${item.name}-error`} className="mt-3 text-sm text-[#a52424]">{errors[item.name]}</p>}
    </div>)}
    <div hidden={step !== 3} className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {(["name", "email", "whatsapp", "creci"] as const).map(name => <div key={name} className={name === "name" || name === "email" ? "sm:col-span-2" : ""}>
          <label htmlFor={`${ids}-${name}`} className="mb-2 block text-sm font-medium">{copy.fields[name].label}{name === "creci" ? " (opcional)" : ""}</label>
          <input id={`${ids}-${name}`} name={name} value={values[name]} onChange={event => change(name, event.target.value)} type={name === "email" ? "email" : name === "whatsapp" ? "tel" : "text"} autoComplete={name === "whatsapp" ? "tel" : name === "creci" ? "off" : name} placeholder={copy.fields[name].placeholder} required={name !== "creci"} maxLength={name === "name" ? 120 : name === "email" ? 160 : 40} aria-invalid={Boolean(errors[name] || state.fieldErrors?.[name])} aria-describedby={errors[name] || state.fieldErrors?.[name] ? `${ids}-${name}-error` : undefined} className="min-h-12 w-full rounded-xl border border-[#ccd6d0] bg-white px-3 text-base text-[#14251c] placeholder:text-[#67776e]" />
          {(errors[name] || state.fieldErrors?.[name]) && <p id={`${ids}-${name}-error`} className="mt-1 text-sm text-[#a52424]">{errors[name] || state.fieldErrors?.[name]}</p>}
        </div>)}
      </div>
      <div className="mt-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#56625c]" htmlFor={`${ids}-consent`}>
          <input id={`${ids}-consent`} type="checkbox" name="consent" value="accepted" checked={values.consent === "accepted"} onChange={event => change("consent", event.target.checked ? "accepted" : "")} required disabled={pending} aria-invalid={Boolean(errors.consent || state.fieldErrors?.consent)} aria-describedby={`${ids}-consent-help${errors.consent || state.fieldErrors?.consent ? ` ${ids}-consent-error` : ""}`} className="mt-1 h-5 w-5 shrink-0 accent-[#093323]" />
          <span>{contactConsent.text}</span>
        </label>
        {(errors.consent || state.fieldErrors?.consent) && <p role="alert" id={`${ids}-consent-error`} className="mt-2 text-sm text-[#a52424]">{errors.consent || state.fieldErrors?.consent}</p>}
        <p id={`${ids}-consent-help`} className="mt-3 text-xs leading-relaxed text-[#56625c]">Você pode revogar esta autorização a qualquer momento, respondendo ao nosso contato ou escrevendo para <a href="mailto:uselottiapp@gmail.com" className="underline">uselottiapp@gmail.com</a>.</p>
      </div>
    </div>
    {state.status === "error" && <p role="alert" className="mt-4 text-sm text-[#a52424]">{state.message}</p>}
    <div className="mt-6 flex items-center gap-3">
      {step > 0 && <button type="button" disabled={pending} onClick={() => goTo(step - 1)} className="flex min-h-12 items-center gap-1 rounded-full px-3 text-sm font-medium disabled:opacity-50"><ArrowLeft size={16} aria-hidden="true" />Voltar</button>}
      <button key={step === 3 ? "submit" : "next"} type={step === 3 ? "submit" : "button"} onClick={step < 3 ? event => { event.preventDefault(); next(); } : undefined} disabled={pending} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#093323] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#155239] disabled:opacity-60">
        {step < 3 ? "Continuar" : pending ? copy.submitting : "Quero conhecer a Lotti"}<ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
    {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-sm underline">{copy.whatsappAlt}</a>}
  </form>;
}
