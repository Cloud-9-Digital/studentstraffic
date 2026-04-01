"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "snapshot", label: "At a Glance" },
  { id: "overview", label: "Overview" },
  { id: "programs", label: "Programs" },
  { id: "academics", label: "Academics" },
  { id: "admissions", label: "Admissions" },
  { id: "living", label: "Student Life" },
  { id: "recognition", label: "Recognition" },
  { id: "student-perspective", label: "Student Voice" },
  { id: "faq", label: "FAQ" },
] as const;

export function UniversityPageNav() {
  const [active, setActive] = useState("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-10% 0px -78% 0px", threshold: 0 },
    );

    for (const { id } of NAV_ITEMS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !navRef.current) return;
    const nav = navRef.current;
    const activeLink = nav.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!activeLink) return;
    const navLeft = nav.scrollLeft;
    const navWidth = nav.offsetWidth;
    const linkLeft = activeLink.offsetLeft;
    const linkWidth = activeLink.offsetWidth;
    const target = linkLeft - navWidth / 2 + linkWidth / 2;
    nav.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  return (
    <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container-shell">
        <nav
          ref={navRef}
          aria-label="Page sections"
          className="flex overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              data-id={id}
              className={cn(
                "shrink-0 border-b-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors",
                active === id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
