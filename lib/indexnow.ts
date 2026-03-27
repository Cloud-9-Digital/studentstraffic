import { env } from "@/lib/env";

export const indexNowKey = "41c071d78fa6ee664777ef8ed5c6b312";

export function getIndexNowKeyLocation() {
  return new URL(`/${indexNowKey}.txt`, env.siteUrl).toString();
}

export function buildIndexNowPayload(urlList: string[]) {
  return {
    host: new URL(env.siteUrl).host,
    key: indexNowKey,
    keyLocation: getIndexNowKeyLocation(),
    urlList,
  };
}
