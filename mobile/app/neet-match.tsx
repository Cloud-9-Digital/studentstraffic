import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../src/api/mobileClient";
import { CountryFlag } from "../src/components/CountryFlag";
import { useCompare } from "../src/context/CompareContext";
import { colors, shadow } from "../src/theme/tokens";
import type { University } from "../src/types/domain";

// ── Scoring logic (client-side) ───────────────────────────────────────────────
// Minimum NEET scores per country (rough guidance for Indian students)
const COUNTRY_MIN_NEET: Record<string, number> = {
  russia:      300,
  vietnam:     300,
  georgia:     400,
  kyrgyzstan:  250,
  uzbekistan:  280,
  kazakhstan:  280,
  china:       350,
  nepal:       400,
  bangladesh:  400,
  philippines: 350,
  ukraine:     300,
};

function matchScore(u: University, neet: number, budget: number): number {
  let score = 0;
  const minNeet = COUNTRY_MIN_NEET[u.countrySlug ?? u.country.toLowerCase()] ?? 300;
  if (neet >= minNeet) score += 40;
  if (u.tuitionUsd <= budget) score += 40;
  // Bonus for strong recognition
  if ((u.recognition ?? []).some(r => r.toLowerCase().includes("nmc"))) score += 20;
  return score;
}

// ── Result card ───────────────────────────────────────────────────────────────

function MatchCard({
  university,
  rank,
  onCompare,
  inCompare,
}: {
  university: University;
  rank: number;
  onCompare: () => void;
  inCompare: boolean;
}) {
  const router = useRouter();
  const tone = university.imageTone;
  const gradients: Record<string, [string, string]> = {
    green: ["#0a2620", "#0f3d37"],
    blue:  ["#0f3d37", "#1c6b5f"],
    coral: ["#c04d28", "#d95f38"],
  };
  const grad = gradients[tone] ?? gradients.green;

  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync(); router.push(`/university/${university.slug}`); }}
      style={({ pressed }) => [mc.card, pressed && mc.cardPressed]}
    >
      <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={mc.rankBadge}>
        <Text style={mc.rankText}>#{rank}</Text>
      </LinearGradient>

      <View style={mc.body}>
        <Text style={mc.name} numberOfLines={2}>{university.name}</Text>
        <View style={mc.meta}>
          <Ionicons name="location-outline" size={11} color={colors.faint} />
          <Text style={mc.metaText}>{university.city}, {university.country}</Text>
        </View>
        <Text style={mc.fee}>${university.tuitionUsd.toLocaleString("en-US")}/yr</Text>
      </View>

      <View style={mc.actions}>
        <Pressable
          onPress={(e) => { e.stopPropagation(); Haptics.selectionAsync(); onCompare(); }}
          style={[mc.compareBtn, inCompare && mc.compareBtnActive]}
          hitSlop={8}
        >
          <Ionicons
            name={inCompare ? "git-compare" : "git-compare-outline"}
            size={14}
            color={inCompare ? colors.primary : colors.faint}
          />
        </Pressable>
        <Ionicons name="chevron-forward" size={16} color={colors.faint} />
      </View>
    </Pressable>
  );
}

const mc = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    ...shadow,
  },
  cardPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  rankBadge: {
    width: 36, height: 36, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  rankText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: "#fff" },
  body: { flex: 1, gap: 3 },
  name: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: colors.ink, lineHeight: 18 },
  meta: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.faint },
  fee: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: colors.primary },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  compareBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: "center", justifyContent: "center",
  },
  compareBtnActive: { backgroundColor: colors.primarySoft },
});

// ── India guidance ────────────────────────────────────────────────────────────

type IndiaTier = {
  label: string;
  desc: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
};

function getIndiaTier(score: number): IndiaTier {
  if (score >= 600) return {
    label: "Top government colleges",
    desc: "AIIMS, JIPMER, BHU, and leading state government colleges — strong prospects.",
    badge: "Highly eligible",
    badgeColor: "#065f46", badgeBg: "#ecfdf5", badgeBorder: "#6ee7b7",
  };
  if (score >= 500) return {
    label: "State government colleges",
    desc: "Good eligibility for state medical colleges. Competition varies by state quota.",
    badge: "Eligible",
    badgeColor: "#065f46", badgeBg: "#ecfdf5", badgeBorder: "#6ee7b7",
  };
  if (score >= 400) return {
    label: "Deemed & private universities",
    desc: "Universities like Manipal, Amrita, SRMC — fees are higher but good prospects.",
    badge: "Good fit",
    badgeColor: "#92400e", badgeBg: "#fffbeb", badgeBorder: "#fcd34d",
  };
  if (score >= 300) return {
    label: "Private medical colleges",
    desc: "Some private colleges accept this range. Seats and fees vary widely by state.",
    badge: "Limited options",
    badgeColor: "#92400e", badgeBg: "#fffbeb", badgeBorder: "#fcd34d",
  };
  return {
    label: "Below typical India minimum",
    desc: "Most Indian colleges require 300+. Studying abroad may offer better options.",
    badge: "Consider abroad",
    badgeColor: "#991b1b", badgeBg: "#fef2f2", badgeBorder: "#fca5a5",
  };
}

