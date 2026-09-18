import { GuideApplicationLink } from "../../src/features/guides/GuideApplicationLink";
import { PageHeader } from "../../src/components/PageHeader";
import { Alert, ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { colors } from "../../src/theme/tokens";

function initials(name: string) { return name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase(); }
function timeLabel(value: string | null) { if (!value) return ""; const date = new Date(value); return Number.isNaN(date.valueOf()) ? "" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" }); }

export default function ConnectScreen() {
  const router = useRouter();
  const client = useQueryClient();
  const [role, setRole] = useState<"student" | "guide">("student");
  const { data, isLoading, error, isRefetching, refetch } = useQuery({ queryKey: ["conversations", role], queryFn: () => mobileClient.getConversations(role), staleTime: 15_000 });
  const [actionError, setActionError] = useState("");
  const [responding, setResponding] = useState<number | null>(null);
  const requests = useQuery({ queryKey: ["callBookings", "guide"], queryFn: () => mobileClient.getCallBookings("guide"), enabled: role === "guide", staleTime: 15_000 });
  const pendingRequests = (requests.data ?? []).filter(booking => booking.canRespond && booking.bookingStatus === "pending");
  async function respond(bookingId: number, operation: "accept" | "decline") {
    if (responding !== null) return;
    setResponding(bookingId); setActionError("");
    try {
      await mobileClient.respondToGuideRequest(bookingId, operation);
      await Promise.all([client.invalidateQueries({ queryKey: ["callBookings"] }), client.invalidateQueries({ queryKey: ["conversations"] }), client.invalidateQueries({ queryKey: ["studentGuides"] })]);
    } catch (cause) { setActionError(cause instanceof Error ? cause.message : "Couldn’t update this request."); }
    finally { setResponding(null); }
  }
  const conversations = data?.conversations ?? [];
  const starters = (data?.starters ?? []).filter((starter) => !starter.conversationId);

  async function open(peerId: number, bookingId?: number) {
    Haptics.selectionAsync();
    try {
    const result = await mobileClient.openConversation(peerId, role, bookingId);
    await client.invalidateQueries({ queryKey: ["conversations"] });
    router.push({ pathname: "/chat/[id]", params: { id: String(result.conversationId), role } });
    } catch (cause) { setActionError(cause instanceof Error ? cause.message : "Couldn’t open the conversation."); }
  }

  return <View style={s.root}>
    <SafeAreaView edges={["top"]} style={s.safe}>
      <PageHeader title="Connect" subtitle="A little guidance for your next big step." />
    </SafeAreaView>
    {data?.capabilities.guide ? <View style={s.roleTabs}>{(["student", "guide"] as const).map(value => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: role === value }} onPress={() => { setRole(value); setActionError(""); }} style={[s.roleTab, role === value && s.roleActive]}><Text style={[s.roleLabel, role === value && s.roleSelected]}>{value === "student" ? "Get guidance" : "Guide students"}</Text></Pressable>)}</View> : null}
    {role === "student" ? <View style={s.actions}>
      <Pressable accessibilityRole="button" onPress={() => router.push("/student-guides")} style={s.actionCard}><View style={s.actionTop}><Ionicons name="people-outline" size={22} color={colors.primary} /><Ionicons name="arrow-forward" size={16} color={colors.primary} /></View><Text style={s.actionTitle}>Student guides</Text><Text style={s.actionDetail}>Find someone who’s been there</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => router.push("/counselling")} style={[s.actionCard, s.expertCard]}><View style={s.actionTop}><Ionicons name="compass-outline" size={22} color={colors.accent} /><Ionicons name="arrow-forward" size={16} color={colors.accent} /></View><Text style={s.actionTitle}>Expert advice</Text><Text style={s.actionDetail}>Plan your next step together</Text></Pressable>
    </View> : null}
    <View style={s.inboxHeading}><Text accessibilityRole="header" style={s.inboxTitle}>Messages</Text><Ionicons name="chatbubble-ellipses-outline" size={19} color={colors.muted} /></View>
    {actionError ? <Text accessibilityLiveRegion="polite" style={{ color: colors.accentStrong, paddingHorizontal: 20, paddingBottom: 10, fontFamily: "PlusJakartaSans-Regular" }}>{actionError}</Text> : null}
    {isLoading ? <View style={s.center}><ActivityIndicator color={colors.primary} /></View> : error ? <View style={s.empty}><View style={s.emptyIcon}><Ionicons name="cloud-offline-outline" size={34} color={colors.primary} /></View><Text style={s.emptyTitle}>Couldn’t load Connect</Text><Text style={s.emptySub}>{error instanceof Error ? error.message : "Please try again."}</Text><Pressable onPress={() => refetch()} style={s.retry}><Text style={s.retryText}>Try again</Text></Pressable></View> : <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: 24 }]} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}>
      {role === "student" ? <GuideApplicationLink /> : null}
      {role === "guide" && requests.isError ? <Pressable onPress={() => requests.refetch()} style={s.retry}><Text style={s.retryText}>Couldn’t load requests · Retry</Text></Pressable> : null}
      {role === "guide" && pendingRequests.length > 0 ? <><Text style={s.section}>NEW REQUESTS</Text>{pendingRequests.map(booking => <View key={booking.bookingId} style={{ paddingVertical: 16, borderBottomWidth: 1, borderColor: colors.line }}><Text style={s.name}>{booking.fullName}</Text>{booking.requestMessage ? <Text style={[s.preview, { color: colors.muted, lineHeight: 20, marginTop: 8 }]}>{booking.requestMessage}</Text> : null}<View style={{ flexDirection: "row", gap: 14 }}><Pressable accessibilityRole="button" disabled={responding !== null} onPress={() => respond(booking.bookingId, "accept")} style={[s.retry, responding !== null && { opacity: 0.5 }]}><Text style={s.retryText}>{responding === booking.bookingId ? "Updating…" : "Accept"}</Text></Pressable><Pressable accessibilityRole="button" disabled={responding !== null} onPress={() => Alert.alert("Decline this request?", "The student will have to wait seven days before requesting again.", [{ text: "Keep request", style: "cancel" }, { text: "Decline", style: "destructive", onPress: () => respond(booking.bookingId, "decline") }])} style={s.retry}><Text style={s.retryText}>Decline</Text></Pressable></View></View>)}</> : null}
      {conversations.length === 0 && starters.length === 0 && pendingRequests.length === 0 ? <View style={s.empty}><View style={s.emptyIcon}><Ionicons name="chatbubbles-outline" size={34} color={colors.primary} /></View><Text style={s.emptyTitle}>No conversations yet</Text><Text style={s.emptySub}>{role === "guide" ? "Student conversations will appear here." : "When you connect with a student guide, your messages will appear here."}</Text></View> : null}
      {conversations.map((conversation) => <Pressable key={conversation.id} onPress={() => router.push({ pathname: "/chat/[id]", params: { id: String(conversation.id), role } })} style={({ pressed }) => [s.row, pressed && s.pressed]}><View style={s.avatar}><Text style={s.avatarText}>{initials(conversation.displayName)}</Text></View><View style={s.copy}><View style={s.nameRow}><Text style={s.name}>{conversation.displayName}</Text><Text style={s.time}>{timeLabel(conversation.lastMessageAt)}</Text></View><Text style={s.university} numberOfLines={1}>{conversation.universityName}</Text><Text style={s.preview} numberOfLines={1}>{conversation.lastMessageText ?? "Start the conversation"}</Text></View>{conversation.unreadCount > 0 ? <View style={s.unread}><Text style={s.unreadText}>{conversation.unreadCount}</Text></View> : null}</Pressable>)}
      {starters.length > 0 ? <><Text style={s.section}>{role === "guide" ? "STUDENTS" : "YOUR GUIDES"}</Text>{starters.map((starter) => <Pressable key={`${starter.peerId}-${starter.bookingId ?? ""}`} onPress={() => open(starter.peerId, starter.bookingId)} style={({ pressed }) => [s.row, pressed && s.pressed]}><View style={s.avatar}><Text style={s.avatarText}>{initials(starter.peerName)}</Text></View><View style={s.copy}><Text style={s.name}>{starter.peerName}</Text><Text style={s.university} numberOfLines={1}>{starter.universityName}</Text><Text style={s.preview}>Tap to start a message</Text></View><Ionicons name="chevron-forward" size={18} color={colors.faint} /></Pressable>)}</> : null}
    </ScrollView>}
  </View>;
}

