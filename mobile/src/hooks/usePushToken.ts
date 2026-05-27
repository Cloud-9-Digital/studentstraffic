import { useEffect } from "react";
import { NativeModules, Platform } from "react-native";

import { mobileClient } from "../api/mobileClient";
import { getToken } from "../api/tokenStore";

export function usePushToken() {
  useEffect(() => {
    if (!NativeModules.ExpoPushTokenManager) return; // not linked (Expo Go)
    registerForPushNotifications().catch(() => {});
  }, []);
}

async function registerForPushNotifications() {
  const authToken = await getToken();
  if (!authToken) return;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Notifications = require("expo-notifications");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("calls", {
      name: "Incoming Calls",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0f3d37",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return;

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "ad3c91c1-1c05-485b-9c90-78d71f0ebc36",
    });
    await mobileClient.updatePushToken(tokenData.data);
  } catch {
    // No APNs cert in dev — polling is the fallback
  }
}
