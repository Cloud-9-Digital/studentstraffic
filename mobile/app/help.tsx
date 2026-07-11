import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { colors } from "../src/theme/tokens";

const WHATSAPP_URL = "https://wa.me/919176162888?text=Hi%2C+I+need+help+with+Students+Traffic.";

type Topic = {
  category: string;
  question: string;
  answer: string;
};

const TOPICS: Topic[] = [
  { category: "Getting started", question: "How do I find the right study option?", answer: "Use Search to explore countries, universities and programs. Save options to your shortlist, then use Compare to review them side by side." },
  { category: "Getting started", question: "How do I save or compare options?", answer: "Tap the save icon on a university or program. Your saved options appear in Shortlists, where you can compare the details that matter to you." },
  { category: "Applications", question: "How do I track my application?", answer: "Open Applications to see each application and its current status. Keep your contact details current so the team can reach you if anything is needed." },
  { category: "Student guides", question: "How do student guides work?", answer: "Student guides are approved students who can share their experience. You can message or call a guide after an eligible connection is available." },
  { category: "Calls & messages", question: "Why did I miss a call or message notification?", answer: "Check that Students Traffic notifications are allowed in your phone settings and that Do Not Disturb is not silencing call alerts. Missed and completed calls are recorded inside the chat." },
  { category: "Calls & messages", question: "How do I contact a guide?", answer: "Open Connect, select the relevant conversation, then use the message field or call button at the top of the chat." },
  { category: "Account", question: "How do I reset my password?", answer: "On the sign-in screen, select Forgot password and enter your email address. We will send a secure reset link to that inbox." },
  { category: "Account", question: "How is my information used?", answer: "Your details help us personalise your experience and support applications. Review the Privacy Policy on our website for the full explanation." },
];

function FaqRow({ item, open, onPress }: { item: Topic; open: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.faqRow, pressed && s.pressed]}>
      <View style={s.faqQuestion}><Text style={s.question}>{item.question}</Text><Ionicons name={open ? "remove" : "add"} size={19} color={colors.primary} /></View>
      {open && <Text style={s.answer}>{item.answer}</Text>}
    </Pressable>
  );
}

export default function HelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const topics = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return TOPICS;
    return TOPICS.filter((item) => `${item.category} ${item.question} ${item.answer}`.toLowerCase().includes(normalized));
  }, [query]);
  const categories = [...new Set(topics.map((item) => item.category))];

  function openCounselling() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/counselling");
  }

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={s.back}><Ionicons name="chevron-back" size={22} color={colors.ink} /></Pressable>
        <Text style={s.headerTitle}>Help & FAQ</Text>
        <View style={s.back} />
      </View>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.heroIcon}><Ionicons name="help-circle" size={28} color={colors.primary} /></View>
          <Text style={s.title}>How can we help?</Text>
          <Text style={s.intro}>Quick answers for planning, applications, guides, and your account.</Text>
        </View>

        <View style={s.search}><Ionicons name="search" size={18} color={colors.faint} /><TextInput value={query} onChangeText={setQuery} placeholder="Search help topics" placeholderTextColor={colors.faint} style={s.input} returnKeyType="search" /></View>

        {categories.length ? categories.map((category) => (
          <View key={category} style={s.section}>
            <Text style={s.category}>{category}</Text>
            <View style={s.card}>{topics.filter((item) => item.category === category).map((item) => <FaqRow key={item.question} item={item} open={openQuestion === item.question} onPress={() => { Haptics.selectionAsync(); setOpenQuestion((current) => current === item.question ? null : item.question); }} />)}</View>
          </View>
        )) : <View style={s.empty}><Ionicons name="search-outline" size={28} color={colors.faint} /><Text style={s.emptyTitle}>No matching answer</Text><Text style={s.emptyText}>Try a different search or contact our team below.</Text></View>}

        <View style={s.supportCard}>
          <Ionicons name="chatbubble-ellipses-outline" size={23} color={colors.coral} />
          <View style={s.supportCopy}><Text style={s.supportTitle}>Still need help?</Text><Text style={s.supportText}>Our counsellors can guide you through the next step.</Text></View>
          <Pressable onPress={openCounselling} style={s.supportButton}><Text style={s.supportButtonText}>Talk to a counsellor</Text></Pressable>
        </View>
        <Pressable onPress={() => Linking.openURL(WHATSAPP_URL)} style={({ pressed }) => [s.whatsapp, pressed && s.pressed]}><Ionicons name="logo-whatsapp" size={18} color="#16794c" /><Text style={s.whatsappText}>Chat on WhatsApp</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, header: { height: 58, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, back: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" }, headerTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 16, color: colors.ink }, content: { padding: 20 }, hero: { alignItems: "center", paddingTop: 8, paddingBottom: 24 }, heroIcon: { width: 60, height: 60, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft, marginBottom: 13 }, title: { fontFamily: "Fraunces-SemiBold", fontSize: 27, color: colors.ink }, intro: { marginTop: 7, textAlign: "center", fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 20, color: colors.muted }, search: { flexDirection: "row", alignItems: "center", gap: 9, minHeight: 48, paddingHorizontal: 14, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, input: { flex: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink, paddingVertical: 10 }, section: { marginTop: 24 }, category: { marginBottom: 9, fontFamily: "PlusJakartaSans-Bold", fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: colors.muted }, card: { overflow: "hidden", borderRadius: 17, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface }, faqRow: { paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, faqQuestion: { flexDirection: "row", alignItems: "center", gap: 12 }, question: { flex: 1, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, lineHeight: 19, color: colors.ink }, answer: { marginTop: 10, paddingRight: 24, fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 20, color: colors.muted }, supportCard: { marginTop: 28, flexDirection: "row", alignItems: "center", gap: 11, borderRadius: 17, padding: 15, backgroundColor: colors.coralSoft }, supportCopy: { flex: 1 }, supportTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: colors.ink }, supportText: { marginTop: 3, fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 16, color: colors.muted }, supportButton: { borderRadius: 10, backgroundColor: colors.coral, paddingHorizontal: 10, paddingVertical: 8 }, supportButtonText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 11, color: "#fff" }, whatsapp: { marginTop: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7, minHeight: 48, borderRadius: 15, borderWidth: 1, borderColor: "#b9e7cb", backgroundColor: "#f1fcf5" }, whatsappText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: "#16794c" }, empty: { alignItems: "center", paddingVertical: 44 }, emptyTitle: { marginTop: 11, fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: colors.ink }, emptyText: { marginTop: 5, fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted }, pressed: { opacity: 0.72 },
});
