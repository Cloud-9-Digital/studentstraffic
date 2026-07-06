import { z } from "zod";

import { defaultSiteUrl } from "@/lib/constants";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  CRM_LEAD_INTAKE_URL: z.string().url().optional(),
  CRM_LEAD_INTAKE_SECRET: z.string().min(1).optional(),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().min(1).optional(),
  GOOGLE_SHEETS_SHEET_NAME: z.string().min(1).optional(),
  GOOGLE_SHEETS_CLIENT_EMAIL: z.string().email().optional(),
  GOOGLE_SHEETS_PRIVATE_KEY: z.string().min(1).optional(),
  REVALIDATE_SECRET: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
  PABBLY_LEAD_WEBHOOK_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  BREVO_API_KEY: z.string().min(1).optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_REPLY_TO_EMAIL: z.string().email().optional(),
  BREVO_ADMIN_EMAIL: z.string().email().optional(),
  WATI_API_BASE_URL: z.string().url().optional(),
  WATI_ACCESS_TOKEN: z.string().min(1).optional(),
  WATI_CHANNEL_NUMBER: z.string().min(1).optional(),
  WATI_WEBHOOK_TOKEN: z.string().min(1).optional(),
  TYPESENSE_HOST: z.string().url().optional(),
  TYPESENSE_API_KEY: z.string().min(1).optional(),
  TYPESENSE_SEARCH_API_KEY: z.string().min(1).optional(),
  TYPESENSE_COLLECTION: z.string().min(1).optional(),
  LOG_DB_SLOW_QUERIES: z.enum(["0", "1"]).optional(),
  ENABLE_INLINE_JOB_PROCESSING: z.enum(["0", "1"]).optional(),
  // Rate limiting and caching (Upstash Redis)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  // Error tracking (Sentry)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_AGORA_APP_ID: z.string().min(1).optional(),
  AGORA_APP_CERTIFICATE: z.string().min(1).optional(),
  ABLY_API_KEY: z.string().min(1).optional(),
  GNEWS_API_KEY: z.string().min(1).optional(),
});

