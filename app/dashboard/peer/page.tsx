import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  Globe,
  GraduationCap,
  MapPin,
  MessageCircle,
  ArrowRight,
  Users,
} from "lucide-react";
import { desc, eq, count } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import {
  countries,
  peerRequests,
  studentPeerApplications,
  studentPeers,
  universities,
} from "@/lib/db/schema";

import { resolveDbUserId } from "@/lib/server-session";

export default async function PeerOverviewPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const db = getDb();
  if (!db) return <p className="text-sm text-[#6b7280]">Service temporarily unavailable.</p>;

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) redirect("/login");

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
      universitySlug: universities.slug,
      countryName: countries.name,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(countries, eq(studentPeers.countryId, countries.id))
    .where(eq(studentPeers.peerUserId, userId))
    .limit(1);

  if (!peer) {
    const [pendingApp] = await db
      .select({ id: studentPeerApplications.id, status: studentPeerApplications.status, universityName: universities.name, createdAt: studentPeerApplications.createdAt, fullName: studentPeerApplications.fullName })
      .from(studentPeerApplications)
      .innerJoin(universities, eq(studentPeerApplications.universityId, universities.id))
      .where(eq(studentPeerApplications.peerUserId, userId))
      .limit(1);

    if (pendingApp) return <PendingScreen app={pendingApp} />;
    redirect("/join");
  }

  const [[totalResult], recentConnections] = await Promise.all([
    db.select({ count: count() }).from(peerRequests).where(eq(peerRequests.matchedPeerId, peer.id)),
    db
      .select({ id: peerRequests.id, fullName: peerRequests.fullName, userState: peerRequests.userState, createdAt: peerRequests.createdAt })
      .from(peerRequests)
      .where(eq(peerRequests.matchedPeerId, peer.id))
      .orderBy(desc(peerRequests.createdAt))
      .limit(5),
  ]);

  const totalConnections = totalResult?.count ?? 0;

  const thisMonth = recentConnections.filter((c) => {
    if (!c.createdAt) return false;
    const now = new Date();
    return c.createdAt.getMonth() === now.getMonth() && c.createdAt.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#f3f4f6]">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#0f3d37] text-xl font-bold text-white overflow-hidden">
            {peer.photoUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={peer.photoUrl} alt={peer.fullName} className="size-14 object-cover" />
              : peer.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[#0f1f1c]">{peer.fullName}</h1>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <CheckCircle className="size-3" /> Live
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[#6b7280]">{peer.universityName}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {peer.countryName && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  <Globe className="size-3" /> {peer.countryName}
                </span>
              )}
              {peer.courseName && (
                <span className="flex items-center gap-1 rounded-full bg-[#f0faf7] px-2.5 py-0.5 text-xs font-medium text-[#155e53]">
                  <GraduationCap className="size-3" /> {peer.courseName}
                </span>
              )}
              {peer.currentYearOrBatch && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {peer.currentYearOrBatch}
                </span>
              )}
              {peer.homeState && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  <MapPin className="size-3" />
                  {peer.homeCity ? `${peer.homeCity}, ${peer.homeState}` : peer.homeState}
                </span>
              )}
              {peer.languages?.slice(0, 2).map((lang) => (
                <span key={lang} className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  <MessageCircle className="size-3" /> {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Link
          href="/dashboard/peer/edit"
          className="self-start sm:self-auto shrink-0 rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition"
        >
          Edit profile
        </Link>
      </div>

      {/* Stats + Recent students — two-column on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Stats column */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Activity</h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="rounded-xl border border-[#e5e7eb] bg-white px-5 py-4">
              <p className="text-3xl font-bold text-[#0f1f1c]">{totalConnections}</p>
              <p className="mt-0.5 text-sm text-[#6b7280]">Total students</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-white px-5 py-4">
              <p className="text-3xl font-bold text-[#0f1f1c]">{thisMonth}</p>
              <p className="mt-0.5 text-sm text-[#6b7280]">This month</p>
            </div>
          </div>
        </div>

        {/* Recent students column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Recent students</h2>
            {totalConnections > 5 && (
              <Link href="/dashboard/peer/students" className="flex items-center gap-1 text-xs font-medium text-[#0f3d37] hover:underline">
                View all <ArrowRight className="size-3" />
              </Link>
            )}
          </div>

          {recentConnections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white py-12 text-center">
              <Users className="mx-auto size-7 text-[#d1d5db] mb-3" />
              <p className="text-sm text-[#374151]">No students yet</p>
              <p className="mt-1 text-xs text-[#9ca3af]">When students contact you, they will appear here.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">State</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#6b7280]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {recentConnections.map((c) => (
                    <tr key={c.id} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3 font-medium text-[#0f1f1c]">{c.fullName}</td>
                      <td className="px-4 py-3 text-[#6b7280]">{c.userState ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-[#9ca3af]">
                        {c.createdAt?.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalConnections > 5 && (
                <div className="border-t border-[#f3f4f6] px-4 py-3">
                  <Link
                    href="/dashboard/peer/students"
                    className="flex items-center gap-1 text-xs font-medium text-[#0f3d37] hover:underline"
                  >
                    View all {totalConnections} students <ArrowRight className="size-3" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PendingScreen({ app }: { app: { id: number; fullName: string; status: string; createdAt: Date | null; universityName: string } }) {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-[#0f1f1c]">Your guide application</h1>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Clock className="size-4 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-900">
              {app.status === "rejected" ? "Application not approved" : "Under review"}
            </p>
            <p className="mt-1 text-sm text-amber-800">
              {app.status === "rejected"
                ? "Your application was not approved. You can apply again with a clearer college ID."
                : "We are reviewing your application. We will email you once it is approved."}
            </p>
            <div className="mt-3 space-y-1 text-sm text-amber-700">
              <p><span className="font-medium">University:</span> {app.universityName}</p>
              {app.createdAt && (
                <p><span className="font-medium">Applied:</span> {app.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {app.status === "rejected" && (
        <Link href="/join" className="inline-flex items-center gap-2 rounded-lg bg-[#0f3d37] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#184a43] transition">
          Apply again
        </Link>
      )}
    </div>
  );
}
