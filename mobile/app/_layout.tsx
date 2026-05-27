import { useEffect, useState } from "react";
import { Modal, NativeModules } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_400Regular_Italic,
} from "@expo-google-fonts/fraunces";
import { PaperProvider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "../src/theme/tokens";
import { paperTheme } from "../src/theme/paper-theme";
import { ToastProvider } from "../src/components/Toast";
import { CompareProvider } from "../src/context/CompareContext";
import { CallProvider, useCall } from "../src/context/CallContext";
import { CallOverlay } from "../src/features/calls/CallOverlay";
import { IncomingCallBanner } from "../src/features/calls/IncomingCallBanner";
import { usePushToken } from "../src/hooks/usePushToken";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "PlusJakartaSans-Regular":   PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium":    PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold":  PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold":      PlusJakartaSans_700Bold,
    "PlusJakartaSans-ExtraBold": PlusJakartaSans_800ExtraBold,
    "Fraunces-Light":            Fraunces_300Light,
    "Fraunces-Regular":          Fraunces_400Regular,
    "Fraunces-Medium":           Fraunces_500Medium,
    "Fraunces-SemiBold":         Fraunces_600SemiBold,
    "Fraunces-Italic":           Fraunces_400Regular_Italic,
  });

  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          gcTime: 15 * 60_000,
          retry: 1,
        },
      },
    })
  );

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider
          theme={paperTheme}
          settings={{
            icon: (props) => (
              <MaterialCommunityIcons
                name={props.name as any}
                size={props.size}
                color={props.color}
              />
            ),
          }}
        >
          <ToastProvider>
            <CompareProvider>
            <CallProvider>
            <PushNotificationSetup />
            <NotificationTapHandler />
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen
                name="counselling"
                options={{
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="country/[slug]"
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="neet-match"
                options={{
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
            </Stack>
            <ActiveCallModal />
            <IncomingCallBanner />
            </CallProvider>
            </CompareProvider>
          </ToastProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function ActiveCallModal() {
  const { activeCall } = useCall();
  return (
    <Modal visible={!!activeCall} animationType="slide" statusBarTranslucent>
      {activeCall && (
        <CallOverlay
          appId={activeCall.appId}
          channelName={activeCall.channelName}
          token={activeCall.token}
          uid={activeCall.uid}
          displayName={activeCall.displayName}
          universityName={activeCall.universityName}
        />
      )}
    </Modal>
  );
}

function PushNotificationSetup() {
  usePushToken();
  return null;
}

function NotificationTapHandler() {
  const { openIncomingCallById } = useCall();

  useEffect(() => {
    if (!NativeModules.ExpoPushTokenManager) return; // not linked (Expo Go)
    let sub: { remove: () => void } | undefined;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Notifications = require("expo-notifications");
    sub = Notifications.addNotificationResponseReceivedListener((response: any) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      if (
        data?.type === "incoming_call" &&
        typeof data?.callId === "string" &&
        typeof data?.callerDisplayName === "string" &&
        typeof data?.universityName === "string"
      ) {
        openIncomingCallById(data.callId, data.callerDisplayName, data.universityName);
      }
    });
    return () => sub?.remove();
  }, [openIncomingCallById]);

  return null;
}