function optionalEnv(value: string | undefined) {
  return value?.trim() ? value : undefined;
}

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: optionalEnv(process.env.DATABASE_URL),
  NEXT_PUBLIC_SITE_URL: optionalEnv(process.env.NEXT_PUBLIC_SITE_URL),
  CRM_LEAD_INTAKE_URL: optionalEnv(process.env.CRM_LEAD_INTAKE_URL),
  CRM_LEAD_INTAKE_SECRET: optionalEnv(process.env.CRM_LEAD_INTAKE_SECRET),
  GOOGLE_SHEETS_SPREADSHEET_ID: optionalEnv(process.env.GOOGLE_SHEETS_SPREADSHEET_ID),
  GOOGLE_SHEETS_SHEET_NAME: optionalEnv(process.env.GOOGLE_SHEETS_SHEET_NAME),
  GOOGLE_SHEETS_CLIENT_EMAIL: optionalEnv(process.env.GOOGLE_SHEETS_CLIENT_EMAIL),
  GOOGLE_SHEETS_PRIVATE_KEY: optionalEnv(process.env.GOOGLE_SHEETS_PRIVATE_KEY),
  REVALIDATE_SECRET: optionalEnv(process.env.REVALIDATE_SECRET),
  CRON_SECRET: optionalEnv(process.env.CRON_SECRET),
  PABBLY_LEAD_WEBHOOK_URL: optionalEnv(process.env.PABBLY_LEAD_WEBHOOK_URL),
  NEXTAUTH_SECRET: optionalEnv(process.env.NEXTAUTH_SECRET),
  BREVO_API_KEY: optionalEnv(process.env.BREVO_API_KEY),
  BREVO_SENDER_EMAIL: optionalEnv(process.env.BREVO_SENDER_EMAIL),
  BREVO_REPLY_TO_EMAIL: optionalEnv(process.env.BREVO_REPLY_TO_EMAIL),
  BREVO_ADMIN_EMAIL: optionalEnv(process.env.BREVO_ADMIN_EMAIL),
  WATI_API_BASE_URL: optionalEnv(process.env.WATI_API_BASE_URL),
  WATI_ACCESS_TOKEN: optionalEnv(process.env.WATI_ACCESS_TOKEN),
  WATI_CHANNEL_NUMBER: optionalEnv(process.env.WATI_CHANNEL_NUMBER),
  WATI_WEBHOOK_TOKEN: optionalEnv(process.env.WATI_WEBHOOK_TOKEN),
  TYPESENSE_HOST: optionalEnv(process.env.TYPESENSE_HOST),
  TYPESENSE_API_KEY: optionalEnv(process.env.TYPESENSE_API_KEY),
  TYPESENSE_SEARCH_API_KEY: optionalEnv(process.env.TYPESENSE_SEARCH_API_KEY),
  TYPESENSE_COLLECTION: optionalEnv(process.env.TYPESENSE_COLLECTION),
  LOG_DB_SLOW_QUERIES: optionalEnv(process.env.LOG_DB_SLOW_QUERIES),
  ENABLE_INLINE_JOB_PROCESSING: optionalEnv(process.env.ENABLE_INLINE_JOB_PROCESSING),
  UPSTASH_REDIS_REST_URL: optionalEnv(process.env.UPSTASH_REDIS_REST_URL),
  UPSTASH_REDIS_REST_TOKEN: optionalEnv(process.env.UPSTASH_REDIS_REST_TOKEN),
  NEXT_PUBLIC_SENTRY_DSN: optionalEnv(process.env.NEXT_PUBLIC_SENTRY_DSN),
  SENTRY_AUTH_TOKEN: optionalEnv(process.env.SENTRY_AUTH_TOKEN),
  NEXT_PUBLIC_AGORA_APP_ID: optionalEnv(process.env.NEXT_PUBLIC_AGORA_APP_ID),
  AGORA_APP_CERTIFICATE: optionalEnv(process.env.AGORA_APP_CERTIFICATE),
  ABLY_API_KEY: optionalEnv(process.env.ABLY_API_KEY),
  GNEWS_API_KEY: optionalEnv(process.env.GNEWS_API_KEY),
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
  googleSheetsSpreadsheetId: parsedEnv.data.GOOGLE_SHEETS_SPREADSHEET_ID,
  googleSheetsSheetName: parsedEnv.data.GOOGLE_SHEETS_SHEET_NAME,
  googleSheetsClientEmail: parsedEnv.data.GOOGLE_SHEETS_CLIENT_EMAIL,
  googleSheetsPrivateKey: parsedEnv.data.GOOGLE_SHEETS_PRIVATE_KEY,
  revalidateSecret: parsedEnv.data.REVALIDATE_SECRET,
  cronSecret: parsedEnv.data.CRON_SECRET,
  pabblyLeadWebhookUrl: parsedEnv.data.PABBLY_LEAD_WEBHOOK_URL,
  nextAuthSecret: parsedEnv.data.NEXTAUTH_SECRET,
  brevoApiKey: parsedEnv.data.BREVO_API_KEY,
  brevoSenderEmail: parsedEnv.data.BREVO_SENDER_EMAIL ?? "updates@studentstraffic.com",
  brevoReplyToEmail: parsedEnv.data.BREVO_REPLY_TO_EMAIL ?? "hello@studentstraffic.com",
  brevoAdminEmail: parsedEnv.data.BREVO_ADMIN_EMAIL ?? "hello@studentstraffic.com",
  watiApiBaseUrl: parsedEnv.data.WATI_API_BASE_URL,
  watiAccessToken: parsedEnv.data.WATI_ACCESS_TOKEN,
  watiChannelNumber: parsedEnv.data.WATI_CHANNEL_NUMBER,
  watiWebhookToken: parsedEnv.data.WATI_WEBHOOK_TOKEN,
  typesenseHost: parsedEnv.data.TYPESENSE_HOST,
  typesenseApiKey: parsedEnv.data.TYPESENSE_API_KEY,
  typesenseSearchApiKey: parsedEnv.data.TYPESENSE_SEARCH_API_KEY,
  typesenseCollection:
    parsedEnv.data.TYPESENSE_COLLECTION ?? "studentstraffic_search",
  hasDatabase: Boolean(parsedEnv.data.DATABASE_URL),
  hasCrmLeadSyncConfig: Boolean(
    parsedEnv.data.CRM_LEAD_INTAKE_URL && parsedEnv.data.CRM_LEAD_INTAKE_SECRET
  ),
  hasGoogleSheetsSyncConfig: Boolean(
    parsedEnv.data.GOOGLE_SHEETS_SPREADSHEET_ID &&
      parsedEnv.data.GOOGLE_SHEETS_SHEET_NAME &&
      parsedEnv.data.GOOGLE_SHEETS_CLIENT_EMAIL &&
      parsedEnv.data.GOOGLE_SHEETS_PRIVATE_KEY
  ),
  hasRevalidateSecret: Boolean(parsedEnv.data.REVALIDATE_SECRET),
  hasCronSecret: Boolean(parsedEnv.data.CRON_SECRET),
  hasPabblyLeadWebhook: Boolean(parsedEnv.data.PABBLY_LEAD_WEBHOOK_URL),
  hasAdminAuthConfig: Boolean(parsedEnv.data.NEXTAUTH_SECRET),
  hasBrevo: Boolean(parsedEnv.data.BREVO_API_KEY),
  hasWati: Boolean(
    parsedEnv.data.WATI_API_BASE_URL &&
      parsedEnv.data.WATI_ACCESS_TOKEN &&
      parsedEnv.data.WATI_CHANNEL_NUMBER
  ),
  hasTypesenseSearch: Boolean(
    parsedEnv.data.TYPESENSE_HOST &&
      (parsedEnv.data.TYPESENSE_SEARCH_API_KEY || parsedEnv.data.TYPESENSE_API_KEY)
  ),
  hasTypesenseAdmin: Boolean(
    parsedEnv.data.TYPESENSE_HOST && parsedEnv.data.TYPESENSE_API_KEY
  ),
  logDbSlowQueries: parsedEnv.data.LOG_DB_SLOW_QUERIES === "1",
  enableInlineJobProcessing:
    parsedEnv.data.ENABLE_INLINE_JOB_PROCESSING === "1",
  upstashRedisRestUrl: parsedEnv.data.UPSTASH_REDIS_REST_URL,
  upstashRedisRestToken: parsedEnv.data.UPSTASH_REDIS_REST_TOKEN,
  sentryDsn: parsedEnv.data.NEXT_PUBLIC_SENTRY_DSN,
  sentryAuthToken: parsedEnv.data.SENTRY_AUTH_TOKEN,
  agoraAppId: parsedEnv.data.NEXT_PUBLIC_AGORA_APP_ID,
  agoraAppCertificate: parsedEnv.data.AGORA_APP_CERTIFICATE,
  ablyApiKey: parsedEnv.data.ABLY_API_KEY,
  gNewsApiKey: parsedEnv.data.GNEWS_API_KEY,
  hasUpstashRedis: Boolean(
    parsedEnv.data.UPSTASH_REDIS_REST_URL && parsedEnv.data.UPSTASH_REDIS_REST_TOKEN
  ),
  hasSentry: Boolean(parsedEnv.data.NEXT_PUBLIC_SENTRY_DSN),
  hasAgoraVoice: Boolean(
    parsedEnv.data.NEXT_PUBLIC_AGORA_APP_ID && parsedEnv.data.AGORA_APP_CERTIFICATE
  ),
  hasAblyRealtime: Boolean(parsedEnv.data.ABLY_API_KEY),
};
