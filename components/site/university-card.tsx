import Image from "next/image";
import { UniversityCardCover } from "@/components/site/university-card-cover";
import { getLocalFlagUrl } from "@/lib/flag-media";
import Link from "next/link";
import { Building2 } from "lucide-react";

import { AddToCompareButton } from "@/components/site/add-to-compare-button";
import { ShortlistButton } from "@/components/site/shortlist-button";
import type { FinderUniversityCard } from "@/lib/finder-web-results";
import { universityImageBlurDataURL, universityLogoBlurDataURL } from "@/lib/image-placeholder";
import { getUniversityHref } from "@/lib/routes";
import { getCountryFlagCode, getUniversityCoverImage, getUniversityInitials } from "@/lib/university-media";
import { cn } from "@/lib/utils";
import { getUniversityDisplayName } from "@/lib/university-presentation";

export function UniversityCard({
  program,
  imagePriority = false,
  compact = false,
}: {
  program: FinderUniversityCard;
  imagePriority?: boolean;
  compact?: boolean;
}) {
  const { country } = program;
  const university = { ...program.university, name: getUniversityDisplayName(program.university.name) };
  const href = getUniversityHref(university.slug);
  const initials = getUniversityInitials(university.name);
  const coverImage = getUniversityCoverImage({ ...university, countrySlug: country.slug });

  return (
    // Wrapper is a plain div — Link covers the whole card via absolute inset,
    // AddToCompareButton is a sibling at z-10 to avoid nested interactive elements.
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm">

      {/* Full-card link — sits above card content (z-[1]) but below compare button (z-10) */}
      <Link href={href} prefetch={compact ? false : undefined} className="absolute inset-0 z-[1]" aria-label={university.name} />

      {/* Cover image ─────────────────────────────────────────────── */}
      <div
        className="relative h-36 w-full shrink-0 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f3d37 0%, #1a4a43 45%, #7c2610 100%)" }}
      >
        <div aria-hidden className="absolute inset-0 flex items-end justify-end p-3">
          <span className="select-none font-display text-7xl font-bold leading-none text-white opacity-20">
            {initials}
          </span>
        </div>
        {coverImage && (
          <UniversityCardCover
            key={coverImage.url}
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            sizes={compact ? "(max-width: 1023px) 50vw, (max-width: 1279px) 25vw, 320px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            priority={imagePriority}
            placeholder={compact ? "empty" : "blur"}
            blurDataURL={compact ? undefined : universityImageBlurDataURL}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
        {coverImage?.creditHref ? (
          <a href={coverImage.creditHref} className="absolute bottom-2.5 right-2.5 z-[2] rounded bg-black/70 px-1.5 py-0.5 text-[0.65rem] text-white underline underline-offset-2">
            Photo credit
          </a>
        ) : null}

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

        {/* Logo badge — bottom-left; falls back to country flag when no logo */}
        <div className="absolute bottom-2.5 left-2.5">
          {university.logoUrl ? (
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white shadow-md">
              <span className="relative flex h-full w-full items-center justify-center p-1.5">
                <Image
                  src={university.logoUrl}
                  alt={`${university.name} logo`}
                  fill
                  sizes="40px"
                  placeholder={compact ? "empty" : "blur"}
                  blurDataURL={compact ? undefined : universityLogoBlurDataURL}
                  className="object-contain p-1.5"
                />
              </span>
            </div>
          ) : (
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white shadow-md">
              <Image
                src={getLocalFlagUrl(getCountryFlagCode(country.slug))}
                alt={country.name}
                width={28}
                height={20}
                unoptimized
                className="block rounded-sm"
              />
            </div>
          )}
        </div>

      </div>

      {/* Card body ─────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col gap-4 p-4">
        <h3 className="text-sm font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
          {university.name}
        </h3>

        {/* Action buttons — z-10 so they intercept clicks above the card link.
            Icon-only below sm (buttons hide their label there) so the pair
            never gets cramped on a narrow 2-up mobile grid. */}
        <div className="relative z-10 mt-auto grid grid-cols-2 gap-1.5">
          <ShortlistButton slug={university.slug} name={university.name} />
          <AddToCompareButton
            slug={university.slug}
            name={university.name}
            logoUrl={university.logoUrl}
          />
        </div>
      </div>
    </div>
  );
}
