import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { UniversityCard } from "../../src/components/UniversityCard";
import { colors, shadow } from "../../src/theme/tokens";

// ── Country assets ────────────────────────────────────────────────────────────

const COUNTRY_IMAGES: Record<string, ReturnType<typeof require>> = {
  vietnam:     require("../../assets/vietnam.jpg"),
  georgia:     require("../../assets/georgia.jpg"),
  russia:      require("../../assets/russia.jpg"),
  philippines: require("../../assets/philippines.jpg"),
  kyrgyzstan:  require("../../assets/kyrgyzstan.jpg"),
  kazakhstan:  require("../../assets/kazakhstan.jpg"),
  china:       require("../../assets/china.jpg"),
  nepal:       require("../../assets/nepal.jpg"),
  bangladesh:  require("../../assets/bangladesh.jpg"),
  ukraine:     require("../../assets/ukraine.jpg"),
  uzbekistan:  require("../../assets/uzbekistan.jpg"),
};

const COUNTRY_GRADIENTS: Record<string, [string, string]> = {
  vietnam:     ["#1a4a2a", "#2e7d52"],
  georgia:     ["#1a3a6b", "#2a5298"],
  russia:      ["#6b1a1a", "#a03030"],
  philippines: ["#1a5276", "#2980b9"],
  kyrgyzstan:  ["#1a4a2a", "#27714a"],
  kazakhstan:  ["#154f3c", "#1e7a5f"],
  china:       ["#6b1a1a", "#8b2a2a"],
  nepal:       ["#4a1a5a", "#7a2a8a"],
  bangladesh:  ["#1a3a6b", "#1a5276"],
  ukraine:     ["#1a4a6b", "#c69b14"],
  uzbekistan:  ["#7a4a1a", "#b06a2a"],
};

// ── Country data ──────────────────────────────────────────────────────────────

type Fact = { icon: string; label: string; value: string };

const COUNTRY_FACTS: Record<string, Fact[]> = {
  vietnam: [
    { icon: "cash-outline",              label: "Annual fee",      value: "$3,500 – $5,000" },
    { icon: "time-outline",              label: "Duration",        value: "6 years" },
    { icon: "language-outline",          label: "Medium",          value: "English" },
    { icon: "shield-checkmark-outline",  label: "NMC status",     value: "Recognised" },
    { icon: "thermometer-outline",       label: "Climate",         value: "Tropical" },
    { icon: "people-outline",            label: "Indian students", value: "Large community" },
  ],
  russia: [
    { icon: "cash-outline",              label: "Annual fee",      value: "$4,000 – $8,000" },
    { icon: "time-outline",              label: "Duration",        value: "6 years" },
    { icon: "language-outline",          label: "Medium",          value: "English / Russian" },
    { icon: "shield-checkmark-outline",  label: "NMC status",     value: "NMC & WHO approved" },
    { icon: "thermometer-outline",       label: "Climate",         value: "Cold continental" },
    { icon: "people-outline",            label: "Indian students", value: "Very large community" },
  ],
  georgia: [
    { icon: "cash-outline",              label: "Annual fee",      value: "$5,000 – $8,000" },
    { icon: "time-outline",              label: "Duration",        value: "6 years" },
    { icon: "language-outline",          label: "Medium",          value: "English" },
    { icon: "shield-checkmark-outline",  label: "NMC status",     value: "Recognised" },
    { icon: "thermometer-outline",       label: "Climate",         value: "Temperate" },
    { icon: "people-outline",            label: "Indian students", value: "Growing community" },
  ],
  kyrgyzstan: [
    { icon: "cash-outline",              label: "Annual fee",      value: "$2,500 – $4,000" },
    { icon: "time-outline",              label: "Duration",        value: "5 years" },
    { icon: "language-outline",          label: "Medium",          value: "English" },
    { icon: "shield-checkmark-outline",  label: "NMC status",     value: "Recognised" },
    { icon: "thermometer-outline",       label: "Climate",         value: "Continental" },
    { icon: "people-outline",            label: "Indian students", value: "Medium community" },
  ],
  uzbekistan: [
    { icon: "cash-outline",              label: "Annual fee",      value: "$3,000 – $5,500" },
    { icon: "time-outline",              label: "Duration",        value: "6 years" },
    { icon: "language-outline",          label: "Medium",          value: "English" },
    { icon: "shield-checkmark-outline",  label: "NMC status",     value: "Recognised" },
    { icon: "thermometer-outline",       label: "Climate",         value: "Continental" },
    { icon: "people-outline",            label: "Indian students", value: "Growing community" },
  ],
};

