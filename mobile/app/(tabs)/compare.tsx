import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueries } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { useCompare } from "../../src/context/CompareContext";
import { colors, shadow } from "../../src/theme/tokens";
import type { UniversityDetail } from "../../src/types/domain";

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

// ── Helpers ───────────────────────────────────────────────────────────────────

function usd(n: number) { return `$${n.toLocaleString("en-US")}`; }

type Row = {
  label: string;
  icon: string;
  get: (u: UniversityDetail) => string;
};

const ROWS: Row[] = [
  { label: "Annual fee",   icon: "cash-outline",      get: u => usd(u.primaryOffering?.annualTuitionUsd ?? u.tuitionUsd) },
  { label: "Duration",     icon: "time-outline",      get: u => u.primaryOffering ? `${u.primaryOffering.durationYears} yrs` : (u.duration ?? "6 yrs") },
  { label: "Total cost",   icon: "wallet-outline",    get: u => u.primaryOffering ? usd(u.primaryOffering.totalTuitionUsd) : "—" },
  { label: "Medium",       icon: "language-outline",  get: u => u.primaryOffering?.medium ?? u.medium ?? "English" },
  { label: "Intake",       icon: "calendar-outline",  get: u => u.primaryOffering?.intakeMonths?.slice(0, 2).join(", ") ?? "—" },
  { label: "Location",     icon: "location-outline",  get: u => `${u.city}, ${u.country}` },
  { label: "Est.",         icon: "business-outline",  get: u => u.establishedYear ? String(u.establishedYear) : "—" },
  { label: "Hostel",       icon: "home-outline",      get: u => u.hostelOverview ? "Available" : "—" },
  { label: "Food",         icon: "restaurant-outline",get: u => u.indianFoodSupport ? "Indian food" : "—" },
];

// ── Per-column header ─────────────────────────────────────────────────────────

const TONE_COLORS: Record<string, [string, string]> = {
  green: ["#0a2620", "#0f3d37"],
  blue:  ["#0f3d37", "#1c6b5f"],
  coral: ["#c04d28", "#d95f38"],
};

function UniversityHeader({
  uni,
  onRemove,
}: {
  uni: UniversityDetail;
  onRemove: () => void;
}) {
  const router = useRouter();
  const tone = (uni.imageTone as keyof typeof TONE_COLORS) ?? "green";
  const grad = TONE_COLORS[tone] ?? TONE_COLORS.green;

  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync(); router.push(`/university/${uni.slug}`); }}
      style={col.wrap}
    >
      <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={col.grad}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onRemove(); }} style={col.removeBtn} hitSlop={8}>
          <Ionicons name="close" size={13} color="rgba(255,255,255,0.8)" />
        </Pressable>
        <Text style={col.initials}>
          {uni.name.split(" ").filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join("")}
        </Text>
        <Text style={col.name} numberOfLines={3}>{uni.name}</Text>
        <Text style={col.country}>{uni.country}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const col = StyleSheet.create({
  wrap: { flex: 1, minWidth: 140 },
  grad: {
    borderRadius: 16,
    padding: 12,
    gap: 6,
    minHeight: 140,
    justifyContent: "flex-end",
    ...shadow,
  },
  removeBtn: {
    position: "absolute",
    top: 8, right: 8,
    width: 24, height: 24, borderRadius: 7,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  initials: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 22,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 2,
  },
  name: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: "#fff",
    lineHeight: 17,
  },
  country: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
  },
});

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  const router = useRouter();
  return (
    <View style={e.wrap}>
      <View style={e.iconWrap}>
        <Ionicons name="git-compare-outline" size={40} color={colors.primary} />
      </View>
      <Text style={e.title}>Compare universities</Text>
      <Text style={e.sub}>
        Tap the compare icon{" "}
        <Ionicons name="git-compare-outline" size={14} color={colors.muted} />{" "}
        on any university card to add it here. Compare up to 3 side-by-side.
      </Text>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(tabs)/search"); }}
        style={({ pressed }) => [e.btn, pressed && e.btnPressed]}
      >
        <Ionicons name="search" size={16} color="#fff" />
        <Text style={e.btnLabel}>Browse universities</Text>
      </Pressable>
    </View>
  );
}

