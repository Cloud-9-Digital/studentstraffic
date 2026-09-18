import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mobileClient } from "../../api/mobileClient";
import { colors } from "../../theme/tokens";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function ConversationSafety({ conversationId, blockedByMe, onChanged }: { conversationId: number; blockedByMe: boolean; onChanged: () => void }) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [details, setDetails] = useState("");
  const [notice, setNotice] = useState("");
  const [reportError, setReportError] = useState("");
  const [failed, setFailed] = useState(false);
  const validReport = details.trim().length >= 10;
  function close() { if (!pending) setOpen(false); }
  async function submit(operation: "block" | "unblock" | "report") {
    if (pending) return;
    if (operation === "report" && !validReport) { setReportError("Describe what happened using at least 10 characters."); return; }
    setReportError("");
    setPending(true); setNotice(""); setFailed(false);
    try {
      await mobileClient.conversationSafety(conversationId, { operation, reason: "other", details });
      setNotice(operation === "report" ? "Report sent. Our team will review it privately." : operation === "block" ? "Conversation blocked. Messages and calls are stopped." : "Conversation unblocked.");
      if (operation === "report") { setDetails(""); setReporting(false); }
      onChanged();
    } catch (error) { setFailed(true); setNotice(error instanceof Error ? error.message : "Couldn’t save this. Please try again."); }
    finally { setPending(false); }
  }
  return <>
    <Pressable accessibilityRole="button" accessibilityLabel="Conversation safety" onPress={() => { setOpen(true); setNotice(""); setReporting(false); }} style={s.trigger}><Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} /></Pressable>
    <Modal visible={open} transparent animationType={reducedMotion ? "none" : "slide"} onRequestClose={close} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={s.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close conversation safety" disabled={pending} onPress={close} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={[s.sheet, { maxHeight: "90%", paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={s.handle} />
          <View style={s.header}><View style={s.headingCopy}><Text accessibilityRole="header" style={s.title}>{reporting ? "Report a problem" : "Conversation safety"}</Text><Text style={s.subtitle}>Your comfort comes first.</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Close" disabled={pending} onPress={close} style={s.close}><Ionicons name="close" size={22} color={colors.ink} /></Pressable></View>
          <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {reporting ? <>
              <Text style={s.body}>Tell us what happened. Your report is shared privately with the Students Traffic team.</Text>
              <TextInput accessibilityLabel="Describe what happened" placeholder="What would you like us to know?" placeholderTextColor={colors.muted} multiline value={details} onChangeText={v => { setDetails(v); setReportError(""); }} maxLength={2000} editable={!pending} style={[s.input, reportError && { borderColor: colors.accent, backgroundColor: colors.coralSoft }]} />
              {reportError ? <Text accessibilityLiveRegion="polite" style={[s.hint, { color: colors.accentStrong, marginTop: 8 }]}>{reportError}</Text> : null}<View style={s.hintRow}><Text style={s.hint}>At least 10 characters</Text><Text style={s.hint}>{details.length}/2000</Text></View>
              <Pressable accessibilityRole="button" disabled={pending} style={[s.submit, pending && s.disabled]} onPress={() => void submit("report")}><Text style={s.submitText}>{pending ? "Sending…" : "Send private report"}</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable>
              <Pressable accessibilityRole="button" disabled={pending} onPress={() => { setReporting(false); setNotice(""); }} style={s.back}><Text style={s.backText}>Back to safety options</Text></Pressable>
            </> : <>
              <View style={s.guidance}><Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} /><Text style={s.guidanceText}>Keep messages and calls here in the app. Don’t share contact details or send money to another member.</Text></View>
              <Pressable accessibilityRole="button" disabled={pending} onPress={() => void submit(blockedByMe ? "unblock" : "block")} style={[s.option, pending && s.disabled]}><View style={[s.optionIcon, s.blockIcon]}><Ionicons name={blockedByMe ? "lock-open-outline" : "ban-outline"} size={22} color={colors.accent} /></View><View style={s.optionCopy}><Text style={s.optionTitle}>{pending ? "Updating…" : blockedByMe ? "Unblock conversation" : "Block conversation"}</Text><Text style={s.optionDetail}>{blockedByMe ? "Allow messages and calls again." : "Stop messages and calls. You can undo this."}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>
              <Pressable accessibilityRole="button" disabled={pending} onPress={() => { setReporting(true); setNotice(""); }} style={s.option}><View style={s.optionIcon}><Ionicons name="flag-outline" size={22} color={colors.primary} /></View><View style={s.optionCopy}><Text style={s.optionTitle}>Report a problem</Text><Text style={s.optionDetail}>Let our team know, privately.</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>
            </>}
            {notice ? <View accessibilityLiveRegion="polite" style={[s.notice, failed && s.error]}><Ionicons name={failed ? "alert-circle-outline" : "checkmark-circle-outline"} size={20} color={failed ? colors.accent : colors.primary} /><Text style={s.noticeText}>{notice}</Text></View> : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  </>;
}

const s = StyleSheet.create({
  trigger: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: colors.primarySoft },
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15,31,28,0.35)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, overflow: "hidden" },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: "center", marginTop: 10, marginBottom: 12 },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 20, paddingBottom: 22 },
  headingCopy: { flex: 1 },
  title: { fontFamily: "Fraunces-SemiBold", fontSize: 25, lineHeight: 32, color: colors.ink },
  subtitle: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 20, color: colors.muted, marginTop: 5 },
  close: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  scroll: { flexGrow: 0 },
  content: { paddingHorizontal: 20, paddingBottom: 12 },
  guidance: { flexDirection: "row", gap: 12, padding: 16, backgroundColor: colors.primarySoft, borderRadius: 16, marginBottom: 12 },
  guidanceText: { flex: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 20, color: colors.primary },
  option: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  optionIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  blockIcon: { backgroundColor: colors.coralSoft },
  optionCopy: { flex: 1 },
  optionTitle: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 14, lineHeight: 21, color: colors.ink },
  optionDetail: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 19, color: colors.muted, marginTop: 3 },
  body: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 22, color: colors.muted },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line, borderRadius: 14, minHeight: 140, padding: 14, marginTop: 18, fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 21, color: colors.ink, textAlignVertical: "top" },
  hintRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  hint: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.muted },
  submit: { minHeight: 50, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, backgroundColor: colors.primary, borderRadius: 13, marginTop: 22, padding: 14 },
  submitText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: "#fff" },
  disabled: { opacity: 0.45 },
  back: { minHeight: 48, justifyContent: "center", alignItems: "center", marginTop: 6 },
  backText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.primary },
  notice: { flexDirection: "row", gap: 10, backgroundColor: colors.primarySoft, padding: 14, borderRadius: 12, marginTop: 16 },
  error: { backgroundColor: colors.coralSoft },
  noticeText: { flex: 1, fontFamily: "PlusJakartaSans-Medium", fontSize: 12, lineHeight: 20, color: colors.ink },
});
