"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

const privateRoutePattern = /^\/(?:admin|dashboard)(?:\/|$)/;

/**
 * Product analytics is useful for the public acquisition journey, but events
 * from staff-only routes consume Vercel Web Analytics usage without improving
 * marketing or product decisions.
 */
export function PublicVercelAnalytics() {
  const pathname = usePathname();

  if (privateRoutePattern.test(pathname ?? "")) {
    return null;
  }

  return <Analytics />;
}
