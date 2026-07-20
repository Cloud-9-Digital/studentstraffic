type UniversityMediaInput = {
  slug: string;
  name: string;
  coverImageUrl?: string | null;
};

const stockImageHostnames = new Set(["picsum.photos"]);

function getImageHostname(url: string) {
  try {
    return new URL(url, "https://studentstraffic.local").hostname;
  } catch {
    return null;
  }
}

export function isStockUniversityImageUrl(url?: string | null) {
  if (!url) {
    return false;
  }

  const hostname = getImageHostname(url);
  return hostname ? stockImageHostnames.has(hostname) : false;
}

export function isRealUniversityImageUrl(url?: string | null) {
  return Boolean(url) && !isStockUniversityImageUrl(url);
}

export function getIndexableUniversityImageUrls(
  urls: Array<string | null | undefined>
) {
  const seen = new Set<string>();

  return urls.filter((url): url is string => {
    if (!url || !isRealUniversityImageUrl(url) || seen.has(url)) {
      return false;
    }

    seen.add(url);
    return true;
  });
}

export function getUniversityInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function getUniversityCoverImage(input: UniversityMediaInput) {
  if (!input.coverImageUrl || !isRealUniversityImageUrl(input.coverImageUrl)) {
    return null;
  }

  return {
    url: input.coverImageUrl,
    alt: `${input.name} campus overview`,
    caption: "Campus overview",
  };
}

// ISO 3166-1 alpha-2 codes for flagcdn.com.
// Keyed by the lowercase country slug used in the DB.
// Any slug not found here falls back to a simple hash-based lookup below.
const COUNTRY_FLAG_CODES: Record<string, string> = {
  // Asia / Central Asia
  afghanistan: "af", armenia: "am", azerbaijan: "az",
  bahrain: "bh", bangladesh: "bd", bhutan: "bt",
  cambodia: "kh", china: "cn", cyprus: "cy",
  georgia: "ge", "hong-kong": "hk", india: "in", indonesia: "id",
  iran: "ir", iraq: "iq", israel: "il",
  japan: "jp", jordan: "jo", kazakhstan: "kz",
  kuwait: "kw", kyrgyzstan: "kg", laos: "la",
  lebanon: "lb", malaysia: "my", maldives: "mv",
  mongolia: "mn", myanmar: "mm", nepal: "np",
  "north-korea": "kp", oman: "om", pakistan: "pk",
  palestine: "ps", philippines: "ph", qatar: "qa",
  "saudi-arabia": "sa", singapore: "sg", "south-korea": "kr",
  "sri-lanka": "lk", syria: "sy", taiwan: "tw",
  tajikistan: "tj", thailand: "th", "timor-leste": "tl",
  turkmenistan: "tm", "united-arab-emirates": "ae", uzbekistan: "uz",
  vietnam: "vn", yemen: "ye",
  // Europe
  albania: "al", andorra: "ad", austria: "at",
  belarus: "by", belgium: "be", "bosnia-and-herzegovina": "ba",
  bulgaria: "bg", croatia: "hr", "czech-republic": "cz",
  denmark: "dk", estonia: "ee", finland: "fi",
  france: "fr", germany: "de", greece: "gr",
  hungary: "hu", iceland: "is", ireland: "ie",
  italy: "it", kosovo: "xk", latvia: "lv",
  liechtenstein: "li", lithuania: "lt", luxembourg: "lu",
  malta: "mt", moldova: "md", monaco: "mc",
  montenegro: "me", netherlands: "nl", "north-macedonia": "mk",
  norway: "no", poland: "pl", portugal: "pt",
  romania: "ro", russia: "ru", "san-marino": "sm",
  serbia: "rs", slovakia: "sk", slovenia: "si",
  spain: "es", sweden: "se", switzerland: "ch",
  ukraine: "ua", "united-kingdom": "gb", uk: "gb",
  // Americas
  argentina: "ar", bolivia: "bo", brazil: "br",
  canada: "ca", chile: "cl", colombia: "co",
  "costa-rica": "cr", cuba: "cu", "dominican-republic": "do",
  ecuador: "ec", "el-salvador": "sv", guatemala: "gt",
  haiti: "ht", honduras: "hn", jamaica: "jm",
  mexico: "mx", nicaragua: "ni", panama: "pa",
  paraguay: "py", peru: "pe", "trinidad-and-tobago": "tt",
  uruguay: "uy", usa: "us", "united-states": "us", venezuela: "ve",
  // Africa
  algeria: "dz", angola: "ao", benin: "bj",
  botswana: "bw", "burkina-faso": "bf", burundi: "bi",
  cameroon: "cm", "cape-verde": "cv", "central-african-republic": "cf",
  chad: "td", comoros: "km", congo: "cg",
  "democratic-republic-of-congo": "cd", djibouti: "dj", egypt: "eg",
  "equatorial-guinea": "gq", eritrea: "er", ethiopia: "et",
  gabon: "ga", gambia: "gm", ghana: "gh",
  guinea: "gn", "guinea-bissau": "gw", "ivory-coast": "ci",
  kenya: "ke", lesotho: "ls", liberia: "lr",
  libya: "ly", madagascar: "mg", malawi: "mw",
  mali: "ml", mauritania: "mr", mauritius: "mu",
  morocco: "ma", mozambique: "mz", namibia: "na",
  niger: "ne", nigeria: "ng", rwanda: "rw",
  senegal: "sn", "sierra-leone": "sl", somalia: "so",
  "south-africa": "za", "south-sudan": "ss", sudan: "sd",
  swaziland: "sz", tanzania: "tz", togo: "tg",
  tunisia: "tn", uganda: "ug", zambia: "zm", zimbabwe: "zw",
  // Oceania
  australia: "au", fiji: "fj", "new-zealand": "nz",
  "papua-new-guinea": "pg", samoa: "ws", "solomon-islands": "sb",
  tonga: "to", vanuatu: "vu",
};

