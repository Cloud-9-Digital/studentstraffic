import { getCountryHeroImage } from "@/lib/country-media";

export type LocationMedia = {
  url: string;
  alt: string;
  sourceLabel?: string;
  sourceUrl?: string;
};

const cityMediaMap: Record<string, LocationMedia> = {
  "georgia::tbilisi": {
    url: "https://images.pexels.com/photos/32565386/pexels-photo-32565386.jpeg?cs=srgb&dl=pexels-eslames1-32565386.jpg&fm=jpg",
    alt: "Aerial skyline view of Tbilisi, Georgia",
    sourceLabel: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/breathtaking-aerial-view-of-tbilisi-skyline-32565386/",
  },
  "vietnam::hanoi": {
    url: "https://images.pexels.com/photos/5909334/pexels-photo-5909334.jpeg?cs=srgb&dl=pexels-nguy-n-ph-ng-linh-3931723-5909334.jpg&fm=jpg",
    alt: "Skyline view of Hanoi, Vietnam",
    sourceLabel: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/city-skyline-under-white-sky-5909334/",
  },
  "vietnam::ho chi minh city": {
    url: "https://images.pexels.com/photos/32196732/pexels-photo-32196732.jpeg?cs=srgb&dl=pexels-huu-duy-foto-685214803-32196732.jpg&fm=jpg",
    alt: "Panoramic skyline of Ho Chi Minh City, Vietnam",
    sourceLabel: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/skyline-view-of-ho-chi-minh-city-skyline-32196732/",
  },
  "vietnam::da nang": {
    url: "https://images.pexels.com/photos/12162281/pexels-photo-12162281.jpeg?cs=srgb&dl=pexels-anh-huynh-tuan-673356-12162281.jpg&fm=jpg",
    alt: "Da Nang skyline with the Han River and Dragon Bridge",
    sourceLabel: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/city-skyline-across-body-of-water-12162281/",
  },
  "albania::tirana": {
    url: "https://images.unsplash.com/photo-1558642369-e4a03cc80b26?auto=format&fit=crop&w=900&q=85",
    alt: "Skanderbeg Square, Tirana, Albania",
    sourceLabel: "Unsplash",
  },
  "lithuania::kaunas": {
    url: "https://images.unsplash.com/photo-1599422094275-57cb54a4dbb2?auto=format&fit=crop&w=900&q=85",
    alt: "Town Hall Square (Rotušės aikštė), Kaunas, Lithuania",
    sourceLabel: "Unsplash",
  },
  "lithuania::vilnius": {
    url: "https://images.unsplash.com/photo-1549893073-0a10b51cde7a?auto=format&fit=crop&w=900&q=85",
    alt: "Vilnius Old Town skyline and cathedral, Lithuania",
    sourceLabel: "Unsplash",
  },
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function getCityMedia(countrySlug: string, city: string) {
  return cityMediaMap[`${normalize(countrySlug)}::${normalize(city)}`] ?? null;
}

export function getCountryMedia(countrySlug: string) {
  return getCountryHeroImage(countrySlug);
}
