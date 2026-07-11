import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, MapPinned } from "lucide-react";

import { CountryFlag } from "@/components/site/country-flag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CountryHero({
  countryName,
  flagCode,
  region,
  leadText,
  heroImage,
  isBrandedFallback,
  primaryHref,
  guideSlot,
}: {
  countryName: string;
  flagCode: string;
  region: string;
  leadText: string;
  heroImage: { url: string; alt: string } | null;
  isBrandedFallback: boolean;
  primaryHref: string;
  guideSlot?: ReactNode;
}) {
  const showRealImage = heroImage && !isBrandedFallback;

  return (
    <section className="border-b border-border/70 bg-[#f7f7f3]">
      <div className="container-shell py-5 sm:py-7 lg:py-9">
        <nav className="mb-4 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-muted-foreground sm:mb-5">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
          <Link href="/countries" className="transition-colors hover:text-primary">
            Countries
          </Link>
          <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
          <span className="font-medium text-foreground">{countryName}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:items-stretch lg:gap-10">
          <div className="order-last flex min-w-0 flex-col justify-center py-0 lg:order-first lg:py-4">
            <h1 className="mt-0 max-w-[10ch] font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-primary sm:max-w-[8ch]">
              Study in <span className="text-accent">{countryName}</span>
            </h1>

            <p className="mt-6 max-w-xl text-[1rem] leading-7 text-muted-foreground sm:text-[1.08rem] sm:leading-8">
              {leadText}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-white shadow-cta hover:bg-accent-strong">
                <Link href={primaryHref}>
                  Explore universities
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              {guideSlot}
            </div>
          </div>

          <div className="relative order-first min-h-[300px] overflow-hidden rounded-[1.5rem] border border-primary/10 bg-primary shadow-hero sm:min-h-[390px] lg:order-last lg:min-h-[500px] lg:rounded-[2rem]">
            {showRealImage ? (
              <Image
                src={heroImage.url}
                alt={heroImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 100vw, 55vw"
                priority
              />
            ) : (
              <BrandedHeroPanel countryName={countryName} flagCode={flagCode} region={region} />
            )}

            {showRealImage ? (
              <div className="absolute left-5 top-5 z-10 sm:left-7 sm:top-7">
                <CountryFlag
                  countryCode={flagCode}
                  alt={`${countryName} flag`}
                  width={68}
                  height={48}
                  className="rounded-lg border border-white/70 shadow-xl"
                />
              </div>
            ) : null}

            {showRealImage ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-5 pt-20 sm:p-7 sm:pt-28">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70">Your starting point</p>
                    <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">Find your next chapter.</p>
                  </div>
                  <MapPinned aria-hidden="true" className="mb-1 size-5 shrink-0 text-white/80" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <div className={cn("relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden p-6 text-white sm:min-h-[390px] sm:p-8 lg:min-h-[500px] lg:p-10", "bg-primary")}>
      <div aria-hidden="true" className="hero-grid-lines pointer-events-none absolute inset-0 opacity-30" />
      <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-20 size-80 rounded-full border border-white/10" />

      <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
        <MapPinned aria-hidden="true" className="size-4" />
        {region}
      </div>

      <div className="relative">
        <div className="mb-7 inline-flex rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
          <CountryFlag countryCode={flagCode} alt={`${countryName} flag`} width={72} height={51} className="rounded-md shadow-flag" />
        </div>
        <p className="max-w-[9ch] font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">{countryName}</p>
        <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">A practical starting point for comparing universities, courses and student life.</p>
      </div>
    </div>
  );
}
