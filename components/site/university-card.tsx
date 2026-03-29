import Image from "next/image";
import Link from "next/link";
import { Building2 } from "lucide-react";

import { AddToCompareButton } from "@/components/site/add-to-compare-button";
import type { FinderCardProgram } from "@/lib/data/types";
import { getUniversityHref } from "@/lib/routes";
import { getUniversityCoverImage, getUniversityInitials } from "@/lib/university-media";
import {
  cn,
  formatUsdAmountOrTbd,
  hasPublishedUsdAmount,
} from "@/lib/utils";

export function UniversityCard({
  program,
  imagePriority = false,
}: {
  program: FinderCardProgram;
  imagePriority?: boolean;
}) {
  const { university, country, course, offering } = program;
  const href = getUniversityHref(university.slug);
  const initials = getUniversityInitials(university.name);
  const coverImage = getUniversityCoverImage(university);
  const hasPublishedFee = hasPublishedUsdAmount(offering.annualTuitionUsd);

  return (
    // Wrapper is a plain div — Link covers the whole card via absolute inset,
    // AddToCompareButton is a sibling at z-10 to avoid nested interactive elements.
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm">

      {/* Full-card link — sits above card content (z-[1]) but below compare button (z-10) */}
      <Link href={href} className="absolute inset-0 z-[1]" aria-label={university.name} />

      {/* Cover image ─────────────────────────────────────────────── */}
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/12 to-primary/5">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={imagePriority}
            loading={imagePriority ? "eager" : undefined}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-display text-6xl font-semibold text-primary/10">
              {initials}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        {/* University type — top-left */}
        <div className="absolute left-2.5 top-2.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.65rem] font-semibold backdrop-blur-sm",
              university.type === "Public"
                ? "border-white/25 bg-emerald-900/60 text-emerald-100"
                : "border-white/25 bg-black/40 text-white/85"
            )}
          >
            <Building2 className="size-2.5" />
            {university.type}
          </span>
        </div>

        {/* Country — top-right */}
        <div className="absolute right-2.5 top-2.5">
          <span className="inline-flex items-center rounded-md border border-white/20 bg-black/35 px-2 py-0.5 text-[0.65rem] font-medium text-white/90 backdrop-blur-sm">
            {country.name}
          </span>
        </div>

        {/* Logo badge — bottom-left */}
        <div className="absolute bottom-2.5 left-2.5 flex size-10 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white shadow-md">
          {university.logoUrl ? (
            <span className="relative flex h-full w-full items-center justify-center p-1.5">
              <Image
                src={university.logoUrl}
                alt={`${university.name} logo`}
                fill
                sizes="40px"
                className="object-contain p-1.5"
              />
            </span>
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>

      </div>

      {/* Card body ─────────────────────────────────────────────── */}
      <div className="relative z-0 flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
            {university.name}
          </h3>
        </div>

        <div className="mt-auto flex flex-col gap-2.5 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.65rem] text-muted-foreground">
                {hasPublishedFee ? "Tuition / yr" : "Fee"}
              </span>
              <span
                className={cn(
                  "font-bold text-foreground",
                  hasPublishedFee ? "text-sm" : "text-xs leading-5"
                )}
              >
                {formatUsdAmountOrTbd(offering.annualTuitionUsd)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[0.65rem] text-muted-foreground">Course</span>
              <span className="text-sm font-semibold text-foreground">{course.shortName}</span>
            </div>
          </div>

          {/* Compare button — z-10 so it intercepts clicks above the card link */}
          <div className="relative z-10">
            <AddToCompareButton
              slug={university.slug}
              name={university.name}
              logoUrl={university.logoUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
