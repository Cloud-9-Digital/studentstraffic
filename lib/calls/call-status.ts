/**
 * One honest reading of a peer call record, shared by the call history page
 * and the chat thread so both always say the same thing about a call.
 *
 * The `status` column alone is not trustworthy for history: older rows (and
 * stale "active" calls closed by the TTL sweep) are stored as "ended" even
 * though nobody picked up. Whether the call connected is decided by
 * `answeredAt`, which is only set when the recipient joins the call.
 */

export type CallRecordStatus = "ringing" | "active" | "missed" | "declined" | "ended" | "expired";

export type CallDirection = "incoming" | "outgoing";

export type CallOutcome =
  | "completed"
  | "in_progress"
  | "ringing"
  | "missed"
  | "no_answer"
  | "cancelled"
  | "declined";

export type CallRecordInput = {
  status: CallRecordStatus | string;
  direction: CallDirection;
  answeredAt: Date | string | null;
  endedAt: Date | string | null;
};

export type CallStatusInfo = {
  outcome: CallOutcome;
  /** Short status for a call log ("Completed", "Missed", "No answer"…). */
  label: string;
  /** True when the recipient picked up. */
  connected: boolean;
  /** Talk time in whole seconds, only for connected calls that have ended. */
  durationSeconds: number | null;
};

const OUTCOME_LABELS: Record<CallOutcome, string> = {
  completed: "Completed",
  in_progress: "In progress",
  ringing: "Ringing",
  missed: "Missed",
  no_answer: "No answer",
  cancelled: "Cancelled",
  declined: "Declined",
};

function toTime(value: Date | string | null) {
  if (!value) return null;
  const time = (value instanceof Date ? value : new Date(value)).getTime();
  return Number.isFinite(time) ? time : null;
}

/**
 * | answeredAt | status                 | outgoing (you called) | incoming (they called) |
 * |------------|------------------------|-----------------------|------------------------|
 * | set        | active, no endedAt     | In progress           | In progress            |
 * | set        | anything else          | Completed + duration  | Completed + duration   |
 * | empty      | ringing / active       | Ringing               | Ringing                |
 * | empty      | declined (callee hung) | Declined              | Declined               |
 * | empty      | missed (caller hung)   | Cancelled             | Missed                 |
 * | empty      | expired / ended / other| No answer             | Missed                 |
 */
export function deriveCallStatus(call: CallRecordInput): CallStatusInfo {
  const answered = toTime(call.answeredAt);
  const ended = toTime(call.endedAt);
  const outgoing = call.direction === "outgoing";

  let outcome: CallOutcome;
  if (answered != null) {
    outcome = call.status === "active" && ended == null ? "in_progress" : "completed";
  } else if (call.status === "ringing" || call.status === "active") {
    outcome = "ringing";
  } else if (call.status === "declined") {
    outcome = "declined";
  } else if (call.status === "missed") {
    outcome = outgoing ? "cancelled" : "missed";
  } else {
    outcome = outgoing ? "no_answer" : "missed";
  }

  const durationSeconds =
    outcome === "completed" && answered != null && ended != null
      ? Math.max(0, Math.floor((ended - answered) / 1000))
      : null;

  return {
    outcome,
    label: OUTCOME_LABELS[outcome],
    connected: answered != null,
    durationSeconds,
  };
}

/** "0:04", "12:30", "1:02:03". */
export function formatCallDuration(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds)) return null;
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = String(total % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}` : `${minutes}:${rest}`;
}

/** Line used for a single call inside a chat thread, built from the same outcome as the call log. */
export function describeCallForThread(call: CallRecordInput) {
  const info = deriveCallStatus(call);
  const outgoing = call.direction === "outgoing";
  switch (info.outcome) {
    case "completed": {
      const duration = formatCallDuration(info.durationSeconds);
      return `${outgoing ? "Outgoing" : "Incoming"} voice call${duration ? ` · ${duration}` : ""}`;
    }
    case "in_progress":
      return "Voice call in progress";
    case "ringing":
      return outgoing ? "Calling…" : "Incoming voice call";
    case "missed":
      return "Missed voice call";
    case "declined":
      return outgoing ? "Outgoing call · Declined" : "Declined voice call";
    case "cancelled":
      return "Outgoing call · Cancelled";
    case "no_answer":
      return "Outgoing call · No answer";
  }
}
