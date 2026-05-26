import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import type { University } from "../types/domain";
import { mobileClient } from "../api/mobileClient";
import { useToast } from "./Toast";
import { useCompare } from "../context/CompareContext";
import { colors, shadow } from "../theme/tokens";

type Tone = "green" | "blue" | "coral";

const TONE_GRADIENT: Record<Tone, [string, string]> = {
  green: ["#0a2620", "#0f3d37"],
  blue:  ["#0f3d37", "#1c6b5f"],
  coral: ["#c04d28", "#d95f38"],
};

function formatFee(usd: number) {
  return `$${usd.toLocaleString("en-US")}/yr`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");
}

type Props = {
  university: University;
  onShortlistChange?: (slug: string, isShortlisted: boolean) => void;
};

export function UniversityCard({ university, onShortlistChange }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { add: compareAdd, remove: compareRemove, isIn: compareIsIn, items: compareItems } = useCompare();
  const inCompare = compareIsIn(university.slug);
  const [imgError, setImgError] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Initialize from shortlists cache if available, otherwise from prop
  const [saved, setSaved] = useState(() => {
    const cached = queryClient.getQueryData<University[]>(["shortlists"]);
    return cached?.some(u => u.slug === university.slug) ?? (university.isShortlisted ?? false);
  });

  // Subscribe to shortlists cache updates reactively (enabled:false = read-only, no fetch)
  const { data: shortlists } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => mobileClient.getShortlists(),
    enabled: false,
  });
  useEffect(() => {
    if (!toggling && shortlists !== undefined) {
      setSaved(shortlists.some(u => u.slug === university.slug));
    }
  }, [shortlists, toggling, university.slug]);

  const showImage = !imgError && !!university.logoUrl;
  const tone = university.imageTone as Tone;

  async function handleBookmark() {
    if (toggling) return;
    Haptics.impactAsync(saved ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    const next = !saved;
    setSaved(next); // optimistic
    showToast(next ? "Added to shortlist" : "Removed from shortlist", next ? "add" : "remove");
    onShortlistChange?.(university.slug, next);
    setToggling(true);
    try {
      if (next) {
        await mobileClient.addShortlist(university.slug);
      } else {
        await mobileClient.removeShortlist(university.slug);
      }
      queryClient.invalidateQueries({ queryKey: ["shortlists"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch {
      setSaved(!next); // revert on error
      onShortlistChange?.(university.slug, !next);
    } finally {
      setToggling(false);
    }
  }

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        router.push(`/university/${university.slug}`);
      }}
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      {/* ── Visual ── */}
      {showImage ? (
        <View style={s.visual}>
          <Image
            source={{ uri: university.logoUrl! }}
            style={s.logo}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        </View>
      ) : (
        <LinearGradient
          colors={TONE_GRADIENT[tone]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.visual}
        >
          <Text style={s.initials}>{getInitials(university.name)}</Text>
        </LinearGradient>
      )}

      {/* ── Body ── */}
      <View style={s.body}>
        <View style={s.nameRow}>
          <Text style={s.name} numberOfLines={2}>{university.name}</Text>

          <View style={s.actionBtns}>
            {/* Compare toggle — always visible */}
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                if (inCompare) {
                  compareRemove(university.slug);
                } else if (compareItems.length < 3) {
                  compareAdd({ slug: university.slug, name: university.name, country: university.country, tuitionUsd: university.tuitionUsd });
                } else {
                  showToast("Max 3 universities to compare", "remove");
                }
              }}
              hitSlop={8}
              style={[s.compareBtn, inCompare && s.compareBtnActive]}
            >
              <Ionicons
                name={inCompare ? "git-compare" : "git-compare-outline"}
                size={14}
                color={inCompare ? colors.primary : "rgba(255,255,255,0.7)"}
              />
            </Pressable>

            {/* Bookmark button */}
            <Pressable
              onPress={handleBookmark}
              hitSlop={8}
              style={[s.bookmarkBtn, saved && s.bookmarkBtnSaved]}
            >
              <Ionicons
                name={saved ? "bookmark" : "bookmark-outline"}
                size={15}
                color={saved ? "#fff" : "rgba(255,255,255,0.7)"}
              />
            </Pressable>
          </View>
        </View>

        <View style={s.locationRow}>
          <Ionicons name="location-outline" size={12} color={colors.faint} />
          <Text style={s.location} numberOfLines={1}>
            {university.city}, {university.country}
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.fee}>{formatFee(university.tuitionUsd)}</Text>
          {university.course && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{university.course}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },

  visual: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  logo: { width: 48, height: 48 },
  initials: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 20,
    color: "#fff",
    letterSpacing: 1,
  },

  body: { flex: 1, gap: 5 },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },
  compareBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  compareBtnActive: {
    backgroundColor: colors.primarySoft,
  },
  name: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },

  bookmarkBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: -1,
  },
  bookmarkBtnSaved: {
    backgroundColor: colors.coral,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  location: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.faint,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  fee: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 10,
    color: colors.primary,
  },
});
