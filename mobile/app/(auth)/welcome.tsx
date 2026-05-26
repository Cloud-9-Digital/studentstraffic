import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { CountryFlag } from "../../src/components/CountryFlag";
import { colors } from "../../src/theme/tokens";

const { width: W } = Dimensions.get("window");

// ─── Shared glass row ─────────────────────────────────────────────────────────

function GlassRow({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <View style={[gr.row, active && gr.active]}>
      {children}
    </View>
  );
}

const gr = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  active: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.26)",
  },
});

// ─── Slide cards ──────────────────────────────────────────────────────────────

function CardDiscover({ cardH }: { cardH: number }) {
  return (
    <LinearGradient colors={["#071f18", "#0f3d37", "#1d5c48"]} style={[vc.card, { height: cardH }]}>
      {/* Hero stat */}
      <View style={vc.hero}>
        <Text style={vc.heroNum}>1,000+</Text>
        <Text style={vc.heroLabel}>MBBS universities worldwide</Text>
      </View>

      <View style={vc.divider} />

      {/* Live results */}
      <View style={vc.body}>
        {/* Search bar mock */}
        <View style={vc.searchBar}>
          <Ionicons name="search-outline" size={13} color="rgba(255,255,255,0.38)" />
          <Text style={vc.searchText}>Vietnam, Russia, Georgia...</Text>
          <View style={vc.filterPill}>
            <Text style={vc.filterPillText}>NMC ✓</Text>
          </View>
        </View>
        {[
          { country: "Russia", name: "Kursk State Medical Univ.", fee: "$5,200/yr" },
          { country: "Vietnam", name: "Vietnam Medical University", fee: "$3,800/yr" },
        ].map((u, i) => (
          <GlassRow key={i} active={i === 0}>
            <CountryFlag country={u.country} width={28} height={18} borderRadius={4} />
            <View style={{ flex: 1 }}>
              <Text style={vc.rowName} numberOfLines={1}>{u.name}</Text>
              <Text style={vc.rowSub}>{u.fee}</Text>
            </View>
            <View style={vc.nmcBadge}>
              <Text style={vc.nmcText}>NMC ✓</Text>
            </View>
          </GlassRow>
        ))}
      </View>
    </LinearGradient>
  );
}

