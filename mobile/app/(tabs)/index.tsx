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
import { useState } from "react";

import { mobileClient } from "../../src/api/mobileClient";
import { Button } from "../../src/components/Button";
import { UniversityCard } from "../../src/components/UniversityCard";
import { FLOATING_TAB_INSET } from "../../src/components/FloatingTabBar";
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

const CDN = "https://www.studentstraffic.com/images/countries";

// Curated per-country metadata. Key = country slug from API.
// Add photos to public/images/countries/<slug>.jpg on the web app — they'll be
// served from the CDN URL above. Gradient is the fallback while loading or if the
// image file hasn't been uploaded yet.
const COUNTRY_META: Record<string, {
  imageUri: string;
  gradient: [string, string];
}> = {
  georgia:      { imageUri: `${CDN}/georgia.jpg`,      gradient: ["#1a3a6b", "#2a5298"] },
  russia:       { imageUri: `${CDN}/russia.jpg`,       gradient: ["#6b1a1a", "#a03030"] },
  philippines:  { imageUri: `${CDN}/philippines.jpg`,  gradient: ["#1a5276", "#2980b9"] },
  kyrgyzstan:   { imageUri: `${CDN}/kyrgyzstan.jpg`,   gradient: ["#1a4a2a", "#27714a"] },
  kazakhstan:   { imageUri: `${CDN}/kazakhstan.jpg`,   gradient: ["#154f3c", "#1e7a5f"] },
  china:        { imageUri: `${CDN}/china.jpg`,        gradient: ["#6b1a1a", "#8b2a2a"] },
  nepal:        { imageUri: `${CDN}/nepal.jpg`,        gradient: ["#4a1a5a", "#7a2a8a"] },
  bangladesh:   { imageUri: `${CDN}/bangladesh.jpg`,   gradient: ["#1a3a6b", "#1a5276"] },
  ukraine:      { imageUri: `${CDN}/ukraine.jpg`,      gradient: ["#1a4a6b", "#c69b14"] },
  uzbekistan:   { imageUri: `${CDN}/uzbekistan.jpg`,   gradient: ["#7a4a1a", "#b06a2a"] },
};

const FALLBACK_GRADIENTS: [string, string][] = [
  ["#0a2620", "#0f3d37"],
  ["#1a3a6b", "#2563eb"],
  ["#6b1a1a", "#c0392b"],
  ["#4a1a5a", "#7a2a8a"],
];

const QUICK_ACTIONS = [
  { icon: "wallet-outline" as const,           label: "Budget picks",    sub: "Under $5k/yr",       bg: colors.primarySoft, fg: colors.primary },
  { icon: "shield-checkmark-outline" as const, label: "NMC recognised",  sub: "India-approved",     bg: colors.primarySoft, fg: colors.primary },
  { icon: "language-outline" as const,         label: "English medium",  sub: "No language barrier", bg: colors.blueSoft,   fg: colors.blue },
  { icon: "trophy-outline" as const,           label: "Top ranked",      sub: "QS & WHO listed",    bg: colors.amberSoft,  fg: colors.amber },
];

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

// ── Destination card ──────────────────────────────────────────────────────────

function DestCard({ name, slug, index, onPress }: {
  name: string;
  slug: string;
  index: number;
  onPress: () => void;
}) {
  const meta = COUNTRY_META[slug.toLowerCase()] ?? {
    imageUri: null,
    gradient: FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length],
  };
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = !!meta.imageUri && !imgFailed;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.destCard, pressed && s.destPressed]}
    >
      {/* Background: image or gradient */}
      {showImage ? (
        <Image
          source={{ uri: meta.imageUri! }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <LinearGradient
          colors={meta.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Dark scrim from bottom */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.72)"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Text overlay */}
      <View style={s.destOverlay}>
        <Text style={s.destCountry}>{name}</Text>
      </View>
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

  const countries = searchOptions?.countries ?? [];

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
        <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: Platform.OS === "ios" ? FLOATING_TAB_INSET + 16 : insets.bottom + 80 }]}>
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
        contentContainerStyle={[s.scroll, { paddingBottom: Platform.OS === "ios" ? FLOATING_TAB_INSET + 16 : insets.bottom + 80 }]}
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
              snapToInterval={138}
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
                    router.push("/(tabs)/search");
                  }}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Stats strip ── */}
        <View style={s.statsCard}>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/shortlists"); }}
            style={({ pressed }) => [s.statItem, pressed && s.statPressed]}
          >
            <View style={[s.statIcon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="bookmark" size={14} color={colors.primary} />
            </View>
            <Text style={s.statNum}>{data.shortlistCount}</Text>
            <Text style={s.statLbl}>Saved</Text>
          </Pressable>

          <View style={s.statDivider} />

          <Pressable
            onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/applications"); }}
            style={({ pressed }) => [s.statItem, pressed && s.statPressed]}
          >
            <View style={[s.statIcon, { backgroundColor: colors.coralSoft }]}>
              <Ionicons name="document-text" size={14} color={colors.coral} />
            </View>
            <Text style={s.statNum}>{data.applicationCount}</Text>
            <Text style={s.statLbl}>Applied</Text>
          </Pressable>

          <View style={s.statDivider} />

          <Pressable
            onPress={() => { Haptics.selectionAsync(); router.push("/counselling"); }}
            style={({ pressed }) => [s.statItem, pressed && s.statPressed]}
          >
            <View style={[s.statIcon, { backgroundColor: colors.amberSoft }]}>
              <Ionicons name="chatbubble-ellipses" size={14} color={colors.amber} />
            </View>
            <Text style={s.statNum}>Free</Text>
            <Text style={s.statLbl}>Counselling</Text>
          </Pressable>
        </View>

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
              style={({ pressed }) => [s.actionTile, { backgroundColor: q.bg }, pressed && s.actionPressed]}
            >
              <View style={[s.actionIcon, { borderColor: q.fg + "22" }]}>
                <Ionicons name={q.icon} size={18} color={q.fg} />
              </View>
              <Text style={[s.actionLabel, { color: q.fg }]}>{q.label}</Text>
              <Text style={[s.actionSub, { color: q.fg + "99" }]}>{q.sub}</Text>
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
    width: 128,
    height: 172,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    ...shadow,
  },
  destPressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  destOverlay: {
    padding: 12,
    paddingBottom: 14,
    gap: 2,
  },
  destCountry: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: -0.2,
  },
  destLandmark: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 10,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 14,
  },

  // Stats strip
  statsCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 26,
    overflow: "hidden",
    ...shadow,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    gap: 4,
  },
  statPressed: { backgroundColor: colors.background },
  statIcon: {
    width: 30, height: 30, borderRadius: 9,
    alignItems: "center", justifyContent: "center",
    marginBottom: 2,
  },
  statNum: { fontFamily: "Fraunces-SemiBold", fontSize: 20, color: colors.ink, lineHeight: 24 },
  statLbl: { fontFamily: "PlusJakartaSans-Regular", fontSize: 10, color: colors.muted },
  statDivider: { width: 1, backgroundColor: colors.line, marginVertical: 12 },

  // University cards
  cardList: { gap: 12, marginBottom: 26 },

  // Quick actions
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  actionTile: {
    width: "47.5%",
    borderRadius: 18,
    padding: 16,
    gap: 5,
  },
  actionPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  actionIcon: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  actionLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, lineHeight: 18 },
  actionSub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 15 },

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
