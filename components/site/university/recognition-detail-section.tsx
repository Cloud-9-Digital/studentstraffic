import { ExternalLink, Info, ShieldCheck } from "lucide-react";

import type { Country, FinderProgram, University, WdomsDirectoryEntry } from "@/lib/data/types";

import { SectionLabel } from "./shared";

export function UniversityRecognitionDetailSection({
  university,
  wdomsEntry,
  country,
  primaryProgram,
}: {
  university: University;
  wdomsEntry: WdomsDirectoryEntry | null;
  country?: Country;
  primaryProgram?: FinderProgram;
}) {
  const MEDICAL_STREAMS = ["medicine", "nursing", "dental", "pharmacy", "physiotherapy"] as const;
  const isMedicalStream = primaryProgram
    ? (MEDICAL_STREAMS as readonly string[]).includes(primaryProgram.course.stream)
    : true; // no primaryProgram -> keep existing (medical) default behavior, zero change

  const course = primaryProgram?.course.shortName ?? "this program";
  const countryName = country?.name ?? "the study country";

  return (
    <div className="space-y-6 py-10">
      <SectionLabel>Recognition &amp; accreditation</SectionLabel>

      {/* Explanatory intro — why recognition matters */}
      <div className="space-y-3">
        <h2 className="font-display text-2xl font-semibold text-heading">
          Is {university.name} recognised for Indian students?
        </h2>
        <div className="space-y-4 text-base leading-8 text-muted-foreground">
          {isMedicalStream ? (
            <>
              <p>
                Recognition is the single most important check for any Indian student
                considering {course} abroad. A degree from an unrecognised university
                cannot be used to sit FMGE or NExT — the mandatory licensing exams for
                practising medicine in India after an overseas {course}. It also affects
                your ability to pursue postgraduate programmes, licensing in third
                countries (USA, UK, Canada, Australia), and visa credibility.
              </p>
              <p>
                There are three bodies Indian students must verify: the{" "}
                <strong className="font-semibold text-foreground">
                  National Medical Commission (NMC)
                </strong>{" "}
                which sets India-return requirements, the{" "}
                <strong className="font-semibold text-foreground">
                  World Directory of Medical Schools (WDOMS)
                </strong>{" "}
                which is the internationally recognised database used by licensing
                bodies worldwide, and{" "}
                <strong className="font-semibold text-foreground">
                  country-specific accreditation bodies in {countryName}
                </strong>{" "}
                which governs the degree&apos;s validity in the country of study.
                Students Traffic cross-checks all three before shortlisting any
                university.
              </p>
            </>
          ) : (
            <>
              <p>
                Recognition is the key check for any international student
                considering {course} abroad. A degree from an unaccredited
                institution may not be recognised by employers, government bodies,
                or for further study in your home country. It affects your ability
                to pursue postgraduate study, professional registration where
                applicable, and visa credibility.
              </p>
              <p>
                There are two things international students should verify: the{" "}
                <strong className="font-semibold text-foreground">
                  {countryName}-specific accreditation body
                </strong>{" "}
                that governs the degree&apos;s validity in the country of study, and
                any{" "}
                <strong className="font-semibold text-foreground">
                  professional or industry body relevant to your field
                </strong>
                . Students Traffic cross-checks both before shortlisting any
                university.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 px-5 py-4">
        <p className="flex items-start gap-2.5 text-sm leading-6 text-blue-800">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-600" />
          {isMedicalStream ? (
            <>
              Recognition status can change. NMC updates its approved list and WDOMS
              listings are updated by universities. Always verify current status on
              official sources before paying any fees. Students Traffic confirms
              current recognition before any application is submitted.
            </>
          ) : (
            <>
              Accreditation status can change over time. Always verify current
              status on official sources before paying any fees. Students Traffic
              confirms current recognition before any application is submitted.
            </>
          )}
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
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              WDOMS listing is mandatory for NMC FMGE/NExT eligibility and for
              licensing exams in the USA (USMLE), UK (PLAB), Canada (MCCQE), and
              Australia (AMC). A confirmed WDOMS entry means this degree is
              recognised at the international level.
            </p>
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

      {/* What recognition means for India-return (medical) / for you (other streams) */}
      {isMedicalStream ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <p className="font-display text-base font-semibold text-heading">
              What this means for your India-return pathway
            </p>
          </div>
          <div className="space-y-4 px-6 py-5 text-sm leading-7 text-muted-foreground">
            <p>
              For Indian students, the recognition chain that matters is:{" "}
              <strong className="font-semibold text-foreground">
                NMC FMGE/NExT eligibility → WDOMS listing → country accreditation
              </strong>
              . All three must be satisfied for a degree from an overseas university
              to support India-return medical practice.
            </p>
            <p>
              If {university.name} is NMC-approved and WDOMS-listed, graduates who
              pass FMGE (or NExT after 2024 implementation) can register with the
              State Medical Council in India and practise as licensed doctors. If any
              link in the chain is broken — NMC delisting, WDOMS removal — that
              eligibility is at risk. Students Traffic monitors these lists and
              alerts enrolled students to any changes that could affect their pathway.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <p className="font-display text-base font-semibold text-heading">
              What this means for you
            </p>
          </div>
          <div className="px-6 py-5 text-sm leading-7 text-muted-foreground">
            <p>
              Confirm accreditation status directly with {university.name} and with
              the relevant professional body in your home country before relying on
              this degree for licensing, employment, or further study.
            </p>
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
