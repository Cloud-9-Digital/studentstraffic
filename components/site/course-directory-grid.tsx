"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CourseDirectoryEntry } from "@/lib/course-directory";
import { getCourseHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

const courseThemes: Record<string, { card: string; action: string }> = {
  mbbs: {
    card: "border-primary/15 bg-[linear-gradient(180deg,rgba(11,49,43,0.05)_0%,#ffffff_38%)] hover:border-primary/30",
    action: "text-primary",
  },
  bds: {
    card: "border-[#b96f5b]/15 bg-[linear-gradient(180deg,rgba(185,111,91,0.06)_0%,#ffffff_38%)] hover:border-[#b96f5b]/30",
    action: "text-[#9f4d36]",
  },
  "medical-pg": {
    card: "border-[#355e8a]/15 bg-[linear-gradient(180deg,rgba(53,94,138,0.06)_0%,#ffffff_38%)] hover:border-[#355e8a]/30",
    action: "text-[#2f5a86]",
  },
  nursing: {
    card: "border-[#2d6b64]/15 bg-[linear-gradient(180deg,rgba(45,107,100,0.06)_0%,#ffffff_38%)] hover:border-[#2d6b64]/30",
    action: "text-[#235b55]",
  },
};

function getConciseSummary(value: string) {
  const plain = value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  const sentence = plain.match(/^[^.!?]+[.!?]/)?.[0]?.trim() || plain;
  return sentence.length <= 155 ? sentence : `${sentence.slice(0, 152).trimEnd()}...`;
}

export function CourseDirectoryGrid({
  initialEntries,
  total,
}: {
  initialEntries: CourseDirectoryEntry[];
  total: number;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  async function loadMore() {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(`/api/courses-directory?offset=${entries.length}`);
      if (!response.ok) throw new Error("Unable to load courses.");
      const payload = (await response.json()) as { entries: CourseDirectoryEntry[] };
      setEntries((current) => [...current, ...payload.entries]);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((course) => {
          const theme = courseThemes[course.slug] ?? {
            card: "border-border hover:border-primary/20",
            action: "text-primary",
          };
          return (
            <Link
              key={course.slug}
              href={getCourseHref(course.slug)}
              className={cn(
                "group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                theme.card,
              )}
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{course.name}</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-heading">{course.shortName}</h2>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Duration</p>
                    <p className="mt-2 text-sm font-semibold text-heading">{course.durationYears} year{course.durationYears === 1 ? "" : "s"}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{getConciseSummary(course.summary)}</p>
                <div className="mt-5 border-t border-border/70 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      {course.programCount} option{course.programCount === 1 ? "" : "s"} across {course.countryCount} countr{course.countryCount === 1 ? "y" : "ies"}
                    </p>
                    <span className={cn("inline-flex items-center gap-2 text-sm font-semibold", theme.action)}>
                      Open guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {entries.length < total ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button type="button" variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loadError ? "Try loading again" : "Show more courses"}
          </Button>
          {loadError ? <p className="text-sm text-muted-foreground">More courses could not be loaded. Please try again.</p> : null}
        </div>
      ) : null}
    </>
  );
}
