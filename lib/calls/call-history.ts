/**
 * Day grouping and "Show more" paging for the call log at /dashboard/calls.
 * Pure helpers so the grouping is unit-tested and timezone-explicit (the page
 * renders on the server, so "Today" must not depend on the server's clock zone).
 */

export const CALL_HISTORY_PAGE_SIZE = 20;
export const CALL_HISTORY_MAX = 200;
export const CALL_LOG_TIME_ZONE = "Asia/Kolkata";

/** `?show=` → how many rows to load: a multiple of the page size, at least one page, at most the cap. */
export function parseCallHistoryLimit(raw: string | string[] | undefined) {
  const value = Number.parseInt(Array.isArray(raw) ? raw[0] ?? "" : raw ?? "", 10);
  if (!Number.isFinite(value) || value <= CALL_HISTORY_PAGE_SIZE) return CALL_HISTORY_PAGE_SIZE;
  const rounded = Math.ceil(value / CALL_HISTORY_PAGE_SIZE) * CALL_HISTORY_PAGE_SIZE;
  return Math.min(rounded, CALL_HISTORY_MAX);
}

/** "2026-10-27" for the calendar day `date` falls on in `timeZone`. */
export function calendarDay(date: Date, timeZone = CALL_LOG_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function dayLabel(date: Date, now: Date, timeZone = CALL_LOG_TIME_ZONE) {
  const day = calendarDay(date, timeZone);
  if (day === calendarDay(now, timeZone)) return "Today";
  if (day === calendarDay(new Date(now.getTime() - 24 * 60 * 60 * 1000), timeZone)) return "Yesterday";
  const sameYear = day.slice(0, 4) === calendarDay(now, timeZone).slice(0, 4);
  return date.toLocaleDateString("en-IN", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/** Groups rows (already newest first) into consecutive day buckets, keeping order. */
export function groupCallsByDay<T extends { createdAt: Date | null }>(rows: T[], now: Date, timeZone = CALL_LOG_TIME_ZONE) {
  const groups: Array<{ key: string; label: string; rows: T[] }> = [];
  for (const row of rows) {
    const key = row.createdAt ? calendarDay(row.createdAt, timeZone) : "unknown";
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.rows.push(row);
    } else {
      groups.push({ key, label: row.createdAt ? dayLabel(row.createdAt, now, timeZone) : "Earlier", rows: [row] });
    }
  }
  return groups;
}
