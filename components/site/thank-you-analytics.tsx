"use client";

import { useEffect, useRef } from "react";

import { trackLeadFormSuccess } from "@/lib/analytics";

type ThankYouAnalyticsProps = {
  source?: string;
  interest?: string;
  variant?: string;
};

export function ThankYouAnalytics({
  source,
  interest,
  variant = "website_lead",
}: ThankYouAnalyticsProps) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;
    trackLeadFormSuccess({
      source_path: source,
      interest,
      variant,
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, [interest, source, variant]);

  return null;
}
