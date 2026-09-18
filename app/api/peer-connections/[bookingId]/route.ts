import { NextResponse } from "next/server";
import { requireDashboardRequestUserId } from "@/app/api/dashboard/chat/_lib";
import { requireMobileSession } from "@/lib/mobile/auth";
import { changePeerConnection, connectionOperations, type ConnectionOperation } from "@/lib/peer-connections";
export async function POST(request: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  const userId = request.headers.has("authorization") ? (await requireMobileSession(request))?.user.id : await requireDashboardRequestUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const bookingId = Number((await params).bookingId);
  const body = await request.json().catch(() => null);
  if (!Number.isSafeInteger(bookingId) || bookingId < 1 || !connectionOperations.includes(body?.operation)) return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  const result = await changePeerConnection(bookingId, userId, body.operation as ConnectionOperation);
  return NextResponse.json(result, { status: result.error ? 409 : 200 });
}
