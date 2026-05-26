import { loginMobileUser, toMobileUser } from "@/lib/mobile/auth";
import {
  assertMobileLoginRateLimit,
  normalizeMobileEmail,
  recordFailedMobileLoginAttempt,
  resetMobileLoginAttempts,
} from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mobileLoginSchema } from "@/lib/mobile/schemas";
import { getRequestIpAddress } from "@/lib/security/request";

export async function POST(request: Request) {
  const parsed = mobileLoginSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const normalizedEmail = normalizeMobileEmail(parsed.data.email);
  const ipAddress = getRequestIpAddress(request.headers);
  const blockedMessage = await assertMobileLoginRateLimit(normalizedEmail, ipAddress);
  if (blockedMessage) {
    return mobileError("rate_limited", blockedMessage, 429);
  }

  const result = await loginMobileUser(normalizedEmail, parsed.data.password, {
    deviceName: request.headers.get("x-device-name"),
    platform: request.headers.get("x-platform"),
    appVersion: request.headers.get("x-app-version"),
  });

  if ("error" in result) {
    const code = result.error ?? "unavailable";
    if (code === "invalid") {
      const rateLimitMessage = await recordFailedMobileLoginAttempt(normalizedEmail, ipAddress);
      if (rateLimitMessage) {
        return mobileError("rate_limited", rateLimitMessage, 429);
      }
    }

    return mobileError(
      code,
      code === "invalid" ? "Invalid email or password." : "Service unavailable.",
      code === "invalid" ? 401 : 503
    );
  }

  await resetMobileLoginAttempts(normalizedEmail, ipAddress);

  return mobileJson({
    token: result.session.token,
    expiresAt: result.session.expires.toISOString(),
    user: toMobileUser(result.user),
  });
}
