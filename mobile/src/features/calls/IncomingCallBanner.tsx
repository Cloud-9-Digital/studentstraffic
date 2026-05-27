import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useCall } from "../../context/CallContext";
import { colors } from "../../theme/tokens";

export function IncomingCallBanner() {
  const { incomingCall, acceptIncomingCall, declineIncomingCall, isStarting } = useCall();
  const insets = useSafeAreaInsets();
  const slideY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (incomingCall) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 18,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideY, {
        toValue: -120,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [incomingCall]);

  if (!incomingCall) return null;

  const initials = incomingCall.peerName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Animated.View
      style={[
        s.container,
        { top: insets.top + 8, transform: [{ translateY: slideY }] },
      ]}
    >
      <View style={s.card}>
        <View style={s.left}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View style={s.info}>
            <Text style={s.title} numberOfLines={1}>
              {incomingCall.peerName} is calling
            </Text>
            <Text style={s.sub} numberOfLines={1}>{incomingCall.universityName}</Text>
          </View>
        </View>
        <View style={s.actions}>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); declineIncomingCall(); }}
            style={s.declineBtn}
          >
            <Ionicons name="call" size={18} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
          </Pressable>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); acceptIncomingCall(); }}
            style={[s.acceptBtn, isStarting && s.btnDisabled]}
            disabled={isStarting}
          >
            <Ionicons name="call" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 999,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0a1f1c",
    borderRadius: 22,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15,
    color: "#fff",
  },
  info: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "#fff",
  },
  sub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    flexShrink: 0,
  },
  declineBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#b71c1c",
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.5 },
});
