import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Surface } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "../../src/components/Button";
import { colors, shadow } from "../../src/theme/tokens";

const { width: W, height: H } = Dimensions.get("window");

// ─── Illustrations ────────────────────────────────────────────────────────────

function IllustrationCompare() {
  return (
    <View style={ill.stack}>
      {[
        { flag: "🇷🇺", name: "Kursk State Medical University", sub: "Russia · ₹28L/yr", tag: "Top Pick" },
        { flag: "🇨🇳", name: "Jilin University", sub: "China · ₹22L/yr", tag: null },
        { flag: "🇵🇭", name: "University of Perpetual Help", sub: "Philippines · ₹18L/yr", tag: null },
      ].map((u, i) => (
        <View key={i} style={[ill.row, i === 0 && ill.rowActive]}>
          <Text style={ill.flag}>{u.flag}</Text>
          <View style={ill.rowText}>
            <Text style={ill.rowName} numberOfLines={1}>{u.name}</Text>
            <Text style={ill.rowSub}>{u.sub}</Text>
          </View>
          {u.tag
            ? <View style={ill.tag}><Text style={ill.tagText}>{u.tag}</Text></View>
            : <Ionicons name="bookmark-outline" size={16} color={colors.faint} />
          }
        </View>
      ))}
    </View>
  );
}

