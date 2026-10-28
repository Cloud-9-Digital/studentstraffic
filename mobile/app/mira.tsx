import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";

import { mobileClient } from "../src/api/mobileClient";
import { MiraMark } from "../src/features/mira/MiraMark";
import { MiraMessageView, MiraThinking } from "../src/features/mira/MiraMessageView";
import type { MiraContext } from "../src/features/mira/types";
import { MIRA_MAX_INPUT_CHARS, useMiraChat } from "../src/features/mira/useMiraChat";
import { colors } from "../src/theme/tokens";

// Ask Mira: the website's study-abroad assistant, in the app. Opened from the
// floating button on the main tabs, or from a university screen with that
// university as context (`university` + `universityName`). An optional `prompt`
// is sent straight away, as a CTA on the website can seed the dock.

const GENERAL_STARTERS = [
  "Where can I study medicine abroad on a budget?",
  "Compare MBBS in Georgia and Uzbekistan",
  "Which universities teach in English with a September intake?",
  "Can I talk to a student who studies abroad?",
];

function universityStarters(name: string) {
  return [
    `What does it cost to study at ${name}?`,
    `Which programmes does ${name} offer?`,
    `What are the hostel and food like at ${name}?`,
    `Can I talk to a student at ${name}?`,
  ];
}

