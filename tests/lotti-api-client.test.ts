import { test } from "node:test";
import assert from "node:assert/strict";
import { CHECKOUT_HEADER, createLottiApiClient, LottiApiError, readLottiApiConfig } from "../src/lib/lotti-api/core";
import { checkoutApi } from "../src/lib/lotti-api/checkout";

type Call = { url: string; method: string; headers: Record<string, string>; body: unknown };

/** fetch falso: registra as chamadas e responde na ordem dada (status, corpo) ou lança. */
function fakeFetch(responses: Array<[number, unknown] | Error>) {
  const calls: Call[] = [];
  const impl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      url: String(input),
      method: init?.method ?? "GET",
      headers: init?.headers as Record<string, string>,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    const next = responses.shift();
    if (!next) throw new Error("resposta não programada");
    if (next instanceof Error) throw next;
    const [status, body] = next;
    return new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return { impl, calls };
}

const CONFIG = { baseUrl: "https://api.exemplo.com", token: "segredo-do-checkout-com-32-caracteres" };
const ORDER_ID = "0f1e2d3c-4b5a-4968-8776-655443322110";

function setup(responses: Array<[number, unknown] | Error>) {
  const { impl, calls } = fakeFetch(responses);
  return { api: checkoutApi(createLottiApiClient(CONFIG, impl)), calls };
}

test("configuração: exige URL https (http só local) e token; tira barra final e /api", () => {
  assert.equal(readLottiApiConfig({}), null);
  assert.equal(readLottiApiConfig({ LOTTI_API_URL: "https://api.exemplo.com" }), null);
  assert.equal(readLottiApiConfig({ LOTTI_API_URL: "http://api.exemplo.com", CHECKOUT_API_TOKEN: "x" }), null);
  assert.equal(readLottiApiConfig({ LOTTI_API_URL: "nao é url", CHECKOUT_API_TOKEN: "x" }), null);
  assert.deepEqual(
    readLottiApiConfig({ LOTTI_API_URL: " https://api.exemplo.com/api/ ", CHECKOUT_API_TOKEN: " t " }),
    { baseUrl: "https://api.exemplo.com", token: "t" },
  );
  assert.deepEqual(
    readLottiApiConfig({ LOTTI_API_URL: "http://localhost:3001", CHECKOUT_API_TOKEN: "t" }),
    { baseUrl: "http://localhost:3001", token: "t" },
  );
});

test("cliente: segredo no cabeçalho, rota /api/checkout, JSON, 404 opcional e erro com o código", async () => {
  const { impl, calls } = fakeFetch([[200, { ok: true }], [404, { codigo: "pedido_nao_encontrado" }], [409, { codigo: "PROVISIONING_BUSY" }], new Error("rede")]);
  const client = createLottiApiClient(CONFIG, impl);

  assert.deepEqual(await client.post("/limite", { chave: "k" }), { ok: true });
  assert.equal(calls[0].url, "https://api.exemplo.com/api/checkout/limite");
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].headers[CHECKOUT_HEADER], CONFIG.token);
  assert.equal(calls[0].headers["content-type"], "application/json");
  assert.deepEqual(calls[0].body, { chave: "k" });

  assert.equal(await client.get("/pedidos/x", { allowNotFound: true }), null);

  await assert.rejects(client.post("/x"), (error: unknown) =>
    error instanceof LottiApiError && error.status === 409 && error.code === "PROVISIONING_BUSY");
  await assert.rejects(client.get("/x"), (error: unknown) => error instanceof LottiApiError && error.status === 0);
});

test("limite: permitido, bloqueado, API sem configuração e instabilidade", async () => {
  const { api, calls } = setup([
    [200, { permitido: true }],
    [200, { permitido: false }],
    [503, { codigo: "checkout_nao_configurado" }],
    [503, { codigo: "checkout_api_nao_configurada" }],
    [401, {}],
    [500, {}],
    new Error("rede"),
  ]);
  const key = "a".repeat(64);
  assert.equal(await api.consumeRateLimit(key), "allowed");
  assert.deepEqual(calls[0].body, { chave: key });
  assert.equal(await api.consumeRateLimit(key), "limited");
  assert.equal(await api.consumeRateLimit(key), "not_configured");
  assert.equal(await api.consumeRateLimit(key), "not_configured");
  assert.equal(await api.consumeRateLimit(key), "not_configured");
  assert.equal(await api.consumeRateLimit(key), "unavailable");
  assert.equal(await api.consumeRateLimit(key), "unavailable");
});

