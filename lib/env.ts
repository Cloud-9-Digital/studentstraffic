import { z } from "zod";

import { defaultSiteUrl } from "@/lib/constants";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
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
  hasDatabase: Boolean(parsedEnv.data.DATABASE_URL),
};
