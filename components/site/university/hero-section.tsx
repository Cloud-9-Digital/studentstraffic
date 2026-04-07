import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CircleDollarSign,
  GraduationCap,
  MapPinned,
} from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { ScrollToButton } from "@/components/site/scroll-to-button";
import { UniversityLogoBadge } from "@/components/site/university/shared";
import { formatProgramDuration } from "@/lib/utils";

export function UniversityHeroSection({
  universityName,
  universitySummary,
  city,
  establishedYear,
  logoUrl,
  coverImage,
  logoInitials,
  primaryProgramFeeDisplay,
  primaryProgramHasPublishedFee,
  primaryProgramHasRenderableFee,
  primaryProgramDurationYears,
  primaryProgramShortName,
}: {
  universityName: string;
  universitySummary: string;
  city: string;
  establishedYear: number;
  logoUrl?: string;
  coverImage: { url: string; alt: string } | null;
  logoInitials: string;
  primaryProgramFeeDisplay: string | null;
  primaryProgramHasPublishedFee: boolean;
  primaryProgramHasRenderableFee: boolean;
  primaryProgramDurationYears?: number;
  primaryProgramShortName?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-surface-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
      <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
      <div
        className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-30"
        aria-hidden
      />
      <div
        className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-50"
        aria-hidden
      />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background/20 to-transparent" />

      <div className="relative mx-auto w-[min(1380px,calc(100%-2rem))] py-12 md:py-16">
        <div
          className={`grid gap-8 lg:items-center lg:gap-12 xl:gap-16 ${
            coverImage || logoUrl
              ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]"
              : ""
          }`}
        >
          <div className="min-w-0 space-y-6">
            <nav className="flex items-center gap-2 text-xs text-white/50">
              <Link
                href="/universities"
                className="transition-colors hover:text-white/80"
              >
                Universities
              </Link>
              <span>/</span>
              <span className="text-white/70">{universityName}</span>
            </nav>

            <div className="space-y-3">
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                {universityName}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/65 md:text-base md:leading-8">
                {universitySummary}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <MapPinned className="size-4 text-white/50" />
                <span className="text-sm font-medium text-white/80">{city}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-white/50" />
                <span className="text-sm font-medium text-white/80">
                  Est. {establishedYear}
                </span>
              </div>
              {primaryProgramShortName ? (
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="size-4 text-white/50" />
                  <span className="text-sm font-medium text-white/80">
                    {(primaryProgramHasPublishedFee ||
                      primaryProgramHasRenderableFee) &&
                    primaryProgramFeeDisplay
                        ? `${primaryProgramFeeDisplay} / year`
                        : "Fee on official notice"}
                  </span>
                </div>
              ) : null}
              {primaryProgramDurationYears && primaryProgramShortName ? (
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-white/50" />
                  <span className="text-sm font-medium text-white/80">
                    {formatProgramDuration(primaryProgramDurationYears)}{" "}
                    {primaryProgramShortName}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <CounsellingDialog
                triggerContent="Apply — book my call"
                triggerVariant="accent"
                triggerSize="default"
              />
              <ScrollToButton
                targetId="talk-to-peers"
                className="border border-white/20 bg-white/8 !text-white hover:bg-white/15 hover:!text-white"
              >
                Talk to a student
              </ScrollToButton>
            </div>
          </div>

          <div className="min-w-0 lg:justify-self-end">
            <UniversityHeroMedia
              coverImage={coverImage}
              universityName={universityName}
              logoUrl={logoUrl}
              logoInitials={logoInitials}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function UniversityHeroMedia({
  coverImage,
  universityName,
  logoUrl,
  logoInitials,
}: {
  coverImage: { url: string; alt: string } | null;
  universityName: string;
  logoUrl?: string;
  logoInitials: string;
}) {
  if (!coverImage && !logoUrl) return null;

  return (
    <figure className="group relative mx-auto w-full max-w-[580px] overflow-hidden rounded-[2rem] border border-white/12 bg-card shadow-[0_30px_100px_-50px_rgba(7,10,19,0.9)]">
      {coverImage ? (
        <div className="relative h-[320px] overflow-hidden md:h-[420px] lg:h-[560px]">
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            width={1160}
            height={1450}
            sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 38vw, 580px"
            loading="eager"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,10,19,0.18),transparent_42%,rgba(7,10,19,0.08))]" />
          {logoUrl ? (
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5">
              <UniversityLogoBadge
                name={universityName}
                logoUrl={logoUrl}
                initials={logoInitials}
                className="size-16 border-white/80 bg-white text-surface-dark shadow-lg backdrop-blur-sm md:size-20"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {!coverImage && logoUrl ? (
        <div className="flex items-center justify-center px-10 py-14">
          <UniversityLogoBadge
            name={universityName}
            logoUrl={logoUrl}
            initials={logoInitials}
            className="size-28 border-white/20 bg-white text-surface-dark shadow-lg md:size-36"
          />
        </div>
      ) : null}
    </figure>
  );
}
