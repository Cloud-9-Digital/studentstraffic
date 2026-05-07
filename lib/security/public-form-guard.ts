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
  const validRules = rules.filter((rule): rule is RateLimitRule => Boolean(rule));

  if (validRules.length === 0) {
    return null;
  }

  const statuses = await Promise.all(validRules.map((rule) => consumeRateLimit(rule)));
  const blockedStatus = statuses.find((status) => !status.allowed);

  if (blockedStatus) {
    return `Too many ${label}. Please try again in ${formatRetryAfterMs(blockedStatus.retryAfterMs)}.`;
  }

  return null;
}
