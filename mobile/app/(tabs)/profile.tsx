import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { Button } from "../../src/components/Button";
import { colors } from "../../src/theme/tokens";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mobileClient.getProfile(),
  });

  return (
    <AppScreen>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile?.name.charAt(0) ?? "S"}</Text>
        </View>
        <Text style={styles.name}>{profile?.name ?? "Student"}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.info}>
          <Ionicons name="call" size={18} color={colors.primary} />
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{profile?.phone}</Text>
        </View>
        <View style={styles.info}>
          <Ionicons name="trophy" size={18} color={colors.coral} />
          <Text style={styles.infoLabel}>NEET</Text>
          <Text style={styles.infoValue}>{profile?.neetScore ?? "Add"}</Text>
        </View>
        <View style={styles.info}>
          <Ionicons name="wallet" size={18} color={colors.blue} />
          <Text style={styles.infoLabel}>Budget</Text>
          <Text style={styles.infoValue}>${profile?.budgetUsd?.toLocaleString() ?? "Add"}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Preferred countries</Text>
      <View style={styles.chips}>
        {profile?.preferredCountries.map((country) => (
          <Text key={country} style={styles.chip}>{country}</Text>
        ))}
      </View>

      <Button label="Edit profile" icon="create" onPress={() => router.push("/profile/edit")} />
      <Button label="Sign out" variant="secondary" icon="log-out" style={styles.signOut} onPress={async () => {
        await mobileClient.logout();
        router.replace("/(auth)/welcome");
      }} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    marginTop: 12,
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: colors.primary,
    padding: 28,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "900",
  },
  name: {
    marginTop: 14,
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },
  email: {
    marginTop: 4,
    color: "#cfe7e2",
    fontSize: 14,
  },
  infoGrid: {
    marginTop: 16,
    gap: 10,
  },
  info: {
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  infoLabel: {
    marginTop: 8,
    color: colors.faint,
    fontSize: 12,
    fontWeight: "800",
  },
  infoValue: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900",
  },
  sectionTitle: {
    marginTop: 26,
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
  },
  chips: {
    marginTop: 12,
    marginBottom: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: colors.blueSoft,
    color: colors.blue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: "800",
  },
  signOut: {
    marginTop: 10,
  },
});
