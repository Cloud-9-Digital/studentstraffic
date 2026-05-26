import CountryFlagImage from "react-native-country-flag";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CountryFlagProps = {
  country?: string | null;
  countrySlug?: string | null;
  isoCode?: string | null;
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

const ISO_BY_COUNTRY_KEY: Record<string, string> = {
  australia: "AU",
  bangladesh: "BD",
  canada: "CA",
  china: "CN",
  georgia: "GE",
  germany: "DE",
  india: "IN",
  kazakhstan: "KZ",
  kyrgyzstan: "KG",
  nepal: "NP",
  philippines: "PH",
  russia: "RU",
  "russian-federation": "RU",
  "united-arab-emirates": "AE",
  uk: "GB",
  ukraine: "UA",
  "united-kingdom": "GB",
  usa: "US",
  "united-states": "US",
  uzbekistan: "UZ",
  vietnam: "VN",
};

function normalizeCountryKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveIsoCode({
  country,
  countrySlug,
  isoCode,
}: Pick<CountryFlagProps, "country" | "countrySlug" | "isoCode">) {
  if (isoCode) return isoCode.trim().toUpperCase();

  for (const candidate of [countrySlug, country]) {
    if (!candidate) continue;

    const trimmed = candidate.trim();
    if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();

    const mapped = ISO_BY_COUNTRY_KEY[normalizeCountryKey(trimmed)];
    if (mapped) return mapped;
  }

  return null;
}

export function CountryFlag({
  country,
  countrySlug,
  isoCode,
  width,
  height = 14,
  borderRadius = 2,
  style,
}: CountryFlagProps) {
  const resolvedIsoCode = resolveIsoCode({ country, countrySlug, isoCode });
  const resolvedWidth = width ?? Math.round(height * 1.6);

  if (!resolvedIsoCode) {
    return (
      <View
        style={[
          styles.fallback,
          { width: resolvedWidth, height, borderRadius },
          style,
        ]}
      >
        <Ionicons name="earth-outline" size={Math.max(10, height * 0.7)} color="#64748b" />
      </View>
    );
  }

  return (
    <CountryFlagImage
      isoCode={resolvedIsoCode}
      size={height}
      style={[
        styles.flag,
        {
          width: resolvedWidth,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  flag: {
    flexShrink: 0,
    overflow: "hidden",
  },
  fallback: {
    flexShrink: 0,
    backgroundColor: "rgba(148, 163, 184, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
});