const e = StyleSheet.create({
  wrap: { paddingTop: 60, alignItems: "center", gap: 14, paddingHorizontal: 24 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontFamily: "Fraunces-SemiBold", fontSize: 24, color: colors.ink, textAlign: "center" },
  sub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 22,
  },
  btn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 13,
    borderRadius: 14, marginTop: 4,
  },
  btnPressed: { opacity: 0.85 },
  btnLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function CompareScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, remove, clear } = useCompare();

  // Fetch detail for each compared university
  const queries = useQueries({
    queries: items.map(item => ({
      queryKey: ["university", item.slug],
      queryFn: () => mobileClient.getUniversity(item.slug),
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    })),
  });

  const universities = queries
    .map(q => q.data)
    .filter((d): d is UniversityDetail => d !== undefined);

  const isLoading = queries.some(q => q.isLoading) && universities.length < items.length;

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* ── Header ── */}
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.headerRow}>
          <View style={s.titleWrap}>
            <Text style={s.title}>Compare</Text>
            {items.length > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{items.length}</Text>
              </View>
            )}
          </View>
          {items.length > 0 && (
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); clear(); }}
              hitSlop={8}
              style={({ pressed }) => [s.clearBtn, pressed && s.clearBtnPressed]}
            >
              <Text style={s.clearLabel}>Clear all</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      {/* ── Content ── */}
      {items.length === 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
          <EmptyState />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* University column headers */}
          <View style={s.colRow}>
            {/* Row label spacer */}
            <View style={s.rowLabelSpacer} />
            {items.map((item, i) => (
              <View key={item.slug} style={s.colCell}>
                {universities[i] ? (
                  <UniversityHeader
                    uni={universities[i]}
                    onRemove={() => remove(item.slug)}
                  />
                ) : (
                  <View style={[col.wrap, { alignItems: "center", justifyContent: "center", minHeight: 140, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.line }]}>
                    <ActivityIndicator color={colors.primary} />
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Data rows */}
          {ROWS.map((row, ri) => (
            <View key={row.label} style={[s.dataRow, ri % 2 === 1 && s.dataRowAlt]}>
              {/* Label */}
              <View style={s.rowLabel}>
                <Ionicons name={row.icon as any} size={13} color={colors.faint} />
                <Text style={s.rowLabelText}>{row.label}</Text>
              </View>
              {/* Values */}
              {items.map((item, i) => (
                <View key={item.slug} style={s.dataCell}>
                  <Text style={s.dataValue} numberOfLines={2}>
                    {universities[i] ? row.get(universities[i]) : "—"}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          {/* CTA */}
          <View style={s.cta}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/counselling");
              }}
              style={({ pressed }) => [s.ctaBtn, pressed && s.ctaBtnPressed]}
            >
              <LinearGradient colors={["#0f3d37", "#1c6b5f"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
              <Text style={s.ctaLabel}>Talk to a counsellor about these</Text>
              <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" />
            </Pressable>
          </View>

          {/* Add more hint */}
          {items.length < 3 && (
            <Pressable
              onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/search"); }}
              style={({ pressed }) => [s.addMore, pressed && { opacity: 0.75 }]}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={s.addMoreLabel}>Add another university ({items.length}/3)</Text>
            </Pressable>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    minWidth: 24, height: 24,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 7,
  },
  badgeText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 12, color: "#fff" },
  clearBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.coralSoft,
  },
  clearBtnPressed: { opacity: 0.75 },
  clearLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: colors.coral,
  },

  scroll: { paddingHorizontal: 16, paddingTop: 4 },

  // Column layout
  colRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  rowLabelSpacer: { width: 90 },
  colCell: { flex: 1 },

  // Data rows
  dataRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  dataRowAlt: { backgroundColor: colors.surface },
  rowLabel: {
    width: 90,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingRight: 6,
  },
  rowLabelText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
    color: colors.faint,
    flexShrink: 1,
  },
  dataCell: { flex: 1, justifyContent: "center" },
  dataValue: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },

  // CTA
  cta: { marginTop: 24, marginBottom: 8 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    padding: 18,
    overflow: "hidden",
    ...shadow,
  },
  ctaBtnPressed: { opacity: 0.88 },
  ctaLabel: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "#fff",
  },

  // Add more
  addMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  addMoreLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: colors.primary,
  },
});
