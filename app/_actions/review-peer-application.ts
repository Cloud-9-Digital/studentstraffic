"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import {
  studentPeerApplications,
  studentPeers,
  universities,
} from "@/lib/db/schema";
import { sendApplicationApprovedEmail } from "@/lib/email/templates/application-approved";
import { sendApplicationRejectedEmail } from "@/lib/email/templates/application-rejected";
import { getUniversityPeersTag } from "@/lib/university-community";

export async function approvePeerApplicationAction(applicationId: number) {
  const admin = await requireAdminSession();
  const db = getDb();
  if (!db) return;

  const [application] = await db
    .select()
    .from(studentPeerApplications)
    .where(eq(studentPeerApplications.id, applicationId))
    .limit(1);

  if (!application || application.status !== "pending") return;

  const [university] = await db
    .select({ slug: universities.slug, name: universities.name })
    .from(universities)
    .where(eq(universities.id, application.universityId))
    .limit(1);

  if (!university) return;

  await db
    .update(studentPeerApplications)
    .set({
      status: "approved",
      reviewedByAdminId: admin.user.adminUserId,
      updatedAt: new Date(),
    })
    .where(eq(studentPeerApplications.id, applicationId));

  await db.insert(studentPeers).values({
    universityId: application.universityId,
    fullName: application.fullName,
    photoUrl: application.photoUrl ?? null,
    courseName: application.courseName,
    currentYearOrBatch: application.currentYearOrBatch,
    contactPhone: application.phone,
    contactEmail: application.email,
    status: "active",
  });

  revalidateTag(getUniversityPeersTag(university.slug), "hours");
  revalidatePath("/admin/peer-applications");
  revalidatePath(`/admin/peer-applications/${applicationId}`);

  void sendApplicationApprovedEmail({
    applicantName: application.fullName,
    applicantEmail: application.email,
    universityName: university.name,
    universitySlug: university.slug,
  });
}

export async function rejectPeerApplicationAction(
  applicationId: number,
  reviewNotes?: string
) {
  const admin = await requireAdminSession();
  const db = getDb();
  if (!db) return;

  const [application] = await db
    .select({
      fullName: studentPeerApplications.fullName,
      email: studentPeerApplications.email,
      universityId: studentPeerApplications.universityId,
    })
    .from(studentPeerApplications)
    .where(eq(studentPeerApplications.id, applicationId))
    .limit(1);

  await db
    .update(studentPeerApplications)
    .set({
      status: "rejected",
      reviewedByAdminId: admin.user.adminUserId,
      reviewNotes: reviewNotes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(studentPeerApplications.id, applicationId));

  revalidatePath("/admin/peer-applications");
  revalidatePath(`/admin/peer-applications/${applicationId}`);

  if (application) {
    const [university] = await db
      .select({ name: universities.name })
      .from(universities)
      .where(eq(universities.id, application.universityId))
      .limit(1);

    void sendApplicationRejectedEmail({
      applicantName: application.fullName,
      applicantEmail: application.email,
      universityName: university?.name ?? "",
      reviewNotes: reviewNotes,
    });
  }
}
