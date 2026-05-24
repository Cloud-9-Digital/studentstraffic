import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { mobileClient } from "../src/api/mobileClient";
import { AppScreen } from "../src/components/AppScreen";
import { Button } from "../src/components/Button";
import { colors } from "../src/theme/tokens";

export default function CounsellingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ universitySlug?: string }>();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userState, setUserState] = useState("");
  const [neetScore, setNeetScore] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await mobileClient.requestCounselling({
        fullName,
        phone,
        email,
        userState,
        neetScore: neetScore ? Number(neetScore) : null,
        universitySlug: params.universitySlug,
        notes,
      });
      setMessage("Request received. Our counselling team will contact you soon.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppScreen>
      <Button label="Back" variant="ghost" icon="arrow-back" onPress={() => router.back()} />
      <Text style={styles.title}>Counselling request</Text>
      <Text style={styles.copy}>Share your details and our team will help with country, budget, and university fit.</Text>
      <View style={styles.form}>
        <TextInput value={fullName} onChangeText={setFullName} placeholder="Full name" style={styles.input} />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" style={styles.input} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Email optional" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        <TextInput value={userState} onChangeText={setUserState} placeholder="State" style={styles.input} />
        <TextInput value={neetScore} onChangeText={setNeetScore} placeholder="NEET score" keyboardType="number-pad" style={styles.input} />
        <TextInput value={notes} onChangeText={setNotes} placeholder="Notes" multiline style={[styles.input, styles.textarea]} />
        {message ? <Text style={styles.success}>{message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <ActivityIndicator color={colors.primary} /> : <Button label="Request callback" icon="call" onPress={submit} />}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: { paddingTop: 16, color: colors.ink, fontSize: 30, fontWeight: "900" },
  copy: { marginTop: 8, color: colors.muted, fontSize: 14, lineHeight: 21 },
  form: { marginTop: 22, gap: 12 },
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
  textarea: { minHeight: 110, paddingTop: 14, textAlignVertical: "top" },
  success: { color: colors.success, fontSize: 13, fontWeight: "700" },
  error: { color: "#dc2626", fontSize: 13, fontWeight: "700" },
});
