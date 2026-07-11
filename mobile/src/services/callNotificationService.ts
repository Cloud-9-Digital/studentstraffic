import { NativeModules, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_CALL_KEY = "ST_PENDING_CALL_DATA_V3";
const CHANNEL_ACTIVE   = "active_call";
const INCOMING_RING_TIMEOUT_MS = 60_000;

export type PendingCallAction = {
  action: "accept" | "decline";
  callId: string;
  callerDisplayName: string;
  universityName: string;
};

// ─── CallKeep setup ──────────────────────────────────────────────────────────

export async function setupCallKeep() {
  if (Platform.OS === "web") return false;
  try {
    const RNCallKeep = require("react-native-callkeep").default;
    const accepted = await RNCallKeep.setup({
      ios: {
        appName: "Students Traffic",
        supportsVideo: false,
        maximumCallGroups: "1",
        maximumCallsPerCallGroup: "1",
        includesCallsInRecents: false,
      },
      android: {
        alertTitle: "Phone account permission",
        alertDescription: "Students Traffic needs access to your phone accounts to receive calls",
        cancelButton: "Cancel",
        okButton: "Allow",
        additionalPermissions: [],
        foregroundService: {
          // Keep this aligned with IncomingCallNotification.kt. The original
          // channel may be muted permanently by Android after an app update.
          channelId: "incoming_calls_v2",
          channelName: "Incoming Calls",
          notificationTitle: "Waiting for calls",
        },
      },
    });
    return accepted !== false;
  } catch (error) {
    console.error("[callkeep] setup failed", error);
    return false;
  }
}

// ─── Show incoming call via ConnectionService (works even when app is killed) ─

export async function displayIncomingCall(callId: string, callerDisplayName: string) {
  if (Platform.OS === "web") return false;
  try {
    const RNCallKeep = require("react-native-callkeep").default;
    await RNCallKeep.displayIncomingCall(callId, callerDisplayName, callerDisplayName, "generic", false);
    return true;
  } catch (error) {
    console.error("[callkeep] incoming call UI failed", error);
    return false;
  }
}

export function endCallKeepCall(callId: string) {
  if (Platform.OS !== "android") return;
  try {
    const RNCallKeep = require("react-native-callkeep").default;
    RNCallKeep.endCall(callId);
  } catch {}
}

export function setCallKeepCallActive(callId: string) {
  if (Platform.OS !== "android") return;
  try {
    const RNCallKeep = require("react-native-callkeep").default;
    RNCallKeep.setCurrentCallActive(callId);
  } catch {}
}

export function scheduleIncomingCallExpiry(callId: string) {
  const timeout = setTimeout(() => {
    cancelIncomingCallNotification(callId).catch(() => {});
    const { mobileClient } = require("../api/mobileClient");
    mobileClient.endCall(callId).catch(() => undefined);
  }, INCOMING_RING_TIMEOUT_MS);
  return () => clearTimeout(timeout);
}

// ─── Pending call data (for killed-app accept flow) ──────────────────────────

export async function storePendingCallData(data: {
  callId: string;
  callerDisplayName: string;
  universityName: string;
}) {
  await AsyncStorage.setItem(PENDING_CALL_KEY, JSON.stringify(data));
}

export async function consumePendingCallData(): Promise<{
  callId: string;
  callerDisplayName: string;
  universityName: string;
  action?: "accept" | "decline";
} | null> {
  try {
    const nativePending = await NativeModules.IncomingCallStore?.consumePendingCall?.();
    if (nativePending?.callId) return nativePending;
    const raw = await AsyncStorage.getItem(PENDING_CALL_KEY);
    if (!raw) return null;
    await AsyncStorage.removeItem(PENDING_CALL_KEY);
    return JSON.parse(raw) as { callId: string; callerDisplayName: string; universityName: string; action?: "accept" | "decline" };
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

export async function cancelIncomingCallNotification(callId: string) {
  endCallKeepCall(callId);
  try {
    NativeModules.IncomingCallStore?.cancelIncomingCall?.(callId);
  } catch {}
  if (Platform.OS !== "android") return;
  try {
    const notifee = require("@notifee/react-native").default;
    await notifee.cancelNotification(`incoming_${callId}`);
  } catch {}
}

// ─── Background handlers (must run in index.js before React mounts) ──────────

export function registerBackgroundHandlers() {
  if (Platform.OS === "web") return;

  try {
    const messaging = require("@react-native-firebase/messaging").default;
    messaging().setBackgroundMessageHandler(async (message: any) => {
      const data = message.data as Record<string, string>;
      if (data?.type !== "incoming_call") return;

      // Android's native receiver renders the incoming UI before React Native
      // starts. A second JS UI here causes delayed or duplicate calls.
      if (Platform.OS === "android") return;

      await storePendingCallData({
        callId: data.callId,
        callerDisplayName: data.callerDisplayName,
        universityName: data.universityName,
      });
      const setupSucceeded = await setupCallKeep();
      if (setupSucceeded) await displayIncomingCall(data.callId, data.callerDisplayName);
    });
  } catch (error) {
    console.error("[fcm] background handler registration failed", error);
  }

}
