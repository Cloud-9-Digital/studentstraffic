import { PhoneIncoming, PhoneOutgoing } from "lucide-react";

import { PeerInitials } from "@/components/dashboard/booked-calls-list";
import type { CallOutcome } from "@/lib/calls/call-status";
import { cn } from "@/lib/utils";

export type CallHistoryRow = {
  id: string;
  otherName: string;
  universityName: string | null;
  direction: "incoming" | "outgoing";
  outcome: CallOutcome;
  statusLabel: string;
  duration: string | null;
  time: string;
  dateTime: string | null;
};

export type CallHistoryDay = { key: string; label: string; rows: CallHistoryRow[] };

const PILL_STYLES: Record<CallOutcome, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  in_progress: "bg-sky-50 text-sky-700",
  ringing: "bg-sky-50 text-sky-700",
  missed: "bg-amber-50 text-amber-800",
  no_answer: "bg-[#f3f4f6] text-[#4b5563]",
  cancelled: "bg-[#f3f4f6] text-[#4b5563]",
  declined: "bg-red-50 text-red-700",
};

/**
 * A read-only call log. Call and Message live once on each guide's card above
 * the log, so the rows don't repeat the same buttons.
 */
function CallRow({ row }: { row: CallHistoryRow }) {
  const DirectionIcon = row.direction === "outgoing" ? PhoneOutgoing : PhoneIncoming;

  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <PeerInitials name={row.otherName} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#0f1f1c]">{row.otherName}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6b7280]">
          <span className="inline-flex items-center gap-1">
            <DirectionIcon className="size-3.5 text-[#9ca3af]" aria-hidden />
            {row.direction === "outgoing" ? "Outgoing" : "Incoming"}
          </span>
          <span className={cn("rounded-full px-2 py-px text-[11px] font-medium", PILL_STYLES[row.outcome])}>
            {row.statusLabel}
          </span>
          {row.duration && <span className="tabular-nums">{row.duration}</span>}
        </div>
      </div>
      <time dateTime={row.dateTime ?? undefined} className="shrink-0 text-xs tabular-nums text-[#9ca3af]">
        {row.time}
      </time>
    </li>
  );
}

export function CallHistoryList({ days }: { days: CallHistoryDay[] }) {
  return (
    <div>
      {days.map((day) => (
        <div key={day.key} className="[&:first-child>h3]:border-t-0">
          <h3 className="border-y border-[#f0f0f0] bg-[#fafafa] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280] sm:px-5">
            {day.label}
          </h3>
          <ul className="divide-y divide-[#f0f0f0]">
            {day.rows.map((row) => (
              <CallRow key={row.id} row={row} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
