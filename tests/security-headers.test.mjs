import assert from "node:assert/strict";
import test from "node:test";

// Roda contra o site servido (next start), como o teste visual.
const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000";

async function cabecalhos(path) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
  return response.headers;
}

for (const path of ["/", "/planos", "/checkout", "/blog"]) {
  test(`${path} envia os cabeçalhos de segurança`, async () => {
    const headers = await cabecalhos(path);
    assert.equal(headers.get("x-content-type-options"), "nosniff");
    assert.equal(headers.get("x-frame-options"), "SAMEORIGIN");
    assert.equal(headers.get("referrer-policy"), "strict-origin-when-cross-origin");

    const csp = headers.get("content-security-policy") ?? "";
    for (const diretiva of ["frame-ancestors 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"]) {
      assert.match(csp, new RegExp(diretiva.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });
}

test("a CSP não restringe scripts, estilos nem conexões (quebraria a hidratação do Next)", async () => {
  const csp = (await cabecalhos("/")).get("content-security-policy") ?? "";
  assert.doesNotMatch(csp, /(script|style|connect|img|default)-src/);
});

test("não revela o framework no x-powered-by", async () => {
  assert.equal((await cabecalhos("/")).get("x-powered-by"), null);
});
