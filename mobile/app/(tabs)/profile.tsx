import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { FLOATING_TAB_INSET } from "../../src/components/FloatingTabBar";
import { colors, shadow } from "../../src/theme/tokens";

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  label: string;
  value?: string | null;
  onPress?: () => void;
  last?: boolean;
  danger?: boolean;
};

function SettingsRow({ icon, iconBg, label, value, onPress, last, danger }: RowProps) {
  return (
    <Pressable
      onPress={() => { if (onPress) { Haptics.selectionAsync(); onPress(); } }}
      style={({ pressed }) => [row.wrap, last && row.wrapLast, pressed && onPress && row.pressed]}
    >
      <View style={[row.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={17} color={danger ? "#dc2626" : colors.primary} />
      </View>
      <Text style={[row.label, danger && row.danger]}>{label}</Text>
      <View style={row.right}>
        {value ? <Text style={row.value} numberOfLines={1}>{value}</Text> : null}
        {onPress ? <Ionicons name="chevron-forward" size={16} color={colors.faint} /> : null}
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
    paddingVertical: 13,
    backgroundColor: colors.surface,
    position: "relative",
  },
  wrapLast: {},
  pressed: { backgroundColor: colors.background },
  iconWrap: {
    width: 32, height: 32, borderRadius: 9,
    alignItems: "center", justifyContent: "center",
  },
  label: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 15,
    color: colors.ink,
  },
  danger: { color: "#dc2626" },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  value: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.faint,
    maxWidth: 140,
  },
  sep: {
    position: "absolute",
    bottom: 0,
    left: 60,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
  },
});

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <View style={group.wrap}>
      {children}
    </View>
  );
}

const group = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    ...shadow,
  },
});

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mobileClient.getProfile(),
  });

  const name = profile?.name ?? "Student";
  const email = profile?.email ?? "";

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* ── Fixed header ── */}
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.headerRow}>
          <Text style={s.title}>Profile</Text>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); router.push("/profile/edit"); }}
            style={({ pressed }) => [s.editBtn, pressed && s.editBtnPressed]}
          >
            <Text style={s.editBtnLabel}>Edit</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: Platform.OS === "ios" ? FLOATING_TAB_INSET + 16 : insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar block */}
        <View style={s.avatarBlock}>
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials(name)}</Text>
            </View>
            <Pressable
              style={s.avatarEditDot}
              onPress={() => { Haptics.selectionAsync(); router.push("/profile/edit"); }}
            >
              <Ionicons name="pencil" size={10} color="#fff" />
            </Pressable>
          </View>
          <Text style={s.name}>{name}</Text>
          <Text style={s.email}>{email}</Text>
        </View>

        {/* My details */}
        <Text style={s.sectionLabel}>MY DETAILS</Text>
        <SettingsGroup>
          <SettingsRow
            icon="call-outline" iconBg={colors.primarySoft}
            label="Phone" value={profile?.phone ?? "Add phone"}
            onPress={() => router.push("/profile/edit")}
          />
          <SettingsRow
            icon="trophy-outline" iconBg={colors.amberSoft}
            label="NEET Score" value={profile?.neetScore ? String(profile.neetScore) : "Not added"}
            onPress={() => router.push("/profile/edit")}
          />
          <SettingsRow
            icon="wallet-outline" iconBg={colors.blueSoft}
            label="Budget" value={profile?.budgetUsd ? `$${profile.budgetUsd.toLocaleString()}` : "Not added"}
            onPress={() => router.push("/profile/edit")}
            last
          />
        </SettingsGroup>

        {/* Preferences */}
        {(profile?.preferredCountries?.length ?? 0) > 0 && (
          <>
            <Text style={s.sectionLabel}>PREFERENCES</Text>
            <SettingsGroup>
              <SettingsRow
                icon="earth-outline" iconBg={colors.primarySoft}
                label="Preferred countries"
                value={(profile?.preferredCountries ?? []).join(", ")}
                onPress={() => router.push("/profile/edit")}
                last
              />
            </SettingsGroup>
          </>
        )}

        {/* Support */}
        <Text style={s.sectionLabel}>SUPPORT</Text>
        <SettingsGroup>
          <SettingsRow
            icon="chatbubble-ellipses-outline" iconBg={colors.primarySoft}
            label="Talk to counsellor"
            onPress={() => router.push("/counselling")}
          />
          <SettingsRow
            icon="help-circle-outline" iconBg={colors.blueSoft}
            label="Help & FAQ"
            onPress={() => {}}
            last
          />
        </SettingsGroup>

        {/* Account */}
        <Text style={s.sectionLabel}>ACCOUNT</Text>
        <SettingsGroup>
          <SettingsRow
            icon="create-outline" iconBg={colors.primarySoft}
            label="Edit profile"
            onPress={() => router.push("/profile/edit")}
          />
          <SettingsRow
            icon="log-out-outline" iconBg="#fef2f2"
            label="Sign out"
            danger
            onPress={async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await mobileClient.logout();
              router.replace("/(auth)/welcome");
            }}
            last
          />
        </SettingsGroup>

        <Text style={s.version}>Students Traffic · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  headerSafe: {},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  editBtnPressed: { opacity: 0.75 },
  editBtnLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: colors.primary,
  },

  scroll: { paddingHorizontal: 20, gap: 8 },

  // Avatar block
  avatarBlock: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
    marginBottom: 8,
  },
  avatarWrap: { position: "relative", marginBottom: 4 },
  avatar: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 30, color: "#fff" },
  avatarEditDot: {
    position: "absolute",
    bottom: -2, right: -2,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.coral,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: BG,
  },
  name: { fontFamily: "PlusJakartaSans-Bold", fontSize: 20, color: colors.ink },
  email: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.muted },

  // Section labels
  sectionLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    color: colors.faint,
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 6,
    marginLeft: 4,
  },

  version: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.faint,
    textAlign: "center",
    marginTop: 16,
  },
});
