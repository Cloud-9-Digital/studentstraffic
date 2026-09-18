import { useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { colors } from "../theme/tokens";
export function FormInput({ label, error, focusError, ...props }: TextInputProps & { label: string; error?: string; focusError?: boolean }) {
  const ref = useRef<TextInput>(null);
  const previousError = useRef<string | undefined>(undefined);
  useEffect(() => { if (error && focusError && !previousError.current) ref.current?.focus(); previousError.current = error; }, [error, focusError]);
  return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput ref={ref} accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} style={[s.input, props.style, error && s.invalid]} />{error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}</View>;
}
const s = StyleSheet.create({ field: { marginBottom: 14 }, label: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.ink, marginBottom: 7 }, input: { minHeight: 50, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.surface, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink }, invalid: { borderColor: colors.accent, backgroundColor: colors.coralSoft }, error: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.accentStrong, marginTop: 6 } });
