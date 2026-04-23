"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { recordAdminAuditLog } from "@/lib/security/admin-audit";

export type ManageLeadsState = {
  status: "idle" | "success" | "error";
  message?: string;
  deletedCount?: number;
};

const initialManageLeadsState: ManageLeadsState = {
  status: "idle",
};

const singleLeadSchema = z.object({
  leadId: z.coerce.number().int().positive(),
});

const bulkLeadSchema = z.object({
  leadIds: z.array(z.coerce.number().int().positive()).min(1, "Select at least one lead to delete."),
});

async function revalidateLeadAdminPaths(leadIds: number[]) {
  revalidatePath("/admin");
  revalidatePath("/admin/leads");

  for (const leadId of leadIds) {
    revalidatePath(`/admin/leads/${leadId}`);
  }
}

export async function deleteLeadAction(
  _prevState: ManageLeadsState = initialManageLeadsState,
  formData: FormData
): Promise<ManageLeadsState> {
  const session = await requireAdminSession({ minimumRole: "owner" });
  const parsed = singleLeadSchema.safeParse({
    leadId: formData.get("leadId"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid lead selection.",
    };
  }

  const db = getDb();
  if (!db) {
    return { status: "error", message: "Database unavailable." };
  }

  const leadId = parsed.data.leadId;
  const [lead] = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      phone: leads.phone,
    })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

  if (!lead) {
    return { status: "error", message: "Lead not found." };
  }

  await db.delete(leads).where(eq(leads.id, leadId));

  await recordAdminAuditLog({
    actorAdminId: session.user.adminUserId,
    actorEmail: session.user.email,
    action: "lead.delete",
    targetType: "lead",
    targetId: String(lead.id),
    targetDisplay: lead.fullName,
    metadata: {
      deletedCount: 1,
      phone: lead.phone,
    },
    headerSource: await headers(),
  });

  await revalidateLeadAdminPaths([leadId]);

  return {
    status: "success",
    message: `${lead.fullName} was deleted.`,
    deletedCount: 1,
  };
}

export async function bulkDeleteLeadsAction(
  _prevState: ManageLeadsState = initialManageLeadsState,
  formData: FormData
): Promise<ManageLeadsState> {
  const session = await requireAdminSession({ minimumRole: "owner" });
  const parsed = bulkLeadSchema.safeParse({
    leadIds: formData.getAll("leadIds"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid lead selection.",
    };
  }

  const db = getDb();
  if (!db) {
    return { status: "error", message: "Database unavailable." };
  }

  const leadIds = Array.from(new Set(parsed.data.leadIds));
  const records = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
    })
    .from(leads)
    .where(inArray(leads.id, leadIds));

  if (records.length === 0) {
    return { status: "error", message: "No matching leads found." };
  }

  const matchedIds = records.map((record) => record.id);

  await db.delete(leads).where(inArray(leads.id, matchedIds));

  await recordAdminAuditLog({
    actorAdminId: session.user.adminUserId,
    actorEmail: session.user.email,
    action: "lead.bulk_delete",
    targetType: "lead",
    targetId: matchedIds.join(","),
    targetDisplay: `${records.length} leads`,
    metadata: {
      deletedCount: records.length,
      leadNames: records.map((record) => record.fullName).slice(0, 10),
    },
    headerSource: await headers(),
  });

  await revalidateLeadAdminPaths(matchedIds);

  return {
    status: "success",
    message: `${records.length} lead${records.length === 1 ? "" : "s"} deleted.`,
    deletedCount: records.length,
  };
}
