import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TextInput as PaperInput } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";

import { Button } from "../../src/components/Button";
import { mobileClient } from "../../src/api/mobileClient";
import { colors } from "../../src/theme/tokens";

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </Svg>
  );
}

// ─── iOS — native grouped input card ─────────────────────────────────────────

function IOSInputGroup({
  email, setEmail, password, setPassword, showPwd, setShowPwd, onSubmit,
}: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPwd: boolean; setShowPwd: (v: boolean) => void;
  onSubmit: () => void;
}) {
  const pwdRef = useRef<TextInput>(null);

  return (
    <View style={ig.group}>
      {/* Email row */}
      <View style={ig.row}>
        <Ionicons name="mail-outline" size={17} color={colors.faint} style={ig.icon} />
        <TextInput
          style={ig.input}
          placeholder="Email address"
          placeholderTextColor={colors.faint}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
          selectionColor={colors.primary}
          onFocus={() => Haptics.selectionAsync()}
          onSubmitEditing={() => pwdRef.current?.focus()}
        />
      </View>

      <View style={ig.sep} />

      {/* Password row */}
      <View style={ig.row}>
        <Ionicons name="lock-closed-outline" size={17} color={colors.faint} style={ig.icon} />
        <TextInput
          ref={pwdRef}
          style={[ig.input, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor={colors.faint}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPwd}
          autoComplete="password"
          returnKeyType="done"
          selectionColor={colors.primary}
          onFocus={() => Haptics.selectionAsync()}
          onSubmitEditing={onSubmit}
        />
        <Pressable
          onPress={() => { Haptics.selectionAsync(); setShowPwd(!showPwd); }}
          hitSlop={10}
          style={ig.eyeBtn}
        >
          <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={18} color={colors.faint} />
        </Pressable>
      </View>
    </View>
  );
}

const ig = StyleSheet.create({
  group: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.14)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    paddingHorizontal: 16,
  },
  icon: { marginRight: 12 },
  input: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 0,
  },
  eyeBtn: { padding: 4 },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.10)",
    marginLeft: 45,
  },
});

// ─── Android — Paper MD3 inputs ───────────────────────────────────────────────

function AndroidInputGroup({
  email, setEmail, password, setPassword, showPwd, setShowPwd, onSubmit,
}: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPwd: boolean; setShowPwd: (v: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <PaperInput
        label="Email address"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<PaperInput.Icon icon={p => <Ionicons name="mail-outline" size={p.size - 2} color={p.color} />} />}
        onFocus={() => Haptics.selectionAsync()}
        style={aig.input}
        outlineStyle={aig.outline}
        contentStyle={aig.content}
        returnKeyType="next"
      />
      <PaperInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPwd}
        autoComplete="password"
        left={<PaperInput.Icon icon={p => <Ionicons name="lock-closed-outline" size={p.size - 2} color={p.color} />} />}
        right={
          <PaperInput.Icon
            icon={p => <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={p.size - 2} color={p.color} />}
            onPress={() => { Haptics.selectionAsync(); setShowPwd(!showPwd); }}
          />
        }
        onFocus={() => Haptics.selectionAsync()}
        onSubmitEditing={onSubmit}
        style={aig.input}
        outlineStyle={aig.outline}
        contentStyle={aig.content}
        returnKeyType="done"
      />
    </View>
  );
}

const aig = StyleSheet.create({
  input: { backgroundColor: "#fafafa" },
  outline: { borderRadius: 12 },
  content: { fontFamily: "PlusJakartaSans-Regular", fontSize: 15 },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await mobileClient.login(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  const inputProps = { email, setEmail, password, setPassword, showPwd, setShowPwd, onSubmit: handleSignIn };

  return (
    <View style={s.root}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={[s.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Nav: back + logo ── */}
          <View style={s.navRow}>
            <Pressable
              onPress={() => { Haptics.selectionAsync(); router.back(); }}
              hitSlop={12}
            >
              <View style={s.backBtn}>
                <Ionicons name="chevron-back" size={18} color={colors.ink} />
              </View>
            </Pressable>
            <Image source={require("../../assets/logo.png")} style={s.logo} resizeMode="contain" />
          </View>

          {/* ── Title ── */}
          <View style={s.titleBlock}>
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.subtitle}>Sign in to continue your MBBS journey.</Text>
          </View>

          {/* ── Google ── */}
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={({ pressed }) => [s.googleBtn, pressed && s.googlePressed]}
          >
            <GoogleIcon />
            <Text style={s.googleLabel}>Continue with Google</Text>
          </Pressable>

          {/* ── Divider ── */}
          <View style={s.divider}>
            <View style={s.divLine} />
            <Text style={s.divText}>or</Text>
            <View style={s.divLine} />
          </View>

          {/* ── Inputs ── */}
          {Platform.OS === "ios"
            ? <IOSInputGroup {...inputProps} />
            : <AndroidInputGroup {...inputProps} />
          }

          {/* ── Forgot password ── */}
          <Pressable
            onPress={() => Haptics.selectionAsync()}
            style={s.forgotRow}
            hitSlop={8}
          >
            <Text style={s.forgotLink}>Forgot password?</Text>
          </Pressable>

          {/* ── Error ── */}
          {error ? (
            <View style={s.errorBox}>
              <Ionicons name="alert-circle-outline" size={15} color="#dc2626" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* ── CTA ── */}
          {loading
            ? <ActivityIndicator color={colors.primary} style={s.spinner} />
            : <Button label="Sign in" icon="log-in" onPress={handleSignIn} />
          }

          {/* ── Register link ── */}
          <View style={s.switchRow}>
            <Text style={s.switchText}>Don't have an account? </Text>
            <Pressable onPress={() => { Haptics.selectionAsync(); router.push("/(auth)/register"); }} hitSlop={8}>
              <Text style={s.switchLink}>Register now</Text>
            </Pressable>
          </View>

          <Text style={s.legal}>By continuing you agree to our Terms and Privacy Policy.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Platform.OS === "ios" ? "#f2f2f7" : colors.background },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 22 },

  navRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  logoCentre: { flex: 1, alignItems: "center" },
  logo: { width: 148, height: 30 },
  navSpacer: { width: 36 },

  titleBlock: { gap: 5 },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 34, color: colors.ink, letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15, color: colors.muted, lineHeight: 22,
  },

  googleBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, height: 54, borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth, borderColor: "rgba(0,0,0,0.12)",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  googlePressed: { opacity: 0.80 },
  googleLabel: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 15, color: colors.ink },

  divider: { flexDirection: "row", alignItems: "center", gap: 12 },
  divLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: "rgba(0,0,0,0.12)" },
  divText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, color: colors.faint },

  forgotRow: { alignSelf: "flex-end", marginTop: -8 },
  forgotLink: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.primary },

  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#fef2f2", borderRadius: 10,
    borderWidth: 1, borderColor: "#fecaca",
    paddingHorizontal: 14, paddingVertical: 10,
  },
  errorText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, color: "#dc2626", flex: 1 },
  spinner: { marginVertical: 8 },

  switchRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  switchText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.muted },
  switchLink: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: colors.primary },
  legal: {
    fontFamily: "PlusJakartaSans-Regular", fontSize: 11,
    color: colors.faint, textAlign: "center", lineHeight: 16,
  },
});
