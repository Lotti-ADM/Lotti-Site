import type { BillingCycle, CheckoutPlan, PlanCode } from "@/lib/checkout/catalog";
import { digitsOnly } from "@/lib/checkout/validation";

const ABACATEPAY_API_BASE = "https://api.abacatepay.com/v2";

export class AbacatePayError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "AbacatePayError";
  }
}

export function getAbacatePayApiKey(): string {
  return process.env.ABACATEPAY_API_KEY?.trim() ?? "";
}

export function isAbacatePayConfigured(): boolean {
  return Boolean(getAbacatePayApiKey());
}

export type AbacatePayCustomerInput = {
  name: string;
  email: string;
  taxId: string;
  cellphone: string;
};

export type AbacatePayTransparentPixResult = {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | string;
  brCode: string;
  brCodeBase64: string;
  encodedImage: string;
  expiresAt: string;
};

export type AbacatePayCheckoutSessionResult = {
  id: string;
  url: string;
  amount: number;
  status: string;
};

/** Mapeamento de planos Lotti para IDs de produtos cadastrados na AbacatePay. */
const ABACATEPAY_PRODUCT_MAP: Record<string, string> = {
  essencial_monthly: "prod_zJE5d4HCzBwWPb6JfS3XqnBk",
  essencial_annual: "prod_fByDM6UbqhXXwWaJZq3j1QWE",
  profissional_monthly: "prod_Uc13LwuesgAUYjSr6rebwHMz",
  profissional_annual: "prod_AHwkJ0QqaWnJuTXL2aUsHwJC",
};

async function abacateFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const apiKey = getAbacatePayApiKey();
  if (!apiKey) {
    throw new AbacatePayError("Chave de API da AbacatePay não configurada", 503);
  }

  const response = await fetch(`${ABACATEPAY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: string | null;
    data?: unknown;
  } | null;

  if (!response.ok || (body && body.error)) {
    const errorMsg = body?.error || `Erro na API AbacatePay: HTTP ${response.status}`;
    throw new AbacatePayError(errorMsg, response.status, body);
  }

  return (body?.data ?? body) as T;
}

/** Cria ou atualiza cliente na AbacatePay. */
export async function findOrCreateAbacatePayCustomer(
  customer: AbacatePayCustomerInput,
): Promise<{ id: string; email: string }> {
  const payload = {
    name: customer.name.trim(),
    email: customer.email.trim().toLowerCase(),
    taxId: digitsOnly(customer.taxId),
    cellphone: digitsOnly(customer.cellphone),
  };

  const result = await abacateFetch<{ id: string; email: string }>("/customers/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result;
}

/** Cria cobrança transparente via PIX com QR Code e código copia e cola. */
export async function createAbacatePayTransparentPix(params: {
  orderId: string;
  amount: number;
  plan: CheckoutPlan;
  customer: AbacatePayCustomerInput;
}): Promise<AbacatePayTransparentPixResult> {
  const amountInCents = Math.round(params.amount * 100);

  const payload = {
    method: "PIX",
    data: {
      amount: amountInCents,
      customer: {
        name: params.customer.name.trim(),
        email: params.customer.email.trim().toLowerCase(),
        taxId: digitsOnly(params.customer.taxId),
        cellphone: digitsOnly(params.customer.cellphone),
      },
      description: `Assinatura Lotti - ${params.plan.name}`,
    },
  };

  const raw = await abacateFetch<{
    id: string;
    amount: number;
    status: string;
    brCode: string;
    brCodeBase64: string;
    expiresAt: string;
  }>("/transparents/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const encodedImage = raw.brCodeBase64.replace(/^data:image\/[a-z]+;base64,/, "");

  return {
    id: raw.id,
    amount: raw.amount,
    status: raw.status,
    brCode: raw.brCode,
    brCodeBase64: raw.brCodeBase64,
    encodedImage,
    expiresAt: raw.expiresAt,
  };
}

/** Consulta status da cobrança transparente. */
export async function getAbacatePayTransparentStatus(id: string): Promise<{
  id: string;
  amount: number;
  status: string;
  brCode?: string;
  brCodeBase64?: string;
  encodedImage?: string;
  expiresAt?: string;
}> {
  const raw = await abacateFetch<{
    id: string;
    amount: number;
    status: string;
    brCode?: string;
    brCodeBase64?: string;
    expiresAt?: string;
  }>(`/transparents/get?id=${encodeURIComponent(id)}`);

  const encodedImage = raw.brCodeBase64
    ? raw.brCodeBase64.replace(/^data:image\/[a-z]+;base64,/, "")
    : undefined;

  return {
    id: raw.id,
    amount: raw.amount,
    status: raw.status,
    brCode: raw.brCode,
    brCodeBase64: raw.brCodeBase64,
    encodedImage,
    expiresAt: raw.expiresAt,
  };
}

/** Cria sessão de checkout AbacatePay (usado para pagamentos via Cartão). */
export async function createAbacatePayCheckoutSession(params: {
  orderId: string;
  amount: number;
  plan: CheckoutPlan;
  billingCycle: BillingCycle;
  appUrl: string;
  customer: AbacatePayCustomerInput;
}): Promise<AbacatePayCheckoutSessionResult> {
  let customerId: string | undefined;
  try {
    const cust = await findOrCreateAbacatePayCustomer(params.customer);
    customerId = cust.id;
  } catch {
    // Se a criação de cliente falhar, o checkout continua sem associar customerId prévio
  }

  const productKey: `${PlanCode}_${BillingCycle}` = `${params.plan.code}_${params.billingCycle}`;
  const productId = ABACATEPAY_PRODUCT_MAP[productKey];

  if (!productId) {
    throw new AbacatePayError(`Produto não configurado para o plano ${params.plan.code} (${params.billingCycle})`, 400);
  }

  const payload = {
    frequency: "ONE_TIME",
    methods: ["CARD", "PIX"],
    items: [
      {
        id: productId,
        quantity: 1,
      },
    ],
    customerId: customerId || undefined,
    returnUrl: `${params.appUrl}/checkout/sucesso?pedido=${params.orderId}`,
    completionUrl: `${params.appUrl}/checkout/sucesso?pedido=${params.orderId}`,
  };

  const raw = await abacateFetch<{
    id: string;
    url: string;
    amount: number;
    status: string;
  }>("/checkouts/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    id: raw.id,
    url: raw.url,
    amount: raw.amount,
    status: raw.status,
  };
}
