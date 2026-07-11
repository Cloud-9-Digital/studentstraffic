import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../src/api/mobileClient";
import { colors } from "../src/theme/tokens";

const COUNSELLOR_PHONE = "+919176162888";
const WHATSAPP_URL = "https://wa.me/919176162888?text=Hi%2C+I%27d+like+to+talk+to+a+Students+Traffic+counsellor.";

export default function CounsellingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => mobileClient.getProfile(), staleTime: 2 * 60 * 1000 });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [userState, setUserState] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFullName((current) => current || profile.name || "");
    setPhone((current) => current || profile.phone || "");
  }, [profile]);

  async function submit() {
    if (!fullName.trim() || !phone.trim() || !userState.trim()) {
      setError("Please add your name, phone number, and state.");
      return;
    }
    setSubmitting(true); setError(null);
    try {
      await mobileClient.requestCounselling({ fullName: fullName.trim(), phone: phone.trim(), email: profile?.email, userState: userState.trim(), notes: notes.trim() || undefined });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't send your request. Please try again.");
    } finally { setSubmitting(false); }
  }

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.header}><Pressable onPress={() => router.back()} hitSlop={12} style={s.back}><Ionicons name="chevron-back" size={22} color={colors.ink} /></Pressable><Text style={s.headerTitle}>Counselling</Text><View style={s.back} /></View>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {submitted ? <SuccessState onClose={() => router.back()} /> : <>
            <View style={s.iconWrap}><Ionicons name="chatbubble-ellipses" size={29} color={colors.primary} /></View>
            <Text style={s.title}>Talk to a Students Traffic counsellor</Text>
            <Text style={s.intro}>Leave your number and our team will call you with guidance on country options, scholarships, shortlisting, and the next admission step that fits your profile.</Text>
            <View style={s.form}>
              <Field label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your full name" autoCapitalize="words" />
              <Field label="Phone number" value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" />
              <Field label="State" value={userState} onChangeText={setUserState} placeholder="Your state" autoCapitalize="words" />
              <Field label="What would you like help with? (optional)" value={notes} onChangeText={setNotes} placeholder="Country, university, program, or application" multiline />
              {error && <Text style={s.error}>{error}</Text>}
              <Pressable onPress={submit} disabled={submitting} style={({ pressed }) => [s.primary, (pressed || submitting) && s.pressed]}>{submitting ? <ActivityIndicator color="#fff" /> : <><Ionicons name="call-outline" size={18} color="#fff" /><Text style={s.primaryText}>Request a free counselling call</Text></>}</Pressable>
            </View>
            <Text style={s.or}>OR SPEAK WITH US NOW</Text>
            <View style={s.contactRow}>
              <Pressable onPress={() => Linking.openURL(`tel:${COUNSELLOR_PHONE}`)} style={({ pressed }) => [s.secondary, pressed && s.pressed]}><Ionicons name="call-outline" size={18} color={colors.primary} /><Text style={s.secondaryText}>Call us</Text></Pressable>
              <Pressable onPress={() => Linking.openURL(WHATSAPP_URL)} style={({ pressed }) => [s.secondary, pressed && s.pressed]}><Ionicons name="logo-whatsapp" size={18} color="#16794c" /><Text style={[s.secondaryText, { color: "#16794c" }]}>WhatsApp</Text></Pressable>
            </View>
            <Text style={s.note}>Available Mon–Sat, 9 AM – 7 PM IST. Parents can join the call too.</Text>
          </>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, multiline = false, ...input }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: "default" | "phone-pad"; autoCapitalize?: "none" | "words" | "sentences"; multiline?: boolean }) {
  return <View><Text style={s.label}>{label}</Text><TextInput {...input} multiline={multiline} style={[s.input, multiline && s.textarea]} placeholderTextColor={colors.faint} textAlignVertical={multiline ? "top" : "center"} /></View>;
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return <View style={s.success}><View style={s.successIcon}><Ionicons name="checkmark" size={32} color="#fff" /></View><Text style={s.title}>Request received</Text><Text style={s.intro}>A Students Traffic counsellor will call you soon with clear guidance for your next step.</Text><Pressable onPress={onClose} style={s.primary}><Text style={s.primaryText}>Done</Text></Pressable></View>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, flex: { flex: 1 }, header: { height: 58, paddingHorizontal: 16, alignItems: "center", flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, back: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" }, headerTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 16, color: colors.ink }, content: { padding: 20 }, iconWrap: { width: 62, height: 62, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginTop: 7, marginBottom: 16 }, title: { fontFamily: "Fraunces-SemiBold", fontSize: 27, lineHeight: 33, color: colors.ink, letterSpacing: -0.2 }, intro: { marginTop: 9, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, lineHeight: 22, color: colors.muted }, form: { gap: 14, marginTop: 25 }, label: { marginBottom: 7, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.ink }, input: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 13, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink }, textarea: { minHeight: 88, paddingTop: 12 }, error: { marginTop: -3, fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: "#b42318" }, primary: { minHeight: 51, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.primary, marginTop: 4 }, primaryText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" }, or: { marginTop: 26, marginBottom: 11, textAlign: "center", fontFamily: "PlusJakartaSans-Bold", fontSize: 10, letterSpacing: 1, color: colors.faint }, contactRow: { flexDirection: "row", gap: 10 }, secondary: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 }, secondaryText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.primary }, note: { marginTop: 15, textAlign: "center", fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 17, color: colors.faint }, success: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80, paddingHorizontal: 12 }, successIcon: { width: 66, height: 66, borderRadius: 33, alignItems: "center", justifyContent: "center", backgroundColor: colors.success, marginBottom: 19 }, pressed: { opacity: 0.75 },
});
