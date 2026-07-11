import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { useCall } from "../../src/context/CallContext";
import type { GuideCallEvent, GuideMessage } from "../../src/types/domain";
import { colors } from "../../src/theme/tokens";

function messageTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function callSummary(call: GuideCallEvent) {
  if (call.answeredAt) {
    const seconds = call.durationSeconds;
    const duration = seconds == null ? null : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    return `${call.direction === "outgoing" ? "Outgoing" : "Incoming"} voice call${duration ? ` · ${duration}` : ""}`;
  }
  if (call.status === "expired" || call.status === "missed") return call.direction === "incoming" ? "Missed voice call" : "No answer";
  if (call.status === "ringing") return call.direction === "outgoing" ? "Calling…" : "Incoming voice call";
  return call.direction === "outgoing" ? "Outgoing call cancelled" : "Missed voice call";
}

export default function ChatScreen() {
  const router = useRouter(); const client = useQueryClient(); const insets = useSafeAreaInsets();
  const { id, role } = useLocalSearchParams<{ id: string; role?: "student" | "guide" }>();
  const conversationId = Number(id); const activeRole = role === "guide" ? "guide" : "student";
  const { startCall, isStarting } = useCall(); const scrollRef = useRef<ScrollView>(null);
  const [body, setBody] = useState(""); const [sending, setSending] = useState(false); const [optimistic, setOptimistic] = useState<GuideMessage[]>([]);
  const { data, isLoading, refetch } = useQuery({ queryKey: ["conversation", conversationId], queryFn: () => mobileClient.getConversation(conversationId), enabled: Number.isFinite(conversationId), refetchInterval: 2_500 });
  const { data: bookings = [] } = useQuery({ queryKey: ["call-bookings", activeRole], queryFn: () => mobileClient.getCallBookings(activeRole), staleTime: 30_000 });
  const booking = bookings.find((item) => item.peerId === data?.conversation.peerId && item.bookingStatus === "accepted");
  const messages = useMemo(() => [...(data?.messages ?? []), ...optimistic], [data?.messages, optimistic]);
  const timeline = useMemo(() => [
    ...messages.map((message) => ({ kind: "message" as const, createdAt: message.createdAt, message })),
    ...(data?.calls ?? []).map((call) => ({ kind: "call" as const, createdAt: call.createdAt, call })),
  ].sort((left, right) => (left.createdAt ? new Date(left.createdAt).valueOf() : 0) - (right.createdAt ? new Date(right.createdAt).valueOf() : 0)), [data?.calls, messages]);
  const scrollToLatest = (animated = false) => requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated }));

  const messageSignature = timeline.map((item) => item.kind === "message" ? item.message.id : item.call.id).join(",");
  useEffect(() => { setTimeout(() => scrollToLatest(false), 60); }, [messageSignature]);
  useEffect(() => { const subscription = Keyboard.addListener("keyboardDidShow", () => setTimeout(() => scrollToLatest(true), 80)); return () => subscription.remove(); }, []);

  async function send() {
    const text = body.trim(); if (!text || sending) return;
    const temporaryId = -Date.now(); const now = new Date().toISOString();
    setBody(""); setOptimistic((items) => [...items, { id: temporaryId, conversationId, senderUserId: "me", senderName: null, body: text, createdAt: now, isMine: true }]); scrollToLatest(true); setSending(true);
    try { await mobileClient.sendConversationMessage(conversationId, text); await refetch(); setOptimistic((items) => items.filter((item) => item.id !== temporaryId)); await client.invalidateQueries({ queryKey: ["conversations"] }); setTimeout(() => scrollToLatest(true), 100); }
    catch { setOptimistic((items) => items.filter((item) => item.id !== temporaryId)); setBody(text); }
    finally { setSending(false); }
  }

  return <View style={s.root}>
    <SafeAreaView edges={["top"]} style={s.safe}><View style={s.header}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={s.back}><Ionicons name="chevron-back" size={21} color={colors.ink} /></Pressable>
      <View style={s.headerCopy}><Text style={s.name} numberOfLines={1}>{data?.conversation.displayName ?? "Guide"}</Text><Text style={s.sub} numberOfLines={1}>{data?.conversation.universityName ?? ""}</Text></View>
      {booking ? <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); startCall(booking.bookingId, booking.fullName, booking.universityName); }} disabled={isStarting} style={s.call}><Ionicons name="call" size={18} color="#fff" /></Pressable> : <View style={s.callDisabled}><Ionicons name="call-outline" size={18} color={colors.faint} /></View>}
    </View></SafeAreaView>
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {isLoading ? <View style={s.center}><ActivityIndicator color={colors.primary} /></View> : <>
        <ScrollView ref={scrollRef} style={s.messageList} keyboardShouldPersistTaps="handled" onContentSizeChange={() => scrollToLatest(false)} contentContainerStyle={s.messages}>
          {timeline.map((item) => {
            if (item.kind === "call") return <View key={item.call.id} style={s.callEvent}><Ionicons name="call-outline" size={14} color={colors.primary} /><Text style={s.callEventText}>{callSummary(item.call)}</Text><Text style={s.callEventTime}>{messageTime(item.createdAt)}</Text></View>;
            const message = item.message; const readAt = data?.conversation.counterpartLastReadAt ? new Date(data.conversation.counterpartLastReadAt).valueOf() : 0; const isRead = message.isMine && message.createdAt ? readAt >= new Date(message.createdAt).valueOf() : false; const delivered = message.id > 0; return <View key={message.id} style={[s.bubble, message.isMine ? s.mine : s.theirs]}><Text style={[s.bubbleText, message.isMine && s.mineText]}>{message.body}</Text><View style={s.meta}><Text style={[s.time, message.isMine && s.mineMeta]}>{messageTime(message.createdAt)}</Text>{message.isMine ? <Ionicons name={delivered ? "checkmark-done" : "checkmark"} size={14} color={isRead ? "#8DE2FF" : "rgba(255,255,255,0.72)"} /> : null}</View></View>;
          })}
        </ScrollView>
        <View style={[s.composer, { paddingBottom: Math.max(insets.bottom, 10) }]}><TextInput value={body} onChangeText={setBody} onFocus={() => setTimeout(() => scrollToLatest(true), 80)} placeholder="Message" placeholderTextColor={colors.faint} style={s.input} multiline /><Pressable onPress={send} disabled={!body.trim() || sending} style={[s.send, (!body.trim() || sending) && s.sendDisabled]}>{sending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}</Pressable></View>
      </>}
    </KeyboardAvoidingView>
  </View>;
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: "#EEF4F0" }, flex: { flex: 1 }, safe: { backgroundColor: colors.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, header: { height: 58, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 12 }, back: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft }, headerCopy: { flex: 1, minWidth: 0 }, name: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: colors.ink }, sub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.muted, marginTop: 2 }, call: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary }, callDisabled: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft }, center: { flex: 1, alignItems: "center", justifyContent: "center" }, messageList: { flex: 1 }, messages: { flexGrow: 1, justifyContent: "flex-end", paddingHorizontal: 16, paddingVertical: 18, gap: 8 }, callEvent: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 16, backgroundColor: "#E0EEE8", paddingHorizontal: 10, paddingVertical: 6, marginVertical: 5 }, callEventText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, color: colors.primary }, callEventTime: { fontFamily: "PlusJakartaSans-Regular", fontSize: 10, color: colors.muted }, bubble: { maxWidth: "82%", paddingHorizontal: 13, paddingVertical: 9, borderRadius: 16 }, mine: { alignSelf: "flex-end", backgroundColor: colors.primary, borderBottomRightRadius: 4 }, theirs: { alignSelf: "flex-start", backgroundColor: colors.surface, borderBottomLeftRadius: 4 }, bubbleText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, lineHeight: 20, color: colors.ink }, mineText: { color: "#fff" }, meta: { flexDirection: "row", alignSelf: "flex-end", alignItems: "center", gap: 3, marginTop: 3 }, time: { fontFamily: "PlusJakartaSans-Regular", fontSize: 9, color: colors.faint }, mineMeta: { color: "rgba(255,255,255,0.72)" }, composer: { flexDirection: "row", alignItems: "flex-end", gap: 9, paddingHorizontal: 12, paddingTop: 10, backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }, input: { flex: 1, minHeight: 44, maxHeight: 108, borderRadius: 18, backgroundColor: "#F2F5F3", fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink, paddingHorizontal: 14, paddingVertical: 11, textAlignVertical: "center" }, send: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary }, sendDisabled: { opacity: 0.42 } });
