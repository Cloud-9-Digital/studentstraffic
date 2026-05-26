import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import type { IndiaCollege } from "../types/domain";
import { colors, shadow } from "../theme/tokens";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");
}

function cleanCollegeName(name: string, city?: string): string {
  if (!city) return name;
  const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return name.replace(new RegExp(`,\\s*${escaped}$`, "i"), "").trim() || name;
}

type Props = {
  college: IndiaCollege;
  /** Called when user wants to discuss this college — opens counselling */
  onCounsel?: (college: IndiaCollege) => void;
};

export function IndiaCollegeCard({ college, onCounsel }: Props) {
  const router = useRouter();
  const isGovt = college.managementType === "Govt.";
  const displayName = cleanCollegeName(college.collegeName, college.cityName);
  const location = college.cityName || college.stateName;

  function handlePress() {
    Haptics.selectionAsync();
    if (onCounsel) {
      onCounsel(college);
    } else {
      // Fallback: open counselling
      router.push("/counselling");
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      {/* ── Avatar ── */}
      <View style={s.avatar}>
        <Text style={s.avatarText}>{getInitials(college.collegeName)}</Text>
      </View>

      {/* ── Body ── */}
      <View style={s.body}>
        <View style={s.nameRow}>
          <Text style={s.name} numberOfLines={2}>{displayName}</Text>
          {/* Management badge */}
          <View style={[s.mgmtBadge, isGovt ? s.mgmtGovt : s.mgmtPrivate]}>
            <Text style={[s.mgmtText, isGovt ? s.mgmtGovtText : s.mgmtPrivateText]}>
              {college.managementType ?? "Medical"}
            </Text>
          </View>
        </View>

        <View style={s.metaRow}>
          <Ionicons name="location-outline" size={11} color={colors.faint} />
          <Text style={s.metaText}>{location}</Text>
          {college.stateName !== location && (
            <>
              <Text style={s.metaDot}>·</Text>
              <Text style={s.metaText}>{college.stateName}</Text>
            </>
          )}
        </View>

        <View style={s.footer}>
          {college.yearOfInception ? (
            <View style={s.footerItem}>
              <Ionicons name="business-outline" size={11} color={colors.faint} />
              <Text style={s.footerText}>Est. {college.yearOfInception}</Text>
            </View>
          ) : null}
          {college.annualIntakeSeats ? (
            <View style={s.footerItem}>
              <Ionicons name="people-outline" size={11} color={colors.faint} />
              <Text style={s.footerText}>{college.annualIntakeSeats} seats</Text>
            </View>
          ) : null}
          {/* Counsel nudge */}
          <View style={s.counselHint}>
            <Ionicons name="chatbubble-ellipses-outline" size={11} color={colors.primary} />
            <Text style={s.counselHintText}>Check eligibility</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    ...shadow,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },

  // Gold avatar — distinct from abroad green
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fde68a",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 16,
    color: "#92400e",
    letterSpacing: 0.5,
  },

  body: { flex: 1, gap: 4 },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },

  // Management type badge
  mgmtBadge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexShrink: 0,
    marginTop: 1,
  },
  mgmtGovt: {
    backgroundColor: "#ecfdf5",
    borderColor: "#6ee7b7",
  },
  mgmtPrivate: {
    backgroundColor: "#fffbeb",
    borderColor: "#fcd34d",
  },
  mgmtText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 9,
    letterSpacing: 0.3,
  },
  mgmtGovtText: { color: "#065f46" },
  mgmtPrivateText: { color: "#92400e" },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  metaText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.faint,
  },
  metaDot: {
    fontSize: 12,
    color: colors.line,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
    flexWrap: "wrap",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  footerText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: colors.faint,
  },
  counselHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: "auto",
  },
  counselHintText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
    color: colors.primary,
  },
});
