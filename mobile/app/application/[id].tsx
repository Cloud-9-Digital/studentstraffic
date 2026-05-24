import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { Button } from "../../src/components/Button";
import { StatusPill } from "../../src/components/StatusPill";
import { colors, shadow } from "../../src/theme/tokens";

export default function ApplicationDetailScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => mobileClient.getApplication(id),
    enabled: Boolean(id),
  });
  const submitMutation = useMutation({
    mutationFn: () => mobileClient.updateApplication(id, { status: "submitted" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", id] });
    },
  });

  if (isLoading || !data) {
    return (
      <AppScreen scroll={false}>
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <Button label="Back" variant="ghost" icon="arrow-back" onPress={() => router.back()} />
      <View style={styles.card}>
        <StatusPill status={data.status} />
        <Text style={styles.title}>{data.universityName}</Text>
        <Text style={styles.copy}>{data.course} · {[data.universityCity, data.countryName].filter(Boolean).join(", ")}</Text>
        <Text style={styles.section}>Next step</Text>
        <Text style={styles.copy}>{data.nextStep}</Text>
      </View>
      <View style={styles.actions}>
        {data.status === "draft" ? (
          <Button label="Submit application" icon="send" onPress={() => submitMutation.mutate()} />
        ) : null}
        <Button label="Talk to counsellor" variant="secondary" icon="logo-whatsapp" onPress={() => router.push({ pathname: "/counselling", params: { universitySlug: data.universitySlug } })} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { marginTop: 14, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: 20, ...shadow },
  title: { marginTop: 18, color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: "900" },
  copy: { marginTop: 8, color: colors.muted, fontSize: 15, lineHeight: 22 },
  section: { marginTop: 22, color: colors.ink, fontSize: 16, fontWeight: "900" },
  actions: { marginTop: 18, gap: 10 },
});
