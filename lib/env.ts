import { z } from "zod";

import { defaultSiteUrl } from "@/lib/constants";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  CRM_LEAD_INTAKE_URL: z.string().url().optional(),
  CRM_LEAD_INTAKE_SECRET: z.string().min(1).optional(),
  PABBLY_LEAD_WEBHOOK_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  BREVO_API_KEY: z.string().min(1).optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_REPLY_TO_EMAIL: z.string().email().optional(),
  BREVO_ADMIN_EMAIL: z.string().email().optional(),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  CRM_LEAD_INTAKE_URL: process.env.CRM_LEAD_INTAKE_URL,
  CRM_LEAD_INTAKE_SECRET: process.env.CRM_LEAD_INTAKE_SECRET,
  PABBLY_LEAD_WEBHOOK_URL: process.env.PABBLY_LEAD_WEBHOOK_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  BREVO_REPLY_TO_EMAIL: process.env.BREVO_REPLY_TO_EMAIL,
  BREVO_ADMIN_EMAIL: process.env.BREVO_ADMIN_EMAIL,
});

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${parsedEnv.error.message}`);
}

const globalForEnvWarnings = globalThis as typeof globalThis & {
  __siteUrlWarningShown?: boolean;
};

if (
  process.env.NODE_ENV === "production" &&
  !parsedEnv.data.NEXT_PUBLIC_SITE_URL &&
  !globalForEnvWarnings.__siteUrlWarningShown
) {
  globalForEnvWarnings.__siteUrlWarningShown = true;
  console.warn(
    "NEXT_PUBLIC_SITE_URL is not set in production. Canonical URLs and social metadata will fall back to http://localhost:3000."
  );
}

export const env = {
  databaseUrl: parsedEnv.data.DATABASE_URL,
  siteUrl: parsedEnv.data.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl,
  crmLeadIntakeUrl: parsedEnv.data.CRM_LEAD_INTAKE_URL,
  crmLeadIntakeSecret: parsedEnv.data.CRM_LEAD_INTAKE_SECRET,
  pabblyLeadWebhookUrl: parsedEnv.data.PABBLY_LEAD_WEBHOOK_URL,
  nextAuthSecret: parsedEnv.data.NEXTAUTH_SECRET,
  brevoApiKey: parsedEnv.data.BREVO_API_KEY,
  brevoSenderEmail: parsedEnv.data.BREVO_SENDER_EMAIL ?? "updates@studentstraffic.com",
  brevoReplyToEmail: parsedEnv.data.BREVO_REPLY_TO_EMAIL ?? "hello@studentstraffic.com",
  brevoAdminEmail: parsedEnv.data.BREVO_ADMIN_EMAIL ?? "hello@studentstraffic.com",
  hasDatabase: Boolean(parsedEnv.data.DATABASE_URL),
  hasCrmLeadSyncConfig: Boolean(
    parsedEnv.data.CRM_LEAD_INTAKE_URL && parsedEnv.data.CRM_LEAD_INTAKE_SECRET
  ),
  hasPabblyLeadWebhook: Boolean(parsedEnv.data.PABBLY_LEAD_WEBHOOK_URL),
  hasAdminAuthConfig: Boolean(parsedEnv.data.NEXTAUTH_SECRET),
  hasBrevo: Boolean(parsedEnv.data.BREVO_API_KEY),
};
