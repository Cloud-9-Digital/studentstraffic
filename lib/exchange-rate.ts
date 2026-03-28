import "server-only";

const PRIMARY = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK = "https://latest.currency-api.pages.dev/v1/currencies";

export type ExchangeRateResult = {
  rate: number; // 1 INR = rate [targetCurrency]
  date: string;
} | null;

export async function getInrExchangeRate(
  targetCurrency: string
): Promise<ExchangeRateResult> {
  const to = targetCurrency.toLowerCase();

  async function fetchFrom(base: string): Promise<ExchangeRateResult> {
    const res = await fetch(`${base}/inr.json`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.inr?.[to];
    if (!rate) return null;
    return { rate, date: data.date as string };
  }

  try {
    return (await fetchFrom(PRIMARY)) ?? (await fetchFrom(FALLBACK));
  } catch {
    return null;
  }
}
