"use server";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { studentPeers, universities } from "@/lib/db/schema";
import { getUniversityPeersTag } from "@/lib/university-community";

export type ManagePeerState = {
  error?: string;
  success?: boolean;
};

function parseLanguages(raw: string | undefined): string[] | null {
  if (!raw) return null;
  const langs = raw.split(",").map((l) => l.trim()).filter(Boolean);
  return langs.length > 0 ? langs : null;
}

const peerSchema = z.object({
  universityId: z.coerce.number().int().positive("Please select a university."),
  fullName: z.string().trim().min(2, "Full name is required."),
  photoUrl: z.string().trim().url("Please enter a valid photo URL.").optional().or(z.literal("")),
  courseName: z.string().trim().optional(),
  currentYearOrBatch: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  homeState: z.string().trim().optional(),
  homeDistrict: z.string().trim().optional(),
  languages: z.string().trim().optional(),
});

export async function createPeerAction(
  _prevState: ManagePeerState,
  formData: FormData
): Promise<ManagePeerState> {
  await requireAdminSession();

  const parsed = peerSchema.safeParse({
    universityId: formData.get("universityId"),
    fullName: formData.get("fullName"),
    photoUrl: formData.get("photoUrl") || undefined,
    courseName: formData.get("courseName") || undefined,
    currentYearOrBatch: formData.get("currentYearOrBatch") || undefined,
    contactPhone: formData.get("contactPhone") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    homeState: formData.get("homeState") || undefined,
    homeDistrict: formData.get("homeDistrict") || undefined,
    languages: formData.get("languages") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const db = getDb();
  if (!db) return { error: "Database unavailable." };

  const [university] = await db
    .select({ slug: universities.slug })
    .from(universities)
    .where(eq(universities.id, parsed.data.universityId))
    .limit(1);

  if (!university) return { error: "University not found." };

  await db.insert(studentPeers).values({
    universityId: parsed.data.universityId,
    fullName: parsed.data.fullName,
    photoUrl: parsed.data.photoUrl || null,
    courseName: parsed.data.courseName ?? null,
    currentYearOrBatch: parsed.data.currentYearOrBatch ?? null,
    contactPhone: parsed.data.contactPhone ?? null,
    contactEmail: parsed.data.contactEmail ?? null,
    homeState: parsed.data.homeState ?? null,
    homeDistrict: parsed.data.homeDistrict ?? null,
    languages: parseLanguages(parsed.data.languages),
    status: "active",
  });

  revalidateTag(getUniversityPeersTag(university.slug), "hours");

  return { success: true };
}

export async function updatePeerAction(
  peerId: number,
  _prevState: ManagePeerState,
  formData: FormData
): Promise<ManagePeerState> {
  await requireAdminSession();

  const parsed = peerSchema.safeParse({
    universityId: formData.get("universityId"),
    fullName: formData.get("fullName"),
    photoUrl: formData.get("photoUrl") || undefined,
    courseName: formData.get("courseName") || undefined,
    currentYearOrBatch: formData.get("currentYearOrBatch") || undefined,
    contactPhone: formData.get("contactPhone") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    homeState: formData.get("homeState") || undefined,
    homeDistrict: formData.get("homeDistrict") || undefined,
    languages: formData.get("languages") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const db = getDb();
  if (!db) return { error: "Database unavailable." };

  const [university] = await db
    .select({ slug: universities.slug })
    .from(universities)
    .where(eq(universities.id, parsed.data.universityId))
    .limit(1);

  if (!university) return { error: "University not found." };

  await db
    .update(studentPeers)
    .set({
      universityId: parsed.data.universityId,
      fullName: parsed.data.fullName,
      photoUrl: parsed.data.photoUrl || null,
      courseName: parsed.data.courseName ?? null,
      currentYearOrBatch: parsed.data.currentYearOrBatch ?? null,
      contactPhone: parsed.data.contactPhone ?? null,
      contactEmail: parsed.data.contactEmail ?? null,
      homeState: parsed.data.homeState ?? null,
      homeDistrict: parsed.data.homeDistrict ?? null,
      languages: parseLanguages(parsed.data.languages),
      updatedAt: new Date(),
    })
    .where(eq(studentPeers.id, peerId));

  revalidateTag(getUniversityPeersTag(university.slug), "hours");

  return { success: true };
}

export async function togglePeerStatusAction(peerId: number, currentStatus: "active" | "inactive") {
  await requireAdminSession();

  const db = getDb();
  if (!db) return;

  const newStatus = currentStatus === "active" ? "inactive" : "active";

  const [peer] = await db
    .update(studentPeers)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(studentPeers.id, peerId))
    .returning({ universityId: studentPeers.universityId });

  if (peer) {
    const [university] = await db
      .select({ slug: universities.slug })
      .from(universities)
      .where(eq(universities.id, peer.universityId))
      .limit(1);

    if (university) {
      revalidateTag(getUniversityPeersTag(university.slug), "hours");
    }
  }
}
