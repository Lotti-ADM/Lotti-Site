// Rotas de checkout da API da Lotti, com os mesmos erros que o site lançava quando falava
// direto com o Supabase. Sem "server-only" para os testes; a aplicação usa estas funções
// apenas por src/lib/checkout/repository.ts e provisioning.ts (ambos server-only).
import { LottiApiError, type LottiApiClient } from "./core";

export type CheckoutOrderStatus =
  | "creating"
  | "awaiting_payment"
  | "processing"
  | "active"
  | "failed"
  | "overdue"
  | "refunded";

export type CheckoutOrder = {
  id: string;
  payer_name: string;
  payer_email: string;
  payer_document: string;
  payer_phone: string;
  plan_code: string;
  billing_cycle: string;
  payment_method: string;
  amount: number;
  status: CheckoutOrderStatus;
  access_token_hash: string;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  asaas_payment_id: string | null;
  provisioned_user_id: string | null;
  access_email_sent_at: string | null;
  provisioning_started_at: string | null;
  failure_code: string | null;
};

/** O que o site atualiza. Ligar o pedido a uma conta é só do provisionamento da API. */
export type CheckoutOrderUpdate = {
  status?: "creating" | "awaiting_payment" | "processing" | "failed";
  asaas_customer_id?: string;
  asaas_subscription_id?: string;
  asaas_payment_id?: string;
  failure_code?: string | null;
};

export type NewCheckoutOrder = {
  id: string;
  accessTokenHash: string;
  payerName: string;
  payerEmail: string;
  payerDocument: string;
  payerPhone: string;
  planCode: string;
  billingCycle: string;
  paymentMethod: string;
  amount: number;
};

/** Cobrança do Asaas como o webhook a leu. */
export type CheckoutPayment = {
  id: string;
  status: string;
  customer?: string;
  subscription?: string | null;
  value?: number;
  dueDate?: string;
  deleted?: boolean;
};

export type RateLimitOutcome = "allowed" | "limited" | "not_configured" | "unavailable";

export type PasswordAccess = {
  passwordSetupUrl: string | null;
  passwordSetupExpiresAt: string | null;
  passwordAlreadySet: boolean;
  loginUrl: string | null;
};

const UUID_LIKE = /^[0-9a-f-]{36}$/i;
/** API sem segredo/página de senha, ou segredo errado: configuração, não instabilidade. */
const NOT_CONFIGURED = new Set(["checkout_nao_configurado", "checkout_api_nao_configurada"]);

function failure(prefix: string, error: unknown): Error {
  const code = error instanceof LottiApiError ? error.code ?? String(error.status) : "unknown";
  return new Error(`${prefix}:${code}`);
}

function paymentBody(payment: CheckoutPayment) {
  return {
    payment_id: payment.id,
    customer: payment.customer,
    subscription: payment.subscription ?? null,
    status: payment.deleted ? "DELETED" : payment.status,
    due_date: payment.dueDate,
    amount: payment.value,
  };
}

