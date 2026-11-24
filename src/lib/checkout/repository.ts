import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import type { BillingCycle, PaymentMethod, PlanCode } from "./catalog";
import { getLottiApi, isLottiApiConfigured } from "@/lib/lotti-api/server";
import {
  checkoutApi,
  type CheckoutOrder,
  type CheckoutOrderStatus,
  type CheckoutOrderUpdate as LottiCheckoutOrderUpdate,
  type PasswordAccess,
  type RateLimitOutcome,
} from "@/lib/lotti-api/checkout";

// Pedidos e eventos do checkout ficam no banco da plataforma, pela API da Lotti
// (rotas /api/checkout/*, servidor a servidor). O site não fala com o banco.
// Em ambiente local sem a API configurada, utiliza armazenamento em memória de contingência.

export type { CheckoutOrder, CheckoutOrderStatus, PasswordAccess } from "@/lib/lotti-api/checkout";

export type CheckoutOrderUpdate = {
  status?: CheckoutOrderStatus;
  asaas_customer_id?: string;
  asaas_subscription_id?: string;
  asaas_payment_id?: string;
  failure_code?: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __checkoutOrdersStore: Map<string, CheckoutOrder> | undefined;
  // eslint-disable-next-line no-var
  var __checkoutRateLimitStore: Map<string, { count: number; resetAt: number }> | undefined;
}

const memoryOrders = () => {
  globalThis.__checkoutOrdersStore ??= new Map<string, CheckoutOrder>();
  return globalThis.__checkoutOrdersStore;
};

const memoryRateLimit = () => {
  globalThis.__checkoutRateLimitStore ??= new Map<string, { count: number; resetAt: number }>();
  return globalThis.__checkoutRateLimitStore;
};

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
export async function consumeCheckoutRateLimit(key: string): Promise<RateLimitOutcome> {
  if (isLottiApiConfigured()) {
    return api().consumeRateLimit(key);
  }

  const now = Date.now();
  const store = memoryRateLimit();
  const current = store.get(key);

  if (!current || now > current.resetAt) {
    store.set(key, { count: 1, resetAt: now + 60_000 });
    return "allowed";
  }

  if (current.count >= 10) {
    return "limited";
  }

  current.count += 1;
  return "allowed";
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
  if (isLottiApiConfigured()) {
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
    return;
  }

  memoryOrders().set(input.id, {
    id: input.id,
    access_token_hash: sha256(input.statusToken),
    payer_name: input.payerName,
    payer_email: input.payerEmail,
    payer_document: input.payerDocument,
    payer_phone: input.payerPhone,
    plan_code: input.planCode,
    billing_cycle: input.billingCycle,
    payment_method: input.paymentMethod,
    amount: input.amount,
    status: "creating",
    asaas_customer_id: null,
    asaas_subscription_id: null,
    asaas_payment_id: null,
    provisioned_user_id: null,
    access_email_sent_at: null,
    provisioning_started_at: null,
    failure_code: null,
  });
}

/** Mudar o status para creating/awaiting_payment/processing/failed nunca desfaz active/overdue/refunded. */
export async function updateCheckoutOrder(id: string, values: CheckoutOrderUpdate): Promise<void> {
  if (isLottiApiConfigured()) {
    const apiValues: Record<string, unknown> = { ...values };
    if (apiValues.status === "active" || apiValues.status === "overdue" || apiValues.status === "refunded") {
      delete apiValues.status;
    }
    if (Object.keys(apiValues).length > 0) {
      await api().updateOrder(id, apiValues as LottiCheckoutOrderUpdate);
    }
    return;
  }

  const order = memoryOrders().get(id);
  if (!order) return;

  const terminalStatuses = new Set(["active", "overdue", "refunded"]);
  if (values.status && terminalStatuses.has(order.status) && !terminalStatuses.has(values.status)) {
    // Não desfaz status terminal
  } else if (values.status) {
    order.status = values.status;
  }

  if (values.asaas_customer_id !== undefined) order.asaas_customer_id = values.asaas_customer_id;
  if (values.asaas_subscription_id !== undefined) order.asaas_subscription_id = values.asaas_subscription_id;
  if (values.asaas_payment_id !== undefined) order.asaas_payment_id = values.asaas_payment_id;
  if (values.failure_code !== undefined) order.failure_code = values.failure_code;
}

export async function getCheckoutOrder(id: string): Promise<CheckoutOrder | null> {
  if (isLottiApiConfigured()) {
    return api().getOrder(id);
  }
  return memoryOrders().get(id) ?? null;
}

export async function findCheckoutOrderForPayment(input: {
  externalReference?: string | null;
  subscriptionId?: string | null;
}): Promise<CheckoutOrder | null> {
  if (isLottiApiConfigured()) {
    return api().findOrderForPayment(input);
  }

  for (const order of memoryOrders().values()) {
    if (input.subscriptionId && order.asaas_subscription_id === input.subscriptionId) {
      return order;
    }
    if (input.externalReference && order.id === input.externalReference) {
      return order;
    }
  }
  return null;
}

export async function claimWebhookEvent(input: {
  id: string;
  eventType: string;
  paymentId?: string | null;
}): Promise<boolean> {
  if (isLottiApiConfigured()) {
    return api().claimWebhookEvent(input);
  }
  return true;
}

export async function finishWebhookEvent(
  id: string,
  status: "processed" | "ignored" | "failed",
  errorCode?: string,
): Promise<void> {
  if (isLottiApiConfigured()) {
    await api().finishWebhookEvent(id, status, errorCode);
  }
}

/** Link de criar senha (ou de entrar) para a tela de sucesso. Null enquanto não houver acesso. */
export async function getPasswordAccess(orderId: string, statusToken: string): Promise<PasswordAccess | null> {
  if (isLottiApiConfigured()) {
    return api().passwordAccess(orderId, statusToken);
  }
  return null;
}
