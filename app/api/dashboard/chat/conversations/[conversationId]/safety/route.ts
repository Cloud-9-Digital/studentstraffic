import { NextResponse } from "next/server";
import { requireDashboardRequestUserId } from "@/app/api/dashboard/chat/_lib";
import { handlePeerSafetyRequest } from "@/lib/peer-safety-request";
export async function POST(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const userId = await requireDashboardRequestUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const id = Number((await params).conversationId);
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: "Invalid conversation." }, { status: 422 });
  const result = await handlePeerSafetyRequest(id, userId, await request.json().catch(() => null));
  return NextResponse.json(result, { status: result.error ? 422 : 200 });
}
