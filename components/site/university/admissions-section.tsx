import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { CareerPathways } from "@/components/site/career-pathways";

import type { CountryContent } from "@/lib/data/country-content";
import type {
  CountryRegulatoryAdvisory,
  UniversityRegulatoryAdvisory,
} from "@/lib/data/regulatory-advisories";
import type { FinderProgram, University, WdomsDirectoryEntry } from "@/lib/data/types";
import {
  getRussiaOfficialPageAudit,
  getRussiaOfficialPageAuditSummary,
} from "@/lib/data/russia-official-page-audit";

import { RegulatoryAdvisoryPanel } from "@/components/site/regulatory-advisory-panel";

import { InfoCard, SectionLabel } from "./shared";

function AdmissionSteps({ items }: { items: string[] }) {
  return (
    <ol className="space-y-0">
      {items.map((item, index) => (
        <li key={index} className="relative flex gap-4 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
              {index + 1}
            </span>
            {index < items.length - 1 && (
              <div className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <p className="pb-1 pt-0.5 text-sm leading-7 text-muted-foreground">{item}</p>
        </li>
      ))}
    </ol>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="text-sm leading-6 text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function UniversityAdmissionsSection({
  university,
  primaryProgram,
  countryContent,
  countryAdvisory,
  universityAdvisory,
  wdomsEntry,
}: {
  university: University;
  primaryProgram: FinderProgram | undefined;
  countryContent: CountryContent | null;
  countryAdvisory: CountryRegulatoryAdvisory | null;
  universityAdvisory: UniversityRegulatoryAdvisory | null;
  wdomsEntry: WdomsDirectoryEntry | null;
}) {
  const intakeMonths = primaryProgram?.offering.intakeMonths ?? [];
  const universityAdmissions = university.admissionsContent;
  const russiaOfficialAudit =
    university.countrySlug === "russia"
      ? getRussiaOfficialPageAudit(university.slug)
      : null;
  const russiaOfficialAuditSummary = russiaOfficialAudit
    ? getRussiaOfficialPageAuditSummary(russiaOfficialAudit)
    : null;
  const admissionsIntro = primaryProgram
    ? universityAdmissions?.overview ??
      `Admissions to ${primaryProgram.course.shortName} at ${university.name} follow the ${university.type.toLowerCase()} university process for international medical applicants in ${primaryProgram.country.name}. We confirm the current cycle, seat availability, and document format as part of the admissions process.`
    : `We confirm current intake availability and document requirements directly with ${university.name}'s international office before presenting an offer to families.`;
  const countryName = primaryProgram?.country.name ?? "the study country";

  const defaultSteps = [
    `We assess your NEET score, Class 12 PCB marks, budget, and preferences, then shortlist universities in ${countryName} that match your profile. Every university we present is WDOMS-listed, meets NMC guidelines, and confirmed open for foreign applicants in the current cycle.`,
    `We prepare your complete application document set in the format required — academic records, NEET scorecard, passport copy, photographs, and medical fitness certificate. We confirm any apostille, legalisation, or translation requirements before submission.`,
    `We submit your application through the university's official international admissions route and track the invitation or admission letter through to issue. We review the letter for accuracy before presenting it to you.`,
    `We guide you through the NMC Eligibility Certificate application at nmc.org.in after the admission letter is received. This is mandatory before departure; NMC issues it only for universities meeting current FMGL guidelines.`,
    `We prepare your ${countryName} student visa file and track the application through to grant. We confirm the exact document checklist for the relevant embassy before submission.`,
    `We brief you before departure on post-arrival registration, enrollment formalities, and your first week on campus. We remain your contact through the settling-in period for any administrative follow-up.`,
  ];

  return (
    <div className="deferred-render space-y-10 py-10">
      {countryAdvisory ? (
        <div id="regulatory-alert" className="scroll-mt-24">
          <RegulatoryAdvisoryPanel
            advisory={countryAdvisory}
            universityNote={universityAdvisory}
            titleLevel="h3"
          />
        </div>
      ) : null}

      {/* ── Admissions overview ──────────────────────────────────────── */}
      <div id="admissions" className="scroll-mt-24 space-y-4">
        <SectionLabel>Admissions</SectionLabel>
        <p className="text-base leading-8 text-muted-foreground">
          {admissionsIntro}
        </p>
        <AdmissionSteps
          items={
            universityAdmissions?.admissionSteps ??
            countryContent?.admissionSteps ??
            defaultSteps
          }
        />
        {russiaOfficialAuditSummary && (
          <InfoCard
            icon={<FileText className="size-4 text-accent" />}
            title={russiaOfficialAuditSummary.title}
            body={russiaOfficialAuditSummary.body}
          />
        )}
      </div>

      {/* ── Eligibility & Documents ──────────────────────────────────── */}
      <div id="eligibility" className="scroll-mt-24 space-y-4">
        <SectionLabel>Eligibility &amp; Documents</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          <div className="p-5 sm:p-6">
            <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Eligibility for Indian students
            </p>
            <p className="mb-5 text-sm leading-7 text-muted-foreground">
              {universityAdmissions?.eligibility?.intro ??
                countryContent?.eligibility.intro ??
                `We confirm current PCB, NEET, age, passport, and university-specific academic requirements for ${university.name} before any application is submitted.`}
            </p>
            <CheckList
              items={
                universityAdmissions?.eligibility?.items ??
                countryContent?.eligibility.items ?? [
                  "Check current PCB and NEET expectations for Indian applicants.",
                  "Confirm minimum age and passport validity requirements.",
                  "Review whether the current course structure aligns with your long-term licensing plan.",
                ]
              }
            />
          </div>
          <div className="p-5 sm:p-6">
            <p className="mb-5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Documents required
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                  Educational
                </p>
                <CheckList
                  items={
                    universityAdmissions?.documentsRequired?.educational ??
                    countryContent?.documentsRequired.educational ?? [
                      "Class 10 and 12 academic records",
                      "NEET scorecard, if required for your pathway",
                      "Passport and photographs",
                    ]
                  }
                />
              </div>
              <div>
                <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                  Visa
                </p>
                <CheckList
                  items={
                    universityAdmissions?.documentsRequired?.visa ??
                    countryContent?.documentsRequired.visa ?? [
                      "University offer or invitation letter",
                      "Visa application documents",
                      "Medical and financial proof as required by the destination",
                    ]
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Deadlines & Intake ───────────────────────────────────────── */}
      <div id="deadlines" className="scroll-mt-24 space-y-4">
        <SectionLabel>Deadlines &amp; Intake</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          <div className="flex gap-4 p-5 sm:p-6">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-accent" />
            <div className="flex-1">
              <p className="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Intake
              </p>
              <p className="text-sm font-semibold text-foreground">
                {intakeMonths.length > 0
                  ? intakeMonths.join(" · ")
                  : "Not currently listed for this page"}
              </p>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <p className="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              When to start
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {intakeMonths.length > 0
                ? `Start document preparation and application planning at least 3–6 months before the ${intakeMonths[0]} intake.`
                : "Start document preparation and application planning early in the cycle and confirm exact timelines with the university."}
            </p>
          </div>
          <div className="p-5 sm:p-6">
            <p className="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Admissions notes
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {universityAdmissions?.deadlinesNote ??
                "Seat availability, invitation timelines, fee notices, hostel options, and visa processing should be rechecked for the current cycle."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Admissions Checks ────────────────────────────────────────── */}
      {countryContent?.verificationChecklist?.length ? (
        <div id="admissions-checks" className="scroll-mt-24 space-y-4">
          <SectionLabel>Admissions Checks</SectionLabel>
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <CheckList items={countryContent.verificationChecklist} />
          </div>
        </div>
      ) : null}

      {/* ── Scholarships ─────────────────────────────────────────────── */}
      <div id="scholarships" className="scroll-mt-24 space-y-4">
        <SectionLabel>Scholarships</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          <div className="p-5 sm:p-6">
            <p className="text-sm leading-7 text-muted-foreground">
              {universityAdmissions?.scholarshipInfo ??
                countryContent?.scholarshipInfo ??
                `Scholarship availability at ${university.name} should be confirmed directly with the university's international admissions or finance office.`}
            </p>
          </div>
          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
            <div className="flex gap-3">
              <CircleDollarSign className="mt-0.5 size-4 shrink-0 text-accent" />
              <div>
                <p className="mb-1 text-sm font-semibold text-foreground">How we assess</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  We confirm whether any fee waiver is merit-based, automatic, limited-seat, renewal-dependent, or deferred to later years before presenting it as part of a cost plan.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <FileText className="mt-0.5 size-4 shrink-0 text-accent" />
              <div>
                <p className="mb-1 text-sm font-semibold text-foreground">What we obtain in writing</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Written scholarship terms, net payable tuition after any waiver, and whether hostel or ancillary charges are excluded are confirmed before families make a financial decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Licensing Pathway ────────────────────────────────────────── */}
      <div id="licensing" className="scroll-mt-24 space-y-4">
        <SectionLabel>Licensing Pathway</SectionLabel>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold text-heading">
            Where can you practice after this degree?
          </h3>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            A WDOMS-listed MBBS opens six career pathways. India return via FMGE/NExT
            is the most common, but the same degree qualifies you to sit licensing
            exams for the USA, UK, Australia, Canada, and New Zealand — or stay for
            PG in {primaryProgram?.country.name ?? "your study country"}.
          </p>
          <div className="mt-6">
            <CareerPathways studyCountry={primaryProgram?.country.name} />
          </div>
        </div>
        <InfoCard
          icon={<GraduationCap className="size-4 text-accent" />}
          title="Exam support"
          body={
            primaryProgram?.offering.licenseExamSupport.length
              ? primaryProgram.offering.licenseExamSupport.join(", ")
              : "Published exam support is not currently listed for this page."
          }
        />
        <InfoCard
          icon={<ShieldCheck className="size-4 text-accent" />}
          title="Recognition cross-check"
          body={
            wdomsEntry
              ? "This university has a mapped WDOMS record on the page, which gives you one more recognition checkpoint."
              : "Recognition status is cross-checked against official sources before this university is recommended to any family."
          }
        />
      </div>
    </div>
  );
}
