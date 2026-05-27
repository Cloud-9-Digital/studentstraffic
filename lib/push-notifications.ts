import "server-only";

import { Expo, type ExpoPushMessage } from "expo-server-sdk";
import { and, gt, isNotNull, isNull, eq } from "drizzle-orm";

import { getDb } from "./db/server";
import { mobileSessions } from "./db/schema";

const expo = new Expo();

export async function sendCallPushNotification(
  recipientUserId: string,
  payload: {
    callId: string;
    callerDisplayName: string;
    universityName: string;
  }
) {
  const db = getDb();
  if (!db) return;

  const sessions = await db
    .select({ pushToken: mobileSessions.pushToken })
    .from(mobileSessions)
    .where(
      and(
        eq(mobileSessions.userId, recipientUserId),
        isNull(mobileSessions.revokedAt),
        gt(mobileSessions.expiresAt, new Date()),
        isNotNull(mobileSessions.pushToken)
      )
    );

  const tokens = sessions
    .map((s) => s.pushToken!)
    .filter((t) => Expo.isExpoPushToken(t));

  if (tokens.length === 0) return;

  const messages: ExpoPushMessage[] = tokens.map((to) => ({
    to,
    title: "Incoming Call",
    body: `${payload.callerDisplayName} is calling — ${payload.universityName}`,
    sound: "default",
    priority: "high",
    channelId: "calls",
    data: {
      type: "incoming_call",
      callId: payload.callId,
      callerDisplayName: payload.callerDisplayName,
      universityName: payload.universityName,
    },
  }));

  try {
    const chunks = expo.chunkPushNotifications(messages);
    await Promise.all(chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk)));
  } catch {
    // Push errors are non-fatal — in-app polling is the fallback
  }
}
