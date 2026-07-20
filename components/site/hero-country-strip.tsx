import Image from "next/image";
import Link from "next/link";

import { getCountryHref } from "@/lib/routes";

// A curated set of popular study destinations that already have a real
// photo asset in public/images/countries — not the full country catalog,
// since most countries don't have a photo yet. Extend this list as more
// destinations get a real photo.
const FEATURED_DESTINATIONS = [
  { slug: "russia", name: "Russia", image: "/images/countries/russia.jpg" },
  { slug: "georgia", name: "Georgia", image: "/images/countries/georgia.jpg" },
  { slug: "uzbekistan", name: "Uzbekistan", image: "/images/countries/uzbekistan.jpg" },
  { slug: "kyrgyzstan", name: "Kyrgyzstan", image: "/images/countries/kyrgyzstan.jpg" },
  { slug: "vietnam", name: "Vietnam", image: "/images/countries/vietnam.jpg" },
  { slug: "italy", name: "Italy", image: "/images/countries/italy.jpg" },
  { slug: "germany", name: "Germany", image: "/images/countries/germany.jpg" },
  { slug: "china", name: "China", image: "/images/countries/china.jpg" },
  { slug: "canada", name: "Canada", image: "/images/countries/canada.jpg" },
  { slug: "australia", name: "Australia", image: "/images/countries/australia-hero.webp" },
  { slug: "lithuania", name: "Lithuania", image: "/images/countries/lithuania.jpg" },
  { slug: "albania", name: "Albania", image: "/images/countries/albania.jpg" },
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
      className="group relative block h-28 w-32 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5"
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="128px"
        priority={priority}
        className="object-cover transition-transform duration-300 group-active:scale-105"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-2 pb-1 pt-3">
        <span className="block truncate text-[10px] font-semibold text-white">{name}</span>
      </span>
    </Link>
  );
}

// Auto-scrolling strip of destination photos that fills the empty space
// above the (bottom-anchored) hero content on phones and portrait tablets,
// right under the header. The two-column desktop hero (lg+) keeps its own
// illustration instead, so this only shows below that breakpoint.
export function HeroCountryStrip() {
  const track = [...FEATURED_DESTINATIONS, ...FEATURED_DESTINATIONS];

  return (
    <div className="mt-4 overflow-hidden lg:hidden">
      <div className="marquee-track flex w-max items-center gap-2.5 px-4">
        {track.map((destination, index) => (
          <DestinationCard key={`${destination.slug}-${index}`} {...destination} priority={index < 3} />
        ))}
      </div>
    </div>
  );
}
