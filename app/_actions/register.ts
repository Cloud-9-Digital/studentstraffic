"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/lib/db/server";
import { users } from "@/lib/db/schema";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s'\-]+$/, "Name must contain only letters"),
  email: z.string().email("Enter a valid email address").transform((v) => v.trim().toLowerCase()),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterState = { status: "idle" | "success" | "error"; message?: string };

export async function registerAction(_: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form values." };
  }

  const db = getDb();
  if (!db) return { status: "error", message: "Service unavailable. Please try again." };

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (existing) return { status: "error", message: "An account with this email already exists." };

  const passwordHash = await hash(parsed.data.password, 10);

  await db.insert(users).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    passwordHash,
    updatedAt: new Date(),
  });

  return { status: "success" };
}
