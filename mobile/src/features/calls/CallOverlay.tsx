import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useAgoraCall } from "./useAgoraCall";
import { useCall } from "../../context/CallContext";
import { colors } from "../../theme/tokens";

type Props = {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  displayName: string;
  universityName: string;
};

function useCallTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function PulsingRing() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.6, duration: 1200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        s.pulseRing,
        { transform: [{ scale }], opacity },
      ]}
    />
  );
}

export function CallOverlay({ appId, channelName, token, uid, displayName, universityName }: Props) {
  const insets = useSafeAreaInsets();
  const { endCall } = useCall();

  const { callState, remoteJoined, isMuted, isSpeakerOn, toggleMute, toggleSpeaker, leaveChannel } =
    useAgoraCall({
      appId,
      channelName,
      token,
      uid,
      onEnd: () => endCall(),
    });

  if (callState === "unavailable") {
    return (
      <View style={[s.root, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32, gap: 20, justifyContent: "center" }]}>
        <Text style={[s.statusLabel, { textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 16 }]}>
          Voice calls require a dev build.{"\n"}Not available in Expo Go.
        </Text>
        <Pressable onPress={endCall} style={s.endBtn}>
          <Ionicons name="call" size={28} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
        </Pressable>
      </View>
    );
  }

  const timer = useCallTimer(callState === "connected");

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const statusLabel =
    callState === "connecting" ? "Connecting…"
    : callState === "ringing"  ? "Calling…"
    : callState === "connected" ? timer
    : callState === "ended"    ? "Call ended"
    : callState === "error"    ? "Connection error"
    : "";

  const handleEnd = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    leaveChannel();
    await endCall();
  };

  return (
    <View style={[s.root, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}>

      {/* Guide info */}
      <View style={s.infoSection}>
        <Text style={s.uniLabel} numberOfLines={1}>{universityName}</Text>
        <View style={s.avatarWrap}>
          {callState === "ringing" && <PulsingRing />}
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
        </View>
        <Text style={s.name}>{displayName}</Text>
        <Text style={s.statusLabel}>{statusLabel}</Text>
      </View>

      {/* Controls */}
      <View style={s.controls}>
        <View style={s.controlRow}>
          {/* Mute */}
          <Pressable
            onPress={() => { Haptics.selectionAsync(); toggleMute(); }}
            style={[s.controlBtn, isMuted && s.controlBtnActive]}
          >
            <Ionicons
              name={isMuted ? "mic-off" : "mic"}
              size={24}
              color={isMuted ? colors.primary : "#fff"}
            />
            <Text style={[s.controlLabel, isMuted && s.controlLabelActive]}>
              {isMuted ? "Unmute" : "Mute"}
            </Text>
          </Pressable>

          {/* Speaker */}
          <Pressable
            onPress={() => { Haptics.selectionAsync(); toggleSpeaker(); }}
            style={[s.controlBtn, !isSpeakerOn && s.controlBtnActive]}
          >
            <Ionicons
              name={isSpeakerOn ? "volume-high" : "volume-mute"}
              size={24}
              color={!isSpeakerOn ? colors.primary : "#fff"}
            />
            <Text style={[s.controlLabel, !isSpeakerOn && s.controlLabelActive]}>
              Speaker
            </Text>
          </Pressable>
        </View>

        {/* End call */}
        <Pressable
          onPress={handleEnd}
          style={({ pressed }) => [s.endBtn, pressed && s.endBtnPressed]}
        >
          <Ionicons name="call" size={28} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a1f1c",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  uniLabel: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  avatarWrap: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },

  pulseRing: {
    borderRadius: 60,
    backgroundColor: colors.mint,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 40,
    color: "#fff",
  },

  name: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 28,
    color: "#fff",
    letterSpacing: -0.4,
    textAlign: "center",
  },

  statusLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.2,
  },

  controls: {
    width: "100%",
    paddingHorizontal: 32,
    gap: 28,
    alignItems: "center",
  },

  controlRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },

  controlBtn: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  controlBtnActive: {
    backgroundColor: "#fff",
  },

  controlLabel: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
  },

  controlLabelActive: {
    color: colors.primary,
  },

  endBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e53935",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#e53935",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  endBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
