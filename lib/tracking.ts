export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export const CLICK_ID_KEYS = [
  "gclid",
  "fbclid",
  "gbraid",
  "wbraid",
  "ttclid",
] as const;

export const ATTRIBUTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;
export const TRACKING_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const trackingCookieNames = {
  visitorId: "visitor_id",
  initialLandingPath: "initial_landing_path",
  initialLandingUrl: "initial_landing_url",
  initialReferrer: "initial_referrer",
  initialUtmLandingUrl: "initial_utm_landing_url",
} as const;

type CookieStoreLike = {
  get(name: string): { value: string } | undefined;
};

type QueryLike = Record<string, string | string[]>;

function getFirstValue(query: QueryLike, key: string) {
  const value = query[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === "string" && value ? value : undefined;
}

export type TrackingSnapshot = {
  visitorId?: string;
  initialLandingPath?: string;
  initialLandingUrl?: string;
  initialReferrer?: string;
  initialUtmLandingUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  gbraid?: string;
  wbraid?: string;
  ttclid?: string;
  /** Meta click id cookie (`_fbc`), or one derived from a fresh `fbclid`. */
  fbc?: string;
  /** Meta browser id cookie (`_fbp`). Only the pixel can mint this. */
  fbp?: string;
};

/**
 * Meta's `_fbc` cookie is `fb.<subdomainIndex>.<creationMs>.<fbclid>`. The pixel
 * writes it, but it loads with `lazyOnload`, so a visitor who submits quickly can
 * have an `fbclid` in the URL and no cookie yet. Rebuilding it from the raw
 * `fbclid` keeps Conversions API match quality intact for exactly those visitors,
 * who are the fastest-converting ones.
 */
function deriveFbc(fbcCookie?: string, fbclid?: string) {
  if (fbcCookie) return fbcCookie;
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

export function getTrackingSnapshot(
  cookieStore: CookieStoreLike,
  sourceQuery: QueryLike
): TrackingSnapshot {
  return {
    visitorId: cookieStore.get(trackingCookieNames.visitorId)?.value,
    initialLandingPath:
      cookieStore.get(trackingCookieNames.initialLandingPath)?.value,
    initialLandingUrl:
      cookieStore.get(trackingCookieNames.initialLandingUrl)?.value,
    initialReferrer: cookieStore.get(trackingCookieNames.initialReferrer)?.value,
    initialUtmLandingUrl:
      cookieStore.get(trackingCookieNames.initialUtmLandingUrl)?.value,
    utmSource:
      cookieStore.get("utm_source")?.value ?? getFirstValue(sourceQuery, "utm_source"),
    utmMedium:
      cookieStore.get("utm_medium")?.value ?? getFirstValue(sourceQuery, "utm_medium"),
    utmCampaign:
      cookieStore.get("utm_campaign")?.value ??
      getFirstValue(sourceQuery, "utm_campaign"),
    utmTerm:
      cookieStore.get("utm_term")?.value ?? getFirstValue(sourceQuery, "utm_term"),
    utmContent:
      cookieStore.get("utm_content")?.value ??
      getFirstValue(sourceQuery, "utm_content"),
    gclid: cookieStore.get("gclid")?.value ?? getFirstValue(sourceQuery, "gclid"),
    fbclid: cookieStore.get("fbclid")?.value ?? getFirstValue(sourceQuery, "fbclid"),
    gbraid: cookieStore.get("gbraid")?.value ?? getFirstValue(sourceQuery, "gbraid"),
    wbraid: cookieStore.get("wbraid")?.value ?? getFirstValue(sourceQuery, "wbraid"),
    ttclid: cookieStore.get("ttclid")?.value ?? getFirstValue(sourceQuery, "ttclid"),
    fbc: deriveFbc(
      cookieStore.get("_fbc")?.value,
      cookieStore.get("fbclid")?.value ?? getFirstValue(sourceQuery, "fbclid"),
    ),
    fbp: cookieStore.get("_fbp")?.value,
  };
}
