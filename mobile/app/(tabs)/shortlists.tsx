import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { mobileClient } from "../../src/api/mobileClient";
import { AppScreen } from "../../src/components/AppScreen";
import { UniversityCard } from "../../src/components/UniversityCard";
import { colors } from "../../src/theme/tokens";

export default function ShortlistsScreen() {
  const { data = [] } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => mobileClient.getShortlists(),
  });

  return (
    <AppScreen>
      <Text style={styles.title}>Saved universities</Text>
      <Text style={styles.copy}>Keep your strongest options together before applying.</Text>
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
});
