import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCall } from "../context/CallContext";
import { colors } from "../theme/tokens";

type Icon = keyof typeof Ionicons.glyphMap;
export const FLOATING_TAB_INSET = 64;
export const MAIN_TABS: { name: string; label: string; icon: Icon; activeIcon: Icon }[] = [
  { name: "index", label: "Home", icon: "home-outline", activeIcon: "home" },
  { name: "explore", label: "Explore", icon: "compass-outline", activeIcon: "compass" },
  { name: "plan", label: "My plan", icon: "bookmark-outline", activeIcon: "bookmark" },
  { name: "calls", label: "Connect", icon: "chatbubbles-outline", activeIcon: "chatbubbles" },
  { name: "profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
];
const PARENT_TAB: Record<string, string> = { search: "explore", shortlists: "plan", compare: "plan", applications: "plan" };

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { incomingCall } = useCall();
  const activeRoute = state.routes[state.index]?.name;
  const activeTab = PARENT_TAB[activeRoute] ?? activeRoute;
  return <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 8), paddingLeft: insets.left, paddingRight: insets.right }]}>
    {MAIN_TABS.map(tab => {
      const route = state.routes.find(r => r.name === tab.name);
      if (!route) return null;
      const selected = activeTab === tab.name;
      return <Pressable key={tab.name} accessibilityRole="tab" accessibilityLabel={tab.label} accessibilityState={{ selected }} onPress={() => { const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true }); if (activeRoute !== tab.name && !event.defaultPrevented) navigation.navigate(route.name); }} onLongPress={() => navigation.emit({ type: "tabLongPress", target: route.key })} style={s.tab}>
        <View style={s.icon}><Ionicons name={selected ? tab.activeIcon : tab.icon} size={22} color={selected ? colors.primary : colors.muted} />{tab.name === "calls" && incomingCall ? <View style={s.dot} /> : null}</View>
        <Text style={[s.label, selected && s.activeLabel]}>{tab.label}</Text>
      </Pressable>;
    })}
  </View>;
}
const s = StyleSheet.create({ bar: { flexDirection: "row", backgroundColor: "#fff", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingTop: 7 }, tab: { flex: 1, minHeight: 54, alignItems: "center", justifyContent: "center", gap: 4 }, icon: { width: 46, height: 28, borderRadius: 11, alignItems: "center", justifyContent: "center" }, label: { fontFamily: "PlusJakartaSans-Medium", fontSize: 10, lineHeight: 15, color: colors.muted }, activeLabel: { fontFamily: "PlusJakartaSans-Bold", color: colors.primary }, dot: { position: "absolute", right: 7, top: 1, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent } });
