"use server";

import { hash } from "bcryptjs";
import { and, count, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { adminUsers } from "@/lib/db/schema";
import { recordAdminAuditLog } from "@/lib/security/admin-audit";

const createAdminSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z
    .email("Enter a valid email address.")
    .transform((value) => value.trim().toLowerCase()),
  role: z.enum(["owner", "admin"]).default("admin"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must include a lowercase letter.",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must include an uppercase letter.",
    })
    .refine((value) => /\d/.test(value), {
      message: "Password must include a number.",
    }),
});

export type AdminCreateState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createAdminUserAction(
  _previousState: AdminCreateState,
  formData: FormData
): Promise<AdminCreateState> {
  const session = await requireAdminSession({ minimumRole: "owner" });

  const parsed = createAdminSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Please check the entered values.",
    };
  }

  const db = getDb();

  if (!db) {
    return {
      status: "error",
      message: "Database unavailable.",
    };
  }

  const [existingAdmin] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, parsed.data.email))
    .limit(1);

  if (existingAdmin) {
    return {
      status: "error",
      message: "An admin with this email already exists.",
    };
  }

  const passwordHash = await hash(parsed.data.password, 10);
  const headerStore = await headers();
  const [createdAdmin] = await db
    .insert(adminUsers)
    .values({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
      isActive: true,
      createdByAdminId: session.user.adminUserId,
      updatedAt: new Date(),
    })
    .returning({
      id: adminUsers.id,
      email: adminUsers.email,
      role: adminUsers.role,
    });

  await recordAdminAuditLog({
    actorAdminId: session.user.adminUserId,
    actorEmail: session.user.email,
    action: "admin_user.created",
    targetType: "admin_user",
    targetId: createdAdmin ? String(createdAdmin.id) : null,
    targetDisplay: createdAdmin?.email ?? parsed.data.email,
    metadata: {
      fullName: parsed.data.fullName,
      role: parsed.data.role,
    },
    headerSource: headerStore,
  });

  refresh();

  return {
    status: "success",
    message: "Admin created successfully.",
  };
}

export async function updateAdminStatusAction(
  adminUserId: number,
  nextIsActive: boolean
): Promise<{ error?: string }> {
  const session = await requireAdminSession({ minimumRole: "owner" });
  const db = getDb();

  if (!db) {
    return { error: "Database unavailable." };
  }

  const [targetAdmin] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, adminUserId))
    .limit(1);

  if (!targetAdmin) {
    return { error: "Admin not found." };
  }

  if (targetAdmin.isActive === nextIsActive) {
    return {};
  }

  if (!nextIsActive) {
    if (session.user.adminUserId === adminUserId) {
      return { error: "You cannot deactivate your own account." };
    }

    const [{ activeAdminCount }] = await db
      .select({ activeAdminCount: count() })
      .from(adminUsers)
      .where(eq(adminUsers.isActive, true));

    if (activeAdminCount <= 1) {
      return { error: "Keep at least one active database admin." };
    }

    if (targetAdmin.role === "owner") {
      const [{ activeOwnerCount }] = await db
        .select({ activeOwnerCount: count() })
        .from(adminUsers)
        .where(and(eq(adminUsers.role, "owner"), eq(adminUsers.isActive, true)));

      if (activeOwnerCount <= 1) {
        return { error: "Keep at least one active owner." };
      }
    }
  }

  const headerStore = await headers();

  await db
    .update(adminUsers)
    .set({
      isActive: nextIsActive,
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, adminUserId));

  await recordAdminAuditLog({
    actorAdminId: session.user.adminUserId,
    actorEmail: session.user.email,
    action: nextIsActive ? "admin_user.activated" : "admin_user.deactivated",
    targetType: "admin_user",
    targetId: String(adminUserId),
    targetDisplay: targetAdmin.email,
    metadata: {
      role: targetAdmin.role,
      nextIsActive,
    },
    headerSource: headerStore,
  });

  refresh();

  return {};
}
