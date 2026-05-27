import { eq } from "drizzle-orm";
import { PhoneCall } from "lucide-react";

import { auth } from "@/lib/auth";
import { resolveDbUserId } from "@/lib/server-session";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallBookings, studentPeers, universities, users } from "@/lib/db/schema";
import { BookedCallsList } from "@/components/dashboard/booked-calls-list";

export const metadata = { title: "My Calls | Dashboard" };

export default async function MyCallsPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const db = getDb();
  if (!db) return null;

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) return null;

  const bookedPeers = await db
    .select({
      bookingId: peerCallBookings.id,
      peerId: studentPeers.id,
      fullName: studentPeers.fullName,
      courseName: studentPeers.courseName,
      currentYearOrBatch: studentPeers.currentYearOrBatch,
      universityName: universities.name,
      universitySlug: universities.slug,
      canReceiveCalls: users.id,
      bookedAt: peerCallBookings.createdAt,
    })
    .from(peerCallBookings)
    .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(users, eq(studentPeers.peerUserId, users.id))
    .where(eq(peerCallBookings.studentUserId, userId))
    .orderBy(peerCallBookings.createdAt);

  const peers = bookedPeers.map((row) => ({
    bookingId: row.bookingId,
    peerId: row.peerId,
    fullName: row.fullName,
    courseName: row.courseName,
    currentYearOrBatch: row.currentYearOrBatch,
    universityName: row.universityName,
    universitySlug: row.universitySlug,
    canReceiveCalls: row.canReceiveCalls !== null,
  }));

  const voiceEnabled = env.hasAgoraVoice;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1f1c]">My Calls</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Guides you&apos;ve booked a call with. Start a call when you&apos;re ready to connect.
        </p>
      </div>

      {peers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#e5e7eb] bg-white px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#f0f7f5]">
            <PhoneCall className="size-5 text-[#0f3d37]" />
          </div>
          <p className="text-sm font-semibold text-[#374151]">No calls booked yet</p>
          <p className="text-xs text-[#9ca3af]">
            Browse student guides and book a call to chat with someone who has been through it.
          </p>
        </div>
      ) : (
        <BookedCallsList peers={peers} voiceEnabled={voiceEnabled} />
      )}
    </div>
  );
}
