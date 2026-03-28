import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ComparisonGuide } from "@/lib/discovery-pages";
import { getComparisonHref } from "@/lib/routes";
import {
  getUniversityCoverImage,
  getUniversityInitials,
} from "@/lib/university-media";
import { formatCurrencyUsd, hasPublishedUsdAmount } from "@/lib/utils";

export function ComparisonCard({ guide }: { guide: ComparisonGuide }) {
  const { left, right } = guide;
  const href = getComparisonHref(guide.slug);
  const leftInitials = getUniversityInitials(left.university.name);
  const rightInitials = getUniversityInitials(right.university.name);
  const leftCover = getUniversityCoverImage(left.university);
  const rightCover = getUniversityCoverImage(right.university);
  const hasComparableFees =
    hasPublishedUsdAmount(left.offering.annualTuitionUsd) &&
    hasPublishedUsdAmount(right.offering.annualTuitionUsd);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Split cover */}
      <div className="relative flex h-24 w-full overflow-hidden">
        <div className="relative w-1/2 overflow-hidden bg-primary/10">
          {leftCover ? (
            <Image
              src={leftCover.url}
              alt={leftCover.alt}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="select-none font-display text-3xl font-semibold text-primary/10">
                {leftInitials}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
        </div>
        <div className="relative w-1/2 overflow-hidden bg-accent/10">
          {rightCover ? (
            <Image
              src={rightCover.url}
              alt={rightCover.alt}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="select-none font-display text-3xl font-semibold text-accent/10">
                {rightInitials}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
        </div>

        {/* VS pill */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/50 text-[0.6rem] font-bold tracking-widest text-white backdrop-blur-sm">
            VS
          </span>
        </div>

        {/* Logos */}
        <div className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-white/70 bg-white shadow">
          {left.university.logoUrl ? (
            <Image
              src={left.university.logoUrl}
              alt={left.university.name}
              width={28}
              height={28}
              className="h-full w-full object-contain p-0.5"
            />
          ) : (
            <span className="text-[0.5rem] font-bold text-primary">{leftInitials}</span>
          )}
        </div>
        <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-white/70 bg-white shadow">
          {right.university.logoUrl ? (
            <Image
              src={right.university.logoUrl}
              alt={right.university.name}
              width={28}
              height={28}
              className="h-full w-full object-contain p-0.5"
            />
          ) : (
            <span className="text-[0.5rem] font-bold text-primary">{rightInitials}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {left.course.shortName}
          </p>
          <div className="mt-1 space-y-0.5">
            <p className="line-clamp-1 text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
              {left.university.name}
            </p>
            <p className="text-[0.6rem] font-medium text-muted-foreground">vs</p>
            <p className="line-clamp-1 text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
              {right.university.name}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.6rem] text-muted-foreground">Tuition range</span>
            <span className="text-xs font-semibold text-foreground">
              {hasComparableFees
                ? `${formatCurrencyUsd(
                    Math.min(left.offering.annualTuitionUsd, right.offering.annualTuitionUsd)
                  )} – ${formatCurrencyUsd(
                    Math.max(left.offering.annualTuitionUsd, right.offering.annualTuitionUsd)
                  )}`
                : "Check official fee"}
            </span>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
