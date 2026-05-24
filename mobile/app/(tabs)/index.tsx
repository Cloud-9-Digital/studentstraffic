import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { Button } from "../../src/components/Button";
import { SectionHeader } from "../../src/components/SectionHeader";
import { UniversityCard } from "../../src/components/UniversityCard";
import { colors, shadow } from "../../src/theme/tokens";

export default function HomeScreen() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => mobileClient.getDashboard(),
  });

  if (isLoading) {
    return (
      <AppScreen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </AppScreen>
    );
  }

  if (error || !data) {
    return (
      <AppScreen>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Sign in required</Text>
          <Text style={styles.emptyCopy}>Use your Students Traffic account to view dashboard, shortlists, and applications.</Text>
          <Button label="Sign in" icon="log-in" onPress={() => router.replace("/(auth)/login")} />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi {data.profile.name}</Text>
          <Text style={styles.subtle}>Your MBBS plan is taking shape.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{data.profile.name.charAt(0)}</Text>
        </View>
      </View>

      <View style={styles.planCard}>
        <Text style={styles.planKicker}>Next best action</Text>
        <Text style={styles.planTitle}>{data.nextStep}</Text>
        <Button label="Talk to counsellor" icon="logo-whatsapp" style={styles.planButton} onPress={() => router.push("/counselling")} />
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Ionicons name="bookmark" size={20} color={colors.blue} />
          <Text style={styles.metricValue}>{data.shortlistCount}</Text>
          <Text style={styles.metricLabel}>Saved</Text>
        </View>
        <View style={styles.metric}>
          <Ionicons name="document-text" size={20} color={colors.coral} />
          <Text style={styles.metricValue}>{data.applicationCount}</Text>
          <Text style={styles.metricLabel}>Applications</Text>
        </View>
      </View>

      <SectionHeader title="Recommended" action="View all" />
      <View style={styles.list}>
        {data.recommended.map((university) => (
          <UniversityCard key={university.slug} university={university} />
        ))}
      </View>

      <SectionHeader title="Explore by intent" />
      <View style={styles.intentGrid}>
        <Button label="Lowest budget" variant="secondary" icon="wallet" onPress={() => router.push("/(tabs)/search")} />
        <Button label="NMC recognised" variant="secondary" icon="shield-checkmark" onPress={() => router.push("/(tabs)/search")} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "900",
  },
  subtle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  planCard: {
    marginTop: 24,
    borderRadius: 26,
    backgroundColor: colors.ink,
    padding: 22,
    ...shadow,
  },
  planKicker: {
    color: colors.mint,
    textTransform: "uppercase",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  planTitle: {
    marginTop: 10,
    color: "#fff",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
  },
  planButton: {
    marginTop: 18,
    backgroundColor: colors.coral,
  },
  metrics: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
  },
  metric: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  metricValue: {
    marginTop: 10,
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  list: {
    gap: 12,
  },
  intentGrid: {
    gap: 10,
    marginBottom: 8,
  },
  empty: {
    paddingTop: 80,
    gap: 14,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "900",
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
