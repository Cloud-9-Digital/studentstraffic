import { NextResponse, type NextRequest } from "next/server";

import { getCourseDirectoryEntries } from "@/lib/course-directory";

const pageSize = 24;

export async function GET(request: NextRequest) {
  const requestedOffset = Number(request.nextUrl.searchParams.get("offset") ?? 0);
  const offset = Number.isFinite(requestedOffset)
    ? Math.max(0, Math.floor(requestedOffset))
    : 0;
  const entries = await getCourseDirectoryEntries();

  return NextResponse.json(
    {
      entries: entries.slice(offset, offset + pageSize),
      total: entries.length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
