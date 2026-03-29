type HeaderStore = {
  get(name: string): string | null;
};

export type QueryParamValue = string | string[];
export type QueryParamMap = Record<string, QueryParamValue>;
export type ClientContext = Record<
  string,
  string | number | boolean | null | string[]
>;

export function emptyToUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

export function parseJsonObject<T extends Record<string, unknown>>(
  value?: string | null
): T {
  if (!value) {
    return {} as T;
  }

  try {
    const parsed = JSON.parse(value);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {}

  return {} as T;
}

export function getFirstQueryValue(
  query: QueryParamMap,
  key: string
): string | undefined {
  const value = query[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === "string" && value ? value : undefined;
}

export function getIpAddress(headerStore: HeaderStore) {
  const forwardedFor = headerStore.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return (
    headerStore.get("x-real-ip") ??
    headerStore.get("cf-connecting-ip") ??
    null
  );
}

export function wasSubmittedTooFast(startedAt: string) {
  return Date.now() - Number(startedAt) < 1200;
}

export function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000);
}
