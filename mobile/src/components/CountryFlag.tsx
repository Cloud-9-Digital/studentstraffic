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
  afghanistan: "AF", albania: "AL", algeria: "DZ", andorra: "AD", angola: "AO", argentina: "AR", armenia: "AM", australia: "AU", austria: "AT", azerbaijan: "AZ",
  bahrain: "BH", bangladesh: "BD", belarus: "BY", belgium: "BE", benin: "BJ", bhutan: "BT", bolivia: "BO", "bosnia-and-herzegovina": "BA", botswana: "BW", brazil: "BR", bulgaria: "BG", "burkina-faso": "BF", burundi: "BI",
  cambodia: "KH", cameroon: "CM", canada: "CA", "cape-verde": "CV", "central-african-republic": "CF", chad: "TD", chile: "CL", china: "CN", colombia: "CO", comoros: "KM", congo: "CG", "costa-rica": "CR", croatia: "HR", cuba: "CU", cyprus: "CY", "czech-republic": "CZ",
  "democratic-republic-of-congo": "CD", denmark: "DK", djibouti: "DJ", "dominican-republic": "DO",
  ecuador: "EC", egypt: "EG", "el-salvador": "SV", "equatorial-guinea": "GQ", eritrea: "ER", estonia: "EE", ethiopia: "ET",
  fiji: "FJ", finland: "FI", france: "FR",
  gabon: "GA", gambia: "GM", georgia: "GE", germany: "DE", ghana: "GH", greece: "GR", guatemala: "GT", guinea: "GN", "guinea-bissau": "GW",
  haiti: "HT", honduras: "HN", hungary: "HU",
  iceland: "IS", india: "IN", indonesia: "ID", iran: "IR", iraq: "IQ", ireland: "IE", israel: "IL", italy: "IT", "ivory-coast": "CI",
  jamaica: "JM", japan: "JP", jordan: "JO",
  kazakhstan: "KZ", kenya: "KE", kyrgyzstan: "KG", kuwait: "KW",
  laos: "LA", latvia: "LV", lebanon: "LB", lesotho: "LS", liberia: "LR", libya: "LY", liechtenstein: "LI", lithuania: "LT", luxembourg: "LU",
  madagascar: "MG", malawi: "MW", malaysia: "MY", maldives: "MV", mali: "ML", malta: "MT", mauritania: "MR", mauritius: "MU", mexico: "MX", moldova: "MD", monaco: "MC", mongolia: "MN", montenegro: "ME", morocco: "MA", mozambique: "MZ", myanmar: "MM",
  namibia: "NA", nepal: "NP", netherlands: "NL", "new-zealand": "NZ", nicaragua: "NI", niger: "NE", nigeria: "NG", "north-korea": "KP", "north-macedonia": "MK", norway: "NO",
  oman: "OM",
  pakistan: "PK", palestine: "PS", panama: "PA", "papua-new-guinea": "PG", paraguay: "PY", peru: "PE", philippines: "PH", poland: "PL", portugal: "PT",
  qatar: "QA",
  romania: "RO", russia: "RU", "russian-federation": "RU", rwanda: "RW",
  "saudi-arabia": "SA", samoa: "WS", "san-marino": "SM", senegal: "SN", serbia: "RS", "sierra-leone": "SL", singapore: "SG", slovakia: "SK", slovenia: "SI", somalia: "SO", "solomon-islands": "SB", "south-africa": "ZA", "south-korea": "KR", "south-sudan": "SS", spain: "ES", "sri-lanka": "LK", sudan: "SD", swaziland: "SZ", sweden: "SE", switzerland: "CH", syria: "SY",
  taiwan: "TW", tajikistan: "TJ", tanzania: "TZ", thailand: "TH", "timor-leste": "TL", togo: "TG", tonga: "TO", "trinidad-and-tobago": "TT", tunisia: "TN", turkmenistan: "TM",
  uganda: "UG", uk: "GB", ukraine: "UA", "united-arab-emirates": "AE", "united-kingdom": "GB", "united-states": "US", uruguay: "UY", usa: "US", uzbekistan: "UZ",
  vanuatu: "VU", venezuela: "VE", vietnam: "VN",
  yemen: "YE",
  zambia: "ZM", zimbabwe: "ZW",
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
