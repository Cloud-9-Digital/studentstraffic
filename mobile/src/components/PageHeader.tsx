import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme/tokens";

/** Shared page hierarchy; callers own safe-area and navigation controls. */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <View style={s.header}><View style={s.row}><Text accessibilityRole="header" style={s.title}>{title}</Text>{action}</View>{subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}</View>;
}
const s = StyleSheet.create({
  header: { paddingHorizontal: spacing.screenX, paddingTop: 12, paddingBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 40 },
  title: { flex: 1, fontFamily: "Fraunces-SemiBold", fontSize: 30, lineHeight: 38, letterSpacing: -0.5, color: colors.ink },
  subtitle: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 21, color: colors.muted, marginTop: 6 },
});
