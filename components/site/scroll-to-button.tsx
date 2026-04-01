"use client";

import { Button } from "@/components/ui/button";

export function ScrollToButton({
  targetId,
  children,
  className,
}: {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="default"
      className={className}
      onClick={() => {
        const el = document.getElementById(targetId);
        if (!el) return;

        // Temporarily disable content-visibility:auto so the browser
        // computes real heights for every section, giving us an
        // accurate scroll target.
        const deferred = document.querySelectorAll<HTMLElement>(".deferred-render");
        deferred.forEach((d) => (d.style.contentVisibility = "visible"));

        // Force synchronous reflow so layout is fully resolved.
        void document.body.offsetHeight;

        el.scrollIntoView({ behavior: "smooth", block: "start" });

        // Restore content-visibility after the scroll animation finishes.
        setTimeout(() => {
          deferred.forEach((d) => (d.style.contentVisibility = ""));
        }, 1500);
      }}
    >
      {children}
    </Button>
  );
}
