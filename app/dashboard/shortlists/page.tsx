import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookmarkCheck, GraduationCap } from "lucide-react";

import { ShortlistRow } from "@/app/dashboard/shortlists/_components/shortlist-row";
import { DashboardPage, EmptyState, PageHeader, Section, SectionList, dashboardButton } from "@/components/dashboard/ui";
import { auth } from "@/lib/auth";
import { listShortlistForUser } from "@/lib/dashboard/applications";
import { resolveDbUserId } from "@/lib/server-session";

export const metadata: Metadata = { title: "Shortlists | Dashboard | Students Traffic" };

export default async function ShortlistsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const userId = await resolveDbUserId(session.user.email);
  const shortlist = userId ? await listShortlistForUser(userId) : [];
  const appliedCount = shortlist.filter((item) => item.applicationId).length;

  const browse = (
    <Link href="/universities" className={dashboardButton.secondary}>
      <GraduationCap className="size-4" />
      Browse universities
    </Link>
  );

  return (
    <DashboardPage className="pb-8">
      <PageHeader
        title="Shortlists"
        description={
          shortlist.length === 0
            ? "Universities you save appear here, ready to compare and apply."
            : `${shortlist.length} saved ${shortlist.length === 1 ? "university" : "universities"}${appliedCount ? ` · ${appliedCount} with an application` : ""}`
        }
        actions={browse}
      />

      {shortlist.length === 0 ? (
        <Section>
          <EmptyState
            icon={BookmarkCheck}
            title="No saved universities yet"
            description="Use Shortlist on any university page to save it here. You can start an application from your shortlist."
            action={
              <Link href="/universities" className={dashboardButton.primary}>
                Browse universities
              </Link>
            }
          />
        </Section>
      ) : (
        <Section flush>
          <SectionList>
            {shortlist.map((item) => (
              <ShortlistRow key={item.id} item={item} />
            ))}
          </SectionList>
        </Section>
      )}
    </DashboardPage>
  );
}
