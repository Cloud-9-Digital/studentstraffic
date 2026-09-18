import { GuideFiltersSheet, EMPTY_GUIDE_FILTERS } from "../src/features/guides/GuideFiltersSheet";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mobileClient } from "../src/api/mobileClient";
import { colors } from "../src/theme/tokens";
import type { StudentGuide } from "../src/types/domain";

const statusLabel = { available: "Accepting requests", pending: "Request pending", accepted: "Connected", paused: "Requests paused", cooldown: "Request declined" };

function GuideIdentity({ guide, centered = false }: { guide: StudentGuide; centered?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <View style={[s.identity, centered && s.centeredIdentity]}>
    <View style={[s.avatar, centered && s.centeredAvatar]}>{guide.photoUrl && !failed ? <Image source={{ uri: guide.photoUrl }} style={s.photo} onError={() => setFailed(true)} /> : <Text style={s.initial}>{guide.fullName[0]?.toUpperCase()}</Text>}</View>
    <View style={centered ? s.centeredCopy : s.flex}><Text style={[s.name, centered && s.gridName]}>{guide.fullName}</Text><Text style={[s.university, centered && s.centerText]}>{guide.universityName}</Text>{guide.countryName ? <Text style={[s.caption, centered && s.centerText]}>{guide.countryName}</Text> : null}</View>
  </View>;
}

export default function StudentGuidesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ university?: string }>();
  const insets = useSafeAreaInsets();
  const { width, fontScale } = useWindowDimensions();
  const columns = width < 360 || fontScale > 1.3 ? 1 : 2;
  const cache = useQueryClient();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ ...EMPTY_GUIDE_FILTERS });
  useEffect(() => { if (params.university) { setFilters({ ...EMPTY_GUIDE_FILTERS, university: params.university }); setPage(1); } }, [params.university]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters = Object.values(filters).filter(Boolean).length;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<StudentGuide | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => { const timer = setTimeout(() => { setSearch(query.trim()); setPage(1); }, 300); return () => clearTimeout(timer); }, [query]);
  const guides = useQuery({ queryKey: ["studentGuides", search, page, filters], queryFn: () => mobileClient.getStudentGuides(search, page, filters), staleTime: 15_000 });

  function open(guide: StudentGuide) { setSelected(guide); setMessageError(""); setMessage(""); setError(""); setSent(false); }
  function close() { if (!busy) setSelected(null); }
  async function send() {
    if (!selected || busy) return;
    if (!message.trim()) { setMessageError("Add a question or introduction for your guide."); return; }
    setBusy(true); setError("");
    try {
      const result = await mobileClient.requestStudentGuide(selected.id, message.trim());
      setSent(true);
      setSelected({ ...selected, requestState: "pending" });
      if (result.alreadyBooked) setError("You already have a request or connection with this guide. Open your conversations to continue.");
      await Promise.all([cache.invalidateQueries({ queryKey: ["studentGuides"] }), cache.invalidateQueries({ queryKey: ["conversations"] }), cache.invalidateQueries({ queryKey: ["callBookings"] })]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Couldn’t send the request. Please try again."); }
    finally { setBusy(false); }
  }
  async function openConversation() {
    if (!selected || busy) return;
    setBusy(true); setError("");
    try { const result = await mobileClient.openConversation(selected.id); setSelected(null); router.push({ pathname: "/chat/[id]", params: { id: String(result.conversationId), role: "student" } }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Couldn’t open the conversation."); }
    finally { setBusy(false); }
  }

  return <SafeAreaView style={s.root} edges={["top"]}>
    <View style={s.header}><Pressable accessibilityLabel="Go back" accessibilityRole="button" style={s.iconButton} onPress={() => router.back()}><Ionicons name="chevron-back" size={23} color={colors.ink} /></Pressable><Text style={s.title}>Student guides</Text><Pressable accessibilityLabel="Open conversations" accessibilityRole="button" style={s.iconButton} onPress={() => router.push("/(tabs)/calls")}><Ionicons name="chatbubbles-outline" size={23} color={colors.primary} /></Pressable></View>
    <LinearGradient colors={[colors.primary, "#155e53"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.searchHeader}>
      <Text style={s.heroTitle}>Real students. Real answers.</Text>
      <Text style={s.heroCopy}>Get a closer look at university life from someone who’s living it.</Text>
      <View style={{ flexDirection: "row", gap: 9 }}><View style={[s.search, { flex: 1 }]}><Ionicons name="search-outline" size={20} color="#cbded8" /><TextInput accessibilityLabel="Search student guides by name, university, program or country" value={query} onChangeText={setQuery} placeholder="Name, university or country" placeholderTextColor="#cbded8" style={s.searchInput} autoCorrect={false} clearButtonMode="while-editing" /></View><Pressable accessibilityRole="button" accessibilityLabel={`Filter guides${activeFilters ? `, ${activeFilters} active` : ""}`} onPress={() => setFiltersOpen(true)} style={s.filterButton}><Ionicons name="options-outline" size={21} color="#fff" />{activeFilters ? <Text style={s.filterCount}>{activeFilters}</Text> : null}</Pressable></View>
    </LinearGradient>
    {activeFilters ? <View style={s.activeFilters}><Text style={s.caption}>{activeFilters} {activeFilters === 1 ? "filter" : "filters"} applied</Text><Pressable onPress={() => { setFilters({ ...EMPTY_GUIDE_FILTERS }); setPage(1); }} style={{ padding: 12 }}><Text style={s.link}>Clear all</Text></Pressable></View> : null}
    {guides.isLoading ? <ActivityIndicator style={s.empty} color={colors.primary} /> : guides.isError ? <View style={s.empty}><Text style={s.name}>Couldn’t load student guides</Text><Text style={s.body}>{guides.error.message}</Text><Pressable onPress={() => guides.refetch()} style={s.button}><Text style={s.buttonText}>Try again</Text></Pressable><Pressable onPress={() => router.push("/(auth)/login")} style={s.secondary}><Text style={s.link}>Sign in</Text></Pressable></View> : <FlatList key={columns} numColumns={columns} columnWrapperStyle={columns === 2 ? { gap: 12 } : undefined} data={guides.data?.guides ?? []} keyExtractor={g => String(g.id)} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: insets.bottom + 24 }} refreshing={guides.isRefetching} onRefresh={guides.refetch} keyboardShouldPersistTaps="handled" renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`View ${item.fullName}, ${item.universityName}`} onPress={() => open(item)} style={[s.card, { maxWidth: columns === 2 ? (width - 44) / 2 : undefined }]}>
      <View style={s.gridBody}><GuideIdentity guide={item} centered />
        <View style={s.tags}>{item.courseName ? <Text style={s.courseTag}>{item.courseName}</Text> : null}{item.currentYearOrBatch ? <Text style={s.yearTag}>{item.currentYearOrBatch}</Text> : null}</View>
        {item.languages.length ? <View style={s.tags}>{item.languages.map(language => <Text key={language} style={s.languageTag}>{language}</Text>)}</View> : null}
        <Text style={[s.status, s.centerText]}>{statusLabel[item.requestState]}</Text>
      </View>
      <View style={s.gridFooter}><View style={s.gridCta}><Text style={s.gridCtaText}>{item.requestState === "available" ? "Connect" : "View profile"}</Text><Ionicons name="arrow-forward" size={14} color="#fff" /></View></View>
    </Pressable>} ListEmptyComponent={<View style={s.empty}><Ionicons name="people-outline" size={35} color={colors.primary} /><Text style={s.name}>{search || activeFilters ? "No matching guides" : "No student guides listed yet"}</Text><Text style={s.body}>{search || activeFilters ? "Try another search or clear your filters." : "You can still ask our counsellors for help."}</Text>{!search && !activeFilters ? <Pressable onPress={() => router.push("/counselling")} style={s.button}><Text style={s.buttonText}>Talk to an expert</Text></Pressable> : null}</View>} ListFooterComponent={page > 1 || guides.data?.hasNextPage ? <View style={s.pagination}><Pressable disabled={page === 1} onPress={() => setPage(p => p - 1)} style={[s.secondary, page === 1 && s.disabled]}><Text style={s.link}>Previous</Text></Pressable><Text style={s.caption}>Page {page}</Text><Pressable disabled={!guides.data?.hasNextPage} onPress={() => setPage(p => p + 1)} style={[s.secondary, !guides.data?.hasNextPage && s.disabled]}><Text style={s.link}>Next</Text></Pressable></View> : null} />}
    {filtersOpen ? <GuideFiltersSheet initial={filters} options={guides.data?.options} onClose={() => setFiltersOpen(false)} onApply={next => { setFilters(next); setPage(1); setFiltersOpen(false); }} /> : null}
    <Modal visible={selected !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <SafeAreaView style={s.root} edges={["top", "bottom"]}><View style={s.header}><Text style={s.title}>Meet your guide</Text><Pressable accessibilityLabel="Close profile" accessibilityRole="button" disabled={busy} onPress={close} style={s.iconButton}><Ionicons name="close" size={23} color={colors.ink} /></Pressable></View>
        <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.profile}>
          {selected ? <><View style={s.profileIdentity}><GuideIdentity key={selected.id} guide={selected} centered /></View><Text style={s.course}>{[selected.courseName, selected.currentYearOrBatch].filter(Boolean).join(" · ")}</Text>{selected.languages.length ? <Text style={s.body}>Speaks {selected.languages.join(", ")}</Text> : null}<View style={s.notice}><Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} /><Text style={[s.body, s.flex]}>Keep conversations on Students Traffic. Do not share phone numbers, email addresses or social handles.</Text></View>
          {sent ? <Text accessibilityLiveRegion="polite" style={s.name}>Your request is in place</Text> : null}
          {selected.requestState === "available" ? <><Text style={s.name}>What would you like to ask?</Text><Text style={s.body}>Introduce yourself and share a question about studying here.</Text><TextInput accessibilityLabel="Your question for the student guide" value={message} onChangeText={v => { setMessage(v); setMessageError(""); }} placeholder="I’d like to know about…" placeholderTextColor={colors.muted} multiline maxLength={1000} style={[s.message, messageError && { borderColor: colors.accent, backgroundColor: colors.coralSoft }]} editable={!busy} />{messageError ? <Text accessibilityLiveRegion="polite" style={{ color: colors.accentStrong }}>{messageError}</Text> : null}<Text style={s.counter}>{message.length}/1,000</Text><Pressable accessibilityRole="button" disabled={busy} onPress={send} style={[s.button, busy && s.disabled]}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Send request</Text>}</Pressable></> : selected.requestState === "pending" || selected.requestState === "accepted" ? <><Text style={s.body}>{selected.requestState === "pending" ? "Your guide hasn’t accepted yet. You can message here; voice calls become available after acceptance." : "You’re connected. Continue your conversation in the app."}</Text><Pressable accessibilityRole="button" disabled={busy} onPress={openConversation} style={[s.button, busy && s.disabled]}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Open conversation</Text>}</Pressable></> : <Text style={s.body}>{selected.requestState === "paused" ? "This guide has paused new requests. Please choose another guide." : `You can request again${selected.retryAt ? ` after ${new Date(selected.retryAt).toLocaleDateString()}` : " later"}.`}</Text>}
          {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}</> : null}
        </ScrollView></KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  </SafeAreaView>;
}

