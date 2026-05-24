import { Platform, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { colors } from "../theme/tokens";

type Variant = "primary" | "secondary" | "ghost";
type Surface = "light" | "dark";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  surface?: Surface;
  style?: ViewStyle;
};

// ─── Android — Material Design 3 with ripple ─────────────────────────────────

function AndroidButton({ label, onPress, variant = "primary", surface = "light", style }: Props) {
  const dark = surface === "dark";

  const mode =
    variant === "primary" ? "contained" :
    variant === "secondary" ? "outlined" :
    "text";

  const buttonColor =
    variant === "primary" ? colors.coral :
    dark ? "transparent" : "transparent";

  const textColor =
    variant === "primary" ? "#fff" :
    dark ? "rgba(255,255,255,0.75)" :
    colors.primary;

  const rippleColor =
    variant === "primary" ? "rgba(255,255,255,0.2)" :
    dark ? "rgba(255,255,255,0.12)" :
    "rgba(15,61,55,0.1)";

  function handlePress() {
    Haptics.impactAsync(
      variant === "primary"
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );
    onPress?.();
  }

  return (
    <PaperButton
      mode={mode}
      onPress={handlePress}
      buttonColor={buttonColor}
      textColor={textColor}
      rippleColor={rippleColor}
      contentStyle={styles.androidContent}
      labelStyle={styles.androidLabel}
      style={[styles.androidBase, dark && variant === "secondary" && styles.androidDarkOutline, style]}
    >
      {label}
    </PaperButton>
  );
}

// ─── iOS — Native Pressable with system feel ─────────────────────────────────

function IOSButton({ label, onPress, variant = "primary", surface = "light", icon, style }: Props) {
  const dark = surface === "dark";
  const isPrimary = variant === "primary";
  const iconColor = isPrimary ? "#fff" : dark ? "rgba(255,255,255,0.7)" : colors.primary;

  function handlePress() {
    Haptics.impactAsync(
      isPrimary ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    );
    onPress?.();
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.iosBase,
        dark ? iosDarkVariant[variant] : iosLightVariant[variant],
        pressed && styles.iosPressed,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
      <Text style={[styles.iosLabel, dark ? iosDarkLabel[variant] : iosLightLabel[variant]]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function Button(props: Props) {
  if (Platform.OS === "android") return <AndroidButton {...props} />;
  return <IOSButton {...props} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Android
  androidBase: {
    borderRadius: 16,
    overflow: "hidden",
  },
  androidDarkOutline: {
    borderColor: "rgba(255,255,255,0.3)",
  },
  androidContent: {
    height: 52,
  },
  androidLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  // iOS
  iosBase: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
  },
  iosPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  iosLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15,
    color: "#fff",
  },
});

const iosLightVariant = StyleSheet.create({
  primary:   { backgroundColor: colors.coral },
  secondary: { backgroundColor: colors.primarySoft },
  ghost:     { backgroundColor: "transparent" },
});
const iosLightLabel = StyleSheet.create({
  primary:   { color: "#fff" },
  secondary: { color: colors.primary },
  ghost:     { color: colors.muted, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 14 },
});
const iosDarkVariant = StyleSheet.create({
  primary:   { backgroundColor: colors.coral },
  secondary: { backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  ghost:     { backgroundColor: "transparent" },
});
const iosDarkLabel = StyleSheet.create({
  primary:   { color: "#fff" },
  secondary: { color: "#fff" },
  ghost:     { color: "rgba(255,255,255,0.55)", fontFamily: "PlusJakartaSans-SemiBold", fontSize: 14 },
});
