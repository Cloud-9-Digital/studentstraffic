import { FormInput } from "../../src/components/FormInput";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { Button } from "../../src/components/Button";
import { colors } from "../../src/theme/tokens";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    setFieldErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await mobileClient.forgotPassword(email);
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.copy}>Enter your email and we will send reset instructions if an account exists.</Text>
      </View>
      <View style={styles.form}>
        <FormInput label="Email" value={email} onChangeText={v => { setEmail(v); setFieldErrors(e => ({ ...e, email: "" })); }} error={fieldErrors.email} focusError={Object.keys(fieldErrors)[0] === "email"} keyboardType="email-address" autoCapitalize="none" />
        {message ? <Text style={styles.success}>{message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <ActivityIndicator color={colors.primary} /> : <Button label="Send reset link" icon="mail" onPress={submit} />}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 44, marginBottom: 28 },
  title: { color: colors.ink, fontSize: 34, fontWeight: "900" },
  copy: { marginTop: 10, color: colors.muted, fontSize: 15, lineHeight: 22 },
  form: { gap: 14 },
  input: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    color: colors.ink,
    fontSize: 15,
  },
  success: { color: colors.success, fontSize: 13, fontWeight: "700" },
  error: { color: "#dc2626", fontSize: 13, fontWeight: "700" },
});
