import { useEffect, useState } from "react";
import { Modal, Platform } from "react-native";
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
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from "@expo-google-fonts/fraunces";
import { PaperProvider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "../src/theme/tokens";
import { paperTheme } from "../src/theme/paper-theme";
import { ToastProvider } from "../src/components/Toast";
import { CompareProvider } from "../src/context/CompareContext";
import { CallProvider, useCall } from "../src/context/CallContext";
import { CallOverlay } from "../src/features/calls/CallOverlay";
import { IncomingCallBanner } from "../src/features/calls/IncomingCallBanner";
import { usePushToken } from "../src/hooks/usePushToken";
import {
  registerBackgroundHandlers,
  setupCallKeep,
  consumePendingCallData,
  endCallKeepCall,
} from "../src/services/callNotificationService";

// Covers foreground/background scenarios; killed-state is handled by index.js entry point.
registerBackgroundHandlers();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "PlusJakartaSans-Regular":   PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium":    PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold":  PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold":      PlusJakartaSans_700Bold,
    "PlusJakartaSans-ExtraBold": PlusJakartaSans_800ExtraBold,
    "Fraunces-Regular":          Fraunces_400Regular,
    "Fraunces-Medium":           Fraunces_500Medium,
    "Fraunces-SemiBold":         Fraunces_600SemiBold,
  });

  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          gcTime: 24 * 60 * 60_000,
          retry: 1,
        },
      },
    })
  );

  const [persister] = useState(
    () => createAsyncStoragePersister({
      storage: AsyncStorage,
      key: "ST_QUERY_CACHE_V1",
      throttleTime: 1000,
    })
  );

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 24 * 60 * 60_000 }}
    >
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
            <FCMForegroundHandler />
            <CallKeepEventHandler />
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
    </PersistQueryClientProvider>
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

// Handles FCM messages while the app is in the foreground.
// Background / killed state is handled by registerBackgroundHandlers() above.
function FCMForegroundHandler() {
  const { openIncomingCallById } = useCall();

  useEffect(() => {
    if (Platform.OS !== "android") return;
    let unsub: (() => void) | undefined;
    try {
      const messaging = require("@react-native-firebase/messaging").default;
      unsub = messaging().onMessage(async (message: any) => {
        const data = message.data as Record<string, string>;
        if (data?.type === "incoming_call") {
          // App is open — the polling banner will show within 3s.
          // Immediately show it without waiting for next poll.
          openIncomingCallById(data.callId, data.callerDisplayName, data.universityName);
        }
      });
    } catch {}
    return () => unsub?.();
  }, [openIncomingCallById]);

  return null;
}

// Handles CallKeep events (Accept / Decline on native call screen)
// and processes pending call data stored when app was killed.
function CallKeepEventHandler() {
  const { openIncomingCallById, acceptIncomingCall, declineIncomingCall } = useCall();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    setupCallKeep();

    // If app was launched by user accepting a call from native UI (killed state),
    // pending call data was stored in AsyncStorage by the background handler.
    consumePendingCallData().then((pending) => {
      if (!pending) return;
      openIncomingCallById(pending.callId, pending.callerDisplayName, pending.universityName);
    }).catch(() => {});

    let RNCallKeep: any;
    try {
      RNCallKeep = require("react-native-callkeep").default;
    } catch {
      return;
    }

    const onAnswer = ({ callUUID }: { callUUID: string }) => {
      endCallKeepCall(callUUID); // dismiss native call UI
      acceptIncomingCall();
    };

    const onDecline = ({ callUUID }: { callUUID: string }) => {
      endCallKeepCall(callUUID);
      declineIncomingCall();
    };

    const answerSub = RNCallKeep.addEventListener("answerCall", onAnswer);
    const declineSub = RNCallKeep.addEventListener("endCall", onDecline);

    return () => {
      answerSub?.remove?.();
      declineSub?.remove?.();
    };
  }, [openIncomingCallById, acceptIncomingCall, declineIncomingCall]);

  return null;
}
