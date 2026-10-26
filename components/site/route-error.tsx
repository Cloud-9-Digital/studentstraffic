"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";

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
  title = "Something went wrong",
  description = "This page didn't load properly. Please try again in a moment.",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}) {
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    `Hi Students Traffic, a page didn't load for me${error.digest ? ` (reference ${error.digest})` : ""}.`,
  )}`;

  return (
    <div className="container-shell flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <ErrorIllustration className="size-28" />

      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading">{title}</h1>
      <p className="mt-2 max-w-md text-base text-muted-foreground">{description}</p>

      <div className="mt-7 flex items-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Still not working?{" "}
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium text-heading underline-offset-4 hover:underline">
          Message us on WhatsApp
        </a>
        {/* The digest is the only handle support has on a server-side failure. */}
        {error.digest ? <> · Ref <span className="font-mono">{error.digest}</span></> : null}
      </p>
    </div>
  );
}

/** A torn page on a soft circle. currentColor follows the theme's heading green; the tear uses the accent. */
function ErrorIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden className={`text-heading ${className ?? ""}`}>
      <circle cx="60" cy="60" r="56" fill="currentColor" fillOpacity="0.07" />
      <path d="M40 28h28l14 14v50a4 4 0 0 1-4 4H40a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4z" className="fill-background" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M68 28v10a4 4 0 0 0 4 4h10" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M44 52h22M44 60h30" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
      <path className="text-accent" d="M36 72l8 6 8-6 8 6 8-6 8 6 6-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
