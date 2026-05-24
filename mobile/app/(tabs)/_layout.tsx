import { Platform, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ColorValue } from "react-native";

import { colors } from "../../src/theme/tokens";
import { FloatingTabBar } from "../../src/components/FloatingTabBar";

type IconName = keyof typeof Ionicons.glyphMap;

const ANDROID_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index:        { active: "home",          inactive: "home-outline" },
  search:       { active: "search",        inactive: "search-outline" },
  shortlists:   { active: "bookmark",      inactive: "bookmark-outline" },
  applications: { active: "document-text", inactive: "document-text-outline" },
  profile:      { active: "person",        inactive: "person-outline" },
};

function androidTabIcon(name: string) {
  return ({ color, focused }: { color: ColorValue; focused: boolean; size: number }) => {
    const icons = ANDROID_ICONS[name];
    return (
      <Ionicons
        name={focused ? icons.active : icons.inactive}
        size={22}
        color={color as string}
      />
    );
  };
}

export default function TabsLayout() {
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      tabBar={isIOS ? (props) => <FloatingTabBar {...props} /> : undefined}
      screenOptions={{
        headerShown: false,
        // Android standard bottom nav
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: isIOS ? { display: "none" } : {
          backgroundColor: colors.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.line,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "PlusJakartaSans-SemiBold",
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: androidTabIcon("index") }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Search", tabBarIcon: androidTabIcon("search") }}
      />
      <Tabs.Screen
        name="shortlists"
        options={{ title: "Saved", tabBarIcon: androidTabIcon("shortlists") }}
      />
      <Tabs.Screen
        name="applications"
        options={{ title: "Apply", tabBarIcon: androidTabIcon("applications") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: androidTabIcon("profile") }}
      />
    </Tabs>
  );
}
