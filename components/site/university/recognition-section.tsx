import { ShieldCheck } from "lucide-react";

import type { University, WdomsDirectoryEntry } from "@/lib/data/types";

import { SectionLabel } from "./shared";

export function UniversityRecognitionSection({
  university,
  wdomsEntry,
}: {
  university: University;
  wdomsEntry: WdomsDirectoryEntry | null;
}) {
  return (
    <div
      id="recognition"
      className="deferred-render scroll-mt-24 space-y-6 py-10"
    >
      <SectionLabel>Recognition</SectionLabel>

      <div className="space-y-4">
        {university.recognitionBadges.length > 0 && (
          <div className="rounded-2xl bg-muted/35 p-5">
            <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Accreditations &amp; listings
            </p>
            <div className="flex flex-wrap gap-2">
              {university.recognitionBadges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-sm font-medium text-foreground"
                >
                  <ShieldCheck className="size-3.5 text-primary/60" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {wdomsEntry ? (
          <div className="flex gap-4 rounded-2xl bg-muted/35 p-5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                WDOMS listing
              </p>
              <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                {wdomsEntry.schoolName !== university.name
                  ? `${university.name} appears in the World Directory of Medical Schools as ${wdomsEntry.schoolName}.`
                  : `${university.name} appears in the World Directory of Medical Schools.`}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
