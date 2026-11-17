const pathPrefix = "/api/attachments/";
const filePattern = /^[a-f0-9]{64}\.(?:jpg|png|webp|gif|pdf)$/;

export type AttachmentKind = "application-photo" | "application-proof" | "guide-photo" | "lead-document";
export type AttachmentRoute = AttachmentKind | "guide-application-photo";

export function attachmentKey(kind: string, file: string) {
  if (!filePattern.test(file)) return;
  const bucketKind = kind === "guide-application-photo" ? "application-photo" : kind;
  if (bucketKind !== "application-photo" && bucketKind !== "application-proof" &&
      bucketKind !== "guide-photo" && bucketKind !== "lead-document") return;
  if ((bucketKind === "application-photo" || bucketKind === "guide-photo") && file.endsWith(".pdf")) return;
  return `protected/${bucketKind}/v1/${file}`;
}

export function attachmentUrl(siteUrl: string, kind: AttachmentRoute, file: string) {
  return new URL(`${pathPrefix}${kind}/${file}`, siteUrl).href;
}

export function guidePhotoFromApplication(photoUrl: string | null, siteUrl: string) {
  if (!photoUrl) return null;
  const prefix = new URL(`${pathPrefix}application-photo/`, siteUrl).href;
  if (!photoUrl.startsWith(prefix)) return photoUrl;
  const file = photoUrl.slice(prefix.length);
  return attachmentKey("application-photo", file) ? attachmentUrl(siteUrl, "guide-application-photo", file) : null;
}

export function isHostedAttachment(url: string) {
  return /^https?:\/\/[^/]+\/api\/attachments\//.test(url);
}
