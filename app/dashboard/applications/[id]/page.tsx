import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ApplicationSteps, StatusPill } from "@/app/dashboard/applications/_components/application-status";
import { CounsellorHelp } from "@/app/dashboard/applications/_components/counsellor-help";
import { DraftActions } from "@/app/dashboard/applications/_components/draft-actions";
import { UniversityLogo } from "@/app/dashboard/applications/_components/university-logo";
import { DashboardPage, PageHeader, Section, dashboardButton } from "@/components/dashboard/ui";
import { auth } from "@/lib/auth";
import {
  canEditApplication,
  formatDashboardDate,
  getApplicationStatusMeta,
  parsePositiveId,
} from "@/lib/dashboard/application-model";
import { getLeadPhoneForUser } from "@/lib/dashboard/application-lead";
import { getApplicationForUser } from "@/lib/dashboard/applications";
import { getUniversityHref, getUniversityProgramHref } from "@/lib/routes";
import { resolveDbUserId } from "@/lib/server-session";

export const metadata: Metadata = { title: "Application | Dashboard | Students Traffic" };

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const { id } = await params;
  const applicationId = parsePositiveId(id);
  if (!applicationId) notFound();

  const userId = await resolveDbUserId(session.user.email);
  const [application, leadPhone] = userId
    ? await Promise.all([getApplicationForUser(userId, applicationId), getLeadPhoneForUser(userId)])
    : [null, null];
  if (!application) notFound();

  const meta = getApplicationStatusMeta(application.status);
  const editable = canEditApplication(application.status);
  const place = [application.universityCity, application.countryName].filter(Boolean).join(", ");

  const details: Array<{ label: string; value: ReactNode }> = [
    {
      label: "Programme",
      value: application.programmeSlug ? (
        <Link href={getUniversityProgramHref(application.programmeSlug)} className="text-[#0f3d37] hover:underline">
          {application.programmeLabel}
        </Link>
      ) : (
        application.programmeLabel
      ),
    },
    { label: "Reference", value: `#${application.id}` },
    { label: "Started", value: formatDashboardDate(application.createdAt) },
    { label: "Submitted", value: application.submittedAt ? formatDashboardDate(application.submittedAt) : "Not yet" },
    { label: "Last updated", value: formatDashboardDate(application.updatedAt) },
  ];

  return (
    <DashboardPage className="pb-8">
      <Link href="/dashboard/applications" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#0f3d37]">
        <ArrowLeft className="size-4" />
        Applications
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <UniversityLogo name={application.universityName} logoUrl={application.universityLogoUrl} />
            <span className="min-w-0 break-words">{application.universityName}</span>
          </span>
        }
        description={[application.programmeLabel, place].filter(Boolean).join(" · ")}
        actions={
          <Link href={getUniversityHref(application.universitySlug)} className={dashboardButton.secondary}>
            View university
          </Link>
        }
      />

      <Section title="Status" action={<StatusPill status={application.status} />}>
        <ApplicationSteps status={application.status} />
        <p className="mt-4 text-sm text-[#4b5563]">{meta.description}</p>
      </Section>

      {editable ? (
        <Section
          title="Submit for review"
          description="Submitting tells us you're ready. Nothing is sent to the university until you and your counsellor agree."
        >
          <DraftActions applicationId={application.id} universityName={application.universityName} needsPhone={!leadPhone} />
        </Section>
      ) : null}

      <Section title="Details">
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="min-w-0">
              <dt className="text-xs text-[#6b7280]">{detail.label}</dt>
              <dd className="break-words text-sm text-[#0f1f1c]">{detail.value}</dd>
            </div>
          ))}
          {application.studentNote ? (
            <div className="min-w-0 sm:col-span-2">
              <dt className="text-xs text-[#6b7280]">Your note</dt>
              <dd className="whitespace-pre-line break-words text-sm text-[#0f1f1c]">{application.studentNote}</dd>
            </div>
          ) : null}
        </dl>
      </Section>

      <CounsellorHelp
        universityName={application.universityName}
        programmeLabel={application.programmeLabel}
        applicationId={application.id}
      />
    </DashboardPage>
  );
}
