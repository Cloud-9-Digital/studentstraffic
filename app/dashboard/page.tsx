import Link from "next/link";
import { count, eq } from "drizzle-orm";
import {
  ArrowRight,
  BookmarkCheck,
  FileText,
  GraduationCap,
  PhoneCall,
  Star,
  Clock,
  CheckCircle,
  Inbox,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { resolveDbUserId } from "@/lib/server-session";
import {
  applications,
  peerCallBookings,
  studentPeerApplications,
  studentPeers,
  universities,
  userShortlists,
} from "@/lib/db/schema";

export const metadata = { title: "Dashboard | Students Traffic" };

function greeting(name: string) {
  const h = new Date().getHours();
  const time = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${time}, ${name}`;
}

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  let shortlistCount = 0;
  let applicationCount = 0;
  let bookings: {
    id: number;
    status: string;
    peerName: string;
    universityName: string;
    universitySlug: string;
  }[] = [];
  let peerKind: "active" | "pending" | "rejected" | "none" = "none";

  const db = getDb();
  if (db && session?.user?.email) {
    const userId = await resolveDbUserId(session.user.email);

    if (userId) {
      const [shortlistResult, applicationResult, peerResult, pendingAppResult, bookingRows] =
        await Promise.all([
          db.select({ total: count() }).from(userShortlists).where(eq(userShortlists.userId, userId)),
          db.select({ total: count() }).from(applications).where(eq(applications.userId, userId)),
          db
            .select({ id: studentPeers.id })
            .from(studentPeers)
            .where(eq(studentPeers.peerUserId, userId))
            .limit(1),
          db
            .select({ status: studentPeerApplications.status })
            .from(studentPeerApplications)
            .where(eq(studentPeerApplications.peerUserId, userId))
            .limit(1),
          db
            .select({
              id: peerCallBookings.id,
              status: peerCallBookings.status,
              peerName: studentPeers.fullName,
              universityName: universities.name,
              universitySlug: universities.slug,
            })
            .from(peerCallBookings)
            .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
            .innerJoin(universities, eq(studentPeers.universityId, universities.id))
            .where(eq(peerCallBookings.studentUserId, userId))
            .orderBy(peerCallBookings.createdAt)
            .limit(3),
        ]);

      shortlistCount = shortlistResult[0]?.total ?? 0;
      applicationCount = applicationResult[0]?.total ?? 0;
      bookings = bookingRows;

      if (peerResult[0]) {
        peerKind = "active";
      } else if (pendingAppResult[0]) {
        peerKind = pendingAppResult[0].status === "rejected" ? "rejected" : "pending";
      }
    }
  }

  const acceptedBookings = bookings.filter((b) => b.status === "accepted" || b.status === "active");
  const hasCallReady = acceptedBookings.length > 0;

  return (
    <div className="space-y-6 pb-8">

      {/* Greeting */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-[#0f1f1c]">{greeting(firstName)}</h1>
        <p className="mt-0.5 text-sm text-[#6b7280]">Here&apos;s your journey at a glance.</p>
      </div>

      {/* Call-ready alert — most urgent action */}
      {hasCallReady && (
        <Link
          href="/dashboard/calls"
          className="flex items-center gap-4 rounded-2xl bg-[#0f3d37] px-5 py-4 shadow-md transition hover:bg-[#184a43] active:scale-[0.98]"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/20">
            <PhoneCall className="size-5 text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">
              {acceptedBookings.length === 1
                ? `${acceptedBookings[0].peerName.split(" ")[0]} is ready to chat`
                : `${acceptedBookings.length} guides ready for a call`}
            </p>
            <p className="text-xs text-emerald-300 mt-0.5">Tap to start your call</p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-emerald-400" />
        </Link>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/shortlists"
          className="group flex flex-col gap-1 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm transition hover:border-[#0f3d37]/30 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <BookmarkCheck className="size-4 text-[#9ca3af]" />
            <ArrowRight className="size-3.5 text-[#d1d5db] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0f3d37]" />
          </div>
          <p className="text-3xl font-bold text-[#0f1f1c] mt-1">{shortlistCount}</p>
          <p className="text-xs text-[#6b7280]">Shortlisted</p>
        </Link>

        <Link
          href="/dashboard/applications"
          className="group flex flex-col gap-1 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm transition hover:border-[#0f3d37]/30 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <FileText className="size-4 text-[#9ca3af]" />
            <ArrowRight className="size-3.5 text-[#d1d5db] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0f3d37]" />
          </div>
          <p className="text-3xl font-bold text-[#0f1f1c] mt-1">{applicationCount}</p>
          <p className="text-xs text-[#6b7280]">Applications</p>
        </Link>
      </div>

      {/* My guides */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">My Guides</p>
          {bookings.length > 0 && (
            <Link href="/dashboard/calls" className="flex items-center gap-1 text-xs font-medium text-[#0f3d37] hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          )}
        </div>

        {bookings.length === 0 ? (
          <Link
            href="/universities"
            className="group flex items-center gap-4 rounded-2xl border border-dashed border-[#e5e7eb] bg-white px-5 py-5 transition hover:border-[#0f3d37]/40 active:scale-[0.98]"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f0f7f5]">
              <PhoneCall className="size-5 text-[#0f3d37]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#374151]">Talk to a student guide</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">Get first-hand advice from someone who&apos;s been there.</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-[#d1d5db] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0f3d37]" />
          </Link>
        ) : (
          <div className="divide-y divide-[#f3f4f6] rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden shadow-sm">
            {bookings.map((b) => {
              const isAccepted = b.status === "accepted" || b.status === "active";
              const isPending = b.status === "pending";
              return (
                <Link
                  key={b.id}
                  href="/dashboard/calls"
                  className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-[#fafafa] active:bg-[#f3f4f6]"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0f7f5] text-xs font-bold text-[#0f3d37]">
                    {b.peerName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0f1f1c]">{b.peerName}</p>
                    <p className="truncate text-xs text-[#9ca3af]">{b.universityName}</p>
                  </div>
                  {isAccepted ? (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle className="size-3" /> Ready
                    </span>
                  ) : isPending ? (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <Clock className="size-3" /> Pending
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-[#9ca3af]">Declined</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Guide profile section */}
      {peerKind === "active" && (
        <Link
          href="/dashboard/peer"
          className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm transition hover:border-emerald-300 active:scale-[0.98]"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="size-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0f1f1c]">Your guide profile is live</p>
            <p className="text-xs text-emerald-700 mt-0.5">Manage requests and connect with students</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-emerald-400" />
        </Link>
      )}

      {peerKind === "pending" && (
        <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Clock className="size-5 text-amber-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0f1f1c]">Guide application under review</p>
            <p className="text-xs text-amber-700 mt-0.5">We&apos;ll email you once approved</p>
          </div>
        </div>
      )}

      {peerKind === "none" && (
        <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-white px-5 py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f0f7f5]">
              <Star className="size-5 text-[#0f3d37]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0f1f1c]">Become a student guide</p>
              <p className="text-xs text-[#6b7280] mt-0.5">
                Studying abroad? Help other students by sharing your experience.
              </p>
            </div>
            <Link
              href="/join"
              className="shrink-0 rounded-xl border border-[#0f3d37] px-3.5 py-2 text-xs font-semibold text-[#0f3d37] hover:bg-[#0f3d37] hover:text-white transition"
            >
              Join
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Quick actions</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/universities",            icon: GraduationCap, label: "Browse universities", color: "bg-[#f0f7f5] text-[#0f3d37]" },
            { href: "/dashboard/calls",         icon: PhoneCall,      label: "My Calls",            color: "bg-blue-50 text-blue-600"    },
            { href: "/dashboard/shortlists",    icon: BookmarkCheck,  label: "Shortlists",          color: "bg-orange-50 text-orange-600" },
            { href: "/dashboard/applications",  icon: FileText,       label: "Applications",        color: "bg-purple-50 text-purple-600" },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 shadow-sm transition hover:border-[#0f3d37]/20 hover:shadow-md active:scale-[0.98]"
            >
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="size-4" />
              </div>
              <p className="text-sm font-semibold text-[#0f1f1c] leading-tight">{label}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
