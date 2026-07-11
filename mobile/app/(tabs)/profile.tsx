import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";

import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

import { mobileClient } from "../../src/api/mobileClient";
import { colors, shadow } from "../../src/theme/tokens";
import { Skeleton } from "../../src/components/Skeleton";

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;
const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";
const APP_BUILD = Platform.OS === "android"
  ? Constants.expoConfig?.android?.versionCode
  : Constants.expoConfig?.ios?.buildNumber;

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// ── Field edit modal ──────────────────────────────────────────────────────────

type FieldConfig = {
  key: "name" | "phone";
  title: string;
  hint?: string;
  keyboardType: "default" | "phone-pad" | "numeric";
  placeholder: string;
  autoCapitalize?: "none" | "words" | "sentences";
};

const FIELD_CONFIGS: FieldConfig[] = [
  { key: "name",      title: "Full name",    keyboardType: "default", placeholder: "Your full name", autoCapitalize: "words" },
  { key: "phone",     title: "Phone number", hint: "We'll use this to call you back", keyboardType: "phone-pad", placeholder: "+91 98765 43210", autoCapitalize: "none" },
];

type EditModalProps = {
  field: FieldConfig | null;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => Promise<void>;
};

function FieldEditModal({ field, initialValue, onClose, onSave }: EditModalProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue, field]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave(value);
      onClose();
    } catch {
      setError("Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!field) return null;

  return (
    <Modal
      visible={!!field}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => setTimeout(() => inputRef.current?.focus(), 100)}
    >
      {/* Backdrop */}
      <Pressable style={m.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={m.sheet}
      >
        <View style={[m.card, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {/* Handle */}
          <View style={m.handle} />

          {/* Header */}
          <View style={m.header}>
            <Text style={m.title}>{field.title}</Text>
            <Pressable onPress={onClose} hitSlop={12} style={m.closeBtn}>
              <Ionicons name="close" size={18} color={colors.muted} />
            </Pressable>
          </View>

          {field.hint && <Text style={m.hint}>{field.hint}</Text>}

          {/* Input */}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={setValue}
            placeholder={field.placeholder}
            placeholderTextColor={colors.faint}
            keyboardType={field.keyboardType}
            autoCapitalize={field.autoCapitalize ?? "none"}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            style={m.input}
          />

          {error && <Text style={m.error}>{error}</Text>}

          {/* Save */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => [m.saveBtn, (pressed || saving) && m.saveBtnPressed]}
          >
            <Text style={m.saveBtnLabel}>{saving ? "Saving…" : "Save"}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Settings rows ─────────────────────────────────────────────────────────────

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | null;
  onPress?: () => void;
  last?: boolean;
  danger?: boolean;
};

function SettingsRow({ icon, label, value, onPress, last, danger }: RowProps) {
  const iconColor = danger ? "#dc2626" : colors.primary;
  const iconBg    = danger ? "#fef2f2" : colors.primarySoft;
  return (
    <Pressable
      onPress={() => { if (onPress) { Haptics.selectionAsync(); onPress(); } }}
      style={({ pressed }) => [row.wrap, last && row.wrapLast, pressed && onPress && row.pressed]}
    >
      <View style={[row.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={17} color={iconColor} />
      </View>
      <Text style={[row.label, danger && row.dangerLabel]}>{label}</Text>
      <View style={row.right}>
        {value ? <Text style={row.value} numberOfLines={1}>{value}</Text> : null}
        {onPress && !danger ? <Ionicons name="chevron-forward" size={15} color={colors.faint} /> : null}
      </View>
      {!last && <View style={row.sep} />}
    </Pressable>
  );
}

const row = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    position: "relative",
  },
  wrapLast: {},
  pressed: { backgroundColor: colors.background },
  iconWrap: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
  },
  label: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 15,
    color: colors.ink,
  },
  dangerLabel: { color: "#dc2626" },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  value: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.faint,
    maxWidth: 140,
  },
  sep: {
    position: "absolute",
    bottom: 0, left: 60, right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
  },
});

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return <View style={grp.wrap}>{children}</View>;
}

