import { createHmac } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isAsaasConfigured, AsaasApiError, createAsaasSubscription, findOrCreateAsaasCustomer, getAsaasPixQrCode } from "@/lib/asaas/server";
import {
  isAbacatePayConfigured,
  AbacatePayError,
  createAbacatePayTransparentPix,
  createAbacatePayCheckoutSession,
  getAbacatePayTransparentStatus,
} from "@/lib/abacatepay/server";
import { checkoutPlans, planPrice } from "@/lib/checkout/catalog";
import { consumeCheckoutRateLimit, createCheckoutOrder, getCheckoutOrder, tokensMatch, updateCheckoutOrder } from "@/lib/checkout/repository";
import { checkoutRequestSchema } from "@/lib/checkout/validation";
import { isLottiApiConfigured } from "@/lib/lotti-api/server";

export const runtime = "nodejs";

function requestIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "127.0.0.1";
}

function hasAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const configured = process.env.CHECKOUT_ALLOWED_ORIGINS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (configured?.length) return configured.includes(origin);
  return origin === request.nextUrl.origin;
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status });
}

export async function POST(request: NextRequest) {
  if (!hasAllowedOrigin(request)) {
    return errorResponse("ORIGIN_NOT_ALLOWED", "Não foi possível iniciar o pagamento por esta origem.", 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 24_000) {
    return errorResponse("PAYLOAD_TOO_LARGE", "Os dados enviados excedem o limite permitido.", 413);
  }

  const notConfigured = () => errorResponse(
    "CHECKOUT_NOT_CONFIGURED",
    "O pagamento online está em configuração. Tente novamente em instantes.",
    503,
  );

  if (process.env.CHECKOUT_ENABLED !== "true") {
    return notConfigured();
  }

  const isAbacate = isAbacatePayConfigured() && (process.env.CHECKOUT_GATEWAY === "abacatepay" || !isAsaasConfigured());

  if (!isAbacate) {
    if (!isAsaasConfigured() || !isLottiApiConfigured() || !process.env.ASAAS_WEBHOOK_TOKEN) {
      return notConfigured();
    }
  }

  const rateSecret = process.env.ASAAS_WEBHOOK_TOKEN || process.env.ABACATEPAY_API_KEY || "lotti-checkout-rate-limit";
  const rateKey = createHmac("sha256", rateSecret).update(requestIp(request)).digest("hex");
  const rate = await consumeCheckoutRateLimit(rateKey);
  if (rate === "not_configured") return notConfigured();
  if (rate === "unavailable") return errorResponse("CHECKOUT_UNAVAILABLE", "Não foi possível iniciar o pagamento agora.", 503);
  if (rate !== "allowed") return errorResponse("TOO_MANY_ATTEMPTS", "Aguarde um minuto antes de tentar novamente.", 429);

  const rawBody = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse(
      "INVALID_CHECKOUT_DATA",
      "Revise os campos destacados e tente novamente.",
      400,
    );
  }

  const checkout = parsed.data;
  const plan = checkoutPlans[checkout.planCode];
  const amount = planPrice(plan, checkout.billingCycle);
  const orderId = checkout.checkoutAttemptId;
  const statusToken = checkout.checkoutAttemptToken;
  let orderPersisted = false;
  let subscriptionCreated = false;
  let subscriptionRequested = false;

  try {
    const existing = await getCheckoutOrder(orderId);
    if (existing) {
      const sameAttempt = tokensMatch(statusToken, existing.access_token_hash)
        && existing.payer_email === checkout.email
        && existing.payer_document === checkout.cpfCnpj
        && existing.plan_code === checkout.planCode
        && existing.billing_cycle === checkout.billingCycle
        && existing.payment_method === checkout.paymentMethod;
      if (!sameAttempt) {
        return errorResponse("CHECKOUT_ATTEMPT_CONFLICT", "Esta tentativa de pagamento não pode ser reutilizada.", 409);
      }

      if (isAbacate) {
        const abacatePix = existing.payment_method === "PIX" && existing.asaas_payment_id
          ? await getAbacatePayTransparentStatus(existing.asaas_payment_id).catch(() => null)
          : null;
        return NextResponse.json({
          ok: true,
          orderId,
          statusToken,
          status: existing.status,
          paymentMethod: existing.payment_method,
          pix: abacatePix?.brCode ? {
            encodedImage: abacatePix.encodedImage ?? "",
            payload: abacatePix.brCode,
            expirationDate: abacatePix.expiresAt ?? "",
          } : undefined,
        });
      }

      const pix = existing.payment_method === "PIX" && existing.asaas_payment_id
        ? await getAsaasPixQrCode(existing.asaas_payment_id).catch(() => undefined)
        : undefined;
      return NextResponse.json({
        ok: true,
        orderId,
        statusToken,
        status: existing.status,
        paymentMethod: existing.payment_method,
        pix,
      });
    }

    await createCheckoutOrder({
      id: orderId,
      statusToken,
      payerName: checkout.name,
      payerEmail: checkout.email,
      payerDocument: checkout.cpfCnpj,
      payerPhone: checkout.mobilePhone,
      planCode: checkout.planCode,
      billingCycle: checkout.billingCycle,
      paymentMethod: checkout.paymentMethod,
      amount,
    });
    orderPersisted = true;

    if (isAbacate) {
      if (checkout.paymentMethod === "PIX") {
        const pixResult = await createAbacatePayTransparentPix({
          orderId,
          amount,
          plan,
          customer: {
            name: checkout.name,
            email: checkout.email,
            taxId: checkout.cpfCnpj,
            cellphone: checkout.mobilePhone,
          },
        });

        await updateCheckoutOrder(orderId, {
          status: "awaiting_payment",
          asaas_payment_id: pixResult.id,
        });

        return NextResponse.json({
          ok: true,
          orderId,
          statusToken,
          status: "awaiting_payment",
          paymentMethod: "PIX",
          pix: {
            encodedImage: pixResult.encodedImage,
            payload: pixResult.brCode,
            expirationDate: pixResult.expiresAt,
          },
        });
      }

      const session = await createAbacatePayCheckoutSession({
        orderId,
        amount,
        plan,
        billingCycle: checkout.billingCycle,
        appUrl: request.nextUrl.origin,
        customer: {
          name: checkout.name,
          email: checkout.email,
          taxId: checkout.cpfCnpj,
          cellphone: checkout.mobilePhone,
        },
      });

      await updateCheckoutOrder(orderId, {
        status: "processing",
        asaas_payment_id: session.id,
      });

      return NextResponse.json({
        ok: true,
        orderId,
        statusToken,
        status: "processing",
        paymentMethod: "CREDIT_CARD",
        checkoutUrl: session.url,
      });
    }

    const customer = await findOrCreateAsaasCustomer(orderId, checkout);
    await updateCheckoutOrder(orderId, { asaas_customer_id: customer.id });

    subscriptionRequested = true;
    const result = await createAsaasSubscription({
      orderId,
      customerId: customer.id,
      checkout,
      plan,
      amount,
      billingCycle: checkout.billingCycle,
      remoteIp: requestIp(request),
      onSubscriptionCreated: async (subscription) => {
        subscriptionCreated = true;
        await updateCheckoutOrder(orderId, { asaas_subscription_id: subscription.id });
      },
      onPaymentCreated: async (payment) => {
        await updateCheckoutOrder(orderId, {
          status: checkout.paymentMethod === "PIX" ? "awaiting_payment" : "processing",
          asaas_payment_id: payment.id,
        });
      },
    });

    await updateCheckoutOrder(orderId, {
      status: checkout.paymentMethod === "PIX" ? "awaiting_payment" : "processing",
      asaas_subscription_id: result.subscription.id,
      asaas_payment_id: result.payment.id,
      failure_code: null,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      statusToken,
      status: checkout.paymentMethod === "PIX" ? "awaiting_payment" : "processing",
      paymentMethod: checkout.paymentMethod,
      pix: result.pixQrCode,
    });
  } catch (error) {
    if (error instanceof AbacatePayError) {
      if (orderPersisted) {
        await updateCheckoutOrder(orderId, {
          status: "failed",
          failure_code: "ABACATEPAY_ERROR",
        }).catch(() => undefined);
      }
      return errorResponse("CHECKOUT_FAILED", error.message, error.statusCode >= 400 && error.statusCode < 500 ? 400 : 503);
    }

    const publicCode = error instanceof AsaasApiError ? error.publicCode : "CHECKOUT_FAILED";
    const uncertain = subscriptionRequested && (!(error instanceof AsaasApiError) || error.publicCode === "GATEWAY_UNAVAILABLE");
    if (orderPersisted) {
      await updateCheckoutOrder(orderId, {
        status: subscriptionCreated || uncertain ? "processing" : "failed",
        failure_code: publicCode,
      }).catch(() => undefined);
    }

    if (subscriptionCreated || uncertain) {
      return NextResponse.json({
        ok: true,
        orderId,
        statusToken,
        status: "processing",
        paymentMethod: checkout.paymentMethod,
      }, { status: 202 });
    }

    if (publicCode === "CARD_REFUSED") {
      return errorResponse(
        publicCode,
        "O cartão não autorizou esta cobrança. Revise os dados ou use outro cartão.",
        402,
      );
    }
    if (publicCode === "INVALID_DATA") {
      return errorResponse(
        publicCode,
        "O gateway de pagamento não aceitou os dados informados. Revise o cadastro e tente novamente.",
        400,
      );
    }
    return errorResponse(
      "CHECKOUT_FAILED",
      "Não foi possível concluir agora. Nenhuma nova tentativa será feita automaticamente.",
      503,
    );
  }
}
