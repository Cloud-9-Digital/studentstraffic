import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { peerRequests, studentPeers } from "@/lib/db/schema";
import { resolveDbUserId } from "@/lib/server-session";

export default async function PeerStudentsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const db = getDb();
  if (!db) return <p className="text-sm text-[#6b7280]">Service temporarily unavailable.</p>;

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) redirect("/login");

  const [peer] = await db
    .select({ id: studentPeers.id })
    .from(studentPeers)
    .where(eq(studentPeers.peerUserId, userId))
    .limit(1);

  if (!peer) redirect("/join");

  const students = await db
    .select({
      id: peerRequests.id,
      fullName: peerRequests.fullName,
      email: peerRequests.email,
      userState: peerRequests.userState,
      userCity: peerRequests.userCity,
      courseInterest: peerRequests.courseInterest,
      createdAt: peerRequests.createdAt,
    })
    .from(peerRequests)
    .where(eq(peerRequests.matchedPeerId, peer.id))
    .orderBy(desc(peerRequests.createdAt));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1f1c]">My Students</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          {students.length === 0
            ? "No students have contacted you yet."
            : `${students.length} student${students.length === 1 ? "" : "s"} have contacted you.`}
        </p>
      </div>

      {students.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
          <Users className="mx-auto size-8 text-[#d1d5db] mb-3" />
          <p className="text-sm font-medium text-[#374151]">No students yet</p>
          <p className="mt-1 text-xs text-[#9ca3af]">When students contact you, they will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Course interest</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 font-medium text-[#0f1f1c] whitespace-nowrap">{s.fullName}</td>
                  <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">
                    {s.userCity ? `${s.userCity}, ${s.userState}` : s.userState}
                  </td>
                  <td className="px-4 py-3 text-[#6b7280]">{s.courseInterest ?? "—"}</td>
                  <td className="px-4 py-3 text-[#6b7280]">
                    {s.email
                      ? <a href={`mailto:${s.email}`} className="hover:text-[#0f3d37] hover:underline">{s.email}</a>
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af] whitespace-nowrap">
                    {s.createdAt?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
