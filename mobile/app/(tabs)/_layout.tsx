import { useReducedMotion } from "../../src/hooks/useReducedMotion";
import { Tabs } from "expo-router";

import { FloatingTabBar } from "../../src/components/FloatingTabBar";

export default function TabsLayout() {
  const reducedMotion = useReducedMotion();
  return (
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
  );
}
