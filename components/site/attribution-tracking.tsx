"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  ATTRIBUTION_COOKIE_MAX_AGE,
  CLICK_ID_KEYS,
  TRACKING_COOKIE_MAX_AGE,
  UTM_KEYS,
  trackingCookieNames,
} from "@/lib/tracking";

function getCookie(name: string) {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

function setCookieOnce(name: string, value: string, maxAgeSeconds: number) {
  if (getCookie(name) !== undefined) return;
  setCookie(name, value, maxAgeSeconds);
}

/**
 * Persists attribution data (UTM params, ad click IDs, first-touch landing
 * page/referrer, an anonymous visitor ID) to cookies on every page view.
 *
 * Without this, getTrackingSnapshot() in lib/tracking.ts only ever sees
 * whatever's in the *current* page's query string — a visitor who lands via
 * a UTM-tagged ad and then browses to a second page before submitting a
 * lead form loses all attribution, because nothing was ever writing these
 * values anywhere for that read logic to find.
 *
 * - visitor_id / initial_* fields: true first-touch — set once, never
 *   overwritten, so they always reflect this visitor's very first page.
 * - utm_* / click-ID fields: last-touch — overwritten whenever the current
 *   URL carries new values, so a lead is attributed to whichever campaign
 *   actually drove the visit that led to conversion.
 */
export function AttributionTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = new URL(window.location.href);

    setCookieOnce(
      trackingCookieNames.visitorId,
      crypto.randomUUID(),
      ATTRIBUTION_COOKIE_MAX_AGE
    );
    setCookieOnce(
      trackingCookieNames.initialLandingPath,
      url.pathname,
      ATTRIBUTION_COOKIE_MAX_AGE
    );
    setCookieOnce(
      trackingCookieNames.initialLandingUrl,
      url.toString(),
      ATTRIBUTION_COOKIE_MAX_AGE
    );
    setCookieOnce(
      trackingCookieNames.initialReferrer,
      document.referrer,
      ATTRIBUTION_COOKIE_MAX_AGE
    );

    const hasUtmParams = UTM_KEYS.some((key) => searchParams.has(key));

    if (hasUtmParams) {
      setCookieOnce(
        trackingCookieNames.initialUtmLandingUrl,
        url.toString(),
        ATTRIBUTION_COOKIE_MAX_AGE
      );

      // A full UTM string represents one coordinated campaign touch — set
      // every key together (clearing ones absent from this URL) rather than
      // merging with a possibly-unrelated prior campaign's leftover values.
      for (const key of UTM_KEYS) {
        setCookie(key, searchParams.get(key) ?? "", TRACKING_COOKIE_MAX_AGE);
      }
    }

    for (const key of CLICK_ID_KEYS) {
      const value = searchParams.get(key);
      if (value) {
        setCookie(key, value, TRACKING_COOKIE_MAX_AGE);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
