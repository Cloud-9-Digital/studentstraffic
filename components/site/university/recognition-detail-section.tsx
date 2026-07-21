import { Info, ShieldCheck } from "lucide-react";

import type { Country, FinderProgram, University } from "@/lib/data/types";

import { SectionLabel } from "./shared";

export function UniversityRecognitionDetailSection({
  university,
  country,
  primaryProgram,
}: {
  university: University;
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
                  current official regulatory guidance
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
              Recognition status can change. Always verify current status on
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
              For an India-return medical pathway, the decision record includes:{" "}
              <strong className="font-semibold text-foreground">
                the foreign qualification rules → the programme&apos;s host-country status → its course and clinical structure → the applicable registration route
              </strong>
              . These checks are completed for the applicant&apos;s intended intake and professional destination.
            </p>
            <p>
              The named designations above describe the institution and programme evidence held for {university.name}.
              India-return eligibility is assessed for the individual admission route against the regulations in force
              for that intake; directory listing alone is not presented as approval or a practice licence.
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
              The named designations above describe the accreditation and recognition
              evidence held for {university.name}. Programme-specific professional
              outcomes are assessed as part of the applicant&apos;s admission plan.
            </p>
          </div>
        </div>
      )}

      {university.recognitionBadges.length === 0 &&
        university.recognitionLinks.length === 0 &&
        (
          <p className="rounded-2xl border border-border bg-muted/30 px-6 py-5 text-sm text-muted-foreground">
            Recognition details are not yet published for this university.
            Contact us for the latest information.
          </p>
        )}
    </div>
  );
}
