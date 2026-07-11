import { useEffect, useState } from "react";
import { Modal, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
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
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "../src/theme/tokens";
import { paperTheme } from "../src/theme/paper-theme";
import { ToastProvider } from "../src/components/Toast";
import { CompareProvider } from "../src/context/CompareContext";
import { CallProvider, useCall } from "../src/context/CallContext";
import { CallOverlay, OutgoingCallOverlay } from "../src/features/calls/CallOverlay";
import { IncomingCallBanner } from "../src/features/calls/IncomingCallBanner";
import { usePushToken } from "../src/hooks/usePushToken";
import {
  setupCallKeep,
  consumePendingCallData,
  consumePendingChatNavigation,
  displayIncomingCall,
  endCallKeepCall,
} from "../src/services/callNotificationService";

SplashScreen.preventAutoHideAsync();

const PERSISTED_QUERY_KEYS = new Set([
  "profile",
  "dashboard",
  "shortlists",
  "applications",
  "searchOptions",
]);

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
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60_000,
        // Keep useful account data available offline, but do not serialize
        // thousands of search rows into AsyncStorage on every cache update.
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            typeof query.queryKey[0] === "string" && PERSISTED_QUERY_KEYS.has(query.queryKey[0]),
        },
      }}
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
            <IOSPushNotificationHandler />
            <CallKeepEventHandler />
            <PendingChatNavigation />
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
  const { activeCall, outgoingCall, cancelOutgoingCall } = useCall();
  return (
    <Modal visible={!!activeCall || !!outgoingCall} animationType="slide" statusBarTranslucent>
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
      {!activeCall && outgoingCall && <OutgoingCallOverlay {...outgoingCall} onCancel={cancelOutgoingCall} />}
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
  const { dismissCallById, openIncomingCallById } = useCall();
  const queryClient = useQueryClient();

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
        } else if (data?.type === "call_ended" && data.callId) {
          dismissCallById(data.callId);
        } else if (data?.type === "guide_message") {
          const conversationId = Number(data.conversationId);
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          if (Number.isFinite(conversationId)) queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
        }
      });
    } catch {}
    return () => unsub?.();
  }, [dismissCallById, openIncomingCallById, queryClient]);

  return null;
}

function PendingChatNavigation() {
  const router = useRouter();
  useEffect(() => {
    consumePendingChatNavigation().then((pending) => {
      if (pending?.conversationId) router.push({ pathname: "/chat/[id]", params: { id: pending.conversationId } });
    });
  }, [router]);
  return null;
}

// iOS standard push notifications are the fallback until PushKit/VoIP
// credentials are configured. Tapping one opens the same incoming-call flow.
function IOSPushNotificationHandler() {
  const { dismissCallById, openIncomingCallById } = useCall();

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    let receivedSubscription: { remove: () => void } | undefined;
    let responseSubscription: { remove: () => void } | undefined;
    try {
      const Notifications = require("expo-notifications");
      const handleCallData = (data: Record<string, unknown>) => {
        if (typeof data.callId !== "string") return;
        if (data.type === "call_ended") {
          dismissCallById(data.callId);
          return;
        }
        if (data.type !== "incoming_call") return;
        const callerDisplayName = typeof data.callerDisplayName === "string" ? data.callerDisplayName : "Incoming call";
        const universityName = typeof data.universityName === "string" ? data.universityName : "Students Traffic";
        displayIncomingCall(data.callId, callerDisplayName).catch(() => {});
        openIncomingCallById(data.callId, callerDisplayName, universityName);
      };

      receivedSubscription = Notifications.addNotificationReceivedListener((notification: any) => {
        handleCallData(notification.request.content.data ?? {});
      });
      responseSubscription = Notifications.addNotificationResponseReceivedListener((response: any) => {
        handleCallData(response.notification.request.content.data ?? {});
      });
      Notifications.getLastNotificationResponseAsync().then((response: any) => {
        if (response) handleCallData(response.notification.request.content.data ?? {});
      }).catch(() => {});
    } catch {
      // expo-notifications is unavailable in a bare web runtime.
    }

    return () => {
      receivedSubscription?.remove();
      responseSubscription?.remove();
    };
  }, [dismissCallById, openIncomingCallById]);

  return null;
}

// Handles CallKeep events (Accept / Decline on native call screen)
// and processes pending call data stored when app was killed.
function CallKeepEventHandler() {
  const {
    openIncomingCallById,
    acceptIncomingCallById,
    declineIncomingCallById,
  } = useCall();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    setupCallKeep();

    // If app was launched by user accepting a call from native UI (killed state),
    // pending call data was stored in AsyncStorage by the background handler.
    consumePendingCallData().then((pending) => {
      if (!pending) return;
      if (pending.action === "accept") {
        acceptIncomingCallById(pending.callId).catch(() => {});
        return;
      }
      if (pending.action === "decline") {
        declineIncomingCallById(pending.callId);
        return;
      }
      openIncomingCallById(pending.callId, pending.callerDisplayName, pending.universityName);
    }).catch(() => {});

    let RNCallKeep: any;
    try {
      RNCallKeep = require("react-native-callkeep").default;
    } catch {
      return;
    }

    const onAnswer = ({ callUUID }: { callUUID: string }) => {
      // Keep the Android Telecom call alive.  The successful token exchange
      // promotes it to ACTIVE, so the system UI never reports a false ended
      // call while the in-app audio session is starting.
      acceptIncomingCallById(callUUID).catch(() => {});
    };

    const onDecline = ({ callUUID }: { callUUID: string }) => {
      endCallKeepCall(callUUID);
      declineIncomingCallById(callUUID);
    };

    const answerSub = RNCallKeep.addEventListener("answerCall", onAnswer);
    const declineSub = RNCallKeep.addEventListener("endCall", onDecline);

    return () => {
      answerSub?.remove?.();
      declineSub?.remove?.();
    };
  }, [openIncomingCallById, acceptIncomingCallById, declineIncomingCallById]);

  return null;
}