const s = StyleSheet.create({ filterButton: { minWidth: 48, minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", backgroundColor: "rgba(255,255,255,0.10)" }, filterCount: { fontFamily: "PlusJakartaSans-Bold", fontSize: 11, color: "#fff" }, activeFilters: { paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.primarySoft },
  searchHeader: { padding: 20, paddingTop: 23, paddingBottom: 23 },
  heroTitle: { fontFamily: "Fraunces-SemiBold", fontSize: 25, lineHeight: 31, color: "#ffffff", marginBottom: 8 },
  heroCopy: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 19, color: "#d0e3dc", marginBottom: 18 },
  gridBody: { paddingHorizontal: 11, paddingTop: 15, paddingBottom: 12, gap: 8, flex: 1 },
  centeredIdentity: { flexDirection: "column", alignItems: "center", gap: 9 },
  centeredAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: "#f4d9cb" },
  centeredCopy: { width: "100%", gap: 2 },
  centerText: { textAlign: "center" },
  gridName: { fontSize: 16, lineHeight: 20, textAlign: "center" },
  tags: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 5 },
  courseTag: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 10, lineHeight: 16, color: colors.accent, backgroundColor: "#fff0e8", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  yearTag: { fontFamily: "PlusJakartaSans-Medium", fontSize: 10, lineHeight: 16, color: colors.muted, backgroundColor: "#f3f4f4", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  languageTag: { fontFamily: "PlusJakartaSans-Medium", fontSize: 10, lineHeight: 16, color: colors.primary, backgroundColor: colors.primarySoft, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  gridFooter: { borderTopWidth: 1, borderColor: colors.line, padding: 9 },
  gridCta: { minHeight: 44, borderRadius: 10, backgroundColor: colors.accent, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 5 },
  gridCtaText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, color: "#fff" },
  profileIdentity: { backgroundColor: "#f0f6f3", borderRadius: 18, padding: 24, marginBottom: 10 },
  root: { flex: 1, backgroundColor: "#fff" }, flex: { flex: 1 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, paddingHorizontal: 16, paddingVertical: 10 }, iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, title: { fontFamily: "Fraunces-SemiBold", fontSize: 25, color: colors.ink }, intro: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 21, color: colors.muted, paddingHorizontal: 22, marginBottom: 18 }, search: { paddingHorizontal: 13, minHeight: 48, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 12 }, searchInput: { flex: 1, fontFamily: "PlusJakartaSans-Regular", color: "#ffffff", fontSize: 12, paddingVertical: 13 }, card: { flex: 1, borderWidth: 1, borderColor: colors.line, backgroundColor: "#ffffff", borderRadius: 17, overflow: "hidden", marginBottom: 14 }, identity: { flexDirection: "row", gap: 13, alignItems: "center" }, avatar: { width: 60, height: 60, borderRadius: 20, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft }, photo: { width: "100%", height: "100%" }, initial: { fontFamily: "PlusJakartaSans-Bold", color: colors.primary, fontSize: 22 }, name: { fontFamily: "Fraunces-SemiBold", fontSize: 20, lineHeight: 26, color: colors.ink }, university: { fontFamily: "PlusJakartaSans-Medium", fontSize: 12, lineHeight: 18, color: colors.muted, marginTop: 3 }, caption: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.muted, marginTop: 3 }, course: { fontFamily: "PlusJakartaSans-Medium", fontSize: 12, lineHeight: 19, color: colors.ink, marginTop: 14, marginBottom: 8 }, cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, borderTopWidth: 1, borderColor: colors.line, paddingTop: 14, marginTop: 6 }, status: { fontFamily: "PlusJakartaSans-Medium", fontSize: 11, color: colors.primary }, muted: { color: colors.muted }, link: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.primary }, empty: { alignItems: "center", gap: 12, padding: 24, marginTop: 30 }, body: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 21, color: colors.muted }, button: { minHeight: 48, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, marginTop: 16 }, buttonText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: "#fff" }, disabled: { opacity: 0.45 }, secondary: { padding: 14 }, pagination: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, profile: { padding: 22, gap: 10, paddingBottom: 36 }, notice: { flexDirection: "row", gap: 10, backgroundColor: colors.primarySoft, padding: 14, borderRadius: 12, marginVertical: 12 }, message: { minHeight: 120, padding: 14, borderWidth: 1, borderColor: colors.line, borderRadius: 12, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink, textAlignVertical: "top" }, counter: { textAlign: "right", fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.muted }, error: { fontFamily: "PlusJakartaSans-Medium", fontSize: 12, lineHeight: 19, color: colors.accentStrong, marginTop: 12 },
});
