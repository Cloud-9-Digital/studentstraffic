import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { Button } from "../../src/components/Button";
import { StatusPill } from "../../src/components/StatusPill";
import { colors, shadow } from "../../src/theme/tokens";

export default function ApplicationsScreen() {
  const router = useRouter();
  const { data = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: () => mobileClient.getApplications(),
  });

  return (
    <AppScreen>
      <Text style={styles.title}>Applications</Text>
      <Text style={styles.copy}>Track what is pending, submitted, and ready for counselling follow-up.</Text>

      <View style={styles.list}>
        {data.map((application) => (
          <View key={application.id} style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="document-text" size={22} color={colors.primary} />
              <StatusPill status={application.status} />
            </View>
            <Text style={styles.name}>{application.universityName}</Text>
            <Text style={styles.meta}>{application.course} · Updated {application.updatedAt}</Text>
            <Text style={styles.next}>{application.nextStep}</Text>
            <Button label="View details" variant="secondary" icon="chevron-forward" onPress={() => router.push(`/application/${application.id}`)} style={styles.cardButton} />
          </View>
        ))}
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No applications yet</Text>
          <Text style={styles.next}>Start from a university page or choose one from the application flow.</Text>
        </View>
      ) : null}
      <Button label="Start new application" icon="add-circle" style={styles.button} onPress={() => router.push("/application/start")} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 12,
    color: colors.ink,
    fontSize: 30,
    fontWeight: "900",
  },
  copy: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  list: {
    marginTop: 20,
    gap: 12,
  },
  card: {
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    ...shadow,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    marginTop: 14,
    color: colors.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900",
  },
  meta: {
    marginTop: 5,
    color: colors.faint,
    fontSize: 13,
  },
  next: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    marginTop: 18,
  },
  cardButton: {
    marginTop: 14,
  },
  empty: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: 18,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
  },
});
