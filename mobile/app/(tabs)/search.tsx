import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";

import { mobileClient } from "../../src/api/mobileClient";
import { CountryFlag } from "../../src/components/CountryFlag";
import { UniversityCard } from "../../src/components/UniversityCard";
import { IndiaCollegeCard } from "../../src/components/IndiaCollegeCard";
import { FiltersSheet, DEFAULT_FILTERS, FEE_RANGES } from "../../src/components/FiltersSheet";
import type { FilterState } from "../../src/components/FiltersSheet";
import type { IndiaCollege, University } from "../../src/types/domain";
import { colors } from "../../src/theme/tokens";

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

type Mode = "abroad" | "india";

// Fixed display order for abroad country filter chips
const COUNTRY_CHIP_ORDER = [
  "vietnam", "russia", "georgia", "kyrgyzstan", "uzbekistan",
];

/** Sort API countries: pinned order first, then alphabetical for any extras */
function sortCountries(
  countries: { slug: string; name: string }[],
): { slug: string; name: string }[] {
  return [...countries].sort((a, b) => {
    const ai = COUNTRY_CHIP_ORDER.indexOf(a.slug.toLowerCase());
    const bi = COUNTRY_CHIP_ORDER.indexOf(b.slug.toLowerCase());
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}

// Top Indian states by number of medical colleges
const INDIA_STATES = [
  "Tamil Nadu", "Maharashtra", "Karnataka", "Uttar Pradesh",
  "Andhra Pradesh", "Telangana", "Kerala", "West Bengal",
  "Rajasthan", "Gujarat", "Madhya Pradesh", "Delhi", "Punjab",
];

const INDIA_MANAGEMENT = ["Govt.", "Private"];
const UNIVERSITY_LIST_DRAW_DISTANCE = 600;

function ListSeparator() {
  return <View style={s.sep} />;
}

function appendUnique<T>(current: T[], incoming: T[], getKey: (item: T) => string) {
  const seen = new Set(current.map(getKey));
  return [...current, ...incoming.filter((item) => !seen.has(getKey(item)))];
}

type AbroadOptions = {
  countries: { slug: string; name: string }[];
  courses: { slug: string; shortName: string }[];
  mediums: string[];
  intakes: string[];
};

// ── Animated segment control ──────────────────────────────────────────────────

function SegmentControl({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const anim = useRef(new Animated.Value(mode === "india" ? 1 : 0)).current;
  const [wrapWidth, setWrapWidth] = useState(0);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: mode === "india" ? 1 : 0,
      useNativeDriver: true,
      tension: 130,
      friction: 15,
    }).start();
  }, [mode]);

  const pillWidth = wrapWidth > 0 ? (wrapWidth - 6) / 2 : 0;
  const pillTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, pillWidth],
  });

  return (
    <View
      style={seg.wrap}
      onLayout={(e) => setWrapWidth(e.nativeEvent.layout.width)}
    >
      {/* Sliding pill — behind the tab buttons */}
      {wrapWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            seg.pill,
            {
              position: "absolute",
              left: 3,
              top: 3,
              bottom: 3,
              width: pillWidth,
              transform: [{ translateX: pillTranslateX }],
            },
          ]}
        />
      )}

      {/* Abroad tab */}
      <Pressable
        style={seg.item}
        onPress={() => { Haptics.selectionAsync(); onChange("abroad"); }}
      >
        <Ionicons
          name="earth-outline"
          size={15}
          color={mode === "abroad" ? colors.ink : colors.faint}
        />
        <Text style={[seg.label, mode === "abroad" && seg.labelActive]}>Abroad</Text>
      </Pressable>

      {/* India tab */}
      <Pressable
        style={seg.item}
        onPress={() => { Haptics.selectionAsync(); onChange("india"); }}
      >
        <CountryFlag country="India" width={18} height={13} />
        <Text style={[seg.label, mode === "india" && seg.labelActive]}>India</Text>
      </Pressable>
    </View>
  );
}

