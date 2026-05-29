const KEY = "st_recently_viewed";
const MAX = 6;

export type RecentlyViewedItem = {
  slug: string;
  name: string;
  logoUrl?: string;
  city: string;
  countryName: string;
};

export function recordRecentlyViewed(item: RecentlyViewedItem): void {
  try {
    const existing: RecentlyViewedItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const filtered = existing.filter((i) => i.slug !== item.slug);
    localStorage.setItem(KEY, JSON.stringify([item, ...filtered].slice(0, MAX)));
  } catch {}
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
