import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_CALL_KEY = "ST_PENDING_CALL_DATA_V3";
const CHANNEL_ACTIVE   = "active_call";

export type PendingCallAction = {
  action: "accept" | "decline";
  callId: string;
  callerDisplayName: string;
  universityName: string;
};

// ─── CallKeep setup ──────────────────────────────────────────────────────────

export async function setupCallKeep() {
  if (Platform.OS !== "android") return;
  try {
    const RNCallKeep = require("react-native-callkeep").default;
    await RNCallKeep.setup({
      android: {
        alertTitle: "Phone account permission",
        alertDescription: "Students Traffic needs access to your phone accounts to receive calls",
        cancelButton: "Cancel",
        okButton: "Allow",
        additionalPermissions: [],
        foregroundService: {
          channelId: "incoming_calls",
          channelName: "Incoming Calls",
          notificationTitle: "Waiting for calls",
        },
      },
    });
  } catch {}
}

// ─── Show incoming call via ConnectionService (works even when app is killed) ─

export function displayIncomingCall(callId: string, callerDisplayName: string) {
  if (Platform.OS !== "android") return;
  try {
    const RNCallKeep = require("react-native-callkeep").default;
    RNCallKeep.displayIncomingCall(callId, callerDisplayName, callerDisplayName, "generic", false);
  } catch {}
}

export function endCallKeepCall(callId: string) {
  if (Platform.OS !== "android") return;
  try {
    const RNCallKeep = require("react-native-callkeep").default;
    RNCallKeep.endCall(callId);
  } catch {}
}

// ─── Pending call data (for killed-app accept flow) ──────────────────────────

export async function storePendingCallData(data: {
  callId: string;
  callerDisplayName: string;
  universityName: string;
}) {
  await AsyncStorage.setItem(PENDING_CALL_KEY, JSON.stringify(data));
}

export async function consumePendingCallData() {
  try {
    const raw = await AsyncStorage.getItem(PENDING_CALL_KEY);
    if (!raw) return null;
    await AsyncStorage.removeItem(PENDING_CALL_KEY);
    return JSON.parse(raw) as { callId: string; callerDisplayName: string; universityName: string };
  } catch {
    return null;
  }
}

// Keep old name for compatibility with CallContext
export async function storePendingCallAction(action: PendingCallAction) {
  await AsyncStorage.setItem(PENDING_CALL_KEY, JSON.stringify(action));
}

export async function consumePendingCallAction(): Promise<PendingCallAction | null> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_CALL_KEY);
    if (!raw) return null;
    await AsyncStorage.removeItem(PENDING_CALL_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── Foreground service (keeps app alive during active call) ─────────────────

async function ensureActiveChannel(notifee: any) {
  const { AndroidImportance } = require("@notifee/react-native");
  await notifee.createChannel({
    id: CHANNEL_ACTIVE,
    name: "Active Call",
    importance: AndroidImportance.LOW,
    sound: "",
    vibration: false,
  });
}

export async function startCallForegroundService(callId: string, displayName: string) {
  if (Platform.OS !== "android") return;
  try {
    const notifee = require("@notifee/react-native").default;
    const { AndroidImportance } = require("@notifee/react-native");
    await ensureActiveChannel(notifee);
    await notifee.displayNotification({
      id: `fs_${callId}`,
      title: "Call in progress",
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

export async function cancelIncomingCallNotification(_callId: string) {
  // With CallKeep, calls are ended via endCallKeepCall — nothing to cancel here
}

// ─── Background handlers (must run in index.js before React mounts) ──────────

export function registerBackgroundHandlers() {
  if (Platform.OS !== "android") return;

  try {
    const messaging = require("@react-native-firebase/messaging").default;
    messaging().setBackgroundMessageHandler(async (message: any) => {
      const data = message.data as Record<string, string>;
      if (data?.type !== "incoming_call") return;

      // Store call data so the app can use it when it opens after user accepts
      await storePendingCallData({
        callId: data.callId,
        callerDisplayName: data.callerDisplayName,
        universityName: data.universityName,
      });

      // Ensure phone account is registered before showing call UI
      await setupCallKeep();

      // Show native Android incoming call screen via ConnectionService
      displayIncomingCall(data.callId, data.callerDisplayName);
    });
  } catch {}

  // Notifee background event — only needed for active-call foreground service dismissal
  try {
    const notifee = require("@notifee/react-native").default;
    notifee.onBackgroundEvent(async () => {});
  } catch {}
}
