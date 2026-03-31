const countryHeroImages: Record<string, { url: string; alt: string }> = {
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
};

export function getCountryHeroImage(slug: string) {
  return countryHeroImages[slug] ?? null;
}
