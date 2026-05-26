const DEFAULT_CALLBACK_PATH = "/dashboard";

const BLOCKED_CALLBACK_PREFIXES = ["/login", "/register", "/admin/login"];

export function getSafeCallbackPath(callbackUrl: string | null | undefined) {
  const value = callbackUrl?.trim();

  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_CALLBACK_PATH;
  }

  try {
    const parsed = new URL(value, "https://studentstraffic.local");
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;

    if (BLOCKED_CALLBACK_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}?`))) {
      return DEFAULT_CALLBACK_PATH;
    }

    return path;
  } catch {
    return DEFAULT_CALLBACK_PATH;
  }
}
