import "server-only";

import {
  consumeRateLimit,
  formatRetryAfterMs,
  type RateLimitRule,
} from "@/lib/security/rate-limit";

export function normalizePhoneIdentifier(phone: string) {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly || phone.trim().toLowerCase();
}

export async function consumePublicFormRateLimits(
  rules: Array<RateLimitRule | null | undefined>,
  label = "submissions"
) {
  for (const rule of rules) {
    if (!rule) {
      continue;
    }

    const status = await consumeRateLimit(rule);

    if (!status.allowed) {
      return `Too many ${label}. Please try again in ${formatRetryAfterMs(status.retryAfterMs)}.`;
    }
  }

  return null;
}
