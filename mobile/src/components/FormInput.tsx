import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "../theme/tokens";
// `password` hides the text and adds an eye button inside the field to show or hide it.
export function FormInput({ label, error, focusError, password, ...props }: TextInputProps & { label: string; error?: string; focusError?: boolean; password?: boolean }) {
  const ref = useRef<TextInput>(null);
  const previousError = useRef<string | undefined>(undefined);
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (error && focusError && !previousError.current) ref.current?.focus(); previousError.current = error; }, [error, focusError]);
  const input = <TextInput ref={ref} accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} secureTextEntry={password ? !visible : props.secureTextEntry} style={[s.input, password && s.inputWithToggle, props.style, error && s.invalid]} />;
  return <View style={s.field}><Text style={s.label}>{label}</Text>{password ? <View>{input}<Pressable accessibilityRole="button" accessibilityLabel={visible ? "Hide password" : "Show password"} hitSlop={8} onPress={() => { Haptics.selectionAsync(); setVisible(v => !v); }} style={s.toggle}><Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={20} color={colors.muted} /></Pressable></View> : input}{error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}</View>;
}
const s = StyleSheet.create({ field: { marginBottom: 14 }, label: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.ink, marginBottom: 7 }, input: { minHeight: 50, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.surface, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink }, inputWithToggle: { paddingRight: 52 }, toggle: { position: "absolute", right: 4, top: 0, bottom: 0, width: 44, alignItems: "center", justifyContent: "center" }, invalid: { borderColor: colors.accent, backgroundColor: colors.coralSoft }, error: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.accentStrong, marginTop: 6 } });
