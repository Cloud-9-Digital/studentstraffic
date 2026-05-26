import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { studentPeers, universities } from "@/lib/db/schema";
import { PeerEditForm } from "@/components/dashboard/peer-edit-form";

export default async function PeerEditPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const db = getDb();
  if (!db) return <p className="text-sm text-[#6b7280]">Service temporarily unavailable.</p>;

  const [peer] = await db
    .select({
      id: studentPeers.id,
      fullName: studentPeers.fullName,
      photoUrl: studentPeers.photoUrl,
      courseName: studentPeers.courseName,
      currentYearOrBatch: studentPeers.currentYearOrBatch,
      homeState: studentPeers.homeState,
      homeCity: studentPeers.homeCity,
      languages: studentPeers.languages,
      universityName: universities.name,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(eq(studentPeers.peerUserId, session.user.id))
    .limit(1);

  if (!peer) redirect("/join");

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1f1c]">Edit profile</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Update the details shown to students on your guide profile.</p>
      </div>
      <PeerEditForm peer={peer} />
    </div>
  );
}
