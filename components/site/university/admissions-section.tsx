import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  GraduationCap,
  HelpCircle,
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
import { formatProgramDuration, formatProgramMedium } from "@/lib/utils";

import { RegulatoryAdvisoryPanel } from "@/components/site/regulatory-advisory-panel";

import { InfoCard, SectionLabel } from "./shared";

const MEDICAL_STREAMS = ["medicine", "nursing", "dental", "pharmacy", "physiotherapy"] as const;

function isMedical(primaryProgram: FinderProgram | undefined): boolean {
  return primaryProgram
    ? (MEDICAL_STREAMS as readonly string[]).includes(primaryProgram.course.stream)
    : true; // no primaryProgram -> keep existing (medical) default behavior, zero change
}

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

function FaqAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
      {items.map((item) => (
        <div key={item.question} className="p-5 sm:p-6">
          <p className="mb-2 flex items-start gap-2 text-sm font-semibold text-foreground">
            <HelpCircle className="mt-0.5 size-4 shrink-0 text-accent" />
            {item.question}
          </p>
          <p className="pl-6 text-sm leading-7 text-muted-foreground">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * "Admissions" — the application process: how to apply, deadlines, verification checks,
 * scholarships, and (for medical streams) the post-degree licensing pathway. Distinct from
 * UniversityEligibilitySection below — these used to render identically on both the
 * -admissions and -eligibility URLs, which was duplicate content across two indexed pages.
 */
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
  const isMedicalStream = isMedical(primaryProgram);

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
      `Admissions to ${primaryProgram.course.shortName} at ${university.name} follow the ${university.type.toLowerCase()} university process for international ${isMedicalStream ? "medical " : ""}applicants in ${primaryProgram.country.name}. We confirm the current cycle, seat availability, and document format as part of the admissions process.`
    : `We confirm current intake availability and document requirements directly with ${university.name}'s international office before presenting an offer to families.`;
  const countryName = primaryProgram?.country.name ?? "the study country";

  const defaultSteps = isMedicalStream
    ? [
        `We assess your NEET score, Class 12 PCB marks, budget, and preferences, then shortlist universities in ${countryName} that match your profile. Every university we present is WDOMS-listed, meets NMC guidelines, and confirmed open for foreign applicants in the current cycle.`,
        `We prepare your complete application document set in the format required — academic records, NEET scorecard, passport copy, photographs, and medical fitness certificate. We confirm any apostille, legalisation, or translation requirements before submission.`,
        `We submit your application through the university's official international admissions route and track the invitation or admission letter through to issue. We review the letter for accuracy before presenting it to you.`,
        `We guide you through the NMC Eligibility Certificate application at nmc.org.in after the admission letter is received. This is mandatory before departure; NMC issues it only for universities meeting current FMGL guidelines.`,
        `We prepare your ${countryName} student visa file and track the application through to grant. We confirm the exact document checklist for the relevant embassy before submission.`,
        `We brief you before departure on post-arrival registration, enrollment formalities, and your first week on campus. We remain your contact through the settling-in period for any administrative follow-up.`,
      ]
    : [
        `We assess your academic background, budget, and preferences, then shortlist universities in ${countryName} that match your profile. Every university we present is accredited and confirmed open for foreign applicants in the current cycle.`,
        `We prepare your complete application document set in the format required — academic transcripts, English proficiency scores (IELTS/TOEFL where required), passport copy, and photographs. We confirm any apostille, legalisation, or translation requirements before submission.`,
        `We submit your application through the university's official international admissions route and track the invitation or admission letter through to issue. We review the letter for accuracy before presenting it to you.`,
        `We confirm any destination-country recognition or registration steps required before departure, based on ${university.name}'s accreditation status.`,
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

      {/* ── Visa documents ───────────────────────────────────────────── */}
      <div id="visa-documents" className="scroll-mt-24 space-y-4">
        <SectionLabel>Visa Documents</SectionLabel>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
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

      {/* ── Licensing Pathway (medical streams only — no honest non-medical equivalent) ── */}
      {isMedicalStream && (
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
      )}
    </div>
  );
}

/**
 * "Eligibility" — do I qualify, distinct from the application-process content in
 * UniversityAdmissionsSection above. Includes a quick-facts strip, the eligibility criteria
 * and educational-document checklist, and a stream-aware FAQ so this page carries real,
 * standalone substance rather than being a thin duplicate of the admissions page.
 */
export function UniversityEligibilitySection({
  university,
  primaryProgram,
  countryContent,
}: {
  university: University;
  primaryProgram: FinderProgram | undefined;
  countryContent: CountryContent | null;
}) {
  const isMedicalStream = isMedical(primaryProgram);
  const universityAdmissions = university.admissionsContent;
  const course = primaryProgram?.course.shortName ?? "this program";
  const countryName = primaryProgram?.country.name ?? "the study country";

  const eligibilityIntro =
    universityAdmissions?.eligibility?.intro ??
    countryContent?.eligibility.intro ??
    (isMedicalStream
      ? `We confirm current PCB, NEET, age, passport, and university-specific academic requirements for ${university.name} before any application is submitted.`
      : `We confirm current academic, English-proficiency, age, passport, and university-specific requirements for ${university.name} before any application is submitted.`);

  const eligibilityItems =
    universityAdmissions?.eligibility?.items ??
    countryContent?.eligibility.items ??
    (isMedicalStream
      ? [
          "Check current PCB and NEET expectations for Indian applicants.",
          "Confirm minimum age and passport validity requirements.",
          "Review whether the current course structure aligns with your long-term licensing plan.",
        ]
      : [
          "Check current academic eligibility and English proficiency requirements for international applicants.",
          "Confirm minimum age and passport validity requirements.",
          "Review whether the current course structure aligns with your career or further-study plans.",
        ]);

  const educationalDocuments =
    universityAdmissions?.documentsRequired?.educational ??
    countryContent?.documentsRequired.educational ??
    (isMedicalStream
      ? [
          "Class 10 and 12 academic records",
          "NEET scorecard, if required for your pathway",
          "Passport and photographs",
        ]
      : [
          "Class 10 and 12 (or equivalent) academic records",
          "English proficiency scorecard (IELTS/TOEFL), if required for your pathway",
          "Passport and photographs",
        ]);

  const faqItems = isMedicalStream
    ? [
        {
          question: `What NEET score do I need for ${course} at ${university.name}?`,
          answer: `There is typically no fixed NEET cutoff for admission itself, since a qualifying NEET score is the mandatory national eligibility requirement under NMC guidelines rather than a university-set cutoff. We confirm the current cycle's exact requirement with ${university.name} before you apply.`,
        },
        {
          question: "Is there an entrance exam apart from NEET?",
          answer: `Most universities admit directly on NEET qualification plus academic record verification, without a separate university entrance exam. Some may require a basic document review or interview. We confirm the exact process at ${university.name} for the current intake.`,
        },
        {
          question: "What is the minimum age and academic percentage required?",
          answer: `Standard eligibility is 17 years by December 31 of the admission year and the qualifying PCB (Physics, Chemistry, Biology) percentage set by NMC guidelines. We verify the current-cycle figures and any university-specific variation before you apply.`,
        },
      ]
    : [
        {
          question: `What academic qualifications do I need for ${course} at ${university.name}?`,
          answer: `Requirements are set by ${university.name}'s current admissions policy and typically include your Class 10/12 (or equivalent) academic records meeting a minimum percentage. We confirm the exact current-cycle requirement before you apply.`,
        },
        {
          question: "Is an entrance exam required, or is it document-based admission?",
          answer: `This varies by university and program. Some admit on academic-record review alone; others require a subject-specific entrance test or interview. We confirm the exact process at ${university.name} for the current intake.`,
        },
        {
          question: "What English proficiency score do I need (IELTS/TOEFL)?",
          answer: `Requirements depend on the medium of instruction and ${university.name}'s current policy — some accept a qualifying Class 12 English score in place of a separate test. We confirm the exact current requirement before you apply.`,
        },
      ];

  return (
    <div className="deferred-render space-y-10 py-10">
      {/* ── Quick facts ──────────────────────────────────────────────── */}
      <div id="eligibility-snapshot" className="scroll-mt-24 space-y-4">
        <SectionLabel>Eligibility at a Glance</SectionLabel>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          <div className="flex flex-col gap-1 bg-card px-4 py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Program
            </p>
            <p className="text-sm font-bold text-foreground">{course}</p>
          </div>
          <div className="flex flex-col gap-1 bg-card px-4 py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Duration
            </p>
            <p className="text-sm font-bold text-foreground">
              {primaryProgram ? formatProgramDuration(primaryProgram.offering.durationYears) : "—"}
            </p>
          </div>
          <div className="flex flex-col gap-1 bg-card px-4 py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Medium
            </p>
            <p className="text-sm font-bold text-foreground">
              {primaryProgram
                ? formatProgramMedium(primaryProgram.offering.medium, primaryProgram.country.slug)
                : "—"}
            </p>
          </div>
          <div className="flex flex-col gap-1 bg-card px-4 py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              University type
            </p>
            <p className="text-sm font-bold text-foreground">{university.type}</p>
          </div>
        </div>
      </div>

      {/* ── Eligibility criteria ─────────────────────────────────────── */}
      <div id="eligibility" className="scroll-mt-24 space-y-4">
        <SectionLabel>Eligibility Criteria</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="mb-5 text-sm leading-7 text-muted-foreground">{eligibilityIntro}</p>
          <CheckList items={eligibilityItems} />
        </div>
      </div>

      {/* ── Who this fits ────────────────────────────────────────────── */}
      {university.bestFitFor.length > 0 && (
        <div id="who-this-fits" className="scroll-mt-24 space-y-4">
          <SectionLabel>Who This Program Fits</SectionLabel>
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <CheckList items={university.bestFitFor} />
          </div>
        </div>
      )}

      {/* ── Educational documents ────────────────────────────────────── */}
      <div id="educational-documents" className="scroll-mt-24 space-y-4">
        <SectionLabel>Educational Documents</SectionLabel>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            <ClipboardCheck className="size-3.5 text-accent" />
            Needed to verify eligibility
          </div>
          <CheckList items={educationalDocuments} />
        </div>
      </div>

      {/* ── Eligibility FAQ ──────────────────────────────────────────── */}
      <div id="eligibility-faq" className="scroll-mt-24 space-y-4">
        <SectionLabel>Eligibility Questions</SectionLabel>
        <FaqAccordion items={faqItems} />
      </div>
    </div>
  );
}
