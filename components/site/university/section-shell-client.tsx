"use client";

import { type ReactNode, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, MapPin, Phone, ShieldCheck } from "lucide-react";

import type { Author } from "@/lib/authors";
import { recordRecentlyViewed } from "@/lib/recently-viewed";
import { getUniversityHref } from "@/lib/routes";
import {
  UNIVERSITY_SECTIONS,
  type UniversitySection,
} from "@/lib/university-sections";

import { UniversityHeroSection } from "./hero-section";
import { UniversityPageNav } from "./sticky-nav";

const SECTION_TITLES: Record<UniversitySection, string> = {
  programs: "Programs & Courses",
  "student-life": "Student Life",
  hostel: "Hostel & Accommodation",
  faq: "FAQ",
};

type Props = {
  initialSection: UniversitySection | null;
  universitySlug: string;
  universityName: string;
  universitySummary: string;
  universityCity: string;
  universityType: "Public" | "Private";
  countryName: string;
  countrySlug: string;
  coverImage: { url: string; alt: string } | null;
  logoUrl?: string;
  logoInitials: string;
  primaryProgramShortName?: string;
  courseSlug?: string;
  feeValue: string;
  hasFee: boolean;
  recognitionBadge?: string;
  lastVerifiedAt: string;
  author?: Author | null;
  content: ReactNode;
};

function getSectionSummary(section: UniversitySection | null, props: Props) {
  const course = props.primaryProgramShortName ?? "this program";
  switch (section) {
    case "programs":
      return `All programs at ${props.universityName} — course duration, medium of instruction, annual intake, and official program details.`;
    case "student-life":
      return `Campus life, Indian student community, food options, and day-to-day living at ${props.universityName} in ${props.universityCity}.`;
    case "hostel":
      return `Hostel facilities, Indian food availability, campus safety, and accommodation options at ${props.universityName}.`;
    case "faq":
      return `Answers to the most common questions Indian students ask about ${course} at ${props.universityName}.`;
    default:
      return props.universitySummary;
  }
}

export function UniversitySectionShellClient(props: Props) {
  const activeSection = props.initialSection;

  useEffect(() => {
    recordRecentlyViewed({
      slug: props.universitySlug,
      name: props.universityName,
      logoUrl: props.logoUrl,
      city: props.universityCity,
      countryName: props.countryName,
    });
  }, [props.universitySlug, props.universityName, props.logoUrl, props.universityCity, props.countryName]);

  return (
    <>
      <UniversityHeroSection
        universityName={props.universityName}
        universitySlug={props.universitySlug}
        universitySummary={getSectionSummary(activeSection, props)}
        logoUrl={props.logoUrl}
        coverImage={props.coverImage}
        logoInitials={props.logoInitials}
        activeSectionLabel={activeSection ? SECTION_TITLES[activeSection] : null}
        lastVerifiedAt={props.lastVerifiedAt}
        author={props.author}
        countrySlug={props.countrySlug}
        courseSlug={props.courseSlug}
      />

      <UniversityPageNav
        universitySlug={props.universitySlug}
        activeSection={activeSection}
      />

      <section className="py-10 md:py-14">
        <div className="container-shell">
          {activeSection ? (
            <div className="min-w-0 space-y-0">
              <UniversityContextStrip {...props} activeSection={activeSection} />
              {props.content}
              <SectionCounsellingCta {...props} />
            </div>
          ) : props.content}
        </div>
      </section>
    </>
  );
}

function UniversityContextStrip(props: Props & { activeSection: UniversitySection }) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 text-sm">
        <span className="font-display font-semibold text-heading">{props.universityName}</span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {props.universityCity}, {props.countryName}
        </span>
        {props.primaryProgramShortName ? (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <GraduationCap className="size-3.5 shrink-0" />
            {props.primaryProgramShortName} · {props.universityType}
          </span>
        ) : null}
        {props.hasFee ? <span className="font-medium text-accent">{props.feeValue}/yr</span> : null}
        {props.recognitionBadge ? (
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <ShieldCheck className="size-3.5 shrink-0" />
            {props.recognitionBadge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border/60 bg-background/50 px-5 py-2.5">
        <Link href={getUniversityHref(props.universitySlug)} className="text-xs text-muted-foreground hover:text-primary hover:underline">Overview</Link>
        {UNIVERSITY_SECTIONS.filter((section) => section !== props.activeSection).map((section) => (
          <Link key={section} href={`/university/${props.universitySlug}-${section}`} className="text-xs capitalize text-muted-foreground hover:text-primary hover:underline">
            {section.replace("-", " ")}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SectionCounsellingCta(props: Pick<Props, "universityName" | "courseSlug" | "countrySlug">) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-6 py-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <p className="font-display text-lg font-semibold text-heading">Applying to {props.universityName}?</p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Students Traffic verifies seat availability, checks current recognition status, and prepares your complete application for {props.universityName}. The consultation is free.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a href="tel:+919176162888" className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary">
            <Phone className="size-3.5" /> Call us
          </a>
          <Link href={`/universities?country=${props.countrySlug}${props.courseSlug ? `&course=${props.courseSlug}` : ""}`} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Compare colleges <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
