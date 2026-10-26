import Link from "next/link";

import { ApplicationSteps, StatusPill } from "@/app/dashboard/applications/_components/application-status";
import { UniversityLogo } from "@/app/dashboard/applications/_components/university-logo";
import { dashboardButton } from "@/components/dashboard/ui";
import type { ApplicationListItem } from "@/lib/dashboard/applications";
import { formatDashboardDate, getApplicationNextAction } from "@/lib/dashboard/application-model";

/** Status-first application card: who, what, where it stands, and the next action. */
export function ApplicationCard({ application }: { application: ApplicationListItem }) {
  const next = getApplicationNextAction(application.status);
  const href = `/dashboard/applications/${application.id}`;
  const place = [application.universityCity, application.countryName].filter(Boolean).join(", ");

  return (
    <li className="space-y-4 px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <UniversityLogo name={application.universityName} logoUrl={application.universityLogoUrl} />
          <div className="min-w-0">
            <Link href={href} className="block truncate text-sm font-semibold text-[#0f1f1c] hover:text-[#0f3d37] hover:underline">
              {application.universityName}
            </Link>
            <p className="truncate text-xs text-[#4b5563]">{application.programmeLabel}</p>
            {place ? <p className="truncate text-xs text-[#9ca3af]">{place}</p> : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start sm:gap-1">
          <StatusPill status={application.status} />
          <span className="text-xs text-[#9ca3af]">Updated {formatDashboardDate(application.updatedAt)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <ApplicationSteps status={application.status} />
        </div>
        <Link href={href} className={`${next.emphasis === "primary" ? dashboardButton.primary : dashboardButton.secondary} sm:shrink-0`}>
          {next.label}
        </Link>
      </div>
    </li>
  );
}
