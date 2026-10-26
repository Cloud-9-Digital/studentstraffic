import "server-only";

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { applications, countries, programOfferings, universities, userShortlists } from "@/lib/db/schema";
import {
  UNDECIDED_PROGRAMME_SLUG,
  getProgrammeLabel,
  normaliseStudentNote,
  planStartApplication,
  type ProgrammeOption,
  type StartApplicationInput,
} from "@/lib/dashboard/application-model";

/**
 * Database access for student applications and shortlists, keyed by the
 * student's real users.id (resolve it with resolveDbUserId — never trust
 * session.user.id, which is "1" for admin sessions). Every query filters by
 * that user id, so one student can never read or change another's rows.
 *
 * The mobile API routes (app/api/mobile/v1/applications) are still disabled
 * stubs; when they are enabled they should call these same functions.
 */

export type ApplicationListItem = {
  id: number;
  status: string;
  universitySlug: string;
  universityName: string;
  universityLogoUrl: string | null;
  universityCity: string | null;
  countryName: string | null;
  courseSlug: string;
  programmeLabel: string;
  programmeSlug: string | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  studentNote: string;
};

type ApplicationData = { programmeTitle?: string; programOfferingId?: number; studentNote?: string; source?: string };

function readApplicationData(value: unknown): ApplicationData {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as ApplicationData) : {};
}

const applicationColumns = {
  id: applications.id,
  status: applications.status,
  universitySlug: applications.universitySlug,
  courseSlug: applications.courseSlug,
  applicationData: applications.applicationData,
  submittedAt: applications.submittedAt,
  createdAt: applications.createdAt,
  updatedAt: applications.updatedAt,
  universityName: universities.name,
  universityLogoUrl: universities.logoUrl,
  universityCity: universities.city,
  countryName: countries.name,
  programmeTitle: programOfferings.title,
  programmeSlug: programOfferings.slug,
};

type ApplicationRowWithJoins = {
  id: number;
  status: string;
  universitySlug: string;
  courseSlug: string;
  applicationData: unknown;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  universityName: string | null;
  universityLogoUrl: string | null;
  universityCity: string | null;
  countryName: string | null;
  programmeTitle: string | null;
  programmeSlug: string | null;
};

function toListItem(row: ApplicationRowWithJoins): ApplicationListItem {
  const data = readApplicationData(row.applicationData);
  return {
    id: row.id,
    status: row.status,
    universitySlug: row.universitySlug,
    universityName: row.universityName ?? row.universitySlug,
    universityLogoUrl: row.universityLogoUrl,
    universityCity: row.universityCity,
    countryName: row.countryName,
    courseSlug: row.courseSlug,
    programmeLabel: getProgrammeLabel(row.courseSlug, row.programmeTitle, data.programmeTitle),
    programmeSlug: row.programmeSlug,
    submittedAt: row.submittedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    studentNote: typeof data.studentNote === "string" ? data.studentNote : "",
  };
}

function applicationQuery(db: NonNullable<ReturnType<typeof getDb>>) {
  return db
    .select(applicationColumns)
    .from(applications)
    .leftJoin(universities, eq(universities.slug, applications.universitySlug))
    .leftJoin(countries, eq(countries.id, universities.countryId))
    .leftJoin(
      programOfferings,
      and(eq(programOfferings.slug, applications.courseSlug), eq(programOfferings.published, true)),
    );
}

export async function listApplicationsForUser(userId: string): Promise<ApplicationListItem[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await applicationQuery(db)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.updatedAt));
  return rows.map(toListItem);
}

export async function getApplicationForUser(userId: string, applicationId: number): Promise<ApplicationListItem | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await applicationQuery(db)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .limit(1);
  return row ? toListItem(row) : null;
}

// ── Shortlist ───────────────────────────────────────────────────────────────

export type ShortlistItem = {
  id: number;
  universitySlug: string;
  universityName: string;
  universityCity: string;
  countryName: string | null;
  logoUrl: string | null;
  notes: string | null;
  createdAt: Date;
  programmes: ProgrammeOption[];
  applicationId: number | null;
  applicationStatus: string | null;
};

export async function listShortlistForUser(userId: string): Promise<ShortlistItem[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: userShortlists.id,
      notes: userShortlists.notes,
      createdAt: userShortlists.createdAt,
      universityId: universities.id,
      universitySlug: universities.slug,
      universityName: universities.name,
      universityCity: universities.city,
      logoUrl: universities.logoUrl,
      countryName: countries.name,
    })
    .from(userShortlists)
    .innerJoin(universities, eq(universities.id, userShortlists.universityId))
    .leftJoin(countries, eq(countries.id, universities.countryId))
    .where(eq(userShortlists.userId, userId))
    .orderBy(desc(userShortlists.createdAt));

  if (!rows.length) return [];

  const [programmeRows, applicationRows] = await Promise.all([
    db
      .select({ universityId: programOfferings.universityId, slug: programOfferings.slug, title: programOfferings.title })
      .from(programOfferings)
      .where(
        and(
          inArray(programOfferings.universityId, rows.map((row) => row.universityId)),
          eq(programOfferings.published, true),
        ),
      )
      .orderBy(desc(programOfferings.featured), asc(programOfferings.title)),
    db
      .select({ id: applications.id, universitySlug: applications.universitySlug, status: applications.status })
      .from(applications)
      .where(
        and(
          eq(applications.userId, userId),
          inArray(applications.universitySlug, rows.map((row) => row.universitySlug)),
        ),
      )
      .orderBy(asc(applications.createdAt)),
  ]);

  const programmesByUniversity = new Map<number, ProgrammeOption[]>();
  for (const programme of programmeRows) {
    const list = programmesByUniversity.get(programme.universityId) ?? [];
    list.push({ slug: programme.slug, title: programme.title });
    programmesByUniversity.set(programme.universityId, list);
  }
  const applicationByUniversity = new Map<string, { id: number; status: string }>();
  for (const application of applicationRows) {
    if (!applicationByUniversity.has(application.universitySlug)) {
      applicationByUniversity.set(application.universitySlug, application);
    }
  }

  return rows.map((row) => {
    const application = applicationByUniversity.get(row.universitySlug) ?? null;
    return {
      id: row.id,
      universitySlug: row.universitySlug,
      universityName: row.universityName,
      universityCity: row.universityCity,
      countryName: row.countryName,
      logoUrl: row.logoUrl,
      notes: row.notes,
      createdAt: row.createdAt,
      programmes: programmesByUniversity.get(row.universityId) ?? [],
      applicationId: application?.id ?? null,
      applicationStatus: application?.status ?? null,
    };
  });
}

