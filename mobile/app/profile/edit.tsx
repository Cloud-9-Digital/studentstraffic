import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { Button } from "../../src/components/Button";
import { colors } from "../../src/theme/tokens";

export default function EditProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mobileClient.getProfile(),
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredCountries, setPreferredCountries] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setPhone(profile.phone ?? "");
    setPreferredCountries(profile.preferredCountries.join(", "));
  }, [profile]);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      await mobileClient.updateProfile({
        name,
        phone,
        preferredCountries: preferredCountries.split(",").map((item) => item.trim()).filter(Boolean),
      });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppScreen>
      <Button label="Back" variant="ghost" icon="arrow-back" onPress={() => router.back()} />
      <Text style={styles.title}>Edit profile</Text>
      <View style={styles.form}>
        <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.input} />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" style={styles.input} />
        <TextInput value={preferredCountries} onChangeText={setPreferredCountries} placeholder="Preferred countries comma separated" style={styles.input} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <ActivityIndicator color={colors.primary} /> : <Button label="Save profile" icon="checkmark" onPress={submit} />}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: { paddingTop: 16, color: colors.ink, fontSize: 30, fontWeight: "900" },
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
