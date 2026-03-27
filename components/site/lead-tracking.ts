"use client";

type TrackingValue = string | string[];

function serializeSearchParams(searchParams: URLSearchParams) {
  const values: Record<string, TrackingValue> = {};

  for (const [key, value] of searchParams.entries()) {
    const current = values[key];

    if (current === undefined) {
      values[key] = value;
      continue;
    }

    if (Array.isArray(current)) {
      current.push(value);
      continue;
    }

    values[key] = [current, value];
  }

  return values;
}

function getColorSchemePreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "no-preference";
}

function setHiddenValue(
  form: HTMLFormElement | null,
  name: string,
  value: string
) {
  const input = form?.elements.namedItem(name);

  if (input instanceof HTMLInputElement) {
    input.value = value;
  }
}

export function syncLeadTrackingFields(form: HTMLFormElement | null) {
  if (!form || typeof window === "undefined") {
    return;
  }

  const navigatorWithUserAgentData = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const url = new URL(window.location.href);
  const sourceQuery = serializeSearchParams(url.searchParams);
  const clientContext = {
    language: navigator.language ?? null,
    languages: navigator.languages ?? [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
    platform:
      navigatorWithUserAgentData.userAgentData?.platform ??
      navigator.platform ??
      null,
    userAgent: navigator.userAgent ?? null,
    viewportWidth: window.innerWidth ?? null,
    viewportHeight: window.innerHeight ?? null,
    screenWidth: window.screen?.width ?? null,
    screenHeight: window.screen?.height ?? null,
    colorScheme: getColorSchemePreference(),
  };

  setHiddenValue(form, "sourceUrl", url.toString());
  setHiddenValue(form, "sourceQuery", JSON.stringify(sourceQuery));
  setHiddenValue(form, "pageTitle", document.title);
  setHiddenValue(form, "documentReferrer", document.referrer);
  setHiddenValue(form, "clientContext", JSON.stringify(clientContext));
}