const seg = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: colors.line,
    borderRadius: 12,
    padding: 3,
  },
  pill: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    zIndex: 0,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 36,
    borderRadius: 10,
    zIndex: 1,
  },
  label: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: colors.faint,
  },
  labelActive: {
    color: colors.ink,
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    country: countryParam,
    feeRange: feeRangeParam,
    medium: mediumParam,
    sort: sortParam,
    india: indiaParam,
  } = useLocalSearchParams<{
    country?: string; feeRange?: string; medium?: string; sort?: string; india?: string;
  }>();

  const [mode, setMode] = useState<Mode>(indiaParam === "1" ? "india" : "abroad");

  // ── Content slide/fade animation ──
  const contentAnim  = useRef(new Animated.Value(1)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;

  // ── Shared ──
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstSearchRunRef = useRef(true);
  const abroadRequestIdRef = useRef(0);
  const indiaRequestIdRef = useRef(0);
  const bottomInset = insets.bottom + 90;

  // ── Abroad state ──
  const [abroadFilters, setAbroadFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    country:  countryParam  ?? "",
    feeRange: feeRangeParam ?? "",
    medium:   mediumParam   ?? "",
    sort:     sortParam     ?? "",
  }));
  const [pendingFilters, setPendingFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    country:  countryParam  ?? "",
    feeRange: feeRangeParam ?? "",
    medium:   mediumParam   ?? "",
    sort:     sortParam     ?? "",
  }));
  const [sheetVisible, setSheetVisible] = useState(false);
  const [universities, setUniversities]     = useState<University[]>([]);
  const [abroadPage, setAbroadPage]         = useState(1);
  const [abroadHasNext, setAbroadHasNext]   = useState(false);
  const [abroadTotal, setAbroadTotal]       = useState(0);
  const [abroadLoading, setAbroadLoading]   = useState(false);
  const [abroadLoadingMore, setAbroadLoadingMore] = useState(false);
  const [abroadOptions, setAbroadOptions]   = useState<AbroadOptions>({
    countries: [], courses: [], mediums: [], intakes: [],
  });

  // ── India state ──
  const [indiaState, setIndiaState]             = useState("");
  const [indiaMgmt, setIndiaMgmt]               = useState("");
  const [colleges, setColleges]                 = useState<IndiaCollege[]>([]);
  const [indiaPage, setIndiaPage]               = useState(1);
  const [indiaHasNext, setIndiaHasNext]         = useState(false);
  const [indiaTotal, setIndiaTotal]             = useState(0);
  const [indiaLoading, setIndiaLoading]         = useState(false);
  const [indiaLoadingMore, setIndiaLoadingMore] = useState(false);

  const { data: shortlists = [] } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => mobileClient.getShortlists(),
    staleTime: 30_000,
    retry: false,
  });
  const shortlistedSlugs = useMemo(
    () => new Set(shortlists.map((university) => university.slug)),
    [shortlists],
  );

  // ── React to URL params ──
  useEffect(() => {
    if (indiaParam === "1") setMode("india");
  }, [indiaParam]);

  useEffect(() => {
    const patch: Partial<FilterState> = {};
    if (countryParam  !== undefined) patch.country  = countryParam;
    if (feeRangeParam !== undefined) patch.feeRange = feeRangeParam;
    if (mediumParam   !== undefined) patch.medium   = mediumParam;
    if (sortParam     !== undefined) patch.sort     = sortParam;
    if (Object.keys(patch).length) {
      setAbroadFilters(prev => ({ ...prev, ...patch }));
      setPendingFilters(prev => ({ ...prev, ...patch }));
      setMode("abroad");
    }
  }, [countryParam, feeRangeParam, mediumParam, sortParam]);

  // ── Loaders ──
  const loadAbroad = useCallback(async (
    q: string, f: FilterState, pageNum: number, append: boolean,
  ) => {
    const requestId = ++abroadRequestIdRef.current;
    if (pageNum === 1) setAbroadLoading(true); else setAbroadLoadingMore(true);
    try {
      const feeRange = FEE_RANGES.find(r => r.value === f.feeRange);
      const result = await mobileClient.getUniversities({
        q: q || undefined,
        country:        f.country        || undefined,
        course:         f.course         || undefined,
        medium:         f.medium         || undefined,
        universityType: f.universityType || undefined,
        sort:           f.sort           || undefined,
        feeMin: feeRange?.feeMin,
        feeMax: feeRange?.feeMax,
      }, pageNum);
      if (requestId !== abroadRequestIdRef.current) return;
      setUniversities(prev => append
        ? appendUnique(prev, result.universities, (university) => university.offeringSlug ?? university.slug)
        : result.universities,
      );
      setAbroadHasNext(result.hasNextPage);
      setAbroadTotal(result.totalItems);
      setAbroadPage(pageNum);
      if (pageNum === 1 && result.options) {
        setAbroadOptions({
          ...result.options,
          countries: sortCountries(result.options.countries),
        });
      }
    } catch { /* keep existing results while a request fails */ } finally {
      if (requestId === abroadRequestIdRef.current) {
        setAbroadLoading(false); setAbroadLoadingMore(false);
      }
    }
  }, []);

  const loadIndia = useCallback(async (
    q: string, state: string, mgmt: string, pageNum: number, append: boolean,
  ) => {
    const requestId = ++indiaRequestIdRef.current;
    if (pageNum === 1) setIndiaLoading(true); else setIndiaLoadingMore(true);
    try {
      const result = await mobileClient.getIndiaColleges({
        q: q || undefined, state: state || undefined, management: mgmt || undefined,
      }, pageNum);
      if (requestId !== indiaRequestIdRef.current) return;
      setColleges(prev => append
        ? appendUnique(prev, result.colleges, (college) => college.slug)
        : result.colleges,
      );
      setIndiaHasNext(result.hasNextPage);
      setIndiaTotal(result.totalItems);
      setIndiaPage(pageNum);
    } catch { /* keep existing results while a request fails */ } finally {
      if (requestId === indiaRequestIdRef.current) {
        setIndiaLoading(false); setIndiaLoadingMore(false);
      }
    }
  }, []);

  // Initial load + filter-change triggers
  useEffect(() => {
    if (mode === "abroad") loadAbroad(query, abroadFilters, 1, false);
  }, [abroadFilters, mode]);

  useEffect(() => {
    if (mode === "india") loadIndia(query, indiaState, indiaMgmt, 1, false);
  }, [indiaState, indiaMgmt, mode]);

  // Debounced text search
  useEffect(() => {
    if (isFirstSearchRunRef.current) {
      isFirstSearchRunRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (mode === "abroad") loadAbroad(query, abroadFilters, 1, false);
      else loadIndia(query, indiaState, indiaMgmt, 1, false);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const renderUniversity = useCallback(({ item }: ListRenderItemInfo<University>) => (
    <UniversityCard university={item} isShortlisted={shortlistedSlugs.has(item.slug)} />
  ), [shortlistedSlugs]);

  const renderIndiaCollege = useCallback(({ item }: ListRenderItemInfo<IndiaCollege>) => (
    <IndiaCollegeCard
      college={item}
      onCounsel={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/counselling");
      }}
    />
  ), [router]);

  const loadMoreAbroad = useCallback(() => {
    if (abroadHasNext && !abroadLoadingMore && !abroadLoading) {
      loadAbroad(query, abroadFilters, abroadPage + 1, true);
    }
  }, [abroadFilters, abroadHasNext, abroadLoading, abroadLoadingMore, abroadPage, loadAbroad, query]);

  const loadMoreIndia = useCallback(() => {
    if (indiaHasNext && !indiaLoadingMore && !indiaLoading) {
      loadIndia(query, indiaState, indiaMgmt, indiaPage + 1, true);
    }
  }, [indiaHasNext, indiaLoading, indiaLoadingMore, indiaMgmt, indiaPage, indiaState, loadIndia, query]);

  // ── Mode switch with slide + fade animation ──
  function handleModeChange(m: Mode) {
    if (m === mode) return;
    // Clear any pending debounced search
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const dir = m === "india" ? -1 : 1; // switch to India = slide left

    contentAnim.stopAnimation();
    contentSlide.stopAnimation();

    // Phase 1: slide current content out
    Animated.parallel([
      Animated.timing(contentAnim, {
        toValue: 0, duration: 110, useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: dir * 20, duration: 110, useNativeDriver: true,
      }),
    ]).start(() => {
      // Swap content
      setMode(m);
      setQuery("");

      // Position new content off the other side (invisible, no jump)
      contentSlide.setValue(-dir * 20);

      // Phase 2: slide new content in
      Animated.parallel([
        Animated.timing(contentAnim, {
          toValue: 1, duration: 180, useNativeDriver: true,
        }),
        Animated.spring(contentSlide, {
          toValue: 0, useNativeDriver: true, tension: 130, friction: 16,
        }),
      ]).start();
    });
  }

  const activeAbroadFilterCount = Object.values(abroadFilters).filter(Boolean).length;

  return (
    <View style={[s.root, { backgroundColor: BG }]}>

      {/* ── Fixed header ── */}
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.headerRow}>
          <Text style={s.title}>Universities</Text>
          {mode === "abroad" && (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setPendingFilters(abroadFilters);
                setSheetVisible(true);
              }}
              style={({ pressed }) => [s.filterBtn, pressed && s.filterBtnPressed]}
              hitSlop={8}
            >
              <Ionicons name="options-outline" size={18} color="#fff" />
              {activeAbroadFilterCount > 0 && (
                <View style={s.filterBadge}>
                  <Text style={s.filterBadgeText}>{activeAbroadFilterCount}</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>

        {/* Animated Abroad / India toggle */}
        <SegmentControl mode={mode} onChange={handleModeChange} />

        {/* Search bar */}
        <View style={s.searchBar}>
          <Ionicons
            name="search"
            size={17}
            color={query ? colors.primary : colors.faint}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={
              mode === "abroad"
                ? "Country, city, or university…"
                : "College name, city, or state…"
            }
            placeholderTextColor={colors.faint}
            style={s.searchInput}
            selectionColor={colors.primary}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => Haptics.selectionAsync()}
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => { Haptics.selectionAsync(); setQuery(""); }}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color={colors.faint} />
            </Pressable>
          )}
        </View>

        {/* ── Abroad: country chips ── */}
        {mode === "abroad" && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chipRow}
          >
            <Pressable
              onPress={() => { Haptics.selectionAsync(); setAbroadFilters(p => ({ ...p, country: "" })); }}
              style={[s.chip, !abroadFilters.country && s.chipActive]}
            >
              <Text style={[s.chipLabel, !abroadFilters.country && s.chipLabelActive]}>All</Text>
            </Pressable>
            {sortCountries(abroadOptions.countries).map(c => {
              const active = abroadFilters.country === c.slug;
              return (
                <Pressable
                  key={c.slug}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setAbroadFilters(p => ({ ...p, country: p.country === c.slug ? "" : c.slug }));
                  }}
                  style={[s.chip, active && s.chipActive]}
                >
                  <Text style={[s.chipLabel, active && s.chipLabelActive]}>{c.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* ── India: state chips + management toggle ── */}
        {mode === "india" && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chipRow}
            >
              <Pressable
                onPress={() => { Haptics.selectionAsync(); setIndiaState(""); }}
                style={[s.chip, !indiaState && s.chipActive]}
              >
                <Text style={[s.chipLabel, !indiaState && s.chipLabelActive]}>All states</Text>
              </Pressable>
              {INDIA_STATES.map(st => {
                const active = indiaState === st;
                return (
                  <Pressable
                    key={st}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setIndiaState(p => p === st ? "" : st);
                    }}
                    style={[s.chip, active && s.chipActive]}
                  >
                    <Text style={[s.chipLabel, active && s.chipLabelActive]}>{st}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Management type */}
            <View style={s.mgmtRow}>
              <Pressable
                onPress={() => { Haptics.selectionAsync(); setIndiaMgmt(""); }}
                style={[s.mgmtChip, !indiaMgmt && s.mgmtChipActive]}
              >
                <Text style={[s.mgmtLabel, !indiaMgmt && s.mgmtLabelActive]}>All</Text>
              </Pressable>
              {INDIA_MANAGEMENT.map(m => {
                const active = indiaMgmt === m;
                const isGovt = m === "Govt.";
                return (
                  <Pressable
                    key={m}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setIndiaMgmt(p => p === m ? "" : m);
                    }}
                    style={[
                      s.mgmtChip,
                      active && (isGovt ? s.mgmtChipGovt : s.mgmtChipPrivate),
                    ]}
                  >
                    <Ionicons
                      name={isGovt ? "business-outline" : "briefcase-outline"}
                      size={13}
                      color={
                        active
                          ? (isGovt ? "#065f46" : "#92400e")
                          : colors.muted
                      }
                    />
                    <Text style={[
                      s.mgmtLabel,
                      active && (isGovt ? s.mgmtLabelGovt : s.mgmtLabelPrivate),
                    ]}>
                      {isGovt ? "Government" : "Private"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </SafeAreaView>

      {/* ── Animated content area ── */}
      <Animated.View
        style={[
          s.content,
          { opacity: contentAnim, transform: [{ translateX: contentSlide }] },
        ]}
      >
        {/* Abroad results */}
        {mode === "abroad" && (
          abroadLoading ? (
            <View style={s.loadingWrap}><ActivityIndicator color={colors.primary} /></View>
          ) : (
            <FlashList
              data={universities}
              keyExtractor={(u, i) => u.offeringSlug ?? `${u.slug}-${i}`}
              renderItem={renderUniversity}
              extraData={shortlistedSlugs}
              drawDistance={UNIVERSITY_LIST_DRAW_DISTANCE}
              contentContainerStyle={[s.listContent, { paddingBottom: bottomInset }]}
              ItemSeparatorComponent={ListSeparator}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              onEndReached={loadMoreAbroad}
              onEndReachedThreshold={0.3}
              ListHeaderComponent={
                universities.length > 0 ? (
                  <Text style={s.resultCount}>{abroadTotal.toLocaleString()} universities</Text>
                ) : null
              }
              ListEmptyComponent={<EmptyState />}
              ListFooterComponent={
                abroadLoadingMore ? (
                  <View style={s.footerLoader}>
                    <ActivityIndicator color={colors.primary} size="small" />
                  </View>
                ) : !abroadHasNext && universities.length > 0 ? (
                  <Text style={s.footerEnd}>All {abroadTotal.toLocaleString()} shown</Text>
                ) : null
              }
            />
          )
        )}

        {/* India results */}
        {mode === "india" && (
          indiaLoading ? (
            <View style={s.loadingWrap}><ActivityIndicator color={colors.primary} /></View>
          ) : (
            <FlashList
              data={colleges}
              keyExtractor={(c) => c.slug}
              renderItem={renderIndiaCollege}
              drawDistance={UNIVERSITY_LIST_DRAW_DISTANCE}
              contentContainerStyle={[s.listContent, { paddingBottom: bottomInset }]}
              ItemSeparatorComponent={ListSeparator}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              onEndReached={loadMoreIndia}
              onEndReachedThreshold={0.3}
              ListHeaderComponent={
                colleges.length > 0 ? (
                  <Text style={s.resultCount}>{indiaTotal.toLocaleString()} colleges</Text>
                ) : null
              }
              ListEmptyComponent={<EmptyState india />}
              ListFooterComponent={
                indiaLoadingMore ? (
                  <View style={s.footerLoader}>
                    <ActivityIndicator color={colors.primary} size="small" />
                  </View>
                ) : !indiaHasNext && colleges.length > 0 ? (
                  <Text style={s.footerEnd}>All {indiaTotal.toLocaleString()} shown</Text>
                ) : null
              }
            />
          )
        )}
      </Animated.View>

      {/* ── Abroad filters sheet ── */}
      <FiltersSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={() => { setAbroadFilters(pendingFilters); setSheetVisible(false); }}
        options={abroadOptions}
        totalItems={abroadTotal}
      />
    </View>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ india }: { india?: boolean }) {
  return (
    <View style={s.emptyWrap}>
      <Ionicons name="search-outline" size={44} color={colors.line} />
      <Text style={s.emptyTitle}>No results found</Text>
      <Text style={s.emptySub}>
        {india
          ? "Try a different state or clear the management filter."
          : "Try adjusting your search or clearing some filters."}
      </Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },

  headerSafe: {},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  title: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  filterBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  filterBtnPressed: { opacity: 0.75 },
  filterBadge: {
    position: "absolute", top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.coral,
    alignItems: "center", justifyContent: "center",
  },
  filterBadgeText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, color: "#fff" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 0,
  },

  // Shared chips
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipLabel: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.muted },
  chipLabelActive: { color: "#fff" },

  // India management toggle
  mgmtRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  mgmtChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  mgmtChipActive:  { backgroundColor: colors.primary, borderColor: colors.primary },
  mgmtChipGovt:    { backgroundColor: "#ecfdf5", borderColor: "#6ee7b7" },
  mgmtChipPrivate: { backgroundColor: "#fffbeb", borderColor: "#fcd34d" },
  mgmtLabel:        { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.muted },
  mgmtLabelActive:  { color: "#fff" },
  mgmtLabelGovt:    { color: "#065f46" },
  mgmtLabelPrivate: { color: "#92400e" },

  // Results
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent:  { paddingHorizontal: 20, paddingTop: 4 },
  sep:          { height: 10 },
  resultCount: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13, color: colors.faint, marginBottom: 12,
  },
  emptyWrap: { paddingTop: 60, alignItems: "center", gap: 10, paddingHorizontal: 20 },
  emptyTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 17, color: colors.ink },
  emptySub: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 21,
  },
  footerLoader: { paddingVertical: 24, alignItems: "center" },
  footerEnd: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12, color: colors.faint, textAlign: "center", paddingVertical: 24,
  },
});
