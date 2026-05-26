"use server";

import { and, eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getFormString, getIpAddress } from "@/app/_actions/form-helpers";
import { getDb } from "@/lib/db/server";
import { studentPeerApplications, universities, users } from "@/lib/db/schema";
import {
  isAllowedPhotoType,
  isAllowedProofType,
  uploadFileToCloudinary,
} from "@/lib/cloudinary-upload";
import { sendApplicationReceivedEmail } from "@/lib/email/templates/application-received";
import { sendAdminNewApplicationEmail } from "@/lib/email/templates/admin-new-application";
import { consumePublicFormRateLimits } from "@/lib/security/public-form-guard";

export type JoinAsPeerState = {
  error?: string;
  success?: boolean;
};

const schema = z.object({
  universityId: z.coerce.number().int().positive("Please select your university."),
  courseName: z.string().trim().optional(),
  currentYearOrBatch: z.string().trim().optional(),
  enrollmentStatus: z.enum(["current_student", "alumnus"]),
  homeState: z.string().trim().optional(),
  homeCity: z.string().trim().optional(),
  languages: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  message: z.string().trim().optional(),
  website: z.string().trim().optional(),
});

export async function joinAsPeerAction(formData: FormData): Promise<JoinAsPeerState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in before submitting your application." };
  }

  const parsed = schema.safeParse({
    universityId: getFormString(formData, "universityId"),
    courseName: getFormString(formData, "courseName") || undefined,
    currentYearOrBatch: getFormString(formData, "currentYearOrBatch") || undefined,
    enrollmentStatus: getFormString(formData, "enrollmentStatus"),
    homeState: getFormString(formData, "homeState") || undefined,
    homeCity: getFormString(formData, "homeCity") || undefined,
    languages: getFormString(formData, "languages") || undefined,
    phone: getFormString(formData, "phone") || undefined,
    message: getFormString(formData, "message") || undefined,
    website: getFormString(formData, "website"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const data = parsed.data;

  if (data.website) {
    return { error: "Spam detection triggered. Please try again." };
  }

  const photoFile = formData.get("photoFile");
  const proofFile = formData.get("proofFile");

  if (!(proofFile instanceof File) || proofFile.size === 0) {
    return { error: "Please upload your college ID or admission letter." };
  }
  if (!isAllowedProofType(proofFile.type)) {
    return { error: "College ID must be a JPG, PNG, or PDF file." };
  }
  if (photoFile instanceof File && photoFile.size > 0 && !isAllowedPhotoType(photoFile.type)) {
    return { error: "Profile photo must be a JPG, PNG, or WebP image." };
  }

  const db = getDb();
  if (!db) return { error: "Service temporarily unavailable. Try again shortly." };

  // Fetch user profile
  const [user] = await db
    .select({ name: users.name, email: users.email, phone: users.phone })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) return { error: "Your account could not be found. Please sign in again." };

  const applicantName = user.name ?? user.email.split("@")[0];
  const applicantEmail = user.email;
  const applicantPhone = data.phone ?? user.phone ?? "";

  if (!applicantPhone) {
    return { error: "Please enter your WhatsApp number." };
  }

  // Save phone to user profile if they just provided it and don't have one
  if (data.phone && !user.phone) {
    await db
      .update(users)
      .set({ phone: data.phone, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));
  }

  const headerStore = await headers();
  const ipAddress = getIpAddress(headerStore);

  const rateLimitError = await consumePublicFormRateLimits(
    [
      ipAddress
        ? {
            scope: "public:peer_application:ip",
            identifier: ipAddress,
            limit: 3,
            windowMs: 60 * 60_000,
            blockMs: 4 * 60 * 60_000,
          }
        : null,
    ],
    "applications"
  );
  if (rateLimitError) return { error: rateLimitError };

  // Check for existing application
  const [existingApp] = await db
    .select({ id: studentPeerApplications.id, status: studentPeerApplications.status })
    .from(studentPeerApplications)
    .where(
      and(
        or(
          eq(studentPeerApplications.email, applicantEmail),
          eq(studentPeerApplications.phone, applicantPhone)
        ),
        or(
          eq(studentPeerApplications.status, "pending"),
          eq(studentPeerApplications.status, "approved")
        )
      )
    )
    .limit(1);

  if (existingApp) {
    if (existingApp.status === "approved") {
      return { error: "Your profile is already live on the platform." };
    }
    return { error: "Your application is already under review. We will email you once it is approved." };
  }

  const [university] = await db
    .select({ id: universities.id, name: universities.name, countryId: universities.countryId })
    .from(universities)
    .where(eq(universities.id, data.universityId))
    .limit(1);

  if (!university) return { error: "University not found. Please select again." };

  // Upload files
  let photoUrl: string | null = null;
  let proofUrl: string;

  try {
    if (photoFile instanceof File && photoFile.size > 0) {
      const result = await uploadFileToCloudinary(photoFile, {
        folder: "studentstraffic/peer-applications/photos",
        resourceType: "image",
        maxBytes: 5 * 1024 * 1024,
      });
      photoUrl = result.url;
    }
    const proofResult = await uploadFileToCloudinary(proofFile, {
      folder: "studentstraffic/peer-applications/proofs",
      resourceType: "auto",
      maxBytes: 10 * 1024 * 1024,
    });
    proofUrl = proofResult.url;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "File upload failed." };
  }

  const [inserted] = await db
    .insert(studentPeerApplications)
    .values({
      universityId: data.universityId,
      countryId: university.countryId ?? null,
      peerUserId: session.user.id,
      fullName: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      photoUrl,
      courseName: data.courseName ?? null,
      currentYearOrBatch: data.currentYearOrBatch ?? null,
      enrollmentStatus: data.enrollmentStatus,
      homeState: data.homeState ?? null,
      homeCity: data.homeCity ?? null,
      languages: data.languages
        ? data.languages.split(",").map((l) => l.trim()).filter(Boolean)
        : null,
      proofUrl,
      message: data.message ?? null,
      status: "pending",
    })
    .returning({ id: studentPeerApplications.id });

  void Promise.all([
    sendApplicationReceivedEmail({
      applicantName,
      applicantEmail,
      universityName: university.name,
    }),
    sendAdminNewApplicationEmail({
      applicationId: inserted.id,
      applicantName,
      applicantEmail,
      applicantPhone,
      universityName: university.name,
      enrollmentStatus: data.enrollmentStatus,
      courseName: data.courseName,
      currentYearOrBatch: data.currentYearOrBatch,
    }),
  ]);

  return { success: true };
}
