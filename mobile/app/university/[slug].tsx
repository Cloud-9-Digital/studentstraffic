import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { Button } from "../../src/components/Button";
import { colors, shadow } from "../../src/theme/tokens";

export default function UniversityDetailScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: university, isLoading } = useQuery({
    queryKey: ["university", slug],
    queryFn: () => mobileClient.getUniversity(slug),
    enabled: Boolean(slug),
  });
  const shortlistMutation = useMutation({
    mutationFn: () =>
      university?.isShortlisted
        ? mobileClient.removeShortlist(university.slug)
        : mobileClient.addShortlist(university!.slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university", slug] });
      queryClient.invalidateQueries({ queryKey: ["shortlists"] });
    },
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

  if (!university) {
    return (
      <AppScreen>
        <Button label="Back" variant="secondary" icon="arrow-back" onPress={() => router.back()} />
        <Text style={styles.missing}>University not found.</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <Button label="Back" variant="ghost" icon="arrow-back" onPress={() => router.back()} />

      <View style={styles.hero}>
        <Ionicons name="school" size={42} color="#fff" />
        <Text style={styles.country}>
          {university.city}, {university.country}
        </Text>
        <Text style={styles.title}>{university.name}</Text>
      </View>

      <View style={styles.facts}>
        <View style={styles.fact}>
          <Text style={styles.factLabel}>Tuition</Text>
          <Text style={styles.factValue}>${university.tuitionUsd.toLocaleString()}/yr</Text>
        </View>
        <View style={styles.fact}>
          <Text style={styles.factLabel}>Duration</Text>
          <Text style={styles.factValue}>{university.duration ?? "Ask counsellor"}</Text>
        </View>
        <View style={styles.fact}>
          <Text style={styles.factLabel}>Medium</Text>
          <Text style={styles.factValue}>{university.medium ?? "English"}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.copy}>{university.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best fit</Text>
        <Text style={styles.copy}>{university.fit}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recognition</Text>
        <View style={styles.chips}>
          {(university.recognition ?? university.recognitionBadges ?? []).map((item) => (
            <Text key={item} style={styles.chip}>{item}</Text>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label={university.isShortlisted ? "Remove shortlist" : "Shortlist"} icon="bookmark" variant="secondary" onPress={() => shortlistMutation.mutate()} />
        <Button label="Start application" icon="document-text" onPress={() => router.push({ pathname: "/application/start", params: { universitySlug: university.slug, courseSlug: university.primaryOffering?.courseSlug ?? "mbbs" } })} />
        <Button label="Talk to counsellor" variant="secondary" icon="logo-whatsapp" onPress={() => router.push({ pathname: "/counselling", params: { universitySlug: university.slug } })} />
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
  hero: {
    marginTop: 8,
    borderRadius: 28,
    backgroundColor: colors.primary,
    padding: 24,
    minHeight: 250,
    justifyContent: "flex-end",
    ...shadow,
  },
  country: {
    marginTop: 28,
    color: colors.mint,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    marginTop: 10,
    color: "#fff",
    fontSize: 32,
    lineHeight: 37,
    fontWeight: "900",
  },
  facts: {
    marginTop: 14,
    flexDirection: "row",
    gap: 9,
  },
  fact: {
    flex: 1,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  factLabel: {
    color: colors.faint,
    fontSize: 11,
    fontWeight: "800",
  },
  factValue: {
    marginTop: 6,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
  },
  copy: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  chips: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: "800",
  },
  actions: {
    marginTop: 24,
    gap: 10,
  },
  missing: {
    marginTop: 24,
    color: colors.muted,
    fontSize: 16,
  },
});