const grp = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    ...shadow,
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mobileClient.getProfile(),
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const { data: shortlists } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => mobileClient.getShortlists(),
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: applications } = useQuery({
    queryKey: ["applications"],
    queryFn: () => mobileClient.getApplications(),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const loadingProfile = profileLoading && !profile;

  const [activeField, setActiveField] = useState<FieldConfig | null>(null);

  const name = profile?.name ?? "Student";
  const email = profile?.email ?? "";

  function openField(key: FieldConfig["key"]) {
    Haptics.selectionAsync();
    setActiveField(FIELD_CONFIGS.find(f => f.key === key) ?? null);
  }

  function getInitialValue(key: FieldConfig["key"]): string {
    if (!profile) return "";
    if (key === "name") return profile.name ?? "";
    if (key === "phone") return profile.phone ?? "";
    return "";
  }

  async function handleSave(value: string) {
    if (!activeField) return;
    const patch: Record<string, unknown> = {};
    if (activeField.key === "name") patch.name = value;
    else if (activeField.key === "phone") patch.phone = value;
    await mobileClient.updateProfile(patch as Parameters<typeof mobileClient.updateProfile>[0]);
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }

  async function handleSignOut() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await mobileClient.logout();
    queryClient.clear();
    router.replace("/(auth)/welcome");
  }

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* Dark gradient header — light status bar icons */}
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Branded header ── */}
        <LinearGradient
          colors={["#0a2620", "#0f3d37"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.headerGrad}
        >
          <SafeAreaView edges={["top"]}>
            <View style={s.headerInner}>
              {loadingProfile ? (
                <>
                  <Skeleton width={76} height={76} borderRadius={23} light style={{ marginBottom: 14 }} />
                  <Skeleton width={160} height={22} borderRadius={6} light style={{ marginBottom: 8 }} />
                  <Skeleton width={120} height={14} borderRadius={5} light style={{ marginBottom: 20 }} />
                  <View style={[s.statsRow, { gap: 24 }]}>
                    <Skeleton width={90} height={16} borderRadius={5} light />
                    <Skeleton width={110} height={16} borderRadius={5} light />
                  </View>
                </>
              ) : (
                <>
                  <View style={s.avatarRing}>
                    <Pressable
                      onPress={() => openField("name")}
                      style={s.avatar}
                    >
                      <Text style={s.avatarText}>{initials(name)}</Text>
                    </Pressable>
                  </View>
                  <Text style={s.name}>{name}</Text>
                  <Text style={s.email}>{email}</Text>

                  <View style={s.statsRow}>
                    <Pressable onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/shortlists"); }} style={s.statPill}>
                      <Ionicons name="bookmark" size={13} color={colors.mint} />
                      <Text style={s.statLabel}>
                        {shortlists !== undefined ? shortlists.length : "–"} Saved
                      </Text>
                    </Pressable>
                    <View style={s.statDot} />
                    <Pressable onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/applications"); }} style={s.statPill}>
                      <Ionicons name="document-text" size={13} color={colors.mint} />
                      <Text style={s.statLabel}>
                        {applications !== undefined ? applications.length : "–"} Applications
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── Settings ── */}
        <View style={s.content}>
          {loadingProfile ? (
            <>
              <Skeleton width={80} height={10} borderRadius={4} style={{ marginTop: 8, marginBottom: 10, marginLeft: 4 }} />
              <View style={grp.wrap}>
                {[0, 1, 2, 3].map(i => (
                  <View key={i} style={[sk.row, i < 3 && sk.rowBorder]}>
                    <Skeleton width={32} height={32} borderRadius={9} />
                    <View style={sk.rowText}>
                      <Skeleton width={90} height={13} borderRadius={4} />
                      <Skeleton width={70} height={11} borderRadius={4} style={{ marginTop: 5 }} />
                    </View>
                  </View>
                ))}
              </View>
              <Skeleton width={80} height={10} borderRadius={4} style={{ marginTop: 16, marginBottom: 10, marginLeft: 4 }} />
              <View style={grp.wrap}>
                {[0, 1].map(i => (
                  <View key={i} style={[sk.row, i < 1 && sk.rowBorder]}>
                    <Skeleton width={32} height={32} borderRadius={9} />
                    <Skeleton width={120} height={13} borderRadius={4} />
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={s.sectionLabel}>MY DETAILS</Text>
              <SettingsGroup>
                <SettingsRow
                  icon="person-outline"
                  label="Name"
                  value={profile?.name ?? "Add name"}
                  onPress={() => openField("name")}
                />
                <SettingsRow
                  icon="call-outline"
                  label="Phone"
                  value={profile?.phone ?? "Add phone"}
                  onPress={() => openField("phone")}
                  last
                />
              </SettingsGroup>

              {(profile?.preferredCountries?.length ?? 0) > 0 && (
                <>
                  <Text style={s.sectionLabel}>PREFERENCES</Text>
                  <SettingsGroup>
                    <SettingsRow
                      icon="earth-outline"
                      label="Preferred countries"
                      value={(profile?.preferredCountries ?? []).join(", ")}
                      last
                    />
                  </SettingsGroup>
                </>
              )}
            </>
          )}

          <Text style={s.sectionLabel}>SUPPORT</Text>
          <SettingsGroup>
            <SettingsRow
              icon="chatbubble-ellipses-outline"
              label="Talk to counsellor"
              onPress={() => router.push("/counselling")}
            />
            <SettingsRow
              icon="help-circle-outline"
              label="Help & FAQ"
              onPress={() => router.push("/help")}
              last
            />
          </SettingsGroup>

          <Text style={s.sectionLabel}>ACCOUNT</Text>
          <SettingsGroup>
            <SettingsRow
              icon="log-out-outline"
              label="Sign out"
              onPress={handleSignOut}
              danger
              last
            />
          </SettingsGroup>

          <Text style={s.version}>
            Students Traffic · v{APP_VERSION}{APP_BUILD != null ? ` · Build ${APP_BUILD}` : ""}
          </Text>
        </View>
      </ScrollView>

      {/* ── Field edit modal ── */}
      <FieldEditModal
        field={activeField}
        initialValue={activeField ? getInitialValue(activeField.key) : ""}
        onClose={() => setActiveField(null)}
        onSave={handleSave}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },

  headerGrad: {},
  headerInner: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },

  avatarRing: {
    width: 84, height: 84, borderRadius: 26,
    borderWidth: 2,
    borderColor: "rgba(124,207,191,0.35)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 76, height: 76, borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 28,
    color: "#fff",
    letterSpacing: 1,
  },

  name: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 24,
    color: "#fff",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  email: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 20,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statPill: { flexDirection: "row", alignItems: "center", gap: 6 },
  statLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
  statDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.25)" },

  content: { paddingHorizontal: 20, gap: 8, paddingTop: 20 },
  sectionLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    color: colors.faint,
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 6,
    marginLeft: 4,
  },
  version: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.faint,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 4,
  },
});

const sk = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rowText: { gap: 0 },
});

const m = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    alignSelf: "center",
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: colors.background,
    alignItems: "center", justifyContent: "center",
  },
  hint: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.muted,
    marginBottom: 16,
    lineHeight: 19,
  },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: colors.ink,
    marginBottom: 12,
  },
  error: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.coral,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 4,
  },
  saveBtnPressed: { opacity: 0.8 },
  saveBtnLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#fff",
  },
});
