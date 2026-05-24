import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { UniversityCard } from "../../src/components/UniversityCard";
import { colors } from "../../src/theme/tokens";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["universities", query],
    queryFn: () => mobileClient.getUniversities(query),
  });

  const countries = useMemo(() => ["All", "Russia", "Georgia", "Kyrgyzstan"], []);

  return (
    <AppScreen>
      <Text style={styles.title}>Find universities</Text>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.faint} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search country, city, university"
          style={styles.input}
        />
      </View>
      <View style={styles.chips}>
        {countries.map((country, index) => (
          <Text key={country} style={[styles.chip, index === 0 && styles.activeChip]}>
            {country}
          </Text>
        ))}
      </View>

      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      <View style={styles.list}>
        {data.map((university) => (
          <UniversityCard key={university.slug} university={university} />
        ))}
      </View>
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
  search: {
    marginTop: 18,
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
  },
  chips: {
    marginTop: 14,
    marginBottom: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 13,
    paddingVertical: 8,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  activeChip: {
    backgroundColor: colors.primary,
    color: "#fff",
    borderColor: colors.primary,
  },
  list: {
    gap: 12,
  },
});
