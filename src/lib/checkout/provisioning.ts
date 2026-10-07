import "server-only";

import type { AsaasPayment } from "@/lib/asaas/server";
import { getLottiApi } from "@/lib/lotti-api/server";
import { checkoutApi } from "@/lib/lotti-api/checkout";
import type { CheckoutOrder } from "./repository";

// O acesso nasce no login da plataforma, pela API da Lotti: a conta é criada sem senha
// (ou a existente é reaproveitada), a assinatura é aplicada e o pedido marcado numa
// transação só. No lugar do convite por e-mail, a tela de sucesso recebe o link de
// criar senha (GET /api/checkout/status → passwordSetupUrl).

/** Renovação, atraso, estorno e chargeback: aplica na conta já ligada ao pedido. */
export async function applyPayment(order: CheckoutOrder, payment: AsaasPayment): Promise<void> {
  await checkoutApi(getLottiApi()).applyPayment(order.id, payment);
}

/**
 * Primeiro recebimento: reserva o pedido, cria ou reaproveita a conta pelo e-mail do
 * pagamento, aplica o pagamento e marca o pedido. Lança com o código da API
 * (PROVISIONING_BUSY, ACCOUNT_EMAIL_MISMATCH...); a API solta a reserva com
 * PROVISIONING_RETRY para a próxima entrega do webhook.
 */
export async function provisionPaidOrder(order: CheckoutOrder, payment: AsaasPayment): Promise<void> {
  await checkoutApi(getLottiApi()).provisionOrder(order.id, payment);
}
