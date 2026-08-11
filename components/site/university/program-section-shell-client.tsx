"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, MapPin, Phone } from "lucide-react";

import type { Author } from "@/lib/authors";
import { getUniversityHref, getUniversityProgramHref } from "@/lib/routes";
import {
  PROGRAM_SECTIONS,
  type ProgramSection,
} from "@/lib/university-sections";

import { UniversityHeroSection } from "./hero-section";
import { ProgramPageNav } from "./program-nav";

const SECTION_TITLES: Record<ProgramSection, string> = {
  admissions: "Admissions Process",
  eligibility: "Eligibility & Requirements",
  fees: "Fee Structure",
  recognition: "Recognition & Accreditation",
};

type Props = {
  initialSection: ProgramSection | null;
  programSlug: string;
  courseShortName: string;
  courseSlug: string;
  universityName: string;
  universitySlug: string;
  universityCity: string;
  universityType: "Public" | "Private";
  countryName: string;
  countrySlug: string;
  hasFee: boolean;
  feeValue: string;
  coverImage: { url: string; alt: string } | null;
  logoUrl?: string;
  logoInitials: string;
  lastVerifiedAt: string;
  author?: Author | null;
  content: ReactNode;
};

function getSectionSummary(section: ProgramSection | null, props: Props) {
  switch (section) {
    case "admissions":
      return `How to apply for ${props.courseShortName} at ${props.universityName} — step-by-step process, documents required, and application timeline.`;
    case "eligibility":
      return `Eligibility criteria and academic qualifications needed to apply for ${props.courseShortName} at ${props.universityName}.`;
    case "fees":
      return `Year-wise ${props.courseShortName} fee breakdown at ${props.universityName} — annual tuition, hostel costs, and total program cost in USD.`;
    case "recognition":
      return `Recognition and accreditation status of ${props.courseShortName} at ${props.universityName} — badges and official verification links.`;
    default:
      return `Academic structure, teaching phases, and curriculum for ${props.courseShortName} at ${props.universityName}.`;
  }
}

export function ProgramSectionShellClient(props: Props) {
  const activeSection = props.initialSection;

  return (
    <>
      <UniversityHeroSection
        universityName={`${props.courseShortName} at ${props.universityName}`}
        universitySlug={props.universitySlug}
        universitySummary={getSectionSummary(activeSection, props)}
        logoUrl={props.logoUrl}
        coverImage={props.coverImage}
        logoInitials={props.logoInitials}
        activeSectionLabel={activeSection ? SECTION_TITLES[activeSection] : null}
        lastVerifiedAt={props.lastVerifiedAt}
        author={props.author}
      />
      <ProgramPageNav
        programSlug={props.programSlug}
        activeSection={activeSection}
      />
      <section className="py-10 md:py-14">
        <div className="container-shell">
          <div className="min-w-0 space-y-0">
            <ProgramContextStrip {...props} activeSection={activeSection} />
            {props.content}
            <ProgramCounsellingCta {...props} />
          </div>
        </div>
      </section>
    </>
  );
}

function ProgramContextStrip(props: Props & { activeSection: ProgramSection | null }) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 text-sm">
        <Link href={getUniversityHref(props.universitySlug)} className="font-display font-semibold text-heading hover:text-primary hover:underline">{props.universityName}</Link>
        <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="size-3.5 shrink-0" />{props.universityCity}, {props.countryName}</span>
        <span className="flex items-center gap-1.5 text-muted-foreground"><GraduationCap className="size-3.5 shrink-0" />{props.courseShortName} · {props.universityType}</span>
        {props.hasFee ? <span className="font-medium text-accent">{props.feeValue}/yr</span> : null}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border/60 bg-background/50 px-5 py-2.5">
        <Link href={getUniversityProgramHref(props.programSlug)} className="text-xs text-muted-foreground hover:text-primary hover:underline">Academics</Link>
        {PROGRAM_SECTIONS.filter((section) => section !== props.activeSection).map((section) => (
          <Link key={section} href={`/${props.programSlug}-${section}`} className="text-xs capitalize text-muted-foreground hover:text-primary hover:underline">{section}</Link>
        ))}
      </div>
    </div>
  );
}

function ProgramCounsellingCta(props: Pick<Props, "universityName" | "courseSlug" | "countrySlug">) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-6 py-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <p className="font-display text-lg font-semibold text-heading">Applying to {props.universityName}?</p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Students Traffic verifies seat availability, checks current recognition status, and prepares your complete application for {props.universityName}. The consultation is free.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a href="tel:+919176162888" className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"><Phone className="size-3.5" />Call us</a>
          <Link href={`/universities?country=${props.countrySlug}&course=${props.courseSlug}`} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">Compare colleges<ArrowRight className="size-3.5" /></Link>
        </div>
      </div>
    </div>
  );
}
