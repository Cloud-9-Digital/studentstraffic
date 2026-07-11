import Link from "next/link";

type LowFeeUniversity = {
  name: string;
  city: string;
  annualFeeUsd: number;
  sixYearTotalUsd: number;
  slug?: string;
  established?: number;
  highlights: string[];
};

const lowFeeUniversities: LowFeeUniversity[] = [
  {
    name: "Bashkir State Medical University",
    city: "Ufa",
    annualFeeUsd: 2800,
    sixYearTotalUsd: 16800,
    slug: "bashkir-state-medical-university",
    established: 1932,
    highlights: [
      "Lowest fees among established medical universities",
      "NMC & WHO approved",
      "English-medium MBBS available",
    ],
  },
  {
    name: "Kemerovo State Medical University",
    city: "Kemerovo",
    annualFeeUsd: 3200,
    sixYearTotalUsd: 19200,
    slug: "kemerovo-state-medical-university",
    established: 1955,
    highlights: [
      "Budget-friendly Siberian location",
      "Modern clinical facilities",
      "Strong international student support",
    ],
  },
  {
    name: "Sevastopol State University",
    city: "Sevastopol",
    annualFeeUsd: 3300,
    sixYearTotalUsd: 19800,
    highlights: [
      "One of the most affordable options",
      "Total package includes hostel",
      "official regulatory sources listed",
    ],
  },
  {
    name: "Crimea Federal University",
    city: "Simferopol",
    annualFeeUsd: 3500,
    sixYearTotalUsd: 21000,
    slug: "crimea-federal-university",
    highlights: [
      "Very competitive rates",
      "Modern campus infrastructure",
      "Indian mess facilities available",
    ],
  },
  {
    name: "Volgograd State Medical University",
    city: "Volgograd",
    annualFeeUsd: 3700,
    sixYearTotalUsd: 22200,
    slug: "volgograd-state-medical-university",
    established: 1935,
    highlights: [
      "Government-funded institution",
      "Nearly 90 years of medical education",
      "Excellent FMGE pass rates",
    ],
  },
  {
    name: "Smolensk State Medical University",
    city: "Smolensk",
    annualFeeUsd: 4200,
    sixYearTotalUsd: 25200,
    slug: "smolensk-state-medical-university",
    established: 1920,
    highlights: [
      "Century-old medical institution",
      "Close to European Russia",
      "Well-regarded among Indian students",
    ],
  },
];

type LowFeeUniversitiesShowcaseProps = {
  title?: string;
  description?: string;
  maxUniversities?: number;
  className?: string;
};

export function LowFeeUniversitiesShowcase({
  title = "Universities with the lowest MBBS fees in Russia",
  description = "Based on 2026 official fee structures, these Russian medical universities meet NMC guidelines and offer the most affordable tuition rates for Indian students.",
  maxUniversities = 6,
  className = "",
}: LowFeeUniversitiesShowcaseProps) {
  const universities = lowFeeUniversities.slice(0, maxUniversities);

  return (
    <section className={className}>
      <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Verified fees
      </div>

      <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      {/* Comparison Table */}
      <div className="mt-10 overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  University
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Location
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Annual Fee
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  6-Year Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Key Features
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {universities.map((uni, idx) => (
                <tr
                  key={uni.name}
                  className="transition hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        {uni.slug ? (
                          <Link
                            href={`/university/${uni.slug}`}
                            className="font-semibold text-foreground hover:text-accent hover:underline"
                          >
                            {uni.name}
                          </Link>
                        ) : (
                          <div className="font-semibold text-foreground">
                            {uni.name}
                          </div>
                        )}
                        {uni.established ? (
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            Est. {uni.established}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {uni.city}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-semibold text-foreground">
                      ${uni.annualFeeUsd.toLocaleString()}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      per year
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-semibold text-foreground">
                      ${uni.sixYearTotalUsd.toLocaleString()}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      tuition only
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {uni.highlights.slice(0, 2).map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <svg
            className="h-5 w-5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Important notes about these fees
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>
              Fees shown are tuition only. Add $500-$1,200/year for hostel, $1,000-$2,000/year for living expenses, and $150-$300/year for mandatory medical insurance.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>
              All universities listed offer English-medium MBBS programs and are recognized by NMC (National Medical Commission of India).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>
              Fees may increase 6-12% annually. We confirm the current fee notice with each university before presenting figures to families.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            <span>
              Exchange rates vary. USD amounts are approximate based on current RUB-USD conversion.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
