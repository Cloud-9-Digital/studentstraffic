export interface ReviewFilters {
  search: string;
  country: string;
  universitySlug: string;
  type: string;
  minRating: string;
}

export function countActiveFilters(f: ReviewFilters) {
  return [f.country, f.universitySlug, f.type, f.minRating].filter(Boolean).length;
}
