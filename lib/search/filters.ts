import type { SearchDocumentType, SearchFilters } from "@/lib/data/types";

const validDocumentTypes = new Set<SearchDocumentType>([
  "country",
  "course",
  "university",
  "program",
  "landing_page",
]);

export function parseSearchFilters(
  raw: Record<string, string | string[] | undefined>
): SearchFilters {
  const getFirst = (key: string) => {
    const value = raw[key];

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  };

  const type = getFirst("type");

  return {
    q: getFirst("q")?.trim() || undefined,
    type:
      type && validDocumentTypes.has(type as SearchDocumentType)
        ? (type as SearchDocumentType)
        : undefined,
    country: getFirst("country") || undefined,
    course: getFirst("course") || undefined,
  };
}
