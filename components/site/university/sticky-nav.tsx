"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { UniversitySection } from "@/lib/university-sections";

const NAV_ITEMS: Array<{ label: string; section: UniversitySection | null }> = [
  { label: "Overview", section: null },
  { label: "Programs", section: "programs" },
  { label: "Academics", section: "academics" },
  { label: "Admissions", section: "admissions" },
  { label: "Eligibility", section: "eligibility" },
  { label: "Student Life", section: "student-life" },
  { label: "Fees", section: "fees" },
  { label: "Recognition", section: "recognition" },
  { label: "Hostel", section: "hostel" },
  { label: "Country", section: "country" },
  { label: "City", section: "city" },
  { label: "FAQ", section: "faq" },
];

export function UniversityPageNav({
  universitySlug,
  activeSection,
  onSectionChange,
}: {
  universitySlug: string;
  activeSection?: UniversitySection | null;
  onSectionChange?: (section: UniversitySection | null) => void;
}) {
  return (
    <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container-shell">
        <nav
          aria-label="Page sections"
          className="flex overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {NAV_ITEMS.map(({ label, section }) => {
            const isActive = section === (activeSection ?? null);
            const href =
              section === null
                ? `/university/${universitySlug}`
                : `/university/${universitySlug}-${section}`;
            return (
              <Link
                key={label}
                href={href}
                scroll={false}
                className={cn(
                  "shrink-0 border-b-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
                onClick={(e) => {
                  if (onSectionChange) {
                    e.preventDefault();
                    onSectionChange(section);
                  }
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
