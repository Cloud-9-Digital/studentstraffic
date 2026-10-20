import "server-only";

import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { MAX_MESSAGES_PER_CONVERSATION } from "@/lib/chatbot/config";
import type { ChatbotToolCallRecord } from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import { chatbotConversations, chatbotMessages } from "@/lib/db/schema";

/**
 * Transcript persistence.
 *
 * Transcripts are observability, not the product. Every function here degrades
 * to a no-op when DATABASE_URL is absent — matching the rest of the codebase —
 * and `safely` below extends that to any failure: a migration not yet applied,
 * a dropped connection or a changed constraint must never cost a visitor their
 * answer, or cost us a lead on the capture path. The transcript is what we
 * lose, and we log it.
 */
async function safely<T>(
  label: string,
  fallback: T,
  run: () => Promise<T>,
): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[chat] ${label} failed`, error);
    return fallback;
  }
}

export type ChatConversationHandle = {
  id: number | null;
  publicId: string;
  messageCount: number;
  /** True when the conversation has hit its ceiling and must not continue. */
  exhausted: boolean;
};

type StartConversationInput = {
  publicId?: string;
  visitorId?: string | null;
  userId?: string | null;
  page?: { path: string; url?: string; title?: string };
  referrer?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
};

/**
 * Resumes the conversation the browser is holding, or opens a new one.
 *
 * A `publicId` the caller supplies but we have no row for is treated as a new
 * conversation rather than an error — the row may have been pruned, and the
 * visitor should not see a failure for that.
 */
export async function startOrResumeConversation(
  input: StartConversationInput,
): Promise<ChatConversationHandle> {
  const db = getDb();
  const detached: ChatConversationHandle = {
    id: null,
    publicId: input.publicId ?? crypto.randomUUID(),
    messageCount: 0,
    exhausted: false,
  };

  if (!db) return detached;

  return safely("conversation open", detached, async () => {
    if (input.publicId) {
      const [existing] = await db
        .select({
          id: chatbotConversations.id,
          publicId: chatbotConversations.publicId,
          messageCount: chatbotConversations.messageCount,
        })
        .from(chatbotConversations)
        .where(eq(chatbotConversations.publicId, input.publicId))
        .limit(1);

      if (existing) {
        return {
          id: existing.id,
          publicId: existing.publicId,
          messageCount: existing.messageCount,
          exhausted: existing.messageCount >= MAX_MESSAGES_PER_CONVERSATION,
        };
      }
    }

    const publicId = input.publicId ?? crypto.randomUUID();

    const [created] = await db
      .insert(chatbotConversations)
      .values({
        publicId,
        visitorId: input.visitorId ?? null,
        userId: input.userId ?? null,
        sourcePath: input.page?.path ?? null,
        sourceUrl: input.page?.url ?? null,
        pageTitle: input.page?.title ?? null,
        referrer: input.referrer ?? null,
        userAgent: input.userAgent ?? null,
        ipAddress: input.ipAddress ?? null,
      })
      .returning({
        id: chatbotConversations.id,
        publicId: chatbotConversations.publicId,
      });

    return {
      id: created?.id ?? null,
      publicId: created?.publicId ?? publicId,
      messageCount: 0,
      exhausted: false,
    };
  });
}

export async function recordUserMessage(
  conversationId: number | null,
  content: string,
) {
  const db = getDb();
  if (!db || conversationId === null) return;

  await safely("user message write", undefined, async () => {
    await db.insert(chatbotMessages).values({
      conversationId,
      role: "user",
      content,
    });
  });
}

export async function recordAssistantMessage(
  conversationId: number | null,
  message: {
    content: string;
    toolCalls: ChatbotToolCallRecord[];
    model: string;
    inputTokens?: number;
    cachedInputTokens?: number;
    outputTokens?: number;
    latencyMs: number;
    stopReason?: string | null;
  },
) {
  const db = getDb();
  if (!db || conversationId === null) return;

  await safely("assistant message write", undefined, async () => {
    await db.insert(chatbotMessages).values({
      conversationId,
      role: "assistant",
      content: message.content,
      toolCalls: message.toolCalls.length > 0 ? message.toolCalls : null,
      model: message.model,
      inputTokens: message.inputTokens ?? null,
      cachedInputTokens: message.cachedInputTokens ?? null,
      outputTokens: message.outputTokens ?? null,
      latencyMs: message.latencyMs,
      stopReason: message.stopReason ?? null,
    });

    // One answer is two messages (the question and the reply), which is what the
    // MAX_MESSAGES_PER_CONVERSATION ceiling counts.
    await db
      .update(chatbotConversations)
      .set({
        messageCount: sql`${chatbotConversations.messageCount} + 2`,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(chatbotConversations.id, conversationId));
  });
}

/** Links the lead a chat produced back to the conversation that produced it. */
export async function attachLeadToConversation(
  conversationId: number | null,
  leadId: number,
) {
  const db = getDb();
  if (!db || conversationId === null) return;

  await safely("lead attach", undefined, async () => {
    await db
      .update(chatbotConversations)
      .set({ leadId, updatedAt: new Date() })
      .where(eq(chatbotConversations.id, conversationId));
  });
}

/** Resolves a public conversation id to its row id, for the lead endpoint. */
export async function resolveConversationId(publicId: string) {
  const db = getDb();
  if (!db) return null;

  return safely("conversation resolve", null, async () => {
    const [row] = await db
      .select({ id: chatbotConversations.id })
      .from(chatbotConversations)
      .where(eq(chatbotConversations.publicId, publicId))
      .limit(1);

    return row?.id ?? null;
  });
}

/**
 * The last few turns of a stored conversation, used to attach context to a lead
 * so the counsellor opens the call already knowing what was discussed.
 */
export async function getConversationTranscript(
  conversationId: number | null,
  limit = 12,
) {
  const db = getDb();
  if (!db || conversationId === null) return [];

  return safely<Array<{ role: string; content: string }>>(
    "transcript read",
    [],
    async () =>
      db
        .select({
          role: chatbotMessages.role,
          content: chatbotMessages.content,
        })
        .from(chatbotMessages)
        .where(eq(chatbotMessages.conversationId, conversationId))
        .orderBy(chatbotMessages.createdAt)
        .limit(limit),
  );
}

/**
 * Past conversations for one visitor.
 *
 * Scoped by the visitor cookie, never by the public id alone: the id is held in
 * the browser and must not be enough on its own to read a transcript back, or
 * anyone with a guessed id could read someone else's conversation.
 */
export async function listConversationsForVisitor(
  visitorId: string,
  limit = 20
) {
  const db = getDb();
  if (!db || !visitorId) return [];

  return safely<
    Array<{
      publicId: string;
      lastMessageAt: Date | null;
      createdAt: Date;
      messageCount: number;
      title: string | null;
    }>
  >("history list", [], async () => {
    const conversations = await db
      .select({
        id: chatbotConversations.id,
        publicId: chatbotConversations.publicId,
        lastMessageAt: chatbotConversations.lastMessageAt,
        createdAt: chatbotConversations.createdAt,
        messageCount: chatbotConversations.messageCount,
      })
      .from(chatbotConversations)
      .where(eq(chatbotConversations.visitorId, visitorId))
      .orderBy(desc(chatbotConversations.lastMessageAt))
      .limit(limit);

    const withMessages = conversations.filter((row) => row.messageCount > 0);

    if (withMessages.length === 0) return [];

    // Titles come from a second, plainly correlated query rather than a
    // subquery in the select list: the earlier correlated form silently
    // returned another conversation's first message, which is exactly the kind
    // of bug that is invisible until someone reads a stranger's question as
    // their own chat title.
    const firstQuestions = await db
      .select({
        conversationId: chatbotMessages.conversationId,
        content: chatbotMessages.content,
      })
      .from(chatbotMessages)
      .where(
        and(
          inArray(
            chatbotMessages.conversationId,
            withMessages.map((row) => row.id)
          ),
          eq(chatbotMessages.role, "user")
        )
      )
      .orderBy(chatbotMessages.conversationId, chatbotMessages.createdAt);

    const titleByConversation = new Map<number, string>();
    for (const row of firstQuestions) {
      // Ascending by created_at, so the first row seen per conversation wins.
      if (!titleByConversation.has(row.conversationId)) {
        titleByConversation.set(row.conversationId, row.content);
      }
    }

    return withMessages.map((row) => ({
      publicId: row.publicId,
      lastMessageAt: row.lastMessageAt,
      createdAt: row.createdAt,
      messageCount: row.messageCount,
      title: titleByConversation.get(row.id) ?? null,
    }));
  });
}

/**
 * One past conversation, for replaying into the dock. Ownership is enforced by
 * the same visitor scope as the list.
 */
export async function getConversationForVisitor(
  publicId: string,
  visitorId: string
) {
  const db = getDb();
  if (!db || !visitorId) return null;

  return safely<Array<{
    role: "user" | "assistant";
    content: string;
    createdAt: Date | null;
  }> | null>("history read", null, async () => {
    const [conversation] = await db
      .select({ id: chatbotConversations.id })
      .from(chatbotConversations)
      .where(
        and(
          eq(chatbotConversations.publicId, publicId),
          eq(chatbotConversations.visitorId, visitorId)
        )
      )
      .limit(1);

    if (!conversation) return null;

    return db
      .select({
        role: chatbotMessages.role,
        content: chatbotMessages.content,
        createdAt: chatbotMessages.createdAt,
      })
      .from(chatbotMessages)
      .where(eq(chatbotMessages.conversationId, conversation.id))
      .orderBy(chatbotMessages.createdAt)
      .limit(200);
  });
}
