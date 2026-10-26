import {
  deriveCallStatus,
  formatCallDuration,
  type CallRecordInput,
} from "../calls/call-status";

/**
 * Builds the chat thread timeline: text messages and call records in time
 * order, with runs of consecutive call records collapsed into one summary row.
 *
 * Grouping rule: two or more call records in a row (no text message between
 * them) that fall on the same local calendar day become one "call-group" item.
 * A single call stays a plain "call" item. Day changes always break a run so
 * the thread's date separators keep working.
 */

type DateValue = Date | string | null;

export type ThreadCall = CallRecordInput & { id: string; createdAt: DateValue };
export type ThreadMessage = { id: number | string; createdAt: DateValue };

export type ThreadItem<M extends ThreadMessage, C extends ThreadCall> =
  | { kind: "message"; key: string; createdAt: DateValue; message: M }
  | { kind: "call"; key: string; createdAt: DateValue; call: C }
  | { kind: "call-group"; key: string; createdAt: DateValue; calls: C[] };

function timeOf(value: DateValue) {
  if (!value) return 0;
  const time = (value instanceof Date ? value : new Date(value)).getTime();
  return Number.isFinite(time) ? time : 0;
}

/** Local calendar day, or null when the record has no timestamp. */
export function dayKey(value: DateValue) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date.toDateString() : null;
}

export function buildThreadTimeline<M extends ThreadMessage, C extends ThreadCall>(
  messages: M[],
  calls: C[]
): ThreadItem<M, C>[] {
  const merged = [
    ...messages.map((message) => ({ kind: "message" as const, createdAt: message.createdAt, message })),
    ...calls.map((call) => ({ kind: "call" as const, createdAt: call.createdAt, call })),
  ].sort((left, right) => timeOf(left.createdAt) - timeOf(right.createdAt));

  const items: ThreadItem<M, C>[] = [];
  let run: C[] = [];

  const flush = () => {
    if (run.length === 1) {
      items.push({ kind: "call", key: run[0].id, createdAt: run[0].createdAt, call: run[0] });
    } else if (run.length > 1) {
      items.push({ kind: "call-group", key: `group-${run[0].id}`, createdAt: run[0].createdAt, calls: run });
    }
    run = [];
  };

  for (const entry of merged) {
    if (entry.kind === "message") {
      flush();
      items.push({ kind: "message", key: `message-${entry.message.id}`, createdAt: entry.createdAt, message: entry.message });
      continue;
    }
    const previous = run[run.length - 1];
    const sameDay = previous && dayKey(previous.createdAt) !== null && dayKey(previous.createdAt) === dayKey(entry.call.createdAt);
    if (previous && !sameDay) flush();
    run.push(entry.call);
  }
  flush();

  return items;
}

function plural(count: number, singular: string, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** "4 missed calls · 1 outgoing call (0:04)" — counts per outcome, connected calls with total talk time. */
export function summarizeCallGroup(calls: CallRecordInput[]) {
  let missed = 0;
  let unanswered = 0;
  let declined = 0;
  let ongoing = 0;
  const connected = { outgoing: { count: 0, seconds: 0 }, incoming: { count: 0, seconds: 0 } };

  for (const call of calls) {
    const info = deriveCallStatus(call);
    switch (info.outcome) {
      case "missed":
        missed += 1;
        break;
      case "no_answer":
      case "cancelled":
        unanswered += 1;
        break;
      case "declined":
        declined += 1;
        break;
      case "ringing":
      case "in_progress":
        ongoing += 1;
        break;
      case "completed":
        connected[call.direction].count += 1;
        connected[call.direction].seconds += info.durationSeconds ?? 0;
        break;
    }
  }

  const parts: string[] = [];
  if (missed) parts.push(plural(missed, "missed call"));
  if (unanswered) parts.push(plural(unanswered, "unanswered call"));
  if (declined) parts.push(plural(declined, "declined call"));
  for (const direction of ["outgoing", "incoming"] as const) {
    const { count, seconds } = connected[direction];
    if (count) parts.push(`${plural(count, `${direction} call`)} (${formatCallDuration(seconds)})`);
  }
  if (ongoing) parts.push(plural(ongoing, "call in progress", "calls in progress"));
  return parts.join(" · ");
}

const TIME_FORMAT: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
const MERIDIEM = /[\s ]*([ap]\.?m\.?)$/i;

/** "12:01–12:04 am"; drops the repeated am/pm when both ends share it. */
export function formatCallTimeRange(start: DateValue, end: DateValue, locale = "en-IN") {
  if (!start) return "";
  const startDate = start instanceof Date ? start : new Date(start);
  const first = startDate.toLocaleTimeString(locale, TIME_FORMAT);
  if (!end) return first;
  const endDate = end instanceof Date ? end : new Date(end);
  const last = endDate.toLocaleTimeString(locale, TIME_FORMAT);
  if (first === last) return first;
  const firstSuffix = first.match(MERIDIEM)?.[1];
  const lastSuffix = last.match(MERIDIEM)?.[1];
  if (firstSuffix && firstSuffix === lastSuffix) return `${first.replace(MERIDIEM, "")}–${last}`;
  return `${first}–${last}`;
}

/** True when any call in the group went unanswered on the viewer's side. */
export function groupHasMissedCall(calls: CallRecordInput[]) {
  return calls.some((call) => deriveCallStatus(call).outcome === "missed");
}
