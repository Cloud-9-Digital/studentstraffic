import { NextRequest, NextResponse } from "next/server";

import { logPublicRouteRequest } from "@/lib/route-observability";
import {
  searchCatalogSuggestions,
  type Suggestion,
} from "@/lib/search/suggestions";

export type { Suggestion } from "@/lib/search/suggestions";

export async function GET(req: NextRequest) {
  logPublicRouteRequest({
    route: "api/suggestions",
    request: req,
    sampleRate: 0.05,
  });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json<Suggestion[]>([]);
  }

  return NextResponse.json<Suggestion[]>(await searchCatalogSuggestions(q), {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
