import assert from "node:assert/strict";
import test from "node:test";

import { deriveCallStatus, describeCallForThread, formatCallDuration } from "../lib/calls/call-status";
import { groupCallsByDay, parseCallHistoryLimit } from "../lib/calls/call-history";
import { buildThreadTimeline, formatCallTimeRange, summarizeCallGroup } from "../lib/chat/call-events";

const at = (h: number, m: number, s = 0, day = 27) => new Date(2026, 9, day, h, m, s);

type Call = Parameters<typeof deriveCallStatus>[0] & { id: string; createdAt: Date | null };

function call(id: string, createdAt: Date, overrides: Partial<Call> = {}): Call {
  return { id, createdAt, status: "expired", direction: "incoming", answeredAt: null, endedAt: null, ...overrides };
}

// ── Status derivation ──

test("connected calls are Completed with duration from answeredAt to endedAt", () => {
  const info = deriveCallStatus({ status: "ended", direction: "outgoing", answeredAt: at(0, 4, 0), endedAt: at(0, 4, 4) });
  assert.equal(info.label, "Completed");
  assert.equal(info.durationSeconds, 4);
  assert.equal(info.connected, true);
});

test("legacy 'ended' rows that were never answered are not Completed", () => {
  assert.equal(deriveCallStatus({ status: "ended", direction: "outgoing", answeredAt: null, endedAt: at(1, 0) }).label, "No answer");
  assert.equal(deriveCallStatus({ status: "ended", direction: "incoming", answeredAt: null, endedAt: at(1, 0) }).label, "Missed");
});

test("unanswered outcomes depend on who hung up and on direction", () => {
  const cases: Array<[string, "incoming" | "outgoing", string]> = [
    ["expired", "outgoing", "No answer"],
    ["expired", "incoming", "Missed"],
    ["missed", "outgoing", "Cancelled"],
    ["missed", "incoming", "Missed"],
    ["declined", "outgoing", "Declined"],
    ["declined", "incoming", "Declined"],
    ["ringing", "outgoing", "Ringing"],
  ];
  for (const [status, direction, label] of cases) {
    const info = deriveCallStatus({ status, direction, answeredAt: null, endedAt: null });
    assert.equal(info.label, label, `${status}/${direction}`);
    assert.equal(info.durationSeconds, null);
  }
});

test("an answered call that is still active is In progress", () => {
  assert.equal(deriveCallStatus({ status: "active", direction: "incoming", answeredAt: at(1, 0), endedAt: null }).label, "In progress");
});

test("formatCallDuration", () => {
  assert.equal(formatCallDuration(4), "0:04");
  assert.equal(formatCallDuration(750), "12:30");
  assert.equal(formatCallDuration(3723), "1:02:03");
  assert.equal(formatCallDuration(null), null);
});

test("thread labels agree with the call log status", () => {
  assert.equal(describeCallForThread({ status: "ended", direction: "outgoing", answeredAt: at(0, 4), endedAt: at(0, 4, 4) }), "Outgoing voice call · 0:04");
  assert.equal(describeCallForThread({ status: "ended", direction: "incoming", answeredAt: null, endedAt: at(0, 4) }), "Missed voice call");
  assert.equal(describeCallForThread({ status: "missed", direction: "outgoing", answeredAt: null, endedAt: at(0, 4) }), "Outgoing call · Cancelled");
});

// ── Grouping ──

test("consecutive same-day calls with no message between collapse into one group", () => {
  const calls = [
    call("a", at(0, 1)),
    call("b", at(0, 2)),
    call("c", at(0, 3)),
    call("d", at(0, 3, 30)),
    call("e", at(0, 4), { status: "ended", direction: "outgoing", answeredAt: at(0, 4), endedAt: at(0, 4, 4) }),
  ];
  const items = buildThreadTimeline([], calls);
  assert.equal(items.length, 1);
  assert.equal(items[0].kind, "call-group");
  if (items[0].kind !== "call-group") return;
  assert.equal(items[0].calls.length, 5);
  assert.equal(summarizeCallGroup(items[0].calls), "4 missed calls · 1 outgoing call (0:04)");
});

test("a text message breaks the run and single calls stay single", () => {
  const items = buildThreadTimeline(
    [{ id: 1, createdAt: at(0, 2, 30) }],
    [call("a", at(0, 1)), call("b", at(0, 2)), call("c", at(0, 3))]
  );
  assert.deepEqual(items.map((item) => item.kind), ["call-group", "message", "call"]);
});

test("calls on different days are never grouped together", () => {
  const items = buildThreadTimeline([], [call("a", at(23, 59, 0, 26)), call("b", at(0, 1, 0, 27))]);
  assert.deepEqual(items.map((item) => item.kind), ["call", "call"]);
});

test("summary counts unanswered, declined and incoming connected calls", () => {
  const summary = summarizeCallGroup([
    call("a", at(1, 0), { direction: "outgoing", status: "expired" }),
    call("b", at(1, 1), { direction: "outgoing", status: "missed" }),
    call("c", at(1, 2), { direction: "outgoing", status: "declined" }),
    call("d", at(1, 3), { status: "ended", answeredAt: at(1, 3), endedAt: at(1, 5, 10) }),
  ]);
  assert.equal(summary, "2 unanswered calls · 1 declined call · 1 incoming call (2:10)");
});

test("time range drops the repeated am/pm", () => {
  const range = formatCallTimeRange(at(0, 1), at(0, 4));
  assert.match(range, /^12:01–12:04[\s ]am$/i);
  assert.equal(formatCallTimeRange(at(0, 1), at(0, 1)), formatCallTimeRange(at(0, 1), null));
  assert.match(formatCallTimeRange(at(11, 58), at(12, 2)), /am–12:02[\s ]pm$/i);
});

// ── Call log paging and day groups ──


test("show-more limit is bounded and paged in steps of 20", () => {
  assert.equal(parseCallHistoryLimit(undefined), 20);
  assert.equal(parseCallHistoryLimit("abc"), 20);
  assert.equal(parseCallHistoryLimit("-5"), 20);
  assert.equal(parseCallHistoryLimit("40"), 40);
  assert.equal(parseCallHistoryLimit("41"), 60);
  assert.equal(parseCallHistoryLimit("100000"), 200);
  assert.equal(parseCallHistoryLimit(["60", "20"]), 60);
});

test("call log groups by IST calendar day with Today / Yesterday labels", () => {
  const now = new Date("2026-10-27T10:00:00+05:30");
  const rows = [
    { id: 1, createdAt: new Date("2026-10-27T00:04:00+05:30") },
    { id: 2, createdAt: new Date("2026-10-27T00:01:00+05:30") },
    { id: 3, createdAt: new Date("2026-10-26T23:59:00+05:30") },
    { id: 4, createdAt: new Date("2026-10-20T12:00:00+05:30") },
  ];
  const groups = groupCallsByDay(rows, now);
  assert.deepEqual(groups.map((group) => group.label.replace(/\s+/g, " ")), ["Today", "Yesterday", "Tue, 20 Oct"]);
  assert.deepEqual(groups[0].rows.map((row) => row.id), [1, 2]);
});
