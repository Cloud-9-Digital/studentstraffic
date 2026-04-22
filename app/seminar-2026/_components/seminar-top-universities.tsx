import Image from "next/image";

import { CardCarousel, CarouselItem } from "@/components/site/card-carousel";
import { getUniversities } from "@/lib/data/catalog";
import {
  getCountryFlagCode,
  getCountryPlaceholder,
  getUniversityCoverImage,
  getUniversityInitials,
} from "@/lib/university-media";

const UNIVERSITY_GROUPS = [
  {
    country: "Vietnam",
    countrySlug: "vietnam",
    universities: [
      { slug: "buon-ma-thuot-medical-university", label: "Buon Ma Thuot Medical University" },
      { slug: "dai-nam-university-faculty-of-medicine", label: "Dai Nam University" },
      { slug: "phan-chau-trinh-university", label: "Phan Chau Trinh University" },
      { slug: "can-tho-university-medicine-pharmacy", label: "Can Tho University of Medicine and Pharmacy" },
      { slug: "dong-a-university-college-of-medicine", label: "Dong A University College of Medicine" },
    ],
  },
  {
    country: "Russia",
    countrySlug: "russia",
    universities: [
      { slug: "samara-state-medical-university", label: "Samara State Medical University" },
      { slug: null, label: "N.P. Ogarev Mordovia State Medical University" },
      { slug: "crimea-federal-university", label: "Crimea Federal Medical University" },
      { slug: "izhevsk-state-medical-academy", label: "Izhevsk State Medical University" },
    ],
  },
  {
    country: "Georgia",
    countrySlug: "georgia",
    universities: [
      { slug: null, label: "Georgian National Medical University (SEU)" },
      { slug: "university-of-georgia", label: "University of Georgia" },
      { slug: null, label: "Batumi International University (BAU)" },
    ],
  },
  {
    country: "Uzbekistan",
    countrySlug: "uzbekistan",
    universities: [
      { slug: null, label: "Tashkent State Medical University" },
      { slug: "samarkand-state-medical-university", label: "Samarkand State Medical University" },
      { slug: null, label: "Mumun State Medical University" },
    ],
  },
  {
    country: "Kyrgyzstan",
    countrySlug: "kyrgyzstan",
    universities: [
      { slug: "kyrgyz-uzbek-university", label: "Kyrgyz - Uzbek International University" },
      { slug: null, label: "Jalalabad State Medical University" },
      { slug: null, label: "Jalalabad International University" },
    ],
  },
] as const;

export async function SeminarTopUniversities() {
  const universities = await getUniversities();
  const universitiesBySlug = new Map(
    universities.map((university) => [university.slug, university])
  );
  const allUniversities = UNIVERSITY_GROUPS.flatMap((group) =>
    group.universities.map((item) => ({
      ...item,
      country: group.country,
      countrySlug: group.countrySlug,
    }))
  );

  const renderCard = (item: (typeof allUniversities)[number]) => {
    const university = item.slug ? universitiesBySlug.get(item.slug) : null;
    const coverImage = university
      ? getUniversityCoverImage({
          slug: university.slug,
          name: university.name,
          coverImageUrl: university.coverImageUrl,
        })
      : null;
    const placeholder = getCountryPlaceholder(item.countrySlug);
    const initials = getUniversityInitials(item.label);

    return (
      <article
        key={`${item.country}-${item.label}`}
        className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-[0_18px_40px_rgba(12,26,53,0.05)]"
      >
        <div
          className="relative h-40 w-full overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${placeholder.from} 0%, ${placeholder.to} 100%)`,
          }}
        >
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={coverImage.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-end justify-end p-4">
              <span
                className="select-none text-6xl font-bold leading-none opacity-20"
                style={{ color: placeholder.text }}
              >
                {initials}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
            <img
              src={`https://flagcdn.com/w40/${getCountryFlagCode(item.countrySlug)}.png`}
              alt={item.country}
              width={16}
              height={12}
              className="rounded-[2px]"
            />
            <span className="uppercase tracking-[0.18em]">{item.country}</span>
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-sm font-semibold leading-6 text-[#0c1a35]">{item.label}</h4>
        </div>
      </article>
    );
  };

  return (
    <section className="bg-[#fffaf3] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
          Top Universities
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-snug text-[#0c1a35] sm:text-4xl">
          Explore top universities across the countries students ask about most
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#5a6270]">
          Get clarity on the universities students and parents most often compare for MBBS abroad. At the seminar,
          we help you understand country options, university choices, fees, and which path fits your budget,
          NEET score, and long-term plan.
        </p>

        <div className="mt-10 md:hidden">
          <CardCarousel heading="Swipe universities" autoScroll>
            {allUniversities.map((item) => (
              <CarouselItem key={`${item.country}-${item.label}`}>
                {renderCard(item)}
              </CarouselItem>
            ))}
          </CardCarousel>
        </div>

        <div className="mt-10 hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
          {allUniversities.map((item) => renderCard(item))}
        </div>
      </div>
    </section>
  );
}
