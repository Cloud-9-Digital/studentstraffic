import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { mobileClient } from "../../src/api/mobileClient";
import { getToken } from "../../src/api/tokenStore";
import { colors } from "../../src/theme/tokens";

type Icon = keyof typeof Ionicons.glyphMap;
type Course = { slug: string; shortName: string };

const DESTINATION_IMAGES: Record<string, ReturnType<typeof require>> = {
  georgia: require("../../assets/georgia.jpg"),
  vietnam: require("../../assets/vietnam.jpg"),
  russia: require("../../assets/russia.jpg"),
  uzbekistan: require("../../assets/uzbekistan.jpg"),
  china: require("../../assets/china.jpg"),
  philippines: require("../../assets/philippines.jpg"),
};

function SectionHeading({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={s.sectionHeading}><Text style={s.sectionTitle}>{title}</Text>{action && onPress ? <Pressable accessibilityRole="button" onPress={onPress} style={s.sectionAction}><Text style={s.link}>{action}</Text><Ionicons name="arrow-forward" size={15} color={colors.primary} /></Pressable> : null}</View>;
}

function ExploreButton({ icon, title, onPress }: { icon: Icon; title: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.exploreButton, pressed && s.pressed]}><View style={s.exploreIcon}><Ionicons name={icon} size={23} color={title === "Programs" ? colors.accent : colors.primary} /></View><Text style={s.exploreTitle}>{title}</Text></Pressable>;
}

