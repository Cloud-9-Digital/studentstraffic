import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { useCall } from "../../src/context/CallContext";
import { colors, shadow } from "../../src/theme/tokens";
import type { CallBooking } from "../../src/types/domain";

const AVATAR_COLORS = [
  "#0f3d37", "#c2410c", "#7c3aed", "#0369a1", "#047857",
];

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function PeerAvatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <View style={[av.wrap, { backgroundColor: avatarColor(name) }]}>
      <Text style={av.text}>{initials}</Text>
    </View>
  );
}

const av = StyleSheet.create({
  wrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  text: { fontFamily: "PlusJakartaSans-Bold", fontSize: 16, color: "#fff" },
});

function StatusBadge({ status }: { status: string }) {
  if (status === "accepted") {
    return (
      <View style={[badge.base, badge.accepted]}>
        <Ionicons name="checkmark-circle" size={11} color={colors.success} />
        <Text style={[badge.text, { color: colors.success }]}>Ready</Text>
      </View>
    );
  }
  if (status === "pending") {
    return (
      <View style={[badge.base, badge.pending]}>
        <Ionicons name="time" size={11} color={colors.amber} />
        <Text style={[badge.text, { color: colors.amber }]}>Pending</Text>
      </View>
    );
  }
  return (
    <View style={[badge.base, badge.declined]}>
      <Text style={[badge.text, { color: colors.muted }]}>Declined</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  accepted: { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" },
  pending:  { backgroundColor: colors.amberSoft, borderColor: "#fde68a" },
  declined: { backgroundColor: colors.line, borderColor: colors.line },
  text: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 11 },
});

function BookingCard({ booking }: { booking: CallBooking }) {
  const { startCall, isStarting, callError } = useCall();
  const isAccepted = booking.bookingStatus === "accepted";

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startCall(booking.bookingId, booking.fullName, booking.universityName);
  };

  return (
    <View style={card.row}>
      <PeerAvatar name={booking.fullName} />
      <View style={card.info}>
        <Text style={card.name} numberOfLines={1}>{booking.fullName}</Text>
        <Text style={card.sub} numberOfLines={1}>{booking.universityName}</Text>
        {booking.courseName && (
          <Text style={card.detail} numberOfLines={1}>{booking.courseName}</Text>
        )}
      </View>
      <View style={card.right}>
        <StatusBadge status={booking.bookingStatus} />
        {isAccepted && (
          <Pressable
            onPress={handleCall}
            disabled={isStarting}
            style={({ pressed }) => [card.callBtn, pressed && card.callBtnPressed, isStarting && card.callBtnDisabled]}
          >
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={card.callBtnText}>Call</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const card = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: colors.surface,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: colors.ink },
  sub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted, marginTop: 2 },
  detail: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, color: colors.faint, marginTop: 1 },
  right: { alignItems: "flex-end", gap: 8, flexShrink: 0 },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  callBtnPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  callBtnDisabled: { opacity: 0.5 },
  callBtnText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: "#fff" },
});

export default function CallsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { callError } = useCall();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["call-bookings"],
    queryFn: () => mobileClient.getCallBookings(),
    staleTime: 30_000,
  });

  const bookings = data ?? [];
  const accepted = bookings.filter((b) => b.bookingStatus === "accepted");
  const others = bookings.filter((b) => b.bookingStatus !== "accepted");

  return (
    <View style={s.root}>
      <SafeAreaView edges={["top"]} style={s.headerSafe}>
        <View style={s.header}>
          <Text style={s.title}>My Calls</Text>
        </View>
      </SafeAreaView>

      {callError && (
        <View style={s.errorBanner}>
          <Ionicons name="alert-circle" size={14} color="#b71c1c" />
          <Text style={s.errorText}>{callError}</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {isLoading ? (
          <View style={s.center}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : error ? (
          <View style={s.center}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.faint} />
            <Text style={s.emptyTitle}>Couldn't load calls</Text>
            <Text style={s.emptySub}>Sign in to see your booked guides.</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={s.emptyState}>
            <View style={s.emptyIcon}>
              <Ionicons name="call-outline" size={36} color={colors.primary} />
            </View>
            <Text style={s.emptyTitle}>No calls booked yet</Text>
            <Text style={s.emptySub}>
              Browse universities, find a student guide, and book a call to get first-hand advice.
            </Text>
            <Pressable
              onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/search"); }}
              style={({ pressed }) => [s.browseBtn, pressed && s.browseBtnPressed]}
            >
              <Text style={s.browseBtnText}>Browse universities</Text>
              <Ionicons name="arrow-forward" size={15} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <>
            {/* Ready to call */}
            {accepted.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionLabel}>Ready to call</Text>
                <View style={s.listCard}>
                  {accepted.map((b, i) => (
                    <View key={b.bookingId}>
                      {i > 0 && <View style={s.divider} />}
                      <BookingCard booking={b} />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Other bookings */}
            {others.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionLabel}>{accepted.length > 0 ? "Other requests" : "Booked guides"}</Text>
                <View style={s.listCard}>
                  {others.map((b, i) => (
                    <View key={b.bookingId}>
                      {i > 0 && <View style={s.divider} />}
                      <BookingCard booking={b} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  headerSafe: { backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.4,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fed7d7",
  },
  errorText: { fontFamily: "PlusJakartaSans-Medium", fontSize: 13, color: "#b71c1c", flex: 1 },

  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    color: colors.faint,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  listCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    ...shadow,
  },
  divider: { height: 1, backgroundColor: colors.line, marginLeft: 76 },

  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontFamily: "Fraunces-SemiBold", fontSize: 22, color: colors.ink, textAlign: "center" },
  emptySub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
  browseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 4,
  },
  browseBtnPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  browseBtnText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 14, color: "#fff" },
});
