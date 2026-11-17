import { and, eq } from "drizzle-orm";

import { attachmentKey, attachmentUrl } from "@/lib/attachment-links";
import { auth, getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { studentPeers } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { fetchPrivateAttachment } from "@/lib/r2-storage";
import { resolveDbUserId } from "@/lib/server-session";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  "Content-Security-Policy": "default-src 'none'; sandbox",
};

const missing = () => new Response(null, { status: 404, headers: privateHeaders });

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string; file: string }> }) {
  const { kind, file } = await params;
  if (!attachmentKey(kind, file)) return missing();

  if (kind === "guide-photo" || kind === "guide-application-photo") {
    const db = getDb();
    if (!db) return missing();
    const url = attachmentUrl(env.siteUrl, kind, file);
    const [active] = await db.select({ id: studentPeers.id }).from(studentPeers)
      .where(and(eq(studentPeers.photoUrl, url), eq(studentPeers.status, "active"))).limit(1);
    if (!active && !(await getAdminSession())) {
      const email = (await auth())?.user?.email;
      const userId = email && await resolveDbUserId(email);
      if (!userId) return missing();
      const [own] = await db.select({ id: studentPeers.id }).from(studentPeers)
        .where(and(eq(studentPeers.photoUrl, url), eq(studentPeers.peerUserId, userId))).limit(1);
      if (!own) return missing();
    }
  } else if (!(await getAdminSession())) {
    return missing();
  }

  let attachment: Awaited<ReturnType<typeof fetchPrivateAttachment>>;
  try {
    attachment = await fetchPrivateAttachment(kind, file);
  } catch {
    return new Response(null, { status: 503, headers: privateHeaders });
  }
  if (!attachment) return missing();

  return new Response(attachment.response.body, {
    headers: {
      ...privateHeaders,
      "Content-Type": attachment.type,
      "Content-Disposition": attachment.type === "application/pdf" ? 'attachment; filename="document.pdf"' : "inline",
    },
  });
}
