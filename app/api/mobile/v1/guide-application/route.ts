import { asc, desc, eq, or } from "drizzle-orm";
import { getDb } from "@/lib/db/server";
import { countries, studentPeerApplications, studentPeers, universities } from "@/lib/db/schema";
import { submitGuideApplication } from "@/lib/guide-application";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in to apply.", 401);
  const db = getDb();
  if (!db) return mobileError("unavailable", "Please try again shortly.", 503);
  const [applications, peers, options] = await Promise.all([
    db.select({ status: studentPeerApplications.status, createdAt: studentPeerApplications.createdAt }).from(studentPeerApplications).where(or(eq(studentPeerApplications.peerUserId, session.user.id), eq(studentPeerApplications.email, session.user.email))).orderBy(desc(studentPeerApplications.createdAt), desc(studentPeerApplications.id)).limit(1),
    db.select({ status: studentPeers.status }).from(studentPeers).where(eq(studentPeers.peerUserId, session.user.id)),
    db.select({ id: universities.id, name: universities.name, country: countries.name }).from(universities).leftJoin(countries, eq(countries.id, universities.countryId)).where(eq(universities.published, true)).orderBy(asc(universities.name)),
  ]);
  return mobileJson({ application: applications[0] ?? null, guideStatus: peers.some(p => p.status === "active") ? "active" : peers.length ? "inactive" : null, universities: options });
}
export async function POST(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in to apply.", 401);
  if (Number(request.headers.get("content-length")) > 16 * 1024 * 1024) return mobileError("too_large", "Files are too large.", 413);
  let form: FormData;
  try { form = await request.formData(); } catch { return mobileError("invalid", "Please check your application files.", 400); }
  const result = await submitGuideApplication(form, session.user, request.headers);
  return result.error ? mobileError("invalid", result.error, 400) : mobileJson(result);
}
