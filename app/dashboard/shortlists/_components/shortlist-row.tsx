import Link from "next/link";

import { StartApplicationButton } from "@/app/dashboard/applications/_components/start-application-button";
import { StatusPill } from "@/app/dashboard/applications/_components/application-status";
import { UniversityLogo } from "@/app/dashboard/applications/_components/university-logo";
import { RemoveShortlistButton } from "@/app/dashboard/shortlists/_components/remove-shortlist-button";
import { dashboardButton } from "@/components/dashboard/ui";
import type { ShortlistItem } from "@/lib/dashboard/applications";
import { formatDashboardDate } from "@/lib/dashboard/application-model";
import { getUniversityHref } from "@/lib/routes";

/** One saved university: logo, name, place, key fact, then actions on the right (below on mobile). */
export function ShortlistRow({ item, showRemove = true }: { item: ShortlistItem; showRemove?: boolean }) {
  const place = [item.universityCity, item.countryName].filter(Boolean).join(", ");
  const programmeCount = item.programmes.length;
  const facts = [
    programmeCount ? `${programmeCount} ${programmeCount === 1 ? "programme" : "programmes"}` : null,
    `Saved ${formatDashboardDate(item.createdAt)}`,
  ].filter(Boolean);

  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <UniversityLogo name={item.universityName} logoUrl={item.logoUrl} />
        <div className="min-w-0">
          <Link
            href={getUniversityHref(item.universitySlug)}
            className="block truncate text-sm font-semibold text-[#0f1f1c] hover:text-[#0f3d37] hover:underline"
          >
            {item.universityName}
          </Link>
          {place ? <p className="truncate text-xs text-[#6b7280]">{place}</p> : null}
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#9ca3af]">
            {item.applicationStatus ? <StatusPill status={item.applicationStatus} /> : null}
            <span>{facts.join(" · ")}</span>
          </p>
          {item.notes ? <p className="mt-0.5 line-clamp-1 text-xs italic text-[#9ca3af]">{item.notes}</p> : null}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:shrink-0">
        {item.applicationId ? (
          <Link href={`/dashboard/applications/${item.applicationId}`} className={`${dashboardButton.primary} flex-1 sm:flex-none`}>
            View application
          </Link>
        ) : (
          <StartApplicationButton
            universitySlug={item.universitySlug}
            universityName={item.universityName}
            programmes={item.programmes}
            className="flex-1 sm:flex-none"
          />
        )}
        <Link href={getUniversityHref(item.universitySlug)} className={`${dashboardButton.secondary} flex-1 sm:flex-none`}>
          View
        </Link>
        {showRemove ? (
          <RemoveShortlistButton
            shortlistId={item.id}
            universityName={item.universityName}
            hasApplication={Boolean(item.applicationId)}
          />
        ) : null}
      </div>
    </li>
  );
}
