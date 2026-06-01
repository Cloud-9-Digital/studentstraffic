import { redirect } from "next/navigation";
import Link from "next/link";
import {
  and,
  count,
  desc,
  eq,
} from "drizzle-orm";

import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Globe,
  GraduationCap,
  Inbox,
  MapPin,
  MessageCircle,
  PhoneCall,
  UserCog,
  Users,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { openGuideConversationFromBookingAction } from "@/app/_actions/guide-chat";
import { FormSubmitButton } from "@/components/dashboard/chat/form-submit-button";
import { getDb } from "@/lib/db/server";
import { resolveDbUserId } from "@/lib/server-session";
import {
  countries,
  peerCallBookings,
  peerRequests,
  studentPeerApplications,
  studentPeers,
  universities,
  users,
} from "@/lib/db/schema";
import { PeerStartCallButton } from "./requests/peer-start-call-button";

export const metadata = { title: "Guide Overview | Dashboard" };

const AVATAR_COLORS = [
  "bg-[#0f3d37] text-white",
  "bg-[#c2410c] text-white",
  "bg-violet-600 text-white",
  "bg-sky-600 text-white",
  "bg-emerald-600 text-white",
];

function StudentInitials({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${color}`}>
      {initials}
    </div>
  );
}

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
      .select({
        id: studentPeerApplications.id,
        status: studentPeerApplications.status,
        universityName: universities.name,
        createdAt: studentPeerApplications.createdAt,
      })
      .from(studentPeerApplications)
      .innerJoin(universities, eq(studentPeerApplications.universityId, universities.id))
      .where(eq(studentPeerApplications.peerUserId, userId))
      .limit(1);

    if (pendingApp) return <PendingScreen app={pendingApp} />;
    redirect("/join");
  }

  const [[totalResult], [pendingBookingsResult], recentStudents, acceptedBookings] = await Promise.all([
    db.select({ total: count() }).from(peerRequests).where(eq(peerRequests.matchedPeerId, peer.id)),
    db
      .select({ total: count() })
      .from(peerCallBookings)
      .where(and(eq(peerCallBookings.peerId, peer.id), eq(peerCallBookings.status, "pending"))),
    db
      .select({
        id: peerRequests.id,
        fullName: peerRequests.fullName,
        userState: peerRequests.userState,
        userCity: peerRequests.userCity,
        createdAt: peerRequests.createdAt,
      })
      .from(peerRequests)
      .where(eq(peerRequests.matchedPeerId, peer.id))
      .orderBy(desc(peerRequests.createdAt))
      .limit(4),
    db
      .select({
        bookingId: peerCallBookings.id,
        studentName: users.name,
        studentEmail: users.email,
      })
      .from(peerCallBookings)
      .innerJoin(users, eq(peerCallBookings.studentUserId, users.id))
      .where(and(eq(peerCallBookings.peerId, peer.id), eq(peerCallBookings.status, "accepted")))
      .orderBy(desc(peerCallBookings.createdAt))
      .limit(5),
  ]);

  const totalConnections = totalResult?.total ?? 0;
  const pendingCount = pendingBookingsResult?.total ?? 0;

  const initials = peer.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const tags = [
    peer.countryName && { icon: Globe, label: peer.countryName },
    peer.courseName && { icon: GraduationCap, label: peer.courseName },
    peer.currentYearOrBatch && { icon: null, label: peer.currentYearOrBatch },
    (peer.homeCity || peer.homeState) && {
      icon: MapPin,
      label: peer.homeCity ? `${peer.homeCity}, ${peer.homeState}` : peer.homeState!,
    },
    ...(peer.languages?.slice(0, 1).map((l) => ({ icon: MessageCircle, label: l })) ?? []),
  ].filter(Boolean) as { icon: React.ElementType | null; label: string }[];

  return (
    <div className="space-y-7 pb-8">

      {/* Profile header — flat, no card */}
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#0f3d37] text-xl font-bold text-white overflow-hidden">
          {peer.photoUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={peer.photoUrl} alt={peer.fullName} className="size-14 object-cover" />
            : initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-[#0f1f1c] leading-tight">{peer.fullName}</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle className="size-3" /> Live
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[#6b7280]">{peer.universityName}</p>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2.5 py-0.5 text-[11px] font-medium text-[#6b7280]"
                >
                  {t.icon && <t.icon className="size-3" />}
                  {t.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link
          href="/dashboard/peer/edit"
          className="shrink-0 flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-[#f9fafb] transition"
        >
          <UserCog className="size-3.5" /> Edit
        </Link>
      </div>

      {/* Accepted bookings — ready to call */}
      {acceptedBookings.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">Ready to call</p>
          <div className="divide-y divide-[#eaeaea]">
            {acceptedBookings.map((b) => {
              const displayName = b.studentName ?? b.studentEmail.split("@")[0];
              return (
                <div key={b.bookingId} className="flex items-center gap-3 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {displayName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0f1f1c]">{displayName}</p>
                    <p className="text-xs text-emerald-600">Accepted your request</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={openGuideConversationFromBookingAction}>
                      <input type="hidden" name="bookingId" value={b.bookingId} />
                      <input type="hidden" name="redirectPath" value="/dashboard/peer/messages" />
                      <FormSubmitButton
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3 py-2 text-xs font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                        pendingLabel="Opening…"
                      >
                        <MessageCircle className="size-3.5" />
                        Message
                      </FormSubmitButton>
                    </form>
                    <PeerStartCallButton
                      bookingId={b.bookingId}
                      studentName={displayName}
                      universityName={peer.universityName}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending requests alert */}
      {pendingCount > 0 && (
        <Link
          href="/dashboard/peer/requests"
          className="flex items-center gap-4 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 transition hover:border-amber-300 active:scale-[0.99]"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Inbox className="size-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900">
              {pendingCount === 1 ? "1 student waiting" : `${pendingCount} students waiting`}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">Accept or decline their call request</p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-amber-400" />
        </Link>
      )}

      {/* Stats — full-bleed */}
      <div className="-mx-6 lg:-mx-8 border-y border-[#eaeaea]">
        <div className="flex divide-x divide-[#eaeaea]">
          <Link
            href="/dashboard/peer/students"
            className="flex-1 px-6 py-5 lg:px-8 transition active:bg-[#f5f5f5]"
          >
            <Users className="size-4 text-[#9ca3af] mb-2" />
            <p className="text-3xl font-bold tabular-nums text-[#0f1f1c]">{totalConnections}</p>
            <p className="mt-0.5 text-sm text-[#6b7280]">Total students</p>
          </Link>
          <Link
            href="/dashboard/peer/requests"
            className="flex-1 px-6 py-5 lg:px-8 transition active:bg-[#f5f5f5]"
          >
            <Inbox className="size-4 text-[#9ca3af] mb-2" />
            <p className={`text-3xl font-bold tabular-nums mt-0 ${pendingCount > 0 ? "text-amber-600" : "text-[#0f1f1c]"}`}>
              {pendingCount}
            </p>
            <p className="mt-0.5 text-sm text-[#6b7280]">Pending requests</p>
          </Link>
        </div>
      </div>

      {/* Recent students */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">Recent students</p>
          {totalConnections > 4 && (
            <Link href="/dashboard/peer/students" className="flex items-center gap-1 text-xs font-medium text-[#0f3d37] hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          )}
        </div>

        {recentStudents.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="mx-auto size-8 text-[#d1d5db] mb-3" />
            <p className="text-sm font-medium text-[#374151]">No students yet</p>
            <p className="mt-1 text-xs text-[#9ca3af]">When students browse your university and contact you, they appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eaeaea]">
            {recentStudents.map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-3.5">
                <StudentInitials name={s.fullName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0f1f1c]">{s.fullName}</p>
                  {(s.userCity || s.userState) && (
                    <p className="text-xs text-[#9ca3af]">
                      {s.userCity ? `${s.userCity}, ${s.userState}` : s.userState}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-[11px] text-[#9ca3af]">
                  {s.createdAt?.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) ?? "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">Quick actions</p>
        <div className="-mx-6 lg:-mx-8 divide-y divide-[#eaeaea] border-y border-[#eaeaea]">
          {[
            { href: "/dashboard/peer/messages", icon: MessageCircle, label: "Messages",       color: "bg-emerald-50 text-emerald-600", badge: null },
            { href: "/dashboard/peer/requests", icon: Inbox,         label: "Call Requests",  color: "bg-amber-50 text-amber-600",    badge: pendingCount > 0 ? String(pendingCount) : null },
            { href: "/dashboard/peer/students", icon: Users,         label: "My Students",    color: "bg-[#f0f7f5] text-[#0f3d37]",  badge: null },
            { href: "/dashboard/calls",         icon: PhoneCall,     label: "My Calls",       color: "bg-blue-50 text-blue-600",      badge: null },
            { href: "/dashboard/peer/edit",     icon: UserCog,       label: "Edit Profile",   color: "bg-[#f3f4f6] text-[#6b7280]",  badge: null },
          ].map(({ href, icon: Icon, label, color, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-6 py-4 lg:px-8 transition active:bg-[#f5f5f5]"
            >
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="size-4" />
              </div>
              <span className="flex-1 text-sm font-semibold text-[#0f1f1c]">{label}</span>
              {badge && (
                <span className="flex size-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                  {badge}
                </span>
              )}
              <ChevronRight className="size-4 shrink-0 text-[#c9c9c9]" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

function PendingScreen({
  app,
}: {
  app: { id: number; status: string; createdAt: Date | null; universityName: string };
}) {
  const isRejected = app.status === "rejected";
  return (
    <div className="space-y-5 pb-8">
      <h1 className="text-2xl font-bold text-[#0f1f1c]">Guide Application</h1>
      <div className={`rounded-2xl border p-5 ${isRejected ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
        <div className="flex items-start gap-4">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${isRejected ? "bg-red-100" : "bg-amber-100"}`}>
            <Clock className={`size-5 ${isRejected ? "text-red-600" : "text-amber-600"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${isRejected ? "text-red-900" : "text-amber-900"}`}>
              {isRejected ? "Application not approved" : "Under review"}
            </p>
            <p className={`mt-1 text-sm ${isRejected ? "text-red-800" : "text-amber-800"}`}>
              {isRejected
                ? "Your application was not approved. Apply again with a clearer college ID."
                : "We're reviewing your application and will email you once approved."}
            </p>
            <p className={`mt-2 text-xs ${isRejected ? "text-red-700" : "text-amber-700"}`}>
              {app.universityName}
              {app.createdAt && (
                <> · Applied {app.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</>
              )}
            </p>
          </div>
        </div>
      </div>
      {isRejected && (
        <Link
          href="/join"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f3d37] px-5 py-3 text-sm font-semibold text-white hover:bg-[#184a43] transition"
        >
          Apply again <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
