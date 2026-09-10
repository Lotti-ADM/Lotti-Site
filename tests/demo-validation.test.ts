import assert from "node:assert/strict";
import test from "node:test";
import { demoSchema } from "../src/lib/demo-validation";
import { quizQuestions } from "../src/content/demo-quiz";
const valid = { consent: "accepted", name: "Teste local", email: "teste@example.com", whatsapp: "(11) 99999-9999", creci: "", portfolio: "1 a 10", leadVolume: "Até 100 por mês", attendance: "Eu faço o atendimento" };
test("aceita as combinações do quiz e normaliza telefone", () => {
  for (const question of quizQuestions) for (const option of question.options) {
    const parsed = demoSchema.parse({ ...valid, [question.name]: option });
    assert.equal(parsed[question.name], option);
    assert.equal(parsed.whatsapp, "11999999999");
  }
});
test("rejeita respostas ausentes ou adulteradas antes do envio", () => {
  for (const question of quizQuestions) for (const value of ["", "<script>inválido</script>"]) {
    const parsed = demoSchema.safeParse({ ...valid, [question.name]: value });
    assert.equal(parsed.success, false);
    if (!parsed.success) assert.equal(parsed.error.issues[0].path[0], question.name);
  }
});
test("exige contato válido e mantém CRECI opcional", () => {
  assert.equal(demoSchema.safeParse({ ...valid, creci: undefined }).success, true);
  for (const [field, value] of [["name", ""], ["email", "incorreto"], ["whatsapp", "123"]]) {
    assert.equal(demoSchema.safeParse({ ...valid, [field]: value }).success, false);
  }
});

test("bloqueia envio sem autorização expressa", () => {
  for (const consent of [undefined, "", "false", "true", "on", false, true]) {
    const result = demoSchema.safeParse({ ...valid, consent });
    assert.equal(result.success, false);
    if (!result.success) assert.equal(result.error.issues[0].path[0], "consent");
  }
  assert.equal(demoSchema.safeParse(valid).success, true);
});