function GuidanceRow({ expert, onPress }: { expert?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.guidanceRow, expert && s.guidanceExpert, pressed && s.pressed]}>
    <LinearGradient colors={expert ? [colors.accent, colors.accentStrong] : [colors.primaryEnd, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /><View style={s.guidanceTop}><Ionicons name={expert ? "compass-outline" : "chatbubbles-outline"} size={25} color={expert ? "#ffe4d7" : "#c0e2d6"} /><Ionicons name="arrow-up-outline" size={20} color={expert ? "#ffe4d7" : "#c0e2d6"} style={s.diagonal} /></View>
    <Text style={[s.guidanceTitle, expert && s.expertText]}>{expert ? "Expert advice" : "Student guides"}</Text>
    <Text style={[s.guidanceDescription, expert && s.expertDescription]}>{expert ? "Advice from our counsellors." : "Campus life, first-hand."}</Text>
    <Text style={[s.guidanceAction, expert && s.expertText]}>{expert ? "Talk to an expert" : "Talk to a student"}</Text>
  </Pressable>;
}

function ProgramsPicker({ visible, courses, loading, failed, onRetry, onClose, onSelect }: { visible: boolean; courses: Course[]; loading: boolean; failed: boolean; onRetry: () => void; onClose: () => void; onSelect: (slug: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => courses.filter(c => `${c.shortName} ${c.slug.replaceAll("-", " ")}`.toLowerCase().includes(query.trim().toLowerCase())), [courses, query]);
  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={s.modal} edges={["top", "bottom"]}>
      <View style={s.modalHeader}><Text style={s.sectionTitle}>Find your program</Text><Pressable accessibilityLabel="Close programs" accessibilityRole="button" onPress={onClose} style={s.closeButton}><Ionicons name="close" size={23} color={colors.ink} /></Pressable></View>
      <Text style={s.modalIntro}>Choose a program to see universities offering it.</Text>
      <View style={s.inputWrap}><Ionicons name="search-outline" size={20} color={colors.muted} /><TextInput accessibilityLabel="Search programs" placeholder="Search programs" placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} style={s.input} autoCorrect={false} clearButtonMode="while-editing" /></View>
      {loading ? <ActivityIndicator style={s.loading} color={colors.primary} /> : failed ? <Pressable onPress={onRetry} style={s.emptyPanel}><Text style={s.description}>Couldn’t load programs.</Text><Text style={s.link}>Try again</Text></Pressable> : <FlatList data={filtered} keyExtractor={c => c.slug} keyboardShouldPersistTaps="handled" contentContainerStyle={s.programList} renderItem={({ item }) => <Pressable accessibilityRole="button" onPress={() => onSelect(item.slug)} style={({ pressed }) => [s.programRow, pressed && s.pressed]}><Ionicons name="school-outline" size={21} color={colors.primary} /><Text style={[s.exploreTitle, s.flex]}>{item.shortName}</Text><Ionicons name="arrow-forward" size={18} color={colors.muted} /></Pressable>} ListEmptyComponent={<Text style={s.emptyText}>No programs match. Try another search.</Text>} />}
    </SafeAreaView>
  </Modal>;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => { let active = true; getToken().then(t => { if (active) setHasToken(Boolean(t)); }).catch(() => { if (active) setHasToken(false); }); return () => { active = false; }; }, []);

  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: () => mobileClient.getDashboard(), enabled: hasToken === true, staleTime: 120_000 });
  const catalogue = useQuery({ queryKey: ["homeCatalogue"], queryFn: () => mobileClient.getUniversities({}, 1, 4), staleTime: 120_000 });
  const data = dashboard.data;
  const countries = catalogue.data?.options.countries ?? [];
  const photoCountries = Object.keys(DESTINATION_IMAGES).flatMap(slug => countries.filter(c => c.slug === slug));
  const courses = catalogue.data?.options.courses ?? [];
  const firstName = data?.profile.name?.trim().split(/\s+/)[0];
  const applicationCount = data?.applicationCount;
  const savedCount = data?.shortlistCount;
  const hasSaved = typeof savedCount === "number" && savedCount > 0;
  const hasApplications = typeof applicationCount === "number" && applicationCount > 0;
  const initial = firstName?.[0]?.toUpperCase() ?? "";

  function selectCourse(course: string) { setProgramsOpen(false); router.push({ pathname: "/(tabs)/search", params: { course, country: "", sort: "" } }); }
  async function refresh() { setRefreshing(true); try { await Promise.all([catalogue.refetch(), ...(hasToken ? [dashboard.refetch()] : [])]); } finally { setRefreshing(false); } }

  return <View style={s.root}>
    <SafeAreaView edges={["top"]} style={s.headerSafe}><View style={s.header}><Image source={require("../../assets/logo.png")} style={s.logo} resizeMode="contain" /><Pressable accessibilityRole="button" accessibilityLabel={hasToken ? "Open profile" : "Sign in"} onPress={() => router.push(hasToken ? "/(tabs)/profile" : "/(auth)/login")} style={s.avatar}>{initial ? <Text style={s.avatarText}>{initial}</Text> : <Ionicons name="person-outline" size={20} color={colors.primary} />}</Pressable></View></SafeAreaView>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.content, { paddingBottom: 24 }]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}>
      <View style={s.intro}><Text style={s.eyebrow}>Your next chapter starts here</Text><Text style={s.headline}>{firstName ? `Hi, ${firstName}.` : "Welcome to Students Traffic."}</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Search universities" onPress={() => router.push("/(tabs)/search")} style={s.search}><Ionicons name="search-outline" size={21} color={colors.primary} /><Text style={s.searchText}>Find your university</Text><View style={s.searchArrow}><Ionicons name="arrow-forward" size={18} color="#ffffff" /></View></Pressable>
      <View style={s.exploreGrid}><ExploreButton icon="school-outline" title="Programs" onPress={() => router.push({ pathname: "/(tabs)/explore", params: { mode: "programs" } })} /><ExploreButton icon="earth-outline" title="Countries" onPress={() => router.push({ pathname: "/(tabs)/explore", params: { mode: "countries" } })} /><ExploreButton icon="business-outline" title="Universities" onPress={() => router.push({ pathname: "/(tabs)/explore", params: { mode: "universities" } })} /></View>

      <View style={s.journey}>
        <View style={s.journeyHeading}><View style={s.stepMarker}><Ionicons name="footsteps-outline" size={19} color={colors.primary} /></View><Text style={s.journeyLabel}>YOUR NEXT STEP</Text></View>
        {hasToken === null || (hasToken && dashboard.isLoading) ? <ActivityIndicator color={colors.primary} style={s.loading} /> : !hasToken ? <><Text style={s.journeyTitle}>Save your study options.</Text><Text style={s.description}>Save universities and keep your applications in one place.</Text><Pressable accessibilityRole="button" style={s.journeyCta} onPress={() => router.push("/(auth)/login")}><Text style={s.link}>Sign in to get started</Text><Ionicons name="arrow-forward" size={17} color={colors.primary} /></Pressable></> : dashboard.isError ? <><Text style={s.journeyTitle}>Your progress couldn’t load.</Text><Pressable accessibilityRole="button" style={s.journeyCta} onPress={() => dashboard.refetch()}><Text style={s.link}>Try again</Text><Ionicons name="refresh" size={17} color={colors.primary} /></Pressable></> : <><Text style={s.journeyTitle}>{hasApplications ? "Let’s keep your application moving." : hasSaved ? "Your shortlist is taking shape." : "Let’s find your first university."}</Text><Text style={s.description}>{hasApplications ? data?.nextStep : hasSaved ? `You’ve saved ${savedCount} ${savedCount === 1 ? "university" : "universities"}. Review your choices or ask a student guide for a closer look at campus life.` : "Start with a program or country. Save the universities you’d like to come back to."}</Text><View style={s.journeyLinks}><Pressable accessibilityRole="button" onPress={() => router.push("/(tabs)/shortlists")} style={s.journeyCta}><Ionicons name="bookmark-outline" size={17} color={colors.primary} /><Text style={s.link}>Saved{data?.shortlistCount != null ? ` · ${data.shortlistCount}` : ""}</Text></Pressable><Pressable accessibilityRole="button" onPress={() => router.push("/(tabs)/applications")} style={s.journeyCta}><Ionicons name="documents-outline" size={17} color={colors.primary} /><Text style={s.link}>Applications{applicationCount != null ? ` · ${applicationCount}` : ""}</Text></Pressable></View></>}
      </View>

      <SectionHeading title="Get guidance" />
      <View style={s.guidance}><GuidanceRow onPress={() => router.push(hasToken ? "/student-guides" : "/(auth)/login")} /><GuidanceRow expert onPress={() => router.push("/counselling")} /></View>

      {catalogue.isLoading ? <ActivityIndicator style={s.loading} color={colors.primary} /> : catalogue.isError ? <Pressable accessibilityRole="button" onPress={() => catalogue.refetch()} style={s.emptyPanel}><Text style={s.description}>Study options couldn’t load.</Text><Text style={s.link}>Try again</Text></Pressable> : !courses.length ? <Text style={s.emptyText}>No programs are listed yet.</Text> : null}

      <SectionHeading title="Explore destinations" action="All countries" onPress={() => router.push("/countries")} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.countryRow}>{photoCountries.map(country => <Pressable accessibilityRole="button" key={country.slug} onPress={() => router.push({ pathname: "/country/[slug]", params: { slug: country.slug, name: country.name } })} style={({ pressed }) => [s.countryCard, pressed && s.pressed]}><Image source={DESTINATION_IMAGES[country.slug]} style={s.countryImage} resizeMode="cover" /><View style={s.countryCaption}><Text style={s.countryName}>{country.name}</Text><Ionicons name="arrow-forward" size={16} color={colors.primary} /></View></Pressable>)}</ScrollView>
      <Pressable accessibilityRole="button" onPress={() => router.push("/help")} style={s.help}><Ionicons name="help-circle-outline" size={19} color={colors.muted} /><Text style={s.description}>Need a hand? Visit help & support</Text><Ionicons name="arrow-forward" size={16} color={colors.muted} /></Pressable>
    </ScrollView>
    <ProgramsPicker visible={programsOpen} courses={courses} loading={catalogue.isLoading} failed={catalogue.isError} onRetry={() => catalogue.refetch()} onClose={() => setProgramsOpen(false)} onSelect={selectCourse} />
  </View>;
}

