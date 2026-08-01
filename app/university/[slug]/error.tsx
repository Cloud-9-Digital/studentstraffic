"use client";

import { RouteError } from "@/components/site/route-error";

export default function UniversityError({
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
      title="We couldn't load this university."
      description="The page failed to load, but the university is still in our catalogue. Try again, or browse the full list."
    />
  );
}
