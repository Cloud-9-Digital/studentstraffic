import { useEffect } from "react";
import { Platform } from "react-native";

import { mobileClient } from "../api/mobileClient";
import { getToken } from "../api/tokenStore";

export function usePushToken() {
  useEffect(() => {
    registerForPushNotifications().catch(() => {});
  }, []);
}

async function registerForPushNotifications() {
  const authToken = await getToken();
  if (!authToken) return;

  if (Platform.OS === "android") {
    await registerAndroidFCM();
  } else {
    await registerIOSExpo();
  }
}

// Android: use @react-native-firebase/messaging for a direct FCM token.
// The server sends data-only high-priority FCM messages → notifee shows full-screen call UI.
async function registerAndroidFCM() {
  try {
    const messaging = require("@react-native-firebase/messaging").default;

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus?.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus?.PROVISIONAL ||
      authStatus === 1 || authStatus === 2; // numeric fallback

    if (!enabled) return;

    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await mobileClient.updatePushToken(fcmToken);
    }

    // Refresh token if Firebase rotates it
    messaging().onTokenRefresh(async (token: string) => {
      const authToken = await getToken();
      if (authToken && token) {
        await mobileClient.updatePushToken(token).catch(() => {});
      }
    });
  } catch {
    // Firebase not linked or not configured
  }
}

// iOS: use Expo's push service (APNs) as fallback — requires paid Apple developer account
async function registerIOSExpo() {
  try {
    const Notifications = require("expo-notifications");
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "ad3c91c1-1c05-485b-9c90-78d71f0ebc36",
    });
    if (tokenData.data) {
      await mobileClient.updatePushToken(tokenData.data);
    }
  } catch {
    // No APNs cert or expo-notifications not available
  }
}
