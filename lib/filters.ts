import type { FinderFilters, FinderSort } from "@/lib/data/types";

export const defaultFinderSort: FinderSort = "recommended";
export const finderSortValues = [
  "recommended",
  "tuition_asc",
  "tuition_desc",
  "name_asc",
] as const satisfies readonly FinderSort[];

type FinderParamsInput =
  | Record<string, string | string[] | undefined>
  | URLSearchParams;

function parseNumber(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getFirstValue(raw: FinderParamsInput, key: string) {
  if (raw instanceof URLSearchParams) {
    return raw.get(key) ?? undefined;
  }

  const value = raw[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseFinderSort(value?: string): FinderSort | undefined {
  if (!value) {
    return undefined;
  }

  return finderSortValues.find((sort) => sort === value);
}

function normalizeFinderSort(sort?: FinderSort) {
  if (!sort || sort === defaultFinderSort) {
    return undefined;
  }

  return parseFinderSort(sort);
}

export function getFinderSort(sort?: FinderSort) {
  return parseFinderSort(sort) ?? defaultFinderSort;
}

export function normalizeFinderFilters(filters: FinderFilters): FinderFilters {
  return {
    q: filters.q?.trim() || undefined,
    country: filters.country || undefined,
    course: filters.course || undefined,
    feeMin: filters.feeMin,
    feeMax: filters.feeMax,
    medium: filters.medium || undefined,
    intake: filters.intake || undefined,
    sort: normalizeFinderSort(filters.sort),
  };
}

export function parseFinderFilters(raw: FinderParamsInput): FinderFilters {
  return normalizeFinderFilters({
    q: getFirstValue(raw, "q") || undefined,
    country: getFirstValue(raw, "country") || undefined,
    course: getFirstValue(raw, "course") || undefined,
    feeMin: parseNumber(getFirstValue(raw, "fee_min")),
    feeMax: parseNumber(getFirstValue(raw, "fee_max")),
    medium: getFirstValue(raw, "medium") || undefined,
    intake: getFirstValue(raw, "intake") || undefined,
    sort: parseFinderSort(getFirstValue(raw, "sort") || undefined),
  });
}

export function parseFinderPage(value?: string) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function createFinderSearchParams(filters: FinderFilters, page = 1) {
  const params = new URLSearchParams();
  const normalized = normalizeFinderFilters(filters);

  if (normalized.q) params.set("q", normalized.q);
  if (normalized.country) params.set("country", normalized.country);
  if (normalized.course) params.set("course", normalized.course);
  if (normalized.medium) params.set("medium", normalized.medium);
  if (normalized.intake) params.set("intake", normalized.intake);
  if (normalized.feeMin != null)
    params.set("fee_min", String(normalized.feeMin));
  if (normalized.feeMax != null)
    params.set("fee_max", String(normalized.feeMax));
  if (normalized.sort) params.set("sort", normalized.sort);
  if (page > 1) params.set("page", String(page));

  return params;
}

export function buildFinderUrl(filters: FinderFilters, page = 1) {
  const params = createFinderSearchParams(filters, page);
  const query = params.toString();

  return `/universities${query ? `?${query}` : ""}`;
}

export function hasFinderFilters(filters: FinderFilters) {
  return Object.values(filters).some((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    return value !== undefined && value !== "";
  });
}