export function checkoutApi(api: LottiApiClient) {
  const orderPath = (id: string) => `/pedidos/${encodeURIComponent(id)}`;

  async function getOrder(id: string): Promise<CheckoutOrder | null> {
    try {
      return await api.get<CheckoutOrder>(orderPath(id), { allowNotFound: true });
    } catch (error) {
      throw failure("CHECKOUT_ORDER_READ_FAILED", error);
    }
  }

  return {
    /** consume_checkout_rate_limit pela API. Nunca lança: o route decide a resposta. */
    async consumeRateLimit(key: string): Promise<RateLimitOutcome> {
      try {
        const data = await api.post<{ permitido?: boolean }>("/limite", { chave: key });
        return data?.permitido === true ? "allowed" : "limited";
      } catch (error) {
        if (error instanceof LottiApiError
          && (error.status === 401 || (error.status === 503 && NOT_CONFIGURED.has(error.code ?? "")))) {
          return "not_configured";
        }
        return "unavailable";
      }
    },

    async createOrder(input: NewCheckoutOrder): Promise<void> {
      try {
        await api.post("/pedidos", {
          id: input.id,
          access_token_hash: input.accessTokenHash,
          payer_name: input.payerName,
          payer_email: input.payerEmail,
          payer_document: input.payerDocument,
          payer_phone: input.payerPhone,
          plan_code: input.planCode,
          billing_cycle: input.billingCycle,
          payment_method: input.paymentMethod,
          amount: input.amount,
        });
      } catch (error) {
        throw failure("CHECKOUT_ORDER_CREATE_FAILED", error);
      }
    },

    async updateOrder(id: string, values: CheckoutOrderUpdate): Promise<void> {
      try {
        await api.patch(orderPath(id), values);
      } catch (error) {
        throw failure("CHECKOUT_ORDER_UPDATE_FAILED", error);
      }
    },

    getOrder,

    async findOrderForPayment(input: {
      externalReference?: string | null;
      subscriptionId?: string | null;
    }): Promise<CheckoutOrder | null> {
      if (input.externalReference && UUID_LIKE.test(input.externalReference)) {
        const byId = await getOrder(input.externalReference);
        if (byId) return byId;
      }
      if (!input.subscriptionId) return null;
      try {
        const query = new URLSearchParams({ assinatura: input.subscriptionId });
        return await api.get<CheckoutOrder>(`/pedidos?${query}`, { allowNotFound: true });
      } catch (error) {
        throw failure("CHECKOUT_ORDER_LOOKUP_FAILED", error);
      }
    },

    async claimWebhookEvent(input: { id: string; eventType: string; paymentId?: string | null }): Promise<boolean> {
      try {
        const data = await api.post<{ reservado?: boolean }>("/eventos/reservar", {
          id: input.id,
          event_type: input.eventType,
          payment_id: input.paymentId ?? null,
        });
        return data?.reservado === true;
      } catch (error) {
        throw failure("CHECKOUT_EVENT_CLAIM_FAILED", error);
      }
    },

    async finishWebhookEvent(id: string, status: "processed" | "ignored" | "failed", errorCode?: string): Promise<void> {
      try {
        await api.post("/eventos/concluir", { id, status, error_code: errorCode ?? null });
      } catch (error) {
        throw failure("CHECKOUT_EVENT_FINISH_FAILED", error);
      }
    },

    /** apply_checkout_payment na conta que a API já ligou ao pedido (renovação, atraso, estorno). */
    async applyPayment(orderId: string, payment: CheckoutPayment): Promise<void> {
      try {
        await api.post(`${orderPath(orderId)}/pagamento`, paymentBody(payment));
      } catch {
        throw new Error("PROVISION_PAYMENT_APPLY_FAILED");
      }
    },

    /**
     * Reserva + conta no login da plataforma (sem senha) + pagamento + pedido marcado, numa
     * chamada. Os códigos da API (PROVISIONING_BUSY, ACCOUNT_EMAIL_MISMATCH...) viram o erro.
     */
    async provisionOrder(orderId: string, payment: CheckoutPayment): Promise<{ userId: string; accountCreated: boolean }> {
      try {
        const data = await api.post<{ user_id: string; conta_criada: boolean }>(
          `${orderPath(orderId)}/provisionar`,
          paymentBody(payment),
        );
        return { userId: data!.user_id, accountCreated: data!.conta_criada === true };
      } catch (error) {
        if (error instanceof LottiApiError && error.code) throw new Error(error.code);
        throw new Error("PROVISIONING_FAILED");
      }
    },

    /**
     * Link de criar senha para a tela de sucesso. A API confere de novo o token de status.
     * Null enquanto o pedido não estiver ativo e provisionado (ou se a API falhar).
     */
    async passwordAccess(orderId: string, statusToken: string): Promise<PasswordAccess | null> {
      try {
        const data = await api.post<{
          senha_definida?: boolean;
          link_senha?: string | null;
          link_expira_em?: string | null;
          link_entrar?: string | null;
        }>(`${orderPath(orderId)}/link-senha`, { token: statusToken });
        if (!data) return null;
        return {
          passwordSetupUrl: data.link_senha ?? null,
          passwordSetupExpiresAt: data.link_expira_em ?? null,
          passwordAlreadySet: data.senha_definida === true,
          loginUrl: data.link_entrar ?? null,
        };
      } catch {
        return null;
      }
    },
  };
}

export type CheckoutApi = ReturnType<typeof checkoutApi>;
