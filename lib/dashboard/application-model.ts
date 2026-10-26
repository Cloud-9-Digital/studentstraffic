/**
 * Pure rules for student applications (no database, no server-only imports),
 * so the dashboard pages, the server actions and the unit tests share one
 * definition of statuses, steps, input validation and the duplicate rule.
 * The database calls live in lib/dashboard/applications.ts.
 */

import { siteConfig } from "@/lib/constants";

/** Statuses the `applications.status` column holds. New applications start as `draft` (the column default). */
export const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "waitlisted",
  "accepted",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Stored in `course_slug` when the student has not picked a programme; the counsellor helps them choose. */
export const UNDECIDED_PROGRAMME_SLUG = "undecided";

export type StatusTone = "neutral" | "blue" | "amber" | "violet" | "green" | "red";

export type ApplicationStatusMeta = {
  status: ApplicationStatus;
  label: string;
  /** One plain-language sentence about what happens now. */
  description: string;
  tone: StatusTone;
  /** Index into APPLICATION_STEPS of the step this status sits on. */
  stepIndex: number;
};

export const APPLICATION_STEPS = ["Draft", "Submitted", "In review", "Decision"] as const;

const STATUS_META: Record<ApplicationStatus, Omit<ApplicationStatusMeta, "status">> = {
  draft: {
    label: "Draft",
    description: "Not sent yet. Check the details and submit it when you are ready.",
    tone: "neutral",
    stepIndex: 0,
  },
  submitted: {
    label: "Submitted",
    description: "Ready for review. Message a counsellor on WhatsApp with your reference so they can review it and contact you.",
    tone: "blue",
    stepIndex: 1,
  },
  under_review: {
    label: "In review",
    description: "A counsellor is reviewing your application and documents with you.",
    tone: "amber",
    stepIndex: 2,
  },
  waitlisted: {
    label: "Waitlisted",
    description: "The university has put this application on its waiting list.",
    tone: "violet",
    stepIndex: 2,
  },
  accepted: {
    label: "Offer received",
    description: "The university has made you an offer. Your counsellor will guide the next steps.",
    tone: "green",
    stepIndex: 3,
  },
  rejected: {
    label: "Closed",
    description: "This application did not go ahead. Your counsellor can suggest alternatives.",
    tone: "red",
    stepIndex: 3,
  },
};

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && (APPLICATION_STATUSES as readonly string[]).includes(value);
}

/** Unknown statuses (set by hand in the database) fall back to Draft rather than crashing the page. */
export function getApplicationStatusMeta(status: string): ApplicationStatusMeta {
  const key: ApplicationStatus = isApplicationStatus(status) ? status : "draft";
  return { status: key, ...STATUS_META[key] };
}

export type ApplicationStep = { label: string; state: "done" | "current" | "upcoming" };

/** Draft → Submitted → In review → Decision, with the last step renamed to the actual outcome. */
export function getApplicationSteps(status: string): ApplicationStep[] {
  const meta = getApplicationStatusMeta(status);
  return APPLICATION_STEPS.map((label, index) => {
    const stepLabel =
      index === 3 && meta.status === "accepted"
        ? "Offer"
        : index === 3 && meta.status === "rejected"
          ? "Closed"
          : index === 2 && meta.status === "waitlisted"
            ? "Waitlisted"
            : label;
    const isFinal = meta.stepIndex === APPLICATION_STEPS.length - 1;
    const state: ApplicationStep["state"] =
      index < meta.stepIndex || (isFinal && index === meta.stepIndex)
        ? "done"
        : index === meta.stepIndex
          ? "current"
          : "upcoming";
    return { label: stepLabel, state };
  });
}

/** The one thing the student should do next on an application card. */
export function getApplicationNextAction(status: string): { label: string; emphasis: "primary" | "secondary" } {
  return getApplicationStatusMeta(status).status === "draft"
    ? { label: "Continue", emphasis: "primary" }
    : { label: "View", emphasis: "secondary" };
}

export function canEditApplication(status: string) {
  return getApplicationStatusMeta(status).status === "draft";
}

// ── Input validation ────────────────────────────────────────────────────────

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_STUDENT_NOTE_LENGTH = 1000;

export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 255 && SLUG_PATTERN.test(value);
}