test("pedido: cria com os nomes das colunas, lê, atualiza e busca pela assinatura", async () => {
  const order = { id: ORDER_ID, status: "processing", amount: 399 };
  const { api, calls } = setup([
    [201, { ok: true }],
    [409, { codigo: "pedido_existente" }],
    [200, order],
    [404, {}],
    [200, { ok: true, linhas: 1 }],
    [404, {}],
    [200, order],
  ]);

  await api.createOrder({
    id: ORDER_ID, accessTokenHash: "h".repeat(64), payerName: "Ana", payerEmail: "ana@exemplo.com",
    payerDocument: "11222333000181", payerPhone: "62999990000", planCode: "profissional",
    billingCycle: "monthly", paymentMethod: "CREDIT_CARD", amount: 399,
  });
  assert.deepEqual(calls[0].body, {
    id: ORDER_ID, access_token_hash: "h".repeat(64), payer_name: "Ana", payer_email: "ana@exemplo.com",
    payer_document: "11222333000181", payer_phone: "62999990000", plan_code: "profissional",
    billing_cycle: "monthly", payment_method: "CREDIT_CARD", amount: 399,
  });
  await assert.rejects(api.createOrder({
    id: ORDER_ID, accessTokenHash: "h", payerName: "", payerEmail: "", payerDocument: "", payerPhone: "",
    planCode: "", billingCycle: "", paymentMethod: "", amount: 1,
  }), /^Error: CHECKOUT_ORDER_CREATE_FAILED:pedido_existente$/);

  assert.deepEqual(await api.getOrder(ORDER_ID), order);
  assert.equal(calls[2].url, `https://api.exemplo.com/api/checkout/pedidos/${ORDER_ID}`);
  assert.equal(await api.getOrder(ORDER_ID), null);

  await api.updateOrder(ORDER_ID, { status: "failed", failure_code: null });
  assert.equal(calls[4].method, "PATCH");
  assert.deepEqual(calls[4].body, { status: "failed", failure_code: null });

  // externalReference sem pedido → cai na assinatura (codificada na query)
  assert.deepEqual(await api.findOrderForPayment({ externalReference: ORDER_ID, subscriptionId: "sub_1&x" }), order);
  assert.equal(calls[6].url, "https://api.exemplo.com/api/checkout/pedidos?assinatura=sub_1%26x");
  assert.equal(await api.findOrderForPayment({ externalReference: "nao-uuid" }), null);
  assert.equal(calls.length, 7);
});

test("webhook: claim/finish do evento, pagamento e provisionamento com os erros de antes", async () => {
  const payment = { id: "pay_1", status: "REFUNDED", customer: "cus_1", subscription: "sub_1", value: 399, dueDate: "2026-10-07", deleted: true };
  const { api, calls } = setup([
    [200, { reservado: true }],
    [200, { ok: true }],
    [200, { ok: true }],
    [409, { codigo: "PAYMENT_MISMATCH" }],
    [200, { user_id: "user-1", conta_criada: true, link_senha: "https://app/nova-senha?token=x" }],
    [409, { codigo: "PROVISIONING_BUSY" }],
    [500, {}],
  ]);

  assert.equal(await api.claimWebhookEvent({ id: "evt_1", eventType: "PAYMENT_CONFIRMED" }), true);
  assert.deepEqual(calls[0].body, { id: "evt_1", event_type: "PAYMENT_CONFIRMED", payment_id: null });
  await api.finishWebhookEvent("evt_1", "failed", "PROCESSING_FAILED");
  assert.deepEqual(calls[1].body, { id: "evt_1", status: "failed", error_code: "PROCESSING_FAILED" });

  await api.applyPayment(ORDER_ID, payment);
  assert.equal(calls[2].url, `https://api.exemplo.com/api/checkout/pedidos/${ORDER_ID}/pagamento`);
  assert.deepEqual(calls[2].body, {
    payment_id: "pay_1", customer: "cus_1", subscription: "sub_1", status: "DELETED", due_date: "2026-10-07", amount: 399,
  });
  await assert.rejects(api.applyPayment(ORDER_ID, payment), /^Error: PROVISION_PAYMENT_APPLY_FAILED$/);

  assert.deepEqual(await api.provisionOrder(ORDER_ID, { ...payment, status: "CONFIRMED", deleted: false }), { userId: "user-1", accountCreated: true });
  assert.equal(calls[4].url, `https://api.exemplo.com/api/checkout/pedidos/${ORDER_ID}/provisionar`);
  assert.equal((calls[4].body as { status: string }).status, "CONFIRMED");
  await assert.rejects(api.provisionOrder(ORDER_ID, payment), /^Error: PROVISIONING_BUSY$/);
  await assert.rejects(api.provisionOrder(ORDER_ID, payment), /^Error: PROVISIONING_FAILED$/);
});

test("acesso da conta: link de criar senha, conta com senha e pedido ainda não liberado", async () => {
  const { api, calls } = setup([
    [200, { senha_definida: false, link_senha: "https://app/nova-senha?token=abc", link_expira_em: "2026-10-08T12:00:00.000Z", link_entrar: "https://app/auth" }],
    [200, { senha_definida: true, link_senha: null, link_expira_em: null, link_entrar: "https://app/auth" }],
    [409, { codigo: "pedido_nao_provisionado" }],
  ]);
  const token = "f".repeat(64);
  assert.deepEqual(await api.passwordAccess(ORDER_ID, token), {
    passwordSetupUrl: "https://app/nova-senha?token=abc",
    passwordSetupExpiresAt: "2026-10-08T12:00:00.000Z",
    passwordAlreadySet: false,
    loginUrl: "https://app/auth",
  });
  assert.equal(calls[0].url, `https://api.exemplo.com/api/checkout/pedidos/${ORDER_ID}/link-senha`);
  assert.deepEqual(calls[0].body, { token });
  assert.deepEqual(await api.passwordAccess(ORDER_ID, token), {
    passwordSetupUrl: null, passwordSetupExpiresAt: null, passwordAlreadySet: true, loginUrl: "https://app/auth",
  });
  assert.equal(await api.passwordAccess(ORDER_ID, token), null);
});
