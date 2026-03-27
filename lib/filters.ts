import type { FinderFilters } from "@/lib/data/types";

function parseNumber(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFinderFilters(
  raw: Record<string, string | string[] | undefined>
): FinderFilters {
  const getFirst = (key: string) => {
    const value = raw[key];

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  };

  return {
    q: getFirst("q") || undefined,
    country: getFirst("country") || undefined,
    course: getFirst("course") || undefined,
    feeMin: parseNumber(getFirst("fee_min")),
    feeMax: parseNumber(getFirst("fee_max")),
    medium: getFirst("medium") || undefined,
    intake: getFirst("intake") || undefined,
  };
}

export function hasFinderFilters(filters: FinderFilters) {
  return Object.values(filters).some((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    return value !== undefined && value !== "";
  });
}
