import Link from "next/link";
import { ExternalLink, FileSearch, Sparkles } from "lucide-react";

import type { WdomsDirectoryEntry } from "@/lib/data/types";
import { getUniversityHref, getWdomsSchoolHref } from "@/lib/routes";

type WdomsDirectorySectionProps = {
  entries: WdomsDirectoryEntry[];
  countryName: string;
  title?: string;
  intro?: string;
};

export function WdomsDirectorySection({
  entries,
  countryName,
  title = `Medical schools in ${countryName} listed on WDOMS`,
  intro = `This directory is sourced from the World Directory of Medical Schools. We use it to show the broader market, while detailed Students Traffic university pages are reserved for schools where we have stronger admissions, fee, and student-planning context.`,
}: WdomsDirectorySectionProps) {
  if (!entries.length) {
    return null;
  }

  return (
    <section
      id="wdoms-directory"
      className="deferred-render border-b border-border py-14 md:py-20"
    >
      <div className="container-shell">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <FileSearch className="size-3.5" />
            WDOMS directory
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
            {title}
          </h2>
          <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
            {intro}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm leading-7 text-amber-950">
            <span className="font-semibold">Important:</span> a WDOMS listing
            shows that a school appears in the directory. It does not, by
            itself, confirm current Indian admissions, NMC pathway fit, fee
            transparency, hostel quality, or whether a school deserves its own
            detailed guide on this site.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center rounded-full bg-primary/8 px-3 py-1.5 font-semibold text-primary">
            {entries.length} schools listed
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
            <Sparkles className="size-3.5" />
            Detailed Students Traffic guides appear where available
          </span>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-border/70">
          <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(120px,0.6fr)_minmax(180px,0.9fr)] gap-4 border-b border-border/60 bg-[#f7f5f0] px-5 py-3">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Medical school
            </span>
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              City
            </span>
            <span className="text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Links
            </span>
          </div>

          <div className="divide-y divide-border/60 bg-card">
            {entries.map((entry) => (
              <div
                key={entry.schoolId}
                className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[minmax(0,1.5fr)_minmax(120px,0.6fr)_minmax(180px,0.9fr)] md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-6 text-foreground md:text-[0.98rem]">
                    <Link
                      href={getWdomsSchoolHref(entry.countrySlug, entry.routeSlug)}
                      className="transition-colors hover:text-primary"
                    >
                      {entry.schoolName}
                    </Link>
                  </p>
                  {entry.qualificationTitle ? (
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {entry.qualificationTitle}
                    </p>
                  ) : null}
                </div>

                <div className="text-sm text-muted-foreground">{entry.cityName}</div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <Link
                    href={getWdomsSchoolHref(entry.countrySlug, entry.routeSlug)}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                  >
                    Research profile
                  </Link>

                  {entry.matchedUniversitySlug ? (
                    <Link
                      href={getUniversityHref(entry.matchedUniversitySlug)}
                      className="inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                      Guide
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

                  <a
                    href={entry.schoolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    WDOMS
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
