export type WdomsCountryConfig = {
  slug: string;
  displayName: string;
  wdomsCountryName: string;
  wdomsCountryCode: string;
  landingPageSlug?: string;
};

export type ScrapedWdomsSchool = {
  schoolId: string;
  schoolName: string;
  cityName: string;
  schoolUrl: string;
};

export type ScrapedWdomsSchoolDetails = {
  schoolType?: string;
  operationalStatus?: string;
  yearInstructionStarted?: number;
  academicAffiliation?: string;
  clinicalFacilities?: string;
  clinicalTraining?: string;
  schoolWebsite?: string;
  mainAddress?: string;
  qualificationTitle?: string;
  curriculumDuration?: string;
  languageOfInstruction?: string;
  prerequisiteEducation?: string;
  foreignStudents?: string;
  entranceExam?: string;
};

export type WdomsUniversityLookupInput = {
  slug: string;
  name: string;
  city: string;
};

type WdomsUniversityLookupRecord = WdomsUniversityLookupInput & {
  comparableName: string;
  comparableCity: string;
};

type WdomsUniversityLookup = {
  records: WdomsUniversityLookupRecord[];
  bySlug: Map<string, WdomsUniversityLookupRecord[]>;
  byComparableName: Map<string, WdomsUniversityLookupRecord[]>;
};

const WDOMS_SEARCH_URL = "https://search.wdoms.org/";

const WDOMS_NAME_NOISE_TOKENS = new Set([
  "and",
  "at",
  "branch",
  "campus",
  "centre",
  "center",
  "city",
  "college",
  "department",
  "faculty",
  "for",
  "of",
  "school",
  "the",
]);

const WDOMS_CITY_NOISE_TOKENS = new Set(["city", "the"]);

const WDOMS_TOKEN_ALIASES: Record<string, string> = {
  st: "saint",
};

export const wdomsCountryConfigs: WdomsCountryConfig[] = [
  {
    slug: "russia",
    displayName: "Russia",
    wdomsCountryName: "Russian Federation",
    wdomsCountryCode: "785",
    landingPageSlug: "mbbs-in-russia",
  },
  {
    slug: "vietnam",
    displayName: "Vietnam",
    wdomsCountryName: "Viet Nam",
    wdomsCountryCode: "941",
    landingPageSlug: "mbbs-in-vietnam",
  },
  {
    slug: "georgia",
    displayName: "Georgia",
    wdomsCountryName: "Georgia",
    wdomsCountryCode: "406",
    landingPageSlug: "mbbs-in-georgia",
  },
  {
    slug: "kyrgyzstan",
    displayName: "Kyrgyzstan",
    wdomsCountryName: "Kyrgyzstan",
    wdomsCountryCode: "587",
    landingPageSlug: "mbbs-in-kyrgyzstan",
  },
  {
    slug: "uzbekistan",
    displayName: "Uzbekistan",
    wdomsCountryName: "Uzbekistan",
    wdomsCountryCode: "928",
  },
] as const;

export const wdomsCountryConfigBySlug = Object.fromEntries(
  wdomsCountryConfigs.map((config) => [config.slug, config]),
) as Record<string, WdomsCountryConfig>;

export const wdomsLandingPageSlugs = new Set(
  wdomsCountryConfigs
    .map((config) => config.landingPageSlug)
    .filter(Boolean) as string[],
);

