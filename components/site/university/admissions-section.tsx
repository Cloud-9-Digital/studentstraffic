import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

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

function NumberedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item} className="flex gap-4">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {index + 1}
          </span>
          <p className="text-sm leading-7 text-muted-foreground">{item}</p>
        </div>
      ))}
    </div>
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
      `Admissions to ${primaryProgram.course.shortName} at ${university.name} usually follow the ${university.type.toLowerCase()} university process used for international medical applicants in ${primaryProgram.country.name}. Always confirm the current cycle, seat availability, and document format directly with the university before applying.`
    : `Admissions to ${university.name} should be confirmed directly with the university's international office for the current academic cycle.`;

  const defaultSteps = primaryProgram
    ? [
        `Review the ${primaryProgram.course.shortName} structure, fee format, and intake timeline for ${university.name}.`,
        `Check that your Class 12 and NEET profile align with the current eligibility rules for Indian students.`,
        `Prepare academic, passport, and visa documents in the format requested by the university.`,
        `Submit the application and wait for the official offer or invitation letter before making payments or travel plans.`,
      ]
    : [
        `Confirm the current intake cycle and admissions route with ${university.name}.`,
        "Prepare your academic and passport documents.",
        "Submit the application through the official process.",
        "Wait for the official admission confirmation before proceeding.",
      ];

  const deadlineCards = [
    {
      title: "Intake months",
      body:
        intakeMonths.length > 0
          ? intakeMonths.join(", ")
          : "The published intake month is not currently listed for this page.",
    },
    {
      title: "When to start",
      body:
        intakeMonths.length > 0
          ? `Start document preparation and application planning at least 3–6 months before the ${intakeMonths[0]} intake.`
          : "Start document preparation and application planning early in the cycle and confirm exact timelines with the university.",
    },
    {
      title: "What to verify",
      body:
        universityAdmissions?.deadlinesNote ??
        "Seat availability, invitation timelines, fee notices, hostel options, and visa processing should be rechecked for the current cycle.",
    },
  ];

  const licensingItems = [
    wdomsEntry
      ? `${university.name} has a mapped WDOMS entry, which helps students cross-check the institution in an official medical directory.`
      : `Check whether ${university.name} appears in WDOMS and current recognition databases before relying on third-party claims.`,
    primaryProgram?.offering.medium
      ? `The published teaching medium for the featured program is ${primaryProgram.offering.medium}. Students planning to practise in India should verify that the current course structure continues to align with NMC expectations.`
      : "Verify the current teaching medium and program structure directly with the university.",
    primaryProgram?.offering.licenseExamSupport.length
      ? `Published support includes: ${primaryProgram.offering.licenseExamSupport.join("; ")}.`
      : "Ask the university what support exists for FMGE, NExT, local licensing, or internship transition planning.",
    "Before enrolment, confirm current recognition status, internship structure, medium of instruction, and eligibility to pursue licensing pathways after graduation.",
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
        <div className="section-tint rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold text-heading">
            How admissions usually work
          </h3>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            {admissionsIntro}
          </p>
          <div className="mt-6">
            <NumberedList
              items={
                universityAdmissions?.admissionSteps ??
                countryContent?.admissionSteps ??
                defaultSteps
              }
            />
          </div>
        </div>
        <InfoCard
          icon={<FileText className="size-4 text-accent" />}
          title={russiaOfficialAuditSummary?.title ?? "Official admissions route"}
          body={
            russiaOfficialAuditSummary?.body ??
            "Use the university's own admissions or program page to confirm the current foreign-applicant route before you apply."
          }
          linkHref={
            russiaOfficialAudit?.classification === "ok"
              ? (russiaOfficialAudit.finalUrl ??
                russiaOfficialAudit.officialProgramUrl ??
                primaryProgram?.offering.officialProgramUrl)
              : (university.officialWebsite ??
                russiaOfficialAudit?.officialProgramUrl ??
                primaryProgram?.offering.officialProgramUrl)
          }
          linkLabel={
            russiaOfficialAudit?.classification === "ok"
              ? "Open mapped admissions page"
              : "Open university website"
          }
        />
        <InfoCard
          icon={<BookOpen className="size-4 text-accent" />}
          title="Primary program"
          body={
            primaryProgram
              ? `${primaryProgram.offering.title} with ${primaryProgram.offering.medium} delivery and ${intakeMonths.join(", ") || "current-cycle"} intake guidance.`
              : "Program-specific admissions details should be confirmed directly with the university."
          }
        />
        <InfoCard
          icon={<ShieldCheck className="size-4 text-accent" />}
          title="Current-cycle check"
          body={
            russiaOfficialAudit?.classification && russiaOfficialAudit.classification !== "ok"
              ? "This page includes planning guidance, but the mapped admissions link needs re-verification. Confirm the active foreign-applicant route directly on the university's main site before applying."
              : "Admission cycles, seat availability, and invitation timelines can shift. Use this page for planning, then verify the active cycle before applying."
          }
        />
      </div>

      {/* ── Eligibility & Documents ──────────────────────────────────── */}
      <div id="eligibility" className="scroll-mt-24 space-y-4">
        <SectionLabel>Eligibility &amp; Documents</SectionLabel>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold text-heading">
            Eligibility for Indian students
          </h3>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            {universityAdmissions?.eligibility?.intro ??
              countryContent?.eligibility.intro ??
              `Students considering ${university.name} should verify current PCB, NEET, age, passport, and university-specific academic requirements before applying.`}
          </p>
          <div className="mt-6">
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
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold text-heading">
            Documents required
          </h3>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Educational documents
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
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Visa documents
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

      {/* ── Deadlines & Intake ───────────────────────────────────────── */}
      <div id="deadlines" className="scroll-mt-24 space-y-4">
        <SectionLabel>Deadlines &amp; Intake</SectionLabel>
        {deadlineCards.map((card) => (
          <InfoCard
            key={card.title}
            icon={<CalendarDays className="size-4 text-accent" />}
            title={card.title}
            body={card.body}
          />
        ))}
      </div>

      {countryContent?.verificationChecklist?.length ? (
        <div id="admissions-checks" className="scroll-mt-24 space-y-4">
          <SectionLabel>Admissions Checks</SectionLabel>
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h3 className="font-display text-xl font-semibold text-heading">
              What to verify before you pay
            </h3>
            <div className="mt-5">
              <CheckList items={countryContent.verificationChecklist} />
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Scholarships ─────────────────────────────────────────────── */}
      <div id="scholarships" className="scroll-mt-24 space-y-4">
        <SectionLabel>Scholarships</SectionLabel>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold text-heading">
            Scholarships &amp; financial support
          </h3>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            {universityAdmissions?.scholarshipInfo ??
              countryContent?.scholarshipInfo ??
              `Scholarship availability at ${university.name} should be confirmed directly with the university's international admissions or finance office.`}
          </p>
        </div>
        <InfoCard
          icon={<CircleDollarSign className="size-4 text-accent" />}
          title="What to ask"
          body="Ask whether fee waivers are merit-based, automatic, limited-seat, renewal-based, or only available in later years."
        />
        <InfoCard
          icon={<FileText className="size-4 text-accent" />}
          title="Before you rely on a scholarship"
          body="Request the written scholarship terms, the net payable tuition, and whether hostel or other charges are excluded."
        />
      </div>

      {/* ── Licensing Pathway ────────────────────────────────────────── */}
      <div id="licensing" className="scroll-mt-24 space-y-4">
        <SectionLabel>Licensing Pathway</SectionLabel>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold text-heading">
            Planning the licensing pathway after MBBS
          </h3>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            For MBBS abroad, the key decision is not campus placement. It is whether
            the university, course structure, teaching medium, clinical exposure,
            and post-study pathway remain aligned with the licensing route you want
            to pursue after graduation.
          </p>
          <div className="mt-6">
            <CheckList
              items={
                universityAdmissions?.licensingPathway?.length
                  ? universityAdmissions.licensingPathway
                  : countryContent?.careerOpportunities.length
                    ? countryContent.careerOpportunities
                    : licensingItems
              }
            />
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
              : "Use official recognition sources and the university itself to cross-check the institution before committing."
          }
        />
      </div>
    </div>
  );
}
