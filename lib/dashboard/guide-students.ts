/**
 * "My students" for a guide (peer mentor): every distinct student who has
 * requested a call, been accepted or declined, messaged or called the guide,
 * plus anyone the Students Traffic team introduced through the older
 * university-page form (`peer_requests.matched_peer_id`).
 *
 * Pure merge logic only, so it can be unit-tested without a database. The
 * bounded queries that feed it live in `guide-students-data.ts`.
 */

export type StudentPreferences = {
  neetScore: number | null;
  preferredCountries: string[] | null;
};

export type BookingSource = StudentPreferences & {
  bookingId: number;
  studentUserId: string;
  studentName: string | null;
  status: string;
  message: string | null;
  blocked: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ConversationSource = StudentPreferences & {
  conversationId: number;
  studentUserId: string;
  studentName: string | null;
  lastMessageAt: Date | null;
  createdAt: Date | null;
  unreadCount: number;
};

export type CallSource = StudentPreferences & {
  studentUserId: string;
  studentName: string | null;
  callCount: number;
  callsThisMonth: number;
  lastCallAt: Date | null;
};

/** Older form-based introductions; `matchedUserId` is set when the email matches an account. */
export type IntroductionSource = StudentPreferences & {
  requestId: number;
  matchedUserId: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  userState: string | null;
  userCity: string | null;
  courseInterest: string | null;
  message: string | null;
  createdAt: Date | null;
};

export type GuideStudentSources = {
  bookings: BookingSource[];
  conversations: ConversationSource[];
  calls: CallSource[];
  introductions: IntroductionSource[];
};

export type GuideStudentChannel = "requested" | "messaged" | "called" | "introduced";

export type GuideStudentStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "blocked"
  | "introduced"
  | "contacted";

export type GuideStudent = {
  key: string;
  studentUserId: string | null;
  name: string;
  status: GuideStudentStatus;
  channels: GuideStudentChannel[];
  bookingId: number | null;
  conversationId: number | null;
  unreadCount: number;
  callCount: number;
  callsThisMonth: number;
  /** What the student said they want to discuss (request message, or form message). */
  interest: string | null;
  courseInterest: string | null;
  location: string | null;
  preferredCountries: string[];
  neetScore: number | null;
  firstContactAt: Date | null;
  lastActivityAt: Date | null;
  canAccept: boolean;
  canMessage: boolean;
  /** Calls also need voice calling to be configured; the page checks that. */
  canCall: boolean;
};

function latest(...dates: (Date | null | undefined)[]): Date | null {
  let result: Date | null = null;
  for (const date of dates) {
    if (date && (!result || date.getTime() > result.getTime())) result = date;
  }
  return result;
}

function earliest(...dates: (Date | null | undefined)[]): Date | null {
  let result: Date | null = null;
  for (const date of dates) {
    if (date && (!result || date.getTime() < result.getTime())) result = date;
  }
  return result;
}

function clean(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

function introductionKey(row: IntroductionSource) {
  if (row.matchedUserId) return `user:${row.matchedUserId}`;
  const contact = clean(row.email)?.toLowerCase() ?? clean(row.phone)?.replace(/\D/g, "");
  return contact ? `contact:${contact}` : `intro:${row.requestId}`;
}

function blankStudent(key: string, studentUserId: string | null): GuideStudent {
  return {
    key,
    studentUserId,
    name: "Student",
    status: "contacted",
    channels: [],
    bookingId: null,
    conversationId: null,
    unreadCount: 0,
    callCount: 0,
    callsThisMonth: 0,
    interest: null,
    courseInterest: null,
    location: null,
    preferredCountries: [],
    neetScore: null,
    firstContactAt: null,
    lastActivityAt: null,
    canAccept: false,
    canMessage: false,
    canCall: false,
  };
}

function addChannel(student: GuideStudent, channel: GuideStudentChannel) {
  if (!student.channels.includes(channel)) student.channels.push(channel);
}

function applyPreferences(student: GuideStudent, prefs: StudentPreferences) {
  if (student.neetScore == null && prefs.neetScore != null) student.neetScore = prefs.neetScore;
  if (student.preferredCountries.length === 0 && prefs.preferredCountries?.length) {
    student.preferredCountries = prefs.preferredCountries.filter((c) => typeof c === "string" && c.trim());
  }
}

function applyName(student: GuideStudent, name: string | null | undefined) {
  const text = clean(name);
  if (text && student.name === "Student") student.name = text;
}

const CHANNEL_ORDER: GuideStudentChannel[] = ["requested", "messaged", "called", "introduced"];

/**
 * Merge the four sources into one row per student, keyed by user id (form
 * introductions without an account fall back to email/phone so duplicates of
 * the same person collapse). Sorted by most recent activity first.
 */
export function mergeGuideStudents(
  sources: GuideStudentSources,
  options: { guideActive?: boolean } = {},
): GuideStudent[] {
  const guideActive = options.guideActive ?? true;
  const byKey = new Map<string, GuideStudent>();
  const get = (key: string, studentUserId: string | null) => {
    let student = byKey.get(key);
    if (!student) {
      student = blankStudent(key, studentUserId);
      byKey.set(key, student);
    }
    return student;
  };

  for (const booking of sources.bookings) {
    const student = get(`user:${booking.studentUserId}`, booking.studentUserId);
    // One booking per (student, guide) is enforced by a unique index; keep the newest if not.
    if (student.bookingId != null) continue;
    student.bookingId = booking.bookingId;
    applyName(student, booking.studentName);
    applyPreferences(student, booking);
    addChannel(student, "requested");
    student.status = booking.blocked
      ? "blocked"
      : booking.status === "pending" || booking.status === "accepted" || booking.status === "declined" || booking.status === "cancelled"
        ? booking.status
        : "contacted";
    student.interest = clean(booking.message) ?? student.interest;
    student.firstContactAt = earliest(student.firstContactAt, booking.createdAt);
    student.lastActivityAt = latest(student.lastActivityAt, booking.createdAt, booking.updatedAt);
    const open = guideActive && !booking.blocked;
    student.canAccept = open && booking.status === "pending";
    student.canMessage = open && (booking.status === "pending" || booking.status === "accepted");
    student.canCall = open && booking.status === "accepted";
  }

  for (const conversation of sources.conversations) {
    const student = get(`user:${conversation.studentUserId}`, conversation.studentUserId);
    student.conversationId ??= conversation.conversationId;
    student.unreadCount += conversation.unreadCount;
    applyName(student, conversation.studentName);
    applyPreferences(student, conversation);
    if (conversation.lastMessageAt) addChannel(student, "messaged");
    student.firstContactAt = earliest(student.firstContactAt, conversation.createdAt);
    student.lastActivityAt = latest(student.lastActivityAt, conversation.lastMessageAt, conversation.createdAt);
  }

  for (const call of sources.calls) {
    const student = get(`user:${call.studentUserId}`, call.studentUserId);
    student.callCount += call.callCount;
    student.callsThisMonth += call.callsThisMonth;
    applyName(student, call.studentName);
    applyPreferences(student, call);
    if (call.callCount > 0) addChannel(student, "called");
    student.firstContactAt = earliest(student.firstContactAt, call.lastCallAt);
    student.lastActivityAt = latest(student.lastActivityAt, call.lastCallAt);
  }

  for (const intro of sources.introductions) {
    const key = introductionKey(intro);
    const student = get(key, intro.matchedUserId);
    addChannel(student, "introduced");
    applyName(student, intro.fullName);
    applyPreferences(student, intro);
    student.courseInterest ??= clean(intro.courseInterest);
    student.location ??= [clean(intro.userCity), clean(intro.userState)].filter(Boolean).join(", ") || null;
    student.interest ??= clean(intro.message);
    if (student.status === "contacted" && student.bookingId == null) student.status = "introduced";
    student.firstContactAt = earliest(student.firstContactAt, intro.createdAt);
    student.lastActivityAt = latest(student.lastActivityAt, intro.createdAt);
  }

  const students = [...byKey.values()];
  for (const student of students) {
    student.channels.sort((a, b) => CHANNEL_ORDER.indexOf(a) - CHANNEL_ORDER.indexOf(b));
  }
  return students.sort(
    (a, b) => (b.lastActivityAt?.getTime() ?? 0) - (a.lastActivityAt?.getTime() ?? 0),
  );
}

export const GUIDE_STUDENT_STATUS_LABEL: Record<GuideStudentStatus, string> = {
  pending: "Request pending",
  accepted: "Accepted",
  declined: "Declined",
  cancelled: "Cancelled by student",
  blocked: "Blocked",
  introduced: "Introduced by our team",
  contacted: "Contacted you",
};

export const GUIDE_STUDENT_CHANNEL_LABEL: Record<GuideStudentChannel, string> = {
  requested: "Requested a call",
  messaged: "Messaged",
  called: "Called",
  introduced: "Introduced by our team",
};

/** Which optional detail columns have any data, so empty ones can be hidden. */
export function guideStudentDetailColumns(students: GuideStudent[]) {
  return {
    location: students.some((s) => s.location),
    courseInterest: students.some((s) => s.courseInterest || s.preferredCountries.length || s.neetScore != null),
  };
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

/** Dates are formatted on the server (in India time) so client lists hydrate without mismatches. */
export function formatGuideDate(date: Date | null | undefined, withTime = false): string | null {
  if (!date) return null;
  return (withTime ? DATE_TIME_FORMAT : DATE_FORMAT).format(date);
}

/** Serializable row for client lists: dates pre-formatted, no contact details. */
export type GuideStudentRow = Omit<GuideStudent, "firstContactAt" | "lastActivityAt"> & {
  lastActivityLabel: string | null;
  lastActivityTime: number;
};

export function toGuideStudentRow(student: GuideStudent): GuideStudentRow {
  const { firstContactAt: _first, lastActivityAt, ...rest } = student;
  void _first;
  return {
    ...rest,
    lastActivityLabel: formatGuideDate(lastActivityAt, true),
    lastActivityTime: lastActivityAt?.getTime() ?? 0,
  };
}

/** "Requested a call · Messaged · Called 2×" */
export function describeGuideStudentChannels(student: Pick<GuideStudent, "channels" | "callCount">): string {
  return student.channels
    .map((channel) =>
      channel === "called" && student.callCount > 1
        ? `Called ${student.callCount}×`
        : GUIDE_STUDENT_CHANNEL_LABEL[channel],
    )
    .join(" · ");
}
