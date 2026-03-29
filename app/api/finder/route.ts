import { NextResponse, type NextRequest } from "next/server";

import { finderPageSize } from "@/lib/constants";
import { queryFinderCardProgramsPage } from "@/lib/data/catalog";
import { parseFinderFilters, parseFinderPage } from "@/lib/filters";

export async function GET(request: NextRequest) {
  const filters = parseFinderFilters(request.nextUrl.searchParams);
  const page = parseFinderPage(
    request.nextUrl.searchParams.get("page") ?? undefined,
  );
  const results = await queryFinderCardProgramsPage(filters, page, finderPageSize);

  return NextResponse.json(results);
}
