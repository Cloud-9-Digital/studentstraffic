const countryHeroImages: Record<string, { url: string; alt: string }> = {
  australia: {
    url: "/images/countries/australia-hero.webp",
    alt: "University-style campus building in Australia",
  },
  germany: {
    url: "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1779736142/studentstraffic/countries/germany-scholarship-hero.jpg",
    alt: "Students celebrating a study abroad scholarship outcome for Germany",
  },
  russia: {
    url: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=900&q=85",
    alt: "Saint Basil's Cathedral, Moscow, Russia",
  },
  vietnam: {
    url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=85",
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
    url: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=900&q=85",
    alt: "University campus in Ontario, Canada",
  },
};

export function getCountryHeroImage(slug: string) {
  return countryHeroImages[slug] ?? null;
}
