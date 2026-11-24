import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isAbacatePayConfigured,
  getAbacatePayApiKey,
  AbacatePayError,
} from "../src/lib/abacatepay/server";
import { checkoutPlans } from "../src/lib/checkout/catalog";

test("identifica configuração da AbacatePay pela chave de API", () => {
  const original = process.env.ABACATEPAY_API_KEY;
  try {
    process.env.ABACATEPAY_API_KEY = "abc_prod_teste";
    assert.equal(isAbacatePayConfigured(), true);
    assert.equal(getAbacatePayApiKey(), "abc_prod_teste");

    delete process.env.ABACATEPAY_API_KEY;
    assert.equal(isAbacatePayConfigured(), false);
    assert.equal(getAbacatePayApiKey(), "");
  } finally {
    if (original !== undefined) {
      process.env.ABACATEPAY_API_KEY = original;
    } else {
      delete process.env.ABACATEPAY_API_KEY;
    }
  }
});

test("AbacatePayError preserva mensagem, código de status e dados de resposta", () => {
  const err = new AbacatePayError("Invalid taxId", 400, { success: false, error: "Invalid taxId" });
  assert.equal(err.message, "Invalid taxId");
  assert.equal(err.statusCode, 400);
  assert.deepEqual(err.data, { success: false, error: "Invalid taxId" });
  assert.equal(err.name, "AbacatePayError");
});

test("garante que os planos compráveis possuem códigos válidos no catálogo", () => {
  assert.ok(checkoutPlans.essencial);
  assert.ok(checkoutPlans.profissional);
  assert.equal(checkoutPlans.essencial.code, "essencial");
  assert.equal(checkoutPlans.profissional.code, "profissional");
});