const s = StyleSheet.create({
  roleTabs: { flexDirection: "row", marginHorizontal: 20, marginBottom: 20, padding: 4, backgroundColor: colors.background, borderRadius: 12 },
  roleTab: { flex: 1, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  roleActive: { backgroundColor: colors.primary },
  roleLabel: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.muted },
  roleSelected: { color: "#fff" },
  actions: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 28 },
  actionCard: { flex: 1, backgroundColor: colors.primarySoft, borderRadius: 16, padding: 16 },
  expertCard: { backgroundColor: colors.coralSoft },
  actionTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  actionTitle: { fontFamily: "Fraunces-Medium", fontSize: 18, lineHeight: 24, color: colors.ink },
  actionDetail: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 17, color: colors.muted, marginTop: 5 },
  inboxHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 10 },
  inboxTitle: { fontFamily: "Fraunces-Medium", fontSize: 22, color: colors.ink },
 findGuides: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 44, paddingHorizontal: 12, marginLeft: 10, borderRadius: 12, backgroundColor: colors.primarySoft }, findGuidesText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.primary }, root: { flex: 1, backgroundColor: colors.surface }, safe: { backgroundColor: colors.surface, zIndex: 2 }, header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, title: { fontFamily: "Fraunces-SemiBold", fontSize: 30, letterSpacing: -0.5, color: colors.ink }, subtitle: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted, marginTop: 3 }, roleWrap: { position: "relative" }, roleButton: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.primarySoft }, roleText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, color: colors.primary }, roleMenu: { position: "absolute", top: 42, right: 0, width: 146, paddingVertical: 5, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 12, elevation: 5 }, roleOption: { paddingHorizontal: 12, paddingVertical: 10 }, roleOptionText: { fontFamily: "PlusJakartaSans-Medium", fontSize: 12, color: colors.ink }, center: { flex: 1, alignItems: "center", justifyContent: "center" }, scroll: { paddingHorizontal: 20 }, row: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, pressed: { opacity: 0.7 }, avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }, avatarText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 15, color: colors.primary }, copy: { flex: 1, minWidth: 0 }, nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }, name: { flex: 1, fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: colors.ink }, time: { fontFamily: "PlusJakartaSans-Regular", fontSize: 10, color: colors.faint }, university: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.muted, marginTop: 2 }, preview: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.faint, marginTop: 3 }, unread: { minWidth: 19, height: 19, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary }, unreadText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, color: "#fff" }, section: { marginTop: 24, marginBottom: 4, fontFamily: "PlusJakartaSans-Bold", fontSize: 11, letterSpacing: 0.8, color: colors.faint }, empty: { alignItems: "center", paddingTop: 90, paddingHorizontal: 30 }, emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }, emptyTitle: { fontFamily: "Fraunces-SemiBold", fontSize: 24, color: colors.ink, marginTop: 18 }, emptySub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 20, textAlign: "center", color: colors.muted, marginTop: 8 }, retry: { marginTop: 18, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.primary }, retryText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: "#fff" } });
