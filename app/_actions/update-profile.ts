"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { users } from "@/lib/db/schema";
import { resolveDbUserId } from "@/lib/server-session";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s'\-]+$/, "Name must contain only letters"),
  phone: z.string().trim().min(7, "Enter a valid phone number").or(z.literal("")).optional(),
  neetScore: z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? parseInt(v, 10) : null),
    z.number().int().min(0, "NEET score must be 0–720").max(720, "NEET score must be 0–720").nullable()
  ),
  budgetUsd: z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? parseInt(v, 10) : null),
    z.number().int().min(0).nullable()
  ),
  preferredCountries: z
    .string()
    .optional()
    .transform((v) =>
      v && v.trim() !== "" ? v.split(",").map((s) => s.trim()).filter(Boolean) : []
    ),
});

export type ProfileState = { status: "idle" | "success" | "error"; message?: string };

export async function updateProfileAction(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.email) return { status: "error", message: "Not authenticated." };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    neetScore: formData.get("neetScore"),
    budgetUsd: formData.get("budgetUsd"),
    preferredCountries: formData.get("preferredCountries"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form values." };
  }

  const db = getDb();
  if (!db) return { status: "error", message: "Service unavailable. Please try again." };

  // session.user.id is "1" for admin sessions; resolve the real user by email.
  const userId = await resolveDbUserId(session.user.email);
  if (!userId) return { status: "error", message: "Not authenticated." };

  await db
    .update(users)
    .set({
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      neetScore: parsed.data.neetScore ?? null,
      budgetUsd: parsed.data.budgetUsd ?? null,
      preferredCountries: parsed.data.preferredCountries ?? [],
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return { status: "success", message: "Profile updated successfully." };
}