const s = StyleSheet.create({
  guidanceExpert: { backgroundColor: "#edf2ef" },
  guidanceTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  guidanceDescription: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 17, color: "#d0e1da" },
  expertDescription: { color: "#ffe4d7" },
  featuredDestination: { height: 190, borderRadius: 15, overflow: "hidden", marginBottom: 26, backgroundColor: colors.primary },
  destinationCaption: { flex: 1, justifyContent: "flex-end", padding: 20 },
  destinationEyebrow: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 9, color: "#edf3f0", letterSpacing: 1.4, marginBottom: 7 },
  destinationTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  destinationTitle: { fontFamily: "Fraunces-SemiBold", fontSize: 34, lineHeight: 40, color: "#ffffff" },
  destinationArrow: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.6)", alignItems: "center", justifyContent: "center" },
  countryImage: { width: "100%", height: 150 },
  countryCaption: { padding: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  root: { flex: 1, backgroundColor: "#ffffff" }, flex: { flex: 1 }, pressed: { opacity: 0.65 },
  headerSafe: { backgroundColor: "#ffffff" }, header: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, logo: { width: 135, height: 28 },
  avatar: { minWidth: 44, minHeight: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }, avatarText: { fontFamily: "PlusJakartaSans-Bold", color: colors.primary, fontSize: 17 },
  content: { paddingHorizontal: 22 }, intro: { paddingTop: 6, paddingBottom: 18 }, eyebrow: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, color: colors.muted, marginBottom: 7 }, headline: { fontFamily: "Fraunces-SemiBold", fontSize: 26, lineHeight: 33, letterSpacing: -0.6, color: colors.ink }, introText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 20, color: colors.muted, marginTop: 11 },
  search: { minHeight: 52, borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10, backgroundColor: "#f3f5f4" }, searchText: { flex: 1, fontFamily: "PlusJakartaSans-Medium", fontSize: 14, color: colors.muted }, searchArrow: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  exploreGrid: { flexDirection: "row", marginTop: 17, marginBottom: 22 }, exploreButton: { flex: 1, minHeight: 70, paddingVertical: 6, alignItems: "center", justifyContent: "center", gap: 9 }, exploreIcon: { alignItems: "center", justifyContent: "center" }, exploreTitle: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, lineHeight: 18, color: colors.ink },
  journey: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 18, marginBottom: 26 }, journeyHeading: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 8 }, stepMarker: { width: 26, height: 26, alignItems: "center", justifyContent: "center" }, journeyLabel: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, letterSpacing: 1.3, color: colors.primary }, journeyTitle: { fontFamily: "Fraunces-Medium", fontSize: 20, lineHeight: 26, color: colors.ink, marginBottom: 5 }, description: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 19, color: colors.muted }, journeyLinks: { flexDirection: "row", flexWrap: "wrap", columnGap: 20 }, journeyCta: { flexDirection: "row", alignItems: "center", gap: 7, minHeight: 44, marginTop: 4 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }, sectionTitle: { flexShrink: 1, fontFamily: "Fraunces-SemiBold", fontSize: 21, lineHeight: 27, letterSpacing: -0.2, color: colors.ink }, sectionAction: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 6 }, link: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.primary },
  guidance: { flexDirection: "row", gap: 12, marginBottom: 26 }, guidanceRow: { flex: 1, backgroundColor: colors.primary, borderRadius: 15, padding: 17, minHeight: 168, overflow: "hidden" }, guidanceIcon: { width: 46, height: 52, borderRadius: 15, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }, expertIcon: { backgroundColor: colors.coralSoft }, guidanceTitle: { fontFamily: "Fraunces-SemiBold", fontSize: 21, lineHeight: 26, color: "#ffffff", marginTop: 18, marginBottom: 8 }, guidanceAction: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, lineHeight: 17, color: "#daece5", marginTop: 13 }, expertText: { color: "#ffffff" }, divider: { height: 1, backgroundColor: colors.line, marginHorizontal: 16 },
  programChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }, chip: { minHeight: 44, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", gap: 9, maxWidth: "100%" }, chipText: { fontFamily: "PlusJakartaSans-Medium", fontSize: 12, color: colors.primary, flexShrink: 1 }, diagonal: { transform: [{ rotate: "45deg" }] },
  countryRow: { gap: 10, paddingBottom: 26 }, countryCard: { width: 176, borderRadius: 12, overflow: "hidden", backgroundColor: "#f5f6f5" }, countryName: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.ink }, universityList: { gap: 12 }, help: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 7, paddingVertical: 28 },
  modal: { flex: 1, backgroundColor: colors.background }, modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 22, paddingTop: 14 }, closeButton: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }, modalIntro: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 20, color: colors.muted, marginHorizontal: 22, marginBottom: 18 }, inputWrap: { marginHorizontal: 22, marginBottom: 16, paddingHorizontal: 14, minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", gap: 10 }, input: { flex: 1, paddingVertical: 14, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink }, programList: { paddingHorizontal: 22, paddingBottom: 24 }, programRow: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colors.line }, loading: { marginVertical: 20 }, emptyPanel: { padding: 18, gap: 10, marginBottom: 22 }, emptyText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 20, color: colors.muted, paddingVertical: 15 },
});
