import { loginMobileUser, toMobileUser } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mobileLoginSchema } from "@/lib/mobile/schemas";

export async function POST(request: Request) {
  const parsed = mobileLoginSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const result = await loginMobileUser(parsed.data.email, parsed.data.password, {
    deviceName: request.headers.get("x-device-name"),
    platform: request.headers.get("x-platform"),
    appVersion: request.headers.get("x-app-version"),
  });

  if ("error" in result) {
    const code = result.error ?? "unavailable";
    return mobileError(
      code,
      code === "invalid" ? "Invalid email or password." : "Service unavailable.",
      code === "invalid" ? 401 : 503
    );
  }

  return mobileJson({
    token: result.session.token,
    expiresAt: result.session.expires.toISOString(),
    user: toMobileUser(result.user),
  });
}
