# Checkout SaaS Lotti com Asaas

## O que foi implementado

O site oferece checkout próprio em `/checkout`, com PIX e cartão de crédito para
os três planos do catálogo. O cartão é cobrado mensalmente; o PIX cobra de uma vez
o equivalente a 10 mensalidades, com 12 meses de acesso. Os valores nunca são aceitos do navegador: o
backend recalcula preço, ciclo e descrição a partir do catálogo versionado.

Fluxo de ativação:

1. O servidor cria um pedido interno com status `creating`.
2. O cliente é localizado ou criado no Asaas.
3. O Asaas cria uma assinatura mensal no cartão ou anual no PIX.
4. PIX recebe QR Code; cartão é processado no momento da requisição.
5. A tela consulta somente o status do pedido, usando um token aleatório com hash
   armazenado no banco.
6. A tentativa do navegador é reutilizada após uma resposta perdida, impedindo
   que o mesmo clique crie uma segunda assinatura. O status também recupera o QR
   Code quando a cobrança PIX demora a ficar disponível.
7. O webhook valida `asaas-access-token` e registra o `event.id` antes de agir.
8. Apenas `PAYMENT_CONFIRMED` ou `PAYMENT_RECEIVED` ativa a assinatura da Lotti.
9. A API da Lotti (Railway) cria a conta no login da plataforma, sem senha, com o
   e-mail do pagamento (ou reaproveita a conta que já tem esse e-mail de login),
   aplica a assinatura e marca o pedido, numa transação só. Ainda não há envio de
   e-mail: a tela de sucesso mostra o botão **Criar minha senha** com um link de uso
   único (24 h) emitido pela API para o navegador que pagou. Conta que já tem senha
   recebe o botão **Entrar na Lotti**.

O site não acessa banco nenhum: pedidos, eventos do webhook, limite por IP e
provisionamento passam pelas rotas `/api/checkout/*` da API, servidor a servidor,
com o segredo `CHECKOUT_API_TOKEN` no cabeçalho `x-lotti-checkout`.

O número completo do cartão e o CVV não são gravados no banco, nos eventos ou em
logs da aplicação.

## 1. Banco (histórico)

As tabelas e funções do checkout já estão na baseline do banco da plataforma no
Railway (`api/prisma/migrations/0_init`). As migrations abaixo ficam aqui só como
registro de como nasceram no Supabase:

```text
supabase/migrations/20260826090000_asaas_saas_checkout.sql
```

A migration cria:

- `checkout_orders`, acessível somente por `service_role`/Secret Key;
- `asaas_checkout_events`, sem armazenar o payload bruto do webhook;
- RPCs atômicas para reivindicar cada evento e cada provisionamento uma única vez,
  inclusive quando `CONFIRMED` e `RECEIVED` chegam quase juntos.

## 2. Configurar variáveis no site

Use `.env.example` como referência. Em produção:

- `ASAAS_ENVIRONMENT=production` somente depois da homologação completa;
- `ASAAS_API_KEY` deve pertencer à conta exclusiva de cobrança do SaaS;
- `ASAAS_WEBHOOK_TOKEN` precisa ter entre 32 e 255 caracteres e não pode ser a
  API Key;
- `LOTTI_API_URL` aponta para a API da Lotti (sem `/api` no final);
- `CHECKOUT_API_TOKEN` é o mesmo valor configurado na API (32+ caracteres) e
  permanece exclusivamente no backend;
- na **API** (Railway), `CHECKOUT_API_TOKEN` e `LOTTI_APP_PASSWORD_SETUP_URL`
  (página de criação de senha da plataforma, ex.: `https://app.plataformalotti.com.br/nova-senha`);
  sem a página de senha a API recusa o checkout antes de qualquer cobrança;
- `CHECKOUT_ALLOWED_ORIGINS` deve conter somente os domínios oficiais do site.

Sem essas variáveis, a interface abre normalmente, mas a API responde com modo
indisponível e não cria cobranças.

## 3. Configurar o webhook no Asaas

No Sandbox, crie um webhook com:

```text
URL: https://SEU-DOMINIO/api/webhooks/asaas
Token: o mesmo valor de ASAAS_WEBHOOK_TOKEN
Entrega: SEQUENTIALLY
```

Eventos mínimos recomendados:

```text
PAYMENT_CONFIRMED
PAYMENT_RECEIVED
PAYMENT_OVERDUE
PAYMENT_REFUNDED
PAYMENT_PARTIALLY_REFUNDED
PAYMENT_CHARGEBACK_REQUESTED
PAYMENT_CHARGEBACK_DISPUTE
PAYMENT_DELETED
```

O endpoint retorna `200` para duplicatas e eventos que não pertencem ao checkout.
Falhas internas retornam `503`, mantendo o evento elegível para nova tentativa.

## 4. Acesso da conta

A conta nasce no login próprio da plataforma (`auth.users` + `usuarios`, sem
senha); o gatilho `handle_new_user` cria o corretor. A página
`LOTTI_APP_PASSWORD_SETUP_URL?token=...` da plataforma chama
`POST /api/auth/definir-senha`, que grava a senha e já entra na conta. Enquanto
não houver provedor de e-mail, quem fechar a tela de sucesso antes de criar a
senha precisa de atendimento (a recuperação de senha por e-mail ainda está
desligada).

## 5. Homologação obrigatória

Antes de trocar para produção, validar no Sandbox:

- PIX criado, pago manualmente no painel e confirmado pelo webhook;
- cartão aprovado, recusado e com timeout inconclusivo;
- reenvio do mesmo evento sem duplicar convite ou assinatura;
- conta nova recebendo o botão de criar senha e conta existente o de entrar;
- cartão mensal com os três valores do catálogo (R$ 279, R$ 399 e R$ 799);
- PIX anual com os totais de R$ 2.790, R$ 3.990 e R$ 7.990;
- pagamento atrasado, estorno e chargeback alterando o acesso;
- layout em HTTPS, desktop e celular.

Uma resposta de criação do Asaas ou uma página de sucesso nunca deve liberar
acesso sozinha. A fonte de verdade é o webhook autenticado e idempotente.

## Endurecimento de 25/09/2026

Aplicar também `20260925120200_checkout_payment_ledger.sql` (a plataforma mantém
as migrations de limites e reservas de IA). O webhook consulta o estado atual da
cobrança e confere cliente, assinatura, referência, valor e vencimento antes de
aplicar o recebimento. A tabela `checkout_payments` evita contar CONFIRMED e
RECEIVED como duas mensalidades. Renovações atualizam o período; eventos de uma
cobrança antiga não suspendem uma cobrança posterior paga.

`CHECKOUT_ENABLED=false` é o padrão seguro. Configurar a API, chave
Asaas, token/webhook e homologar antes de mudar para `true`. Nunca repetir
automaticamente um POST de criação cujo resultado foi inconclusivo.

No repositório da plataforma, `docs/ASAAS_PLANOS_ATIVACAO.md` descreve os limites,
o procedimento de ativação e as pendências de cancelamento/troca de plano.

Aplicar tambem a migration 20260925120300 depois das migrations de limites da plataforma (20260925120000/120100). Ela limita tentativas por IP com chave HMAC, sem guardar o IP bruto. As cinco migrations desta entrega ja foram aplicadas e registradas no projeto Supabase vinculado em 25/09/2026.