function IllustrationShortlist() {
  return (
    <View style={ill.stack}>
      <View style={ill.listHead}>
        <Text style={ill.listTitle}>My Shortlist</Text>
        <Text style={ill.listSub}>3 saved</Text>
      </View>
      {[
        { flag: "🇷🇺", name: "Kursk State Medical", ok: true },
        { flag: "🇰🇬", name: "Osh State University", ok: true },
        { flag: "🇨🇳", name: "Jilin University", ok: false },
      ].map((u, i) => (
        <View key={i} style={ill.row}>
          <Text style={ill.flag}>{u.flag}</Text>
          <Text style={[ill.rowName, { flex: 1 }]}>{u.name}</Text>
          <View style={[ill.pill, u.ok ? ill.pillGreen : ill.pillAmber]}>
            <Text style={[ill.pillText, u.ok ? ill.pillTextGreen : ill.pillTextAmber]}>
              {u.ok ? "Shortlisted" : "Reviewing"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function IllustrationTrack() {
  const steps = [
    { label: "Documents submitted", done: true },
    { label: "Application reviewed", done: true },
    { label: "Offer letter received", done: false },
    { label: "Visa application", done: false },
  ];
  return (
    <View style={ill.stack}>
      <View style={[ill.row, { marginBottom: 8 }]}>
        <Text style={ill.flag}>🇷🇺</Text>
        <View>
          <Text style={ill.rowName}>Kursk State Medical</Text>
          <Text style={ill.rowSub}>Application in progress</Text>
        </View>
      </View>
      {steps.map((s, i) => (
        <View key={i} style={ill.step}>
          <View style={[ill.stepDot, s.done && ill.stepDotDone]}>
            {s.done && <Ionicons name="checkmark" size={10} color="#fff" />}
          </View>
          {i < steps.length - 1 && (
            <View style={[ill.stepLine, s.done && ill.stepLineDone]} />
          )}
          <Text style={[ill.rowSub, s.done && { color: colors.ink, fontFamily: "PlusJakartaSans-SemiBold" }]}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function IllustrationCounsel() {
  return (
    <View style={ill.stack}>
      <View style={ill.advisorRow}>
        <View style={ill.avatar}>
          <Ionicons name="person" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ill.rowName}>Dr. Priya Sharma</Text>
          <Text style={ill.rowSub}>MBBS Counsellor · 8 yrs</Text>
        </View>
        <View style={ill.online} />
      </View>
      <View style={ill.bubble}>
        <Text style={ill.bubbleText}>
          "Based on your budget, Kursk State is your strongest option. Let's plan your application."
        </Text>
      </View>
      <View style={[ill.bubble, ill.bubbleOut]}>
        <Text style={[ill.bubbleText, { color: colors.coral }]}>
          What about the visa process?
        </Text>
      </View>
    </View>
  );
}

// ─── Illustration styles ──────────────────────────────────────────────────────

const ill = StyleSheet.create({
  stack: { gap: 8 },
  listHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  listTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: colors.ink },
  listSub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 11,
    ...shadow,
  },
  rowActive: { borderColor: colors.primary, borderWidth: 1.5 },
  flag: { fontSize: 22 },
  rowText: { flex: 1 },
  rowName: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.ink },
  rowSub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.muted, marginTop: 2 },
  tag: { backgroundColor: colors.coral, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, color: "#fff" },
  pill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  pillGreen: { backgroundColor: "rgba(22,121,76,0.10)" },
  pillAmber: { backgroundColor: "rgba(183,121,31,0.10)" },
  pillText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11 },
  pillTextGreen: { color: colors.success },
  pillTextAmber: { color: colors.amber },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingBottom: 12,
    position: "relative",
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepLine: {
    position: "absolute",
    left: 9,
    top: 20,
    width: 2,
    height: 12,
    backgroundColor: colors.line,
  },
  stepLineDone: { backgroundColor: colors.primary },
  advisorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    ...shadow,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  online: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3aad72",
  },
  bubble: {
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: "flex-start",
    maxWidth: "88%",
  },
  bubbleOut: {
    backgroundColor: colors.coralSoft,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 4,
    alignSelf: "flex-end",
  },
  bubbleText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.ink,
    lineHeight: 18,
  },
});

// ─── Platform-aware bottom card ───────────────────────────────────────────────

function BottomCard({ children, style }: { children: React.ReactNode; style?: object }) {
  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={92}
        tint="systemMaterial"
        style={[style, { overflow: "hidden" }]}
      >
        {children}
      </BlurView>
    );
  }
  return (
    <Surface style={style} elevation={3}>
      {children}
    </Surface>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES = [
  {
    key: "compare",
    Illustration: IllustrationCompare,
    title: "Compare 1,000+\nUniversities",
    description: "Filter by country, fees, and ranking to find your perfect match.",
  },
  {
    key: "shortlist",
    Illustration: IllustrationShortlist,
    title: "Build Your\nShortlist",
    description: "Save universities you love and compare them side by side.",
  },
  {
    key: "track",
    Illustration: IllustrationTrack,
    title: "Track Every\nApplication",
    description: "Stay on top of documents, deadlines, and offer letters in one view.",
  },
  {
    key: "counsel",
    Illustration: IllustrationCounsel,
    title: "Free Expert\nCounselling",
    description: "Our MBBS counsellors guide you from shortlisting to enrollment at no cost.",
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setPage(Math.round(e.nativeEvent.contentOffset.x / W));
  }

  function goNext() {
    if (page < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (page + 1) * W, animated: true });
    } else {
      router.push("/(auth)/register");
    }
  }

  const isLast = page === SLIDES.length - 1;

  // Heights
  const topH = Math.round((H - insets.top - insets.bottom) * 0.52);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={{ width: W }}>

            {/* ── Teal top ── */}
            <LinearGradient
              colors={["#0a2620", "#0f3d37"]}
              style={[styles.tealTop, { height: topH, paddingTop: insets.top }]}
            >
              {/* Logo bar */}
              <View style={styles.logoBar}>
                <Image
                  source={require("../../assets/logo-white.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Pressable onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.signinLink}>Sign in</Text>
                </Pressable>
              </View>

              {/* Illustration */}
              <View style={styles.illustrationWrap}>
                <slide.Illustration />
              </View>
            </LinearGradient>

            {/* ── Bottom card — BlurView on iOS, Surface on Android ── */}
            <BottomCard style={styles.card}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>

              <View style={styles.dots}>
                {SLIDES.map((_, i) => (
                  <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
                ))}
              </View>

              <Button
                label={isLast ? "Create free account" : "Next"}
                icon={isLast ? "person-add" : "arrow-forward"}
                onPress={goNext}
              />
              {isLast && (
                <Button
                  label="I already have an account"
                  variant="ghost"
                  onPress={() => router.push("/(auth)/login")}
                />
              )}
            </BottomCard>

          </View>
        ))}
      </ScrollView>

      {/* Bottom safe-area fill so white extends to edge */}
      <View style={[styles.safeBottom, { height: insets.bottom }]} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tealTop: {
    paddingHorizontal: 24,
  },
  logoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  logo: {
    width: 160,
    height: 32,
  },
  signinLink: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
  },
  illustrationWrap: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 32,
  },
  card: {
    // BlurView on iOS is transparent — teal bleeds through as frosted glass
    // Surface on Android gets its own white bg from Paper
    backgroundColor: Platform.OS === "android" ? "#fff" : "rgba(255,255,255,0.55)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 20,
    gap: 12,
  },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 36,
    lineHeight: 44,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.line,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  safeBottom: {
    backgroundColor: "#fff",
  },
});
