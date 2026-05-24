import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import type { University } from "../types/domain";
import { colors, shadow } from "../theme/tokens";

const toneColors = {
  green: colors.primarySoft,
  blue: colors.blueSoft,
  coral: colors.coralSoft,
};

export function UniversityCard({ university }: { university: University }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/university/${university.slug}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.visual, { backgroundColor: toneColors[university.imageTone] }]}>
        <Ionicons name="school" size={28} color={colors.primary} />
      </View>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {university.name}
          </Text>
          <Ionicons name="bookmark" size={18} color={colors.coral} />
        </View>
        <Text style={styles.meta}>
          {university.city}, {university.country}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.fee}>${university.tuitionUsd.toLocaleString()}/yr</Text>
          <Text style={styles.badge}>{university.medium}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  pressed: {
    opacity: 0.9,
  },
  visual: {
    width: 78,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 7,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  name: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fee: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
  badge: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "800",
  },
});
