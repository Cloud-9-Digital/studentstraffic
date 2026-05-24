import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { StatusPill } from "../../src/components/StatusPill";
import { colors, shadow } from "../../src/theme/tokens";

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

const STATUS_COLORS: Record<string, string> = {
  draft:        colors.amberSoft,
  submitted:    colors.primarySoft,
  under_review: colors.blueSoft,
  accepted:     "#e7f6ef",
  rejected:     colors.coralSoft,
  waitlisted:   colors.amberSoft,
};

const STATUS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  draft:        "create-outline",
  submitted:    "paper-plane-outline",
  under_review: "hourglass-outline",
  accepted:     "checkmark-circle-outline",
  rejected:     "close-circle-outline",
  waitlisted:   "time-outline",
};

export default function ApplicationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: () => mobileClient.getApplications(),
  });

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.headerRow}>
          <Text style={s.title}>Applications</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {data.length === 0 ? (
          <View style={s.emptyWrap}>
            <View style={s.emptyIconWrap}>
              <Ionicons name="document-text-outline" size={40} color={colors.primary} />
            </View>
            <Text style={s.emptyTitle}>No applications yet</Text>
            <Text style={s.emptySub}>
              Talk to our free counsellors — they'll guide you through the entire application process.
            </Text>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/counselling"); }}
              style={({ pressed }) => [s.ctaBtn, pressed && s.ctaBtnPressed]}
            >
              <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
              <Text style={s.ctaBtnLabel}>Talk to a counsellor</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={s.subtitle}>
              {data.length} active {data.length === 1 ? "application" : "applications"}
            </Text>
            <View style={s.list}>
              {data.map((app) => (
                <Pressable
                  key={app.id}
                  onPress={() => { Haptics.selectionAsync(); router.push("/counselling"); }}
                  style={({ pressed }) => [s.card, pressed && s.cardPressed]}
                >
                  <View style={[s.cardStrip, { backgroundColor: STATUS_COLORS[app.status] ?? colors.line }]} />
                  <View style={s.cardBody}>
                    <View style={s.cardTop}>
                      <View style={[s.cardIconWrap, { backgroundColor: STATUS_COLORS[app.status] ?? colors.primarySoft }]}>
                        <Ionicons name={STATUS_ICONS[app.status] ?? "document-outline"} size={18} color={colors.primary} />
                      </View>
                      <StatusPill status={app.status} />
                    </View>
                    <Text style={s.cardName} numberOfLines={2}>{app.universityName}</Text>
                    <Text style={s.cardMeta}>{app.course} · {app.countryName}</Text>
                    <View style={s.cardFooter}>
                      <Text style={s.cardNext} numberOfLines={2}>{app.nextStep}</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.faint} />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Counsellor nudge */}
            <Pressable
              onPress={() => { Haptics.selectionAsync(); router.push("/counselling"); }}
              style={({ pressed }) => [s.nudge, pressed && s.nudgePressed]}
            >
              <View style={s.nudgeIcon}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.nudgeTitle}>Need help with your application?</Text>
                <Text style={s.nudgeSub}>Our counsellors are free and available now.</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.faint} />
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  headerSafe: {},
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.4,
  },

  scroll: { paddingHorizontal: 20 },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.faint,
    marginBottom: 14,
  },
  list: { gap: 12 },

  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    ...shadow,
  },
  cardPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  cardStrip: { width: 4 },
  cardBody: { flex: 1, padding: 16, gap: 8 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  cardName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15,
    color: colors.ink,
    lineHeight: 21,
  },
  cardMeta: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.faint,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 2,
  },
  cardNext: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },

  nudge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(15,61,55,0.10)",
    padding: 16,
  },
  nudgePressed: { opacity: 0.85 },
  nudgeIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(15,61,55,0.10)",
    alignItems: "center", justifyContent: "center",
  },
  nudgeTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: colors.ink },
  nudgeSub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted, marginTop: 2 },

  emptyWrap: { paddingTop: 40, alignItems: "center", gap: 12, paddingHorizontal: 16 },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontFamily: "Fraunces-SemiBold", fontSize: 24, color: colors.ink, textAlign: "center" },
  emptySub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 22 },
  ctaBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 14, marginTop: 4,
  },
  ctaBtnPressed: { opacity: 0.85 },
  ctaBtnLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
});
