const countryHeroImages: Record<string, { url: string; alt: string }> = {
  australia: {
    url: "/images/countries/australia-hero.webp",
    alt: "University-style campus building in Australia",
  },
  germany: {
    url: "/images/countries/germany.jpg",
    alt: "Students celebrating a study abroad scholarship outcome for Germany",
  },
  russia: {
    url: "/images/countries/russia-hero.jpg",
    alt: "Saint Basil's Cathedral, Moscow, Russia",
  },
  vietnam: {
    url: "/images/countries/vietnam-hero.jpg",
    alt: "Ho Chi Minh City skyline at sunset, Vietnam",
  },
  uzbekistan: {
    url: "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1774970469/studentstraffic/countries/qsqrsidyb7w77xr4jpzy.jpg",
    alt: "Beautiful historical architecture in Samarkand, Uzbekistan at sunset",
  },
  italy: {
    url: "/images/countries/italy.jpg",
    alt: "Italy — study medicine in one of Europe's most celebrated academic destinations",
  },
  canada: {
    url: "/images/countries/canada.jpg",
    alt: "University campus in Ontario, Canada",
  },
  georgia: {
    url: "/images/countries/georgia.jpg",
    alt: "Historic hillside architecture in Georgia",
  },
  kyrgyzstan: {
    url: "/images/countries/kyrgyzstan.jpg",
    alt: "Mountain landscape in Kyrgyzstan",
  },
  albania: {
    url: "/images/countries/albania.jpg",
    alt: "Skanderbeg Square and the city of Tirana, Albania",
  },
  lithuania: {
    url: "/images/countries/lithuania.jpg",
    alt: "Vilnius Old Town skyline, Lithuania",
  },
};

// Generic destination image used when a country has no dedicated hero photo
// yet (e.g. a newly added destination). Keeps every call site working
// without a falsy/missing-image case.
const defaultHeroImage = {
  url: "/images/home/country-options.jpg",
  alt: "Counsellor and student reviewing study-abroad destinations on a world map",
};

export function getCountryHeroImage(slug: string) {
  return countryHeroImages[slug] ?? defaultHeroImage;
}
