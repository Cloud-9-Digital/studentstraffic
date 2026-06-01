import { NextResponse } from "next/server";

import { requireDashboardRequestUserId } from "@/app/api/dashboard/chat/_lib";
import { createGuideChatTokenRequest } from "@/lib/realtime/ably";

export async function GET() {
  const userId = await requireDashboardRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokenRequest = await createGuideChatTokenRequest(userId);
  if (!tokenRequest) {
    return NextResponse.json({ error: "Realtime unavailable" }, { status: 503 });
  }

  return NextResponse.json(tokenRequest);
}
