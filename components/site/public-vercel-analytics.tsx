"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const privateRoutePattern = /^\/(?:admin|dashboard)(?:\/|$)/;

/**
 * Product analytics is useful for the public acquisition journey, but events
 * from staff-only routes consume Vercel Web Analytics usage without improving
 * marketing or product decisions.
 */
function PublicVercelAnalyticsContent() {
  const pathname = usePathname();

  if (privateRoutePattern.test(pathname ?? "")) {
    return null;
  }

  return <Analytics />;
}

export function PublicVercelAnalytics() {
  // usePathname() is request-bound during prerendering. Keep it inside a
  // local boundary so it never blocks a route's static shell.
  return (
    <Suspense fallback={null}>
      <PublicVercelAnalyticsContent />
    </Suspense>
  );
}
