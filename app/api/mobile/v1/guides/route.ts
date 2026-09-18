import { containsPeerContactDetails } from "@/lib/peer-contact-policy";
import { and, asc, eq, ilike, isNotNull, isNull, ne, or, sql } from "drizzle-orm";
import { getDb } from "@/lib/db/server";
import { countries, peerCallBookings, studentPeers, universities } from "@/lib/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";
import { mapMobileGuide } from "@/lib/mobile/guide-directory";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in to browse student guides.", 401);
  const db = getDb();
  if (!db) return mobileError("unavailable", "Student guides are temporarily unavailable.", 503);
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Math.min(1000, Number.parseInt(params.get("page") ?? "1", 10) || 1));
  const query = (params.get("q") ?? "").trim().slice(0, 120);
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  const value = (key: string) => (params.get(key) ?? "").trim().slice(0, 150);
  const base = and(eq(studentPeers.status, "active"), eq(universities.published, true), isNotNull(studentPeers.peerUserId), ne(studentPeers.peerUserId, session.user.id), isNull(peerCallBookings.studentBlockedAt), isNull(peerCallBookings.peerBlockedAt));
  const facetQuery = db.select({ country: countries.name, countrySlug: countries.slug, university: universities.name, universitySlug: universities.slug, course: studentPeers.courseName, year: studentPeers.currentYearOrBatch, state: studentPeers.homeState, languages: studentPeers.languages })
    .from(studentPeers).innerJoin(universities, eq(universities.id, studentPeers.universityId))
    .leftJoin(countries, eq(countries.id, universities.countryId))
    .leftJoin(peerCallBookings, and(eq(peerCallBookings.peerId, studentPeers.id), eq(peerCallBookings.studentUserId, session.user.id))).where(base);
  const rowQuery = db.select({
    id: studentPeers.id, fullName: studentPeers.fullName, photoUrl: studentPeers.photoUrl,
    courseName: studentPeers.courseName, currentYearOrBatch: studentPeers.currentYearOrBatch,
    languages: studentPeers.languages, acceptingRequests: studentPeers.acceptingRequests,
    universityName: universities.name, universitySlug: universities.slug, countryName: countries.name,
    bookingStatus: peerCallBookings.status, bookingUpdatedAt: peerCallBookings.updatedAt,
  }).from(studentPeers)
    .innerJoin(universities, eq(universities.id, studentPeers.universityId))
    .leftJoin(countries, eq(countries.id, universities.countryId))
    .leftJoin(peerCallBookings, and(eq(peerCallBookings.peerId, studentPeers.id), eq(peerCallBookings.studentUserId, session.user.id)))
    .where(and(base,
      value("country") ? eq(countries.slug, value("country")) : undefined,
      value("university") ? eq(universities.slug, value("university")) : undefined,
      value("course") ? eq(studentPeers.courseName, value("course")) : undefined,
      value("year") ? eq(studentPeers.currentYearOrBatch, value("year")) : undefined,
      value("state") ? eq(studentPeers.homeState, value("state")) : undefined,
      value("language") ? sql`${value("language")} = any(${studentPeers.languages})` : undefined,
      query ? or(ilike(studentPeers.fullName, pattern), ilike(studentPeers.courseName, pattern), ilike(universities.name, pattern), ilike(countries.name, pattern)) : undefined))
    .orderBy(asc(universities.name), asc(studentPeers.id)).limit(25).offset((page - 1) * 24);
  const [rows, facets] = await Promise.all([rowQuery, facetQuery]);
  const unique = (values: (string | null)[]) => [...new Set(values.filter((v): v is string => Boolean(v) && !containsPeerContactDetails(v!)))].sort((a,b) => a.localeCompare(b));
  const pairs = (values: { value: string | null; label: string | null }[]) => [...new Map(values.filter(v => v.value && v.label).map(v => [v.value!, { value: v.value!, label: v.label! }])).values()].sort((a,b) => a.label.localeCompare(b.label));
  const options = {
    country: pairs(facets.map(f => ({ value: f.countrySlug, label: f.country }))),
    university: pairs(facets.map(f => ({ value: f.universitySlug, label: f.university }))),
    course: unique(facets.map(f => f.course)).map(value => ({ value, label: value })),
    year: unique(facets.map(f => f.year)).map(value => ({ value, label: value })),
    state: unique(facets.map(f => f.state)).map(value => ({ value, label: value })),
    language: unique(facets.flatMap(f => f.languages ?? [])).map(value => ({ value, label: value })),
  };
  return mobileJson({ options, guides: rows.slice(0, 24).map(row => mapMobileGuide(row)), hasNextPage: rows.length > 24 });
}
