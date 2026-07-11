import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { colors } from "../theme/tokens";

export type FilterState = {
  sort: string;
  country: string;
  course: string;
  universityType: string;
  feeRange: string;
};

export const DEFAULT_FILTERS: FilterState = {
  sort: "",
  country: "",
  course: "",
  universityType: "",
  feeRange: "",
};

export const FEE_RANGES = [
  { label: "Any budget",     value: "",     feeMin: undefined, feeMax: undefined },
  { label: "Under $5k/yr",  value: "u5k",  feeMin: undefined, feeMax: 5000 },
  { label: "$5k – $10k/yr", value: "5-10k", feeMin: 5000,     feeMax: 10000 },
  { label: "$10k – $20k/yr",value: "10-20k",feeMin: 10000,    feeMax: 20000 },
  { label: "Over $20k/yr",  value: "o20k", feeMin: 20000,     feeMax: undefined },
];

export const SORT_OPTIONS = [
  { label: "Recommended",  value: "" },
  { label: "Lowest fee",   value: "tuition_asc" },
  { label: "Highest fee",  value: "tuition_desc" },
  { label: "A – Z",        value: "name_asc" },
];

type Options = {
  countries: { slug: string; name: string }[];
  courses: { slug: string; shortName: string }[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onApply: () => void;
  options: Options;
  totalItems: number;
};

// ─── Pill ─────────────────────────────────────────────────────────────────────

function Pill({
  label, selected, onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync(); onPress(); }}
      style={[p.pill, selected && p.selected]}
    >
      {selected && <Ionicons name="checkmark" size={11} color={colors.primary} style={p.check} />}
      <Text style={[p.label, selected && p.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const p = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 5,
  },
  selected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  check: {},
  label: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  labelSelected: {
    color: colors.primary,
  },
});

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sec.wrap}>
      <Text style={sec.title}>{title}</Text>
      <View style={sec.pills}>{children}</View>
    </View>
  );
}

const sec = StyleSheet.create({
  wrap: { gap: 10 },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
  },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});

// ─── Sheet ────────────────────────────────────────────────────────────────────

export function FiltersSheet({ visible, onClose, filters, onChange, onApply, options, totalItems }: Props) {
  const insets = useSafeAreaInsets();

  function set(key: keyof FilterState, value: string) {
    onChange({ ...filters, [key]: filters[key] === value ? "" : value });
  }

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[s.root, { paddingBottom: insets.bottom + 16 }]}>
        {/* Handle */}
        <View style={s.handle} />

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Filter results</Text>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); onChange(DEFAULT_FILTERS); }}
            hitSlop={10}
          >
            <Text style={[s.reset, activeCount > 0 && s.resetActive]}>Reset all</Text>
          </Pressable>
        </View>

        {/* Filters */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          alwaysBounceVertical
          overScrollMode="always"
          keyboardShouldPersistTaps="handled"
        >
          {/* Sort */}
          <Section title="SORT BY">
            {SORT_OPTIONS.map(o => (
              <Pill key={o.value} label={o.label} selected={filters.sort === o.value} onPress={() => set("sort", o.value)} />
            ))}
          </Section>

          {/* Country */}
          {options.countries.length > 0 && (
            <Section title="COUNTRY">
              {options.countries.map(c => (
                <Pill key={c.slug} label={c.name} selected={filters.country === c.slug} onPress={() => set("country", c.slug)} />
              ))}
            </Section>
          )}

          {/* Course */}
          {options.courses.length > 0 && (
            <Section title="COURSE">
              {options.courses.map(c => (
                <Pill key={c.slug} label={c.shortName} selected={filters.course === c.slug} onPress={() => set("course", c.slug)} />
              ))}
            </Section>
          )}

          {/* University type */}
          <Section title="UNIVERSITY TYPE">
            {["Public", "Private"].map(t => (
              <Pill key={t} label={t} selected={filters.universityType === t} onPress={() => set("universityType", t)} />
            ))}
          </Section>

          {/* Annual budget */}
          <Section title="ANNUAL BUDGET">
            {FEE_RANGES.map(r => (
              <Pill key={r.value} label={r.label} selected={filters.feeRange === r.value} onPress={() => set("feeRange", r.value)} />
            ))}
          </Section>
        </ScrollView>

        {/* Apply CTA */}
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onApply(); }}
          style={({ pressed }) => [s.applyBtn, pressed && s.applyPressed]}
        >
          <Text style={s.applyLabel}>
            Show {totalItems > 0 ? `${totalItems.toLocaleString()} ` : ""}universities
          </Text>
          {activeCount > 0 && (
            <View style={s.applyBadge}>
              <Text style={s.applyBadgeText}>{activeCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0d1a17",
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 26,
    color: "#fff",
    letterSpacing: -0.4,
  },
  reset: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "rgba(255,255,255,0.3)",
  },
  resetActive: {
    color: colors.coral,
  },

  scroll: { flex: 1, minHeight: 0 },
  scrollContent: { flexGrow: 1, gap: 26, paddingBottom: 24 },

  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.coral,
    borderRadius: 16,
    height: 54,
    marginTop: 16,
  },
  applyPressed: { opacity: 0.88 },
  applyLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#fff",
  },
  applyBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  applyBadgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: "#fff",
  },
});
