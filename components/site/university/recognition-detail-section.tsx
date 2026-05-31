import { ExternalLink, Info, ShieldCheck } from "lucide-react";

import type { University, WdomsDirectoryEntry } from "@/lib/data/types";

import { SectionLabel } from "./shared";

export function UniversityRecognitionDetailSection({
  university,
  wdomsEntry,
}: {
  university: University;
  wdomsEntry: WdomsDirectoryEntry | null;
}) {
  return (
    <div className="space-y-6 py-10">
      <SectionLabel>Recognition &amp; accreditation</SectionLabel>

      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 px-5 py-4">
        <p className="flex items-start gap-2.5 text-sm leading-6 text-blue-800">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-600" />
          Recognition determines whether your degree is valid for medical
          licensing in India (NMC) and internationally. We verify current
          recognition status against official sources before shortlisting any university.
        </p>
      </div>

      {university.recognitionBadges.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <p className="font-display text-base font-semibold text-heading">
              Accreditations &amp; listings
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Bodies that have formally recognised or listed {university.name}
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex flex-wrap gap-2.5">
              {university.recognitionBadges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-foreground"
                >
                  <ShieldCheck className="size-3.5 text-primary/70" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {university.recognitionLinks.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <p className="font-display text-base font-semibold text-heading">
              Official recognition sources
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Verify recognition directly from the issuing authority
            </p>
          </div>
          <div className="divide-y divide-border/50">
            {university.recognitionLinks.map((link) => (
              <div
                key={link.url}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-4 shrink-0 text-primary/60" />
                  <span className="text-sm font-medium text-foreground">
                    {link.label}
                  </span>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  Verify
                  <ExternalLink className="size-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {wdomsEntry && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <p className="font-display text-base font-semibold text-heading">
                World Directory of Medical Schools (WDOMS)
              </p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {wdomsEntry.schoolName !== university.name && (
                <WdomsRow label="Listed as" value={wdomsEntry.schoolName} />
              )}
              {wdomsEntry.cityName && (
                <WdomsRow label="City" value={wdomsEntry.cityName} />
              )}
              {wdomsEntry.schoolType && (
                <WdomsRow label="School type" value={wdomsEntry.schoolType} />
              )}
              {wdomsEntry.operationalStatus && (
                <WdomsRow
                  label="Status"
                  value={wdomsEntry.operationalStatus}
                />
              )}
              {wdomsEntry.yearInstructionStarted && (
                <WdomsRow
                  label="Instruction started"
                  value={String(wdomsEntry.yearInstructionStarted)}
                />
              )}
              {wdomsEntry.languageOfInstruction && (
                <WdomsRow
                  label="Language of instruction"
                  value={wdomsEntry.languageOfInstruction}
                />
              )}
              {wdomsEntry.curriculumDuration && (
                <WdomsRow
                  label="Curriculum duration"
                  value={wdomsEntry.curriculumDuration}
                />
              )}
              {wdomsEntry.qualificationTitle && (
                <WdomsRow
                  label="Qualification"
                  value={wdomsEntry.qualificationTitle}
                />
              )}
              {wdomsEntry.foreignStudents && (
                <WdomsRow
                  label="Foreign students"
                  value={wdomsEntry.foreignStudents}
                />
              )}
              {wdomsEntry.entranceExam && (
                <WdomsRow
                  label="Entrance exam"
                  value={wdomsEntry.entranceExam}
                />
              )}
              {wdomsEntry.academicAffiliation && (
                <WdomsRow
                  label="Academic affiliation"
                  value={wdomsEntry.academicAffiliation}
                />
              )}
            </div>
            {wdomsEntry.clinicalFacilities && (
              <div className="mt-4 rounded-xl bg-muted/30 px-4 py-3">
                <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Clinical facilities
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {wdomsEntry.clinicalFacilities}
                </p>
              </div>
            )}
            {wdomsEntry.clinicalTraining && (
              <div className="mt-3 rounded-xl bg-muted/30 px-4 py-3">
                <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Clinical training
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {wdomsEntry.clinicalTraining}
                </p>
              </div>
            )}
            {wdomsEntry.schoolUrl && (
              <div className="mt-4">
                <a
                  href={wdomsEntry.schoolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  View WDOMS listing
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {university.recognitionBadges.length === 0 &&
        university.recognitionLinks.length === 0 &&
        !wdomsEntry && (
          <p className="rounded-2xl border border-border bg-muted/30 px-6 py-5 text-sm text-muted-foreground">
            Recognition details are not yet published for this university.
            Contact us for the latest information.
          </p>
        )}
    </div>
  );
}

function WdomsRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
