import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";

import { SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";
import { Button } from "@/components/ui/button";
import { getUniversityHref } from "@/lib/routes";
import { getUniversityInitials } from "@/lib/university-media";
import { cn, formatCurrencyUsd } from "@/lib/utils";

export type CountryUniversityCardData = {
  slug: string;
  name: string;
  city: string;
  type: "Public" | "Private";
  logoUrl?: string;
  coverImageUrl?: string;
  featured: boolean;
  courseCount: number;
  minTuitionUsd: number | null;
};

export function CountryUniversitiesSection({
  countryName,
  countrySlug,
  universities,
  totalCount,
  flagCode,
}: {
  countryName: string;
  countrySlug: string;
  universities: CountryUniversityCardData[];
  totalCount: number;
  flagCode: string;
}) {
  if (!universities.length) return null;

  return (
    <div className="deferred-render py-12 md:py-16">
      <SectionKicker icon={<GraduationCap className="size-3.5" />} text="Popular universities" />
      <SectionHeading>Universities in {countryName}</SectionHeading>
      <SectionIntro>
        Compare {universities.length === totalCount ? "all" : "popular"} universities listed in {countryName}. Open a profile to check fees,
        accommodation and programmes.
      </SectionIntro>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {universities.map((university, index) => (
          <CountryUniversityCard
            key={university.slug}
            university={university}
            flagCode={flagCode}
            imagePriority={index === 0}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild className="bg-primary text-white hover:bg-primary/90">
          <Link href={`/universities?country=${countrySlug}`}>
            See all {countryName} universities
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function CountryUniversityCard({
  university,
  flagCode,
  imagePriority,
}: {
  university: CountryUniversityCardData;
  flagCode: string;
  imagePriority: boolean;
}) {
  const href = getUniversityHref(university.slug);
  const initials = getUniversityInitials(university.name);

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <Link href={href} className="absolute inset-0 z-[1]" aria-label={university.name} />

      <div
        className="relative h-36 w-full shrink-0 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f3d37 0%, #1a4a43 45%, #7c2610 100%)" }}
      >
        {university.coverImageUrl ? (
          <Image
            src={university.coverImageUrl}
            alt={`${university.name} campus`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={imagePriority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-end p-3">
            <span className="select-none font-display text-7xl font-bold leading-none text-white opacity-20">
              {initials}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
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
          {university.featured ? (
            <span className="inline-flex items-center rounded-md border border-white/25 bg-accent/85 px-2 py-0.5 text-[0.65rem] font-semibold text-white backdrop-blur-sm">
              Featured
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-2.5 left-2.5">
          {university.logoUrl ? (
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white shadow-md">
              <span className="relative flex h-full w-full items-center justify-center p-1.5">
                <Image
                  src={university.logoUrl}
                  alt={`${university.name} logo`}
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                />
              </span>
            </div>
          ) : (
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white shadow-md">
              <img
                src={`https://flagcdn.com/w40/${flagCode}.png`}
                alt=""
                width={28}
                height={20}
                className="block rounded-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
            {university.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{university.city}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <div className="flex flex-col">
            <span className="text-[0.65rem] text-muted-foreground">From</span>
            <span className="text-sm font-bold text-foreground">
              {university.minTuitionUsd ? `${formatCurrencyUsd(university.minTuitionUsd)}/yr` : "Check fee"}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[0.65rem] text-muted-foreground">Programs</span>
            <span className="text-sm font-semibold text-foreground">{university.courseCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
