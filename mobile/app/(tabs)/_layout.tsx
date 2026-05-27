import { Tabs } from "expo-router";

import { FloatingTabBar } from "../../src/components/FloatingTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index"        options={{ title: "Home" }} />
      <Tabs.Screen name="search"       options={{ title: "Search" }} />
      <Tabs.Screen name="compare"      options={{ title: "Compare" }} />
      <Tabs.Screen name="shortlists"   options={{ title: "Saved" }} />
      <Tabs.Screen name="calls"        options={{ title: "Calls" }} />
      <Tabs.Screen name="applications" options={{ href: null }} />
      <Tabs.Screen name="profile"      options={{ title: "Profile" }} />
    </Tabs>
  );
}
