"use client";

import { RouteError } from "@/components/site/route-error";

/**
 * Catch-all landing pages (guides, programme pages, SEO landing routes) are the
 * main organic entry points, so a failure here is the most expensive one to
 * leave unhandled — the visitor arrives from search and would otherwise see an
 * unbranded error page with no route back into the funnel.
 */
export default function LandingPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="We couldn't load this page."
      description="Something went wrong on our side. Try again, or jump straight into the universities and destinations we cover."
    />
  );
}
