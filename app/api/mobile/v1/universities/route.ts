import { getMobileProgramCounts } from "@/lib/mobile/program-counts";
import { NextRequest } from "next/server";

import { finderPageSize } from "@/lib/constants";
import { getFinderOptions, queryFinderCardProgramsPage } from "@/lib/data/catalog";
import { parseFinderFilters, parseFinderPage } from "@/lib/filters";
import { mapFinderCardProgram } from "@/lib/mobile/mappers";
import { mobilePublicJson } from "@/lib/mobile/http";

export async function GET(request: NextRequest) {
  const filters = parseFinderFilters(request.nextUrl.searchParams);
  const page = parseFinderPage(request.nextUrl.searchParams.get("page") ?? undefined);
  const requestedPageSize = Number(
    request.nextUrl.searchParams.get("pageSize") ?? finderPageSize,
  );
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.min(Math.max(Math.trunc(requestedPageSize), 1), 30)
    : finderPageSize;
  const [results, options] = await Promise.all([
    queryFinderCardProgramsPage(filters, page, pageSize),
    getFinderOptions(),
  ]);

  const counts = await getMobileProgramCounts(results.programs.map(p => p.university.slug));

  return mobilePublicJson({
    universities: results.programs.map(p => ({ ...mapFinderCardProgram(p), programCount: counts.get(p.university.slug) })),
    pagination: {
      totalItems: results.totalItems,
      totalPages: results.totalPages,
      currentPage: results.currentPage,
      pageSize: results.pageSize,
      hasPreviousPage: results.hasPreviousPage,
      hasNextPage: results.hasNextPage,
    },
    options,
  });
}
