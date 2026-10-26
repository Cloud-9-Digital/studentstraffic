"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";

import { EmptyState, SectionList } from "@/components/dashboard/ui";
import {
  describeGuideStudentChannels,
  type GuideStudentRow,
} from "@/lib/dashboard/guide-students";
import { cn } from "@/lib/utils";
import { StudentActions } from "./student-actions";
import { StudentAvatar, StudentStatusPill } from "./student-bits";

type Filter = "all" | "pending" | "accepted" | "other";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "other", label: "Other" },
];

function matchesFilter(student: GuideStudentRow, filter: Filter) {
  if (filter === "all") return true;
  if (filter === "pending") return student.status === "pending";
  if (filter === "accepted") return student.status === "accepted";
  return student.status !== "pending" && student.status !== "accepted";
}

export function StudentsList({
  students,
  universityName,
  voiceEnabled,
}: {
  students: GuideStudentRow[];
  universityName: string;
  voiceEnabled: boolean;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: students.length, pending: 0, accepted: 0, other: 0 };
    for (const s of students) {
      if (s.status === "pending") result.pending += 1;
      else if (s.status === "accepted") result.accepted += 1;
      else result.other += 1;
    }
    return result;
  }, [students]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (!matchesFilter(s, filter)) return false;
      if (!q) return true;
      return [s.name, s.interest, s.courseInterest, s.location, ...s.preferredCountries]
        .some((value) => value?.toLowerCase().includes(q));
    });
  }, [students, query, filter]);

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-[#f0f0f0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div role="tablist" aria-label="Filter students" className="flex flex-wrap gap-1">
          {FILTERS.filter((f) => f.id === "all" || counts[f.id] > 0).map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                filter === f.id ? "bg-[#0f3d37] text-white" : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]",
              )}
            >
              {f.label} <span className="tabular-nums opacity-80">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:w-64">
          <span className="sr-only">Search students</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or interest"
            className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2 pl-9 pr-3 text-sm text-[#0f1f1c] outline-none placeholder:text-[#9ca3af] focus:border-[#0f3d37] focus:ring-2 focus:ring-[#0f3d37]/10"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students match"
          description={query ? `Nothing matches “${query}”. Try a different name or clear the search.` : "No students in this filter yet."}
        />
      ) : (
        <SectionList>
          {visible.map((s) => {
            const details = [
              s.location,
              s.courseInterest,
              s.preferredCountries.length ? `Interested in ${s.preferredCountries.join(", ")}` : null,
              s.neetScore != null ? `NEET ${s.neetScore}` : null,
            ].filter(Boolean) as string[];
            const hasActions = s.canAccept || s.canMessage || (voiceEnabled && s.canCall);
            return (
              <li key={s.key} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:px-5">
                <div className="flex min-w-0 flex-1 gap-3">
                  <StudentAvatar name={s.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="truncate text-sm font-semibold text-[#0f1f1c]">{s.name}</p>
                      <StudentStatusPill status={s.status} />
                      {s.unreadCount > 0 ? (
                        <span className="rounded-full bg-[#0f3d37] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {s.unreadCount} unread
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      {describeGuideStudentChannels(s)}
                      {s.lastActivityLabel ? <> · Last activity {s.lastActivityLabel}</> : null}
                    </p>
                    {s.interest ? (
                      <p className="mt-1.5 line-clamp-2 text-sm text-[#374151]">“{s.interest}”</p>
                    ) : null}
                    {details.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {details.map((d) => (
                          <span key={d} className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] text-[#4b5563]">
                            {d}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                {hasActions ? (
                  <div className="pl-12 sm:pl-0">
                    <StudentActions
                      studentName={s.name}
                      universityName={universityName}
                      bookingId={s.bookingId}
                      conversationId={s.conversationId}
                      unreadCount={s.unreadCount}
                      canAccept={s.canAccept}
                      canMessage={s.canMessage}
                      canCall={voiceEnabled && s.canCall}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </SectionList>
      )}
    </div>
  );
}
