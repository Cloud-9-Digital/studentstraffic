import "server-only";

import { getDb } from "@/lib/db/server";
import { adminAuditLogs } from "@/lib/db/schema";
import {
  getRequestIpAddress,
  getRequestUserAgent,
  type HeaderSource,
} from "@/lib/security/request";

type AuditMetadataValue = string | number | boolean | null | string[];

export type AdminAuditEntry = {
  actorAdminId?: number | null;
  actorEmail?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  targetDisplay?: string | null;
  metadata?: Record<string, AuditMetadataValue>;
  headerSource?: HeaderSource | null;
};

export async function recordAdminAuditLog(entry: AdminAuditEntry) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db.insert(adminAuditLogs).values({
    actorAdminId: entry.actorAdminId ?? null,
    actorEmail: entry.actorEmail ?? null,
    action: entry.action,
    targetType: entry.targetType,
    targetId: entry.targetId ?? null,
    targetDisplay: entry.targetDisplay ?? null,
    ipAddress: entry.headerSource
      ? getRequestIpAddress(entry.headerSource)
      : null,
    userAgent: entry.headerSource
      ? getRequestUserAgent(entry.headerSource)
      : null,
    metadata: entry.metadata ?? {},
  });
}
