"use server";

import { headers } from "next/headers";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

import {
  emptyToUndefined,
  getFormString,
  getIpAddress,
} from "@/app/_actions/form-helpers";
import { getDb } from "@/lib/db/server";
import { studentPeerApplications, universities } from "@/lib/db/schema";
import {
  isAllowedPhotoType,
  isAllowedProofType,
  uploadFileToCloudinary,
} from "@/lib/cloudinary-upload";
import { sendApplicationReceivedEmail } from "@/lib/email/templates/application-received";
import { sendAdminNewApplicationEmail } from "@/lib/email/templates/admin-new-application";
import {
  consumePublicFormRateLimits,
  normalizePhoneIdentifier,
} from "@/lib/security/public-form-guard";

export type SubmitPeerApplicationState = {
  error?: string;
  success?: boolean;
};

const applicationSchema = z.object({
  universityId: z.coerce.number().int().positive("Please select a university."),
  fullName: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  courseName: z.string().trim().optional(),
  currentYearOrBatch: z.string().trim().optional(),
  enrollmentStatus: z.enum(["current_student", "alumnus"]).refine(
    (v) => v !== undefined,
    { message: "Please select your enrollment status." }
  ),
  homeState: z.string().trim().optional(),
  homeDistrict: z.string().trim().optional(),
  languages: z.string().trim().optional(),
  message: z.string().trim().optional(),
  website: z.string().trim().optional(),
});

export async function submitPeerApplicationAction(
  _prevState: SubmitPeerApplicationState,
  formData: FormData
): Promise<SubmitPeerApplicationState> {
  const parsed = applicationSchema.safeParse({
    universityId: getFormString(formData, "universityId"),
    fullName: getFormString(formData, "fullName"),
    email: getFormString(formData, "email"),
    phone: getFormString(formData, "phone"),
    courseName: getFormString(formData, "courseName") || undefined,
    currentYearOrBatch: getFormString(formData, "currentYearOrBatch") || undefined,
    enrollmentStatus: getFormString(formData, "enrollmentStatus"),
    homeState: getFormString(formData, "homeState") || undefined,
    homeDistrict: getFormString(formData, "homeDistrict") || undefined,
    languages: getFormString(formData, "languages") || undefined,
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

  // Validate uploaded files
  const photoFile = formData.get("photoFile");
  const proofFile = formData.get("proofFile");

  if (!(proofFile instanceof File) || proofFile.size === 0) {
    return { error: "Please upload your proof of enrollment." };
  }

  if (!isAllowedProofType(proofFile.type)) {
    return { error: "Proof must be a JPG, PNG, or PDF file." };
  }

  if (photoFile instanceof File && photoFile.size > 0) {
    if (!isAllowedPhotoType(photoFile.type)) {
      return { error: "Profile photo must be a JPG, PNG, or WebP image." };
    }
  }

  const db = getDb();
  if (!db) return { error: "Service temporarily unavailable. Try again shortly." };

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
      {
        scope: "public:peer_application:phone",
        identifier: normalizePhoneIdentifier(data.phone),
        limit: 2,
        windowMs: 24 * 60 * 60_000,
        blockMs: 24 * 60 * 60_000,
      },
    ],
    "applications"
  );

  if (rateLimitError) return { error: rateLimitError };

  const [existing] = await db
    .select({ id: studentPeerApplications.id, status: studentPeerApplications.status })
    .from(studentPeerApplications)
    .where(
      and(
        or(
          eq(studentPeerApplications.email, data.email),
          eq(studentPeerApplications.phone, data.phone)
        ),
        or(
          eq(studentPeerApplications.status, "pending"),
          eq(studentPeerApplications.status, "approved")
        )
      )
    )
    .limit(1);

  if (existing) {
    return { error: "An application with this email or phone number already exists." };
  }

  const [university] = await db
    .select({ id: universities.id, name: universities.name })
    .from(universities)
    .where(eq(universities.id, data.universityId))
    .limit(1);

  if (!university) return { error: "University not found." };

  // Upload files to Cloudinary
  let photoUrl: string | null = null;
  let proofUrl: string;

  try {
    if (photoFile instanceof File && photoFile.size > 0) {
      const result = await uploadFileToCloudinary(photoFile, {
        folder: "studentstraffic/peer-applications/photos",
        resourceType: "image",
        maxBytes: 5 * 1024 * 1024, // 5 MB
      });
      photoUrl = result.url;
    }

    const proofResult = await uploadFileToCloudinary(proofFile, {
      folder: "studentstraffic/peer-applications/proofs",
      resourceType: "auto",
      maxBytes: 10 * 1024 * 1024, // 10 MB
    });
    proofUrl = proofResult.url;
  } catch (err) {
    const message = err instanceof Error ? err.message : "File upload failed.";
    return { error: message };
  }

  const [inserted] = await db
    .insert(studentPeerApplications)
    .values({
      universityId: data.universityId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      photoUrl,
      courseName: emptyToUndefined(data.courseName) ?? null,
      currentYearOrBatch: emptyToUndefined(data.currentYearOrBatch) ?? null,
      enrollmentStatus: data.enrollmentStatus,
      homeState: emptyToUndefined(data.homeState) ?? null,
      homeDistrict: emptyToUndefined(data.homeDistrict) ?? null,
      languages: data.languages ? data.languages.split(",").map((l) => l.trim()).filter(Boolean) : null,
      proofUrl,
      message: emptyToUndefined(data.message) ?? null,
      status: "pending",
    })
    .returning({ id: studentPeerApplications.id });

  // Fire-and-forget emails — don't block the response
  void Promise.all([
    sendApplicationReceivedEmail({
      applicantName: data.fullName,
      applicantEmail: data.email,
      universityName: university.name,
    }),
    sendAdminNewApplicationEmail({
      applicationId: inserted.id,
      applicantName: data.fullName,
      applicantEmail: data.email,
      applicantPhone: data.phone,
      universityName: university.name,
      enrollmentStatus: data.enrollmentStatus,
      courseName: data.courseName,
      currentYearOrBatch: data.currentYearOrBatch,
    }),
  ]);

  return { success: true };
}
