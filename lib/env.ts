import { z } from "zod";

import { defaultSiteUrl } from "@/lib/constants";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  CRM_LEAD_INTAKE_URL: z.string().url().optional(),
  CRM_LEAD_INTAKE_SECRET: z.string().min(1).optional(),
  PABBLY_LEAD_WEBHOOK_URL: z.string().url().optional(),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  CRM_LEAD_INTAKE_URL: process.env.CRM_LEAD_INTAKE_URL,
  CRM_LEAD_INTAKE_SECRET: process.env.CRM_LEAD_INTAKE_SECRET,
  PABBLY_LEAD_WEBHOOK_URL: process.env.PABBLY_LEAD_WEBHOOK_URL,
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
  hasDatabase: Boolean(parsedEnv.data.DATABASE_URL),
  hasCrmLeadSyncConfig: Boolean(
    parsedEnv.data.CRM_LEAD_INTAKE_URL && parsedEnv.data.CRM_LEAD_INTAKE_SECRET
  ),
  hasPabblyLeadWebhook: Boolean(parsedEnv.data.PABBLY_LEAD_WEBHOOK_URL),
};
