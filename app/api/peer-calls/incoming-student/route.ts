import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getIncomingStudentCalls } from "@/lib/peer-calls";
import { resolveDbUserId } from "@/lib/server-session";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const calls = await getIncomingStudentCalls(userId);
  return NextResponse.json({ calls });
}
