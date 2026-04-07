import Link from "next/link";
import { ExternalLink, FileSearch, MapPin } from "lucide-react";

import type { WdomsDirectoryEntry } from "@/lib/data/types";
import { getUniversityHref, getWdomsSchoolHref } from "@/lib/routes";

export function WdomsProfileCard({
  entry,
}: {
  entry: WdomsDirectoryEntry;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
            <FileSearch className="size-3.5" />
            WDOMS profile
          </span>
          <h3 className="text-base font-semibold leading-7 text-foreground">
            <Link
              href={getWdomsSchoolHref(entry.countrySlug, entry.routeSlug)}
              className="transition-colors hover:text-primary"
            >
              {entry.schoolName}
            </Link>
          </h3>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4" />
          {entry.cityName}
        </span>
        {entry.yearInstructionStarted ? (
          <span>Started {entry.yearInstructionStarted}</span>
        ) : null}
        {entry.curriculumDuration ? <span>{entry.curriculumDuration}</span> : null}
      </div>

      {entry.qualificationTitle ? (
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {entry.qualificationTitle}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={getWdomsSchoolHref(entry.countrySlug, entry.routeSlug)}
          className="inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
        >
          View profile
        </Link>

        {entry.matchedUniversitySlug ? (
          <Link
            href={getUniversityHref(entry.matchedUniversitySlug)}
            className="inline-flex items-center rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            Full guide
          </Link>
        ) : null}

        {entry.schoolWebsite ? (
          <a
            href={entry.schoolWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            Website
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
