"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { CountryFlag } from "@/components/site/country-flag";
import { getCountryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

// Matches the `marquee-scroll` animation's duration in app/globals.css.
const MARQUEE_DURATION_SECONDS = 26;
const MARQUEE_EPOCH_STORAGE_KEY = "hero-country-strip-epoch";

// Below this much leftover vertical space (viewport minus the headline/
// search block), there's no good way to show the strip at all — hide it so
// the content never gets squeezed.
const HIDE_BELOW_PX = 64;
// Below this, a full photo card would look cramped — fall back to a slim
// flag+name pill instead.
const COMPACT_BELOW_PX = 150;

type StripMode = "full" | "compact" | "hidden";

// A curated set of popular study destinations that already have a real
// photo asset in public/images/countries — not the full country catalog,
// since most countries don't have a photo yet. Extend this list as more
// destinations get a real photo.
const FEATURED_DESTINATIONS = [
  { slug: "russia", name: "Russia", isoCode: "ru", image: "/images/countries/russia.jpg" },
  { slug: "georgia", name: "Georgia", isoCode: "ge", image: "/images/countries/georgia.jpg" },
  { slug: "uzbekistan", name: "Uzbekistan", isoCode: "uz", image: "/images/countries/uzbekistan.jpg" },
  { slug: "kyrgyzstan", name: "Kyrgyzstan", isoCode: "kg", image: "/images/countries/kyrgyzstan.jpg" },
  { slug: "vietnam", name: "Vietnam", isoCode: "vn", image: "/images/countries/vietnam.jpg" },
  { slug: "italy", name: "Italy", isoCode: "it", image: "/images/countries/italy.jpg" },
  { slug: "germany", name: "Germany", isoCode: "de", image: "/images/countries/germany.jpg" },
  { slug: "china", name: "China", isoCode: "cn", image: "/images/countries/china.jpg" },
  { slug: "canada", name: "Canada", isoCode: "ca", image: "/images/countries/canada.jpg" },
  { slug: "australia", name: "Australia", isoCode: "au", image: "/images/countries/australia-hero.webp" },
  { slug: "lithuania", name: "Lithuania", isoCode: "lt", image: "/images/countries/lithuania.jpg" },
  { slug: "albania", name: "Albania", isoCode: "al", image: "/images/countries/albania.jpg" },
] as const;

function DestinationCard({
  slug,
  name,
  image,
  priority,
}: (typeof FEATURED_DESTINATIONS)[number] & { priority?: boolean }) {
  return (
    <Link
      href={getCountryHref(slug)}
      className="group relative block aspect-[4/3] shrink-0 self-stretch overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5"
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="180px"
        priority={priority}
        className="object-cover transition-transform duration-300 group-active:scale-105"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-2 pb-1 pt-3">
        <span className="block truncate text-[10px] font-semibold text-white">{name}</span>
      </span>
    </Link>
  );
}

function DestinationPill({ slug, name, isoCode }: (typeof FEATURED_DESTINATIONS)[number]) {
  return (
    <Link
      href={getCountryHref(slug)}
      className="flex shrink-0 items-center gap-1.5 self-center rounded-full border border-border bg-white px-3 py-1.5 shadow-sm"
    >
      <CountryFlag countryCode={isoCode} alt={name} width={16} height={12} className="shrink-0 rounded-sm shadow-flag" />
      <span className="whitespace-nowrap text-xs font-semibold text-foreground">{name}</span>
    </Link>
  );
}

// Auto-scrolling strip of destinations, right under the header on phones
// and portrait tablets. It's a flex-1 item in the hero's column layout, so
// it grows or shrinks to absorb whatever vertical space the viewport
// actually has, pushing the headline/search block below it down toward the
// bottom naturally. When that leftover space gets tight it degrades to a
// slim flag+name pill row, and below that it hides itself entirely rather
// than squeezing the headline/search block. The two-column desktop hero
// (lg+) keeps its own illustration instead, so this only shows below that
// breakpoint.
export function HeroCountryStrip() {
  const track = [...FEATURED_DESTINATIONS, ...FEATURED_DESTINATIONS];
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<StripMode>("full");

  // Decides full/compact/hidden from the space actually left over in the
  // hero after the headline/search block takes what it needs — not from raw
  // viewport height, since header height, bottom-nav height, and the
  // content block's own height (text wrap, font load) all vary.
  useLayoutEffect(() => {
    const heroEl = rootRef.current?.parentElement;
    const contentEl = heroEl?.lastElementChild as HTMLElement | null | undefined;
    if (!heroEl || !contentEl || contentEl === rootRef.current) return;

    const measure = () => {
      const leftover = heroEl.clientHeight - contentEl.offsetHeight;
      setMode(
        leftover < HIDE_BELOW_PX
          ? "hidden"
          : leftover < COMPACT_BELOW_PX
            ? "compact"
            : "full",
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(heroEl);
    observer.observe(contentEl);
    return () => observer.disconnect();
  }, []);

  // Resume the marquee where it "would" be instead of snapping back to the
  // start on every visit — e.g. tapping a destination, then returning home
  // remounts this component fresh, which would otherwise reset the CSS
  // animation to 0s. A per-tab epoch timestamp lets us compute how much time
  // has actually elapsed and rewind the animation to that point via a
  // negative delay, so it looks like it never stopped.
  useLayoutEffect(() => {
    if (mode === "hidden") return;

    let epoch = Number(sessionStorage.getItem(MARQUEE_EPOCH_STORAGE_KEY));
    if (!epoch) {
      epoch = Date.now();
      sessionStorage.setItem(MARQUEE_EPOCH_STORAGE_KEY, String(epoch));
    }

    const elapsedSeconds = ((Date.now() - epoch) / 1000) % MARQUEE_DURATION_SECONDS;
    if (trackRef.current) {
      trackRef.current.style.animationDelay = `-${elapsedSeconds}s`;
    }
  }, [mode]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "overflow-hidden lg:hidden",
        mode === "full" && "mt-4 flex min-h-[4.5rem] max-h-44 flex-1 items-stretch",
        mode === "compact" && "mt-4 flex h-9 shrink-0 items-stretch",
        mode === "hidden" && "hidden",
      )}
    >
      {mode !== "hidden" && (
        <div
          ref={trackRef}
          className={cn(
            "marquee-track flex w-max items-stretch",
            mode === "full" ? "gap-2.5 px-4" : "gap-2 px-4",
          )}
        >
          {track.map((destination, index) =>
            mode === "full" ? (
              <DestinationCard key={`${destination.slug}-${index}`} {...destination} priority={index < 3} />
            ) : (
              <DestinationPill key={`${destination.slug}-${index}`} {...destination} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
