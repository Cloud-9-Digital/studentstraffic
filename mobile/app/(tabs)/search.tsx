import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../../src/api/mobileClient";
import { UniversityCard } from "../../src/components/UniversityCard";
import { FiltersSheet, DEFAULT_FILTERS, FEE_RANGES } from "../../src/components/FiltersSheet";
import type { FilterState } from "../../src/components/FiltersSheet";
import type { University } from "../../src/types/domain";
import { colors } from "../../src/theme/tokens";

type SearchOptions = {
  countries: { slug: string; name: string }[];
  courses: { slug: string; shortName: string }[];
  mediums: string[];
  intakes: string[];
};

const COUNTRY_PRIORITY = ["vietnam", "russia", "georgia", "kyrgyzstan", "uzbekistan", "india"];
const BG = Platform.OS === "ios" ? "#F2F2F7" : colors.background;
const LIST_DRAW_DISTANCE = 600;

function sortCountries(countries: SearchOptions["countries"]) {
  return [...countries].sort((a, b) => {
    const ai = COUNTRY_PRIORITY.indexOf(a.slug.toLowerCase());
    const bi = COUNTRY_PRIORITY.indexOf(b.slug.toLowerCase());
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}

function appendUnique(current: University[], incoming: University[]) {
  const seen = new Set(current.map((item) => item.offeringSlug ?? item.slug));
  return [...current, ...incoming.filter((item) => !seen.has(item.offeringSlug ?? item.slug))];
}

function ListSeparator() {
  return <View style={s.separator} />;
}

export default function SearchScreen() {
  const params = useLocalSearchParams<{ country?: string; feeRange?: string; medium?: string; sort?: string }>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    country: params.country ?? "",
    feeRange: params.feeRange ?? "",
    medium: params.medium ?? "",
    sort: params.sort ?? "",
  }));
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [options, setOptions] = useState<SearchOptions>({ countries: [], courses: [], mediums: [], intakes: [] });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestId = useRef(0);

  const { data: shortlists = [] } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => mobileClient.getShortlists(),
    staleTime: 30_000,
    retry: false,
  });
  const shortlistedSlugs = useMemo(() => new Set(shortlists.map((item) => item.slug)), [shortlists]);

  useEffect(() => {
    const patch: Partial<FilterState> = {};
    if (params.country !== undefined) patch.country = params.country;
    if (params.feeRange !== undefined) patch.feeRange = params.feeRange;
    if (params.medium !== undefined) patch.medium = params.medium;
    if (params.sort !== undefined) patch.sort = params.sort;
    if (Object.keys(patch).length) {
      setFilters((current) => ({ ...current, ...patch }));
      setPendingFilters((current) => ({ ...current, ...patch }));
    }
  }, [params.country, params.feeRange, params.medium, params.sort]);

  const loadUniversities = useCallback(async (nextPage: number, append: boolean) => {
    const id = ++requestId.current;
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const feeRange = FEE_RANGES.find((item) => item.value === filters.feeRange);
      const result = await mobileClient.getUniversities({
        q: query.trim() || undefined,
        country: filters.country || undefined,
        course: filters.course || undefined,
        medium: filters.medium || undefined,
        universityType: filters.universityType || undefined,
        sort: filters.sort || undefined,
        feeMin: feeRange?.feeMin,
        feeMax: feeRange?.feeMax,
      }, nextPage);
      if (id !== requestId.current) return;
      setUniversities((current) => append ? appendUnique(current, result.universities) : result.universities);
      setTotal(result.totalItems);
      setPage(nextPage);
      setHasNextPage(result.hasNextPage);
      if (result.options) setOptions({ ...result.options, countries: sortCountries(result.options.countries) });
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [filters, query]);

  useEffect(() => {
    const timeout = setTimeout(() => { loadUniversities(1, false); }, query ? 320 : 0);
    return () => clearTimeout(timeout);
  }, [loadUniversities, query]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !loading && !loadingMore) loadUniversities(page + 1, true);
  }, [hasNextPage, loadUniversities, loading, loadingMore, page]);

  const renderUniversity = useCallback(({ item }: ListRenderItemInfo<University>) => (
    <UniversityCard university={item} isShortlisted={shortlistedSlugs.has(item.slug)} />
  ), [shortlistedSlugs]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      <SafeAreaView edges={["top"]} style={[s.headerSafe, { backgroundColor: BG }]}>
        <View style={s.headerRow}>
          <Text style={s.title}>Universities</Text>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setPendingFilters(filters); setSheetVisible(true); }}
            style={({ pressed }) => [s.filterButton, pressed && s.filterPressed]}
            hitSlop={8}
          >
            <Ionicons name="options-outline" size={18} color="#fff" />
            {activeFilterCount > 0 ? <View style={s.filterBadge}><Text style={s.filterBadgeText}>{activeFilterCount}</Text></View> : null}
          </Pressable>
        </View>

        <View style={s.searchBar}>
          <Ionicons name="search" size={17} color={query ? colors.primary : colors.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="University, program, country, or city"
            placeholderTextColor={colors.faint}
            style={s.searchInput}
            selectionColor={colors.primary}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => Haptics.selectionAsync()}
          />
          {query ? <Pressable onPress={() => setQuery("")} hitSlop={8}><Ionicons name="close-circle" size={18} color={colors.faint} /></Pressable> : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setFilters((current) => ({ ...current, country: "" })); }}
            style={[s.chip, !filters.country && s.chipActive]}
          >
            <Text style={[s.chipLabel, !filters.country && s.chipLabelActive]}>All countries</Text>
          </Pressable>
          {options.countries.map((country) => {
            const active = filters.country === country.slug;
            return (
              <Pressable
                key={country.slug}
                onPress={() => { Haptics.selectionAsync(); setFilters((current) => ({ ...current, country: current.country === country.slug ? "" : country.slug })); }}
                style={[s.chip, active && s.chipActive]}
              >
                <Text style={[s.chipLabel, active && s.chipLabelActive]}>{country.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {loading ? (
        <View style={s.loadingWrap}><ActivityIndicator color={colors.primary} /></View>
      ) : (
        <FlashList
          data={universities}
          estimatedItemSize={150}
          keyExtractor={(item, index) => item.offeringSlug ?? `${item.slug}-${index}`}
          renderItem={renderUniversity}
          extraData={shortlistedSlugs}
          drawDistance={LIST_DRAW_DISTANCE}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 90 }}
          ItemSeparatorComponent={ListSeparator}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={universities.length > 0 ? <Text style={s.resultCount}>{total.toLocaleString()} universities</Text> : null}
          ListEmptyComponent={<EmptyState />}
          ListFooterComponent={
            loadingMore ? <View style={s.footerLoader}><ActivityIndicator color={colors.primary} size="small" /></View>
              : !hasNextPage && universities.length > 0 ? <Text style={s.footerEnd}>All {total.toLocaleString()} shown</Text> : null
          }
        />
      )}

      <FiltersSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={() => { setFilters(pendingFilters); setSheetVisible(false); }}
        options={options}
        totalItems={total}
      />
    </View>
  );
}

function EmptyState() {
  return (
    <View style={s.emptyWrap}>
      <Ionicons name="search-outline" size={44} color={colors.line} />
      <Text style={s.emptyTitle}>No universities found</Text>
      <Text style={s.emptySub}>Try another search or clear some filters.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  headerSafe: { paddingBottom: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  title: { fontFamily: "Fraunces-SemiBold", fontSize: 28, color: colors.ink, letterSpacing: -0.4 },
  filterButton: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  filterPressed: { opacity: 0.82, transform: [{ scale: 0.96 }] },
  filterBadge: { position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, paddingHorizontal: 3, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#D95F38", borderWidth: 1.5, borderColor: BG },
  filterBadgeText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 9, color: "#fff" },
  searchBar: { height: 48, marginHorizontal: 20, paddingHorizontal: 14, gap: 9, flexDirection: "row", alignItems: "center", borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  searchInput: { flex: 1, alignSelf: "stretch", fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink, paddingTop: 0, paddingBottom: 0, textAlignVertical: "center", includeFontPadding: false },
  chipRow: { gap: 8, paddingHorizontal: 20, paddingTop: 12 },
  chip: { borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 13, paddingVertical: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipLabel: { fontFamily: "PlusJakartaSans-Medium", fontSize: 12, color: colors.muted },
  chipLabelActive: { fontFamily: "PlusJakartaSans-SemiBold", color: "#fff" },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  resultCount: { fontFamily: "PlusJakartaSans-Medium", fontSize: 12, color: colors.muted, paddingTop: 18, paddingBottom: 10 },
  separator: { height: 10 },
  footerLoader: { alignItems: "center", paddingVertical: 20 },
  footerEnd: { textAlign: "center", fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.faint, paddingVertical: 24 },
  emptyWrap: { alignItems: "center", paddingTop: 92, paddingHorizontal: 30 },
  emptyTitle: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 17, color: colors.ink, marginTop: 14 },
  emptySub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 20, color: colors.muted, marginTop: 5, textAlign: "center" },
});
