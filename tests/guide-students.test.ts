import assert from "node:assert/strict";
import test from "node:test";

import {
  guideStudentDetailColumns,
  mergeGuideStudents,
  type GuideStudentSources,
} from "../lib/dashboard/guide-students";

const prefs = { neetScore: null, preferredCountries: null };
const d = (day: number) => new Date(Date.UTC(2026, 9, day));

function sources(overrides: Partial<GuideStudentSources>): GuideStudentSources {
  return { bookings: [], conversations: [], calls: [], introductions: [], ...overrides };
}

test("one row per student across requests, messages and calls", () => {
  const students = mergeGuideStudents(
    sources({
      bookings: [
        { ...prefs, bookingId: 1, studentUserId: "akhil", studentName: "Akhil", status: "pending", message: "Hostel food?", blocked: false, createdAt: d(1), updatedAt: d(1) },
        { ...prefs, bookingId: 2, studentUserId: "bharat", studentName: "Bharat", status: "pending", message: null, blocked: false, createdAt: d(2), updatedAt: d(2) },
        { ...prefs, bookingId: 3, studentUserId: "android", studentName: "Android Testing", status: "pending", message: "Fees", blocked: false, createdAt: d(3), updatedAt: d(3) },
        { ...prefs, bookingId: 4, studentUserId: "deepak", studentName: "Deepak", status: "accepted", message: "Clinical exposure", blocked: false, createdAt: d(4), updatedAt: d(5) },
      ],
      conversations: [
        { ...prefs, conversationId: 10, studentUserId: "bharat", studentName: "Bharat", lastMessageAt: d(9), createdAt: d(2), unreadCount: 2 },
        { ...prefs, conversationId: 11, studentUserId: "akhil", studentName: "Akhil", lastMessageAt: d(6), createdAt: d(1), unreadCount: 0 },
        { ...prefs, conversationId: 12, studentUserId: "deepak", studentName: "Deepak", lastMessageAt: d(7), createdAt: d(4), unreadCount: 1 },
      ],
      calls: [
        { ...prefs, studentUserId: "deepak", studentName: "Deepak", callCount: 2, callsThisMonth: 1, lastCallAt: d(8) },
      ],
    }),
  );

  assert.equal(students.length, 4);
  assert.deepEqual(students.map((s) => s.name), ["Bharat", "Deepak", "Akhil", "Android Testing"]);

  const deepak = students.find((s) => s.studentUserId === "deepak")!;
  assert.equal(deepak.status, "accepted");
  assert.deepEqual(deepak.channels, ["requested", "messaged", "called"]);
  assert.equal(deepak.conversationId, 12);
  assert.equal(deepak.callCount, 2);
  assert.equal(deepak.interest, "Clinical exposure");
  assert.equal(deepak.canCall, true);
  assert.equal(deepak.canAccept, false);

  const akhil = students.find((s) => s.studentUserId === "akhil")!;
  assert.equal(akhil.status, "pending");
  assert.equal(akhil.canAccept, true);
  assert.equal(akhil.canMessage, true);
  assert.equal(akhil.canCall, false);
  assert.equal(akhil.lastActivityAt?.getTime(), d(6).getTime());
});

test("team introductions are included and merged with the matching account", () => {
  const students = mergeGuideStudents(
    sources({
      bookings: [
        { ...prefs, bookingId: 1, studentUserId: "u1", studentName: "", status: "declined", message: null, blocked: false, createdAt: d(3), updatedAt: d(4) },
      ],
      introductions: [
        { neetScore: 520, preferredCountries: ["Russia"], requestId: 7, matchedUserId: "u1", fullName: "Priya S", email: "p@example.com", phone: "999", userState: "Kerala", userCity: "Kochi", courseInterest: "MBBS", message: "Climate?", createdAt: d(1) },
        { ...prefs, requestId: 8, matchedUserId: null, fullName: "murali krishnan", email: null, phone: "+91 98480 00000", userState: "Telangana", userCity: null, courseInterest: null, message: null, createdAt: d(2) },
        { ...prefs, requestId: 9, matchedUserId: null, fullName: "Murali Krishnan", email: null, phone: "919848000000", userState: "Telangana", userCity: null, courseInterest: "MBBS", message: "Again", createdAt: d(5) },
      ],
    }),
  );

  assert.equal(students.length, 2);
  const priya = students.find((s) => s.studentUserId === "u1")!;
  assert.equal(priya.name, "Priya S");
  assert.equal(priya.status, "declined");
  assert.deepEqual(priya.channels, ["requested", "introduced"]);
  assert.equal(priya.location, "Kochi, Kerala");
  assert.equal(priya.courseInterest, "MBBS");
  assert.equal(priya.neetScore, 520);
  assert.deepEqual(priya.preferredCountries, ["Russia"]);
  assert.equal(priya.interest, "Climate?");
  assert.equal(priya.canMessage, false);

  const murali = students.find((s) => s.studentUserId === null)!;
  assert.equal(murali.status, "introduced");
  assert.equal(murali.name, "murali krishnan");
  assert.equal(murali.canMessage, false);
  assert.equal(murali.lastActivityAt?.getTime(), d(5).getTime());
});

test("blocked connections and paused guides get no actions", () => {
  const blocked = mergeGuideStudents(
    sources({
      bookings: [
        { ...prefs, bookingId: 1, studentUserId: "u1", studentName: "A", status: "accepted", message: null, blocked: true, createdAt: d(1), updatedAt: d(1) },
      ],
    }),
  )[0];
  assert.equal(blocked.status, "blocked");
  assert.equal(blocked.canMessage || blocked.canCall || blocked.canAccept, false);

  const inactive = mergeGuideStudents(
    sources({
      bookings: [
        { ...prefs, bookingId: 1, studentUserId: "u1", studentName: "A", status: "pending", message: null, blocked: false, createdAt: d(1), updatedAt: d(1) },
      ],
    }),
    { guideActive: false },
  )[0];
  assert.equal(inactive.canAccept, false);
});

test("detail columns are hidden when no student has the data", () => {
  const students = mergeGuideStudents(
    sources({
      bookings: [
        { ...prefs, bookingId: 1, studentUserId: "u1", studentName: "A", status: "pending", message: null, blocked: false, createdAt: d(1), updatedAt: d(1) },
      ],
    }),
  );
  assert.deepEqual(guideStudentDetailColumns(students), { location: false, courseInterest: false });
});
