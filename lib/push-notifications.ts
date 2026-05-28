import "server-only";

import { Expo, type ExpoPushMessage } from "expo-server-sdk";
import { and, gt, isNotNull, isNull, eq } from "drizzle-orm";

import { getDb } from "./db/server";
import { mobileSessions } from "./db/schema";
import { sendFCMDataMessage } from "./firebase-admin";

const expo = new Expo();

function isExpoPushToken(token: string) {
  return token.startsWith("ExponentPushToken");
}

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

  const tokens = sessions.map((s) => s.pushToken!);
  if (tokens.length === 0) return;

  // FCM tokens (from @react-native-firebase/messaging): send data-only high-priority message.
  // The app's background handler (notifee) creates the full-screen call notification.
  const fcmTokens = tokens.filter((t) => !isExpoPushToken(t));

  // Expo tokens (legacy / iOS): use Expo push service as fallback.
  const expoTokens = tokens.filter((t) => isExpoPushToken(t));

  const fcmData = {
    type: "incoming_call",
    callId: payload.callId,
    callerDisplayName: payload.callerDisplayName,
    universityName: payload.universityName,
  };

  await Promise.all([
    // Firebase Admin: data-only message → wakes device, notifee shows full-screen UI
    ...fcmTokens.map((token) => sendFCMDataMessage(token, fcmData).catch(() => null)),

    // Expo push service: standard notification for iOS / old Expo tokens
    expoTokens.length > 0
      ? expo.sendPushNotificationsAsync(
          expoTokens.map<ExpoPushMessage>((to) => ({
            to,
            title: "📞 Incoming Call",
            body: `${payload.callerDisplayName} is calling — ${payload.universityName}`,
            sound: "default",
            priority: "high",
            channelId: "incoming_calls",
            ttl: 60,
            data: fcmData,
          }))
        ).catch(() => null)
      : Promise.resolve(),
  ]);
}
