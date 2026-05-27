import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";

import { useCompare } from "../context/CompareContext";
import { useCall } from "../context/CallContext";
import { colors } from "../theme/tokens";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index:      { active: "home",        inactive: "home-outline" },
  search:     { active: "search",      inactive: "search-outline" },
  compare:    { active: "git-compare", inactive: "git-compare-outline" },
  shortlists: { active: "bookmark",    inactive: "bookmark-outline" },
  calls:      { active: "call",        inactive: "call-outline" },
  profile:    { active: "person",      inactive: "person-outline" },
};

const TAB_LABELS: Record<string, string> = {
  index:      "Home",
  search:     "Search",
  compare:    "Compare",
  shortlists: "Saved",
  calls:      "Calls",
  profile:    "Profile",
};

// How much wider the active tab is vs an inactive one
const ACTIVE_FLEX = 2.2;
const INACTIVE_FLEX = 1;
const PILL_H = 64;
const CHIP_H = 38;

export const FLOATING_TAB_INSET = 90;

// ── Single tab item ───────────────────────────────────────────────────────────

function TabItem({
  routeName,
  focused,
  onPress,
  onLongPress,
  compareBadge,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  compareBadge?: number;
}) {
  const icons = TAB_ICONS[routeName];
  const label = TAB_LABELS[routeName] ?? routeName;

  // Animate flex width between active and inactive
  const flex = useRef(new Animated.Value(focused ? ACTIVE_FLEX : INACTIVE_FLEX)).current;

  useEffect(() => {
    Animated.spring(flex, {
      toValue: focused ? ACTIVE_FLEX : INACTIVE_FLEX,
      useNativeDriver: false,
      speed: 22,
      bounciness: 4,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ flex, alignItems: "center", justifyContent: "center", height: PILL_H }}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={[tb.item, focused && tb.itemActive]}
        hitSlop={focused ? 0 : 6}
      >
        {focused ? (
          // Active state — filled dark chip with icon + label
          <View style={tb.chip}>
            <Ionicons name={icons?.active} size={17} color="#fff" />
            <Text style={tb.chipLabel} numberOfLines={1}>{label}</Text>
          </View>
        ) : (
          // Inactive state — icon only
          <View style={tb.iconWrap}>
            <Ionicons name={icons?.inactive} size={22} color={colors.faint} />
            {/* Compare badge dot */}
            {compareBadge ? (
              <View style={tb.badge}>
                <Text style={tb.badgeText}>{compareBadge > 9 ? "9+" : compareBadge}</Text>
              </View>
            ) : null}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const tb = StyleSheet.create({
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  itemActive: {},

  // Filled active chip
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    height: CHIP_H,
    // Subtle inner glow
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  chipLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    color: "#fff",
    letterSpacing: -0.1,
  },

  // Inactive icon container
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Compare count badge
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.coral,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 9,
    color: "#fff",
    lineHeight: 12,
  },
});

// ── Tab bar container ─────────────────────────────────────────────────────────

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { items: compareItems } = useCompare();
  const { incomingCall } = useCall();

  const visibleRoutes = state.routes.filter(r => TAB_ICONS[r.name]);

  return (
    <View
      style={[s.container, { bottom: insets.bottom + 12 }]}
      pointerEvents="box-none"
    >
      <View style={s.shadowWrap}>
        <View style={s.pill}>

          {/* Background — blur on iOS, opaque on Android */}
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={90}
              tint="systemChromeMaterial"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, s.androidFill]} />
          )}

          {/* Hair-line border */}
          <View style={s.innerBorder} pointerEvents="none" />

          {/* Tab items */}
          {visibleRoutes.map((route) => {
            const focused = state.index === state.routes.indexOf(route);
            return (
              <TabItem
                key={route.key}
                routeName={route.name}
                focused={focused}
                compareBadge={
                  (route.name === "compare" && !focused ? compareItems.length : 0) +
                  (route.name === "calls" && !focused && incomingCall ? 1 : 0)
                }
                onPress={() => {
                  Haptics.selectionAsync();
                  if (!focused) navigation.navigate(route.name);
                }}
                onLongPress={() =>
                  navigation.emit({ type: "tabLongPress", target: route.key })
                }
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ── Container styles ──────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
  },
  shadowWrap: {
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    height: PILL_H,
    borderRadius: 999,
    overflow: "hidden",
  },
  androidFill: {
    backgroundColor: colors.surface,
    borderRadius: 999,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.6)",
  },
});
