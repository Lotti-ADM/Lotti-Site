# Catálogo — 9 de setembro de 2026

| Código estável | Nome | Mensal | Anual (12 meses) | Leads/mês |
|---|---|---:|---:|---:|
| essencial | Lotti Inteligente | 279 | 2790 | 100 |
| profissional | Lotti Profissional | 399 | 3990 | 250 |
| imobiliaria | Lotti Eficazes | 799 | 7990 | 600 |

`src/content/plans.ts` governa LP, comparativo e checkout. O backend deriva o preço do catálogo e ignora preços fornecidos pelo cliente. Cartão mensal; Pix anual com 12 meses pelo preço de 10.

A migration 20260909180000_planos_agente_ia.sql atualiza o catálogo da plataforma, preservando IDs e códigos. Foi aplicada e conferida no banco de produção. Não reajusta assinaturas já emitidas no Asaas.

Os limites de imóveis, fachadas e contratos foram alinhados ao banco consultado. Publicar a oferta não ativa o agente: integração do atendimento, deduplicação mensal por contato, contagem de abandonos e homologação do canal ainda precisam ser verificadas antes de operar o serviço.

Validações: checkout 7/7, verificações de página 22/22, lint e build. Checkout financeiro depende das configurações documentadas em ASAAS_CHECKOUT.md.

A campanha antiga de fundador (20%) foi encerrada pela migration 20260909183000_encerrar_campanha_fundador.sql, sem alterar assinaturas existentes. Produção do checkout retorna 503 CHECKOUT_NOT_CONFIGURED até configurar o backend.

---
# Catálogo — 14 de novembro de 2026 (preços de lançamento)

| Código estável | Nome | Cobrado (lançamento) | Tabela | Anual (12 meses) | Leads/mês | Checkout |
|---|---|---:|---:|---:|---:|---|
| essencial | Lotti Atende | 149 | 199 | 1490 | 100 | sim |
| profissional | Lotti Completo | 299 | 349 | 2990 | 250 | sim |
| imobiliaria | Lotti White Label | 499 base + 149 por cadeira (mín. 5 → 1.244) | — | sob contrato | 600 | **não**: botão de conversa (WhatsApp ou formulário de demo) |

Cotas inalteradas. `src/content/plans.ts` segue como fonte única; `checkoutPlanCodes` limita o checkout a Atende e Completo (`?plano=imobiliaria` cai no padrão). Assinaturas já emitidas no Asaas não mudam. Base da decisão e evidências: Segundo Cérebro, `01-negocio/lotti/founder/pricing-decisao.md`. Data de fim do lançamento: a definir.
