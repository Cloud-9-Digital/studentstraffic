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
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { colors } from "../../src/theme/tokens";

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

// ─── Android — branded outlined inputs ────────────────────────────────────────

function AndroidField({ icon, right, ...props }: any) {
  return (
    <View style={aig.field}>
      <Ionicons name={icon} size={22} color={colors.faint} style={aig.icon} />
      <TextInput
        {...props}
        style={aig.input}
        placeholderTextColor={colors.faint}
        selectionColor={colors.primary}
        onFocus={() => { Haptics.selectionAsync(); props.onFocus?.(); }}
      />
      {right}
    </View>
  );
}

function AndroidInputGroup({
  email, setEmail, password, setPassword, showPwd, setShowPwd, onSubmit,
}: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPwd: boolean; setShowPwd: (v: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={aig.stack}>
      <AndroidField
        icon="mail-outline"
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
      />
      <AndroidField
        icon="lock-closed-outline"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPwd}
        autoComplete="password"
        right={<Pressable onPress={() => { Haptics.selectionAsync(); setShowPwd(!showPwd); }} hitSlop={10} style={aig.eyeBtn}>
          <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={22} color={colors.faint} />
        </Pressable>}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
    </View>
  );
}

const aig = StyleSheet.create({
  stack: { gap: 12 },
  field: { height: 58, borderRadius: 14, borderWidth: 1, borderColor: "rgba(15,61,55,0.15)", backgroundColor: "#FAFAFA", flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  icon: { marginRight: 13 },
  input: { flex: 1, alignSelf: "stretch", fontFamily: "PlusJakartaSans-Regular", fontSize: 16, letterSpacing: 0, color: colors.ink, paddingTop: 0, paddingBottom: 0, textAlignVertical: "center", includeFontPadding: false },
  eyeBtn: { alignItems: "center", justifyContent: "center", paddingLeft: 12, alignSelf: "stretch" },
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
          <View style={s.navRow}>
            <Pressable onPress={() => { Haptics.selectionAsync(); router.back(); }} hitSlop={12}>
              <View style={s.backBtn}><Ionicons name="chevron-back" size={18} color={colors.ink} /></View>
            </Pressable>
          </View>
          <View style={s.brandBlock}>
            <Image source={require("../../assets/logo.png")} style={s.logo} resizeMode="contain" />
            <Text style={s.tagline}>India’s trusted study abroad platform</Text>
          </View>
          <View style={s.titleBlock}>
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.subtitle}>Sign in to continue planning your next step.</Text>
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
            : <Pressable onPress={handleSignIn} style={({ pressed }) => [s.submit, pressed && s.submitPressed]}><Text style={s.submitText}>Sign in</Text></Pressable>
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
  root: { flex: 1, backgroundColor: "#FBFCFA" },
  flex: { flex: 1 },
  scroll: { gap: 20, paddingHorizontal: 24 },

  navRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#F1F5F2",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#E1E9E4",
  },
  brandBlock: { alignItems: "flex-start", marginTop: 28 },
  logo: { width: 205, height: 44, marginBottom: 4 },
  tagline: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, lineHeight: 16, letterSpacing: 0.28, color: colors.muted },

  titleBlock: { gap: 6, paddingTop: 34 },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 28, color: colors.ink, letterSpacing: -0.45,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14, color: colors.muted, lineHeight: 21,
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
  submit: { height: 54, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  submitText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 16, color: "#fff" },
  submitPressed: { opacity: 0.86, transform: [{ scale: 0.985 }] },

  switchRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  switchText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.muted },
  switchLink: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: colors.primary },
  legal: {
    fontFamily: "PlusJakartaSans-Regular", fontSize: 11,
    color: colors.faint, textAlign: "center", lineHeight: 16,
  },
});
