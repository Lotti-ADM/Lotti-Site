import "server-only";

import type { AsaasPayment } from "@/lib/asaas/server";
import type { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  claimCheckoutOrderProvisioning,
  updateCheckoutOrder,
  type CheckoutOrder,
} from "./repository";

type CorretorRow = {
  id: string;
  user_id: string;
};

async function findCorretorByEmail(email: string): Promise<CorretorRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("corretores")
    .select("id,user_id")
    .ilike("email", email.replace(/[\\%_]/g, "\\$&"))
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`PROVISION_PROFILE_LOOKUP_FAILED:${error.code ?? "unknown"}`);
  return data as CorretorRow | null;
}

async function findCorretorByUserId(userId: string): Promise<CorretorRow> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("corretores")
    .select("id,user_id")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(`PROVISION_PROFILE_CREATE_FAILED:${error?.code ?? "missing"}`);
  }
  return data as CorretorRow;
}

async function inviteOrFindUser(order: CheckoutOrder): Promise<{
  user: User | null;
  corretor: CorretorRow;
  invited: boolean;
}> {
  const existing = await findCorretorByEmail(order.payer_email);
  if (existing) {
    const {data,error}=await getSupabaseAdmin().auth.admin.getUserById(existing.user_id);
    if(error || data.user?.email?.toLowerCase() !== order.payer_email.toLowerCase()) throw new Error('ACCOUNT_EMAIL_MISMATCH');
    return { user: null, corretor: existing, invited: false };
  }

  const redirectTo = process.env.LOTTI_APP_PASSWORD_SETUP_URL;
  if (!redirectTo) throw new Error("PROVISION_REDIRECT_NOT_CONFIGURED");

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(order.payer_email, {
    redirectTo,
    data: {
      nome: order.payer_name,
      telefone: order.payer_phone,
      cnpj: order.payer_document,
      origem: "checkout_asaas",
    },
  });

  if (error || !data.user) {
    const profileAfterConflict = await findCorretorByEmail(order.payer_email);
    if (profileAfterConflict) {
      const verified=await supabase.auth.admin.getUserById(profileAfterConflict.user_id);
      if(verified.error || verified.data.user?.email?.toLowerCase() !== order.payer_email.toLowerCase()) throw new Error('ACCOUNT_EMAIL_MISMATCH');
      return { user: null, corretor: profileAfterConflict, invited: false };
    }
    throw new Error("PROVISION_INVITE_FAILED");
  }

  const corretor = await findCorretorByUserId(data.user.id);
  return { user: data.user, corretor, invited: true };
}

export async function applyPayment(order: CheckoutOrder, payment: AsaasPayment, userId: string): Promise<void> {
  const { error } = await getSupabaseAdmin().rpc("apply_checkout_payment", {
    p_order: order.id, p_payment: payment.id, p_customer: payment.customer,
    p_subscription: payment.subscription, p_status: payment.deleted ? "DELETED" : payment.status,
    p_due: payment.dueDate, p_amount: payment.value, p_user: userId,
  });
  if (error) throw new Error("PROVISION_PAYMENT_APPLY_FAILED");
}

async function sendRecoveryEmail(email: string): Promise<void> {
  const redirectTo = process.env.LOTTI_APP_PASSWORD_SETUP_URL;
  if (!redirectTo) throw new Error("PROVISION_REDIRECT_NOT_CONFIGURED");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error("PROVISION_RECOVERY_EMAIL_FAILED");
}

export async function provisionPaidOrder(order: CheckoutOrder, payment: AsaasPayment): Promise<void> {
  const claimed = await claimCheckoutOrderProvisioning(order.id);
  if (!claimed) throw new Error("PROVISIONING_BUSY");

  try {
    const account = await inviteOrFindUser(order);
    await applyPayment(order, payment, account.corretor.user_id);

    if (!account.invited && !order.access_email_sent_at) {
      await sendRecoveryEmail(order.payer_email);
    }

    await updateCheckoutOrder(order.id, {
      provisioned_user_id: account.corretor.user_id,
      access_email_sent_at: order.access_email_sent_at ?? new Date().toISOString(),
      provisioning_started_at: null,
      failure_code: null,
    });
  } catch (error) {
    await updateCheckoutOrder(order.id, {
      provisioning_started_at: null,
      failure_code: "PROVISIONING_RETRY",
    }).catch(() => undefined);
    throw error;
  }
}