const DEFAULT_FACTS: Fact[] = [
  { icon: "cash-outline",             label: "Annual fee",  value: "Varies by university" },
  { icon: "time-outline",             label: "Duration",    value: "5 – 6 years" },
  { icon: "language-outline",         label: "Medium",      value: "English available" },
  { icon: "shield-checkmark-outline", label: "NMC status",  value: "Check per university" },
];

const COUNTRY_ABOUT: Record<string, string> = {
  vietnam:
    "Vietnam offers one of the most affordable English-medium MBBS programs in Asia. The tropical climate, vibrant street life, and a well-established Indian student community make settling in comfortable. All listed colleges carry NMC recognition, providing a clear pathway back to Indian medical practice.",

  russia:
    "Russia's medical universities — many over a century old — are respected globally, with WHO and NMC approval across top institutions. The cold continental climate is offset by a very large Indian student presence in cities like Kazan and Volgograd. Strong clinical exposure and a rigorous research culture define the academic experience.",

  georgia:
    "Georgia combines European-standard medical education with affordable fees, entirely in English and within a safe, modern country. Tbilisi campuses offer a high quality of life in a temperate climate, and a growing Indian student community makes peer support readily available.",

  kyrgyzstan:
    "Kyrgyzstan is among the most budget-friendly MBBS destinations globally — no donation fees, no capitation, just straightforward English-medium programs with NMC approval. The continental climate brings warm summers and cold winters, which most students from India adjust to quickly.",

  uzbekistan:
    "Uzbekistan's medical education sector is modernising rapidly, backed by government investment and international partnerships. Fees are competitive, programs are English-medium, and cultural familiarity with South Asia makes daily life comfortable. The climate is warm in summer and cold in winter.",
};

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, last }: Fact & { last?: boolean }) {
  return (
    <View style={[ir.row, !last && ir.bordered]}>
      <View style={ir.iconWrap}>
        <Ionicons name={icon as any} size={15} color={colors.primary} />
      </View>
      <Text style={ir.label}>{label}</Text>
      <Text style={ir.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const ir = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    gap: 12,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  label: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.muted,
  },
  value: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: colors.ink,
    flexShrink: 0,
    maxWidth: "52%",
    textAlign: "right",
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function CountryDetailScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { slug, name: nameParam } = useLocalSearchParams<{ slug: string; name?: string }>();

  const key        = (slug ?? "").toLowerCase();
  const localImage = COUNTRY_IMAGES[key];
  const gradient   = COUNTRY_GRADIENTS[key] ?? ["#0a2620", "#0f3d37"];
  const facts      = COUNTRY_FACTS[key]     ?? DEFAULT_FACTS;
  const aboutText  = COUNTRY_ABOUT[key]     ?? "";
  const displayName = nameParam ?? (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "");

  const { data, isLoading } = useQuery({
    queryKey:  ["universities-country", slug],
    queryFn:   () => mobileClient.getUniversities({ country: slug }, 1),
    enabled:   Boolean(slug),
    staleTime: 5 * 60 * 1000,
    gcTime:    15 * 60 * 1000,
  });

  const universities = data?.universities ?? [];

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* ── Scrollable body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 32 }]}
      >

        {/* Country photo hero */}
        <View style={s.photoHero}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {localImage && (
            <View style={s.photoImageFrame} pointerEvents="none">
              <Image
                source={localImage}
                style={s.photoImage}
                resizeMode="cover"
              />
            </View>
          )}

          <SafeAreaView edges={["top"]} style={s.heroSafeArea}>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                if (router.canGoBack()) router.back();
                else router.replace("/(tabs)");
              }}
              style={({ pressed }) => [s.heroBackBtn, pressed && { opacity: 0.75 }]}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </Pressable>
          </SafeAreaView>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.72)"]}
            style={s.heroOverlay}
            pointerEvents="none"
          >
            <View style={s.heroTextWrap}>
              <Text style={s.heroSub}>MBBS Destination</Text>
              <Text style={s.heroName}>{displayName}</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(0,0,0,0.18)", "transparent"]}
            style={s.heroTopFade}
            pointerEvents="none"
          />
        </View>

        {/* ── Content below the photo ── */}
        <View style={s.content}>

          {/* Quick-facts card */}
          <View style={s.factCard}>
            {facts.map((f, i) => (
              <InfoRow
                key={i}
                icon={f.icon}
                label={f.label}
                value={f.value}
                last={i === facts.length - 1}
              />
            ))}
          </View>

          {/* About */}
          {!!aboutText && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>About {displayName}</Text>
              <Text style={s.body}>{aboutText}</Text>
            </View>
          )}

          {/* Universities */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>
                {isLoading
                  ? "Universities"
                  : `Universities${universities.length > 0 ? ` (${universities.length})` : ""}`}
              </Text>
              {!isLoading && data?.hasNextPage && (
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push({ pathname: "/(tabs)/search", params: { country: slug } });
                  }}
                  hitSlop={8}
                >
                  <Text style={s.seeAll}>See all</Text>
                </Pressable>
              )}
            </View>

            {isLoading ? (
              // Skeleton cards that match actual card proportions
              <View style={s.cardList}>
                {[88, 100, 88].map((h, i) => (
                  <View key={i} style={[s.cardSkeleton, { height: h }]} />
                ))}
              </View>
            ) : universities.length === 0 ? (
              <Text style={s.emptyText}>
                No universities listed yet for {displayName}. Check back soon.
              </Text>
            ) : (
              <View style={s.cardList}>
                {universities.slice(0, 8).map((u, i) => (
                  <UniversityCard key={u.offeringSlug ?? `${u.slug}-${i}`} university={u} />
                ))}
              </View>
            )}
          </View>

          {/* Counsellor CTA */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/counselling");
            }}
            style={({ pressed }) => [s.cta, pressed && { opacity: 0.88 }]}
          >
            <LinearGradient
              colors={["#0f3d37", "#1c6b5f"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.ctaGrad}
            >
              <View style={s.ctaIcon}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.ctaTitle}>Interested in {displayName}?</Text>
                <Text style={s.ctaSub}>Talk to a free counsellor today.</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.45)" />
            </LinearGradient>
          </Pressable>

        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  // Photo hero
  photoHero: {
    width: "100%",
    height: 330,
    overflow: "hidden",
    backgroundColor: colors.line,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  photoImageFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  heroSafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  heroBackBtn: {
    marginLeft: 20,
    marginTop: 6,
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "rgba(15,31,28,0.24)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: 150,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroTopFade: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 96,
  },
  heroTextWrap: {
    gap: 4,
  },
  heroSub: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
    color: "rgba(255,255,255,0.72)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  heroName: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 32,
    color: "#fff",
    lineHeight: 38,
    letterSpacing: -0.4,
  },

  // Scroll content
  scrollContent: { paddingTop: 0 },

  // Main content block
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    gap: 28,
  },

  // Quick-facts card
  factCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    ...shadow,
  },

  // Generic section (title + content)
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 20, color: colors.ink,
    letterSpacing: -0.2,
  },
  seeAll: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13, color: colors.primary,
  },
  body: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15, color: colors.muted,
    lineHeight: 25,
  },

  // University cards
  cardList: { gap: 10 },
  cardSkeleton: {
    borderRadius: 18,
    backgroundColor: colors.line,
  },
  emptyText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14, color: colors.muted,
    lineHeight: 22,
  },

  // Counsellor CTA
  cta: {
    borderRadius: 20,
    overflow: "hidden",
    ...shadow,
  },
  ctaGrad: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
  },
  ctaIcon: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  ctaTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14, color: "#fff",
  },
  ctaSub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12, color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },
});
