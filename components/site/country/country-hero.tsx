import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, ChevronRight, Coins, Globe2, MapPinned, Sun } from "lucide-react";

import { CountryFlag } from "@/components/site/country-flag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CountryHero({
  countryName,
  flagCode,
  region,
  currencyCode,
  climateSummary,
  leadText,
  heroImage,
  isBrandedFallback,
  stats,
  primaryHref,
  guideSlot,
}: {
  countryName: string;
  flagCode: string;
  region: string;
  currencyCode: string;
  climateSummary: string;
  leadText: string;
  heroImage: { url: string; alt: string } | null;
  isBrandedFallback: boolean;
  stats: { universities: number; cities: number; studyFields: number };
  primaryHref: string;
  guideSlot?: ReactNode;
}) {
  const showRealImage = heroImage && !isBrandedFallback;

  return (
    <section>
      <div className="relative overflow-hidden bg-[#0d1f1d]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,rgba(240,138,68,0.18),transparent),radial-gradient(ellipse_40%_50%_at_0%_60%,rgba(255,255,255,0.04),transparent)]"
        />
        <div aria-hidden className="hero-grid-lines absolute inset-0 opacity-20 pointer-events-none" />

        <div className="container-shell relative py-9 sm:py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-10">
            <div className="min-w-0">
              <nav className="mb-5 flex items-center gap-1.5 text-xs text-white/36 sm:mb-6">
                <Link href="/" className="transition-colors hover:text-white/70">
                  Home
                </Link>
                <ChevronRight className="size-3 shrink-0" />
                <Link href="/countries" className="transition-colors hover:text-white/70">
                  Countries
                </Link>
                <ChevronRight className="size-3 shrink-0" />
                <span className="text-white/60">{countryName}</span>
              </nav>

              <div className="flex items-center gap-2.5">
                <CountryFlag
                  countryCode={flagCode}
                  alt={`${countryName} flag`}
                  width={30}
                  height={21}
                  className="rounded-[0.3rem] border border-white/25 shadow-flag"
                />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                  {region}
                </span>
              </div>

              <h1 className="mt-4 font-display text-[clamp(2.6rem,10vw,5.5rem)] font-semibold leading-[0.92] tracking-tight text-white">
                Study in
                <br />
                <em className="not-italic text-accent">{countryName}</em>
              </h1>

              <p className="mt-5 max-w-lg text-[0.95rem] leading-7 text-white/62 sm:text-base">
                {leadText}
              </p>

              {/* Live stat row — the number-forward proof this is a real, DB-backed hub */}
              <div className="mt-7 flex flex-wrap items-stretch gap-x-7 gap-y-4 border-y border-white/10 py-4">
                <HeroStat value={stats.universities} label="Universities" />
                <HeroStat value={stats.cities} label="Cities" />
                <HeroStat value={stats.studyFields} label="Study fields" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <HeroMetaPill icon={<Coins className="size-3.5" />} label={currencyCode} />
                <HeroMetaPill icon={<Sun className="size-3.5" />} label={climateSummary} />
                <HeroMetaPill icon={<Globe2 className="size-3.5" />} label={region} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="!bg-white !text-[#0d1f1d] shadow-none hover:!bg-white/90 hover:!text-[#0d1f1d]"
                >
                  <Link href={primaryHref}>
                    Browse colleges
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                {guideSlot}
              </div>
            </div>

            <div className="relative hidden lg:block">
              {showRealImage ? (
                <div className="relative h-[480px] overflow-hidden rounded-[2rem]">
                  <Image
                    src={heroImage!.url}
                    alt={heroImage!.alt}
                    fill
                    className="object-cover"
                    sizes="440px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f1d]/50 via-transparent to-transparent" />
                </div>
              ) : (
                <BrandedHeroPanel countryName={countryName} flagCode={flagCode} region={region} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[4.5rem]">
      <p className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {value}
        {value > 0 ? "+" : ""}
      </p>
      <p className="mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/45">
        {label}
      </p>
    </div>
  );
}

function HeroMetaPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/75">
      <span className="text-accent">{icon}</span>
      {label}
    </div>
  );
}

// Tasteful branded treatment for countries without a dedicated hero photo yet
// — a gradient card built from brand tokens, the real country flag, and large
// display type, instead of a generic stock image or a broken external URL.
function BrandedHeroPanel({
  countryName,
  flagCode,
  region,
}: {
  countryName: string;
  flagCode: string;
  region: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[480px] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 p-8",
        "bg-gradient-to-br from-primary via-surface-dark-2 to-[#5b1d0c]"
      )}
    >
      <div aria-hidden className="hero-grid-lines absolute inset-0 opacity-25 pointer-events-none" />
      <div
        aria-hidden
        className="hero-orb hero-orb--warm pointer-events-none absolute -right-10 -top-16 size-72 opacity-40"
      />
      <div
        aria-hidden
        className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-14 -left-10 size-64 opacity-40"
      />

      <div className="relative flex items-center gap-3">
        <MapPinned className="size-4 text-white/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
          {region}
        </span>
      </div>

      <div className="relative flex flex-col items-start gap-6">
        <span className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
          <CountryFlag
            countryCode={flagCode}
            alt={`${countryName} flag`}
            width={72}
            height={51}
            className="rounded-md shadow-flag"
          />
        </span>
        <p className="font-display text-4xl font-semibold leading-[1] tracking-tight text-white">
          {countryName}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/55">
          <Building2 className="size-3" />
          Students Traffic destination guide
        </div>
      </div>
    </div>
  );
}
