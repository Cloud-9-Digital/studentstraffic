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
import { FLOATING_TAB_INSET } from "../../src/components/FloatingTabBar";
import { colors, shadow } from "../../src/theme/tokens";

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

const STATUS_COLORS: Record<string, string> = {
  draft:        colors.amberSoft,
  submitted:    colors.primarySoft,
  under_review: colors.blueSoft,
  accepted:     "#e7f6ef",
  rejected:     "#fff0f0",
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
      {/* ── Fixed header ── */}
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.headerRow}>
          <Text style={s.title}>Applications</Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/application/start"); }}
            style={({ pressed }) => [s.addBtn, pressed && s.addBtnPressed]}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* ── Content ── */}
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: Platform.OS === "ios" ? FLOATING_TAB_INSET + 16 : insets.bottom + 80 },
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
              Start your MBBS application — our counsellors guide you through every step at no cost.
            </Text>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/application/start"); }}
              style={({ pressed }) => [s.startBtn, pressed && s.startBtnPressed]}
            >
              <Ionicons name="add-circle" size={16} color="#fff" />
              <Text style={s.startBtnLabel}>Start an application</Text>
            </Pressable>
            <Pressable
              onPress={() => { Haptics.selectionAsync(); router.push("/counselling"); }}
              style={({ pressed }) => [s.counselBtn, pressed && s.counselBtnPressed]}
            >
              <Text style={s.counselBtnLabel}>Talk to counsellor first</Text>
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
                  onPress={() => { Haptics.selectionAsync(); router.push(`/application/${app.id}`); }}
                  style={({ pressed }) => [s.card, pressed && s.cardPressed]}
                >
                  {/* Status colour strip */}
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

            {/* Start new CTA */}
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/application/start"); }}
              style={({ pressed }) => [s.newAppRow, pressed && s.newAppRowPressed]}
            >
              <View style={s.newAppIcon}>
                <Ionicons name="add" size={18} color={colors.primary} />
              </View>
              <Text style={s.newAppLabel}>Start another application</Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  addBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
  },
  addBtnPressed: { opacity: 0.75 },

  scroll: { paddingHorizontal: 20 },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.faint,
    marginBottom: 14,
  },
  list: { gap: 12 },

  // Application card
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

  // New app row
  newAppRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  newAppRowPressed: { opacity: 0.8 },
  newAppIcon: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
  },
  newAppLabel: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: colors.ink,
  },

  // Empty state
  emptyWrap: { paddingTop: 40, alignItems: "center", gap: 12, paddingHorizontal: 16 },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontFamily: "Fraunces-SemiBold", fontSize: 24, color: colors.ink, textAlign: "center" },
  emptySub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 22 },
  startBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 14, marginTop: 4,
  },
  startBtnPressed: { opacity: 0.85 },
  startBtnLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
  counselBtn: { paddingVertical: 10 },
  counselBtnPressed: { opacity: 0.7 },
  counselBtnLabel: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 14, color: colors.primary },
});
