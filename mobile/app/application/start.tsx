import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { Button } from "../../src/components/Button";
import { colors } from "../../src/theme/tokens";

export default function StartApplicationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ universitySlug?: string; courseSlug?: string }>();
  const [universitySlug, setUniversitySlug] = useState(params.universitySlug ?? "");
  const [courseSlug, setCourseSlug] = useState(params.courseSlug ?? "mbbs");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [neetScore, setNeetScore] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const application = await mobileClient.createApplication({
        universitySlug,
        courseSlug,
        personalInfo: { fullName, phone, neetScore },
      });
      router.replace(`/application/${application.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start application.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppScreen>
      <Button label="Back" variant="ghost" icon="arrow-back" onPress={() => router.back()} />
      <Text style={styles.title}>Start application</Text>
      <Text style={styles.copy}>Create a draft application. You can complete and submit it later.</Text>
      <View style={styles.form}>
        <TextInput value={universitySlug} onChangeText={setUniversitySlug} placeholder="University slug" autoCapitalize="none" style={styles.input} />
        <TextInput value={courseSlug} onChangeText={setCourseSlug} placeholder="Course slug" autoCapitalize="none" style={styles.input} />
        <TextInput value={fullName} onChangeText={setFullName} placeholder="Full name" style={styles.input} />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" style={styles.input} />
        <TextInput value={neetScore} onChangeText={setNeetScore} placeholder="NEET score" keyboardType="number-pad" style={styles.input} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <ActivityIndicator color={colors.primary} /> : <Button label="Create draft" icon="document-text" onPress={submit} />}
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
  error: { color: "#dc2626", fontSize: 13, fontWeight: "700" },
});
