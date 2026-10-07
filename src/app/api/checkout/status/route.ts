import { NextResponse, type NextRequest } from "next/server";
import { getCheckoutOrder, getPasswordAccess, tokensMatch, updateCheckoutOrder } from "@/lib/checkout/repository";
import { isLottiApiConfigured } from "@/lib/lotti-api/server";
import { getAsaasPixQrCode, getFirstAsaasSubscriptionPayment } from "@/lib/asaas/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isLottiApiConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const orderId = request.nextUrl.searchParams.get("pedido") ?? "";
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(orderId) || token.length < 32 || token.length > 128) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const order = await getCheckoutOrder(orderId).catch(() => null);
  if (!order || !tokensMatch(token, order.access_token_hash)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  let paymentId = order.asaas_payment_id;
  if (order.payment_method === "PIX" && !paymentId && order.asaas_subscription_id) {
    const payment = await getFirstAsaasSubscriptionPayment(order.asaas_subscription_id)
      .catch(() => undefined);
    paymentId = payment?.id ?? null;
    if (paymentId) {
      await updateCheckoutOrder(order.id, {
        status: "awaiting_payment",
        asaas_payment_id: paymentId,
      }).catch(() => undefined);
    }
  }

  const pix = order.payment_method === "PIX" && paymentId
    ? await getAsaasPixQrCode(paymentId).catch(() => undefined)
    : undefined;

  // Conta pronta: no lugar do convite por e-mail, a tela recebe o link de criar a senha
  // (de uso único, emitido pela API para este navegador) ou, se a conta já tem senha, o de entrar.
  const accountReady = order.status === "active" && Boolean(order.provisioned_user_id && order.access_email_sent_at);
  const access = accountReady ? await getPasswordAccess(order.id, token) : null;

  return NextResponse.json({
    ok: true,
    status: paymentId && order.status === "processing" ? "awaiting_payment" : order.status,
    accessEmailSent: Boolean(order.access_email_sent_at),
    accountReady,
    passwordSetupUrl: access?.passwordSetupUrl ?? null,
    passwordSetupExpiresAt: access?.passwordSetupExpiresAt ?? null,
    passwordAlreadySet: access?.passwordAlreadySet ?? false,
    loginUrl: access?.loginUrl ?? null,
    failureCode: order.failure_code ?? null,
    pix,
  }, { headers: { "cache-control": "no-store" } });
}