export default function MiraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Edge-to-edge Android ignores adjustResize, so the keyboard has to be handled
  // here: pad the screen by the keyboard height and drop the gesture-bar inset
  // (the keyboard already covers it) while it is open.
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", () => setKeyboardOpen(true));
    const hide = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => setKeyboardOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const params = useLocalSearchParams<{ university?: string; universityName?: string; prompt?: string }>();
  const context = useMemo<MiraContext>(
    () => (params.university ? { universitySlug: params.university, universityName: params.universityName || "this university" } : null),
    [params.university, params.universityName]
  );
  const { messages, status, error, conversationId, send, stop, reset } = useMiraChat(context);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => mobileClient.getProfile(), staleTime: 2 * 60 * 1000 });
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const followRef = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const seededRef = useRef(false);

  const busy = status !== "ready";
  const firstName = profile?.name?.trim().split(/\s+/)[0];
  const starters = context ? universityStarters(context.universityName) : GENERAL_STARTERS;
  const last = messages[messages.length - 1];
  const awaitingFirstPart = busy && (last?.role === "user" || (last?.role === "assistant" && last.parts.length === 0));

  useEffect(() => {
    if (!params.prompt || seededRef.current) return;
    seededRef.current = true;
    send(params.prompt);
  }, [params.prompt, send]);

  function submit(text = draft) {
    if (!text.trim() || busy) return;
    Haptics.selectionAsync();
    followRef.current = true;
    setShowJump(false);
    setDraft("");
    send(text);
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    // Once the student scrolls up to read, the stream stops dragging them back.
    const following = contentSize.height - contentOffset.y - layoutMeasurement.height < 80;
    followRef.current = following;
    setShowJump(!following && messages.length > 0);
  }

  const greeting = context
    ? `${firstName ? `Hi ${firstName}, I'm Mira.` : "Hi, I'm Mira."} Ask me anything about ${context.universityName} — fees, programmes, hostel life, or how it compares.`
    : firstName
      ? `Hi ${firstName}, I'm Mira. Where would you like to pick up?`
      : "Hi, I'm Mira. Ask me anything about education — courses, exams, universities, or studying abroad.";

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <StatusBar style="light" />
      <LinearGradient colors={[colors.primary, colors.primaryEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.header}>
        <MiraMark size={24} onDark />
        <View style={s.headerCopy}>
          <Text style={s.headerTitle}>Mira</Text>
          <Text style={s.headerSub} numberOfLines={1}>{busy ? "Checking our catalogue…" : context ? context.universityName : "Study-abroad assistant"}</Text>
        </View>
        {messages.length ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Start a new conversation" hitSlop={8} onPress={() => { Haptics.selectionAsync(); reset(); }} style={s.headerBtn}>
            <Ionicons name="create-outline" size={20} color="#fff" />
          </Pressable>
        ) : null}
        <Pressable accessibilityRole="button" accessibilityLabel="Close Mira" hitSlop={8} onPress={() => router.back()} style={s.headerBtn}>
          <Ionicons name="close" size={22} color="#fff" />
        </Pressable>
      </LinearGradient>

      <KeyboardAvoidingView style={s.flex} behavior="padding">
        <ScrollView
          ref={scrollRef}
          style={s.flex}
          contentContainerStyle={s.body}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          scrollEventThrottle={64}
          onContentSizeChange={() => { if (followRef.current) scrollRef.current?.scrollToEnd({ animated: false }); }}
        >
          {messages.length === 0 ? (
            <View style={s.empty}>
              <View style={s.greetingRow}>
                <MiraMark size={26} />
                <Text style={s.greeting}>{greeting}</Text>
              </View>
              <Text style={s.startersLabel}>TRY ASKING</Text>
              <View style={s.starters}>
                {starters.map((starter) => (
                  <Pressable key={starter} accessibilityRole="button" onPress={() => submit(starter)} style={({ pressed }) => [s.starter, pressed && s.pressed]}>
                    <Text style={s.starterText}>{starter}</Text>
                    <Ionicons name="arrow-up" size={15} color={colors.primary} style={{ transform: [{ rotate: "45deg" }] }} />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            messages.map((message) => <MiraMessageView key={message.id} message={message} conversationId={conversationId} context={context} />)
          )}
          {awaitingFirstPart ? <MiraThinking /> : null}
          {error ? <View style={s.error}><Text style={s.errorText}>{error}</Text></View> : null}
        </ScrollView>

        {showJump ? (
          <Pressable accessibilityRole="button" onPress={() => { followRef.current = true; setShowJump(false); scrollRef.current?.scrollToEnd({ animated: true }); }} style={s.jump}>
            <Ionicons name="arrow-down" size={13} color={colors.ink} />
            <Text style={s.jumpText}>Jump to latest</Text>
          </Pressable>
        ) : null}

        <View style={[s.composerWrap, { paddingBottom: keyboardOpen ? 10 : Math.max(insets.bottom, 10) }]}>
          <View style={[s.composer, busy && s.composerBusy]}>
            <TextInput
              value={draft}
              onChangeText={(value) => setDraft(value.slice(0, MIRA_MAX_INPUT_CHARS))}
              placeholder={messages.length === 0 ? "Ask me anything…" : "Ask a follow-up…"}
              placeholderTextColor={colors.faint}
              accessibilityLabel="Your question"
              multiline
              style={s.input}
            />
            {busy ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Stop generating" onPress={stop} style={[s.send, s.stopBtn]}>
                <Ionicons name="square" size={12} color="#fff" />
              </Pressable>
            ) : (
              <Pressable accessibilityRole="button" accessibilityLabel="Send message" disabled={!draft.trim()} onPress={() => submit()} style={[s.send, !draft.trim() && s.sendDisabled]}>
                <Ionicons name="arrow-up" size={19} color={draft.trim() ? "#fff" : colors.faint} />
              </Pressable>
            )}
          </View>
          <Text style={s.disclaimer}>Confirm details with a counsellor.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  flex: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 16, paddingVertical: 10 },
  headerCopy: { flex: 1 },
  headerTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 17, color: "#fff" },
  headerSub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: "rgba(255,255,255,0.78)" },
  headerBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.12)" },
  body: { padding: 18, paddingBottom: 28, gap: 22 },
  empty: { paddingTop: 6 },
  greetingRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  greeting: { flex: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 16, lineHeight: 24, color: colors.ink },
  startersLabel: { marginTop: 26, marginBottom: 10, fontFamily: "PlusJakartaSans-Bold", fontSize: 10, letterSpacing: 1, color: colors.faint },
  starters: { gap: 9 },
  starter: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 15, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  starterText: { flex: 1, fontFamily: "PlusJakartaSans-Medium", fontSize: 14, lineHeight: 20, color: colors.ink },
  error: { borderRadius: 12, borderWidth: 1, borderColor: "#f3c7b8", backgroundColor: colors.coralSoft, padding: 12 },
  errorText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 19, color: colors.ink },
  jump: { position: "absolute", bottom: 96, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, elevation: 3 },
  jumpText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11, color: colors.ink },
  composerWrap: { paddingHorizontal: 12, paddingTop: 10, backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: 8, paddingLeft: 15, paddingRight: 6, paddingVertical: 6, borderRadius: 24, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.background },
  composerBusy: { borderColor: colors.mint },
  input: { flex: 1, maxHeight: 120, minHeight: 38, paddingTop: 9, paddingBottom: 9, fontFamily: "PlusJakartaSans-Regular", fontSize: 15, color: colors.ink },
  send: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  sendDisabled: { backgroundColor: colors.line },
  stopBtn: { backgroundColor: colors.ink },
  disclaimer: { marginTop: 6, textAlign: "center", fontFamily: "PlusJakartaSans-Regular", fontSize: 10, color: colors.faint },
  pressed: { opacity: 0.75 },
});
