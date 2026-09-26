import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paymentMatchesOrder } from '../src/lib/checkout/payment-validation';
const order = { id:'order',asaas_customer_id:'customer',asaas_subscription_id:'subscription',amount:279 };
const receipt = { customer:'customer',subscription:'subscription',externalReference:'order',value:279,dueDate:'2026-09-25' };
test('confere cliente, assinatura, pedido, valor e data', () => {
  assert.equal(paymentMatchesOrder(order,receipt),true);
  for (const wrong of [{customer:'other'},{subscription:'other'},{externalReference:'other'},{value:1},{value:NaN},{dueDate:''}]) {
    assert.equal(paymentMatchesOrder(order,{...receipt,...wrong}),false);
  }
  assert.equal(paymentMatchesOrder({...order,asaas_subscription_id:null},receipt),false);
});