/** Positive integer id from a form field or route param; null otherwise. */
export function parsePositiveId(raw: unknown): number | null {
  if (typeof raw !== "string" && typeof raw !== "number") return null;
  const text = String(raw).trim();
  if (!/^\d{1,9}$/.test(text)) return null;
  const id = Number(text);
  return id > 0 ? id : null;
}

export type StartApplicationInput = { universitySlug: string; programmeSlug: string };

export function parseStartApplicationInput(
  values: { universitySlug: unknown; programmeSlug: unknown },
): { ok: true; value: StartApplicationInput } | { ok: false; error: string } {
  if (!isValidSlug(values.universitySlug)) return { ok: false, error: "Choose a university from your shortlist." };
  const programme = values.programmeSlug === "" || values.programmeSlug == null ? UNDECIDED_PROGRAMME_SLUG : values.programmeSlug;
  if (!isValidSlug(programme)) return { ok: false, error: "Choose a programme, or pick “Not sure yet”." };
  return { ok: true, value: { universitySlug: values.universitySlug, programmeSlug: programme } };
}

/** Trims, collapses runaway whitespace and caps the optional note to the counsellor. */
export function normaliseStudentNote(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, MAX_STUDENT_NOTE_LENGTH);
}

// ── Duplicate rule ──────────────────────────────────────────────────────────

export type ProgrammeOption = { slug: string; title: string };

export type StartApplicationPlan =
  | { kind: "exists"; applicationId: number }
  | { kind: "invalid_programme" }
  | { kind: "create"; programme: ProgrammeOption | null };

/**
 * One application per student per university (any status). The table has no
 * unique index, so the insert also re-checks this in SQL (insert … where not exists).
 */
export function planStartApplication(input: {
  existingApplicationId: number | null;
  programmeSlug: string;
  programmes: ProgrammeOption[];
}): StartApplicationPlan {
  if (input.existingApplicationId) return { kind: "exists", applicationId: input.existingApplicationId };
  if (input.programmeSlug === UNDECIDED_PROGRAMME_SLUG) return { kind: "create", programme: null };
  const programme = input.programmes.find((option) => option.slug === input.programmeSlug);
  return programme ? { kind: "create", programme } : { kind: "invalid_programme" };
}

// ── Display helpers ─────────────────────────────────────────────────────────

/** Programme name for display: catalogue title, then the title saved at creation, then the slug. */
export function getProgrammeLabel(courseSlug: string, catalogueTitle?: string | null, savedTitle?: unknown): string {
  if (catalogueTitle) return catalogueTitle;
  if (typeof savedTitle === "string" && savedTitle.trim()) return savedTitle.trim();
  if (courseSlug === UNDECIDED_PROGRAMME_SLUG) return "Programme not chosen yet";
  const words = courseSlug.replace(/-/g, " ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "Programme not chosen yet";
}

/** Up to two initials for the logo fallback, ignoring filler words. */
export function getUniversityInitials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/[\s-]+/)
    .filter((word) => word && !/^(of|the|and|for|de|di|la|le|du|des|del|der|und|y|i)$/i.test(word));
  const initials = words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join("");
  return initials || "U";
}

const LOGO_COLOURS = [
  "bg-[#e6f2ef] text-[#0f3d37]",
  "bg-[#e8effc] text-[#1d4ed8]",
  "bg-[#fdf1e4] text-[#b45309]",
  "bg-[#f3eafc] text-[#6d28d9]",
  "bg-[#fde8ec] text-[#be123c]",
  "bg-[#e7f6fb] text-[#0e7490]",
] as const;

/** Stable colour per university so the same initials always get the same circle. */
export function getInitialsColour(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return LOGO_COLOURS[hash % LOGO_COLOURS.length];
}

/** WhatsApp chat with the counselling team, prefilled with the application reference (no personal data). */
export function buildCounsellorWhatsappHref(input: {
  universityName: string;
  programmeLabel?: string | null;
  applicationId?: number | null;
}): string {
  const parts = [`Hi Students Traffic, I'd like a counsellor to review my application to ${input.universityName}`];
  if (input.programmeLabel && input.programmeLabel !== "Programme not chosen yet") parts.push(`for ${input.programmeLabel}`);
  if (input.applicationId) parts.push(`(application #${input.applicationId})`);
  const text = `${parts.join(" ")}.`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function formatDashboardDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
