import Link from "next/link";
import { eq, count, and, sql } from "drizzle-orm";
import {
  BookmarkCheck,
  FileText,
  GraduationCap,
  ArrowRight,
  Clock,
  Users,
  CheckCircle,
  Star,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { StartPeerCallCard } from "@/components/dashboard/start-peer-call-card";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import {
  applications,
  peerRequests,
  studentPeerApplications,
  studentPeers,
  universities,
  userShortlists,
} from "@/lib/db/schema";

const quickLinks = [
  { label: "Browse universities", description: "Explore 1,000+ programs across 15+ countries", href: "/universities", icon: GraduationCap },
  { label: "View my shortlists",  description: "See universities you've saved for later",       href: "/dashboard/shortlists", icon: BookmarkCheck },
  { label: "My applications",     description: "Track the status of all your applications",      href: "/dashboard/applications", icon: FileText },
];

type PeerStatus =
  | { kind: "active"; peerName: string; universityName: string; connectionCount: number; peerId: number }
  | { kind: "pending"; universityName: string }
  | { kind: "rejected" }
  | { kind: "none" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ peer?: string }>;
}) {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const { peer: requestedPeerId } = await searchParams;

  let shortlistCount = 0;
  let applicationCount = 0;
  let peerStatus: PeerStatus = { kind: "none" };
  let selectedPeerForCall:
    | {
        id: number;
        fullName: string;
        universityName: string;
        universitySlug: string;
        courseName: string | null;
        currentYearOrBatch: string | null;
        canReceiveCalls: boolean;
      }
    | null = null;

  const db = getDb();
  if (db && session?.user?.id) {
    const userId = session.user.id;

    const [shortlistResult, applicationResult, peerResult, pendingAppResult] =
      await Promise.all([
        db.select({ count: count() }).from(userShortlists).where(eq(userShortlists.userId, userId)),
        db.select({ count: count() }).from(applications).where(eq(applications.userId, userId)),
        db
          .select({
            id: studentPeers.id,
            fullName: studentPeers.fullName,
            universityName: universities.name,
          })
          .from(studentPeers)
          .innerJoin(universities, eq(studentPeers.universityId, universities.id))
          .where(eq(studentPeers.peerUserId, userId))
          .limit(1),
        db
          .select({
            status: studentPeerApplications.status,
            universityName: universities.name,
          })
          .from(studentPeerApplications)
          .innerJoin(universities, eq(studentPeerApplications.universityId, universities.id))
          .where(eq(studentPeerApplications.peerUserId, userId))
          .limit(1),
      ]);

    shortlistCount = shortlistResult[0]?.count ?? 0;
    applicationCount = applicationResult[0]?.count ?? 0;

    const peer = peerResult[0];
    if (peer) {
      const [connectionResult] = await db
        .select({ count: count() })
        .from(peerRequests)
        .where(eq(peerRequests.matchedPeerId, peer.id));

      peerStatus = {
        kind: "active",
        peerName: peer.fullName,
        universityName: peer.universityName,
        connectionCount: connectionResult?.count ?? 0,
        peerId: peer.id,
      };
    } else if (pendingAppResult[0]) {
      const app = pendingAppResult[0];
      peerStatus =
        app.status === "rejected"
          ? { kind: "rejected" }
          : { kind: "pending", universityName: app.universityName };
    }

    if (env.hasAgoraVoice && requestedPeerId && /^\d+$/.test(requestedPeerId)) {
      const [peerCandidate] = await db
        .select({
          id: studentPeers.id,
          fullName: studentPeers.fullName,
          courseName: studentPeers.courseName,
          currentYearOrBatch: studentPeers.currentYearOrBatch,
          universityName: universities.name,
          universitySlug: universities.slug,
          canReceiveCalls: sql<boolean>`${studentPeers.peerUserId} is not null`.mapWith(Boolean),
        })
        .from(studentPeers)
        .innerJoin(universities, eq(studentPeers.universityId, universities.id))
        .where(
          and(
            eq(studentPeers.id, Number(requestedPeerId)),
            eq(studentPeers.status, "active")
          )
        )
        .limit(1);

      selectedPeerForCall = peerCandidate ?? null;
    }
  }

  const stats = [
    { label: "Shortlisted universities", value: String(shortlistCount), icon: BookmarkCheck, href: "/dashboard/shortlists", color: "bg-blue-50 text-blue-600" },
    { label: "Applications",             value: String(applicationCount), icon: FileText,       href: "/dashboard/applications", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f1f1c]">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Here&apos;s an overview of your journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition hover:border-[#0f3d37]/30 hover:shadow-md"
          >
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
              <Icon className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f1f1c]">{value}</p>
              <p className="text-sm text-[#6b7280]">{label}</p>
            </div>
            <ArrowRight className="ml-auto size-4 text-[#d1d5db] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0f3d37]" />
          </Link>
        ))}
      </div>

      {/* Guide profile section — conditional */}
      <PeerSection status={peerStatus} />

      {selectedPeerForCall ? <StartPeerCallCard peer={selectedPeerForCall} /> : null}

      {/* Recent activity */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-[#0f1f1c]">Recent activity</h2>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#f3f4f6]">
            <Clock className="size-5 text-[#9ca3af]" />
          </div>
          <p className="text-sm font-medium text-[#374151]">No activity yet</p>
          <p className="text-xs text-[#9ca3af]">Start by exploring universities and shortlisting your favourites.</p>
          <Link
            href="/universities"
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#0f3d37] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#184a43]"
          >
            Browse universities
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#0f1f1c]">Quick links</h2>
        <div className="space-y-2">
          {quickLinks.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-5 py-4 shadow-sm transition hover:border-[#0f3d37]/30 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f5]">
                <Icon className="size-5 text-[#0f3d37]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0f1f1c]">{label}</p>
                <p className="text-xs text-[#6b7280]">{description}</p>
              </div>
              <ArrowRight className="ml-auto size-4 shrink-0 text-[#d1d5db] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0f3d37]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Guide profile card ────────────────────────────────────────────────────────

function PeerSection({ status }: { status: PeerStatus }) {
  if (status.kind === "active") {
    return (
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#0f1f1c]">Your guide profile</h2>
        <Link
          href="/dashboard/peer"
          className="group flex items-center gap-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <CheckCircle className="size-6 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-[#0f1f1c]">Profile live</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Active</span>
            </div>
            <p className="text-xs text-[#6b7280] mt-0.5">{status.universityName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-[#0f1f1c]">{status.connectionCount}</p>
            <p className="text-xs text-[#6b7280]">students contacted you</p>
          </div>
          <ArrowRight className="ml-2 size-4 shrink-0 text-emerald-400 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  if (status.kind === "pending") {
    return (
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#0f1f1c]">Your guide profile</h2>
        <div className="flex items-center gap-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Clock className="size-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0f1f1c]">Application under review</p>
            <p className="text-xs text-[#6b7280] mt-0.5">{status.universityName} · We will email you once approved</p>
          </div>
        </div>
      </div>
    );
  }

  if (status.kind === "rejected") {
    return (
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#0f1f1c]">Your guide profile</h2>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm">
          <p className="text-sm text-red-700">Your application was not approved. You can apply again with a clearer college ID.</p>
          <Link
            href="/join"
            className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
          >
            Apply again
          </Link>
        </div>
      </div>
    );
  }

  // kind === "none" — show a soft CTA
  return (
    <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-white px-5 py-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f5]">
          <Star className="size-6 text-[#0f3d37]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0f1f1c]">Help other students</p>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Studying or studied MBBS abroad? Share your experience and guide students who need it.
          </p>
        </div>
        <Link
          href="/join"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-[#0f3d37] px-4 py-2 text-xs font-semibold text-[#0f3d37] hover:bg-[#0f3d37] hover:text-white transition"
        >
          Become a guide <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
