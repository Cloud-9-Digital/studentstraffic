import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";

import { colors } from "../theme/tokens";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index:        { active: "home",          inactive: "home-outline" },
  search:       { active: "search",        inactive: "search-outline" },
  shortlists:   { active: "bookmark",      inactive: "bookmark-outline" },
  applications: { active: "document-text", inactive: "document-text-outline" },
  profile:      { active: "person",        inactive: "person-outline" },
};

const TAB_LABELS: Record<string, string> = {
  index:        "Home",
  search:       "Search",
  shortlists:   "Saved",
  applications: "Apply",
  profile:      "Profile",
};

export const FLOATING_TAB_INSET = 88;

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[s.container, { bottom: insets.bottom + 10 }]}
      pointerEvents="box-none"
    >
      {/* Shadow wrapper — separate from overflow:hidden so shadow is visible */}
      <View style={s.shadowWrap}>
        {/* Pill clip wrapper */}
        <View style={s.pill}>
          {/* Frosted glass fill */}
          <BlurView
            intensity={78}
            tint="systemMaterial"
            style={StyleSheet.absoluteFill}
          />
          {/* Subtle inner border */}
          <View style={s.innerBorder} pointerEvents="none" />

          {/* Tab items */}
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const icons = TAB_ICONS[route.name];
            const label = TAB_LABELS[route.name] ?? route.name;

            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  Haptics.selectionAsync();
                  if (!focused) navigation.navigate(route.name);
                }}
                onLongPress={() => navigation.emit({ type: "tabLongPress", target: route.key })}
                style={s.item}
              >
                {/* Active blob — the circular indicator */}
                {focused && (
                  <View style={s.blobOuter}>
                    <BlurView
                      intensity={60}
                      tint="systemThinMaterial"
                      style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                    />
                    <View style={s.blobInner} />
                  </View>
                )}

                <Ionicons
                  name={focused ? icons?.active : icons?.inactive}
                  size={focused ? 23 : 22}
                  color={focused ? colors.primary : colors.faint}
                />
                <Text style={[s.label, focused && s.labelActive]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const PILL_H = 64;

const s = StyleSheet.create({
  container: {
    position: "absolute",
    left: 14,
    right: 14,
  },
  shadowWrap: {
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    height: PILL_H,
    borderRadius: 999,
    overflow: "hidden",
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.55)",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: PILL_H,
    gap: 3,
  },

  // Active circular indicator
  blobOuter: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  blobInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 27,
    backgroundColor: colors.primarySoft,
    opacity: 0.7,
  },

  label: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 10,
    color: colors.faint,
  },
  labelActive: {
    color: colors.primary,
  },
});
