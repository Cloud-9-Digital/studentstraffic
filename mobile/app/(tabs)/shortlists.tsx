import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { UniversityCard } from "../../src/components/UniversityCard";
import { Skeleton } from "../../src/components/Skeleton";
import { colors } from "../../src/theme/tokens";
import type { University } from "../../src/types/domain";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

type AnimValues = { opacity: Animated.Value; tx: Animated.Value; scale: Animated.Value };

const itemKey = (u: University) => u.offeringSlug ?? u.slug;

export default function ShortlistsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Use the raw query value (undefined while loading) so the ref is stable
  const { data: shortlistData, isLoading: shortlistsLoading } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => mobileClient.getShortlists(),
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Local copy so we control when items disappear (animation)
  const [localData, setLocalData] = useState<University[]>([]);
  const animMap = useRef(new Map<string, AnimValues>());
  const removing = useRef(new Set<string>());

  useEffect(() => {
    if (!shortlistData) return; // still loading — don't touch localData
    setLocalData(prev => {
      if (removing.current.size === 0) return shortlistData;
      // Keep animating-out items in place; swap in fresh data for the rest
      const animating = prev.filter(u => removing.current.has(itemKey(u)));
      const fresh = shortlistData.filter(u => !removing.current.has(itemKey(u)));
      return [...fresh, ...animating];
    });
  }, [shortlistData]);

  function ensureAnim(key: string): AnimValues {
    if (!animMap.current.has(key)) {
      animMap.current.set(key, {
        opacity: new Animated.Value(1),
        tx:      new Animated.Value(0),
        scale:   new Animated.Value(1),
      });
    }
    return animMap.current.get(key)!;
  }

  function handleRemoved(key: string) {
    removing.current.add(key);
    const { opacity, tx, scale } = ensureAnim(key);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0,    duration: 270, useNativeDriver: true }),
      Animated.timing(scale,   { toValue: 0.88, duration: 270, useNativeDriver: true }),
      Animated.spring(tx, {
        toValue: 100,
        useNativeDriver: true,
        speed: 16,
        bounciness: 0,
      }),
    ]).start(() => {
      LayoutAnimation.configureNext({
        duration: 280,
        update: { type: LayoutAnimation.Types.spring, springDamping: 0.85 },
        delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      });
      setLocalData(prev => prev.filter(u => itemKey(u) !== key));
      removing.current.delete(key);
      animMap.current.delete(key);
    });
  }

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* ── Fixed header ── */}
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.headerRow}>
          <View style={s.titleWrap}>
            <Text style={s.title}>Saved</Text>
            {localData.length > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{localData.length}</Text>
              </View>
            )}
          </View>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/search"); }}
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
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {shortlistsLoading && shortlistData === undefined ? (
          <View style={{ gap: 12, paddingTop: 4 }}>
            {[0, 1, 2].map(i => (
              <View key={i} style={sk.card}>
                <Skeleton width="100%" height={110} borderRadius={0} style={sk.cardImg} />
                <View style={sk.cardBody}>
                  <Skeleton width="65%" height={16} borderRadius={5} />
                  <Skeleton width="45%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
                  <View style={sk.cardRow}>
                    <Skeleton width={72} height={24} borderRadius={8} />
                    <Skeleton width={72} height={24} borderRadius={8} />
                    <Skeleton width={72} height={24} borderRadius={8} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : localData.length === 0 ? (
          <View style={s.emptyWrap}>
            <View style={s.emptyIconWrap}>
              <Ionicons name="bookmark-outline" size={40} color={colors.primary} />
            </View>
            <Text style={s.emptyTitle}>No universities saved yet</Text>
            <Text style={s.emptySub}>
              Browse universities and tap the bookmark icon to save ones you're interested in.
            </Text>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(tabs)/search"); }}
              style={({ pressed }) => [s.emptyBtn, pressed && s.emptyBtnPressed]}
            >
              <Ionicons name="search" size={16} color="#fff" />
              <Text style={s.emptyBtnLabel}>Browse universities</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={s.subtitle}>
              {localData.length} {localData.length === 1 ? "university" : "universities"} shortlisted
            </Text>
            <View style={s.cardList}>
              {localData.map(u => {
                const key = itemKey(u);
                const anim = ensureAnim(key);
                return (
                  <Animated.View
                    key={key}
                    style={{
                      opacity: anim.opacity,
                      transform: [{ translateX: anim.tx }, { scale: anim.scale }],
                    }}
                  >
                    <UniversityCard
                      university={u}
                      onShortlistChange={(slug, isShortlisted) => {
                        if (!isShortlisted) handleRemoved(key);
                      }}
                    />
                  </Animated.View>
                );
              })}
            </View>

            {/* Counsellor nudge */}
            <View style={s.nudge}>
              <View style={s.nudgeLeft}>
                <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
              </View>
              <View style={s.nudgeText}>
                <Text style={s.nudgeTitle}>Ready to apply?</Text>
                <Text style={s.nudgeSub}>Our counsellors will help you pick the best fit from your list.</Text>
              </View>
              <Pressable
                onPress={() => { Haptics.selectionAsync(); router.push("/counselling"); }}
                hitSlop={8}
              >
                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
              </Pressable>
            </View>
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
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
  },
  badgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: "#fff",
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
  cardList: { gap: 12 },

  // Counsellor nudge card
  nudge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(15,61,55,0.10)",
    padding: 16,
  },
  nudgeLeft: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(15,61,55,0.10)",
    alignItems: "center", justifyContent: "center",
  },
  nudgeText: { flex: 1 },
  nudgeTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: colors.ink },
  nudgeSub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted, lineHeight: 18, marginTop: 2 },

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
  emptyBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 14, marginTop: 4,
  },
  emptyBtnPressed: { opacity: 0.85 },
  emptyBtnLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
});

const sk = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  cardImg: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  cardBody: {
    padding: 14,
    gap: 4,
  },
  cardRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
});
