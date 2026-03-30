import Link from "next/link";
import { ArrowRight, FileSearch } from "lucide-react";

import { WdomsProfileCard } from "@/components/site/wdoms-profile-card";
import type { WdomsCountryConfig } from "@/lib/wdoms";
import type { WdomsDirectoryEntry } from "@/lib/data/types";
import { getWdomsDirectoryHref } from "@/lib/routes";

type WdomsPreviewGroup = {
  config: WdomsCountryConfig;
  entries: WdomsDirectoryEntry[];
  totalCount: number;
};

export function WdomsPreviewSection({
  groups,
}: {
  groups: WdomsPreviewGroup[];
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="pb-12 md:pb-16">
      <div className="container-shell">
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <FileSearch className="size-3.5" />
            Official directory coverage
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            Research-backed university profiles from WDOMS
          </h2>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            These are public research profiles built from the World Directory
            of Medical Schools and official school websites linked there. They
            make universities visible on the site before we publish fee-led
            program cards in the main explorer.
          </p>
        </div>

        <div className="space-y-10">
          {groups.map((group) => {
            const href = group.config.landingPageSlug
              ? `/${group.config.landingPageSlug}#wdoms-directory`
              : getWdomsDirectoryHref(group.config.slug);

            return (
              <div key={group.config.slug}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-heading">
                      {group.config.displayName}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {group.totalCount} WDOMS-listed medical schools tracked
                    </p>
                  </div>

                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    See full {group.config.displayName} directory
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {group.entries.map((entry) => (
                    <WdomsProfileCard key={entry.schoolId} entry={entry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