// Derives the ISO alpha-2 flag code from a country slug.
// Falls back to the slug itself (flagcdn.com ignores unknown codes gracefully).
export function getCountryFlagCode(countrySlug: string): string {
  return COUNTRY_FLAG_CODES[countrySlug] ?? countrySlug;
}

// Country-branded placeholder gradients — used when no cover image is available.
// Colors are loosely derived from each country's national palette.
const COUNTRY_GRADIENTS: Record<string, { from: string; to: string; text: string }> = {
  russia:     { from: "#6b1a1a", to: "#1a2e4a", text: "#fca5a5" },
  vietnam:    { from: "#8b1a1a", to: "#7c3a0a", text: "#fde68a" },
  georgia:    { from: "#7c1530", to: "#8b3a12", text: "#fecdd3" },
  kyrgyzstan: { from: "#a31c1c", to: "#2d3748", text: "#fca5a5" },
  uzbekistan: { from: "#0d6b61", to: "#1a2e5a", text: "#6ee7b7" },
  bangladesh: { from: "#145228", to: "#8b1a1a", text: "#bbf7d0" },
  italy:      { from: "#1a5c2e", to: "#8b1a1a", text: "#fef3c7" },
  germany:    { from: "#1a1a1a", to: "#8b1a1a", text: "#fde68a" },
  australia:  { from: "#1a2e4a", to: "#8b1a1a", text: "#bfdbfe" },
  uk:         { from: "#1a1a6b", to: "#8b1a1a", text: "#c7d2fe" },
  france:     { from: "#1a1a6b", to: "#8b1a1a", text: "#bfdbfe" },
};

// Deterministic fallback: hash the slug into a hue and produce a gradient.
function slugToGradient(slug: string): { from: string; to: string; text: string } {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const from = `hsl(${hue}, 55%, 22%)`;
  const to   = `hsl(${(hue + 40) % 360}, 50%, 28%)`;
  const text = `hsl(${(hue + 180) % 360}, 80%, 85%)`;
  return { from, to, text };
}

export function getCountryPlaceholder(countrySlug: string) {
  return COUNTRY_GRADIENTS[countrySlug] ?? slugToGradient(countrySlug);
}
