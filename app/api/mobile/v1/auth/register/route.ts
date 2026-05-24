import { registerMobileUser, toMobileUser } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mobileRegisterSchema } from "@/lib/mobile/schemas";

export async function POST(request: Request) {
  const parsed = mobileRegisterSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const result = await registerMobileUser(parsed.data, {
    deviceName: request.headers.get("x-device-name"),
    platform: request.headers.get("x-platform"),
    appVersion: request.headers.get("x-app-version"),
  });

  if ("error" in result) {
    const code = result.error ?? "unavailable";
    return mobileError(
      code,
      code === "exists" ? "An account with this email already exists." : "Service unavailable.",
      code === "exists" ? 409 : 503
    );
  }

  return mobileJson({
    token: result.session.token,
    expiresAt: result.session.expires.toISOString(),
    user: toMobileUser(result.user),
  }, { status: 201 });
}
