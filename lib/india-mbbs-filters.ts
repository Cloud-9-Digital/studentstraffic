import type { IndiaMbbsFilters, IndiaMbbsSort } from "@/lib/data/types";

type ParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

export const defaultIndiaMbbsSort: IndiaMbbsSort = "recommended";

function getFirstValue(raw: ParamsInput, key: string) {
  if (raw instanceof URLSearchParams) {
    return raw.get(key) ?? undefined;
  }

  const value = raw[key];
  return Array.isArray(value) ? value[0] : value;
}

function parseSort(value?: string): IndiaMbbsSort | undefined {
  switch (value) {
    case "name_asc":
    case "seats_desc":
    case "year_desc":
      return value;
    default:
      return undefined;
  }
}

function normalizeSort(sort?: IndiaMbbsSort) {
  if (!sort || sort === defaultIndiaMbbsSort) {
    return undefined;
  }

  return parseSort(sort);
}

export function getIndiaMbbsSort(sort?: IndiaMbbsSort) {
  return parseSort(sort) ?? defaultIndiaMbbsSort;
}

export function normalizeIndiaMbbsFilters(
  filters: IndiaMbbsFilters,
): IndiaMbbsFilters {
  return {
    q: filters.q?.trim() || undefined,
    course: filters.course?.trim() || undefined,
    state: filters.state?.trim() || undefined,
    management: filters.management?.trim() || undefined,
    sort: normalizeSort(filters.sort),
  };
}

export function parseIndiaMbbsFilters(raw: ParamsInput): IndiaMbbsFilters {
  return normalizeIndiaMbbsFilters({
    q: getFirstValue(raw, "q"),
    course: getFirstValue(raw, "course"),
    state: getFirstValue(raw, "state"),
    management: getFirstValue(raw, "management"),
    sort: parseSort(getFirstValue(raw, "sort") || undefined),
  });
}

export function parseIndiaMbbsPage(value?: string) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function createIndiaMbbsSearchParams(
  filters: IndiaMbbsFilters,
  page = 1,
) {
  const params = new URLSearchParams();
  const normalized = normalizeIndiaMbbsFilters(filters);

  if (normalized.q) params.set("q", normalized.q);
  if (normalized.course) params.set("course", normalized.course);
  if (normalized.state) params.set("state", normalized.state);
  if (normalized.management) params.set("management", normalized.management);
  if (normalized.sort) params.set("sort", normalized.sort);
  if (page > 1) params.set("page", String(page));

  return params;
}

export function buildIndiaMbbsUrl(filters: IndiaMbbsFilters, page = 1) {
  const params = createIndiaMbbsSearchParams(filters, page);
  const query = params.toString();
  return `/india-mbbs-colleges${query ? `?${query}` : ""}`;
}

export function hasIndiaMbbsFilters(filters: IndiaMbbsFilters) {
  return Object.values(normalizeIndiaMbbsFilters(filters)).some(Boolean);
}
