export const publicMediaHostname = "media.studentstraffic.com";

export function isR2PublicImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === publicMediaHostname &&
      !url.port && !url.username && !url.password && !url.search && !url.hash &&
      /^\/images\/owned\/v1\/[a-f0-9]{64}\.webp$/.test(url.pathname);
  } catch {
    return false;
  }
}
