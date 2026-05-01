import { NextResponse, type NextRequest } from "next/server";

import { finderPageSize } from "@/lib/constants";
import { queryFinderCardProgramsPage } from "@/lib/data/catalog";
import { parseFinderFilters, parseFinderPage } from "@/lib/filters";
import { logPublicRouteRequest } from "@/lib/route-observability";

const finderApiCacheControl =
  "public, max-age=0, s-maxage=600, stale-while-revalidate=86400";

export async function GET(request: NextRequest) {
  logPublicRouteRequest({
    route: "api/finder",
    request,
    sampleRate: 0.02,
  });

  const filters = parseFinderFilters(request.nextUrl.searchParams);
  const page = parseFinderPage(
    request.nextUrl.searchParams.get("page") ?? undefined,
  );
  const results = await queryFinderCardProgramsPage(filters, page, finderPageSize);

  return NextResponse.json(results, {
    headers: {
      "Cache-Control": finderApiCacheControl,
    },
  });
}
