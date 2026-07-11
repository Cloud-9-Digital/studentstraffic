import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";

import { mobileClient } from "../api/mobileClient";
import { getToken, subscribeToToken } from "../api/tokenStore";

export function usePushToken() {
  const registeredTokenRef = useRef<string | null>(null);

  useEffect(() => {
    let disposed = false;

    const register = async () => {
      const token = await getToken();
      if (disposed || !token || registeredTokenRef.current === token) return;
      const registered = await registerForPushNotifications();
      if (registered && !disposed) registeredTokenRef.current = token;
    };

    const unsubscribe = subscribeToToken((token) => {
      if (!token) registeredTokenRef.current = null;
      register().catch(() => {});
    });
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") register().catch(() => {});
    });

    register().catch(() => {});
    return () => {
      disposed = true;
      unsubscribe();
      appStateSubscription.remove();
    };
  }, []);
}

async function registerForPushNotifications() {
  const authToken = await getToken();
  if (!authToken) return false;

  if (Platform.OS === "android") {
    return mobileClient.registerAndroidPushToken();
  } else {
    return registerIOSExpo();
  }
}

// iOS: use Expo's push service (APNs) as fallback — requires paid Apple developer account
async function registerIOSExpo() {
  try {
    const Notifications = require("expo-notifications");
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return false;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "ad3c91c1-1c05-485b-9c90-78d71f0ebc36",
    });
    if (!tokenData.data) return false;
    await mobileClient.updatePushToken(tokenData.data);
    return true;
  } catch {
    // No APNs cert or expo-notifications not available
    return false;
  }
}
