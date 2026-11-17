import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const asArray = (result) => (Array.isArray(result) ? result : (result?.items ?? []));
const newToken = () => `${crypto.randomUUID().replace(/-/g, "")}${crypto.randomUUID().replace(/-/g, "")}`;

const requireAdmin = (context) => {
  if (context.user?.role !== "admin") {
    throw Object.assign(new Error("Forbidden"), { status: 403, code: "FORBIDDEN" });
  }
};

async function ensureSetting(base44) {
  const rows = asArray(await base44.entities.BankSetting.list({ limit: 1 }));
  if (rows[0]) return rows[0];
  return base44.entities.BankSetting.create({
    bank_id: "ACB",
    bank_name: "Ngân hàng Á Châu (ACB)",
    account_number: "",
    account_name: "",
    auto_confirm: true,
    webhook_token: newToken(),
  });
}

export const getVietQrSettings = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    requireAdmin(context);
    return ensureSetting(context.getBase44().asServiceRole);
  });

export const saveVietQrSettings = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      bank_id: z.string().trim().max(20),
      bank_name: z.string().trim().max(80),
      account_number: z.string().trim().max(30),
      account_name: z.string().trim().max(80),
      auto_confirm: z.boolean(),
    }),
  )
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const setting = await ensureSetting(base44);
    return base44.entities.BankSetting.update(setting.id, {
      bank_id: data.bank_id,
      bank_name: data.bank_name,
      account_number: data.account_number,
      account_name: data.account_name,
      auto_confirm: data.auto_confirm,
    });
  });

export const regenerateVietQrToken = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    requireAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const setting = await ensureSetting(base44);
    return base44.entities.BankSetting.update(setting.id, { webhook_token: newToken() });
  });

// Thông tin công khai cho trang thanh toán của khách (không lộ mã webhook).
export const getPublicBankInfo = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const setting = asArray(await context.getBase44().asServiceRole.entities.BankSetting.list({ limit: 1 }))[0];
  if (!setting) return null;
  return {
    bank_id: setting.bank_id || "",
    bank_name: setting.bank_name || "",
    account_number: setting.account_number || "",
    account_name: setting.account_name || "",
    auto_confirm: setting.auto_confirm !== false,
  };
});