function IndiaGuidance({ score, onBrowse }: { score: number; onBrowse: () => void }) {
  const tier = getIndiaTier(score);
  return (
    <View style={ig.wrap}>
      {/* Divider with flag header */}
      <View style={ig.header}>
        <View style={ig.headerLine} />
        <View style={ig.headerCenter}>
          <CountryFlag country="India" width={18} height={13} />
          <Text style={ig.headerTitle}>Also consider in India</Text>
        </View>
        <View style={ig.headerLine} />
      </View>

      {/* Tier card */}
      <View style={ig.card}>
        {/* Badge */}
        <View style={[ig.badge, { backgroundColor: tier.badgeBg, borderColor: tier.badgeBorder }]}>
          <Text style={[ig.badgeText, { color: tier.badgeColor }]}>{tier.badge}</Text>
        </View>

        <Text style={ig.tierLabel}>{tier.label}</Text>
        <Text style={ig.tierDesc}>{tier.desc}</Text>

        {/* Score chip */}
        <View style={ig.scoreRow}>
          <Ionicons name="stats-chart-outline" size={12} color={colors.faint} />
          <Text style={ig.scoreText}>Based on NEET {score}</Text>
        </View>
      </View>

      {/* CTA */}
      <Pressable
        onPress={onBrowse}
        style={({ pressed }) => [ig.browseBtn, pressed && ig.browseBtnPressed]}
      >
        <CountryFlag country="India" width={18} height={13} />
        <Text style={ig.browseBtnLabel}>Browse India MBBS colleges</Text>
        <Ionicons name="chevron-forward" size={15} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const ig = StyleSheet.create({
  wrap: { gap: 12, marginTop: 8 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 4,
  },
  headerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 0.2,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 10,
    letterSpacing: 0.3,
  },
  tierLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
  tierDesc: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  scoreText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: colors.faint,
  },

  browseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15,61,55,0.1)",
  },
  browseBtnPressed: { opacity: 0.85 },
  browseBtnLabel: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: colors.primary,
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function NeetMatchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { add, remove, isIn, items } = useCompare();

  const [neet, setNeet] = useState("");
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState<University[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const neetRef = useRef<TextInput>(null);
  const budgetRef = useRef<TextInput>(null);

  const neetNum = parseInt(neet, 10);
  const budgetNum = parseInt(budget, 10);
  const isValid = !isNaN(neetNum) && neetNum >= 100 && neetNum <= 720
    && !isNaN(budgetNum) && budgetNum >= 1000;

  async function handleFind() {
    if (!isValid) return;
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError(null);

    try {
      // Fetch up to 80 universities, client-side rank by score
      const { universities } = await mobileClient.getUniversities(
        { feeMax: budgetNum + 2000, sort: "tuition_asc" },
        1,
      );

      const scored = universities
        .map(u => ({ u, score: matchScore(u, neetNum, budgetNum) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || a.u.tuitionUsd - b.u.tuitionUsd)
        .slice(0, 10)
        .map(x => x.u);

      setResults(scored);

      // Save score to profile quietly
      const cached = queryClient.getQueryData<{ neetScore?: number }>(["profile"]);
      if (!cached?.neetScore) {
        mobileClient.updateProfile({ neetScore: neetNum }).catch(() => null);
      }
    } catch {
      setError("Couldn't load results. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[s.root, { paddingBottom: insets.bottom + 16 }]}
    >
      {/* Handle */}
      <View style={s.handle} />

      {/* Close */}
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={({ pressed }) => [s.closeBtn, pressed && s.closeBtnPressed]}
      >
        <Ionicons name="close" size={20} color={colors.muted} />
      </Pressable>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* Hero */}
        <View style={s.iconWrap}>
          <Ionicons name="school" size={30} color={colors.primary} />
        </View>
        <Text style={s.title}>Find MBBS matches</Text>
        <Text style={s.sub}>
          Enter your NEET score and annual budget — we'll rank the best universities for you.
        </Text>

        {/* Inputs */}
        <View style={s.form}>
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>NEET Score (out of 720)</Text>
            <TextInput
              ref={neetRef}
              value={neet}
              onChangeText={setNeet}
              placeholder="e.g. 480"
              placeholderTextColor={colors.faint}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => budgetRef.current?.focus()}
              style={s.input}
              selectionColor={colors.primary}
            />
          </View>

          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>Annual budget (USD)</Text>
            <View style={s.inputRow}>
              <Text style={s.inputPrefix}>$</Text>
              <TextInput
                ref={budgetRef}
                value={budget}
                onChangeText={setBudget}
                placeholder="e.g. 7000"
                placeholderTextColor={colors.faint}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleFind}
                style={[s.input, s.inputFlex]}
                selectionColor={colors.primary}
              />
            </View>
          </View>

          <Pressable
            onPress={handleFind}
            disabled={!isValid || loading}
            style={({ pressed }) => [s.findBtn, (!isValid || loading) && s.findBtnDisabled, pressed && s.findBtnPressed]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="search" size={17} color="#fff" />
                <Text style={s.findBtnLabel}>Find matches</Text>
              </>
            )}
          </Pressable>

          {error && <Text style={s.error}>{error}</Text>}
        </View>

        {/* Results */}
        {results !== null && (
          <View style={s.results}>
            <Text style={s.resultsTitle}>
              {results.length > 0 ? `${results.length} universities matched` : "No matches found"}
            </Text>
            {results.length === 0 ? (
              <Text style={s.noMatch}>
                Try increasing your budget or check with a counsellor for more options.
              </Text>
            ) : (
              <>
                <View style={s.cards}>
                  {results.map((u, i) => (
                    <MatchCard
                      key={u.offeringSlug ?? u.slug}
                      university={u}
                      rank={i + 1}
                      inCompare={isIn(u.slug)}
                      onCompare={() => {
                        if (isIn(u.slug)) {
                          remove(u.slug);
                        } else if (items.length < 3) {
                          add({ slug: u.slug, name: u.name, country: u.country, tuitionUsd: u.tuitionUsd });
                          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        }
                      }}
                    />
                  ))}
                </View>

                {/* Compare nudge */}
                {items.length >= 2 && (
                  <Pressable
                    onPress={() => { router.back(); setTimeout(() => router.push("/(tabs)/compare"), 100); }}
                    style={({ pressed }) => [s.compareNudge, pressed && { opacity: 0.85 }]}
                  >
                    <Ionicons name="git-compare-outline" size={16} color={colors.primary} />
                    <Text style={s.compareNudgeText}>
                      {items.length} added — tap to compare side-by-side
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                  </Pressable>
                )}

                {/* Counsellor CTA */}
                <Pressable
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.back(); setTimeout(() => router.push("/counselling"), 100); }}
                  style={({ pressed }) => [s.counselBtn, pressed && s.counselBtnPressed]}
                >
                  <LinearGradient colors={["#0f3d37", "#1c6b5f"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  <Ionicons name="chatbubble-ellipses" size={17} color="#fff" />
                  <Text style={s.counselLabel}>Discuss these with a counsellor — free</Text>
                </Pressable>

                {/* India guidance — shown for any valid NEET score */}
                <IndiaGuidance
                  score={neetNum}
                  onBrowse={() => {
                    router.back();
                    setTimeout(() => router.push({ pathname: "/(tabs)/search", params: { india: "1" } }), 100);
                  }}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: 12,
  },
  handle: {
    alignSelf: "center",
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginBottom: 16,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginHorizontal: 24,
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  closeBtnPressed: { opacity: 0.7 },

  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  iconWrap: {
    width: 68, height: 68, borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
    ...shadow,
  },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 26, color: colors.ink,
    letterSpacing: -0.3, marginBottom: 8, lineHeight: 32,
  },
  sub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14, color: colors.muted,
    lineHeight: 22, marginBottom: 24,
  },

  form: { gap: 14, marginBottom: 24 },
  fieldWrap: { gap: 6 },
  fieldLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13, color: colors.ink,
  },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    height: 52, borderRadius: 14,
    borderWidth: 1, borderColor: colors.line,
    backgroundColor: colors.background,
    paddingHorizontal: 14, gap: 6,
  },
  inputPrefix: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16, color: colors.faint,
  },
  input: {
    height: 52, borderRadius: 14,
    borderWidth: 1, borderColor: colors.line,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16, color: colors.ink,
  },
  inputFlex: {
    flex: 1, height: undefined,
    borderWidth: 0, borderRadius: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },

  findBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16, height: 52,
    marginTop: 4,
  },
  findBtnDisabled: { backgroundColor: colors.line },
  findBtnPressed: { opacity: 0.88 },
  findBtnLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 16, color: "#fff" },
  error: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13, color: colors.coral, textAlign: "center",
  },

  // Results
  results: { gap: 12 },
  resultsTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15, color: colors.ink,
    marginBottom: 4,
  },
  noMatch: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14, color: colors.muted, lineHeight: 22,
  },
  cards: { gap: 10 },

  compareNudge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15,61,55,0.1)",
  },
  compareNudgeText: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13, color: colors.primary,
  },

  counselBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    borderRadius: 16, height: 52, overflow: "hidden",
    ...shadow,
  },
  counselBtnPressed: { opacity: 0.88 },
  counselLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
});
