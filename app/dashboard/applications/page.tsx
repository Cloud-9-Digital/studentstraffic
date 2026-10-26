import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, GraduationCap } from "lucide-react";

import { ApplicationCard } from "@/app/dashboard/applications/_components/application-card";
import { CounsellorHelp } from "@/app/dashboard/applications/_components/counsellor-help";
import { ShortlistRow } from "@/app/dashboard/shortlists/_components/shortlist-row";
import { DashboardPage, EmptyState, PageHeader, Section, SectionList, dashboardButton } from "@/components/dashboard/ui";
import { auth } from "@/lib/auth";
import { listApplicationsForUser, listShortlistForUser } from "@/lib/dashboard/applications";
import { resolveDbUserId } from "@/lib/server-session";

export const metadata: Metadata = { title: "Applications | Dashboard | Students Traffic" };

const HOW_IT_WORKS = [
  { title: "Shortlist universities", description: "Save the universities you like from their pages." },
  { title: "Start an application", description: "Pick a programme. This saves a draft." },
  { title: "Submit for review", description: "A counsellor checks it with you and contacts you." },
  { title: "Apply with your counsellor", description: "The university reviews it and decides." },
];

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const userId = await resolveDbUserId(session.user.email);

  const [applications, shortlist] = userId
    ? await Promise.all([listApplicationsForUser(userId), listShortlistForUser(userId)])
    : [[], []];
  const notStarted = shortlist.filter((item) => !item.applicationId);

  const browse = (
    <Link href="/universities" className={dashboardButton.secondary}>
      <GraduationCap className="size-4" />
      Browse universities
    </Link>
  );

  return (
    <DashboardPage className="pb-8">
      <PageHeader
        title="Applications"
        description={
          applications.length === 0
            ? "Start an application from your shortlist and track it here."
            : `${applications.length} ${applications.length === 1 ? "application" : "applications"}`
        }
        actions={browse}
      />

      {applications.length > 0 ? (
        <Section flush>
          <SectionList>
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </SectionList>
        </Section>
      ) : shortlist.length === 0 ? (
        <Section>
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Shortlist the universities you like first, then start an application from here."
            action={
              <Link href="/universities" className={dashboardButton.primary}>
                Browse universities
              </Link>
            }
          />
        </Section>
      ) : null}

      {notStarted.length > 0 ? (
        <Section
          flush
          title={
            applications.length === 0
              ? `Apply to one of your ${notStarted.length} shortlisted ${notStarted.length === 1 ? "university" : "universities"}`
              : "Ready to apply"
          }
          description={
            applications.length === 0
              ? "Pick a university and a programme to save a draft."
              : "Shortlisted universities you haven't applied to yet."
          }
          action={
            <Link href="/dashboard/shortlists" className="text-xs font-medium text-[#0f3d37] hover:underline">
              Manage shortlist
            </Link>
          }
        >
          <SectionList>
            {notStarted.map((item) => (
              <ShortlistRow key={item.id} item={item} showRemove={false} />
            ))}
          </SectionList>
        </Section>
      ) : null}

      {applications.length === 0 ? (
        <Section title="How it works">
          <ol className="grid gap-4 sm:grid-cols-2">
            {HOW_IT_WORKS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#0f1f1c]">{step.title}</p>
                  <p className="text-xs text-[#6b7280]">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <CounsellorHelp compact={applications.length === 0} />
    </DashboardPage>
  );
}
