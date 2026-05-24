import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { Button } from "../../src/components/Button";
import { UniversityCard } from "../../src/components/UniversityCard";
import { colors, shadow } from "../../src/theme/tokens";

// ── Helpers ───────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const DEST_ORDER = ["vietnam", "russia", "georgia", "kyrgyzstan", "uzbekistan"];

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

const FALLBACK_GRADIENTS: [string, string][] = [
  ["#0a2620", "#0f3d37"],
  ["#1a3a6b", "#2563eb"],
  ["#6b1a1a", "#c0392b"],
  ["#4a1a5a", "#7a2a8a"],
];

type ActionItem = { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; gradient: [string, string] };
const QUICK_ACTIONS: ActionItem[] = [
  { icon: "wallet-outline",            label: "Budget picks",    sub: "Under $5k/yr",        gradient: ["#064e3b", "#0d9467"] },
  { icon: "shield-checkmark-outline",  label: "NMC recognised",  sub: "India-approved",      gradient: ["#0c3547", "#0e6d9e"] },
  { icon: "language-outline",          label: "English medium",  sub: "No language barrier", gradient: ["#1e1b4b", "#3730a3"] },
  { icon: "trophy-outline",            label: "Top ranked",      sub: "QS & WHO listed",     gradient: ["#431407", "#9a3412"] },
];

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

// ── Destination card ──────────────────────────────────────────────────────────

