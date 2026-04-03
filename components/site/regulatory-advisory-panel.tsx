import { AlertTriangle, ExternalLink } from "lucide-react";

import { formatContentDate } from "@/lib/content-governance";
import type {
  CountryRegulatoryAdvisory,
  UniversityRegulatoryAdvisory,
} from "@/lib/data/regulatory-advisories";
import { cn } from "@/lib/utils";

export function RegulatoryAdvisoryPanel({
  advisory,
  universityNote,
  className,
  titleLevel = "h2",
}: {
  advisory: CountryRegulatoryAdvisory;
  universityNote?: UniversityRegulatoryAdvisory | null;
  className?: string;
  titleLevel?: "h2" | "h3";
}) {
  const TitleTag = titleLevel;
  const universityBadgeLabel = universityNote
    ? universityNote.status === "named"
      ? "Institution named in alert"
      : "Network caution (inference)"
    : null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-red-200 bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_100%)] shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-red-200/80 px-5 py-4 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white">
          <AlertTriangle className="size-3.5" />
          {advisory.label}
        </span>
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-900/65">
          Updated {formatContentDate(advisory.updatedAt)}
        </span>
        {universityBadgeLabel ? (
          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-red-900 ring-1 ring-red-200">
            {universityBadgeLabel}
          </span>
        ) : null}
      </div>

      <div className="grid gap-8 px-5 py-5 sm:px-6 lg:grid-cols-[1.45fr_1fr]">
        <div>
          <TitleTag className="font-display text-2xl font-semibold leading-tight text-red-950 md:text-[2rem]">
            {universityNote?.title ?? advisory.title}
          </TitleTag>

          <p className="mt-4 text-sm leading-7 text-red-950/85 sm:text-[0.98rem]">
            {universityNote?.body ?? advisory.summary}
          </p>

          {universityNote ? (
            <p className="mt-3 text-sm leading-7 text-red-950/75">
              {advisory.summary}
            </p>
          ) : null}

          <div className="mt-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-red-700/80">
              Why this matters
            </p>
            <ul className="mt-3 space-y-2.5">
              {advisory.keyPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm leading-6 text-red-950/80"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-red-200/80 bg-white/80 p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-red-700/80">
            Before admission
          </p>
          <ul className="mt-3 space-y-2.5">
            {advisory.actionItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-6 text-red-950/80"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-500" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-red-200/80 pt-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-red-700/80">
              Sources
            </p>
            <ul className="mt-3 space-y-2.5">
              {advisory.sources.map((source) => (
                <li key={source.label} className="text-sm leading-6 text-red-950/80">
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-red-900 hover:underline"
                    >
                      {source.label}
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <span className="font-medium text-red-900">{source.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
