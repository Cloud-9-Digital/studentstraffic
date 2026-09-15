"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";

import { APPLY_PANEL_ID } from "./apply-panel";

const SUPPORT_PHONE = "+919176162888";

/** Show the bar only once the hero CTA has scrolled out of reach. */
const REVEAL_OFFSET_PX = 520;

/**
 * Sections marked `.deferred-render` use content-visibility:auto, so their
 * heights are not resolved until they approach the viewport. Reveal them long
 * enough to compute a real scroll target, then hand visibility back.
 */
function scrollToApplyPanel() {
  const target = document.getElementById(APPLY_PANEL_ID);
  if (!target) return;

  const deferred = document.querySelectorAll<HTMLElement>(".deferred-render");
  deferred.forEach((node) => {
    node.style.contentVisibility = "visible";
  });

  void document.body.offsetHeight;
  target.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    deferred.forEach((node) => {
      node.style.contentVisibility = "";
    });
  }, 1500);
}

export function MobileApplyBar({ universityName }: { universityName: string }) {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [panelInView, setPanelInView] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > REVEAL_OFFSET_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide the bar while the form itself is on screen — otherwise it sits on top
  // of the submit button.
  useEffect(() => {
    const panel = document.getElementById(APPLY_PANEL_ID);
    if (!panel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setPanelInView(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: "0px 0px -20% 0px" },
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  const visible = scrolledPastHero && !panelInView;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm transition-transform duration-200 lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <a
          href={`tel:${SUPPORT_PHONE}`}
          tabIndex={visible ? undefined : -1}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          <Phone className="size-4" />
          Call
        </a>
        <button
          type="button"
          tabIndex={visible ? undefined : -1}
          onClick={scrollToApplyPanel}
          className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <span className="truncate">Apply to {universityName}</span>
          <ArrowRight className="size-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
