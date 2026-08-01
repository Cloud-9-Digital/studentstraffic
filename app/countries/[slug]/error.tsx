"use client";

import { RouteError } from "@/components/site/route-error";

export default function CountryError({
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
      title="We couldn't load this destination."
      description="The country page failed to load. Try again, or explore universities across all our destinations."
    />
  );
}
