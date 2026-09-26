type Order = { id: string; asaas_customer_id: string | null; asaas_subscription_id: string | null; amount: number };
type Payment = { customer?: string; subscription?: string | null; externalReference?: string | null; value?: number; dueDate?: string };

/** All identifiers must agree. Amount alone never chooses a plan. */
export function paymentMatchesOrder(order: Order, payment: Payment): boolean {
  return !!order.asaas_customer_id && !!order.asaas_subscription_id
    && payment.customer === order.asaas_customer_id
    && payment.subscription === order.asaas_subscription_id
    && (!payment.externalReference || payment.externalReference === order.id)
    && Number.isFinite(payment.value)
    && Math.round(Number(payment.value) * 100) === Math.round(Number(order.amount) * 100)
    && typeof payment.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(payment.dueDate);
}

export const settledStatuses = new Set(['CONFIRMED', 'RECEIVED']);
export const lifecycleStatuses = new Set(['OVERDUE', 'REFUNDED', 'CHARGEBACK_REQUESTED', 'CHARGEBACK_DISPUTE']);
