type HeaderValue = string | string[] | null | undefined;

export type HeaderSource =
  | Headers
  | Record<string, HeaderValue>
  | {
      get(name: string): string | null;
    };

function isHeadersInstance(value: HeaderSource): value is Headers {
  return typeof Headers !== "undefined" && value instanceof Headers;
}

function hasGetter(
  value: HeaderSource
): value is {
  get(name: string): string | null;
} {
  return typeof (value as { get?: unknown }).get === "function";
}

export function getHeaderValue(
  headerSource: HeaderSource,
  name: string
): string | null {
  const normalizedName = name.toLowerCase();

  if (isHeadersInstance(headerSource)) {
    return headerSource.get(normalizedName);
  }

  if (hasGetter(headerSource)) {
    return (
      headerSource.get(normalizedName) ??
      headerSource.get(name) ??
      null
    );
  }

  const directValue =
    headerSource[normalizedName] ??
    headerSource[name] ??
    headerSource[name.toUpperCase()];

  if (Array.isArray(directValue)) {
    return directValue[0] ?? null;
  }

  return typeof directValue === "string" ? directValue : null;
}

export function getRequestIpAddress(headerSource: HeaderSource) {
  const forwardedFor = getHeaderValue(headerSource, "x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return (
    getHeaderValue(headerSource, "x-real-ip") ??
    getHeaderValue(headerSource, "cf-connecting-ip") ??
    null
  );
}

export function getRequestUserAgent(headerSource: HeaderSource) {
  return getHeaderValue(headerSource, "user-agent");
}