function CardCounsel({ cardH }: { cardH: number }) {
  return (
    <LinearGradient colors={["#060d1f", "#0b1a40", "#122660"]} style={[vc.card, { height: cardH }]}>
      <View style={vc.hero}>
        <Text style={[vc.heroNum, { color: "#fbbf24" }]}>₹0</Text>
        <Text style={vc.heroLabel}>counselling fee — always free</Text>
      </View>

      <View style={vc.divider} />

      <View style={vc.body}>
        <GlassRow active>
          <View style={vc.avatar}>
            <Ionicons name="person" size={17} color="#60a5fa" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={vc.rowName}>Dr. Priya Sharma</Text>
            <Text style={vc.rowSub}>MBBS Counsellor · 8 yrs experience</Text>
          </View>
          <View style={vc.onlineDot} />
        </GlassRow>
        <View style={vc.bubbleIn}>
          <Text style={vc.bubbleText}>"Based on your NEET score, Kursk State Medical is your strongest match."</Text>
        </View>
        <View style={vc.bubbleOut}>
          <Text style={[vc.bubbleText, { color: "rgba(255,255,255,0.9)" }]}>Which country suits my budget best?</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

function CardShortlist({ cardH }: { cardH: number }) {
  const items = [
    { country: "Russia", name: "Kursk State Medical", fee: "$5,200", saved: true },
    { country: "Vietnam", name: "Vietnam Medical Univ.", fee: "$3,800", saved: true },
    { country: "Kyrgyzstan", name: "Osh State University", fee: "$2,900", saved: false },
  ];
  return (
    <LinearGradient colors={["#1a0d03", "#30180a", "#4e2812"]} style={[vc.card, { height: cardH }]}>
      <View style={vc.hero}>
        <View style={vc.flagRow}>
          {["Russia", "Vietnam", "Georgia", "Kyrgyzstan", "Uzbekistan"].map((country) => (
            <CountryFlag key={country} country={country} width={30} height={20} borderRadius={5} />
          ))}
        </View>
        <Text style={[vc.heroLabel, { marginTop: 8 }]}>15+ countries to choose from</Text>
      </View>

      <View style={vc.divider} />

      <View style={vc.body}>
        <View style={vc.shortlistHead}>
          <Text style={vc.shortlistTitle}>My Shortlist</Text>
          <View style={vc.savedCount}>
            <Ionicons name="bookmark" size={11} color="#fb923c" />
            <Text style={vc.savedCountText}>2 saved</Text>
          </View>
        </View>
        {items.map((u, i) => (
          <GlassRow key={i} active={u.saved}>
            <CountryFlag country={u.country} width={28} height={18} borderRadius={4} />
            <Text style={[vc.rowName, { flex: 1 }]} numberOfLines={1}>{u.name}</Text>
            <Text style={vc.feeText}>{u.fee}/yr</Text>
            <Ionicons
              name={u.saved ? "bookmark" : "bookmark-outline"}
              size={15}
              color={u.saved ? "#fb923c" : "rgba(255,255,255,0.25)"}
            />
          </GlassRow>
        ))}
      </View>
    </LinearGradient>
  );
}

function CardJourney({ cardH }: { cardH: number }) {
  const steps = [
    { label: "Search & Shortlist", done: true },
    { label: "Free Counselling Session", done: true },
    { label: "Application & Documents", done: true },
    { label: "Offer Letter Received", done: false },
    { label: "Visa & Enrollment", done: false },
  ];
  return (
    <LinearGradient colors={["#0e0620", "#1c0e3d", "#2a1460"]} style={[vc.card, { height: cardH }]}>
      <View style={vc.hero}>
        <View style={vc.checkCircle}>
          <Ionicons name="checkmark" size={28} color="#a78bfa" />
        </View>
        <Text style={[vc.heroNum, { fontSize: 22, color: "#a78bfa", marginTop: 10 }]}>End-to-End Support</Text>
        <Text style={vc.heroLabel}>every step of your journey</Text>
      </View>

      <View style={vc.divider} />

      <View style={vc.body}>
        {steps.map((step, i) => (
          <View key={i} style={vc.stepRow}>
            <View style={vc.stepLeft}>
              <View style={[vc.stepDot, step.done && vc.stepDotDone]}>
                {step.done && <Ionicons name="checkmark" size={9} color="#fff" />}
              </View>
              {i < steps.length - 1 && (
                <View style={[vc.stepLine, step.done && vc.stepLineDone]} />
              )}
            </View>
            <Text style={[vc.stepLabel, !step.done && vc.stepLabelPending]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

// ─── Card visual styles ───────────────────────────────────────────────────────

const vc = StyleSheet.create({
  card: {
    width: W - 40,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    gap: 14,
  },

  // Hero section
  hero: { alignItems: "center", gap: 4 },
  heroNum: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 52,
    lineHeight: 58,
    color: "#fff",
    letterSpacing: -1,
  },
  heroLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginHorizontal: -20,
  },

  // Body
  body: { gap: 8, flex: 1, justifyContent: "center" },

  // Search bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchText: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
  },
  filterPill: {
    backgroundColor: "rgba(58,173,114,0.25)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  filterPillText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, color: "#3aad72" },

  // Row elements
  rowName: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: "#fff" },
  rowSub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: "rgba(255,255,255,0.48)", marginTop: 2 },
  nmcBadge: {
    backgroundColor: "rgba(58,173,114,0.22)",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  nmcText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, color: "#3aad72" },
  feeText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: "rgba(255,255,255,0.65)" },

  // Counsel
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(96,165,250,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3aad72" },
  bubbleIn: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 14, borderBottomLeftRadius: 3,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.09)",
    paddingHorizontal: 12, paddingVertical: 9,
    alignSelf: "flex-start", maxWidth: "90%",
  },
  bubbleOut: {
    backgroundColor: "rgba(11,26,64,0.7)",
    borderRadius: 14, borderBottomRightRadius: 3,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12, paddingVertical: 9,
    alignSelf: "flex-end", maxWidth: "80%",
  },
  bubbleText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 17,
  },

  // Shortlist
  flagRow: { flexDirection: "row", gap: 6 },
  shortlistHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  shortlistTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: "#fff" },
  savedCount: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(251,146,60,0.18)",
    borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4,
  },
  savedCountText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, color: "#fb923c" },

  // Journey
  checkCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "rgba(167,139,250,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  stepLeft: { alignItems: "center", width: 18 },
  stepDot: {
    width: 17, height: 17, borderRadius: 9,
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  stepDotDone: { backgroundColor: "#a78bfa", borderColor: "#a78bfa" },
  stepLine: { width: 1.5, height: 12, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 2 },
  stepLineDone: { backgroundColor: "#a78bfa" },
  stepLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12, color: "#fff", lineHeight: 17, paddingBottom: 12, marginTop: 1,
  },
  stepLabelPending: { color: "rgba(255,255,255,0.32)", fontFamily: "PlusJakartaSans-Regular" },
});

