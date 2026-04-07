type StaticParam = Record<string, string>;

export function ensureNonEmptyStaticParams<T extends StaticParam>(
  params: T[],
  fallback: T,
) {
  return params.length > 0 ? params : [fallback];
}
