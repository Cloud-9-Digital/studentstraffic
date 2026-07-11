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

import { Button } from "../../src/components/Button";
import { mobileClient } from "../../src/api/mobileClient";
import { colors } from "../../src/theme/tokens";

// ─── Password strength ────────────────────────────────────────────────────────

const RULES = [
  { id: "length",  label: "8+ characters",       test: (p: string) => p.length >= 8 },
  { id: "upper",   label: "Uppercase letter",     test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",   label: "Lowercase letter",     test: (p: string) => /[a-z]/.test(p) },
  { id: "number",  label: "One number",           test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "Special character",    test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

function getStrength(p: string) {
  const n = RULES.filter(r => r.test(p)).length;
  if (n <= 1) return { label: "Weak",        color: "#ef4444", fill: 1 };
  if (n === 2) return { label: "Fair",        color: "#f59e0b", fill: 2 };
  if (n === 3) return { label: "Good",        color: "#3b82f6", fill: 3 };
  if (n === 4) return { label: "Strong",      color: "#22c55e", fill: 4 };
  return              { label: "Very strong", color: "#0f3d37", fill: 5 };
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { label, color, fill } = getStrength(password);
  return (
    <View style={pw.wrap}>
      <View style={pw.barRow}>
        <View style={pw.bars}>
          {[0,1,2,3,4].map(i => (
            <View key={i} style={[pw.bar, { backgroundColor: i < fill ? color : colors.line }]} />
          ))}
        </View>
        <Text style={[pw.strengthLabel, { color }]}>{label}</Text>
      </View>
      <View style={pw.rules}>
        {RULES.map(rule => {
          const met = rule.test(password);
          return (
            <View key={rule.id} style={pw.rule}>
              <Ionicons name={met ? "checkmark-circle" : "ellipse-outline"} size={12} color={met ? "#22c55e" : colors.line} />
              <Text style={[pw.ruleText, met && pw.ruleTextMet]}>{rule.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const pw = StyleSheet.create({
  wrap: { gap: 8, paddingTop: 10 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bars: { flex: 1, flexDirection: "row", gap: 3 },
  bar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, minWidth: 64, textAlign: "right" },
  rules: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  rule: { flexDirection: "row", alignItems: "center", gap: 4, width: "48%" },
  ruleText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.faint },
  ruleTextMet: { color: "#374151" },
});

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  const router = useRouter();
  return (
    <View style={sc.wrap}>
      <View style={sc.icon}>
        <Ionicons name="checkmark" size={38} color={colors.primary} />
      </View>
      <Text style={sc.title}>Account created!</Text>
      <Text style={sc.sub}>You're all set. Sign in to start exploring your options.</Text>
      <Button
        label="Sign in now"
        icon="log-in"
        onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); router.replace("/(auth)/login"); }}
      />
    </View>
  );
}

const sc = StyleSheet.create({
  wrap: { alignItems: "center", gap: 16, paddingVertical: 24 },
  icon: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
  },
  title: { fontFamily: "Fraunces-SemiBold", fontSize: 28, color: colors.ink, textAlign: "center" },
  sub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 21 },
});

// ─── iOS native grouped inputs ────────────────────────────────────────────────

function IOSGroupedInputs({
  name, setName, email, setEmail, phone, setPhone,
  password, setPassword, showPwd, setShowPwd, onSubmit,
}: any) {
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const pwdRef   = useRef<TextInput>(null);

  const inputStyle = [ig.input];

  return (
    <>
      {/* Group 1: name + email + phone */}
      <View style={ig.group}>
        <View style={ig.row}>
          <Ionicons name="person-outline"      size={17} color={colors.faint} style={ig.icon} />
          <TextInput style={inputStyle} placeholder="Full name" placeholderTextColor={colors.faint}
            value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name"
            returnKeyType="next" selectionColor={colors.primary}
            onFocus={() => Haptics.selectionAsync()} onSubmitEditing={() => emailRef.current?.focus()} />
        </View>
        <View style={ig.sep} />
        <View style={ig.row}>
          <Ionicons name="mail-outline"        size={17} color={colors.faint} style={ig.icon} />
          <TextInput ref={emailRef} style={inputStyle} placeholder="Email address" placeholderTextColor={colors.faint}
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email"
            returnKeyType="next" selectionColor={colors.primary}
            onFocus={() => Haptics.selectionAsync()} onSubmitEditing={() => phoneRef.current?.focus()} />
        </View>
        <View style={ig.sep} />
        <View style={ig.row}>
          <Ionicons name="call-outline"        size={17} color={colors.faint} style={ig.icon} />
          <TextInput ref={phoneRef} style={inputStyle} placeholder="+91  Phone number" placeholderTextColor={colors.faint}
            value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel"
            returnKeyType="next" selectionColor={colors.primary}
            onFocus={() => Haptics.selectionAsync()} onSubmitEditing={() => pwdRef.current?.focus()} />
        </View>
      </View>

      {/* Group 2: password */}
      <View style={ig.group}>
        <View style={ig.row}>
          <Ionicons name="lock-closed-outline" size={17} color={colors.faint} style={ig.icon} />
          <TextInput ref={pwdRef} style={[inputStyle, { flex: 1 }]} placeholder="Password" placeholderTextColor={colors.faint}
            value={password} onChangeText={setPassword} secureTextEntry={!showPwd} autoComplete="new-password"
            returnKeyType="done" selectionColor={colors.primary}
            onFocus={() => Haptics.selectionAsync()} onSubmitEditing={onSubmit} />
          <Pressable onPress={() => { Haptics.selectionAsync(); setShowPwd(!showPwd); }} hitSlop={10} style={ig.eyeBtn}>
            <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={18} color={colors.faint} />
          </Pressable>
        </View>
      </View>
    </>
  );
}

const ig = StyleSheet.create({
  group: {
    backgroundColor: "#fff", borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "rgba(0,0,0,0.14)",
    overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  row: { flexDirection: "row", alignItems: "center", height: 54, paddingHorizontal: 16 },
  icon: { marginRight: 12 },
  input: {
    flex: 1, fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16, color: colors.ink, paddingVertical: 0,
  },
  eyeBtn: { padding: 4 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(0,0,0,0.10)", marginLeft: 45 },
});

// ─── Android branded outlined inputs ──────────────────────────────────────────

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

function AndroidInputs({ name, setName, email, setEmail, phone, setPhone, password, setPassword, showPwd, setShowPwd, onSubmit }: any) {
  return (
    <View style={aig.stack}>
      {[
        { label: "Full name",     value: name,     set: setName,     icon: "person-outline",      kbType: "default",       autoComp: "name",         caps: "words"  },
        { label: "Email address", value: email,    set: setEmail,    icon: "mail-outline",        kbType: "email-address", autoComp: "email",        caps: "none"   },
        { label: "Phone number",  value: phone,    set: setPhone,    icon: "call-outline",        kbType: "phone-pad",     autoComp: "tel",          caps: "none"   },
      ].map(f => (
        <AndroidField key={f.label} icon={f.icon} placeholder={f.label} value={f.value} onChangeText={f.set}
          keyboardType={f.kbType as any} autoCapitalize={f.caps as any} autoComplete={f.autoComp as any}
          returnKeyType="next" />
      ))}
      <AndroidField icon="lock-closed-outline" placeholder="Password" value={password} onChangeText={setPassword}
        secureTextEntry={!showPwd} autoComplete="new-password"
        right={<Pressable onPress={() => { Haptics.selectionAsync(); setShowPwd(!showPwd); }} hitSlop={10} style={aig.eyeBtn}>
          <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={22} color={colors.faint} />
        </Pressable>}
        onSubmitEditing={onSubmit} returnKeyType="done" />
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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const allRulesMet = RULES.every(r => r.test(password));

  async function handleCreate() {
    if (loading) return;
    if (!allRulesMet) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); return; }
    setLoading(true); setError(null);
    try {
      await mobileClient.register({ name, email, phone, password });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  const inputProps = { name, setName, email, setEmail, phone, setPhone, password, setPassword, showPwd, setShowPwd, onSubmit: handleCreate };

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
          {!done && <View style={s.brandBlock}>
            <Image source={require("../../assets/logo.png")} style={s.logo} resizeMode="contain" />
            <Text style={s.tagline}>India’s trusted study abroad platform</Text>
          </View>}
          {!done && <View style={s.titleBlock}>
            <Text style={s.title}>Create your account</Text>
            <Text style={s.subtitle}>Save your research and keep your options organised.</Text>
          </View>}

          {done ? (
            <View style={s.successWrap}><SuccessScreen /></View>
          ) : (
            <>
              {/* ── Inputs ── */}
              {Platform.OS === "ios"
                ? <IOSGroupedInputs {...inputProps} />
                : <AndroidInputs {...inputProps} />
              }

              {/* ── Password strength ── */}
              <PasswordStrength password={password} />

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
                : <Pressable onPress={handleCreate} style={({ pressed }) => [s.submit, pressed && s.submitPressed]}><Text style={s.submitText}>Create account</Text></Pressable>
              }

              <View style={s.switchRow}>
                <Text style={s.switchText}>Already have an account? </Text>
                <Pressable onPress={() => { Haptics.selectionAsync(); router.push("/(auth)/login"); }} hitSlop={8}>
                  <Text style={s.switchLink}>Sign in</Text>
                </Pressable>
              </View>

              <Text style={s.legal}>By registering you agree to our Terms and Privacy Policy.</Text>
            </>
          )}
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
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#F1F5F2",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#E1E9E4",
  },
  brandBlock: { alignItems: "flex-start", marginTop: 24 },
  logo: { width: 192, height: 41, marginBottom: 4 },
  tagline: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, lineHeight: 16, letterSpacing: 0.28, color: colors.muted },

  titleBlock: { gap: 6, paddingTop: 28 },
  title: { fontFamily: "Fraunces-SemiBold", fontSize: 28, color: colors.ink, letterSpacing: -0.45, lineHeight: 34 },
  subtitle: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.muted, lineHeight: 21 },

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
  legal: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.faint, textAlign: "center", lineHeight: 16 },

  successWrap: { flex: 1, justifyContent: "center" },
});
