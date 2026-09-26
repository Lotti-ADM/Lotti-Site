import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { getAsaasPayment, getAsaasSubscription, type AsaasPayment } from '@/lib/asaas/server';
import { claimWebhookEvent, findCheckoutOrderForPayment, finishWebhookEvent, updateCheckoutOrder } from '@/lib/checkout/repository';
import { applyPayment, provisionPaidOrder } from '@/lib/checkout/provisioning';
import { lifecycleStatuses, paymentMatchesOrder, settledStatuses } from '@/lib/checkout/payment-validation';

export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN;
  const received = Buffer.from(request.headers.get('asaas-access-token') ?? '');
  if (!expected || received.length !== Buffer.byteLength(expected) || !timingSafeEqual(received, Buffer.from(expected))) {
    return NextResponse.json({ received: false }, { status: 401 });
  }
  const body = await request.json().catch(() => null) as { id?: string; event?: string; payment?: AsaasPayment } | null;
  if (!body?.id || !body.event || !body.payment?.id) return NextResponse.json({ received: false }, { status: 400 });
  let claimed = false;
  try {
    const payment = await getAsaasPayment(body.payment.id);
    let order = await findCheckoutOrderForPayment({ externalReference: payment.externalReference, subscriptionId: payment.subscription });
    if ((!order || !order.asaas_subscription_id) && payment.subscription) {
      const subscription = await getAsaasSubscription(payment.subscription);
      order = await findCheckoutOrderForPayment({ externalReference: subscription.externalReference, subscriptionId: subscription.id });
      if (order && !order.asaas_subscription_id) {
        if (order.asaas_customer_id !== subscription.customer || Number(order.amount) !== subscription.value) throw new Error('SUBSCRIPTION_MISMATCH');
        await updateCheckoutOrder(order.id, { asaas_subscription_id: subscription.id });
        order = { ...order, asaas_subscription_id: subscription.id };
      }
    }
    if (!order) return NextResponse.json({ received: true });
    // A delivery can beat persistence of the create-subscription response. Retry.
    if (!order.asaas_subscription_id || !order.asaas_customer_id) throw new Error('ORDER_NOT_READY');
    claimed = await claimWebhookEvent({ id: body.id, eventType: body.event, paymentId: body.payment.id });
    if (!claimed) return NextResponse.json({ received: true });
    // Read current gateway state: an old OVERDUE webhook must not undo a paid receipt.
    if (!paymentMatchesOrder(order, payment)) throw new Error('PAYMENT_MISMATCH');
    if (settledStatuses.has(payment.status) && !payment.deleted) {
      if (!order.access_email_sent_at) await provisionPaidOrder(order, payment);
      else if (order.provisioned_user_id) await applyPayment(order, payment, order.provisioned_user_id);
      else throw new Error('PROVISIONED_USER_MISSING');
    } else if ((lifecycleStatuses.has(payment.status) || payment.deleted) && order.provisioned_user_id) {
      await applyPayment(order, payment, order.provisioned_user_id);
    } else {
      await finishWebhookEvent(body.id, 'ignored');
      return NextResponse.json({ received: true });
    }
    await finishWebhookEvent(body.id, 'processed');
    return NextResponse.json({ received: true });
  } catch {
    if (claimed) await finishWebhookEvent(body.id, 'failed', 'PROCESSING_FAILED').catch(() => undefined);
    return NextResponse.json({ received: false }, { status: 503 });
  }
}
