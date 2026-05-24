import { NextRequest } from "next/server";

import { finderPageSize } from "@/lib/constants";
import { getFinderOptions, queryFinderCardProgramsPage } from "@/lib/data/catalog";
import { parseFinderFilters, parseFinderPage } from "@/lib/filters";
import { mapFinderCardProgram } from "@/lib/mobile/mappers";
import { mobileJson } from "@/lib/mobile/http";

export async function GET(request: NextRequest) {
  const filters = parseFinderFilters(request.nextUrl.searchParams);
  const page = parseFinderPage(request.nextUrl.searchParams.get("page") ?? undefined);
  const pageSize = Math.min(
    Number(request.nextUrl.searchParams.get("pageSize") ?? finderPageSize),
    30
  );
  const [results, options] = await Promise.all([
    queryFinderCardProgramsPage(filters, page, pageSize),
    getFinderOptions(),
  ]);

  return mobileJson({
    universities: results.programs.map(mapFinderCardProgram),
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
