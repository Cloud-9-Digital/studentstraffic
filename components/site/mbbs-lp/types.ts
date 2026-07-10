export type CountryLpProgram = {
  universityName: string;
  universitySlug: string;
  city: string;
  type: "Public" | "Private";
  durationYears: number;
  annualTuitionUsd: number;
  totalTuitionUsd: number;
  livingUsd: number;
  medium: string;
};

export type CountryLpStats = {
  universityCount: number;
  minTotalUsd: number;
  maxTotalUsd: number;
  durationYears: number;
  featured: CountryLpProgram[];
};

export type ComparisonRow = {
  aspect: string;
  india: string;
  abroad: string;
  abroadWins: boolean;
};

export type CountryLpFaq = {
  q: string;
  a: string;
};

export type CountryLpTestimonial = {
  name: string;
  state: string;
  detail: string;
  quote: string;
  /** Optional real photo — omit to show an initials avatar placeholder until one is available. */
  photoUrl?: string;
};

export type DeepDiveBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "callout"; tone: "warning" | "info"; text: string };

export type DeepDiveSection = {
  id: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  blocks: DeepDiveBlock[];
};

export type CountryLpConfig = {
  slug: string;
  countryName: string;
  flag: string;
  heroKicker: string;
  heroHeadlinePrefix: string;
  heroHeadlineHighlight: string;
  heroSubtext: string;
  whyIntro: string;
  comparisonRows: ComparisonRow[];
  documents?: string[];
  testimonials: CountryLpTestimonial[];
  faqs: CountryLpFaq[];
  /** ISO date this page's content was last substantively reviewed/updated. Falls back to catalogReviewedAt if omitted. */
  contentReviewedAt?: string;
  /** Optional long-form authority sections (policy context, curriculum, outcomes data, city/visa detail) rendered between the comparison table and the pathways section. */
  deepDive?: DeepDiveSection[];
};
