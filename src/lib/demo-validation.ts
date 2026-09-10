import { z } from "zod";
import { form as formCopy } from "../content/landing";
import { contactConsent, quizQuestions } from "../content/demo-quiz";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const demoSchema = z.object({
  consent: z.literal("accepted", { error: contactConsent.error }),
  name: z
    .string()
    .trim()
    .min(2, "Diga como podemos te chamar.")
    .max(120, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .transform(onlyDigits)
    .refine((digits) => digits.length >= 10 && digits.length <= 13, {
      message: "Informe DDD e número, ex.: (11) 98765-4321.",
    }),
  email: z.string().email("Confira o e-mail, parece incompleto.").max(160),
  creci: z.string().trim().max(40, "CRECI muito longo.").optional(),
  leadVolume: z.string().refine(value => quizQuestions[0].options.includes(value), { message: "Escolha o volume de leads." }),
  attendance: z.string().refine(value => quizQuestions[1].options.includes(value), { message: "Escolha como atende hoje." }),
  portfolio: z
    .string()
    .trim()
    .refine((value) => formCopy.portfolioOptions.includes(value as never), {
      message: "Escolha uma das opções.",
    }),
});

