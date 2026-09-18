"use server";

import { revalidateTag } from "next/cache";
import { allPeersTag, getUniversityPeersTag } from "@/lib/university-community";
import { eq } from "drizzle-orm";
import { containsPeerContactDetails, PEER_CONTACT_POLICY_ERROR } from "@/lib/peer-contact-policy";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { studentPeers, universities } from "@/lib/db/schema";
import { isAllowedPhotoType, uploadFileToCloudinary } from "@/lib/cloudinary-upload";
import { resolveDbUserId } from "@/lib/server-session";

export type UpdatePeerProfileState = { status: "idle" | "success" | "error"; message?: string };

export async function updatePeerProfileAction(
  _: UpdatePeerProfileState,
  formData: FormData
): Promise<UpdatePeerProfileState> {
  const session = await auth();
  if (!session?.user?.email) return { status: "error", message: "Not signed in." };

  const db = getDb();
  if (!db) return { status: "error", message: "Service unavailable. Please try again." };

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) return { status: "error", message: "Account not found. Please sign in again." };

  const [peer] = await db
    .select({ id: studentPeers.id, photoUrl: studentPeers.photoUrl, universityId: studentPeers.universityId })
    .from(studentPeers)
    .where(eq(studentPeers.peerUserId, userId))
    .limit(1);

  if (!peer) return { status: "error", message: "Guide profile not found." };

  const courseName = (formData.get("courseName") as string | null)?.trim() || null;
  const currentYearOrBatch = (formData.get("currentYearOrBatch") as string | null)?.trim() || null;
  const homeState = (formData.get("homeState") as string | null)?.trim() || null;
  const homeCity = (formData.get("homeCity") as string | null)?.trim() || null;
  const languagesRaw = formData.get("languages") as string | null;
  const languages = languagesRaw
    ? languagesRaw.split(",").map((l) => l.trim()).filter(Boolean)
    : [];

  if ([courseName, currentYearOrBatch, homeState, homeCity, ...languages]
    .some((value) => value && containsPeerContactDetails(value))) {
    return { status: "error", message: PEER_CONTACT_POLICY_ERROR };
  }

  let photoUrl = peer.photoUrl;
  const photoFile = formData.get("photo");
  if (photoFile instanceof File && photoFile.size > 0) {
    if (!isAllowedPhotoType(photoFile.type)) {
      return { status: "error", message: "Photo must be a JPG, PNG, or WebP image." };
    }
    if (photoFile.size > 5 * 1024 * 1024) {
      return { status: "error", message: "Photo must be under 5 MB." };
    }
    try {
      const { url } = await uploadFileToCloudinary(photoFile, {
        folder: "peer-photos",
        resourceType: "image",
      });
      photoUrl = url;
    } catch {
      return { status: "error", message: "Photo upload failed. Please try again." };
    }
  }

  await db
    .update(studentPeers)
    .set({
      acceptingRequests: formData.get("acceptingRequests") === "on",
      courseName,
      currentYearOrBatch,
      homeState,
      homeCity,
      languages,
      photoUrl,
      updatedAt: new Date(),
    })
    .where(eq(studentPeers.id, peer.id));

  revalidateTag(allPeersTag, "max");
  const [university] = await db.select({ slug: universities.slug }).from(universities).where(eq(universities.id, peer.universityId)).limit(1);
  if (university) revalidateTag(getUniversityPeersTag(university.slug), "max");

  return { status: "success", message: "Profile updated." };
}
