import { JsonLd } from "@/components/shared/json-ld";
import { catalogReviewedAt } from "@/lib/content-governance";
import type { FinderProgram } from "@/lib/data/types";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getFaqStructuredData,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { formatInrApprox } from "@/lib/data/mbbs-country-lp";

import { LpCta } from "./lp-cta";
import { LpDeepDive } from "./lp-deep-dive";
import { LpDialogProvider } from "./lp-dialog";
import { LpEligibility } from "./lp-eligibility";
import { LpFaq } from "./lp-faq";
import { LpFooter } from "./lp-footer";
import { LpHeader } from "./lp-header";
import { LpHero } from "./lp-hero";
import { LpMobileCta } from "./lp-mobile-cta";
import { LpPathways } from "./lp-pathways";
import { LpProcess } from "./lp-process";
import { LpTrust } from "./lp-trust";
import { LpUniversities } from "./lp-universities";
import { LpWhyCountry } from "./lp-why-country";
import type { CountryLpConfig, CountryLpStats } from "./types";

type Props = {
  path: string;
  config: CountryLpConfig;
  stats: CountryLpStats;
  featuredPrograms: FinderProgram[];
};

export function CountryMbbsLandingPage({ path, config, stats, featuredPrograms }: Props) {
  const sourcePath = path;
  const reviewedAt = config.contentReviewedAt ?? catalogReviewedAt;

  return (
    <LpDialogProvider sourcePath={sourcePath} countryName={config.countryName}>
      <JsonLd
        data={getStructuredDataGraph([
          getBreadcrumbStructuredData([
            { name: "Home", path: "/" },
            { name: `MBBS in ${config.countryName}`, path: sourcePath },
          ]),
          getCollectionPageStructuredData({
            path: sourcePath,
            name: `MBBS in ${config.countryName} for Indian Students — Admission, Fees & Universities`,
            description: config.heroSubtext,
            datePublished: reviewedAt,
            dateModified: reviewedAt,
          }),
          featuredPrograms.length
            ? getProgramItemListStructuredData({
                path: sourcePath,
                name: `MBBS universities in ${config.countryName}`,
                programs: featuredPrograms,
              })
            : null,
          getFaqStructuredData(
            config.faqs.map((f) => ({ question: f.q, answer: f.a })),
            sourcePath,
          ),
        ])}
      />

      <LpHeader />
      <LpHero
        sourcePath={sourcePath}
        flag={config.flag}
        countryName={config.countryName}
        heroKicker={config.heroKicker}
        heroHeadlinePrefix={config.heroHeadlinePrefix}
        heroHeadlineHighlight={config.heroHeadlineHighlight}
        heroSubtext={config.heroSubtext}
        universityCount={stats.universityCount}
        minTotalInrLabel={formatInrApprox(stats.minTotalUsd)}
        maxTotalInrLabel={formatInrApprox(stats.maxTotalUsd)}
        durationYears={stats.durationYears}
      />
      <LpUniversities countryName={config.countryName} universities={stats.featured} />
      <LpWhyCountry
        countryName={config.countryName}
        whyIntro={config.whyIntro}
        comparisonRows={config.comparisonRows}
      />
      <LpDeepDive sections={config.deepDive} />
      <LpPathways countryName={config.countryName} />
      <LpEligibility countryName={config.countryName} documents={config.documents} />
      <LpProcess />
      <LpTrust countryName={config.countryName} testimonials={config.testimonials} />
      <LpFaq faqs={config.faqs} />
      <LpCta sourcePath={sourcePath} countryName={config.countryName} universityCount={stats.universityCount} />
      <LpFooter />
      <LpMobileCta />
    </LpDialogProvider>
  );
}