/** Removes one of the student's own shortlist rows. Returns false if it was not theirs or did not exist. */
export async function removeShortlistForUser(userId: string, shortlistId: number): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const deleted = await db
    .delete(userShortlists)
    .where(and(eq(userShortlists.id, shortlistId), eq(userShortlists.userId, userId)))
    .returning({ id: userShortlists.id });
  return deleted.length > 0;
}

// ── Create / submit / withdraw ──────────────────────────────────────────────

export type StartApplicationResult =
  | { ok: true; applicationId: number; created: boolean }
  | { ok: false; error: "unavailable" | "university_not_found" | "invalid_programme" };

async function findApplicationIdForUniversity(userId: string, universitySlug: string) {
  const db = getDb();
  if (!db) return null;
  const [existing] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.userId, userId), eq(applications.universitySlug, universitySlug)))
    .orderBy(asc(applications.createdAt))
    .limit(1);
  return existing?.id ?? null;
}

/**
 * Creates a draft application (status "draft", the column default) for a
 * published university and one of its published programmes, or "undecided".
 * One application per student per university: an existing one is returned
 * instead of creating a second.
 */
export async function startApplicationForUser(userId: string, input: StartApplicationInput): Promise<StartApplicationResult> {
  const db = getDb();
  if (!db) return { ok: false, error: "unavailable" };

  const [university] = await db
    .select({ id: universities.id, slug: universities.slug })
    .from(universities)
    .where(and(eq(universities.slug, input.universitySlug), eq(universities.published, true)))
    .limit(1);
  if (!university) return { ok: false, error: "university_not_found" };

  const [existingApplicationId, programmeRows] = await Promise.all([
    findApplicationIdForUniversity(userId, university.slug),
    input.programmeSlug === UNDECIDED_PROGRAMME_SLUG
      ? Promise.resolve([] as Array<ProgrammeOption & { id: number }>)
      : db
          .select({ id: programOfferings.id, slug: programOfferings.slug, title: programOfferings.title })
          .from(programOfferings)
          .where(
            and(
              eq(programOfferings.universityId, university.id),
              eq(programOfferings.slug, input.programmeSlug),
              eq(programOfferings.published, true),
            ),
          )
          .limit(1),
  ]);

  const plan = planStartApplication({ existingApplicationId, programmeSlug: input.programmeSlug, programmes: programmeRows });
  if (plan.kind === "exists") return { ok: true, applicationId: plan.applicationId, created: false };
  if (plan.kind === "invalid_programme") return { ok: false, error: "invalid_programme" };

  const programme = plan.programme ? programmeRows.find((row) => row.slug === plan.programme?.slug) ?? null : null;
  const applicationData: ApplicationData = {
    source: "web_dashboard",
    ...(programme ? { programmeTitle: programme.title, programOfferingId: programme.id } : {}),
  };

  // Single statement so a double click cannot create two rows for the same university.
  const inserted = await db.execute<{ id: number }>(sql`
    INSERT INTO ${applications} (user_id, university_slug, course_slug, status, application_data)
    SELECT ${userId}, ${university.slug}, ${programme?.slug ?? UNDECIDED_PROGRAMME_SLUG}, 'draft', ${JSON.stringify(applicationData)}::jsonb
    WHERE NOT EXISTS (
      SELECT 1 FROM ${applications}
      WHERE ${applications.userId} = ${userId} AND ${applications.universitySlug} = ${university.slug}
    )
    RETURNING id
  `);
  const newId = inserted.rows[0]?.id;
  if (newId) return { ok: true, applicationId: Number(newId), created: true };

  const raced = await findApplicationIdForUniversity(userId, university.slug);
  return raced ? { ok: true, applicationId: raced, created: false } : { ok: false, error: "unavailable" };
}

/** Draft → submitted, saving the optional note. Only the owner's draft can be submitted. */
export async function submitApplicationForUser(userId: string, applicationId: number, note: unknown): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const studentNote = normaliseStudentNote(note);
  const now = new Date();
  const updated = await db
    .update(applications)
    .set({
      status: "submitted",
      submittedAt: now,
      updatedAt: now,
      applicationData: sql`coalesce(${applications.applicationData}, '{}'::jsonb) || ${JSON.stringify({ studentNote })}::jsonb`,
    })
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId), eq(applications.status, "draft")))
    .returning({ id: applications.id });
  return updated.length > 0;
}

/** Deletes the owner's own draft (never a submitted application). */
export async function withdrawDraftForUser(userId: string, applicationId: number): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const deleted = await db
    .delete(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId), eq(applications.status, "draft")))
    .returning({ id: applications.id });
  return deleted.length > 0;
}
