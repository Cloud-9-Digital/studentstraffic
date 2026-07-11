import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../src/api/mobileClient";
import { colors, shadow } from "../src/theme/tokens";

const COUNSELLOR_PHONE = "+919176162888";
const WHATSAPP_URL = `https://wa.me/919176162888?text=Hi%2C+I%27m+exploring+study+abroad+options.+Can+you+help+me%3F`;

export default function CounsellingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mobileClient.getProfile(),
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const hasPhone = !!(profile?.phone?.trim());
  const profileLoaded = profile !== undefined;

  function handleCall() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${COUNSELLOR_PHONE}`);
  }

  function handleWhatsApp() {
    Haptics.selectionAsync();
    Linking.openURL(WHATSAPP_URL);
  }

  return (
    <View style={[s.root, { paddingBottom: insets.bottom + 16 }]}>
      {/* Handle */}
      <View style={s.handle} />

      {/* Close */}
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={({ pressed }) => [s.closeBtn, pressed && s.closeBtnPressed]}
      >
        <Ionicons name="close" size={20} color={colors.muted} />
      </Pressable>

      {profileLoaded && hasPhone ? (
        /* ── Profile complete ── */
        <>
          <View style={s.iconWrap}>
            <Ionicons name="chatbubble-ellipses" size={32} color={colors.primary} />
          </View>
          <Text style={s.title}>We'll be in touch</Text>
          <Text style={s.body}>
            One of our counsellors will call you on{" "}
            <Text style={s.highlight}>{profile!.phone}</Text> shortly. It's completely free.
          </Text>

          <View style={s.actions}>
            <Pressable
              onPress={handleCall}
              style={({ pressed }) => [s.primaryBtn, pressed && s.primaryBtnPressed]}
            >
              <Ionicons name="call" size={18} color="#fff" />
              <Text style={s.primaryBtnLabel}>Call now</Text>
            </Pressable>

            <Pressable
              onPress={handleWhatsApp}
              style={({ pressed }) => [s.whatsappBtn, pressed && s.whatsappBtnPressed]}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
              <Text style={s.whatsappBtnLabel}>WhatsApp us</Text>
            </Pressable>
          </View>

          <Text style={s.note}>
            Available Mon–Sat, 9 AM – 7 PM IST
          </Text>
        </>
      ) : (
        /* ── Profile incomplete ── */
        <>
          <View style={s.iconWrap}>
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </View>
          <Text style={s.title}>Complete your profile first</Text>
          <Text style={s.body}>
            Add your phone number so our counsellors know how to reach you. It only takes a moment.
          </Text>

          <View style={s.actions}>
            <Pressable
              onPress={() => { router.back(); setTimeout(() => router.push("/profile/edit"), 300); }}
              style={({ pressed }) => [s.primaryBtn, pressed && s.primaryBtnPressed]}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={s.primaryBtnLabel}>Complete profile</Text>
            </Pressable>

            <Pressable
              onPress={handleCall}
              style={({ pressed }) => [s.secondaryBtn, pressed && s.secondaryBtnPressed]}
            >
              <Ionicons name="call-outline" size={18} color={colors.primary} />
              <Text style={s.secondaryBtnLabel}>Call us directly</Text>
            </Pressable>
          </View>

          <Text style={s.note}>
            Or call us: {COUNSELLOR_PHONE}
          </Text>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginBottom: 16,
  },

  closeBtn: {
    alignSelf: "flex-end",
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  closeBtnPressed: { opacity: 0.7 },

  iconWrap: {
    width: 68, height: 68, borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: "center", justifyContent: "center",
    marginBottom: 20,
    ...shadow,
  },

  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 26,
    color: colors.ink,
    letterSpacing: -0.3,
    marginBottom: 10,
    lineHeight: 32,
  },

  body: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    color: colors.muted,
    lineHeight: 23,
    marginBottom: 28,
  },
  highlight: {
    fontFamily: "PlusJakartaSans-Bold",
    color: colors.ink,
  },

  actions: { gap: 10 },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
  },
  primaryBtnPressed: { opacity: 0.85 },
  primaryBtnLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#fff",
  },

  whatsappBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    paddingVertical: 15,
  },
  whatsappBtnPressed: { opacity: 0.85 },
  whatsappBtnLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#15803d",
  },

  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    paddingVertical: 15,
  },
  secondaryBtnPressed: { opacity: 0.85 },
  secondaryBtnLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: colors.primary,
  },

  note: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.faint,
    textAlign: "center",
    marginTop: 16,
  },
});
