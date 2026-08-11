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
      // The converter is an indicative planning aid, not a trading quote.
      // Daily refresh avoids regenerating every country page each hour while
      // still displaying the provider's effective date beside the rate.
      next: { revalidate: 60 * 60 * 24 },
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
