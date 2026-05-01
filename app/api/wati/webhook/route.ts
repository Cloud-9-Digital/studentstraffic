import { desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { buildLeadHandoffPayload } from "@/lib/lead-handoff";
import { syncLeadToCrm } from "@/lib/lead-sync";
import { fetchLatestWatiMessages } from "@/lib/wati";

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
  id?: string;
  messageId?: string;
  text?: string;
  message?: string;
  type?: string;
  waId?: string;
  whatsappNumber?: string;
  phone?: string;
  from?: string;
  senderPhoneNumber?: string;
  contactName?: string;
  senderName?: string;
  pushName?: string;
  conversationId?: string;
  conversation_id?: string;
  contact?: Record<string, unknown>;
  sender?: Record<string, unknown>;
  conversation?: Record<string, unknown>;
  data?: Record<string, unknown>;
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

function getEventType(payload: WatiWebhookPayload) {
  return payload.eventType ?? "unknown";
}

function isInboundMessageEvent(payload: WatiWebhookPayload) {
  return getEventType(payload).toLowerCase().includes("messagereceived");
}

function getString(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function firstString(values: Array<string | null | undefined>) {
  return values.find((value) => value && value.trim())?.trim() ?? null;
}

function normalizePhoneNumber(phone: string) {
  return phone.replace(/\D/g, "");
}

function buildPhoneCandidates(phone: string) {
  const normalized = normalizePhoneNumber(phone);
  const candidates = new Set([phone.trim(), normalized]);

  if (normalized) {
    candidates.add(`+${normalized}`);
  }

  if (normalized.length === 10) {
    candidates.add(`91${normalized}`);
    candidates.add(`+91${normalized}`);
  }

  return Array.from(candidates).filter(Boolean);
}

function getInboundPhone(payload: WatiWebhookPayload) {
  return firstString([
    payload.waId,
    payload.whatsappNumber,
    payload.phone,
    payload.from,
    payload.senderPhoneNumber,
    getString(payload.contact, "waId"),
    getString(payload.contact, "wa_id"),
    getString(payload.contact, "whatsappNumber"),
    getString(payload.contact, "phone"),
    getString(payload.sender, "waId"),
    getString(payload.sender, "phone"),
    getString(payload.conversation, "waId"),
    getString(payload.conversation, "phone"),
    getString(payload.data, "waId"),
    getString(payload.data, "whatsappNumber"),
    getString(payload.data, "phone"),
    getString(payload.data, "from"),
  ]);
}

function getInboundName(payload: WatiWebhookPayload) {
  return firstString([
    payload.contactName,
    payload.senderName,
    payload.pushName,
    getString(payload.contact, "name"),
    getString(payload.contact, "fullName"),
    getString(payload.contact, "contactName"),
    getString(payload.sender, "name"),
    getString(payload.sender, "pushName"),
    getString(payload.conversation, "name"),
    getString(payload.data, "contactName"),
    getString(payload.data, "senderName"),
    getString(payload.data, "pushName"),
  ]);
}

function getInboundMessageText(payload: WatiWebhookPayload) {
  return firstString([
    payload.text,
    payload.message,
    getString(payload.data, "text"),
    getString(payload.data, "message"),
    getString(payload.data, "body"),
  ]);
}

function getInboundMessageId(payload: WatiWebhookPayload) {
  return firstString([
    payload.whatsappMessageId,
    payload.whatsapp_message_id,
    payload.messageId,
    payload.id,
    getString(payload.data, "whatsappMessageId"),
    getString(payload.data, "messageId"),
    getString(payload.data, "id"),
  ]);
}

function getConversationId(payload: WatiWebhookPayload) {
  return firstString([
    payload.conversationId,
    payload.conversation_id,
    getString(payload.conversation, "id"),
    getString(payload.conversation, "conversationId"),
    getString(payload.data, "conversationId"),
    getString(payload.data, "conversation_id"),
  ]);
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function getMessageRecordString(message: unknown, keys: string[]) {
  if (!message || typeof message !== "object") {
    return null;
  }

  for (const key of keys) {
    const value = (message as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function summarizeWatiMessages(messages: unknown[]) {
  return messages
    .slice(0, 5)
    .map((message) => {
      const text = getMessageRecordString(message, [
        "text",
        "message",
        "body",
        "content",
      ]);
      if (!text) {
        return null;
      }

      const direction =
        getMessageRecordString(message, ["direction", "type", "eventType"]) ?? "message";
      const timestamp =
        getMessageRecordString(message, [
          "createdAt",
          "created_at",
          "timestamp",
          "receivedAt",
        ]) ?? "";

      return truncateText(
        `${timestamp ? `${timestamp} ` : ""}${direction}: ${text}`,
        220
      );
    })
    .filter(Boolean);
}

function mapWebhookToLeadUpdate(payload: WatiWebhookPayload) {
  const eventType = getEventType(payload);
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

async function syncInboundMessageLead(payload: WatiWebhookPayload) {
  const db = getDb();
  if (!db) {
    return { created: false, skipped: true };
  }

  const phone = getInboundPhone(payload);
  if (!phone) {
    return { created: false, skipped: true };
  }

  const phoneCandidates = buildPhoneCandidates(phone);
  const [existingLead] = await db
    .select({ id: leads.id })
    .from(leads)
    .where(inArray(leads.phone, phoneCandidates))
    .orderBy(desc(leads.createdAt))
    .limit(1);

  if (existingLead) {
    return { created: false, skipped: false };
  }

  const submittedAt = new Date();
  const normalizedPhone = normalizePhoneNumber(phone) || phone.trim();
  const fullName = getInboundName(payload) ?? "WhatsApp Lead";
  const messageText = getInboundMessageText(payload);
  const conversationId = getConversationId(payload);
  const messageId = getInboundMessageId(payload);
  const eventType = getEventType(payload);
  const latestMessages = await fetchLatestWatiMessages(normalizedPhone, {
    pageSize: 10,
    pageNumber: 1,
  });
  const recentMessageSummary = latestMessages.ok
    ? summarizeWatiMessages(latestMessages.messages)
    : [];
  const sourceQuery: Record<string, string | string[]> = {};
  const clientContext = {
    channel: "wati",
    eventType,
    conversationId,
    messageId,
    messageType: payload.type ?? getString(payload.data, "type"),
    originalPhone: phone,
    latestMessagesFetched: latestMessages.ok,
    latestMessagesError: latestMessages.error ?? null,
    latestMessagesCount: latestMessages.messages.length,
  };
  const notes = [
    "Inbound WATI WhatsApp conversation.",
    messageText ? `First message: ${messageText}` : null,
    recentMessageSummary.length
      ? `Recent WATI messages:\n${recentMessageSummary.join("\n")}`
      : null,
    conversationId ? `Conversation ID: ${conversationId}` : null,
    messageId ? `Message ID: ${messageId}` : null,
  ].filter(Boolean).join("\n");

  const [insertedLead] = await db
    .insert(leads)
    .values({
      fullName,
      phone: normalizedPhone,
      sourcePath: "/wati",
      sourceUrl: env.siteUrl ? `${env.siteUrl.replace(/\/+$/, "")}/wati` : null,
      sourceQuery,
      ctaVariant: "wati_inbound",
      notes,
      clientContext,
      crmSyncStatus: env.hasCrmLeadSyncConfig ? "pending" : "skipped",
      pabblySyncStatus: "skipped",
      pabblySyncError: "wati_inbound_message",
      watiMessageStatus: "received",
      watiWhatsappMessageId: messageId,
      watiLastEvent: eventType,
      watiStatusUpdatedAt: submittedAt,
      createdAt: submittedAt,
    })
    .returning({ id: leads.id });

  const insertedLeadId = insertedLead?.id;

  // Sync to CRM only (skip Pabbly to avoid triggering new lead notifications)
  if (insertedLeadId) {
    syncLeadToCrm(insertedLeadId, buildLeadHandoffPayload({
      leadKind: "wati_inbound",
      websiteLeadId: insertedLeadId,
      submittedAt: submittedAt.toISOString(),
      fullName,
      phone: normalizedPhone,
      userState: "NA",
      sourcePath: "/wati",
      sourceUrl: env.siteUrl ? `${env.siteUrl.replace(/\/+$/, "")}/wati` : undefined,
      sourceQuery,
      ctaVariant: "wati_inbound",
      notes,
      clientContext,
    })).catch((error) => {
      console.error("[wati] Failed to sync lead to CRM:", error);
    });
  }

  return { created: Boolean(insertedLeadId), skipped: false };
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (env.watiWebhookToken && token !== env.watiWebhookToken) {
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
  let leadsCreated = 0;

  for (const event of events) {
    if (!event || typeof event !== "object") {
      skipped += 1;
      continue;
    }

    const payload = event as WatiWebhookPayload;
    if (isInboundMessageEvent(payload)) {
      const result = await syncInboundMessageLead(payload);
      if (result.created) {
        leadsCreated += 1;
      }
      if (result.skipped) {
        skipped += 1;
      } else {
        processed += 1;
      }
      continue;
    }

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

  return NextResponse.json({ ok: true, processed, skipped, leadsCreated });
}
