"use client";

import { useEffect, useRef } from "react";

import { trackLeadFormSuccess } from "@/lib/analytics";

type ThankYouAnalyticsProps = {
  source?: string;
  interest?: string;
  variant?: string;
  /**
   * Shared id minted by `submitLeadAction` and passed through as `?eid=`. Sent
   * to Meta as `eventID` so this browser `Lead` and the server-side Conversions
   * API `Lead` collapse into one conversion instead of two.
   */
  eventId?: string;
};

export function ThankYouAnalytics({
  source,
  interest,
  variant = "website_lead",
  eventId,
}: ThankYouAnalyticsProps) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;
    trackLeadFormSuccess(
      {
        source_path: source,
        interest,
        variant,
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      },
      eventId
    );
  }, [eventId, interest, source, variant]);

  return null;
}
