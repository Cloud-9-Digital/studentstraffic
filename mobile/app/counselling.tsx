import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { mobileClient } from "../src/api/mobileClient";
import { colors } from "../src/theme/tokens";

const COUNSELLOR_PHONE = "+919176162888";
const WHATSAPP_URL = "https://wa.me/919176162888?text=Hi%2C+I%27d+like+to+talk+to+a+Students+Traffic+counsellor.";
const INDIAN_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];

type Picker = { title: string; options: Array<{ label: string; value: string }>; onSelect: (value: string) => void } | null;

export default function CounsellingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => mobileClient.getProfile(), staleTime: 2 * 60 * 1000 });
  const { data: catalogue } = useQuery({ queryKey: ["counselling-catalogue"], queryFn: () => mobileClient.getUniversities({}, 1, 1), staleTime: 10 * 60 * 1000 });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [userState, setUserState] = useState("");
  const [email, setEmail] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [countrySlug, setCountrySlug] = useState("");
  const [picker, setPicker] = useState<Picker>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFullName((current) => current || profile.name || "");
    setPhone((current) => current || profile.phone || "");
    setEmail((current) => current || profile.email || "");
  }, [profile]);

  async function submit() {
    if (!fullName.trim() || !phone.trim() || !userState.trim()) {
      setError("Please add your name, phone number, and state.");
      return;
    }
    setSubmitting(true); setError(null);
    try {
      await mobileClient.requestCounselling({ fullName: fullName.trim(), phone: phone.trim(), email: email.trim() || undefined, userState, courseSlug: courseSlug || undefined, countrySlug: countrySlug || undefined });
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
          {submitted ? <SuccessState name={fullName} phone={phone} onClose={() => router.back()} /> : <>
            <View style={s.iconWrap}><Ionicons name="chatbubble-ellipses" size={29} color={colors.primary} /></View>
            <Text style={s.title}>Talk to a Students Traffic counsellor</Text>
            <Text style={s.intro}>Leave your number and our team will call you with guidance on country options, scholarships, shortlisting, and the next admission step that fits your profile.</Text>
            <View style={s.form}>
              <Field label="Full name" required value={fullName} onChangeText={setFullName} placeholder="Student or parent name" autoCapitalize="words" />
              <Field label="Phone number" required value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" />
              <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />
              <SelectField label="State" required value={userState} placeholder="Select state" onPress={() => setPicker({ title: "Select state", options: INDIAN_STATES.map((value) => ({ label: value, value })), onSelect: setUserState })} />
              <SelectField label="Interested course" value={catalogue?.options.courses.find((course) => course.slug === courseSlug)?.shortName ?? ""} placeholder="Select a course" onPress={() => setPicker({ title: "Select a course", options: (catalogue?.options.courses ?? []).map((course) => ({ label: course.shortName, value: course.slug })), onSelect: setCourseSlug })} />
              <SelectField label="Interested country" value={catalogue?.options.countries.find((country) => country.slug === countrySlug)?.name ?? ""} placeholder="Select a country" onPress={() => setPicker({ title: "Select a country", options: (catalogue?.options.countries ?? []).map((country) => ({ label: country.name, value: country.slug })), onSelect: setCountrySlug })} />
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
      <PickerModal picker={picker} onClose={() => setPicker(null)} />
    </SafeAreaView>
  );
}

function Field({ label, required = false, ...input }: { label: string; required?: boolean; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: "default" | "phone-pad" | "email-address"; autoCapitalize?: "none" | "words" | "sentences" }) {
  return <View><Text style={s.label}>{label}{required ? <Text style={s.required}> *</Text> : <Text style={s.optional}> (optional)</Text>}</Text><TextInput {...input} style={s.input} placeholderTextColor={colors.faint} /></View>;
}

function SelectField({ label, required = false, value, placeholder, onPress }: { label: string; required?: boolean; value: string; placeholder: string; onPress: () => void }) {
  return <View><Text style={s.label}>{label}{required ? <Text style={s.required}> *</Text> : <Text style={s.optional}> (optional)</Text>}</Text><Pressable onPress={onPress} style={({ pressed }) => [s.select, pressed && s.pressed]}><Text style={[s.selectText, !value && s.placeholder]}>{value || placeholder}</Text><Ionicons name="chevron-down" size={17} color={colors.muted} /></Pressable></View>;
}

function PickerModal({ picker, onClose }: { picker: Picker; onClose: () => void }) {
  return <Modal visible={!!picker} animationType="slide" transparent onRequestClose={onClose}><Pressable style={s.modalBackdrop} onPress={onClose} /><View style={s.pickerSheet}><View style={s.pickerHandle} /><View style={s.pickerHeader}><Text style={s.pickerTitle}>{picker?.title}</Text><Pressable onPress={onClose} hitSlop={12}><Ionicons name="close" size={21} color={colors.muted} /></Pressable></View><ScrollView showsVerticalScrollIndicator={false}>{picker?.options.map((option) => <Pressable key={option.value} onPress={() => { picker.onSelect(option.value); Haptics.selectionAsync(); onClose(); }} style={s.option}><Text style={s.optionText}>{option.label}</Text><Ionicons name="chevron-forward" size={17} color={colors.faint} /></Pressable>)}</ScrollView></View></Modal>;
}

function SuccessState({ name, phone, onClose }: { name: string; phone: string; onClose: () => void }) {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  return <View style={s.success}>
    <LinearGradient colors={["#0a302a", "#14594d"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.successHero}>
      <View style={s.successMark}><Ionicons name="checkmark" size={27} color={colors.primary} /></View>
      <Text style={s.successEyebrow}>COUNSELLING REQUEST RECEIVED</Text>
      <Text style={s.successTitle}>You’re all set, {firstName}.</Text>
      <Text style={s.successLead}>A Students Traffic counsellor will prepare guidance that fits your next step.</Text>
    </LinearGradient>
    <View style={s.nextCard}>
      <Text style={s.nextTitle}>What happens next</Text>
      <SuccessStep number="1" title="We review your preferences" text="Your course and country interests help us prepare relevant options." />
      <SuccessStep number="2" title="A counsellor calls you" text={`We’ll call ${phone || "your number"} during our support hours.`} />
      <SuccessStep number="3" title="You get a clear plan" text="Discuss shortlisting, scholarships, applications, and your practical next step." last />
    </View>
    <Pressable onPress={onClose} style={({ pressed }) => [s.primary, s.successDone, pressed && s.pressed]}><Text style={s.primaryText}>Continue exploring</Text><Ionicons name="arrow-forward" size={17} color="#fff" /></Pressable>
    <Text style={s.successNote}>Available Mon–Sat, 9 AM – 7 PM IST</Text>
  </View>;
}

function SuccessStep({ number, title, text, last = false }: { number: string; title: string; text: string; last?: boolean }) {
  return <View style={s.successStep}><View style={s.stepRail}><View style={s.stepNumber}><Text style={s.stepNumberText}>{number}</Text></View>{!last && <View style={s.stepLine} />}</View><View style={s.stepCopy}><Text style={s.stepTitle}>{title}</Text><Text style={s.stepText}>{text}</Text></View></View>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, flex: { flex: 1 }, header: { height: 58, paddingHorizontal: 16, alignItems: "center", flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, back: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" }, headerTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 16, color: colors.ink }, content: { padding: 20 }, iconWrap: { width: 62, height: 62, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginTop: 7, marginBottom: 16 }, title: { fontFamily: "Fraunces-SemiBold", fontSize: 27, lineHeight: 33, color: colors.ink, letterSpacing: -0.2 }, intro: { marginTop: 9, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, lineHeight: 22, color: colors.muted }, form: { gap: 14, marginTop: 25 }, label: { marginBottom: 7, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.ink }, required: { color: colors.coral }, optional: { fontFamily: "PlusJakartaSans-Regular", color: colors.muted }, input: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 13, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink }, select: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, selectText: { flex: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink }, placeholder: { color: colors.faint }, error: { marginTop: -3, fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: "#b42318" }, primary: { minHeight: 51, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.primary, marginTop: 4 }, primaryText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" }, or: { marginTop: 26, marginBottom: 11, textAlign: "center", fontFamily: "PlusJakartaSans-Bold", fontSize: 10, letterSpacing: 1, color: colors.faint }, contactRow: { flexDirection: "row", gap: 10 }, secondary: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 }, secondaryText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.primary }, note: { marginTop: 15, textAlign: "center", fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 17, color: colors.faint }, success: { marginHorizontal: -20, marginTop: -20, minHeight: "100%" }, successHero: { paddingHorizontal: 28, paddingTop: 42, paddingBottom: 38, alignItems: "center" }, successMark: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", backgroundColor: "#d9f6ed", marginBottom: 17 }, successEyebrow: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, letterSpacing: 1.2, color: "#9ee3d0" }, successTitle: { marginTop: 8, fontFamily: "Fraunces-SemiBold", fontSize: 28, color: "#fff", textAlign: "center" }, successLead: { marginTop: 9, fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 20, color: "rgba(255,255,255,0.75)", textAlign: "center" }, nextCard: { marginHorizontal: 20, marginTop: -18, padding: 18, borderRadius: 19, backgroundColor: colors.surface, shadowColor: "#0f1f1c", shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 }, nextTitle: { marginBottom: 15, fontFamily: "PlusJakartaSans-Bold", fontSize: 15, color: colors.ink }, successStep: { flexDirection: "row", minHeight: 68 }, stepRail: { width: 29, alignItems: "center" }, stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }, stepNumberText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 11, color: colors.primary }, stepLine: { width: 1, flex: 1, backgroundColor: colors.line, marginVertical: 5 }, stepCopy: { flex: 1, paddingLeft: 8, paddingBottom: 12 }, stepTitle: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.ink }, stepText: { marginTop: 3, fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 17, color: colors.muted }, successDone: { marginHorizontal: 20, marginTop: 22 }, successNote: { marginTop: 14, textAlign: "center", fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.faint }, modalBackdrop: { flex: 1, backgroundColor: "rgba(15,31,28,0.38)" }, pickerSheet: { maxHeight: "72%", borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.surface, paddingHorizontal: 20, paddingBottom: 24 }, pickerHandle: { alignSelf: "center", width: 36, height: 4, borderRadius: 3, backgroundColor: colors.line, marginVertical: 10 }, pickerHeader: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, pickerTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 16, color: colors.ink }, option: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, optionText: { flex: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink }, pressed: { opacity: 0.75 },
});
