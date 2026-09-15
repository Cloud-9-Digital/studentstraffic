"use client";

import { Check, Phone, ShieldCheck } from "lucide-react";

import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Anchor for the inline panel — the mobile bar's scroll target. */
export const APPLY_PANEL_ID = "apply";
/** Anchor for the sticky desktop rail — the hero CTA's focus target. */
export const APPLY_RAIL_ID = "apply-rail";

const SUPPORT_PHONE = "+919176162888";
const SUPPORT_PHONE_LABEL = "+91 91761 62888";

const ASSURANCES = [
  "Seat availability checked before you apply",
  "Current recognition status verified",
  "Application, documents and visa handled",
] as const;

type ApplyPanelProps = {
  universityName: string;
  universitySlug: string;
  countrySlug: string;
  courseSlug?: string;
  sourcePath: string;
  /** Distinguishes rail vs inline submissions in lead analytics. */
  ctaVariant: string;
  /**
   * "rail" is the sticky desktop column; "inline" is the full-width block used
   * on mobile and at the foot of section pages.
   */
  variant?: "rail" | "inline";
  /**
   * DOM id used as a scroll/focus target. The rail and the inline panel are
   * both rendered but only one is displayed per breakpoint, so each needs its
   * own id rather than sharing one.
   */
  panelId?: string;
  className?: string;
};

export function ApplyPanel({
  universityName,
  universitySlug,
  countrySlug,
  courseSlug,
  sourcePath,
  ctaVariant,
  variant = "inline",
  panelId,
  className,
}: ApplyPanelProps) {
  const isRail = variant === "rail";

  return (
    <section
      id={panelId}
      aria-labelledby={`${ctaVariant}-heading`}
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-primary/20 bg-background shadow-sm scroll-mt-28",
        className,
      )}
    >
      <div className="border-b border-primary/15 bg-primary/5 px-5 py-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
          Admissions support
        </p>
        <h2
          id={`${ctaVariant}-heading`}
          className={cn(
            "mt-1.5 font-display font-semibold tracking-tight text-heading",
            isRail ? "text-xl leading-snug" : "text-2xl sm:text-3xl",
          )}
        >
          Apply to {universityName}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Share your details and an admissions specialist will call you with the
          next step. The consultation is free.
        </p>
      </div>

      <div className="px-5 py-5">
        <DeferredLeadForm
          sourcePath={sourcePath}
          ctaVariant={ctaVariant}
          universitySlug={universitySlug}
          countrySlug={countrySlug}
          courseSlug={courseSlug}
          notes={`University enquiry: ${universityName}`}
          submitLabel="Get free admission help"
          lockInterest
          embedded
          stacked={isRail}
        />

        <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
          {ASSURANCES.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"
            >
              <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <ShieldCheck className="size-3.5 shrink-0" />
            Free · No commission bias
          </span>
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="flex items-center gap-1.5 text-xs font-medium text-foreground transition-colors hover:text-primary"
          >
            <Phone className="size-3.5 shrink-0" />
            {SUPPORT_PHONE_LABEL}
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Desktop hero CTA. The rail form is already on screen, so this focuses it
 * rather than opening a dialog — one form per breakpoint keeps the conversion
 * path (and its analytics) unambiguous.
 */
export function FocusApplyRailButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const focusRailForm = () => {
    const rail = document.getElementById(APPLY_RAIL_ID);
    if (!rail) return;

    rail.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // The rail form is lazy-loaded, so the first field may still be a skeleton
    // at click time. Poll briefly rather than silently doing nothing.
    const deadline = performance.now() + 1500;
    const focusWhenReady = () => {
      const field = rail.querySelector<HTMLInputElement>(
        'input[name="fullName"]',
      );

      if (field) {
        field.focus({ preventScroll: true });
        return;
      }

      if (performance.now() < deadline) {
        requestAnimationFrame(focusWhenReady);
      }
    };

    requestAnimationFrame(focusWhenReady);
  };

  return (
    <Button
      type="button"
      variant="accent"
      className={className}
      onClick={focusRailForm}
    >
      {children}
    </Button>
  );
}
