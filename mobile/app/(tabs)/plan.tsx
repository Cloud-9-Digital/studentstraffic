import { PageHeader } from "../../src/components/PageHeader";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { mobileClient } from "../../src/api/mobileClient";
import { useCompare } from "../../src/context/CompareContext";
import { colors } from "../../src/theme/tokens";

export default function PlanScreen() {
  const router = useRouter();
  const { items } = useCompare();
  const saved = useQuery({ queryKey: ["shortlists"], queryFn: () => mobileClient.getShortlists(), staleTime: 30_000, retry: false });
  const applications = useQuery({ queryKey: ["applications"], queryFn: () => mobileClient.getApplications(), staleTime: 30_000, retry: false });
  const cards = [
    { title: "Saved universities", detail: "Revisit the places you’re considering.", icon: "bookmark-outline" as const, count: saved.data?.length, path: "/(tabs)/shortlists" as const },
    { title: "Compare your choices", detail: "See selected universities side by side.", icon: "git-compare-outline" as const, count: items.length, path: "/(tabs)/compare" as const },
    { title: "Applications", detail: "Continue a draft or follow your progress.", icon: "documents-outline" as const, count: applications.data?.length, path: "/(tabs)/applications" as const },
  ];
  return <SafeAreaView edges={["top"]} style={s.root}><PageHeader title="My plan" subtitle="Your choices, from shortlist to your next step." /><ScrollView contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={saved.isRefetching || applications.isRefetching} onRefresh={() => { void saved.refetch(); void applications.refetch(); }} tintColor={colors.primary} />}>
    
    {saved.isError || applications.isError ? <View style={s.notice}><Text style={s.body}>Some account details couldn’t load. Pull down to retry, or sign in if your session has expired.</Text><Pressable onPress={() => router.push("/(auth)/login")} style={s.signIn}><Text style={s.link}>Sign in</Text></Pressable></View> : null}
    {cards.map(card => <Pressable key={card.title} accessibilityRole="button" onPress={() => router.push(card.path)} style={s.card}><View style={s.icon}><Ionicons name={card.icon} size={24} color={colors.primary} /></View><View style={s.flex}><Text style={s.heading}>{card.title}</Text><Text style={s.body}>{card.detail}</Text></View>{card.count != null ? <Text style={s.count}>{card.count}</Text> : null}<Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>)}
    <View style={s.help}><Text style={s.heading}>Not sure what comes next?</Text><Text style={s.body}>A counsellor can help you work through your options.</Text><Pressable accessibilityRole="button" onPress={() => router.push("/counselling")} style={s.button}><Text style={s.buttonText}>Talk to an expert</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable></View>
  </ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({ root: { flex: 1, backgroundColor: "#fff" }, content: { paddingHorizontal: 20, paddingBottom: 28 }, title: { fontFamily: "Fraunces-SemiBold", fontSize: 30, color: colors.ink }, intro: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 21, color: colors.muted, marginTop: 7, marginBottom: 26 }, card: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 22, borderBottomWidth: 1, borderColor: colors.line }, icon: { width: 46, height: 50, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft }, flex: { flex: 1 }, heading: { fontFamily: "Fraunces-Medium", fontSize: 20, lineHeight: 25, color: colors.ink, marginBottom: 5 }, body: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 19, color: colors.muted }, count: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 17, color: colors.primary }, help: { marginTop: 32, padding: 20, borderRadius: 17, backgroundColor: colors.primarySoft }, button: { marginTop: 16, backgroundColor: colors.primary, borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, buttonText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: "#fff" }, notice: { padding: 14, borderRadius: 12, backgroundColor: colors.primarySoft }, signIn: { paddingVertical: 12 }, link: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.primary } });
