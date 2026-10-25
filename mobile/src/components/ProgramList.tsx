import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "../theme/tokens";
import type { Offering } from "../types/domain";
import { hasAnnualFeeSuffix } from "../lib/program-fees";

const VISIBLE_ROWS = 5;

// Lists every programme instead of highlighting one: level chips, compact rows, tap a row for its
// duration, language and intake, and "See all" opens the searchable picker.
export function ProgramList({
  programs,
  universityName,
  selectedSlug,
  onSelect,
  onSeeAll,
}: {
  programs: Offering[];
  universityName: string;
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  onSeeAll: () => void;
}) {
  const [activeLevel, setActiveLevel] = useState<string>("all");
  // Offering titles often end with ", <University name>", which repeats on the university's own screen.
  const shortTitle = (title: string) => title.endsWith(`, ${universityName}`) ? title.slice(0, -(universityName.length + 2)) : title;

  const levels = useMemo(() => {
    const labels = new Map<string, string>();
    for (const program of programs) {
      if (program.level && !labels.has(program.level)) labels.set(program.level, program.levelLabel ?? program.level);
    }
    return [...labels].map(([level, label]) => ({ level, label }));
  }, [programs]);

  const filtered = activeLevel === "all" ? programs : programs.filter(program => program.level === activeLevel);
  // A programme picked from "See all" is pinned to the top so its details are visible.
  const selected = selectedSlug ? filtered.find(program => program.slug === selectedSlug) : undefined;
  const rows = selected
    ? [selected, ...filtered.filter(program => program.slug !== selected.slug)].slice(0, VISIBLE_ROWS)
    : filtered.slice(0, VISIBLE_ROWS);

  return (
    <View>
      {levels.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {[{ level: "all", label: "All" }, ...levels].map(option => {
            const active = activeLevel === option.level;
            return (
              <Pressable
                key={option.level}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => { setActiveLevel(option.level); onSelect(null); Haptics.selectionAsync(); }}
                style={[s.chip, active && s.chipActive]}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      <View style={s.list}>
        {rows.map((program, index) => {
          const open = program.slug === selectedSlug;
          const meta = [program.levelLabel, program.durationYears ? `${program.durationYears} years` : null, program.feeLines ? null : (program.feeLabel ?? program.annualFeeLabel)]
            .filter(Boolean)
            .join(" · ");
          return (
            <View key={program.slug} style={[s.row, index > 0 && s.rowDivider]}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                accessibilityLabel={`${shortTitle(program.title)}. ${meta}${program.feeLines?.length ? `. ${program.feeLines.map(fee => `${fee.label} ${fee.amount}${hasAnnualFeeSuffix(program, fee.amount) ? " a year" : ""}`).join(", ")}` : ""}`}
                onPress={() => { onSelect(open ? null : program.slug); Haptics.selectionAsync(); }}
                style={s.rowHead}
              >
                <View style={s.rowTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.title} numberOfLines={2}>{shortTitle(program.title)}</Text>
                    {meta ? <Text style={s.meta}>{meta}</Text> : null}
                  </View>
                  <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} style={{ marginTop: 2 }} />
                </View>
                {program.feeLines?.length ? (
                    <View style={s.fees}>
                      {program.feeLines.map((fee, feeIndex) => (
                        <View key={fee.label} style={[s.fee, feeIndex > 0 && s.feeDivider]}>
                          <Text style={s.feeLabel} numberOfLines={1}>{fee.label}</Text>
                          <Text style={s.feeAmount}>
                            {fee.amount}
                            {hasAnnualFeeSuffix(program, fee.amount) ? <Text style={s.feePer}> / year</Text> : null}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
              </Pressable>
              {open ? (
                <View style={s.facts}>
                  <Fact icon="time-outline" label="Duration" value={program.durationYears ? `${program.durationYears} years` : "Not confirmed"} />
                  <Fact icon="language-outline" label="Language" value={program.medium || "Not confirmed"} />
                  {program.intakeMonths?.length ? <Fact icon="calendar-outline" label="Intake" value={program.intakeMonths.join(", ")} /> : null}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {filtered.length > VISIBLE_ROWS ? (
        <Pressable accessibilityRole="button" onPress={onSeeAll} style={s.seeAll}>
          <Text style={s.seeAllText}>See all programs</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

function Fact({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={s.fact}>
      <Ionicons name={icon} size={16} color={colors.muted} />
      <Text style={s.factLabel}>{label}</Text>
      <Text style={s.factValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  chips: { gap: 8, paddingTop: 14, paddingBottom: 2 },
  chip: { minHeight: 36, justifyContent: "center", paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.muted },
  chipTextActive: { color: "#fff" },
  list: { marginTop: 12 },
  row: { paddingVertical: 4 },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  rowHead: { minHeight: 52, paddingVertical: 8 },
  // Title and chevron share the top line; the fee panel below uses the full row width.
  rowTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  title: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 14, lineHeight: 20, color: colors.ink },
  meta: { marginTop: 2, fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 18, color: colors.muted },
  // Fees side by side (Indian students | NRI & international), matching the website card.
  fees: { marginTop: 8, flexDirection: "row", borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, backgroundColor: colors.background },
  fee: { flex: 1, paddingHorizontal: 10, paddingVertical: 7 },
  feeDivider: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.line },
  feeLabel: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.muted },
  feeAmount: { marginTop: 1, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.ink },
  feePer: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.muted },
  facts: { marginBottom: 8, borderRadius: 12, backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 4 },
  fact: { minHeight: 40, flexDirection: "row", alignItems: "center", gap: 8 },
  factLabel: { flex: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 13, color: colors.muted },
  factValue: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.ink },
  seeAll: { minHeight: 48, marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.line },
  seeAllText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 14, color: colors.primary },
});
