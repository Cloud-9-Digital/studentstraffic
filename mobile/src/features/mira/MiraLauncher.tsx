import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { colors } from "../../theme/tokens";
import { MiraMark } from "./MiraMark";

// The floating "Ask Mira" button over the main tabs, sitting just above the
// tab bar. Rendered by the tabs layout rather than inside the tab bar, because
// on Android a child drawn outside its parent's bounds cannot be tapped.

/** The tab bar's height above the safe area: FloatingTabBar's top padding plus a tab. */
const TAB_BAR_HEIGHT = 61;

export function MiraLauncher() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ask Mira, the study-abroad assistant"
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/mira"); }}
      style={({ pressed }) => [s.fab, { bottom: TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + 14 }, pressed && s.pressed]}
    >
      <MiraMark size={20} onDark />
      <Text style={s.label}>Ask Mira</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  fab: { position: "absolute", right: 16, flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 6, paddingRight: 16, height: 46, borderRadius: 23, backgroundColor: colors.primary, shadowColor: "#0f1f1c", shadowOpacity: 0.22, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  label: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
});
