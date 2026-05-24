import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
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

import { mobileClient } from "../../src/api/mobileClient";
import { UniversityCard } from "../../src/components/UniversityCard";
import { FiltersSheet, DEFAULT_FILTERS, FEE_RANGES } from "../../src/components/FiltersSheet";
import type { FilterState } from "../../src/components/FiltersSheet";
import type { University } from "../../src/types/domain";
import { colors } from "../../src/theme/tokens";

const BG = Platform.OS === "ios" ? "#f2f2f7" : colors.background;

type Options = {
  countries: { slug: string; name: string }[];
  courses: { slug: string; shortName: string }[];
  mediums: string[];
  intakes: string[];
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { country: countryParam } = useLocalSearchParams<{ country?: string }>();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    country: countryParam ?? "",
  }));
  const [pendingFilters, setPendingFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    country: countryParam ?? "",
  }));

  // React to param changes (user taps a different country card while tab is already mounted)
  useEffect(() => {
    if (countryParam !== undefined) {
      setFilters(prev => ({ ...prev, country: countryParam }));
      setPendingFilters(prev => ({ ...prev, country: countryParam }));
    }
  }, [countryParam]);
  const [sheetVisible, setSheetVisible] = useState(false);

  const [universities, setUniversities] = useState<University[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [options, setOptions] = useState<Options>({ countries: [], courses: [], mediums: [], intakes: [] });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function buildApiFilters(q: string, f: FilterState) {
    const feeRange = FEE_RANGES.find(r => r.value === f.feeRange);
    return {
      q: q || undefined,
      country: f.country || undefined,
      course: f.course || undefined,
      medium: f.medium || undefined,
      universityType: f.universityType || undefined,
      sort: f.sort || undefined,
      feeMin: feeRange?.feeMin,
      feeMax: feeRange?.feeMax,
    };
  }

  const load = useCallback(async (
    q: string, f: FilterState, pageNum: number, append: boolean,
  ) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const result = await mobileClient.getUniversities(buildApiFilters(q, f), pageNum);
      setUniversities(prev => append ? [...prev, ...result.universities] : result.universities);
      setHasNextPage(result.hasNextPage);
      setTotalItems(result.totalItems);
      setPage(pageNum);
      if (pageNum === 1 && result.options) setOptions(result.options);
    } catch {
      // keep existing results
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load + filter changes
  useEffect(() => {
    load(query, filters, 1, false);
  }, [filters]);

  // Debounced text search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      load(query, filters, 1, false);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  function handleLoadMore() {
    if (!hasNextPage || loadingMore || loading) return;
    load(query, filters, page + 1, true);
  }

  function handleApplyFilters() {
    setFilters(pendingFilters);
    setSheetVisible(false);
  }

  function openFilters() {
    Haptics.selectionAsync();
    setPendingFilters(filters);
    setSheetVisible(true);
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const bottomInset = insets.bottom + 90;

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* ── Fixed header ── */}
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.headerRow}>
          <Text style={s.title}>Find Universities</Text>
          <Pressable
            onPress={openFilters}
            style={({ pressed }) => [s.filterBtn, pressed && s.filterBtnPressed]}
            hitSlop={8}
          >
            <Ionicons name="options-outline" size={18} color="#fff" />
            {activeFilterCount > 0 && (
              <View style={s.filterBadge}>
                <Text style={s.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Search bar */}
        <View style={s.searchBar}>
          <Ionicons name="search" size={17} color={query ? colors.primary : colors.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Country, city, or university name"
            placeholderTextColor={colors.faint}
            style={s.searchInput}
            selectionColor={colors.primary}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => Haptics.selectionAsync()}
          />
          {query.length > 0 && (
            <Pressable onPress={() => { Haptics.selectionAsync(); setQuery(""); }} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.faint} />
            </Pressable>
          )}
        </View>

        {/* Country chips — dynamic from API options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
        >
          {/* "All" pill */}
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setFilters(prev => ({ ...prev, country: "" })); }}
            style={[s.chip, !filters.country && s.chipActive]}
          >
            <Text style={[s.chipLabel, !filters.country && s.chipLabelActive]}>All</Text>
          </Pressable>

          {options.countries.map((c) => {
            const active = filters.country === c.slug;
            return (
              <Pressable
                key={c.slug}
                onPress={() => { Haptics.selectionAsync(); setFilters(prev => ({ ...prev, country: prev.country === c.slug ? "" : c.slug })); }}
                style={[s.chip, active && s.chipActive]}
              >
                <Text style={[s.chipLabel, active && s.chipLabelActive]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {/* ── Results ── */}
      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={universities}
          keyExtractor={(u, i) => u.offeringSlug ?? `${u.slug}-${i}`}
          renderItem={({ item }) => <UniversityCard university={item} />}
          contentContainerStyle={[s.listContent, { paddingBottom: bottomInset }]}
          ItemSeparatorComponent={() => <View style={s.sep} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={
            universities.length > 0 ? (
              <Text style={s.resultCount}>{totalItems.toLocaleString()} universities found</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={s.emptyWrap}>
              <Ionicons name="search-outline" size={44} color={colors.line} />
              <Text style={s.emptyTitle}>No results found</Text>
              <Text style={s.emptySub}>Try adjusting your search or clearing some filters.</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={s.footerLoader}>
                <ActivityIndicator color={colors.primary} size="small" />
              </View>
            ) : !hasNextPage && universities.length > 0 ? (
              <Text style={s.footerEnd}>All {totalItems.toLocaleString()} universities shown</Text>
            ) : null
          }
        />
      )}

      {/* ── Filters sheet ── */}
      <FiltersSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={handleApplyFilters}
        options={options}
        totalItems={totalItems}
      />
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
    paddingBottom: 14,
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
    position: "absolute",
    top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.coral,
    alignItems: "center", justifyContent: "center",
  },
  filterBadgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 10,
    color: "#fff",
  },

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

  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
  },
  chipLabelActive: { color: "#fff" },

  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingHorizontal: 20, paddingTop: 4 },
  sep: { height: 10 },
  resultCount: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.faint,
    marginBottom: 12,
  },
  emptyWrap: { paddingTop: 60, alignItems: "center", gap: 10, paddingHorizontal: 20 },
  emptyTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 17, color: colors.ink },
  emptySub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 21 },
  footerLoader: { paddingVertical: 24, alignItems: "center" },
  footerEnd: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.faint,
    textAlign: "center",
    paddingVertical: 24,
  },
});
