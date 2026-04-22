import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { env } from "@/lib/env";

type WatiWebhookPayload = {
  eventType?: string;
  localMessageId?: string;
  local_message_id?: string;
  whatsappMessageId?: string;
  whatsapp_message_id?: string;
  templateName?: string;
  template_name?: string;
  statusString?: string;
  status?: string;
  failedCode?: string | number;
  failedDetail?: string;
  error?: string;
};

function getLocalMessageId(payload: WatiWebhookPayload) {
  return payload.localMessageId ?? payload.local_message_id ?? null;
}

function getWhatsappMessageId(payload: WatiWebhookPayload) {
  return payload.whatsappMessageId ?? payload.whatsapp_message_id ?? null;
}

function getTemplateName(payload: WatiWebhookPayload) {
  return payload.templateName ?? payload.template_name ?? null;
}

function mapWebhookToLeadUpdate(payload: WatiWebhookPayload) {
  const eventType = payload.eventType ?? "unknown";
  const status = payload.statusString ?? payload.status ?? "";
  const now = new Date();

  const base = {
    watiLastEvent: eventType,
    watiStatusUpdatedAt: now,
    watiWhatsappMessageId: getWhatsappMessageId(payload),
    watiTemplateName: getTemplateName(payload),
  };

  switch (eventType) {
    case "templateMessageSent_v2":
      return {
        ...base,
        watiMessageStatus: "sent",
        watiAcceptedAt: now,
        watiMessageError: null,
      };
    case "sentMessageDELIVERED_v2":
      return {
        ...base,
        watiMessageStatus: "delivered",
        watiDeliveredAt: now,
        watiMessageError: null,
      };
    case "sentMessageREAD_v2":
      return {
        ...base,
        watiMessageStatus: "read",
        watiReadAt: now,
        watiMessageError: null,
      };
    case "sentMessageREPLIED_v2":
      return {
        ...base,
        watiMessageStatus: "replied",
        watiMessageError: null,
      };
    case "templateMessageFailed":
      return {
        ...base,
        watiMessageStatus: "failed",
        watiFailedAt: now,
        watiMessageError:
          [payload.failedCode, payload.failedDetail, payload.error, status]
            .filter(Boolean)
            .join(" | ")
            .slice(0, 1000) || "templateMessageFailed",
      };
    default:
      return {
        ...base,
        watiMessageStatus: status ? status.toLowerCase() : "unknown",
      };
  }
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (token && env.watiWebhookToken && token !== env.watiWebhookToken) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const events = Array.isArray(body) ? body : [body];
  const db = getDb();

  if (!db) {
    return NextResponse.json({ ok: true, processed: 0, skipped: events.length });
  }

  let processed = 0;
  let skipped = 0;

  for (const event of events) {
    if (!event || typeof event !== "object") {
      skipped += 1;
      continue;
    }

    const payload = event as WatiWebhookPayload;
    const localMessageId = getLocalMessageId(payload);
    if (!localMessageId) {
      skipped += 1;
      continue;
    }

    await db
      .update(leads)
      .set(mapWebhookToLeadUpdate(payload))
      .where(eq(leads.watiLocalMessageId, localMessageId));

    processed += 1;
  }

  return NextResponse.json({ ok: true, processed, skipped });
}
