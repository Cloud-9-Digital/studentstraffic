import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { colors } from "../../src/theme/tokens";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const goToRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/register");
  };
  const goToLogin = () => {
    Haptics.selectionAsync();
    router.push("/(auth)/login");
  };

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#073C31", "#16664E", "#C95936"]}
        locations={[0, 0.56, 1]}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.92, y: 1 }}
        style={[s.hero, { paddingTop: insets.top + 16 }]}
      >
        <View style={s.heroCopy}>
          <View style={s.brandBlock}>
            <Image source={require("../../assets/logo-white.png")} style={s.logo} resizeMode="contain" />
            <Text style={s.trustLine}>India’s trusted study abroad platform</Text>
          </View>
          <View style={s.messageBlock}>
            <Text style={s.headline}>Your future.{`\n`}Your way.</Text>
            <Text style={s.heroText}>Research. Compare. Move forward.</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[s.footer, { paddingBottom: insets.bottom + 26 }]}>
        <Pressable onPress={goToRegister} style={({ pressed }) => [s.primary, pressed && s.pressed]}>
          <Text style={s.primaryLabel}>Get started</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={goToLogin} hitSlop={10} style={s.loginRow}>
          <Text style={s.loginHint}>Already have an account? </Text>
          <Text style={s.loginLink}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF9F6" },
  hero: { flex: 1, paddingHorizontal: 24, overflow: "hidden", borderBottomLeftRadius: 34, borderBottomRightRadius: 34 },
  brandBlock: { alignItems: "flex-start" },
  logo: { width: 220, height: 47, marginBottom: 4 },
  trustLine: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, lineHeight: 16, letterSpacing: 0.35, color: "rgba(255,255,255,0.68)" },
  messageBlock: { maxWidth: 285 },
  heroCopy: { flex: 1, justifyContent: "space-between", paddingTop: 58, paddingBottom: 62 },
  headline: { fontFamily: "Fraunces-SemiBold", fontSize: 36, lineHeight: 42, letterSpacing: -0.8, color: "#FFFFFF" },
  heroText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, lineHeight: 21, color: "rgba(255,255,255,0.74)", marginTop: 14 },
  footer: { paddingHorizontal: 24, paddingTop: 20, backgroundColor: "#FFF9F6" },
  primary: { height: 55, borderRadius: 17, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  primaryLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 16, color: "#FFFFFF" },
  loginRow: { alignItems: "center", flexDirection: "row", justifyContent: "center", paddingTop: 12 },
  loginHint: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, color: colors.muted },
  loginLink: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: colors.primary },
  pressed: { opacity: 0.86, transform: [{ scale: 0.985 }] },
});
