import { useReducedMotion } from "../../src/hooks/useReducedMotion";
import { Tabs, useSegments } from "expo-router";
import { View } from "react-native";

import { FloatingTabBar } from "../../src/components/FloatingTabBar";
import { MiraLauncher } from "../../src/features/mira/MiraLauncher";

// Mira's launcher shows on the browsing tabs. Connect has its own chats and
// Profile is account settings, so she stays out of the way there.
const MIRA_TABS = new Set(["index", "explore", "plan", "search", "shortlists"]);

export default function TabsLayout() {
  const reducedMotion = useReducedMotion();
  const segments = useSegments();
  const activeTab = (segments as string[])[1] ?? "index";
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        backBehavior="history"
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: reducedMotion ? "none" : "fade",
          transitionSpec: { animation: "timing", config: { duration: 180 } },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="explore" options={{ title: "Explore" }} />
        <Tabs.Screen name="plan" options={{ title: "My plan" }} />
        <Tabs.Screen name="calls" options={{ title: "Connect" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="search" options={{ href: null }} />
        <Tabs.Screen name="compare" options={{ href: null }} />
        <Tabs.Screen name="shortlists" options={{ href: null }} />
        <Tabs.Screen name="applications" options={{ href: null }} />
      </Tabs>
      {MIRA_TABS.has(activeTab) ? <MiraLauncher /> : null}
    </View>
  );
}
