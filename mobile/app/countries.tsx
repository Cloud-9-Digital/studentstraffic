import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { mobileClient } from "../src/api/mobileClient";
import { CountryFlag } from "../src/components/CountryFlag";
import { colors, shadow } from "../src/theme/tokens";

type Country = { slug: string; name: string };

const PRIORITY_COUNTRIES = [
  "vietnam", "russia", "georgia", "kyrgyzstan", "uzbekistan", "india",
];

function sortCountries(countries: Country[]) {
  return [...countries]
    .filter((country, index, all) => all.findIndex((item) => item.slug === country.slug) === index)
    .sort((a, b) => {
      const ai = PRIORITY_COUNTRIES.indexOf(a.slug.toLowerCase());
      const bi = PRIORITY_COUNTRIES.indexOf(b.slug.toLowerCase());
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
}

const BG = Platform.OS === "ios" ? "#F2F2F7" : colors.background;

export default function CountriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["searchOptions"],
    queryFn: () => mobileClient.getUniversities({}, 1).then((result) => result.options),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const countries = useMemo(() => {
    const value = query.trim().toLowerCase();
    return sortCountries(data?.countries ?? []).filter((country) =>
      country.name.toLowerCase().includes(value),
    );
  }, [data?.countries, query]);

  const openCountry = useCallback((country: Country) => {
    Haptics.selectionAsync();
    router.push({ pathname: "/country/[slug]", params: { slug: country.slug, name: country.name } });
  }, [router]);

  const renderCountry = useCallback(({ item }: ListRenderItemInfo<Country>) => (
    <Pressable
      onPress={() => openCountry(item)}
      style={({ pressed }) => [s.card, pressed && s.cardPressed]}
    >
      <View style={s.flagWrap}>
        <CountryFlag country={item.name} countrySlug={item.slug} width={38} height={25} borderRadius={6} />
      </View>
      <Text style={s.cardTitle} numberOfLines={1}>{item.name}</Text>
      <Ionicons name="arrow-forward" size={16} color={colors.primary} />
    </Pressable>
  ), [openCountry]);

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      <StatusBar style="dark" />
      <SafeAreaView edges={["top"]} style={[s.safeHeader, { backgroundColor: BG }]}>
        <View style={s.header}>
          <Pressable onPress={() => { Haptics.selectionAsync(); router.back(); }} hitSlop={12} style={s.backButton}>
            <Ionicons name="chevron-back" size={21} color={colors.ink} />
          </Pressable>
          <Text style={s.headerTitle}>Countries</Text>
          <View style={s.headerSpacer} />
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View style={s.center}><ActivityIndicator color={colors.primary} /></View>
      ) : isError ? (
        <View style={s.center}>
          <Ionicons name="cloud-offline-outline" size={36} color={colors.faint} />
          <Text style={s.errorTitle}>Couldn’t load countries</Text>
          <Pressable onPress={() => refetch()} style={s.retry}><Text style={s.retryText}>Try again</Text></Pressable>
        </View>
      ) : (
        <FlashList
          data={countries}
          numColumns={2}
          estimatedItemSize={80}
          keyExtractor={(item) => item.slug}
          renderItem={renderCountry}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 28 }}
          ListHeaderComponent={
            <View>
              <View style={s.intro}>
                <Text style={s.eyebrow}>EXPLORE OPTIONS</Text>
                <Text style={s.title}>Study destinations</Text>
                <Text style={s.subtitle}>Compare universities and find the country that fits your plans.</Text>
              </View>
              <View style={s.searchBox}>
                <Ionicons name="search-outline" size={20} color={colors.faint} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search countries"
                  placeholderTextColor={colors.faint}
                  style={s.searchInput}
                  autoCapitalize="words"
                  returnKeyType="search"
                />
                {query ? (
                  <Pressable onPress={() => setQuery("")} hitSlop={10}>
                    <Ionicons name="close-circle" size={19} color={colors.faint} />
                  </Pressable>
                ) : null}
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="search-outline" size={30} color={colors.faint} />
              <Text style={s.emptyTitle}>No countries found</Text>
              <Text style={s.emptySub}>Try another country name.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  safeHeader: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(15,61,55,0.10)" },
  header: { height: 54, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft },
  headerTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 15, color: colors.ink },
  headerSpacer: { width: 36 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  intro: { paddingHorizontal: 4, paddingTop: 25, paddingBottom: 20 },
  eyebrow: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, letterSpacing: 1.1, color: colors.primary, marginBottom: 8 },
  title: { fontFamily: "Fraunces-SemiBold", fontSize: 32, lineHeight: 38, letterSpacing: -0.6, color: colors.ink },
  subtitle: { fontFamily: "PlusJakartaSans-Regular", fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: 8, maxWidth: 310 },
  searchBox: { height: 52, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 15, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: "rgba(15,61,55,0.12)" },
  searchInput: { flex: 1, alignSelf: "stretch", fontFamily: "PlusJakartaSans-Regular", fontSize: 15, color: colors.ink, paddingVertical: 0, textAlignVertical: "center", includeFontPadding: false },
  card: { flex: 1, minHeight: 72, margin: 7, padding: 10, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: "rgba(15,61,55,0.10)", flexDirection: "row", alignItems: "center", gap: 8, ...shadow },
  cardPressed: { opacity: 0.84, transform: [{ scale: 0.985 }] },
  flagWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardTitle: { flex: 1, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, lineHeight: 18, color: colors.ink },
  errorTitle: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 16, color: colors.ink },
  retry: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  retryText: { fontFamily: "PlusJakartaSans-Bold", fontSize: 13, color: "#fff" },
  empty: { alignItems: "center", paddingVertical: 56, gap: 7 },
  emptyTitle: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 16, color: colors.ink },
  emptySub: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, color: colors.muted },
});