export function getWdomsCountryConfig(slug: string) {
  return wdomsCountryConfigBySlug[slug] ?? null;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, "-")
    .replace(/&#8211;/g, "-")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripHtml(value: string) {
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, ", ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

function normalizeWdomsText(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const normalized = stripHtml(value).replace(/\s*,\s*,/g, ", ").trim();
  return normalized || undefined;
}

function getSchoolUrl(rawId: string) {
  return `https://search.wdoms.org/Home/SchoolDetail/F${rawId.padStart(7, "0")}`;
}

function parseTotalPages(html: string) {
  const match = html.match(/<input id="hdntotalcount" type="hidden" value="(\d+)"/i);
  return match ? Number(match[1]) : null;
}

function parseRows(html: string) {
  const rows: ScrapedWdomsSchool[] = [];
  const rowPattern =
    /<tr style="cursor: pointer">[\s\S]*?<td style="display: none">(\d+)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<td><a href="#" class="link">(.*?)<\/a><\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<\/tr>/gi;

  let match: RegExpExecArray | null;

  while ((match = rowPattern.exec(html)) !== null) {
    const rawId = match[1].trim();
    const schoolName = decodeHtml(match[3]);
    const cityName = decodeHtml(match[4]);

    if (!rawId || !schoolName || !cityName) {
      continue;
    }

    rows.push({
      schoolId: rawId,
      schoolName,
      cityName,
      schoolUrl: getSchoolUrl(rawId),
    });
  }

  return rows;
}

async function fetchWdomsPage(countryCode: string, pageNumber: number) {
  const body = new URLSearchParams({
    sCountryName: countryCode,
    sSchoolName: "",
    sCityName: "",
    sOperationFlag: "",
    iPageNumber: String(pageNumber),
    UN_MemberStatus: "Y",
    sWdomsFromAddedDate: "",
    sWdomsToAddedDate: "",
    sessionId: "",
  });

  const response = await fetch(WDOMS_SEARCH_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`WDOMS request failed for page ${pageNumber}: ${response.status}`);
  }

  return response.text();
}

async function fetchWithRetry(url: string, attempts = 3) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`WDOMS request failed: ${response.status}`);
      }

      return response.text();
    } catch (error) {
      lastError = error;

      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 600));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("WDOMS request failed.");
}

export async function scrapeWdomsSchools(countryCode: string) {
  const firstPageHtml = await fetchWdomsPage(countryCode, 1);
  const totalPages = parseTotalPages(firstPageHtml);

  if (!totalPages) {
    throw new Error("Could not determine the number of WDOMS result pages.");
  }

  const schools = new Map<string, ScrapedWdomsSchool>();

  for (const school of parseRows(firstPageHtml)) {
    schools.set(school.schoolId, school);
  }

  for (let pageNumber = 2; pageNumber <= totalPages; pageNumber += 1) {
    const html = await fetchWdomsPage(countryCode, pageNumber);
    for (const school of parseRows(html)) {
      schools.set(school.schoolId, school);
    }
  }

  return [...schools.values()].sort((left, right) =>
    left.schoolName.localeCompare(right.schoolName),
  );
}

function extractFieldBlock(html: string, label: string) {
  const pattern = new RegExp(
    `${escapeRegExp(label)}:\\s*</div>\\s*<div class="span8[^"]*">([\\s\\S]*?)</div>`,
    "i",
  );

  return html.match(pattern)?.[1];
}

function extractFieldText(html: string, label: string) {
  return normalizeWdomsText(extractFieldBlock(html, label));
}

function extractFieldNumber(html: string, label: string) {
  const value = extractFieldText(html, label);

  if (!value) {
    return undefined;
  }

  const match = value.match(/\d{4}/);
  return match ? Number(match[0]) : undefined;
}

function extractFieldLink(html: string, label: string) {
  const block = extractFieldBlock(html, label);

  if (!block) {
    return undefined;
  }

  const hrefMatch = block.match(/href="([^"]+)"/i);
  return hrefMatch?.[1];
}

export async function scrapeWdomsSchoolDetails(schoolId: string) {
  const html = await fetchWithRetry(
    `https://search.wdoms.org/Home/SchoolDetail/F${schoolId.padStart(7, "0")}`,
  );

  return {
    schoolType: extractFieldText(html, "School Type"),
    operationalStatus: extractFieldText(html, "Operational Status"),
    yearInstructionStarted: extractFieldNumber(html, "Year Instruction Started"),
    academicAffiliation: extractFieldText(html, "Academic Affiliation"),
    clinicalFacilities: extractFieldText(html, "Clinical Facilities"),
    clinicalTraining: extractFieldText(html, "Clinical Training"),
    schoolWebsite: extractFieldLink(html, "School Website(s)"),
    mainAddress: extractFieldText(html, "Main Address"),
    qualificationTitle: extractFieldText(html, "Qualification Title"),
    curriculumDuration: extractFieldText(html, "Curriculum Duration"),
    languageOfInstruction: extractFieldText(html, "Language of Instruction"),
    prerequisiteEducation: extractFieldText(html, "Prerequisite Education"),
    foreignStudents: extractFieldText(html, "Foreign Students"),
    entranceExam: extractFieldText(html, "Entrance Exam"),
  } satisfies ScrapedWdomsSchoolDetails;
}

