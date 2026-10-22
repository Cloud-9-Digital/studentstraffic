import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../api/mobileClient";
import { FormInput } from "../../components/FormInput";
import { SearchablePicker, type PickerOptions } from "../../components/SearchablePicker";
import { INDIAN_STATES } from "../../data/indianStates";
import { getResidenceCountry, RESIDENCE_COUNTRIES, toInternationalPhone } from "../../data/residenceCountries";
import { colors } from "../../theme/tokens";
import type { MiraContext, MiraLeadRequest, MiraPeerRequest } from "./types";
import { miraPage } from "./useMiraChat";

// Mira's two inline forms, as on the website (components/site/chatbot/
// chat-lead-form.tsx and chat-peer-form.tsx): a counsellor callback, and an
// introduction to a current student. Mira can open them but never collects the
// details herself, so a phone number never passes through the model. Both ask
// the same things — name, the country the student lives in, phone, and state
// only for India — and reach the same captures as the website's forms, through
// /api/mobile/v1/mira/lead and /api/mobile/v1/mira/peer.

const RESIDENCE_OPTIONS = RESIDENCE_COUNTRIES.map(([code, name]) => ({ label: name, value: code }));

// Submitted forms stay submitted when the screen re-renders or reopens.
const submittedKeys = new Set<string>();

export type MiraFormKind = { type: "lead"; request: MiraLeadRequest } | { type: "peer"; request: MiraPeerRequest };

