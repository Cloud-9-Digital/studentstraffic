import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import { adminUsers, type AdminUserRole } from "@/lib/db/schema";

export type ActiveAdminRecord = {
  id: number;
  fullName: string;
  email: string;
  role: AdminUserRole;
};

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function findActiveAdminByEmail(email: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  const normalizedEmail = normalizeEmail(email);
  const [adminUser] = await db
    .select({
      id: adminUsers.id,
      fullName: adminUsers.fullName,
      email: adminUsers.email,
      passwordHash: adminUsers.passwordHash,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
    })
    .from(adminUsers)
    .where(
      and(eq(adminUsers.email, normalizedEmail), eq(adminUsers.isActive, true))
    )
    .limit(1);

  return adminUser ?? null;
}

export async function findActiveAdminById(adminUserId: number) {
  const db = getDb();

  if (!db) {
    return null;
  }

  const [adminUser] = await db
    .select({
      id: adminUsers.id,
      fullName: adminUsers.fullName,
      email: adminUsers.email,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
    })
    .from(adminUsers)
    .where(
      and(eq(adminUsers.id, adminUserId), eq(adminUsers.isActive, true))
    )
    .limit(1);

  return adminUser ?? null;
}

export async function updateAdminLastSignIn(adminUserId: number) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db
    .update(adminUsers)
    .set({
      lastSignedInAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, adminUserId));
}