// ─── Slide data ───────────────────────────────────────────────────────────────

type Slide = {
  key: string;
  Card: (props: { cardH: number }) => React.ReactElement;
  title: string;
  sub: string;
};

const SLIDES: Slide[] = [
  {
    key: "discover",
    Card: CardDiscover,
    title: "Find Your Perfect\nMBBS University",
    sub: "Search 1,000+ universities across 15 countries and filter by budget, recognition, and more.",
  },
  {
    key: "counsel",
    Card: CardCounsel,
    title: "Expert Counsellors.\nCompletely Free.",
    sub: "Our certified MBBS specialists have guided over 10,000 students — at zero cost.",
  },
  {
    key: "shortlist",
    Card: CardShortlist,
    title: "Shortlist &\nCompare Easily",
    sub: "Save favourites, compare fees side-by-side, and decide with complete confidence.",
  },
  {
    key: "journey",
    Card: CardJourney,
    title: "From Search\nto Enrollment",
    sub: "We guide you through every step — applications, documents, visa, and beyond.",
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [page, setPage] = useState(0);
  const [slideH, setSlideH] = useState(0);

  const isLast = page === SLIDES.length - 1;

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const idx = viewableItems[0]?.index;
    if (idx != null) setPage(idx);
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  function goNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isLast) {
      listRef.current?.scrollToIndex({ index: page + 1, animated: true });
    } else {
      router.push("/(auth)/register");
    }
  }

  // Card takes 60% of slide area; remaining is for title + sub
  const CARD_H = slideH > 0 ? Math.round(slideH * 0.60) : 0;

  return (
    <View style={s.root}>
      <StatusBar style="dark" />

      {/* ── Fixed header ── */}
      <View style={[s.header, { paddingTop: insets.top + 6 }]}>
        <Image
          source={require("../../assets/logo.png")}
          style={s.logo}
          resizeMode="contain"
        />
        <Pressable onPress={() => router.push("/(auth)/login")} hitSlop={12}>
          <Text style={s.skipLabel}>Sign in</Text>
        </Pressable>
      </View>

      {/* ── Scrollable slides (only this section moves) ── */}
      <View
        style={{ flex: 1 }}
        onLayout={(e) => setSlideH(e.nativeEvent.layout.height)}
      >
        {slideH > 0 && (
          <FlatList
            ref={listRef}
            data={SLIDES}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            getItemLayout={(_, index) => ({ length: W, offset: W * index, index })}
            scrollEventThrottle={16}
            renderItem={({ item: slide }) => (
              <View style={[s.slide, { height: slideH }]}>
                {/* Visual card */}
                <slide.Card cardH={CARD_H} />

                {/* Text */}
                <View style={s.textBlock}>
                  <Text style={s.slideTitle}>{slide.title}</Text>
                  <Text style={s.slideSub}>{slide.sub}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* ── Fixed footer — never moves ── */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        {/* Progress dots */}
        <View style={s.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[s.dot, i === page && s.dotActive]} />
          ))}
        </View>

        {/* Primary CTA */}
        <Pressable
          onPress={goNext}
          style={({ pressed }) => [s.primaryBtn, pressed && s.primaryBtnPressed]}
        >
          <Text style={s.primaryBtnLabel}>
            {isLast ? "Create Free Account" : "Continue"}
          </Text>
          <Ionicons
            name={isLast ? "person-add-outline" : "arrow-forward"}
            size={18}
            color="#fff"
          />
        </Pressable>

        {/* Sign in link */}
        <Pressable
          onPress={() => { Haptics.selectionAsync(); router.push("/(auth)/login"); }}
          hitSlop={10}
          style={s.signInRow}
        >
          <Text style={s.signInText}>Already have an account? </Text>
          <Text style={s.signInLink}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  logo: { width: 130, height: 26 },
  skipLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: colors.muted,
  },

  // Slide content
  slide: {
    width: W,
    gap: 20,
    paddingTop: 4,
  },
  textBlock: {
    paddingHorizontal: 24,
    gap: 8,
  },
  slideTitle: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 30,
    lineHeight: 38,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  slideSub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    backgroundColor: "#fff",
  },
  dots: { flexDirection: "row", gap: 6 },
  dot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: colors.line,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  primaryBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  primaryBtnLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#fff",
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.muted,
  },
  signInLink: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: colors.primary,
  },
});
