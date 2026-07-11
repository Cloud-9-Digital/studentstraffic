import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCall } from "../../context/CallContext";

type Props = {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  displayName: string;
  universityName: string;
};

export function CallOverlay(_props: Props) {
  const insets = useSafeAreaInsets();
  const { endCall } = useCall();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}>
      <Text style={styles.message}>
        Voice calls are available in the Android app.
      </Text>
      <Pressable onPress={endCall} style={styles.endButton} accessibilityRole="button">
        <Ionicons name="call" size={28} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    backgroundColor: "#0a1f1c",
    paddingHorizontal: 28,
  },
  message: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    textAlign: "center",
  },
  endButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b71c1c",
  },
});