function DestCard({ name, slug, index, onPress }: {
  name: string;
  slug: string;
  index: number;
  onPress: () => void;
}) {
  const key = slug.toLowerCase();
  const localImage = COUNTRY_IMAGES[key];
  const gradient = COUNTRY_GRADIENTS[key] ?? FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.destCard, pressed && s.destPressed]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Image or gradient background */}
      {localImage ? (
        <View style={s.destImageFrame}>
          <Image
            source={localImage}
            style={s.destImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Gradient footer overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)"]}
        style={s.destGradient}
      >
        <Text style={s.destCountry} numberOfLines={1}>{name}</Text>
      </LinearGradient>
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => mobileClient.getDashboard(),
  });

  // Countries from the API — drives the destination cards
  const { data: searchOptions } = useQuery({
    queryKey: ["searchOptions"],
    queryFn: () => mobileClient.getUniversities({}, 1).then(r => r.options),
    staleTime: 10 * 60 * 1000,
  });

  const apiSlugs = new Set((searchOptions?.countries ?? []).map(c => c.slug.toLowerCase()));
  const allCountryMap = Object.fromEntries((searchOptions?.countries ?? []).map(c => [c.slug.toLowerCase(), c]));
  // Show pinned countries in fixed order (only if they exist in the API)
  const countries = DEST_ORDER
    .filter(slug => apiSlugs.has(slug) || COUNTRY_IMAGES[slug])
    .map(slug => allCountryMap[slug] ?? { slug, name: slug.charAt(0).toUpperCase() + slug.slice(1) });

  if (isLoading) {
    return (
      <View style={[s.root, { backgroundColor: BG }]}>
        <View style={s.center}><ActivityIndicator color={colors.primary} /></View>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[s.root, { backgroundColor: BG }]}>
        <SafeAreaView edges={["top"]} style={{ backgroundColor: BG }}>
          <View style={s.header}>
            <Image source={require("../../assets/logo.png")} style={s.logo} resizeMode="contain" />
          </View>
        </SafeAreaView>
        <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 90 }]}>
          <View style={s.emptyWrap}>
            <View style={s.emptyIcon}>
              <Ionicons name="school-outline" size={40} color={colors.primary} />
            </View>
            <Text style={s.emptyTitle}>Plan your MBBS abroad</Text>
            <Text style={s.emptySub}>Sign in to access personalised recommendations, shortlists, and your application tracker.</Text>
            <Button label="Sign in" icon="log-in" onPress={() => router.replace("/(auth)/login")} />
            <Button label="Create free account" variant="secondary" icon="person-add" onPress={() => router.replace("/(auth)/register")} />
          </View>
        </ScrollView>
      </View>
    );
  }

  const firstName = (data.profile.name ?? "").split(" ")[0];

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* ── Fixed header ── */}
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.header}>
          <Image source={require("../../assets/logo.png")} style={s.logo} resizeMode="contain" />
          <Pressable
            onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/profile"); }}
            style={({ pressed }) => [s.avatarBtn, pressed && s.avatarPressed]}
          >
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials(data.profile.name ?? "U")}</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ── */}
        <View style={s.greetBlock}>
          <Text style={s.greetLine}>{greeting()},</Text>
          <Text style={s.greetName}>{firstName} 👋</Text>
        </View>

        {/* ── Study destinations ── */}
        {countries.length > 0 && (
          <>
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>Study destinations</Text>
              <Pressable onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/search"); }} hitSlop={8}>
                <Text style={s.seeAll}>See all</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.destRow}
              decelerationRate="fast"
              snapToInterval={170}
              snapToAlignment="start"
            >
              {countries.map((c, i) => (
                <DestCard
                  key={c.slug}
                  name={c.name}
                  slug={c.slug}
                  index={i}
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push({ pathname: "/(tabs)/search", params: { country: c.slug } });
                  }}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Recommended ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Recommended for you</Text>
          <Pressable onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/search"); }} hitSlop={8}>
            <Text style={s.seeAll}>See all</Text>
          </Pressable>
        </View>
        <View style={s.cardList}>
          {data.recommended.map((u, i) => (
            <UniversityCard key={u.offeringSlug ?? `${u.slug}-${i}`} university={u} />
          ))}
        </View>

        {/* ── Browse by category ── */}
        <Text style={s.sectionTitle}>Browse by category</Text>
        <View style={s.actionGrid}>
          {QUICK_ACTIONS.map((q) => (
            <Pressable
              key={q.label}
              onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/search"); }}
              style={({ pressed }) => [s.actionTile, pressed && s.actionPressed]}
            >
              <LinearGradient
                colors={q.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
              />
              <View style={s.actionIcon}>
                <Ionicons name={q.icon} size={18} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={s.actionLabel}>{q.label}</Text>
              <Text style={s.actionSub}>{q.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Counsellor nudge ── */}
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/counselling"); }}
          style={({ pressed }) => [s.nudge, pressed && s.nudgePressed]}
        >
          <LinearGradient colors={["#0f3d37", "#1c6b5f"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.nudgeGrad}>
            <View style={s.nudgeLeft}>
              <View style={s.nudgeIconWrap}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.nudgeTitle}>Need help choosing?</Text>
                <Text style={s.nudgeSub}>Our counsellors are free — talk to one now.</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
          </LinearGradient>
        </Pressable>

      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  headerSafe: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  logo: { width: 130, height: 26 },
  avatarBtn: {},
  avatarPressed: { opacity: 0.8 },
  avatar: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: "#fff" },

  scroll: { paddingHorizontal: 20 },

  // Greeting
  greetBlock: { marginBottom: 20 },
  greetLine: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, color: colors.muted },
  greetName: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 36,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 42,
  },

  // Section headers
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: colors.ink,
    marginBottom: 12,
  },
  seeAll: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: colors.primary,
    marginBottom: 12,
  },

  // Destination cards
  destRow: { gap: 10, paddingRight: 4, marginBottom: 26 },
  destCard: {
    width: 160,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#0a1f1a",
    flexDirection: "column",
    ...shadow,
  },
  destPressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  destImageFrame: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 48,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  destImage: {
    width: "100%",
    height: "100%",
  },
  destGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  destCountry: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 14,
    color: "#fff",
    letterSpacing: -0.2,
  },

  // University cards
  cardList: { gap: 12, marginBottom: 26 },

  // Quick actions
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  actionTile: {
    width: "47.5%",
    borderRadius: 18,
    padding: 16,
    gap: 6,
    overflow: "hidden",
    ...shadow,
  },
  actionPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  actionIcon: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 6,
  },
  actionLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: "#fff", lineHeight: 18 },
  actionSub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 15 },

  // Counsellor nudge
  nudge: { marginBottom: 8 },
  nudgePressed: { opacity: 0.88 },
  nudgeGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 18,
    ...shadow,
  },
  nudgeLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  nudgeIconWrap: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  nudgeTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
  nudgeSub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
    lineHeight: 18,
  },

  // Empty state
  emptyWrap: { paddingTop: 40, gap: 14 },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 22, backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  emptyTitle: { fontFamily: "Fraunces-SemiBold", fontSize: 28, color: colors.ink, letterSpacing: -0.4 },
  emptySub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 15, color: colors.muted, lineHeight: 23 },
});
