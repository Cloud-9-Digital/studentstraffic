"use client";

import Link from "next/link";
import { MoveRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Shared UI for route-segment error boundaries (`error.tsx`).
 *
 * This is deliberately separate from `app/global-error.tsx`. `global-error`
 * only catches failures in the root layout and replaces the whole document,
 * so it renders without the header, nav or any CTA. A segment boundary keeps
 * the layout mounted, which means a failed query on one route degrades to a
 * branded panel with a way forward instead of a bare error page.
 */
export function RouteError({
  error,
  reset,
  title = "Something went wrong.",
  description = "We hit a problem loading this page. It is usually temporary — try again, or keep exploring from one of the links below.",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Dot-grid texture — matches not-found.tsx */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.35,
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-full w-72 -skew-x-6 bg-accent/4"
        aria-hidden
      />

      <div className="container-shell relative z-10 flex min-h-[60vh] flex-col justify-center py-20">
        <div className="max-w-xl">
          <p
            className="font-display select-none text-[7rem] font-semibold leading-none tracking-tighter text-heading/[0.06] sm:text-[9rem]"
            aria-hidden
          >
            Oops
          </p>

          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
            {description}
          </p>

          {/* The digest is the only handle support has on a server-side
              failure, so surface it rather than hiding the error entirely. */}
          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Reference: {error.digest}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={reset} size="default">
              <RotateCcw className="size-4" />
              Try again
            </Button>
            <Button asChild variant="outline" size="default">
              <Link href="/universities">
                Browse universities
                <MoveRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="default">
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
