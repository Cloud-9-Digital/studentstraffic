type RequestLike = {
  headers: {
    get(name: string): string | null;
  };
  url: string;
};

type RouteObservabilityOptions = {
  route: string;
  request: RequestLike;
  sampleRate?: number;
  extra?: Record<string, string | number | boolean | null | undefined>;
};

const botUserAgentPattern =
  /bot|crawl|crawler|spider|slurp|gpt|claude|perplexity|bingpreview|google-extended|facebookexternalhit|meta-externalagent/i;

function isBotUserAgent(userAgent: string) {
  return botUserAgentPattern.test(userAgent);
}

function shouldLogRequest(userAgent: string, sampleRate: number) {
  if (isBotUserAgent(userAgent)) {
    return true;
  }

  return sampleRate > 0 && Math.random() < sampleRate;
}

export function logPublicRouteRequest({
  route,
  request,
  sampleRate = 0,
  extra,
}: RouteObservabilityOptions) {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (!shouldLogRequest(userAgent, sampleRate)) {
    return;
  }

  const url = new URL(request.url);
  const referrer = request.headers.get("referer");

  console.info(
    "[route-observability]",
    JSON.stringify({
      route,
      pathname: url.pathname,
      query: url.search,
      userAgent,
      isBot: isBotUserAgent(userAgent),
      referrer,
      ...extra,
    }),
  );
}
