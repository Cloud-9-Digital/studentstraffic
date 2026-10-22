"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getFormString, wasSubmittedTooFast } from "@/app/_actions/form-helpers";
import { capturePeerRequest, peerRequestSchema } from "@/lib/peer-request-capture";

export type PeerRequestFormState = {
  error?: string;
};

// The website form adds a honeypot and a too-fast check to the shared fields;
// the capture itself lives in lib/peer-request-capture.ts.
const peerRequestFormSchema = peerRequestSchema.extend({
  website: z.string().trim().optional(),
  startedAt: z.string().trim().min(1),
});

export async function submitPeerRequestAction(
  _prevState: PeerRequestFormState,
  formData: FormData
): Promise<PeerRequestFormState> {
  const parsed = peerRequestFormSchema.safeParse({
    fullName: getFormString(formData, "fullName"),
    phone: getFormString(formData, "phone"),
    email: getFormString(formData, "email"),
    residenceCountry: getFormString(formData, "residenceCountry"),
    userState: getFormString(formData, "userState"),
    userCity: getFormString(formData, "userCity"),
    universitySlug: getFormString(formData, "universitySlug"),
    courseInterest: getFormString(formData, "courseInterest"),
    languagePreference: getFormString(formData, "languagePreference"),
    message: getFormString(formData, "message"),
    sourcePath: getFormString(formData, "sourcePath"),
    sourceUrl: getFormString(formData, "sourceUrl"),
    sourceQuery: getFormString(formData, "sourceQuery"),
    pageTitle: getFormString(formData, "pageTitle"),
    documentReferrer: getFormString(formData, "documentReferrer"),
    clientContext: getFormString(formData, "clientContext"),
    website: getFormString(formData, "website"),
    startedAt: getFormString(formData, "startedAt"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Please check the form and try again.",
    };
  }

  const { website, startedAt, ...data } = parsed.data;

  if (website) {
    return {
      error: "Spam detection triggered. Please try again.",
    };
  }

  if (wasSubmittedTooFast(startedAt)) {
    return {
      error: "Please take a moment and submit again.",
    };
  }

  const result = await capturePeerRequest(data);

  if (!result.ok) {
    return { error: result.error };
  }

  redirect(
    `/thank-you?source=${encodeURIComponent(data.sourcePath)}&interest=${encodeURIComponent(result.universityName)}`
  );
}
