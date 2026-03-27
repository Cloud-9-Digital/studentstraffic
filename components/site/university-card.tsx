import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";

import type { FinderProgram } from "@/lib/data/types";
import { getUniversityHref } from "@/lib/routes";
import { getUniversityCoverImage, getUniversityInitials } from "@/lib/university-media";
import { cn, formatCurrencyUsd } from "@/lib/utils";

export function UniversityCard({ program }: { program: FinderProgram }) {
  const { university, country, course, offering } = program;
  const href = getUniversityHref(university.slug);
  const initials = getUniversityInitials(university.name);
  const coverImage = getUniversityCoverImage(university);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
    >
      {/* Cover image ─────────────────────────────────────────────── */}
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/12 to-primary/5">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-display text-6xl font-semibold text-primary/10">
              {initials}
            </span>
          </div>
        )}

        {/* Gradient overlay for bottom legibility */}
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
            <span className="flex h-full w-full items-center justify-center p-1.5">
              <Image
                src={university.logoUrl}
                alt={`${university.name} logo`}
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </span>
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>

        {/* Arrow — bottom-right */}
        <div className="absolute bottom-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-colors group-hover:bg-white/25">
          <ArrowUpRight className="size-3.5 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Card body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name + location */}
        <div>
          <h3 className="text-sm font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
            {university.name}
          </h3>
        </div>

        {/* Stats row */}
        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3">
          <div className="flex flex-col">
            <span className="text-[0.65rem] text-muted-foreground">Tuition / yr</span>
            <span className="text-sm font-bold text-foreground">
              {formatCurrencyUsd(offering.annualTuitionUsd)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.65rem] text-muted-foreground">City</span>
            <span className="text-sm font-semibold text-foreground truncate">{university.city}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.65rem] text-muted-foreground">Course</span>
            <span className="text-sm font-semibold text-foreground">{course.shortName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