function normalizeTokens(value: string, noiseTokens: Set<string>) {
  const cleaned = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  if (!cleaned) {
    return [] as string[];
  }

  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const rawToken of cleaned.split(/\s+/)) {
    const token = WDOMS_TOKEN_ALIASES[rawToken] ?? rawToken;

    if (!token || noiseTokens.has(token) || seen.has(token)) {
      continue;
    }

    seen.add(token);
    deduped.push(token);
  }

  return deduped;
}

export function getComparableWdomsName(value: string) {
  return normalizeTokens(value, WDOMS_NAME_NOISE_TOKENS).join(" ");
}

export function getComparableWdomsCity(value: string) {
  return normalizeTokens(value, WDOMS_CITY_NOISE_TOKENS).join(" ");
}

export function getWdomsSchoolRouteSlug(schoolName: string, schoolId: string) {
  return `${normalizeTokens(schoolName, new Set()).join("-")}-${schoolId.toLowerCase()}`;
}

function pushLookupRecord(
  map: Map<string, WdomsUniversityLookupRecord[]>,
  key: string,
  record: WdomsUniversityLookupRecord,
) {
  if (!key) {
    return;
  }

  const existing = map.get(key) ?? [];
  existing.push(record);
  map.set(key, existing);
}

export function buildWdomsUniversityLookup(
  universities: WdomsUniversityLookupInput[],
) {
  const records: WdomsUniversityLookupRecord[] = universities.map((university) => ({
    ...university,
    comparableName: getComparableWdomsName(university.name),
    comparableCity: getComparableWdomsCity(university.city),
  }));

  const bySlug = new Map<string, WdomsUniversityLookupRecord[]>();
  const byComparableName = new Map<string, WdomsUniversityLookupRecord[]>();

  for (const record of records) {
    pushLookupRecord(bySlug, record.slug, record);
    pushLookupRecord(
      bySlug,
      getComparableWdomsName(record.name).replace(/\s+/g, "-"),
      record,
    );
    pushLookupRecord(byComparableName, record.comparableName, record);
  }

  return {
    records,
    bySlug,
    byComparableName,
  } satisfies WdomsUniversityLookup;
}

function resolveMatch(
  candidates: WdomsUniversityLookupRecord[],
  comparableCity: string,
) {
  if (candidates.length === 0) {
    return null;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  const cityMatches = comparableCity
    ? candidates.filter((candidate) => candidate.comparableCity === comparableCity)
    : [];

  if (cityMatches.length === 1) {
    return cityMatches[0];
  }

  return null;
}

export function matchWdomsSchoolToUniversity(
  school: Pick<ScrapedWdomsSchool, "schoolName" | "cityName">,
  lookup: WdomsUniversityLookup,
) {
  const comparableName = getComparableWdomsName(school.schoolName);
  const comparableCity = getComparableWdomsCity(school.cityName);

  const directSlugMatch = resolveMatch(
    lookup.bySlug.get(comparableName.replace(/\s+/g, "-")) ?? [],
    comparableCity,
  );

  if (directSlugMatch) {
    return directSlugMatch;
  }

  const exactNameMatch = resolveMatch(
    lookup.byComparableName.get(comparableName) ?? [],
    comparableCity,
  );

  if (exactNameMatch) {
    return exactNameMatch;
  }

  const partialMatches = lookup.records.filter(
    (candidate) =>
      candidate.comparableName &&
      comparableName &&
      (candidate.comparableName.includes(comparableName) ||
        comparableName.includes(candidate.comparableName)),
  );

  return (
    resolveMatch(partialMatches, comparableCity) ??
    (partialMatches.length === 1 ? partialMatches[0] : null)
  );
}