export function MiraContactForm({ kind, conversationId, context, formKey }: { kind: MiraFormKind; conversationId?: string; context: MiraContext; formKey: string }) {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => mobileClient.getProfile(), staleTime: 2 * 60 * 1000 });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [residenceCountry, setResidenceCountry] = useState("");
  const [userState, setUserState] = useState("");
  const [picker, setPicker] = useState<PickerOptions | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(() => submittedKeys.has(formKey));
  const residenceChosenRef = useRef(false);

  // Preselect the country from IP geolocation, as the website does; the
  // student can change it.
  useEffect(() => {
    let cancelled = false;
    mobileClient.getGeoCountry().then((country) => {
      if (cancelled || residenceChosenRef.current || !getResidenceCountry(country)) return;
      setResidenceCountry((current) => current || (country ?? "").toUpperCase());
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!profile) return;
    setFullName((current) => current || profile.name || "");
    setPhone((current) => current || profile.phone || "");
  }, [profile]);

  if (done) {
    return (
      <View style={[s.card, s.doneCard]}>
        <Ionicons name="checkmark-circle" size={18} color={colors.success} />
        <Text style={[s.note, s.doneText]}>
          {kind.type === "peer"
            ? `Sent. We'll introduce you to a student at ${kind.request.universityName} — keep an eye on your phone.`
            : "Thanks — a Students Traffic counsellor will call you. Carry on asking me anything in the meantime."}
        </Text>
      </View>
    );
  }

  const livesInIndia = residenceCountry === "IN";
  const dialCode = getResidenceCountry(residenceCountry)?.dialCode;

  async function submit() {
    const next: Record<string, string> = {};
    const internationalPhone = toInternationalPhone(phone, residenceCountry);
    if (fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!residenceCountry) next.residenceCountry = "Please select the country you live in.";
    if (!/^\+[1-9]\d{7,14}$/.test(internationalPhone)) next.phone = "Please enter a valid phone number.";
    if (livesInIndia && !userState) next.userState = "Please select your state.";
    setErrors(next);
    setError(null);
    if (Object.keys(next).length) return;

    setPending(true);
    try {
      const page = miraPage(context);
      const contact = { fullName: fullName.trim(), phone: internationalPhone, residenceCountry, userState: livesInIndia ? userState : undefined };
      if (kind.type === "peer") {
        await mobileClient.submitMiraPeerRequest({
          ...contact,
          universitySlug: kind.request.universitySlug,
          sourcePath: page.path,
          sourceUrl: `studentstraffic://mira${page.path}`,
          pageTitle: `Chat — ${kind.request.universityName} (Students Traffic app)`,
        });
      } else {
        await mobileClient.submitMiraLead({
          ...contact,
          conversationId,
          countrySlug: kind.request.interest?.countrySlug,
          courseSlug: kind.request.interest?.courseSlug,
          universitySlug: kind.request.interest?.universitySlug ?? context?.universitySlug,
          page: { path: page.path, url: `studentstraffic://mira${page.path}`, title: page.title },
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      submittedKeys.add(formKey);
      setDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <View style={s.card}>
      <Text style={s.note}>{kind.type === "peer" ? kind.request.reason : `Share a few details and a counsellor will call you ${kind.request.reason}.`}</Text>
      <FormInput label="Full name" value={fullName} onChangeText={(value) => { setFullName(value); setErrors((e) => ({ ...e, fullName: "" })); }} error={errors.fullName} autoCapitalize="words" autoComplete="name" maxLength={120} />
      <SelectField label="Country you live in" value={getResidenceCountry(residenceCountry)?.name ?? ""} placeholder="Select country" error={errors.residenceCountry} onPress={() => setPicker({ title: "Country you live in", selected: residenceCountry, options: RESIDENCE_OPTIONS, onSelect: (value) => { residenceChosenRef.current = true; setResidenceCountry(value); setErrors((e) => ({ ...e, residenceCountry: "" })); } })} />
      <FormInput label={dialCode && !phone.trim().startsWith("+") ? `Phone number (+${dialCode})` : "Phone number"} placeholder={dialCode ? `Number, +${dialCode} added for you` : "+ country code and number"} value={phone} onChangeText={(value) => { setPhone(value); setErrors((e) => ({ ...e, phone: "" })); }} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" maxLength={24} />
      {livesInIndia ? <SelectField label="State" value={userState} placeholder="Select your state" error={errors.userState} onPress={() => setPicker({ title: "Select your state", selected: userState, options: INDIAN_STATES.map((value) => ({ label: value, value })), onSelect: (value) => { setUserState(value); setErrors((e) => ({ ...e, userState: "" })); } })} /> : null}
      {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}
      <Pressable accessibilityRole="button" onPress={submit} disabled={pending} style={({ pressed }) => [s.submit, (pressed || pending) && s.pressed]}>
        {pending ? <ActivityIndicator color="#fff" /> : <Text style={s.submitText}>{kind.type === "peer" ? "Ask for an introduction" : "Request a callback"}</Text>}
      </Pressable>
      <Text style={s.fine}>We use these details only to call you about your study-abroad plans.</Text>
      {picker ? <SearchablePicker picker={picker} onClose={() => setPicker(null)} /> : null}
    </View>
  );
}

function SelectField({ label, value, placeholder, error, onPress }: { label: string; value: string; placeholder: string; error?: string; onPress: () => void }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.select, error ? s.invalid : null, pressed && s.pressed]}>
        <Text style={[s.selectText, !value && s.placeholder]}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={17} color={colors.muted} />
      </Pressable>
      {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  card: { marginTop: 4, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.background },
  doneCard: { flexDirection: "row", gap: 9, alignItems: "flex-start", borderColor: "#bfe5d6", backgroundColor: colors.primarySoft },
  doneText: { flex: 1, marginBottom: 0, color: colors.ink },
  note: { marginBottom: 12, fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 19, color: colors.muted },
  field: { marginBottom: 14 },
  label: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.ink, marginBottom: 7 },
  select: { minHeight: 50, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  selectText: { flex: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink },
  placeholder: { color: colors.muted },
  invalid: { borderColor: colors.accent, backgroundColor: colors.coralSoft },
  error: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.accentStrong, marginTop: 6 },
  submit: { minHeight: 48, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary, marginTop: 2 },
  submitText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
  fine: { marginTop: 10, fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 16, color: colors.faint },
  pressed: { opacity: 0.75 },
});
