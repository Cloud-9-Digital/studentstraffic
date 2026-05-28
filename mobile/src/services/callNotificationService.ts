import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_ACTION_KEY = "ST_PENDING_CALL_ACTION_V2";

export type PendingCallAction = {
  action: "accept" | "decline";
  callId: string;
  callerDisplayName: string;
  universityName: string;
};

// ─── Channels ───────────────────────────────────────────────────────────────

const CHANNEL_INCOMING = "incoming_calls";
const CHANNEL_ACTIVE   = "active_call";

async function ensureChannels(notifee: any) {
  const { AndroidImportance } = require("@notifee/react-native");
  await Promise.all([
    notifee.createChannel({
      id: CHANNEL_INCOMING,
      name: "Incoming Calls",
      importance: AndroidImportance.HIGH,
      vibration: true,
      sound: "default",
      bypassDnd: true,
    }),
    notifee.createChannel({
      id: CHANNEL_ACTIVE,
      name: "Active Call",
      importance: AndroidImportance.LOW,
      sound: "",
      vibration: false,
    }),
  ]);
}

// ─── Show / cancel call notification ────────────────────────────────────────

export async function showIncomingCallNotification(data: {
  callId: string;
  callerDisplayName: string;
  universityName: string;
}) {
  if (Platform.OS !== "android") return;
  try {
    const notifee = require("@notifee/react-native").default;
    const { AndroidCategory, AndroidImportance } = require("@notifee/react-native");
    await ensureChannels(notifee);

    await notifee.displayNotification({
      id: data.callId,
      title: `📞 ${data.callerDisplayName}`,
      body: `Calling about ${data.universityName}`,
      data: {
        type: "incoming_call",
        callId: data.callId,
        callerDisplayName: data.callerDisplayName,
        universityName: data.universityName,
      },
      android: {
        channelId: CHANNEL_INCOMING,
        importance: AndroidImportance.HIGH,
        category: AndroidCategory.CALL,
        // Shows on lock screen even when phone is asleep
        fullScreenAction: { id: "default" },
        actions: [
          { title: "✗  Decline", pressAction: { id: "decline" } },
          { title: "✓  Accept",  pressAction: { id: "accept",  launchActivity: "default" } },
        ],
        sound: "default",
        // Stays visible — user must explicitly act
        ongoing: false,
        timeoutAfter: 60000, // auto-dismiss after 60s if no response
        pressAction: { id: "default" },
      },
    });
  } catch {
    // notifee not available
  }
}

export async function cancelIncomingCallNotification(callId: string) {
  if (Platform.OS !== "android") return;
  try {
    const notifee = require("@notifee/react-native").default;
    await notifee.cancelNotification(callId);
  } catch {}
}

// ─── Foreground service (keeps app alive during active call) ─────────────────

export async function startCallForegroundService(callId: string, displayName: string) {
  if (Platform.OS !== "android") return;
  try {
    const notifee = require("@notifee/react-native").default;
    const { AndroidImportance } = require("@notifee/react-native");
    await ensureChannels(notifee);

    await notifee.displayNotification({
      id: `fs_${callId}`,
      title: "📞 Call in progress",
      body: `With ${displayName}`,
      android: {
        channelId: CHANNEL_ACTIVE,
        importance: AndroidImportance.LOW,
        ongoing: true,
        asForegroundService: true,
        pressAction: { id: "default" },
      },
    });
  } catch {}
}

export async function stopCallForegroundService(callId: string) {
  if (Platform.OS !== "android") return;
  try {
    const notifee = require("@notifee/react-native").default;
    await notifee.stopForegroundService();
    await notifee.cancelNotification(`fs_${callId}`);
  } catch {}
}

// ─── Pending action (Accept/Decline from killed-state notification) ──────────

export async function storePendingCallAction(action: PendingCallAction) {
  await AsyncStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(action));
}

export async function consumePendingCallAction(): Promise<PendingCallAction | null> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_ACTION_KEY);
    if (!raw) return null;
    await AsyncStorage.removeItem(PENDING_ACTION_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── Background handlers (module-level, before React mounts) ────────────────
// Call this once from the entry module.

export function registerBackgroundHandlers() {
  if (Platform.OS !== "android") return;

  // Firebase FCM background / killed state message handler
  try {
    const messaging = require("@react-native-firebase/messaging").default;
    messaging().setBackgroundMessageHandler(async (message: any) => {
      const data = message.data as Record<string, string>;
      if (data?.type === "incoming_call") {
        await showIncomingCallNotification({
          callId: data.callId,
          callerDisplayName: data.callerDisplayName,
          universityName: data.universityName,
        });
      }
    });
  } catch {}

  // Notifee background event handler (Accept / Decline button presses)
  try {
    const notifee = require("@notifee/react-native").default;
    const { EventType } = require("@notifee/react-native");

    notifee.onBackgroundEvent(async ({ type, detail }: any) => {
      if (type !== EventType.ACTION_PRESS) return;

      const d = detail.notification?.data as Record<string, string> | undefined;
      if (!d?.callId) return;

      const actionId = detail.pressAction?.id;
      if (actionId === "accept") {
        await storePendingCallAction({
          action: "accept",
          callId: d.callId,
          callerDisplayName: d.callerDisplayName ?? "Your guide",
          universityName: d.universityName ?? "",
        });
      } else if (actionId === "decline") {
        await storePendingCallAction({
          action: "decline",
          callId: d.callId,
          callerDisplayName: d.callerDisplayName ?? "",
          universityName: d.universityName ?? "",
        });
      }
      await notifee.cancelNotification(detail.notification?.id);
    });
  } catch {}
}
