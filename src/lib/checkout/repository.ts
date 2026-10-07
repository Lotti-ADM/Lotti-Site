import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import type { BillingCycle, PaymentMethod, PlanCode } from "./catalog";
import { getLottiApi } from "@/lib/lotti-api/server";
import {
  checkoutApi,
  type CheckoutOrder,
  type CheckoutOrderUpdate,
  type PasswordAccess,
  type RateLimitOutcome,
} from "@/lib/lotti-api/checkout";

// Pedidos e eventos do checkout ficam no banco da plataforma, pela API da Lotti
// (rotas /api/checkout/*, servidor a servidor). O site não fala com o banco.

export type { CheckoutOrder, CheckoutOrderStatus, CheckoutOrderUpdate, PasswordAccess } from "@/lib/lotti-api/checkout";

const api = () => checkoutApi(getLottiApi());

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function tokensMatch(token: string, expectedHash: string): boolean {
  const actual = Buffer.from(sha256(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Limite de tentativas por IP (a chave já chega como HMAC; a API nunca vê o IP). */
export function consumeCheckoutRateLimit(key: string): Promise<RateLimitOutcome> {
  return api().consumeRateLimit(key);
}

export async function createCheckoutOrder(input: {
  id: string;
  statusToken: string;
  payerName: string;
  payerEmail: string;
  payerDocument: string;
  payerPhone: string;
  planCode: PlanCode;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  amount: number;
}): Promise<void> {
  await api().createOrder({
    id: input.id,
    accessTokenHash: sha256(input.statusToken),
    payerName: input.payerName,
    payerEmail: input.payerEmail,
    payerDocument: input.payerDocument,
    payerPhone: input.payerPhone,
    planCode: input.planCode,
    billingCycle: input.billingCycle,
    paymentMethod: input.paymentMethod,
    amount: input.amount,
  });
}

/** Mudar o status para creating/awaiting_payment/processing/failed nunca desfaz active/overdue/refunded. */
export async function updateCheckoutOrder(id: string, values: CheckoutOrderUpdate): Promise<void> {
  await api().updateOrder(id, values);
}

export async function getCheckoutOrder(id: string): Promise<CheckoutOrder | null> {
  return api().getOrder(id);
}

export async function findCheckoutOrderForPayment(input: {
  externalReference?: string | null;
  subscriptionId?: string | null;
}): Promise<CheckoutOrder | null> {
  return api().findOrderForPayment(input);
}

export async function claimWebhookEvent(input: {
  id: string;
  eventType: string;
  paymentId?: string | null;
}): Promise<boolean> {
  return api().claimWebhookEvent(input);
}

export async function finishWebhookEvent(
  id: string,
  status: "processed" | "ignored" | "failed",
  errorCode?: string,
): Promise<void> {
  await api().finishWebhookEvent(id, status, errorCode);
}

/** Link de criar senha (ou de entrar) para a tela de sucesso. Null enquanto não houver acesso. */
export async function getPasswordAccess(orderId: string, statusToken: string): Promise<PasswordAccess | null> {
  return api().passwordAccess(orderId, statusToken);
}
