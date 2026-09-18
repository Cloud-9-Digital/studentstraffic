import { SearchablePicker } from "../src/components/SearchablePicker";
import { useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DocumentPickerAsset } from "expo-document-picker";
import { mobileClient } from "../src/api/mobileClient";
import { colors } from "../src/theme/tokens";
import { PageHeader } from "../src/components/PageHeader";

export default function BecomeGuideScreen() {
  const router = useRouter(); const client = useQueryClient();
  const query = useQuery({ queryKey: ["guideApplication"], queryFn: () => mobileClient.getGuideApplication(), staleTime: 0 });
  const [values, setValues] = useState({ universityId: "", phone: "", courseName: "", currentYearOrBatch: "", homeState: "", homeCity: "", languages: "", message: "", enrollmentStatus: "current_student" });
  const [selecting, setSelecting] = useState(false);
  const [proof, setProof] = useState<DocumentPickerAsset | null>(null); const [photo, setPhoto] = useState<DocumentPickerAsset | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({}); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [submitted, setSubmitted] = useState(false);
  const scroll = useRef<ScrollView>(null); const positions = useRef<Record<string, number>>({});
  const status = submitted ? "pending" : query.data?.application?.status;
  const locked = !!query.data?.guideStatus || status === "pending" || status === "approved";
  function change(key: keyof typeof values, value: string) { setValues(v => ({ ...v, [key]: value })); setErrors(e => ({ ...e, [key]: "" })); }
  async function pick(kind: "proof" | "photo") {
    setError("");
    try {
      const picker = require("expo-document-picker") as typeof import("expo-document-picker");
      const result = await picker.getDocumentAsync({ type: kind === "proof" ? ["image/jpeg", "image/png", "application/pdf"] : ["image/jpeg", "image/png", "image/webp"], copyToCacheDirectory: true });
      if (result.canceled) return;
      const file = result.assets[0];
      if ((file.size ?? 0) > (kind === "proof" ? 10 : 5) * 1024 * 1024) { setErrors(e => ({ ...e, [kind]: `Choose a file under ${kind === "proof" ? 10 : 5} MB.` })); return; }
      if (kind === "proof") setProof(file); else setPhoto(file);
      setErrors(e => ({ ...e, [kind]: "" }));
    } catch { setError("The file picker is unavailable. Install the updated development build, or use Expo Go to select your documents."); }
  }
  async function submit() {
    if (busy) return;
    const next: Record<string, string> = {};
    if (!values.universityId) next.universityId = "Select your university.";
    if (!/^\+?[\d\s()-]{7,20}$/.test(values.phone.trim())) next.phone = "Enter a valid phone number for our team.";
    if (!proof) next.proof = "Add your college ID or admission letter.";
    setErrors(next); setError("");
    if (Object.keys(next).length) { scroll.current?.scrollTo({ y: positions.current[Object.keys(next)[0]] ?? 0, animated: true }); return; }
    setBusy(true);
    try {
      const form = new FormData(); Object.entries(values).forEach(([key, value]) => form.append(key, value));
      for (const [key, asset] of [["proofFile", proof], ["photoFile", photo]] as const) {
        if (asset) form.append(key, asset.file ?? ({ uri: asset.uri, name: asset.name, type: asset.mimeType ?? "application/octet-stream" } as unknown as Blob));
      }
      await mobileClient.submitGuideApplication(form); setSubmitted(true);
      await client.invalidateQueries({ queryKey: ["guideApplication"] });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Couldn’t submit. Please try again."); }
    finally { setBusy(false); }
  }
  const university = query.data?.universities.find(u => String(u.id) === values.universityId);
  return <SafeAreaView style={s.root}><PageHeader title="Become a guide" action={<Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={s.close}><Ionicons name="close" size={22} color={colors.ink} /></Pressable>} />
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}><ScrollView ref={scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {query.isLoading ? <ActivityIndicator color={colors.primary} /> : query.isError ? <Pressable onPress={() => query.refetch()}><Text style={s.error}>Couldn’t load your application. Tap to retry.</Text></Pressable> : locked || submitted ? <View style={s.status}><Ionicons name={query.data?.guideStatus === "active" ? "checkmark-circle-outline" : "time-outline"} size={36} color={colors.primary} /><Text style={s.heading}>{query.data?.guideStatus === "active" ? "You’re a student guide" : query.data?.guideStatus === "inactive" ? "Your guide profile is paused" : status === "approved" ? "Your application is approved" : "Your application is under review"}</Text><Text style={s.body}>{query.data?.guideStatus === "active" ? "Open Connect to see your student conversations and requests." : query.data?.guideStatus === "inactive" ? "Contact our team through Help to discuss your profile." : "Our team will check your details and documents. We’ll email you with an update."}</Text><Pressable onPress={() => router.replace("/(tabs)/calls")} style={s.button}><Text style={s.buttonText}>Go to Connect</Text></Pressable></View> : <>
      <Text style={s.heading}>Help someone find their way.</Text><Text style={s.body}>Share your experience of university life. Our team reviews every application before a guide profile becomes visible.</Text>
      {status === "rejected" ? <Text style={s.body}>Your previous application wasn’t approved. You can submit an updated application for review.</Text> : null}
      <View onLayout={e => { positions.current.universityId = e.nativeEvent.layout.y; }}><Text style={s.label}>University *</Text><Pressable style={[s.input, errors.universityId && s.invalid]} onPress={() => setSelecting(v => !v)}><Text style={s.body}>{university ? `${university.name} · ${university.country ?? ""}` : "Select your university"}</Text></Pressable>{errors.universityId ? <Text style={s.error}>{errors.universityId}</Text> : null}</View>
      <Text style={s.label}>I am a</Text><View style={s.row}>{["current_student", "alumnus"].map(value => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: values.enrollmentStatus === value }} onPress={() => change("enrollmentStatus", value)} style={[s.choice, values.enrollmentStatus === value && s.selected]}><Text style={s.body}>{value === "current_student" ? "Current student" : "Graduate"}</Text></Pressable>)}</View>
      {([["phone", "Phone number *"], ["courseName", "Course"], ["currentYearOrBatch", "Year or batch"], ["homeState", "Home state"], ["homeCity", "Home city"], ["languages", "Languages (comma separated)"], ["message", "Anything you’d like us to know?"]] as const).map(([key, label]) => <View key={key} onLayout={e => { positions.current[key] = e.nativeEvent.layout.y; }}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} value={values[key]} onChangeText={value => change(key, value)} editable={!busy} style={[s.input, errors[key] && s.invalid]} keyboardType={key === "phone" ? "phone-pad" : "default"} maxLength={key === "message" ? 1000 : 150} multiline={key === "message"} />{errors[key] ? <Text accessibilityLiveRegion="polite" style={s.error}>{errors[key]}</Text> : null}</View>)}
      {(["proof", "photo"] as const).map(kind => <View key={kind} onLayout={e => { positions.current[kind] = e.nativeEvent.layout.y; }}><Text style={s.label}>{kind === "proof" ? "College ID or admission letter *" : "Profile photo (optional)"}</Text><Pressable disabled={busy} onPress={() => pick(kind)} style={[s.upload, errors[kind] && s.invalid]}><Ionicons name="cloud-upload-outline" size={22} color={colors.primary} /><Text style={[s.body, s.flex]}>{(kind === "proof" ? proof : photo)?.name ?? (kind === "proof" ? "Choose JPG, PNG or PDF · up to 10 MB" : "Choose a photo · up to 5 MB")}</Text></Pressable>{errors[kind] ? <Text style={s.error}>{errors[kind]}</Text> : null}</View>)}
      <Text style={[s.body, { marginTop: 20 }]}>Your phone number and verification document are for our team. Students contact guides through in-app chat and calls.</Text>
      {error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}<Pressable disabled={busy} onPress={submit} style={[s.button, busy && { opacity: 0.5 }]}><Text style={s.buttonText}>{busy ? "Submitting application…" : "Submit application"}</Text></Pressable>
      </>}
    </ScrollView></KeyboardAvoidingView>
    {selecting ? <SearchablePicker picker={{ title: "Select university", selected: values.universityId, options: (query.data?.universities ?? []).map(u => ({ value: String(u.id), label: `${u.name} · ${u.country ?? ""}` })), onSelect: value => change("universityId", value) }} onClose={() => setSelecting(false)} /> : null}
  </SafeAreaView>;
}
const s = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.surface }, flex: { flex: 1 }, content: { paddingHorizontal: 20, paddingBottom: 32 }, close: { padding: 12 }, heading: { fontFamily: "Fraunces-Medium", fontSize: 24, color: colors.ink, marginBottom: 10 }, body: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 21, color: colors.muted }, label: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.ink, marginTop: 20, marginBottom: 8 }, input: { minHeight: 50, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 13, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink }, invalid: { borderColor: colors.accent, backgroundColor: colors.coralSoft }, error: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 19, color: colors.accentStrong, marginTop: 6 }, row: { flexDirection: "row", gap: 10 }, choice: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.line }, selected: { backgroundColor: colors.primarySoft, borderColor: colors.primary }, upload: { flexDirection: "row", gap: 12, alignItems: "center", padding: 16, borderWidth: 1, borderColor: colors.line, borderRadius: 12 }, button: { marginTop: 24, minHeight: 52, borderRadius: 13, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, buttonText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: "#fff" }, status: { padding: 22, borderRadius: 18, backgroundColor: colors.primarySoft, gap: 12 }, options: { padding: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 12, marginTop: 8 }, option: { paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.line } });
