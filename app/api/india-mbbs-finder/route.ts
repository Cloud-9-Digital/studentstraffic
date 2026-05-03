import { NextResponse } from "next/server";

import { queryIndiaMbbsCollegesPage } from "@/lib/data/india-mbbs";
import { parseIndiaMbbsFilters, parseIndiaMbbsPage } from "@/lib/india-mbbs-filters";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = parseIndiaMbbsFilters(url.searchParams);
  const page = parseIndiaMbbsPage(url.searchParams.get("page") ?? undefined);
  const results = await queryIndiaMbbsCollegesPage(filters, page, 12);

  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
