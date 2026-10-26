import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { ExternalLink } from "lucide-react";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { countries, studentPeers, universities } from "@/lib/db/schema";
import { getDashboardViewer } from "@/lib/dashboard/nav-counts";
import { DashboardPage, PageHeader, dashboardButton } from "@/components/dashboard/ui";
import { PeerEditForm } from "@/components/dashboard/peer-edit-form";

export const metadata = { title: "Guide profile | Dashboard" };

export default async function PeerEditPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const db = getDb();
  if (!db) return <p className="text-sm text-[#6b7280]">Service temporarily unavailable.</p>;

  const viewer = await getDashboardViewer(session.user.email);
  if (!viewer) redirect("/login");

  const [peer] = await db
    .select({
      id: studentPeers.id,
      acceptingRequests: studentPeers.acceptingRequests,
      fullName: studentPeers.fullName,
      photoUrl: studentPeers.photoUrl,
      courseName: studentPeers.courseName,
      currentYearOrBatch: studentPeers.currentYearOrBatch,
      homeState: studentPeers.homeState,
      homeCity: studentPeers.homeCity,
      languages: studentPeers.languages,
      hasWhatsApp: sql<boolean>`${studentPeers.contactPhone} is not null`.mapWith(Boolean),
      canReceiveCalls: sql<boolean>`${studentPeers.peerUserId} is not null`.mapWith(Boolean),
      universityName: universities.name,
      universitySlug: universities.slug,
      countryName: sql<string>`coalesce(${countries.name}, '')`,
      countrySlug: sql<string>`coalesce(${countries.slug}, '')`,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(countries, eq(studentPeers.countryId, countries.id))
    .where(eq(studentPeers.peerUserId, viewer.userId))
    .limit(1);

  if (!peer) redirect("/join");

  return (
    <DashboardPage>
      <PageHeader
        title="Guide profile"
        description="What students see on your university page before they request a call."
        actions={
          <Link href={`/students?peer=${peer.id}`} className={dashboardButton.secondary}>
            <ExternalLink className="size-4" />
            Preview public profile
          </Link>
        }
      />
      <PeerEditForm peer={peer} voiceCallsEnabled={env.hasAgoraVoice} />
    </DashboardPage>
  );
}
